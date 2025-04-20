import { Options, Vue } from "vue-class-component";
import { version } from "../../../../../package.json";
import { formatDateDatabase, formatFullDateX } from "@/utils/format";
import configStore from "../../../../stores/config";
import authModule from "@/stores/auth";
import { DateTime } from "luxon";
import runningText from "../running-text/running-text.vue";
import Changelog from "./changelog/changelog.vue";
import { BPopover } from "bootstrap-vue-3";
import { calculateWindowSize } from "@/utils/helpers";

@Options({
  components: { BPopover, Changelog, runningText },
})
export default class Footer extends Vue {
  private config = configStore();
  private auth = authModule();
  private version: string = version;
  private currentYear: string = DateTime.now().toFormat("y");
  user: any = {};
  showChangelog: boolean = false;
  showRunningText: boolean = true;

  onMouseOver() {
    this.showRunningText = false;
  }

  onMouseLeave() {
    this.showRunningText = true;
  }

  onClickVersion() {
    this.showChangelog = true;
  }

  async created() {
    this.user = await this.auth.user;
  }

  get auditDate() {
    return formatFullDateX(this.config.auditDate);
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }

  get isAuditDateSameWithCurrentDate() {
    const date = formatDateDatabase(new Date());
    const audit = formatDateDatabase(this.auditDate);
    return date == audit;
  }
}
