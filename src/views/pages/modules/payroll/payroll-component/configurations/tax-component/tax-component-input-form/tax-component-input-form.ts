import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
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
    CDatepicker,
    CRadio,
    CCheckbox,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
      require: true,
    },
    typeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    categoryOptions: {
      type: Array,
      default: (): any[] => [],
    },
    placementOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  isSaving: any;
  typeOptions!: any[];
  categoryOptions!: any[];
  placementOptions!: any[];

  public form = reactive({});

  columnTypeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "300",
    },
    // {
    //   field: "code",
    //   label: "code",
    //   align: "right",
    //   width: "100",
    // },
  ];

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
      // filter: true,
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: null,
      code: "",
      name: "",
      description: "",
      type: "",
      tax_category: "",
      rate: 0,
      min_amount: 0,
      max_amount: 0,
      effective_date: "",
      end_date: "",
      formula: "",
      show_in_payslip: "1",
      active: "1",

      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  checkForm() {
    console.log(this.form);
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
      Code: Yup.string().required(),
      Name: Yup.string().required(),
      Type: Yup.string().required(),
      Category: Yup.string().required(),
      Rate: Yup.number().min(-1).required(),
      MinRange: Yup.number().min(-1).required(),
      MaxRange: Yup.number().min(-1).required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }
}
