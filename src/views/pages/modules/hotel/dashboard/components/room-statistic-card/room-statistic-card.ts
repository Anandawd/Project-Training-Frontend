import { Options, Vue } from "vue-class-component";
import HotelDashboardAPI from "@/services/api/general/hotel-dashboard";
import { formatCurrency } from "@/utils/format";
import wsStore from "@/stores/websocket";
import configStore from "@/stores/config";
import { anyToFloat } from "@/utils/general";
const hotelDashboardAPI = new HotelDashboardAPI();

@Options({
  components: {},
  watch: {
    modifiedRoomAvailable(val: boolean) {
      if (val) {
        this.getRoomStatisticCardDashboard();
      }
    },
  },
})
export default class RoomStatisticCard extends Vue {
  config = configStore();
  data: any = {};
  wsStore = wsStore();
  type: any = {};

  // API CALL ================================================================================
  async getRoomStatisticCardDashboard() {
    try {
      const { data } = await hotelDashboardAPI.roomStatisticCardDashboard();

      this.data = data.room ?? {};
      this.type = data.type ?? {};
      console.log("room", this.data);
      console.log("type", this.type);
      this.wsStore.setModifiedRoomAvailable(false);
    } catch (error) {}
  }
  // END API CALL ============================================================================

  mounted() {
    this.getRoomStatisticCardDashboard();
  }

  get currentOccupancy() {
    return {
      room: this.data.in_house ?? 0,
      type: this.type.in_house ?? 0,
    };
  }

  get currentOccupancyPercent() {
    return {
      room: formatCurrency(
        (this.currentOccupancy.room / this.saleableRoom.room) * 100
      ),
      type: formatCurrency(
        (this.currentOccupancy.type / this.saleableRoom.type) * 100
      ),
    };
  }

  get forecastOccupancyPercent() {
    return {
      room: formatCurrency(
        (this.forecastOccupancy.room / this.saleableRoom.room) * 100
      ),
      type: formatCurrency(
        (this.forecastOccupancy.type / this.saleableRoom.type) * 100
      ),
    };
  }

  get forecastOccupancy() {
    return {
      room: anyToFloat(
        this.currentOccupancy.room +
          this.data.expected_arrival -
          this.data.expected_departure
      ),
      type: anyToFloat(
        this.currentOccupancy.type +
          this.type.expected_arrival -
          this.type.expected_departure
      ),
    };
  }

  get currentVacantRooms() {
    return {
      room: anyToFloat(this.saleableRoom.room - this.currentOccupancy.room),
      type: anyToFloat(this.saleableRoom.type - this.currentOccupancy.type),
    };
  }

  get forecastVacantRooms() {
    return {
      room: anyToFloat(this.saleableRoom.room - this.forecastOccupancy.room),
      type: anyToFloat(this.saleableRoom.type - this.forecastOccupancy.type),
    };
  }

  get currentArrival() {
    return {
      room: this.data.arrival ?? 0,
      type: this.type.arrival ?? 0,
    };
    return;
  }

  get forecastArrival() {
    return {
      room: anyToFloat(
        this.currentArrival.room + (this.data.expected_arrival ?? 0)
      ),
      type: anyToFloat(
        this.currentArrival.type + (this.type.expected_arrival ?? 0)
      ),
    };
  }

  get currentDeparture() {
    return {
      room: this.data.departure ?? 0,
      type: this.type.departure ?? 0,
    };
  }

  get forecastDeparture() {
    return {
      room: anyToFloat(
        this.currentDeparture.room + this.data.expected_departure
      ),
      type: anyToFloat(
        this.currentDeparture.type + this.type.expected_departure
      ),
    };
  }

  get currentAvailable() {
    return {
      room: this.data.total_room ?? 0,
      type: this.type.total_room ?? 0,
    };
  }

  get forecastAvailable() {
    return {
      room: this.data.in_house ?? 0,
      type: this.type.in_house ?? 0,
    };
  }

  get saleableRoom() {
    return {
      room: this.data.saleable_room ?? 0,
      type: this.type.saleable_room ?? 0,
    };
  }
  get yesterdayArrival() {
    return {
      room: this.data.yesterday_arrival ?? 0,
      type: this.type.yesterday_arrival ?? 0,
    };
  }
  get yesterdayDeparture() {
    return {
      room: this.data.yesterday_departure ?? 0,
      type: this.type.yesterday_departure ?? 0,
    };
  }
  get yesterdayUnavailable() {
    return {
      room: this.data.yesterday_unavailable ?? 0,
      type: this.type.yesterday_unavailable ?? 0,
    };
  }
  get yesterdayOccupancy() {
    return {
      room: this.data.yesterday_occupancy ?? 0,
      type: this.type.yesterday_occupancy ?? 0,
    };
  }

  get arr() {
    return {
      room: formatCurrency(this.data.arr ?? 0),
      type: formatCurrency(this.type.arr ?? 0),
    };
  }
  get arrActual() {
    return {
      room: formatCurrency(this.data.arr_actual ?? 0),
      type: formatCurrency(this.type.arr_actual ?? 0),
    };
  }

  get revenue() {
    return {
      room: formatCurrency(this.data.revenue ?? 0),
      type: formatCurrency(this.type.revenue ?? 0),
    };
  }
  get revenueActual() {
    return {
      room: formatCurrency(this.data.revenue_actual ?? 0),
      type: formatCurrency(this.type.revenue_actual ?? 0),
    };
  }

  get totalRoom() {
    return {
      room: this.data.total_room ?? 0,
      type: this.type.total_room ?? 0,
    };
  }

  get yesterdayVacant() {
    return {
      room:
        this.totalRoom.room -
        this.yesterdayUnavailable.room -
        this.yesterdayOccupancy.room,
      type:
        this.totalRoom.type -
        this.yesterdayUnavailable.type -
        this.yesterdayOccupancy.type,
    };
  }
  get modifiedRoomAvailable() {
    return this.wsStore.modifiedRoomAvailable;
  }

  get showOccupancyByRoomType() {
    return this.config.dashboardShowOccupancyByRoomType;
  }
}
