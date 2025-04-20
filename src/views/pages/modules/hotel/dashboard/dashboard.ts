import { Options, Vue } from "vue-class-component";
import RoomStatisticChart from "./components/room-statistic-chart/room-statistic-chart.vue";
import ExpectedDeparture from "./components/expected-departure/expected-departure.vue";
import ExpectedArrival from "./components/expected-arrival/expected-arrival.vue";
import RoomOccupiedChart from "./components/room-occupied-chart/room-occupied-chart.vue";
import GuestLoan from "./components/guest-loan/guest-loan.vue";
import RoomStatisticCard from "./components/room-statistic-card/room-statistic-card.vue";
import configStore from "@/stores/config";

@Options({
  name: "dashboard",
  components: {
    RoomStatisticChart,
    ExpectedDeparture,
    ExpectedArrival,
    RoomOccupiedChart,
    GuestLoan,
    RoomStatisticCard,
  },
})
export default class Dashboard extends Vue {
  config: any = configStore();
  component: any = [
    {
      name: "",
      position: 1,
      height: 50,
      width: 50,
      hidden: false,
    },
  ];
  // provide(eventBusKey, Bus); 需要外部调用方法时候使用
  layout = [
    { x: 0, y: 0, w: 2, h: 2, i: "0", static: false, minH: 5 },
    { x: 2, y: 0, w: 2, h: 4, i: "1", static: true },
    { x: 4, y: 0, w: 2, h: 5, i: "2", static: false },
    { x: 6, y: 0, w: 2, h: 3, i: "3", static: false },
    { x: 8, y: 0, w: 2, h: 3, i: "4", static: false },
    { x: 10, y: 0, w: 2, h: 3, i: "5", static: false },
    { x: 0, y: 5, w: 2, h: 5, i: "6", static: false },
    { x: 2, y: 5, w: 2, h: 5, i: "7", static: false },
    { x: 4, y: 5, w: 2, h: 5, i: "8", static: false },
    { x: 6, y: 3, w: 2, h: 4, i: "9", static: true },
  ];

  created() {
    console.log("width", this.logoWidth);
  }

  get logoWidth() {
    return this.config.logoWidth;
  }
}
