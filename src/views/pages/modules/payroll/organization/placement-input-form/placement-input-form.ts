import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CRadio,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  public isSave: boolean = false;
  public activeTab: string = "placement";
  public form: any = reactive({});

  placementCountryOption: any = [
    { code: "ID", name: "Indonesia" },
    { code: "SG", name: "Singapore" },
    { code: "MY", name: "Malaysia" },
    { code: "TH", name: "Thailand" },
    { code: "PH", name: "Philippines" },
    { code: "VN", name: "Vietnam" },
    { code: "HK", name: "Hong Kong" },
    { code: "JP", name: "Japan" },
    { code: "AU", name: "Australia" },
    { code: "NZ", name: "New Zealand" },
  ];

  placementCityOption: any = [
    { code: "BALI", name: "Bali" },
    { code: "JKT", name: "Jakarta" },
    { code: "BDG", name: "Bandung" },
    { code: "SBY", name: "Surabaya" },
    { code: "YOG", name: "Yogyakarta" },
    { code: "MKS", name: "Makassar" },
    { code: "SIN", name: "Singapore" },
    { code: "KUL", name: "Kuala Lumpur" },
    { code: "BKK", name: "Bangkok" },
    { code: "PHU", name: "Phuket" },
    { code: "MNL", name: "Manila" },
    { code: "HCM", name: "Ho Chi Minh City" },
    { code: "HKG", name: "Hong Kong" },
    { code: "TYO", name: "Tokyo" },
    { code: "SYD", name: "Sydney" },
    { code: "MEL", name: "Melbourne" },
    { code: "AKL", name: "Auckland" },
  ];

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      placementCode: "",
      placementName: "",
      placementCountry: "",
      placementCity: "",
      placementAddress: "",
      placementStatus: "A",
      id: undefined,
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    // this.inputFormValidation.$el.requestSubmit();
    this.onSave();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit({ errors }: any) {
    focusOnInvalid();
    // getToastError("onInvalidSubmit Please complete all required fields");
  }

  // validation
  get schema() {
    return Yup.object().shape({});
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.employee.placement"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.employee.placement"
      )}`;
    }
  }
}
