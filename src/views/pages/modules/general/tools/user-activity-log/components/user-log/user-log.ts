import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
} from "@/utils/format";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import CSelect from "@/components/select/select.vue";
// import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import { getError } from "@/utils/general";
import UserActivityLogAPI from "@/services/api/general/user-activity-log";
const userActivityLogAPI = new UserActivityLogAPI();

@Options({
  components: {
    AgGridVue,
    ActionGrid,
    SearchFilter,
    CDatepicker,
    CSelect,
  },
})
export default class UserLogGrid extends Vue {
  public rowData: any = [];
  public actionGrid: boolean = false;
  search: any = {};
  filterComboList: any = {};
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
  refreshData() {
    this.loadDataUserLog();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataUserLog() {
    try {
      let params = {
        start_date: formatDateTimeZeroUTC(this.search.start_date),
        end_date: formatDateTimeZeroUTC(this.search.end_date),
        user_id: this.search.user_id,
        action_id: this.search.action_id,
      };
      const { data } = await userActivityLogAPI.userLog(params);
      this.rowData = data ?? [];
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.search = {
      start_date: formatDateTimeZeroUTC(new Date()),
      end_date: formatDateTimeZeroUTC(new Date()),
      user_id: "",
      action_id: "",
    };
    this.refreshData();
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "name",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.actualDate"),
        field: "actual_date",
        width: 130,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 80,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.ipAddress"),
        field: "ip_address",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.computerName"),
        field: "computer_name",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.dataLink") + "1",
        field: "data_link1",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.dataLink") + "2",
        field: "data_link2",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.dataLink") + "3",
        field: "data_link3",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 170,
      },
      {
        headerName: this.$t("commons.table.userId"),
        field: "created_by",
        width: 90,
      },
    ];

    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      // statusBarTotalRenderer: StatusBarTotalRenderer,
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
    this.ColumnApi = this.gridOptions.columnApi;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }

  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
