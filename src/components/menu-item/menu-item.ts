import { calculateWindowSize } from "@/utils/helpers";
import { Options, Vue } from "vue-class-component";
import authModule from "@/stores/auth";
import EncryptionHelper from "@/utils/crypto";
import { generateIconMenuAgGrid } from "@/utils/general";
import activeMenuModule from "@/stores/active-menu";

const encryptionHelper = new EncryptionHelper();

@Options({
  name: "app-menu-item",
  props: {
    menuItem: Object,
    icon: String,
    type: String,
    placeholder: String,
    autocomplete: String,
  },
})
export default class MenuItem extends Vue {
  public activeMenu = activeMenuModule();
  public auth = authModule();
  private menuItem: any;
  public menuItemX: any = {};
  private isMenuExtended: boolean = false;
  private isExpandable: boolean = false;
  private isMainActive: boolean = false;
  private isOneOfChildrenActive: boolean = false;
  public authorized: boolean = false;
  public authorizeCode: string = null;
  public authorizedChildren: boolean = false;
  user: any = {};

  created(): void {
    this.getUser();
  }

  public async mounted() {
    await this.setAccessForm();
    this.isExpandable =
      this.menuItem &&
      this.menuItem.children &&
      this.menuItem.children.length > 0;
    this.calculateIsActive(this.$router.currentRoute.value.path);
    this.$router.afterEach((to) => {
      this.calculateIsActive(to.path);
    });
    this.isMenuExtended = this.isExpandable;
  }

  public handleMainMenuAction() {
    if (this.isExpandable) {
      this.toggleMenu();
      return;
    }
    this.activeMenu.setActiveMenu(this.menuItem);
    this.onToggleMenuSidebar();
    this.$router.replace(this.menuItem.path);
  }

  public handleMenuChildren(menu: any) {
    this.activeMenu.setActiveMenu(menu);
    this.onToggleMenuSidebar();
  }

  public toggleMenu() {
    this.isMenuExtended = !this.isMenuExtended;
  }

  public onToggleMenuSidebar(): void {
    if (this.windowSize == "xs" || this.windowSize == "sm") {
      this.$store.dispatch("ui/toggleMenuSidebar");
    }
  }

  public calculateIsActive(url: string) {
    this.isMainActive = false;
    this.isOneOfChildrenActive = false;
    if (this.isExpandable) {
      this.menuItem.children.forEach((item: any) => {
        if (item.path === url) {
          this.isOneOfChildrenActive = true;
          // this.isMenuExtended = true;
        }
      });
    } else if (this.menuItem.path === url) {
      this.isMainActive = true;
    }
    if (!this.isMainActive && !this.isOneOfChildrenActive) {
      // this.isMenuExtended = false;
    }
  }

  private async setAccessForm() {
    //parent
    const access = await this.auth.getUserAccess();
    switch (this.auth.activeModule) {
      case this.$global.accessModule.general:
        this.authorizeCode = access.general.access_form;
        break;
      case this.$global.accessModule.hotel:
        this.authorizeCode = access.hotel.access_form;
        break;
      case this.$global.accessModule.pointOfSales:
        this.authorizeCode = access.point_of_sales.access_form;
        break;
      case this.$global.accessModule.banquet:
        this.authorizeCode = access.banquet.access_form;
        break;
      case this.$global.accessModule.accounting:
        this.authorizeCode = access.accounting.access_form;
        break;
      case this.$global.accessModule.inventory:
        this.authorizeCode = access.asset.access_form;
        break;
      case this.$global.accessModule.report:
        this.authorizeCode = access.report.access_form;
        break;
      case this.$global.accessModule.tools:
        this.authorizeCode = access.tools.access_form;
        break;
      default:
        this.authorizeCode = null;
    }
    await this.getAccessForm();
    //children
  }

  async getAccessForm() {
    if (this.authorizeCode || this.userId == "SYSTEM") {
      let access;
      if (this.authorizeCode) {
        access = await encryptionHelper.decrypt(
          this.authorizeCode,
          this.userGroup
        );
      }
      const menu = { ...this.menuItem };
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
        for (const i in this.menuItem.children) {
          if (this.userId == "SYSTEM") {
            this.menuItemX.children.push(this.menuItem.children[i]);
            continue;
          }
          //set accessed menu
          if (
            access[this.menuItem.children[i].routeOrder] == "1" ||
            this.userId == "SYSTEM"
          ) {
            //condistional subscribe

            this.menuItemX.children.push(this.menuItem.children[i]);
          }
        }
      } catch (err) {}
      if (this.menuItemX.hasOwnProperty("children")) {
        this.authorized = this.menuItemX.children.length > 0;
      }
    }
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

  async getUser() {
    this.user = await this.auth.user;
    if (!this.user) return this.auth.logout();
  }

  get userId() {
    return this.user.ID;
  }

  get userGroup() {
    return this.user.GroupCode;
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }
}
