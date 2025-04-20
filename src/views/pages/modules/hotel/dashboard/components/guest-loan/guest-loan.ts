import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import { formatDate } from "@/utils/format";

import HotelDashboardAPI from "@/services/api/general/hotel-dashboard";
const hotelDashboardAPI = new HotelDashboardAPI();
@Options({
  name: "guest_loan_item",
  components: { AgGridVue },
})
export default class GuestLoan extends Vue {
  agGridSetting: any;
  gridOptions: any = null;
  columnDefs: any = null;
  context: any = null;
  rowData: any = [];
  rowSelection: any = null;
  rowModelType: any = null;
  limitPageSize: any = null;
  gridApi: any = null;

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
        headerName: this.$t("commons.table.roomNumber"),
        resizable: true,
        field: "number",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.fullName"),
        resizable: true,
        field: "full_name",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.item"),
        resizable: true,
        field: "arrival",
        width: 110,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
      {
        headerName: this.$t("commons.table.date"),
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
    this.gridApi = this.gridOptions.api;
  }

  public unmounted() {}
}
