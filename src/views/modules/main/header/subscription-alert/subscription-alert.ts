import { Options, Vue } from "vue-class-component";
import { BPopover } from "bootstrap-vue-3";
import subscriptionStore from "@/stores/subscription";
import { formatDateTimeZone, formatFullDate } from "@/utils/format";

@Options({
  name: "subscription-alert",
  components: {
    BPopover,
  },
})
export default class SubscriptionAlert extends Vue {
  // utilsAPI = new UtilsAPI();
  private subscription = subscriptionStore();
  subscriptionStatus: {
    Domain: string;
    Subdomain: string;
    PropertyName: string;
    Name: string;
    StartDate: string;
    EndDate: string;
    IsActive: boolean;
  };

  // async getSubscriptionStatus() {
  //   try {
  //     const { data } = await this.utilsAPI.getSubscriptionStatus();
  //     this.subscription.setSubscriptionStatus(data);
  //   } catch (error) {
  //     // console.log(data);
  //   }
  // }
  mounted() {
    this.subscriptionStatus = this.subscription.subscriptionStatus;
    document.title = `${this.$global.appTitle} | ${this.subscriptionStatus.PropertyName}`;
  }

  get expireSoon() {
    const dateNow = new Date();
    const subEnd = new Date(this.subscriptionEnd);
    subEnd.setDate(subEnd.getDate() - 7);
    return dateNow.getTime() >= new Date(subEnd).getTime();
  }

  get expired() {
    const dateNow = new Date();
    const subEnd = new Date(this.subscriptionEnd);
    subEnd.setDate(subEnd.getDate());
    return dateNow.getTime() >= new Date(subEnd).getTime();
  }

  get subscriptionEnd() {
    return this.subscription.subscriptionStatus.EndDate;
  }

  get status() {
    if (this.expired) {
      return `<div class="bg-gradient-danger p-2  rounded-1"> Your subscription has expired. Please renew your subscription to continue using the application. </div>`;
    } else {
      return ` <div class="bg-gradient-warning p-2">
      Your subscription will expire soon, on <b>${formatFullDate(
        this.subscriptionEnd
      )}</b>. Please extend your subscription to continue using the application.
    </div>`;
    }
  }
}
