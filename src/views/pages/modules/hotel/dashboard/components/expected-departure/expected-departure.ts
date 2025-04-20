import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import { formatDate } from "@/utils/format";
import wsStore from "@/stores/websocket";
import HotelDashboardAPI from "@/services/api/general/hotel-dashboard";
const hotelDashboardAPI = new HotelDashboardAPI();
@Options({
  components: { AgGridVue },
  watch: {
    modifiedRoomAvailable(val: boolean) {
      if (val) {
        this.getExpectedDeparture();
      }
    },
  },
})
export default class ExpectedDeparture extends Vue {
  agGridSetting: any;
  gridOptions: any = null;
  columnDefs: any = null;
  context: any = null;
  rowData: any = [];
  rowSelection: any = null;
  rowModelType: any = null;
  limitPageSize: any = null;
  gridApi: any = null;
  wsStore = wsStore();

  async beforeMount() {
    this.agGridSetting = this.$global.agGrid;
    this.gridOptions = {
      ...this.agGridSetting.gridOptions,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //

    this.columnDefs = [
      {
        headerName: this.$t("commons.table.folio#"),
        resizable: true,
        field: "number",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.room#"),
        resizable: true,
        field: "room_number",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.fullName"),
        resizable: true,
        field: "full_name",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.arrival"),
        resizable: true,
        field: "arrival",
        width: 110,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
      {
        headerName: this.$t("commons.table.departure"),
        resizable: true,
        field: "departure",
        width: 110,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.getExpectedDeparture();
    this.gridApi = this.gridOptions.api;
  }

  // API CALL ================================================================================
  async getExpectedDeparture() {
    try {
      const { data } = await hotelDashboardAPI.expectedDepartureDashboard();
      this.rowData = data ?? [];
      this.wsStore.setModifiedRoomAvailable(false);
    } catch (error) {}
  }
  // END API CALL ============================================================================
  get modifiedRoomAvailable() {
    return this.wsStore.modifiedRoomAvailable;
  }
}
