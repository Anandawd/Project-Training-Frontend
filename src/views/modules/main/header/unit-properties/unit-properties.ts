import { Options, Vue } from "vue-class-component";
import Dropdown from "../../../../../components/dropdown/dropdown.vue";
import authModule from "@/stores/auth";
import SettingsAPI from "@/services/api/general/settings";
const settingAPI = new SettingsAPI();

@Options({
  name: "languages-dropdown",
  components: {
    "app-dropdown": Dropdown,
  },
})
export default class UnitProperties extends Vue {
  public auth = authModule();
  public selectedProperty: string = null;
  public properties: any[] = [];

  public async mounted() {
    let reload = false;
    await this.getPropertyList();
    this.selectedProperty = this.unitPropertyCode;

    const index = this.properties.findIndex(
      (val: any) => val.code == this.selectedProperty
    );
    if (index < 0) {
      reload = true;
      this.selectedProperty = "";
    }
    if (!this.selectedProperty || this.selectedProperty == "") {
      if (this.properties.length > 0) {
        reload = true;
        this.selectedProperty = this.properties[0]["code"];
      }
    }
    if (reload) {
      this.changeProperty(this.selectedProperty);
    } else {
      this.auth.changeUnitProperty(this.selectedProperty);
    }
  }

  async changeProperty(code: string) {
    try {
      await this.auth.changeUnitProperty(code);
      this.selectedProperty = code;
      location.reload();
    } catch {}
  }

  async getPropertyList() {
    try {
      const { data } = await settingAPI.getHotelInformationList();
      this.properties = data ?? [];
    } catch {}
  }

  get propertyName() {
    for (const i of this.properties) {
      if (i.code == this.selectedProperty) {
        return i.name;
      }
    }
  }

  get unitPropertyCode() {
    return this.auth.unitPropertyCode;
  }
}
