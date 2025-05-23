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
    countryOptions: {
      type: Array,
      default: (): any[] => [],
    },
    cityOptions: {
      type: Array,
      default: (): any[] => [],
    },
    // cityOptions: {
    //   type: Object,
    //   default: (): Record<string, any[]> => ({}),
    // },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  countryOptions: any[];
  cityOptions: any[];

  inputFormValidation: any = ref();
  modeData: any;

  public form: any = reactive({});

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
      placement_code: "",
      name: "",
      country: "",
      city: "",
      address: "",
      status: "A",
      id: undefined,
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
    // this.onSave();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // validation
  get schema() {
    return Yup.object().shape({
      PlacementCode: Yup.string().required(),
      PlacementName: Yup.string().required(),
    });
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

  get placementCountryOptions() {
    return this.countryOptions;
  }

  get placementCityOptions() {
    return this.cityOptions;
  }
}
