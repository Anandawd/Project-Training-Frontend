import { Options, Vue } from "vue-class-component";
import authModule from "@/stores/auth";
import wsStore from "@/stores/websocket";
import { BPopover } from "bootstrap-vue-3";

@Options({
  components: { BPopover },
})
export default class RunningText extends Vue {
  private auth = authModule();
  private wsStore = wsStore();

  mounted() {}

  get runningText() {
    return this.wsStore.runningText;
  }

  get duration() {
    return this.wsStore.runningTextDuration;
  }

  get interval() {
    return this.wsStore.runningTextInterval;
  }
}
