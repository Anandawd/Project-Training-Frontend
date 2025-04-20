import { Options, Vue } from "vue-class-component";
import defaultProfileImage from "@/assets/img/default-profile.png";
import logo from "@/assets/img/logo.png";
import MenuItem from "../../../../components/menu-item/menu-item.vue";
import menu from "../../../../router/menu";
import authModule from "@/stores/auth";
import Modules from "./modules/modules.vue";
import configStore from "@/stores/config";
import { BFormInput } from "bootstrap-vue-3";
import { calculateWindowSize } from "@/utils/helpers";
import hotelMenu from "@/router/menu/hotel-menu";
import pointOfSalesMenu from "@/router/menu/point-of-sales-menu";
import assetsMenu from "@/router/menu/assets-menu";
import accountingMenu from "@/router/menu/accounting-menu";
import reportMenu from "@/router/menu/report-menu";
import toolsMenu from "@/router/menu/tools-menu";
import banquetMenu from "@/router/menu/banquet-menu";
import crmMenu from "@/router/menu/crm-menu";
import payrollMenu from "@/router/menu/payroll-menu";
import activeMenuModule from "@/stores/active-menu";
import { generateIconMenuAgGrid } from "@/utils/general";
import EncryptionHelper from "@/utils/crypto";
const encryptionHelper = new EncryptionHelper();
@Options({
  name: "app-menu-sidebar",
  components: {
    Modules,
    BFormInput,
    "app-menu-item": MenuItem,
  },
  watch: {
    async menuSideBar() {
      this.showMenuList = false;
      if (this.isSubscribedHotel) {
        this.menu = [...menu, ...this.menuSideBar];
      } else {
        this.menu = [...this.menuSideBar];
      }
      await this.$nextTick();
      this.showMenuList = true;
    },
  },
})
export default class MenuSidebar extends Vue {
  public config = configStore();
  public activeMenu = activeMenuModule();
  public menu = menu;
  public showMenuList: boolean = true;
  public authModule: any = authModule();
  subscription: any = {};
  defaultProfileImage = defaultProfileImage;
  logo = logo;
  search = "";
  query = "";
  user: any = {};
  menuItems: any = [];
  filteredResults: any = [];
  private menuItem: any;
  public menuItemX: any = {};
  public authorized: boolean = false;
  public authorizeCode: string = null;
  public authorizedChildren: boolean = false;

  async mounted() {
    await this.getUser();
    await this.setAccess();
    await this.authModule.setActiveModule();
    this.subscription = this.authModule.subscription;
    if (this.isSubscribedHotel) {
      this.menu = [...menu, ...this.menuSideBar];
    } else {
      this.menu = [...this.menuSideBar];
    }
  }

  //FILTER SUGGESTIONS
  flattenMenu(menu: any) {
    let flattened: any = [];
    menu.forEach((item: any) => {
      if (item.children) {
        flattened.push(...this.flattenMenu(item.children));
      } else {
        flattened.push(item);
      }
    });
    return flattened;
  }
  searchItems() {
    const searchQuery = this.query.toLowerCase();
    this.filteredResults = this.menuItems.filter((item: any) =>
      this.$t(item.name).toLowerCase().includes(searchQuery)
    );
  }
  navigateTo(result: any) {
    this.query = "";
    this.filteredResults = [];
    this.handleMenuChildren(result);
  }
  generateIcon(icon: string) {
    let isColor = true;
    const size = "32";
    let iconPrefix = "";
    if (isColor) {
      iconPrefix = "color_";
    }
    return generateIconMenuAgGrid(`${iconPrefix}${icon}_icon${size}`);
  }
  clickOutside() {
    this.query = "";
    this.filteredResults = [];
  }

  public handleMenuChildren(menu: any) {
    this.activeMenu.setActiveMenu(menu);
    this.onToggleMenuSidebar();
  }

  public onToggleMenuSidebar(): void {
    if (this.windowSize == "xs" || this.windowSize == "sm") {
      this.$store.dispatch("ui/toggleMenuSidebar");
    }
  }

  async setAccess() {
    const menu = [
      ...hotelMenu,
      ...pointOfSalesMenu,
      ...assetsMenu,
      ...accountingMenu,
      ...reportMenu,
      ...toolsMenu,
      ...banquetMenu,
      ...crmMenu,
      ...payrollMenu,
    ];
    await this.authModule.setAuthorizeModule();
    const module: any[] = this.authModule.availableModule;
    const authModule: any[] = this.authorizeModule;
    // console.log("module", module);
    // console.log("authModule", authModule);
    for (let i = 0; i < module.length; i++) {
      // console.log("authModule[module[i].id]", authModule[module[i].id]);
      // console.log("authModule", authModule[i], i);
      if (authModule[module[i].id] == "1") {
        // console.log("module[i].code", module[i].code);
        await this.setAccessForm(module[i].code, menu);
      }
      // for (const x in module) {
      //   if (module[x].id == i) {
      //     if (authModule[i] == "1") {
      //     }
      //   }
      // }
    }
    this.menuItems = this.flattenMenu(Object.values(this.menuItemX));
    // console.log("menuItems");
  }

  private async setAccessForm(module: number, menu: any) {
    //parent
    const access = await this.authModule.getUserAccess();
    // let menu: any;
    switch (module) {
      case this.$global.accessModule.general:
        this.authorizeCode = access.general.access_form;
        // menu = hotelMenu;
        break;
      case this.$global.accessModule.hotel:
        this.authorizeCode = access.hotel.access_form;
        // menu = hotelMenu;
        break;
      case this.$global.accessModule.pointOfSales:
        this.authorizeCode = access.point_of_sales.access_form;
        // menu = pointOfSalesMenu;
        break;
      case this.$global.accessModule.banquet:
        this.authorizeCode = access.banquet.access_form;
        // menu = banquetMenu;
        break;
      case this.$global.accessModule.accounting:
        this.authorizeCode = access.accounting.access_form;
        // menu = accountingMenu;
        break;
      case this.$global.accessModule.inventory:
        this.authorizeCode = access.asset.access_form;
        // menu = assetsMenu;
        break;
      case this.$global.accessModule.report:
        this.authorizeCode = access.report.access_form;
        // menu = reportMenu;
        break;
      case this.$global.accessModule.tools:
        this.authorizeCode = access.tools.access_form;
        // menu = toolsMenu;
        break;
      default:
        this.authorizeCode = null;
    }
    // console.log("this.authorizeCode", this.authorizeCode);
    // console.log("++++++++++++++++++++++");
    await this.getAccessForm(this.authorizeCode, menu);
    //children
  }

  async getAccessForm(authorizeCode: any, menuItem: any) {
    if (authorizeCode || this.userId == "SYSTEM") {
      let access;
      if (authorizeCode) {
        access = await encryptionHelper.decrypt(authorizeCode, this.userGroup);
      }
      const menu = { ...menuItem };
      //reassign menu data
      for (const i in menu) {
        if (i == "isParent") {
          if (menu[i]) {
            this.authorized = menu[i];
            continue;
          }
        }
        if (i == "routeOrder") {
          if (menu[i] >= 0) {
            //TODO set access system
            if (this.userId == "SYSTEM") {
              this.authorized = true;
              continue;
            }
            this.authorized = access[menu[i]] == "1";
            if (!this.authorized) {
              break;
            }
          }
        }

        if (i == "children") {
          this.menuItemX[i] = [];
        } else {
          this.menuItemX[i] = menu[i];
        }
      }

      try {
        for (const i in menuItem.children) {
          if (this.userId == "SYSTEM") {
            this.menuItemX.children.push(menuItem.children[i]);
            continue;
          }
          //set accessed menu
          if (
            access[this.menuItem.children[i].routeOrder] == "1" ||
            this.userId == "SYSTEM"
          ) {
            //condistional subscribe

            this.menuItemX.children.push(menuItem.children[i]);
          }
        }
      } catch (err) {}
      if (this.menuItemX.hasOwnProperty("children")) {
        this.authorized = this.menuItemX.children.length > 0;
      }
    }
  }

  onSearch() {}

  hideMenuSidebar() {
    //TODO hide sidebar outside click
    // if (this.menuSidebarCollapsed) {
    //   console.log(this.windowSize);
    //   if (this.windowSize == "xs" || this.windowSize == "sm") {
    //     this.$store.dispatch("ui/toggleMenuSidebar");
    //   }
    // }
    // if (this.menuSidebarCollapsed) {
    //   this.$store.dispatch("ui/hideMenuSidebar");
    // }
    // this.$store.dispatch("ui/hideMenuSidebar");
  }

  get isMobileView() {
    return this.windowSize == "xs" || this.windowSize == "sm";
  }

  get sidebarSkin() {
    return this.$store.getters["ui/sidebarSkin"];
  }

  get menuSidebarCollapsed() {
    return this.$store.getters["ui/menuSidebarCollapsed"];
  }

  get menuSideBar() {
    return this.authModule.menuSideBar;
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }

  get isSubscribedHotel() {
    return this.authModule.isSubscribedHotel;
  }

  async getUser() {
    this.user = await this.authModule.user;
    if (!this.user) return this.authModule.logout();
  }

  get userId() {
    return this.user.ID;
  }

  get userGroup() {
    return this.user.GroupCode;
  }

  get authorizeModule() {
    return this.authModule.authorizeModule;
  }
}

// export const MENU = [
//   {
//     name: "labels.dashboard",
//     path: "/",
//   },
//   {
//     name: "labels.roomAvailability",
//     path: "/room-availability",
//   },
//   {
//     name: "labels.guestGroup",
//     path: "/guestgroup",
//   },
//   {
//     name: "labels.reservation",
//     path: "/reservation",
//   },
//   {
//     name: "labels.guestInHouse",
//     path: "/guestinhouse",
//   },
//   {
//     name: "labels.masterFolio",
//     path: "/master-folio",
//   },
//   {
//     name: "labels.deskFolio",
//     path: "/desk-folio",
//   },
//   {
//     name: "labels.folioHistory",
//     path: "/folio-history",
//   },
//   {
//     name: "labels.housekeeping",
//     path: "/housekeeping",
//   },
//   // {
//   //   name: 'labels.cashierReport',
//   //   path: '/blank',
//   //   disabled: true
//   // },
//   // {
//   //   name: 'labels.nightAudit',
//   //   path: '/blank',
//   //   disabled: true
//   // },
//   // {
//   //   name: 'labels.backOffice',
//   //   path: '/blank',
//   //   disabled: true
//   // },
//   // {
//   //   name: 'labels.configuration',
//   //   path: '/blank',
//   //   disabled: true
//   // },
//   // {
//   //   name: 'labels.report',
//   //   path: '/blank',
//   //   disabled: true
//   // }
// ];
