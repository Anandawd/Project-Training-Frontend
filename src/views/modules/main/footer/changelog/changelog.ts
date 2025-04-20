import { Options, Vue } from "vue-class-component";
import CModal from "@/components/modal/modal.vue";
import axios from "axios";
@Options({
  components: { CModal },
})
export default class Changelog extends Vue {
  changelogX: any = null;

  mounted() {
    this.loadChangelog();
  }

  async loadChangelog() {
    try {
      const response = await axios.get("/change-log.json");
      const logContent = response.data;
      this.changelogX = logContent;
    } catch (error) {
      console.error("Error loading changelog:", error);
    }
  }
}
