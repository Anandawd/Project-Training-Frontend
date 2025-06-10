import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { formatDateTimeUTC } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

const organizationAPI = new OrganizationAPI();

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

  supervisorOptions: any[];

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
      profile_photo: "",
      employee_id: "",
      first_name: "",
      last_name: "",
      gender: "Male",
      birth_date: "",
      phone: "",
      email: "",
      address: "",

      // employment information
      hire_date: "",
      end_date: "",
      status: "1",
      employee_type: "Permanent",
      position_code: "",
      department_code: "",
      placement_code: "",
      supervisor_id: "",

      // salary & payment information
      payment_frequency: "Monthly",
      payment_method: "Bank Transfer",
      bank_name: "BRI",
      bank_account_number: "",
      bank_account_name: "",

      // tax and identification data
      tax_number: "",
      identity_number: "",
      maritial_status: "TK0",
      health_insurance_number: "",
      social_security_number: "",

      // leave information
      annual_leave_quota: 0,
      annual_leave_remaining: 0,

      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
    };

    if (this.isEndDateDisabled) {
      this.form.end_date = formatDateTimeUTC(new Date());
    }
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    console.log("form", this.form);
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onPositionChange() {
    if (this.form.position_code) {
      const selected = this.positionOptions.find(
        (p) => p.code === this.form.position_code
      );
      if ((selected && selected.department_code) || selected.placement_code) {
        this.form.department_code = selected.department_code;
        this.form.placement_code = selected.placement_code;
      } else {
        this.form.department_code = "";
        this.form.placement_code = "";
      }
    }
  }

  onLeaveQuotaChange() {
    if (this.form.annual_leave_quota > 0) {
      this.form.annual_leave_remaining = this.form.annual_leave_quota;
    } else {
      this.form.annual_leave_remaining = 0;
    }
  }

  async loadSupervisor(params: any) {
    try {
      const { data } = await organizationAPI.GetSupervisorByDepartment(params);
      if (data) {
        this.supervisorOptions = data;
      }
    } catch (error) {
      getError(error);
    }
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
      PaymentFrequency: Yup.string().required(),
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
    return (
      (this.form.status === "1" || 1) &&
      (this.form.employee_type === "Permanent" || "Full-time")
    );
  }

  get defaultEndDate(): string {
    if (this.isEndDateDisabled) {
      return formatDateTimeUTC(new Date());
    }
    return this.form.end_date || "";
  }

  // Filtered supervisor options based on selected department and placement
  get supervisorOptionsByDepartment() {
    if (this.form.department_code) {
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

  get isShowSupervisor() {
    if (this.form.position_code) {
      const selected = this.positionOptions.find(
        (p) => p.code === this.form.position_code
      );
      if (selected.level > 4 && selected.department_code) {
        this.loadSupervisor(selected.department_code);
        return true;
      }
    }
    return false;
  }
}
