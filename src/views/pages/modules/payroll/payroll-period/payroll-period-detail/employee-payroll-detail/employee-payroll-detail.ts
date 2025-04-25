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
import CInputForm from "./component-input-form/component-input-form.vue";

@Options({
  name: "EmployeePayrollDetail",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CInputForm,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class EmployeePayrollDetail extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  public isSave: boolean = false;
  public showDialog: boolean = false;
  public showForm: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public inputFormElement: any = ref();

  // Employee Data
  public employee: any = ref({
    id: 1,
    employee_id: "EMP001",
    employee_name: "John Doe",
    placement: "Amora Ubud",
    department: "IT",
    position: "Staff",
    gender: "Male",
    tax_number: "10101010",
    maritial_status: "TK0",
    employee_type: "Fixed Employee",
    bank_name: "BRI",
    bank_account_holder: "JOHN DOE",
    bank_account_number: "101010101",
  });

  // Period data
  public periodData: any = reactive({
    id: 1,
    period_name: "April 2025",
    placement: "Amora Ubud",
    period_type: "Monthly",
    start_date: "01/04/2025",
    end_date: "30/04/2025",
    payment_date: "01/05/2025",
    remark: "",
    status: "Draft",
    created_by: "Budi Admin",
    created_at: "25/04/2025",
    updated_at: "25/04/2025",
  });

  // Payroll Data
  public form: any = reactive({
    employee_id: "",
    period_id: "",

    base_salary: 10000000,
    allowance: 1000000,
    incentive: 0,
    thr: 0,
    jkm: 33000,
    jkk: 97900,
    bpjs_health: 440000,
    overtime: 0,
    reimburse: 1000000,

    jp: 110000,
    jht: 220000,
    position_deduction: 500000,
    loan_installment: 0,
    unpaid_leave: 0,
    late_arrival: 0,

    total_gross_salary_taxable: 11473000,
    tax_rate: 4,
    tax_amount: 458920,
    tax_amount_floor_up: 459000,

    total_gross_salary: 12473000,
    total_deduction_salary: 830000,
    take_home_pay: 11184000,

    ter_category: "A",
    is_taxable: true,
    is_included_in_bpjs_health: true,
    is_included_in_bpjs_employee: true,
    status: "Draft",
  });

  placementOptions: any = [
    {
      SubGroupName: "Placement",
      code: "P001",
      name: "Amora Ubud",
    },
    {
      SubGroupName: "Placement",
      code: "P001",
      name: "Amora Canggu",
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
      placement: "P001",
      periodName: "April 2025",
      periodType: "PT004",
      startDate: "",
      endDate: "",
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

  handleShowForm(params: any, mode: any) {
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
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
