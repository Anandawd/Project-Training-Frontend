import { calculateWindowSize } from "@/utils/helpers";
import { Options, Vue } from "vue-class-component";
import authModule from "@/stores/auth";
import EncryptionHelper from "@/utils/crypto";
import { cloneObject, generateIconMenuAgGrid } from "@/utils/general";

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

  public async mounted() {
    // await this.setAccessForm();
    this.isExpandable =
      this.menuItem &&
      this.menuItem.children &&
      this.menuItem.children.length > 0;
    this.isMenuExtended = this.isExpandable;
  }

  public handleMainMenuAction() {
    if (this.isExpandable) {
      this.toggleMenu();
      return;
    }
    this.onToggleMenuSidebar();
    this.$router.replace(this.menuItem.path);
  }

  public handleMenuChildren() {
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

  created(): void {
    this.getUser();
  }

  get userId() {
    return this.user.ID;
  }

  get windowSize() {
    return calculateWindowSize(this.$windowWidth);
  }

  get hashId() {
    return this.$route.hash.slice(1);
  }
}
