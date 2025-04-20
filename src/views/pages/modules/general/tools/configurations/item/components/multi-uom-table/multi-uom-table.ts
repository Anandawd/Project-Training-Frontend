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
import { reactive, ref } from "vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Item");

@Options({
  components: {
    Form,
    CCheckbox,
    // InputForm,
    AgGridVue,
  },
  props: {
    rowData: {
      type: Array,
      default: [],
    },
  },
})
export default class Breakdown extends Vue {
  public rowData: any = [];
  public code: string;
  public form: any = reactive({});
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
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
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.invCfgInitItemUom,
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

  refreshData(search: any) {
    this.loadData();
  }

  initialize(code: string) {
    this.code = code;
    this.loadData();
    // this.resetForm();
  }

  handleInsert() {
    this.$emit("insert");
  }

  handleEdit(params: any) {
    this.$emit("edit", params);
  }

  handleDelete(params: any) {
    this.$emit("delete", params);
  }

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData() {
    try {
      const { data } = await resourceAPI.detailDataList("Item", this.code);
      // this.rowData = data.PackageBreakdown
    } catch (error) {}
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
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.uom"),
        field: "name",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 80,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.purchasePrice"),
        field: "purchase_price",
        width: 120,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.sellPrice"),
        field: "sell_price",
        width: 100,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.barcode"),
        field: "barcode",
        width: 150,
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
