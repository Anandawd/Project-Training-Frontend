import { Options, Vue } from "vue-class-component";
import Breadcrumb from "../../../../components/layout/breadcrumb/breadcrumb.vue";
import Dialog from "@/components/dialog/dialog.vue";
import authModule from "@/stores/auth";
import activeMenuModule from "@/stores/active-menu";
import ProgressBar from "../../../../components/ProgressBar.vue";
import { calculateWindowSize } from "@/utils/helpers";

@Options({
  name: "content",
  components: {
    Breadcrumb,
    ProgressBar,
    "cs-dialog": Dialog,
  },
})
export default class Content extends Vue {
  public authModule = authModule();
  activeMenuModule = activeMenuModule();

  onToggleSideBar() {
    if (this.menuSidebarCollapsed) {
      if (this.windowSize == "xs" || this.windowSize == "sm") {
        this.$store.dispatch("ui/toggleMenuSidebar");
      }
    }
  }

  get menuSidebarCollapsed() {
    return this.$store.getters["ui/menuSidebarCollapsed"];
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }

  get activeMenu() {
    const menu = this.activeMenuModule.menu.map((val) => val.name);
    // console.log(menu);
    return menu;
  }
}
