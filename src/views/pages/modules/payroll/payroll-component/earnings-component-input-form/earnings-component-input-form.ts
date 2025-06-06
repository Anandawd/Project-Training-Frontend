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
  public activeTab: string = "earnings";

  public form: any = reactive({});

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  earningCategoryOptions: any = [
    {
      SubGroupName: "Earning Category",
      code: "EC01",
      name: "Fix Allowance",
    },
    {
      SubGroupName: "Earning Category",
      code: "EC02",
      name: "Variable Allowance",
    },
    {
      SubGroupName: "Earning Category",
      code: "EC03",
      name: "Incentive",
    },
  ];

  booleanOptions: any = [
    {
      SubGroupName: "Options",
      code: "YES",
      name: "Yes",
    },
    {
      SubGroupName: "Options",
      code: "NO",
      name: "No",
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

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      // Earnings tab
      earningsCode: "",
      earningsName: "",
      earningsDescription: "",
      earningsCategory: "",
      earningsDefaultAmount: 0,
      earningsQty: 1,
      earningsUnit: "",
      earningsTaxable: "YES",
      earningsIncludedBpjsEmplyoee: "YES",
      earningsIncludedBpjsHealth: "YES",
      earningsIncludedProrate: "YES",
      earningsShowInPayslip: "YES",
      earningsStatus: "A",
      entityType: "earnings",
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
      EarningsCode: Yup.string().required(),
      EarningsName: Yup.string().required(),
      EarningsCategory: Yup.string().required(),
      EarningsQty: Yup.number().required().min(1),
      // earningTaxable: Yup.string().required("Taxable field is required"),
      // earningIncludedBpjsEmplyoee: Yup.string().required(
      //   "BPJS Ketenagakerjaan field is required"
      // ),
      // earningIncludedBpjsHealth: Yup.string().required(
      //   "BPJS Kesehatan field is required"
      // ),
      // earningIncludedProrate: Yup.string().required(
      //   "Prorate field is required"
      // ),
      // earningsShowInPayslip: Yup.string().required(
      //   "Show in Payslip field is required"
      // ),
      // earningsStatus: Yup.string().required("Status is required"),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.payroll.earningsComponent"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.payroll.earningsComponent"
      )}`;
    }
  }
}
