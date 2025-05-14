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
  public activeTab: string = "statutory";

  public form: any = reactive({});

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  typeOptions: any = [
    {
      SubGroupName: "Type",
      code: "T01",
      name: "Earnings",
    },
    {
      SubGroupName: "Type",
      code: "T02",
      name: "Deductions",
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
      // Statutory tab
      statutoryCode: "",
      statutoryName: "",
      statutoryDescription: "",
      statutoryType: "",
      statutoryDefaultAmount: 0,
      statutoryQty: 1,
      statutoryUnit: "",
      statutoryTaxable: "NO",
      statutoryIncludedProrate: "YES",
      statutoryShowInPayslip: "YES",
      statutoryStatus: "A",
      entityType: "statutory",
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
      statutoryCode: Yup.string().required("Code is required"),
      statutoryName: Yup.string().required("Name is required"),
      statutoryType: Yup.string().required("Type is required"),
      statutoryQty: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1"),
      statutoryTaxable: Yup.string().required("Taxable field is required"),
      statutoryIncludedProrate: Yup.string().required(
        "Prorate field is required"
      ),
      statutoryShowInPayslip: Yup.string().required(
        "Show in Payslip field is required"
      ),
      statutoryStatus: Yup.string().required("Status is required"),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.payroll.statutoryComponent"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.payroll.statutoryComponent"
      )}`;
    }
  }
}
