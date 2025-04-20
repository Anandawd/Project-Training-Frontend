import { Options, Vue } from "vue-class-component";
import UtilsAPI from "@/services/api/utils/utils";
import subscriptionStore from "@/stores/subscription";
import { formatFullDate } from "@/utils/format";
const utilsAPI = new UtilsAPI();
@Options({})
export default class SubscriptionStatus extends Vue {
  // public subscriptionStatus: any = {};
  private subscription = subscriptionStore();
  formatFullDate = formatFullDate;

  onContinue() {
    window.location.replace("https://cakrasoft.net/login");
  }

  onDashboard() {
    // window.location.replace(window.location.hostname);
    this.$router.push({ name: "Login" });
  }

  async getSubscriptionStatus() {
    try {
      const { data } = await utilsAPI.getSubscriptionStatus();
      this.subscription.setSubscriptionStatus(data);
    } catch (error) {
      // console.log(data);
    }
  }

  beforeMount() {
    this.getSubscriptionStatus();
  }

  get subscriptionStatus() {
    return this.subscription.subscriptionStatus;
  }
}
