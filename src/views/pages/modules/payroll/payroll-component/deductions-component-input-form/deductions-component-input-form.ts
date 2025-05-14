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
  public activeTab: string = "deductions";

  public form: any = reactive({});

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  deductionsCategoryOptions: any = [
    {
      SubGroupName: "Deduction Category",
      code: "DC01",
      name: "Fix Deduction",
    },
    {
      SubGroupName: "Deduction Category",
      code: "DC02",
      name: "Variable Deduction",
    },
    {
      SubGroupName: "Deduction Category",
      code: "DC03",
      name: "Kasbon",
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
      // Deductions tab
      deductionsCode: "",
      deductionsName: "",
      deductionsDescription: "",
      deductionsCategory: "",
      deductionsDefaultAmount: 0,
      deductionsQty: 1,
      deductionsUnit: "",
      deductionsTaxable: "NO",
      deductionsIncludedBpjsEmplyoee: "NO",
      deductionsIncludedBpjsHealth: "NO",
      deductionsIncludedProrate: "NO",
      deductionsShowInPayslip: "YES",
      deductionsStatus: "A",
      entityType: "deductions",
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

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // validation
  get schema() {
    return Yup.object().shape({
      deductionsCode: Yup.string().required("Code is required"),
      deductionsName: Yup.string().required("Name is required"),
      deductionsCategory: Yup.string().required("Category is required"),
      deductionsQty: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1"),
      deductionsTaxable: Yup.string().required("Taxable field is required"),
      deductionsIncludedBpjsEmplyoee: Yup.string().required(
        "BPJS Ketenagakerjaan field is required"
      ),
      deductionsIncludedBpjsHealth: Yup.string().required(
        "BPJS Kesehatan field is required"
      ),
      deductionsIncludedProrate: Yup.string().required(
        "Prorate field is required"
      ),
      deductionsShowInPayslip: Yup.string().required(
        "Show in Payslip field is required"
      ),
      deductionsStatus: Yup.string().required("Status is required"),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.payroll.deductionsComponent"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.payroll.deductionsComponent"
      )}`;
    }
  }
}
