import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import CSelect from "@/components/select/select.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
} from "@/utils/format";
import { getError } from "@/utils/general";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
// import userActivityLog from "@/services/api/configuration/user-activity-log";
// const userActivityLogAPI = new userActivityLog();
import UserActivityLogAPI from "@/services/api/general/user-activity-log";
const userActivityLogAPI = new UserActivityLogAPI();

@Options({
  components: {
    AgGridVue,
    ActionGrid,
    CSelect,
    CDatepicker,
    SearchFilter,
  },
})
export default class SpecialAccessLogGrid extends Vue {
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
    this.loadDataSpecialAccessLog();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataSpecialAccessLog() {
    try {
      let params = {
        start_date: formatDateTimeZeroUTC(this.search.start_date),
        end_date: formatDateTimeZeroUTC(this.search.end_date),
        user_id: this.search.user_id,
        access: this.search.access,
      };
      const { data } = await userActivityLogAPI.specialAccessLog(params);
      this.rowData = data;
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
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.access"),
        field: "access_name",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.logDate"),
        field: "log_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 80,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.ipAddress"),
        field: "ip_address",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.computerName"),
        field: "computer_name",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.macAddress"),
        field: "mac_address",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.denied"),
        field: "access_denied",
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.system"),
        field: "name",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.userId"),
        field: "created_by",
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

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
