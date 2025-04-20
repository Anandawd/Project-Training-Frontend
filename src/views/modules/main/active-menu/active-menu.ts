/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Options, Vue } from "vue-class-component";
import authModule from "@/stores/auth";
import activeMenuModule from "@/stores/active-menu";
import { calculateWindowSize } from "@/utils/helpers";

@Options({
  components: {},
})
export default class ActiveMenu extends Vue {
  private headerElement: HTMLElement | null = null;
  public auth = authModule();
  public activeMenuModule = activeMenuModule();
  public async mounted(): Promise<void> {
    this.headerElement = document.getElementById("main-header") as HTMLElement;
    this.setInitialActiveMenu();
  }

  public onToggleMenuSidebar(): void {
    this.$store.dispatch("ui/toggleMenuSidebar");
  }

  public onToggleControlSidebar(): void {
    this.$store.dispatch("ui/toggleControlSidebar");
  }

  public onClickMenu(menu: any) {
    const item = this.activeMenu.find((val: any) => val.label == menu.label);
    this.$router.replace({ path: item.path });
  }

  setInitialActiveMenu() {
    const menu: any = this.$route.meta.menu;
    if (this.isSubscribedHotel) {
      this.activeMenuModule.setActiveMenu(menu);
    }
  }

  public onCloseMenu(menu: any) {
    this.activeMenuModule.removeActiveMenu(menu);
    if (this.activeMenu.length <= 1) {
      this.$router.push({ name: "Dashboard Page" });
      return;
    }
    if (menu.path == this.selectedMenu) {
      this.$router.go(-1);
    }
  }

  //TODO replace vuex with pinia
  get darkModeSelected() {
    return this.$store.getters["ui/darkModeSelected"];
  }

  get navbarVariant() {
    return this.$store.getters["ui/navbarVariant"];
  }

  get activeMenu() {
    return this.activeMenuModule.menu;
  }

  get selectedMenu() {
    return this.$route.path;
  }

  get isMobileView() {
    return this.windowSize == "xs" || this.windowSize == "sm";
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }

  get isSubscribedHotel() {
    return this.auth.isSubscribedHotel;
  }
}
