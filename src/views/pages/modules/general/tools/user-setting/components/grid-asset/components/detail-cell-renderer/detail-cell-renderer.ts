import { ref, computed } from "vue";
import { Options, Vue } from "vue-class-component";
import "ag-grid-enterprise";

import { formatDateTime } from "@/utils/format";
import { AgGridVue } from "ag-grid-vue3";
import $global from "@/utils/global";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";

@Options({
  components: {
    AgGridVue,
    ActionGrid,
  },
})
export default class DetailCellRenderer extends Vue {
  searchOptions: any = [];
  rowData: any = [];
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

  // GENERAL FUNCTION ================================================================

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleShowForm(params: any, modeData: any) {}
  handleDelete(param: any) {}

  getContextMenu(params: any) {
    // this.onSelectionChanged()
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    // if(node.data.is_active == 1) {
    //   this.isActive = true
    // } else {
    //   this.isActive = false
    // }

    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
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
        action: () => this.handleShowForm(this.paramsData, 2),
      },
    ];
    return result;
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

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

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
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
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
        width: 90,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "sub_department",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.dhPrAppr"),
        field: "is_active",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.ccPrAppr"),
        field: "is_active",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.finalPrAppr"),
        field: "is_active",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.assgnPricePr"),
        field: "is_active",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.dhSrAppr"),
        field: "is_active",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.finalSrAppr"),
        field: "is_active",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
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

    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      // iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
      statusBarTotalRenderer: StatusBarTotalRenderer,
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
    this.rowData = [
      {
        id: 1,
        sub_department: "sss",
        is_active: 1,
      },
      {
        id: 2,
        sub_department: "sss",
        is_active: 0,
      },
    ];
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
