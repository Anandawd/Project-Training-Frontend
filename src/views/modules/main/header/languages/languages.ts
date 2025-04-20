import { Options, Vue } from "vue-class-component";
import Dropdown from "../../../../../components/dropdown/dropdown.vue";

@Options({
  name: "languages-dropdown",
  components: {
    "app-dropdown": Dropdown,
  },
})
export default class Languages extends Vue {
  public selectedLanguage: string = null;
  public languages: any = [
    {
      key: "en",
      flag: "flag-icon-gb",
      label: "languages.english",
    },
    {
      key: "id",
      flag: "flag-icon-id",
      label: "languages.indonesia",
    },
    {
      key: "vn",
      flag: "flag-icon-vn",
      label: "languages.vietnam",
    },
  ];

  public mounted() {
    this.selectedLanguage = localStorage.getItem("lang") ?? this.$i18n.locale;
    this.$i18n.locale = this.selectedLanguage;
  }

  get flagIcon() {
    if (this.selectedLanguage === "id") {
      return "flag-icon-id";
    }
    if (this.selectedLanguage === "vn") {
      return "flag-icon-vn";
    }
    return "flag-icon-gb";
  }

  public changeLanguage(langCode: string) {
    if (this.$i18n.locale !== langCode) {
      this.$i18n.locale = langCode;
      this.selectedLanguage = langCode;
      localStorage.setItem("lang", langCode);
    }
  }
}
