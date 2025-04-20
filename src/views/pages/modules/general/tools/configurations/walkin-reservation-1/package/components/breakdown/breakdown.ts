import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import TransactionAPI from "@/services/api/transaction";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import configStore from "@/stores/config";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
const resourceAPI = new ConfigurationResource("PackageBreakdown");
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    CSelect,
    CInput,
    AgGridVue,
    SearchFilter,
    CRadio,
  },
  props: {
    isSaving: {
      type: Boolean,
    },
  },
  // watch: {
  //   hideButton(val) {
  //     console.log(val);
  //   }
  // }
})
export default class Breakdown extends Vue {
  private config = configStore();
  public rowData: any = [];
  public form: any = reactive({});
  public code: string = null;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public disableForm: boolean = false;
  public hideButton: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  focus: boolean = false;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  listDropdown = {};
  searchOptions: any = [];
  isSaving: boolean;

  // Ag grid variable
  gridOptions: any = {};
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
  folioNumber: any;
  global: any;
  subGroupCode: any = "";
  // GENERAL FUNCTION ================================================================

  onGridReady() {
    //
  }

  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  // ------------------------additional for context menu ag-Grid-----------//

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
        action: () => this.handleShowForm("", $global.modeData.insert),
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
        action: () => this.trackingData(this.paramsData),
      },
    ];
    return result;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

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

  handleClose() {
    this.showForm = false;
    this.$emit("hideButton");
  }

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      amount: 0,
      charge_frequency_code: "1",
      extra_pax: 0,
      include_child: 0,
      is_amount_percent: 0,
      max_pax: 1,
      package_code: this.code,
      per_pax: 0,
      per_pax_extra: 0,
      quantity: 1,
      sub_department_code: this.sdFrontOffice,
    };
  }

  refreshData() {
    // this.loadData();
  }

  initialize(code: string) {
    this.code = code;
    // this.loadData();
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeAccount(event: any) {
    const code = event.target.value;
    this.getAccountSubGroup(code);
  }

  onChangePerPax() {
    this.form.max_pax = 1;
    if (this.form.per_pax) {
      this.form.max_pax = 1000;
      this.form.quantity = 1;
    } else {
      this.form.include_child = 0;
    }
  }

  async handleShowForm(params: any, mode: any) {
    await this.$nextTick(() => {
      this.resetForm();
      this.loadDropdown();
      this.modeData = mode;
      this.showForm = true;
    });
    setInputFocus();
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  async handleEdit(params: any) {
    this.onChangePerPax();
    this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
    this.getAccountSubGroup(this.form.account_code);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
  }

  handleSave() {
    this.form.amount = parseFloat(this.form.amount);
    this.form.quantity = parseFloat(this.form.quantity);
    this.form.extra_pax = parseFloat(this.form.extra_pax);
    this.form.max_pax = parseFloat(this.form.max_pax);
    this.form.is_amount_percent = parseFloat(this.form.is_amount_percent);
    if (this.modeData == $global.modeData.insert) {
      this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(this.form);
    } else if (this.modeData == $global.modeData.duplicate) {
      this.insertData(this.form);
    }
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async getAccountSubGroup(code: any) {
    if (!code) return;
    this.subGroupCode = "";
    try {
      const { data } = await transactionAPI.getAccountSubGroupByAccountCode1(
        code
      );
      this.subGroupCode = data;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(form: any) {
    try {
      const { status2 } = await resourceAPI.update(form);
      if (status2.status == 0) {
        // this.loadData();
        this.showForm = false;
        this.$emit("save");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(form: any) {
    try {
      const { status2 } = await resourceAPI.create(form);
      if (status2.status == 0) {
        this.showForm = false;
        this.$emit("save");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const params = [
        "SubDepartment",
        "Account",
        "BusinessSource",
        "TaxAndService",
        "ChargeFrequency",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        // this.loadData();
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
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.type"), value: 2 },
      { text: this.$t("commons.filter.createdBy"), value: 3 },
      { text: this.$t("commons.filter.updatedBy"), value: 4 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        duplicate: true,
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      // {
      //   headerName: this.$t("commons.table.outlet"),
      //   field: "OutletName",
      //   width: 150,
      // },
      // {
      //   headerName: this.$t("commons.table.product"),
      //   field: "ProductName",
      //   width: 150,
      // },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "SubDepartmentName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.businessSource"),
        field: "CompanyName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.isAmountPercent"),
        field: "is_amount_percent",
        width: 125,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.perPax"),
        field: "per_pax",
        width: 80,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.includeChild"),
        field: "include_child",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.taxAndService"),
        field: "TaxAndServiceName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.frequency"),
        field: "FrequencyName",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.maxPax"),
        field: "max_pax",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.extraPax"),
        field: "extra_pax",
        width: 90,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.perPaxExtra"),
        field: "per_pax_extra",
        width: 100,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
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
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      "Sub Department": Yup.string().required(),
      Account: Yup.string().required(),
      Quantity: Yup.number().required().min(1),
      Amount: Yup.number().required().min(1),
      "Charge Frequency": Yup.string().required(),
      "Tax & Service": Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
