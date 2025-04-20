import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import Select from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import MultiForm from "./components/multi-form/multi-form.vue";
import Breakdown from "./components/breakdown/breakdown.vue";
import BusinessSource from "./components/business-source/business-source.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import DetailCellRender from "./components/detail-cell-renderer/detail-cell-renderer.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { GetCellRendererInstancesParams } from "ag-grid-community/dist/lib/gridApi";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Package");

@Options({
  components: {
    CDialog,
    MultiForm,
    Breakdown,
    BusinessSource,
    Select,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class Package extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public multiFormElement: any = ref();
  public breakdownFormElement: any = ref();
  public businessSourceFormElement: any = ref();
  public showForm: boolean = false;
  public hideButton: boolean = false;
  public showFormBreakdown: boolean = false;
  public showDialog: boolean = false;
  public isSave: boolean;
  isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  searchOptions: any = [];
  isLoading: boolean = false;
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
  folioNumber: any;
  global: any;
  refresh: any;
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
        action: () =>
          this.handleTrackingData(
            $global.tableName.cfgInitPackage,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  saveData(val: any) {
    this.loadData();
    this.hideButton = false;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  handleClose() {
    this.showForm = false;
    this.hideButton = this.showForm;
  }

  hiddenButton() {
    this.hideButton = false;
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  handleShowForm(params: any, mode: any) {
    this.multiFormElement.initialize();
    this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
    this.hideButton = true;
    this.businessSourceFormElement.showForm = false;
    this.breakdownFormElement.showForm = false;
    // set focus
    this.multiFormElement.focus = true;
  }

  handleInsertDetail1(paramsData: any) {
    this.showForm = false;
    this.hideButton = true;
    this.businessSourceFormElement.showForm = false;
    this.breakdownFormElement.code = paramsData.code;
    this.breakdownFormElement.handleShowForm("", $global.modeData.insert);
    // set focus
    this.multiFormElement.focus = false;
    this.breakdownFormElement.focus = true;
  }

  handleInsertDetail2(paramsData: any) {
    this.showForm = false;
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.code = paramsData.code;
    this.businessSourceFormElement.handleShowForm("", $global.modeData.insert);
    // set focus
    this.multiFormElement.focus = false;
    this.breakdownFormElement.focus = false;
    this.businessSourceFormElement.focus = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.businessSourceFormElement.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.loadDropdown();
    await this.editData(params.code);
  }

  async handleDuplicate(params: any) {
    this.businessSourceFormElement.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.code);
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    formData.amount = parseFloat(formData.amount);
    formData.per_pax_extra = parseFloat(formData.per_pax_extra);
    formData.quantity = parseInt(formData.quantity);
    formData.max_pax = parseInt(formData.max_pax);
    formData.extra_pax = parseFloat(formData.extra_pax);
    formData.extra_pax = parseFloat(formData.extra_pax);
    this.form.show_in_transaction = parseInt(this.form.show_in_transaction);
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    }
    this.isSaving = false;
    this.hideButton = false;
  }

  async handleEditBusiness(params: any) {
    this.showForm = false;
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.businessSourceFormElement.handleEdit(params);
  }

  async handleEditBreakdown(params: any) {
    this.showForm = false;
    this.hideButton = true;
    this.businessSourceFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.breakdownFormElement.handleEdit(params);
  }

  async handleDuplicateBusiness(params: any) {
    this.showForm = false;
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.modeData = $global.modeData.duplicate;
    this.businessSourceFormElement.handleDuplicate(params);
  }

  async handleDuplicateBreakdown(params: any) {
    this.showForm = false;
    this.hideButton = true;
    this.businessSourceFormElement.showForm = false;
    this.modeData = $global.modeData.duplicate;
    this.breakdownFormElement.handleDuplicate(params);
  }

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    const selectedRow = this.gridApi.getSelectedRows();
    this.gridApi.showLoadingOverlay();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async loadDetailData(code: string) {
    this.gridApi.showLoadingOverlay();
    let result = [];
    try {
      const { data } = await resourceAPI.detailDataList("Package", code);
      result = data;
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
    return result;
  }

  async loadDropdown() {
    try {
      const params = [
        "SubDepartment",
        "Account",
        "TaxAndService",
        "ChargeFrequency",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.multiFormElement.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.multiFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.multiFormElement.onEdit(data);
      this.form.code = data.code;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      formData.code = this.form.code;
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    this.isLoading = true;
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
    this.isLoading = false;
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      index: 1,
      text: "",
    };
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      // { text: this.$t("commons.filter.outlet"), value: 2 },
      // { text: this.$t("commons.filter.product"), value: 3 },
      { text: this.$t("commons.filter.subDepartment"), value: 2 },
      { text: this.$t("commons.filter.account"), value: 3 },
      { text: this.$t("commons.filter.taxAndService"), value: 4 },
      { text: this.$t("commons.filter.chargeFrequency"), value: 5 },
      { text: this.$t("commons.filter.createdBy"), value: 6 },
      { text: this.$t("commons.filter.updatedBy"), value: 7 },
    ];
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
        insertDetail2: {
          title: "Insert Business Source & AP List",
        },
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
        field: "code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 170,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.code"),
        field: "code",
        cellRenderer: "agGroupCellRenderer",
        width: 120,
      },
      { headerName: this.$t("commons.table.name"), field: "name", width: 150 },
      // { headerName: this.$t("commons.table.outlet"), field: "outlet", width: 150 },
      // { headerName: this.$t("commons.table.product"), field: "product", width: 150 },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "DepartmentName",
        width: 180,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.qty"),
        field: "quantity",
        width: 50,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
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
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.includeChild"),
        field: "include_child",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
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
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.online"),
        field: "is_online",
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.showInTransaction"),
        field: "show_in_transaction",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
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
        width: 80,
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
        width: 80,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
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
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: Checklist,
      iconLockRenderer: IconLockRenderer,
      detailCellRenderer: DetailCellRender,
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
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required().max(100),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required()
        .max(10),
      "Sub Department": Yup.string().required(),
      Account: Yup.string().required(),
      Quantity: Yup.number().required().min(1),
      Amount: Yup.number().required().min(1),
      "Tax & Service": Yup.string().required(),
      "Charge Frequency": Yup.string().required(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
