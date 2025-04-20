import { Options, Vue } from "vue-class-component";
import AutoPostTransactionAPI from "@/services/api/hotel/night-audit/auto-post-transaction";
import { getError } from "@/utils/general";
import utilsStore from "@/stores/utils";
import Clock from "@/components/clock/clock.vue";
const autoPostTransactionAPI = new AutoPostTransactionAPI();

@Options({
  components: { Clock },
  // beforeRouteEnter(to, from, next) {
  //   const config = configStore();
  //   if (!config.dayendClose) {
  //     next("/");
  //   } else {
  //     next();
  //   }
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  //   // because it has not been created yet when this guard is called!
  // },
})
export default class DayendCloseStatus extends Vue {
  public confirmationElement: any = null;
  utils = utilsStore();

  handleCancelDayendClose() {
    this.confirmationElement.showConfirmation({
      show: true,
      onConfirm: () => {
        this.setDayendCloseStatus(false);
      },
    });
  }

  async setDayendCloseStatus(status: boolean) {
    try {
      const params = {
        session_id: this.utils.sessionID,
        status: status,
      };
      await autoPostTransactionAPI.setDayendCloseStatus(params);
      location.reload();
    } catch (error) {
      getError(error);
    }
  }

  mounted() {
    setTimeout(() => {
      location.reload();
    }, 10000);
  }
}
