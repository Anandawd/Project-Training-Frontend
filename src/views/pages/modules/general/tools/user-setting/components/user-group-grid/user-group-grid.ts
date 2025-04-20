import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import { formatDateTime } from "@/utils/format";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CRadio from "@/components/radio/radio.vue";
import UserSettingAPI from "@/services/api/general/user-setting";
const userSettingAPI = new UserSettingAPI();

@Options({
  components: {
    AgGridVue,
    ActionGrid,
    BCard,
    BTabs,
    BTab,
    BCardText,
    // DetailCellRender,
    CRadio,
  },
  props: {
    rowData: Array,
  },
})
export default class UserGroupGrid extends Vue {
  public isActive: string = "1";
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
  showDialog: boolean = false;
  confirmDialog: () => void = null;

  // GENERAL FUNCTION ================================================================
  onGridReady() {
    //
  }

  onPageSizeChanged(newPageSize: any) {
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
      "separator",
      {
        name: this.isActive
          ? this.$t("commons.contextMenu.deactivate")
          : this.$t("commons.contextMenu.active"),
        disabled: !this.paramsData,
        // icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.handleShowForm(this.paramsData, 2),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
      },
    ];
    return result;
  }

  refreshData() {
    this.$emit("refreshData", this.isActive);
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  async handleInsert() {
    this.$emit("insert");
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.confirmDialog = () => {
      this.deleteUserGroupAccess(params.id);
    };
  }

  async handleEdit(params: any) {
    this.getUserGroupAccess(params.id);
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

  async getUserGroupAccess(id: number) {
    try {
      const { data } = await userSettingAPI.getUserGroupAccess(id);
      this.$emit("edit", data);
    } catch (error) {
      getError(error);
    }
  }

  async deleteUserGroupAccess(id: number) {
    try {
      await userSettingAPI.deleteUserGroupAccess(id);
      this.showDialog = false;
      this.refreshData();
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
        width: 110,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.code"),
        field: "code",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.accessLevel"),
        field: "AccessLevel",
        width: 100,
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
      checklistRenderer: Checklist,
      // detailCellRenderer: DetailCellRender,
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
    // console.log(this.rowData)
  }

  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
