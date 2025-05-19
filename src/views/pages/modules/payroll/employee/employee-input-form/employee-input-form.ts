import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { formatDateTimeUTC } from "@/utils/format";
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
    employeeTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    genderOptions: {
      type: Array,
      default: (): any[] => [],
    },
    paymentFrequencyOptions: {
      type: Array,
      default: (): any[] => [],
    },
    maritalStatusOptions: {
      type: Array,
      default: (): any[] => [],
    },
    paymentMethodOptions: {
      type: Array,
      default: (): any[] => [],
    },
    bankOptions: {
      type: Array,
      default: (): any[] => [],
    },
    documentTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    departmentOptions: {
      type: Array,
      default: (): any[] => [],
    },
    positionOptions: {
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
  modeData!: number;
  employeeTypeOptions!: any[];
  genderOptions!: any[];
  paymentFrequencyOptions!: any[];
  maritalStatusOptions!: any[];
  paymentMethodOptions!: any[];
  bankOptions!: any[];
  documentTypeOptions!: any[];
  departmentOptions!: any[];
  positionOptions!: any[];
  placementOptions!: any[];

  inputFormValidation: any = ref();
  public defaultForm: any = {};
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

  created(): void {
    this.$watch(
      () => [this.form.status, this.form.employee_type],
      () => {
        if (this.isEndDateDisabled) {
          this.form.end_date = formatDateTimeUTC(new Date());
        }
      }
    );
  }

  mounted(): void {
    this.setEndDateForActiveStatus();
  }

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      // personal information
      id: undefined,
      employee_id: "",
      first_name: "",
      last_name: "",
      gender: "M",
      birth_date: "",
      phone: "",
      email: "",
      address: "",

      // employment information
      hire_date: formatDateTimeUTC(new Date()),
      end_date: null,
      status: "A",
      employee_type: "Permanent",
      position_code: "",
      department_code: "",
      placement_code: "",
      supervisor_id: "",

      // salary & payment information
      payment_frequency: "Monthly",
      daily_rate: 0,
      base_salary: 0,
      payment_method: "Bank Transfer",
      bank_name: "",
      bank_account_number: "",
      bank_account_name: "",

      // tax and identification data
      tax_number: "",
      identity_number: "",
      marital_status: "TK0",
      health_insurance_number: "",
      social_security_number: "",

      // attendance and leave data
      // workSchedule: "",
      // annualLeaveQuota: "",
      // remainingLeave: "",
    };

    await this.$nextTick();
    if (this.isEndDateDisabled) {
      this.form.end_date = formatDateTimeUTC(new Date());
    }
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    console.log("onSubmit clicked:", this.form);
    this.inputFormValidation.$el.requestSubmit();

    // this.$emit("save", this.form);
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

  private setEndDateForActiveStatus() {
    if (this.form.status === "A" && this.form.employee_type === "Permanent") {
      const today = new Date().toISOString().split("T")[0];
      this.form.end_date = today;
    }
  }

  get schema() {
    return Yup.object().shape({
      // personal information
      EmployeeId: Yup.string().required(),
      Firstname: Yup.string().required(),
      Lastname: Yup.string().required(),
      // Gender: Yup.string().required(),
      Email: Yup.string().email().required(),

      // employment information
      // Status: Yup.string().required(),
      EmployeeType: Yup.string().required(),
      Placement: Yup.string().required(),
      Department: Yup.string().required(),
      Position: Yup.string().required(),

      // salary & payment information
      // PaymentFrequency: Yup.string().required(),
      BaseSalary: Yup.number().min(0).required(),
      PaymentMethod: Yup.string().required(),
      BankName: Yup.string().required(),
      BankAccountNumber: Yup.string().required(),
      BankAccountName: Yup.string().required(),

      // tax & identification data
      MaritalStatus: Yup.string().required(),
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

  get isEndDateDisabled() {
    return this.form.status === "A" && this.form.employee_type === "Permanent";
  }

  get defaultEndDate(): string {
    if (this.isEndDateDisabled) {
      return formatDateTimeUTC(new Date());
    }
    return this.form.end_date || "";
  }

  // Filtered position options based on selected department
  get filteredPositionOptions() {
    if (!this.form.department_code) {
      return this.positionOptions;
    }

    // In a real implementation, you would filter positions by department
    return this.positionOptions;
  }

  // Filtered supervisor options based on selected department and placement
  get filteredSupervisorOptions() {
    if (!this.form.department_code || !this.form.placement_code) {
      return [];
    }

    // In a real implementation, you would filter supervisors by department and placement
    return [
      { code: "EMP001", name: "John Doe", SubGroupName: "Supervisor" },
      { code: "EMP002", name: "Jane Smith", SubGroupName: "Supervisor" },
      { code: "EMP003", name: "Robert Johnson", SubGroupName: "Supervisor" },
      { code: "EMP005", name: "Michael Wilson", SubGroupName: "Supervisor" },
      { code: "EMP006", name: "Sarah Johnson", SubGroupName: "Supervisor" },
      { code: "EMP008", name: "Jessica Walker", SubGroupName: "Supervisor" },
      { code: "EMP009", name: "Daniel Lee", SubGroupName: "Supervisor" },
      { code: "EMP011", name: "Thomas Wright", SubGroupName: "Supervisor" },
      { code: "EMP012", name: "David Wilson", SubGroupName: "Supervisor" },
    ];
  }
}
