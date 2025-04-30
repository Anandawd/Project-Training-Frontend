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

  public defaultForm: any = {};
  public form: any = reactive({});
  public formDetail: any = reactive({});

  // options
  typeOptions: any = [
    {
      SubGroupName: "Type",
      code: "HT01",
      name: "National",
    },
    {
      SubGroupName: "Type",
      code: "HT02",
      name: "Regional",
    },
    {
      SubGroupName: "Type",
      code: "HT03",
      name: "Religious",
    },
    {
      SubGroupName: "Type",
      code: "HT04",
      name: "Company",
    },
    {
      SubGroupName: "Type",
      code: "HT05",
      name: "Collective Leave",
    },
    {
      SubGroupName: "Type",
      code: "HT06",
      name: "Local",
    },
    {
      SubGroupName: "Type",
      code: "HT07",
      name: "Observance",
    },
    {
      SubGroupName: "Type",
      code: "HT08",
      name: "Optional",
    },
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

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      placement: "",
      periodName: "",
      periodType: "",
      startDate: "",
      endDate: "",
      paymentDate: "",
      remark: "",
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
      placement: Yup.string().required("Placement is required"),
      periodName: Yup.string().required("Period name is required"),
      periodType: Yup.string().required("Period type is required"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string().required("End date is required"),
      paymentDate: Yup.string().required("Payment date is required"),
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
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }
}
