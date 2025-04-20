import { Options, Vue } from "vue-class-component";
import ChartBar from "@/components/chart-bar/chart-bar.vue";
import wsStore from "@/stores/websocket";
import configStore from "@/stores/config";
import HotelDashboardAPI from "@/services/api/general/hotel-dashboard";
import { formatDate3 } from "@/utils/format";
const hotelDashboardAPI = new HotelDashboardAPI();

@Options({
  components: {
    ChartBar,
  },
  watch: {
    modifiedRoomAvailable(val: boolean) {
      if (val) {
        this.getOccupancyHistoryDashboard();
      }
    },
  },
})
export default class RoomOccupiedChart extends Vue {
  config = configStore();
  data: any = [];
  dataSet: any = {};
  chartData = {
    datasets: [
      {
        label: "Room Occupied",
        backgroundColor: "#f87979",
        data: {},
      },
    ],
  };
  chartOptions = {
    responsive: true,
  };
  wsStore = wsStore();

  generateDataChart() {
    let dataX: any = {};
    for (const i in this.data) {
      dataX[formatDate3(this.data[i]["audit_date"])] = this.data[i]["rooms"];
    }
    this.chartData = {
      datasets: [
        {
          label: this.showOccupancyByRoomType
            ? "Bed Occupied"
            : "Room Occupied",
          backgroundColor: "#f87979",
          data: dataX,
        },
      ],
    };
  }

  // API CALL ================================================================================
  async getOccupancyHistoryDashboard() {
    const params = {
      filter: "",
    };
    try {
      const { data } = await hotelDashboardAPI.occupancyHistoryDashboard(
        params
      );
      this.data = data ?? [];
      this.generateDataChart();
      this.wsStore.setModifiedRoomAvailable(false);
    } catch (error) {}
  }
  // END API CALL ============================================================================

  mounted() {
    this.getOccupancyHistoryDashboard();
  }

  get modifiedRoomAvailable() {
    return this.wsStore.modifiedRoomAvailable;
  }
  get showOccupancyByRoomType() {
    return this.config.dashboardShowOccupancyByRoomType;
  }
}
