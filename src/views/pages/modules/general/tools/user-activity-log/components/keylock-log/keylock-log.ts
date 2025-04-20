import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import {
  formatDateTime,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import { getError } from "@/utils/general";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import CSelect from "@/components/select/select.vue";
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
export default class KeylockLogGrid extends Vue {
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
    this.loadDataKeyLockLog();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataKeyLockLog() {
    try {
      let params = {
        start_date: formatDateTimeZeroUTC(this.search.start_date),
        end_date: formatDateTimeZeroUTC(this.search.end_date),
        card_number: this.search.card_number,
        user_id: this.search.user_id,
      };
      const { data } = await userActivityLogAPI.keylockLog(params);
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
        headerName: this.$t("commons.table.cardNumber"),
        field: "card_number",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.reservation"),
        field: "reservation_number",
        width: 100,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
      },
      {
        headerName: this.$t("commons.table.folioNumber"),
        field: "folio_number",
        width: 130,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
      },
      {
        headerName: this.$t("commons.table.room"),
        field: "room_number1",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.guestName"),
        field: "guest_name",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.arrival"),
        field: "arrival_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.departure"),
        field: "departure_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.issuedDate"),
        field: "issued_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.issuedBy"),
        field: "issued_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.erasedDate"),
        field: "erased_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.erasedBy"),
        field: "erased_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 70,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
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
