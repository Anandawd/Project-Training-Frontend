import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
// import InputForm from "@/components/input-form/input-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
const resourceAPI = new ConfigurationResource("Package");
const APIPackageBreakdown = new ConfigurationResource("PackageBreakdown");

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    AgGridVue,
  },
  // props: ['params'],
  // props: {
  //   rowData: {
  //     type: Array,
  //     // default: [],
  //   },
  // },
})
export default class Breakdown extends Vue {
  public rowData: any = [];
  // public params: any;
  public code: string;
  public form: any = reactive({});
  public breakdownElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
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
        action: () =>
          this.handleTrackingData(
            $global.tableName.cfgInitPackageBreakdown,
            this.paramsData.id
          ),
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

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  refreshData(search: any) {
    // this.loadData();
    this.loadData(this.code);
  }

  initialize(code: string) {
    this.code = code;
    this.loadData(this.code);
    // this.resetForm();
  }

  handleInsert() {
    this.$emit("insertBreakdown");
  }

  handleEdit(params: any) {
    this.$emit("editBreakdown", params);
  }
  handleDuplicate(params: any) {
    this.$emit("duplicateBreakdown", params);
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
    // this.$emit('delete',params)
  }

  handleTrackingData(tableName: number, id: number) {
    const params = {
      tableName: tableName,
      id: id,
    };
    this.$emit("trackingData", params);
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(code: any) {
    this.gridApi.showLoadingOverlay();
    this.code = code;
    try {
      const { data } = await resourceAPI.detailDataList("Package", code);
      this.rowData = data.PackageBreakdown;
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async deleteData() {
    try {
      const { status2 } = await APIPackageBreakdown.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadData(this.code);
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
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
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
        width: 120,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
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
  // END GETTER AND SETTER ===========================================================
}
