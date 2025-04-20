/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Options, Vue } from "vue-class-component";
import ActiveMenu from "../active-menu/active-menu.vue";
import Messages from "./messages/messages.vue";
import Notifications from "./notifications/notifications.vue";
import UnitProperties from "./unit-properties/unit-properties.vue";
import Languages from "./languages/languages.vue";
import SubscriptionAlert from "./subscription-alert/subscription-alert.vue";
import authModule from "@/stores/auth";
import User from "./user/user.vue";
import { calculateWindowSize } from "@/utils/helpers";

@Options({
  components: {
    "messages-dropdown": Messages,
    "notifications-dropdown": Notifications,
    "languages-dropdown": Languages,
    "user-dropdown": User,
    SubscriptionAlert,
    UnitProperties,
  },
})
export default class Header extends Vue {
  private headerElement: HTMLElement | null = null;
  public auth = authModule();
  user: any = {};
  availableModule: any = [];
  public async mounted(): Promise<void> {
    this.headerElement = document.getElementById("main-header") as HTMLElement;
    document.addEventListener("keydown", this.handleShortcut);
  }

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleShortcut);
  }

  public onToggleMenuSidebar(): void {
    this.$store.dispatch("ui/toggleMenuSidebar");
  }

  public onToggleControlSidebar(): void {
    this.$store.dispatch("ui/toggleControlSidebar");
  }

  public onClickModuleItem(moduleCode: any) {
    this.auth.setActiveModule(moduleCode);
  }

  setActiveModule(e: any, moduleCode: string) {
    e.preventDefault();
    this.auth.setActiveModule(moduleCode);
  }

  handleShortcut(event: any) {
    if (event.altKey && event.key === "f") {
      this.setActiveModule(event, this.$global.accessModule.hotel);
    } else if (event.altKey && event.key === "p") {
      this.setActiveModule(event, this.$global.accessModule.pointOfSales);
    } else if (event.altKey && event.key === "b") {
      this.setActiveModule(event, this.$global.accessModule.banquet);
    } else if (event.altKey && event.key === "c") {
      this.setActiveModule(event, this.$global.accessModule.crm);
    } else if (event.altKey && event.key === "a") {
      this.setActiveModule(event, this.$global.accessModule.accounting);
    } else if (event.altKey && event.key === "i") {
      this.setActiveModule(event, this.$global.accessModule.inventory);
    } else if (event.altKey && event.key === "r") {
      this.setActiveModule(event, this.$global.accessModule.report);
    } else if (event.altKey && event.key === "t") {
      this.setActiveModule(event, this.$global.accessModule.tools);
    }
  }

  async getUser() {
    this.user = await this.auth.user;
    if (!this.user) return this.auth.logout();
  }

  async created() {
    this.getUser();
    this.getAvailableModule();
  }

  async getAvailableModule() {
    await this.auth.setAuthorizeModule();
    const authModule = this.auth.authorizeModule;
    let modules: any = [];
    for (const i in this.auth.availableModule) {
      //TODO update access system
      if (
        authModule[this.auth.availableModule[i].id] == 1 ||
        this.userId == "SYSTEM"
      ) {
        modules.push(this.auth.availableModule[i]);
      }
    }
    this.availableModule = modules;
  }

  get userId() {
    return this.user.ID;
  }

  //TODO replace vuex with pinia
  get darkModeSelected() {
    return this.$store.getters["ui/darkModeSelected"];
  }

  get navbarVariant() {
    return this.$store.getters["ui/navbarVariant"];
  }

  // get availableModule() {
  //   this.auth.setAuthorizeModule();
  //   const authModule = this.auth.authorizeModule;
  //   let modules: any = [];
  //   for (const i in this.auth.availableModule) {
  //     //TODO update access system
  //     if (authModule[i] == 1 || this.userId == "SYSTEM") {
  //       modules.push(this.auth.availableModule[i]);
  //     }
  //   }
  //   console.log("module", modules);
  //   return modules;
  // }

  get activeModule() {
    return this.auth.activeModule;
  }

  get isMobileView() {
    return this.windowSize == "xs" || this.windowSize == "sm";
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }
}
