import { Options, Vue } from "vue-class-component";
import HotelDashboard from "../modules/hotel/dashboard/dashboard.vue";

@Options({
  components: {
    HotelDashboard,
  },
})
export default class Dashboard extends Vue {}
