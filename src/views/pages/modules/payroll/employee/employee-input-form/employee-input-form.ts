import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
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
  columnEmployeeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "employe_id",
      label: "employe_id",
      align: "right",
      width: "100",
    },
  ];

  created(): void {
    this.$watch(
      () => [this.form.status, this.form.employee_type],
      () => {
        this.handleEndDateLogic();
      }
    );

    this.$watch(
      () => this.form.department_code,
      (newDepartment, oldDepartment) => {
        if (newDepartment !== oldDepartment) {
          this.form.supervisor_id = "";
          this.supervisorOptions = [];

          if (this.shouldShowSupervisor && newDepartment) {
            this.loadSupervisor(newDepartment);
          }
        }
      }
    );
  }

  mounted(): void {
    this.handleEndDateLogic();
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

    // Reset supervisor options
    this.supervisorOptions = [];
    this.handleEndDateLogic();
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

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async onPositionChange() {
    this.form.supervisor_id = "";
    this.supervisorOptions = [];

    if (this.form.position_code) {
      const selected = this.positionOptions.find(
        (p) => p.code === this.form.position_code
      );
      if (selected) {
        // Auto-fill department dan placement dari position yang dipilih
        if (selected.department_code || selected.placement_code) {
          this.form.department_code = selected.department_code;
          this.form.placement_code = selected.placement_code;
        }

        // Load supervisor jika position level > 4 dan department sudah ada
        if (this.shouldShowSupervisor && this.form.department_code) {
          await this.loadSupervisor(this.form.department_code);
        }
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

  private handleEndDateLogic() {
    // Jika status aktif (1) dan employee_type Permanent, maka end_date disabled dan dikosongkan
    if (this.isEndDateDisabled) {
      this.form.end_date = "";
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
    return this.form.status === "1" && this.form.employee_type === "Permanent";
  }

  get defaultEndDate(): string {
    if (this.isEndDateDisabled) {
      return "";
    }
    return this.form.end_date || "";
  }

  get shouldShowSupervisor(): boolean {
    console.log("shouldShowSupervisor", this.shouldShowSupervisor);
    if (!this.form.position_code) {
      return false;
    }

    const selectedPosition = this.positionOptions.find(
      (p) => p.code === this.form.position_code
    );

    if (!selectedPosition) {
      return false;
    }

    return parseInt(selectedPosition.level) > 4;
  }

  get filteredSupervisorOptions() {
    if (this.supervisorOptions) {
      return this.supervisorOptions.map((supervisor: any) => ({
        employee_id: supervisor.employee_id,
        name: supervisor.first_name,
      }));
    } else {
      return [];
    }
  }
}
