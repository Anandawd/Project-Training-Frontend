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

  genderOptions: any = [
    {
      SubGroupName: "Gender",
      code: "M",
      name: "Male",
    },
    {
      SubGroupName: "Gender",
      code: "F",
      name: "Female",
    },
  ];
  employeeStatusOptions: any = [
    {
      SubGroupName: "Status",
      code: "A",
      name: "Active",
    },
    {
      SubGroupName: "Status",
      code: "I",
      name: "Inactive",
    },
  ];
  employeeTypeOptions: any = [
    {
      SubGroupName: "Permanent Employees",
      code: "PE01",
      name: "Full-time",
    },
    {
      SubGroupName: "Permanent Employees",
      code: "PE02",
      name: "Permanent",
    },
    {
      SubGroupName: "Non-Permanent Employees",
      code: "NPE01",
      name: "Contact",
    },
    {
      SubGroupName: "Non-Permanent Employees",
      code: "NPE02",
      name: "Part-time",
    },
    {
      SubGroupName: "Non-Permanent Employees",
      code: "NPE03",
      name: "Seasonal",
    },
    {
      SubGroupName: "Non-Permanent Employees",
      code: "NPE04",
      name: "Casual",
    },
    {
      SubGroupName: "Non-Permanent Employees",
      code: "NPE05",
      name: "Intern",
    },
    {
      SubGroupName: "Non-Permanent Employees",
      code: "NPE06",
      name: "Probationary",
    },
    {
      SubGroupName: "Non-Employees",
      code: "NE01",
      name: "Freelancer",
    },
    {
      SubGroupName: "Non-Employees",
      code: "NE02",
      name: "Contractor",
    },
    {
      SubGroupName: "Non-Employees",
      code: "NE03",
      name: "Consultant",
    },
    {
      SubGroupName: "Non-Employees",
      code: "NE04",
      name: "Vendor",
    },
    {
      SubGroupName: "Former Employees",
      code: "FE01",
      name: "Resigned",
    },
    {
      SubGroupName: "Former Employees",
      code: "FE02",
      name: "Retired",
    },
    {
      SubGroupName: "Former Employees",
      code: "FE03",
      name: "Terminated",
    },
    {
      SubGroupName: "Former Employees",
      code: "FE04",
      name: "Expired-contract",
    },
  ];
  departmentOptions: any = [
    {
      SubGroupName: "Department",
      code: "D01",
      name: "Marketing",
    },
    {
      SubGroupName: "Department",
      code: "D02",
      name: "Human Resource",
    },
    {
      SubGroupName: "Department",
      code: "D03",
      name: "Operational",
    },
    {
      SubGroupName: "Department",
      code: "D04",
      name: "IT",
    },
  ];
  positionOptions: any = [
    {
      SubGroupName: "Position",
      code: "P01",
      name: "Owner",
    },
    {
      SubGroupName: "Position",
      code: "P02",
      name: "Director",
    },
    {
      SubGroupName: "Position",
      code: "P03",
      name: "Manager",
    },
    {
      SubGroupName: "Position",
      code: "P04",
      name: "Supervisor",
    },
    {
      SubGroupName: "Position",
      code: "P05",
      name: "Senior Staff",
    },
    {
      SubGroupName: "Position",
      code: "P06",
      name: "Staff",
    },
    {
      SubGroupName: "Position",
      code: "P07",
      name: "Assistant",
    },
    {
      SubGroupName: "Position",
      code: "P08",
      name: "Trainee",
    },
    {
      SubGroupName: "Position",
      code: "P09",
      name: "Intern",
    },
    {
      SubGroupName: "Position",
      code: "P10",
      name: "Part-timer",
    },
  ];
  placementOptions: any = [
    {
      SubGroupName: "Placement",
      code: "PR01",
      name: "Amora Ubud",
    },
    {
      SubGroupName: "Placement",
      code: "PR02",
      name: "Amora Canggu",
    },
  ];
  supervisorOptions: any = [
    {
      SubGroupName: "Supervisor",
      code: "SPV01",
      name: "Budi Santoso",
    },
    {
      SubGroupName: "Supervisor",
      code: "SPV02",
      name: "Sari Dewi",
    },
  ];
  benefitComponentOptions: any = [
    {
      SubGroupName: "Benefit Component",
      code: "BC01",
      name: "Tunjangan Makan",
    },
    {
      SubGroupName: "Benefit Component",
      code: "BC02",
      name: "Tunjangan Transportasi",
    },
    {
      SubGroupName: "Benefit Component",
      code: "BC03",
      name: "Tunjangan Jabatan",
    },
  ];
  salaryTypeOptions: any = [
    {
      SubGroupName: "Salary Type",
      code: "ST01",
      name: "Daily",
    },
    {
      SubGroupName: "Salary Type",
      code: "ST02",
      name: "Weekly",
    },
    {
      SubGroupName: "Salary Type",
      code: "ST03",
      name: "Bi-weekly",
    },
    {
      SubGroupName: "Salary Type",
      code: "ST04",
      name: "Monthly",
    },
  ];
  paymentMethodOptions: any = [
    {
      SubGroupName: "Payment Method",
      code: "PM01",
      name: "Cash",
    },
    {
      SubGroupName: "Payment Method",
      code: "PM02",
      name: "Bank Transfer",
    },
    {
      SubGroupName: "Payment Method",
      code: "PM03",
      name: "E-wallet Transfer",
    },
    {
      SubGroupName: "Payment Method",
      code: "PM04",
      name: "Virtual Account",
    },
  ];
  bankNameOptions: any = [
    {
      SubGroupName: "Bank Name",
      code: "BN01",
      name: "Bank BCA",
    },
    {
      SubGroupName: "Bank Name",
      code: "BN01",
      name: "Bank BRI",
    },
    {
      SubGroupName: "Bank Name",
      code: "BN01",
      name: "Bank BNI",
    },
    {
      SubGroupName: "Bank Name",
      code: "BN01",
      name: "Bank Mandiri",
    },
  ];
  maritialStatusOptions: any = [
    {
      SubGroupName: "Maritial Status",
      code: "TK0",
      name: "Tidak Kawin, Tanpa Tanggungan",
    },
    {
      SubGroupName: "Maritial Status",
      code: "TK1",
      name: "Tidak Kawin, Tanggungan 1",
    },
    {
      SubGroupName: "Maritial Status",
      code: "TK2",
      name: "Tidak Kawin, Tanggungan 2",
    },
    {
      SubGroupName: "Maritial Status",
      code: "TK3",
      name: "Tidak Kawin, Tanggungan 3",
    },
    {
      SubGroupName: "Maritial Status",
      code: "K0",
      name: "Kawin, Tanpa Tanggungan",
    },
    {
      SubGroupName: "Maritial Status",
      code: "K1",
      name: "Kawin, Tanggungan 1",
    },
    {
      SubGroupName: "Maritial Status",
      code: "K2",
      name: "Kawin, Tanggungan 2",
    },
    {
      SubGroupName: "Maritial Status",
      code: "K3",
      name: "Kawin, Tanggungan 3",
    },
    {
      SubGroupName: "Maritial Status",
      code: "KI0",
      name: "Kawin, Istri Bekerja, Tanpa Tanggungan",
    },
    {
      SubGroupName: "Maritial Status",
      code: "KI1",
      name: "Kawin, Istri Bekerja, Tanggungan 1",
    },
    {
      SubGroupName: "Maritial Status",
      code: "KI2",
      name: "Kawin, Istri Bekerja, Tanggungan 2",
    },
    {
      SubGroupName: "Maritial Status",
      code: "KI3",
      name: "Kawin, Istri Bekerja, Tanggungan 3",
    },
  ];
  workScheduleOptions: any = [
    {
      SubGroupName: "Work Schedule",
      code: "WS01",
      name: "Fixed Schedule",
    },
    {
      SubGroupName: "Work Schedule",
      code: "WS02",
      name: "Shift Schedule",
    },
    {
      SubGroupName: "Work Schedule",
      code: "WS03",
      name: "Rotating Schedule",
    },
    {
      SubGroupName: "Work Schedule",
      code: "WS04",
      name: "Split Shift",
    },
    {
      SubGroupName: "Work Schedule",
      code: "WS05",
      name: "On-call Schedule",
    },
    {
      SubGroupName: "Work Schedule",
      code: "WS06",
      name: "Flexible Schedule",
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
      // personal information
      employeeId: "",
      firstname: "",
      lastname: "",
      gender: "M",
      birthdate: "",
      email: "",
      phoneNumber: "",
      address: "",
      // employee information
      hireDate: "",
      endDate: new Date().toISOString().split("T")[0],
      employeeStatus: 1,
      employeeType: "",
      department: "",
      position: "",
      placement: "",
      supervisor: "",
      // financial information
      baseSalary: "",
      benefitComponent: "",
      salaryType: "",
      paymentMethod: "",
      bankName: "",
      bankAccountNumber: "",
      bankAccountHolder: "",
      // tax and identification data
      taxNumber: "",
      maritialStatus: "",
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
