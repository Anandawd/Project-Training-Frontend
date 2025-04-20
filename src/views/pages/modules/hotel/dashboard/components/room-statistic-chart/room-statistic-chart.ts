import { Options, Vue } from "vue-class-component";
import ChartDonut from "@/components/chart-donut/chart-donut.vue";
import HotelDashboardAPI from "@/services/api/general/hotel-dashboard";
import wsStore from "@/stores/websocket";
import configStore from "@/stores/config";
const hotelDashboardAPI = new HotelDashboardAPI();

@Options({
  components: {
    ChartDonut,
  },
  watch: {
    modifiedRoomAvailable(val: boolean) {
      if (val) {
        this.getRoomStatisticDashboard();
      }
    },
  },
})
export default class RoomStatisticChart extends Vue {
  config = configStore();
  data: any = {};
  chartData = {
    total: {
      value: 0,
      label: "Total Rooms",
    },
    labels: [""],
    datasets: [
      {
        backgroundColor: [""],
        data: [0],
      },
    ],
  };
  chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
  };
  wsStore = wsStore();

  generateDataChart() {
    let dataX: any = [];
    let labelX = [];
    let colorX = [];
    const data = this.data.data;
    for (const i in data) {
      if (this.showOccupancyByRoomType) {
        if (data[i]["Code"] == "Available Room") {
          data[i]["Code"] = this.showOccupancyByRoomType
            ? "Available Beds"
            : "Available Rooms";
        }
      }
      if (
        data[i]["Code"] != "Reservation" &&
        data[i]["Code"] != "Room Sold" &&
        data[i]["Code"] != "In House"
      ) {
        labelX.push(data[i]["Code"]);
        dataX.push(data[i]["rooms"]);
        colorX.push(data[i]["color"]);
      }
    }
    this.chartData = {
      total: {
        value: this.data.total_room,
        label: this.showOccupancyByRoomType ? "Total Beds" : "Total Rooms",
      },
      labels: labelX,
      datasets: [
        {
          backgroundColor: colorX,
          data: dataX,
        },
      ],
    };
  }

  getRoomAvailable() {
    // for(const i in )
  }
  // API CALL ================================================================================
  async getRoomStatisticDashboard() {
    try {
      const { data } = await hotelDashboardAPI.roomStatisticDashboard();
      this.data = data ?? [];
      this.generateDataChart();
      this.wsStore.setModifiedRoomAvailable(false);
    } catch (error) {
      console.log(error);
    }
  }
  // END API CALL ============================================================================

  mounted() {
    this.getRoomStatisticDashboard();
  }

  get modifiedRoomAvailable() {
    return this.wsStore.modifiedRoomAvailable;
  }
  get showOccupancyByRoomType() {
    return this.config.dashboardShowOccupancyByRoomType;
  }
}
