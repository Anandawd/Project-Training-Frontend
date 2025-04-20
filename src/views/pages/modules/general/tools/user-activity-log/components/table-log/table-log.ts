import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import { formatDate, formatDateTimeZeroUTC, formatTime } from "@/utils/format";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import CSelect from "@/components/select/select.vue";
import { getError } from "@/utils/general";
import UserActivityLogAPI from "@/services/api/general/user-activity-log";
const userActivityLogAPI = new UserActivityLogAPI();

// const userActivityLogAPI = new userActivityLog();

@Options({
  components: {
    AgGridVue,
    CDatepicker,
    ActionGrid,
    SearchFilter,
    CSelect,
  },
})
export default class TableLogGrid extends Vue {
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
    this.loadDataTableLog();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataTableLog() {
    try {
      if (!this.search.table_name || !this.search.mode || !this.search.user_id)
        return;
      let params = {
        start_date: formatDateTimeZeroUTC(this.search.start_date),
        end_date: formatDateTimeZeroUTC(this.search.end_date),
        user_id: this.search.user_id,
        mode: this.search.mode,
        table_name: this.search.table_name,
      };
      const { data } = await userActivityLogAPI.tableLog(params);
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
      mode: "",
      table_name: "",
    };
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for translation localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.logDate"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.logTime"),
        field: "created_at",
        width: 100,
        valueFormatter: formatTime,
        filterParams: {
          valueFormatter: formatTime,
        },
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.userId"),
        field: "User ID",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.mode"),
        field: "Mode",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.tableName"),
        field: "Table Name",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.data"),
        field: "Data",
        width: 500,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
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
