/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Options, Vue } from "vue-class-component";
import Header from "./header/header.vue";
import MenuSidebar from "./menu-sidebar/menu-sidebar.vue";
import Content from "./content/content.vue";
import ControlSidebar from "./control-sidebar/control-sidebar.vue";
import Footer from "./footer/footer.vue";
import Credential from "@/views/pages/components/credential/credential";
import DayendCloseStatus from "../dayend-close-status/dayend-close-status.vue";
import configStore from "../../../stores/config";
import authModule from "../../../stores/auth";
import Dialog from "@/components/dialog/dialog.vue";
import wsStore from "@/stores/websocket";
import { v4 as uuid } from "uuid";
import global from "@/utils/global";
import ActiveMenu from "./active-menu/active-menu.vue";
import activeMenuModule from "@/stores/active-menu";
import utilsStore from "@/stores/utils";
import AutoPostTransactionAPI from "@/services/api/hotel/night-audit/auto-post-transaction";
import NetworkError from "../network-error/network-error.vue";
import ChangePassword from "@/views/pages/components/change-password/change-password.vue";
import TrackingData from "@/components/tracking-data/tracking-data.vue";
import { getError } from "@/utils/general";
const autoPostTransactionAPI = new AutoPostTransactionAPI();
@Options({
  components: {
    "app-header": Header,
    "menu-sidebar": MenuSidebar,
    "control-sidebar": ControlSidebar,
    "app-footer": Footer,
    "main-content": Content,
    "c-dialog": Dialog,
    ChangePassword,
    Credential,
    ActiveMenu,
    DayendCloseStatus,
    TrackingData,
    NetworkError,
  },
  watch: {
    watchLayoutChanges: (_) => {},
    activeWindow(val) {
      console.log(val);
    },
  },
})
export default class Main extends Vue {
  private activeMenu = activeMenuModule();
  private config = configStore();
  private auth = authModule();
  private wsStore = wsStore();
  private utils = utilsStore();
  private appElement: HTMLElement | null = null;
  private showConfirmWindowOpen: boolean = false;
  public showDialog: boolean = false;
  public showDayendCloseStatusPage: boolean = false;
  public showChangePassword: boolean = false;
  socket2: WebSocket;
  seconds: number = 0;

  setWindowId() {
    const windowId = uuid();
    sessionStorage.setItem("windowId", windowId);
    localStorage.setItem("activeWindow", windowId);
    this.bcChannel();
  }

  bcChannel() {
    var bc = new BroadcastChannel("gator_channel");
    (() => {
      bc.onmessage = (messageEvent) => {
        // If our broadcast message is 'updateActiveWindow' then get the new value
        if (global.isMultiTab) return;
        if (messageEvent.data === "updateActiveWindow") {
          this.showConfirmWindowOpen = true;
          // localStorage is domain specific so when it changes in one window it changes in the other
        }
      };
      bc.postMessage("updateActiveWindow");
    })();
  }

  async wsConnect() {
    const URL_WS = import.meta.env.VITE_APP_URL_WS;
    const user = await this.auth.user;
    const companyCode = user.CompanyCode;
    const sessionId = this.utils.sessionID;
    this.socket2 = new WebSocket(
      URL_WS + "/ws/" + companyCode,
      localStorage.getItem("token")
    );
    this.socket2.onopen = () => {
      console.log("connect");
      this.utils.setConnectionStatus("ok");
      this.socket2.send("ping");
    };
    this.socket2.onerror = () => {
      console.log("error");
      this.utils.setConnectionStatus("failed");
    };

    this.socket2.onmessage = (event: any) => {
      if (event.data == "ping" || event.data == "pong") {
        return;
      }
      const response = JSON.parse(event.data);
      const data = response.data;
      const dataType = response.data_type;
      const messageType = response.message_type;
      const message = response.message;
      const action = response.action;
      const duration = response.duration;
      const interval = response.interval;

      if (dataType == global.wsDataType.serverStatus) {
        this.config.setServerStatus(data);
      }

      if (dataType == global.wsDataType.dayendCloseStatus) {
        if (data.status && !this.showDayendCloseStatusPage) {
          if (data.session_id != sessionId) {
            this.showDialog = true;
            this.seconds = 5;
            this.reduceSecond();
          }
        } else {
          setTimeout(() => {
            if (this.showDayendCloseStatusPage) {
              // if (data.session_id == sessionId)
              window.location.reload();
            }
          }, 10000);
        }
      } else if (dataType == global.wsDataType.modifiedRoomAvailabilityStatus) {
        this.wsStore.setModifiedRoomAvailable(true);
      } else if (dataType == global.wsDataType.auditDate) {
        this.config.setAuditDate(data);
      } else if (dataType == global.wsDataType.runningText) {
        this.wsStore.setRunningText(message, duration, interval);
      } else if (dataType == global.wsDataType.announcement) {
        console.log("action", action);
        this.wsStore.setAnnouncement(message, action);
      }
    };
    this.socket2.onclose = (event: any) => {
      setTimeout(() => {
        this.wsConnect();
      }, 5000);
    };
  }

  setActiveMenu() {
    if (this.activeMenu.menu.length <= 0) {
      const menu = this.$route.meta.menu;
      this.activeMenu.setActiveMenu(menu);
    }
  }

  reduceSecond() {
    setTimeout(() => {
      this.seconds--;
      if (this.seconds > 0) {
        this.reduceSecond();
      } else {
        this.showDayendCloseStatusPage = true;
      }
    }, 900);
  }

  handleUseHereDialog() {
    window.location.reload();
  }

  handleAnnouncementAction() {
    console.log("this.announcement.action", this.announcement.action);
    if (this.announcement.action == "reload") {
      console.log("masuk1");
      window.location.reload();
    } else if (this.announcement.action == "close") {
      console.log("masuk2");
      this.wsStore.setAnnouncement("", "close");
      // window.location.reload();
    } else {
      console.log("masuk3");
      this.wsStore.setAnnouncement("", "close");
    }
  }

  handleChangePassword() {
    this.showChangePassword = true;
  }

  handleClose() {
    window.open("https://cakrasoft.com", "_self");
  }

  async getDayendCloseStatus() {
    try {
      const { data } = await autoPostTransactionAPI.getDayendCloseStatus();
      if (data.detail) {
        const detail = data.detail;
        if (detail.status && detail.session_id != this.utils.sessionID) {
          // console.log("maas");
          this.showDayendCloseStatusPage = true;
        } else {
          this.showDayendCloseStatusPage = false;
          // console.log("maas");
        }
        console.log(detail);
      }
    } catch (error) {
      getError(error);
    }
  }

  public async mounted(): Promise<void> {
    this.appElement = document.getElementById("app") as HTMLElement;
    this.appElement.classList.add("sidebar-mini");
    this.appElement.classList.add("layout-fixed");
    // TODO auth enable this for auth
    // try {
    //     const user = await getProfile();
    //     this.$store.dispatch('auth/getUser', user);
    // } catch (error) {
    //     this.$store.dispatch('auth/logout');
    // }
  }

  public async beforeMount() {
    this.setActiveMenu();
    this.setWindowId();
    this.utils.setSessionID();
    this.getDayendCloseStatus();
    await this.config.getConfigurations();
    // this.config.setActiveStore(null);
    this.config.getAuditDateInterval();
    if (
      this.$route.name == "Report View" ||
      this.$route.name == "Report Preview"
    ) {
      return;
    }
    this.wsConnect();
  }

  public unmounted(): void {
    this.appElement.classList.remove("sidebar-mini");
    this.appElement.classList.remove("layout-fixed");
  }

  get activeWindow() {
    return localStorage.getItem("activeWindow");
  }

  get watchLayoutChanges() {
    if (!this.appElement) {
      return;
    }
    this.appElement.classList.remove("dark-mode");
    this.appElement.classList.remove("sidebar-closed");
    this.appElement.classList.remove("sidebar-collapse");
    this.appElement.classList.remove("sidebar-open");
    this.appElement.classList.remove("control-sidebar-slide-open");

    if (this.darkModeSelected) {
      this.appElement.classList.add("dark-mode");
    }

    if (!this.controlSidebarCollapsed) {
      this.appElement.classList.add("control-sidebar-slide-open");
    }

    if (this.menuSidebarCollapsed && this.screenSize === "lg") {
      this.appElement.classList.add("sidebar-collapse");
    } else if (this.menuSidebarCollapsed && this.screenSize === "xs") {
      this.appElement.classList.add("sidebar-open");
    } else if (!this.menuSidebarCollapsed && this.screenSize !== "lg") {
      this.appElement.classList.add("sidebar-closed");
      this.appElement.classList.add("sidebar-collapse");
    }
    return this.appElement.classList.value;
  }
  //TODO replace this with pinia store
  get darkModeSelected() {
    return this.$store.getters["ui/darkModeSelected"];
  }

  get menuSidebarCollapsed() {
    return this.$store.getters["ui/menuSidebarCollapsed"];
  }

  get controlSidebarCollapsed() {
    return this.$store.getters["ui/controlSidebarCollapsed"];
  }

  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }

  get connectionStabilized() {
    const conn = navigator.onLine || {};
    return conn;
  }

  get serverConnectionStatus() {
    return this.utils.connectionStatus == "ok";
  }

  get announcement() {
    return this.wsStore.announcement;
  }
}
