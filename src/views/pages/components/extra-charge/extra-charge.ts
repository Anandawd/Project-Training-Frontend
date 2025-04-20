import { Options, Vue, prop } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import BreakdownForm from "./components/breakdown/breakdown.vue";
import { BDropdown, BDropdownItem } from "bootstrap-vue-3";
import { Form } from "vee-validate";
import * as Yup from "yup";
//component ag-grid
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import $global from "@/utils/global";
import { formatDateTime, formatNumber } from "@/utils/format";
import { reactive, ref } from "vue";
import ExtraChargeAPI from "@/services/api/hotel/reservation/extra-charge";
import { focusOnInvalid } from "@/utils/validation";
import DetailCellRender from "./components/detail-cell-renderer/detail-cell-renderer.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { getToastSuccess } from "@/utils/toast";
import ConfigStore from "@/stores/config";
import Credential from "../credential/credential.vue";
import CDialog from "@/components/dialog/dialog.vue";
const extraChargeAPI = new ExtraChargeAPI();
const configStore = ConfigStore();

@Options({
  components: {
    CSelect,
    CInput,
    Credential,
    CCheckbox,
    AgGridVue,
    BDropdown,
    BDropdownItem,
    BreakdownForm,
    CDialog,
    Form,
  },
  props: {
    userAccess: Object,
    isReservation: {
      type: Boolean,
      default: false,
    },
    idData: Object,
  },
})
export default class ExtraCharge extends Vue {
  public rowData: any = [];
  public idData: any = {};
  modeData: number;
  titleForBreakdown: string;
  public showForm: boolean = false;
  public mode: string | number = 0;
  public isReservation: boolean = false;
  showDialog: any = false;
  deleteId: any;
  selectedAcc: string;
  extraChargeValidation: any = ref();
  breakdownFormElement: any = ref();
  packageValidation: any = ref();
  reservationNumber: number = 0;
  folioNumber: number = 0;
  public form: any = reactive({});
  public packageForm: any = reactive({});
  public options: any = {};
  isSaving: boolean = false;
  isDisabledPerPax: boolean = true;
  isDisabledQuantity: boolean = false;
  hidePackage: boolean = false;
  columnOptionsAccount = [
    {
      label: "code",
      field: "code",
      align: "left",
      width: "100",
    },
    {
      label: "name",
      field: "name",
      align: "left",
      width: "120",
    },
  ];
  titleNumber: number;
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  gridOptions: any = {};
  detailCellRenderer: any;
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;
  global: any;
  rowClassRules: any;
  public bottomRowTotal: any;
  total: any;
  credentialElement: any = null;
  // GENERAL FUNCTION ================================================================
  async initialize(number: any) {
    if (this.isReservation) {
      this.reservationNumber = parseInt(number);
    } else {
      this.folioNumber = parseInt(number);
    }
    await this.loadData();
    this.breakdownFormElement.titleNumber = parseInt(number);
  }

  handelInsertPackage() {
    this.packageValidation.$el.requestSubmit();
  }

  onPageSizeChanged(newPageSize: number) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleInsert(),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.handleTracking(),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  onSubmit() {
    this.extraChargeValidation.$el.requestSubmit();
  }

  onClose() {
    this.showForm = false;
    this.hidePackage = false;
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onInvalidSubmitPackage() {
    focusOnInvalid();
  }

  onChangePerPax() {
    this.form.quantity = 1;
    this.isDisabledQuantity = this.form.per_pax == 1 ? true : false;
    this.isDisabledPerPax = this.form.per_pax == 1 ? false : true;
  }

  refreshAfterSave() {
    this.loadData();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleSave() {
    this.form.number = !this.isReservation
      ? this.folioNumber
      : this.reservationNumber;
    this.form.quantity = parseFloat(this.form.quantity);
    this.form.amount = parseFloat(this.form.amount);
    this.form.extra_pax = parseFloat(this.form.extra_pax);
    this.form.max_pax = parseInt(this.form.max_pax);
    this.form.per_pax = parseInt(this.form.per_pax);
    this.form.include_child = parseInt(this.form.include_child);
    this.isSaving = true;
    if (
      this.modeData == $global.modeData.insert ||
      this.modeData == $global.modeData.duplicate
    ) {
      this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(this.form);
    }
    this.isSaving = false;
  }

  async handleExtraChargeeAccess() {
    this.credentialElement.showCredential({
      show: true,
      title: this.$t("credential.title.modifyExtraCharge"),
      accessMode: $global.frontDeskAccessOrder.accessSpecial.modifyExtraCharge,
      accessType: $global.userAccessType.special,
      onVerified: () => {
        this.insertPackage(this.packageForm);
      },
    });
  }

  handleSavePackage() {
    this.packageForm.number = this.isReservation
      ? this.reservationNumber
      : this.folioNumber;
    this.handleExtraChargeeAccess();
  }

  async handleInsert() {
    this.hidePackage = true;
    this.breakdownFormElement.showForm = false;
    this.resetForm();
    await this.$nextTick(() => {
      this.loadDropdown();
    });
    this.modeData = $global.modeData.insert;
    this.showForm = true;
  }

  async handleDuplicate(param: any) {
    this.hidePackage = true;
    this.resetForm();
    this.modeData = $global.modeData.duplicate;
    await this.$nextTick(() => {
      this.loadDropdown();
      this.editData(param.id);
    });
  }

  async handleEdit(param: any) {
    this.hidePackage = true;
    this.breakdownFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.resetForm();
    await this.$nextTick(() => {
      this.loadDropdown();
      this.editData(param.id);
    });
  }

  async handleInsertDetail1(params: any) {
    this.hidePackage = true;
    this.loadDropdown();
    await this.breakdownFormElement.initialize(params);
    this.breakdownFormElement.handleInsert(params, $global.modeData.insert);
    this.showForm = false;
  }

  async handleEditBreakdown(params: any) {
    this.hidePackage = true;
    this.loadDropdown();
    await this.breakdownFormElement.initialize(params);
    this.breakdownFormElement.handleEdit(params, $global.modeData.edit);
    this.modeData = $global.modeData.edit;
    this.showForm = false;
  }

  async handleDuplicateBreakdown(params: any) {
    this.hidePackage = true;
    this.loadDropdown();
    await this.breakdownFormElement.initialize(params);
    this.breakdownFormElement.handleDuplicate(
      params,
      $global.modeData.duplicate
    );
    this.showForm = false;
  }

  onCloseFormBreakdown() {
    this.hidePackage = false;
  }

  handleTracking() {
    //
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.form.idLog = selectedRows[0].id_log;
  }

  resetForm() {
    this.form = {
      amount: 0,
      quantity: 1,
      extra_pax: 0,
      max_pax: 1,
      per_pax: 0,
      include_child: 0,
      sub_department_code: this.dvSubDepartment,
      charge_frequency_code: "1",
      group_code: "A",
    };
  }

  resetFormPackage() {
    this.packageForm = {
      sub_folio_group_code: "A",
      package_code: "",
    };
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteId = params.id;
  }

  onChangeAccount() {
    for (const i of this.options.Account) {
      if (this.form.account_code == i.code) {
        this.selectedAcc = i.name;
      }
    }
  }

  async onChangeOutlet(ev: any) {
    await this.loadDropdownProductByOutlet(ev.target.value);
    const data = this.options.Outlet;
    const selectedDepartment = data.find((val: any) => {
      return val.code == ev.target.value;
    });
    this.form.sub_department_code = selectedDepartment.sub_department_code;
  }

  onChangeProduct(ev: any) {
    const data = this.options.Product;
    const selectedProduct = data.find((val: any) => {
      return val.code == ev.target.value;
    });
    this.form.account_code = selectedProduct.account_code;
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData() {
    const selectedRow = this.gridApi.getSelectedRows();
    this.gridApi.showLoadingOverlay();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      const number = this.isReservation
        ? this.reservationNumber
        : this.folioNumber;
      const { data } = this.isReservation
        ? await extraChargeAPI.GetExtraChargeReservationList(number)
        : await extraChargeAPI.GetExtraChargeInHouseList(number);
      this.rowData = data ?? [];
      this.$emit("getExtraCharge", this.rowData);

      rowSelectedAfterRefresh(this, null, selectedRow[0], "id", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  public async loadDropdown() {
    try {
      let params = [
        "Outlet",
        "SubDepartment",
        "BusinessSource",
        "Account",
        "TaxAndService",
        "ChargeFrequency",
        "SubFolioGroup",
        "Package",
      ];
      const { data } = await extraChargeAPI.codeNameListArray(params);
      this.options = data;
      this.breakdownFormElement.options = data;
    } catch (error: any) {
      throw getError(error);
    }
  }

  async loadDropdownProductByOutlet(code: any) {
    try {
      const { data } = await extraChargeAPI.GetPOSProductByOutlet(code);
      this.options.Product = data;
    } catch (err: any) {
      getError(err);
    }
  }

  async editData(id: any) {
    try {
      const { data } = this.isReservation
        ? await extraChargeAPI.GetExtraChargeReservation(id)
        : await extraChargeAPI.GetExtraChargeInHouse(id);
      this.form = data;
      this.showForm = true;
    } catch (error) {
      throw getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = this.isReservation
        ? await extraChargeAPI.InsertExtraChargeReservation(formData)
        : await extraChargeAPI.InsertExtraChargeInHouse(formData);
      if (status2.status == 0) {
        this.showForm = false;
        this.loadData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      throw getError(error);
    }
  }

  async insertPackage(formData: any) {
    try {
      const { status2 } = this.isReservation
        ? await extraChargeAPI.InsertExtraChargePackageReservation(formData)
        : await extraChargeAPI.InsertExtraChargePackageInHouse(formData);
      if (status2.status == 0) {
        this.resetFormPackage();
        this.loadData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      throw getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = this.isReservation
        ? await extraChargeAPI.UpdateExtraChargeReservation(formData)
        : await extraChargeAPI.UpdateExtraChargeInHouse(formData);
      if (status2.status == 0) {
        this.showForm = false;
        this.loadData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      throw getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = this.isReservation
        ? await extraChargeAPI.DeleteExtraChargeReservation(this.deleteId)
        : await extraChargeAPI.DeleteExtraChargeInHouse(this.deleteId);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
        insertDetail1: {
          title: "Insert Breakdown",
        },
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 130,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("transaction.table.package"),
        field: "package_name",
        cellRenderer: "agGroupCellRenderer",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.outlet"),
        field: "Outlet",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.product"),
        field: "Product",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.subFolio"),
        field: "group_code",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.subDepartment"),
        field: "Department",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.account"),
        field: "Account",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.quantity"),
        field: "quantity",
        width: 100,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.amount"),
        field: "amount",
        width: 100,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.perPax"),
        field: "per_pax",
        width: 80,
        headerClass: "align-header-center ",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.includeChild"),
        field: "include_child",
        width: 100,
        headerClass: "align-header-center ",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("transaction.table.taxAndService"),
        field: "TaxAndService",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.chargeFrequency"),
        field: "ChargeFrequency",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.maxPax"),
        field: "max_pax",
        width: 100,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 150,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      detailCellRenderer: DetailCellRender,
      checklistRenderer: Checklist,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = $global.agGrid.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted(): void {
    this.resetForm();
    this.resetFormPackage();
    this.loadDropdown();
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get auditDate() {
    return configStore.auditDate;
  }
  get sdFrontOffice() {
    return configStore.sdFrontOffice;
  }
  get dvSubDepartment() {
    return configStore.dvSubDepartment;
  }
  get defaultCurrency() {
    return configStore.defaultCurrency;
  }
  get cashAccount() {
    return configStore.cash;
  }
  get disabledActionGrid() {
    return this.showForm || this.breakdownFormElement.showForm;
  }

  // Validation
  get schema() {
    return Yup.object().shape({
      "Sub Department": Yup.string().required(),
      Account: Yup.string().required(),
      Quantity: Yup.number().required(),
      Amount: Yup.number()
        .required()
        .test((val) => {
          return val > 0;
        }),
      "Sub Folio": Yup.string().required(),
      "Charge Frequency": Yup.string().required(),
      "Max Pax": Yup.number(),
      "Extra Pax": Yup.number(),
    });
  }

  get schemaPackage() {
    return Yup.object().shape({
      "Sub Folio": Yup.string().required(),
    });
  }

  get title() {
    if (this.isReservation) {
      if (this.modeData === $global.modeData.insert) {
        return `${this.$t("commons.insert")} ${this.$t(
          "title.extraCharge"
        )} ${this.$t(":#")} ${this.reservationNumber}`;
      } else if (this.modeData === $global.modeData.edit) {
        return `${this.$t("commons.update")} ${this.$t(
          "title.extraCharge"
        )} ${this.$t(":#")} ${this.reservationNumber}`;
      } else if (this.modeData === $global.modeData.duplicate) {
        return `${this.$t("commons.duplicate")} ${this.$t(
          "title.extraCharge"
        )} ${this.$t(":#")} ${this.reservationNumber}`;
      }
    } else {
      if (this.modeData === $global.modeData.insert) {
        return `${this.$t("commons.insert")} ${this.$t(
          "title.extraCharge"
        )} ${this.$t(":#")} ${this.folioNumber}`;
      } else if (this.modeData === $global.modeData.edit) {
        return `${this.$t("commons.update")} ${this.$t(
          "title.extraCharge"
        )} ${this.$t(":#")} ${this.folioNumber}`;
      } else if (this.modeData === $global.modeData.duplicate) {
        return `${this.$t("commons.duplicate")} ${this.$t(
          "title.extraCharge"
        )} ${this.$t(":#")} ${this.folioNumber}`;
      }
    }
  }
  // END GETTER AND SETTER ===========================================================
}
