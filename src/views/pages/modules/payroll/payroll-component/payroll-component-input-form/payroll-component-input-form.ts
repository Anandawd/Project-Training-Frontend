import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { nextTick, reactive, ref, watch } from "vue";
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

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  selectEmployeeOptions: any = [
    {
      SubGroupName: "Employee",
      code: "EMP001",
      name: "John Doe",
    },
    {
      SubGroupName: "Employee",
      code: "EMP001",
      name: "Sam Smith",
    },
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
  taxableOptions: any = [
    {
      SubGroupName: "Options",
      code: "OP02",
      name: "Yes",
    },
    {
      SubGroupName: "Options",
      code: "OP02",
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

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      // employee information
      employeeId: "EMP001",
      employeeName: "John Doe",
      gender: "Male",
      position: "Staff",
      department: "Marketing",
      placement: "Amora Ubud",
      employeeType: "Permanent",
      maritialStatus: "TK/0",
      bankName: "Bank BRI",
      bankAccountNumber: "10101010",
      bankAccountHolder: "John Doe",

      // financial information
      baseSalary: "",

      // tax and identification data
      taxNumber: "",
      identityNumber: "",
      bpjsHealthNumber: "",
      bpjsEmployeeNumber: "",
      // attendance and leave data
      workSchedule: "",
      annualLeaveQuota: "",
      remainingLeave: "",
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

  private setEndDateForActiveStatus() {
    if (this.form.employeeStatus === 1 || this.form.employeeStatus === "1") {
      const today = new Date().toISOString().split("T")[0];
      this.form.endDate = today;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({});
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

  get isEndDateDisabled() {
    return this.form.employeeStatus === 1 || this.form.employeeStatus === "1";
  }

  created(): void {
    watch(
      () => this.form.employeeStatus,
      async (newStatus) => {
        const status =
          typeof newStatus === "string" ? parseInt(newStatus) : newStatus;

        await nextTick();

        if (status === 1) {
          this.setEndDateForActiveStatus();
        } else {
          this.form.endDate = "";
        }
      },
      { immediate: true }
    );
  }

  mounted(): void {
    this.setEndDateForActiveStatus();
  }
}
