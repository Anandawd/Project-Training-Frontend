import { Options, Vue } from "vue-class-component";
import Dropdown from "../../../../../components/dropdown/dropdown.vue";
import authModule from "@/stores/auth";

@Options({
  name: "modules",
  components: {
    "app-dropdown": Dropdown,
  },
})
export default class Modules extends Vue {
  public auth = authModule();
  public dropdownElement: any = null;
  user: any = {};
  availableModule: any = [];

  public onClickModuleItem(moduleCode: any) {
    this.dropdownElement.toggleDropdown();
    this.auth.setActiveModule(moduleCode);
  }

  async getUser() {
    this.user = await this.auth.user;
    if (!this.user) return this.auth.logout();
  }

  async created() {
    await this.getUser();
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
  //   return modules;
  // }

  get activeModule() {
    return this.auth.activeModule;
  }

  get activeModuleName() {
    const data = this.auth.availableModule.find(
      (val: any) => val.code == this.activeModule
    );
    if (data) {
      return data.name;
    }
    return "";
  }
}
