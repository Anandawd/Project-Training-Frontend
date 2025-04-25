import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
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
})
export default class EmployeePayrollDetail extends Vue {
  inputFormValidation: any = ref();
  modeData: any = $global.modeData.edit;
  public isSave: boolean = false;
  public showDialog: boolean = false;
  public showForm: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public inputFormElement: any = ref();

  // Employee Data
  public employee: any = reactive({
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
    pkp: 4000000,
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

  // validation
  get schema() {
    return Yup.object().shape({});
  }

  // Actions
  async loadData() {
    try {
      const periodId = this.$route.params.periodId;
      const employeeId = this.$route.params.employeeId;

      // In a real implementation, you would make API calls here
      // const { data } = await payrollAPI.GetEmployeePayrollDetail(periodId, employeeId);
      // this.employee = data.employee;
      // this.form = data.payroll;
      // this.periodData = data.period;

      this.form.employee_id = this.employee.employee_id;
      this.form.period_id = this.periodData.id;

      this.calculateTotals();
    } catch (error) {
      getError(error);
    }
  }

  calculateTotals() {
    // Calculate gross salary (base salary + all earnings)
    this.form.gross_salary =
      this.form.base_salary +
      this.form.allowance +
      this.form.incentive +
      this.form.thr +
      this.form.jkm +
      this.form.jkk +
      this.form.bpjs_health +
      this.form.overtime +
      this.form.reimburse;

    // Calculate total deductions
    this.form.total_deductions =
      this.form.bpjs_health_employee +
      this.form.bpjs_employment_employee +
      this.form.tax_amount +
      this.form.loan_installment +
      this.form.absent_deduction +
      this.form.late_arrival_deduction +
      this.form.other_deduction;

    // Calculate net salary
    this.form.net_salary = this.form.gross_salary - this.form.total_deductions;
  }

  handleSave() {
    this.isSave = true;
    setTimeout(() => {
      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.SaveEmployeePayroll(this.form);

      this.form.status = "Draft";
      getToastSuccess("Employee payroll saved successfully");
      this.isSave = false;
    }, 1000);
  }

  confirmAction() {
    if (this.dialogAction === "submit") {
      this.submitPayroll();
    }
    this.showDialog = false;
  }

  submitPayroll() {
    this.isSave = true;
    setTimeout(() => {
      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.SubmitEmployeePayroll(this.form);

      this.form.status = "Pending";
      getToastSuccess("Employee payroll submitted for approval");
      this.isSave = false;
    }, 1000);
  }

  handleSubmitForApproval() {
    this.dialogMessage =
      "Are you sure you want to submit this employee payroll for approval?";
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  goBack() {
    this.$router.push({
      name: "PeriodDetail",
      params: { id: this.periodData.id },
    });
  }

  created(): void {
    this.loadData();
  }

  get canSubmit() {
    return this.periodData.status === "Draft" && this.form.status === "Draft";
  }

  get totalEarnings() {
    return (
      this.form.base_salary +
      this.form.allowance +
      this.form.incentive +
      this.form.thr +
      this.form.jkm +
      this.form.jkk +
      this.form.bpjs_health +
      this.form.overtime +
      this.form.reimburse
    );
  }

  get totalDeductions() {
    return (
      this.form.bpjs_health_employee +
      this.form.bpjs_employment_employee +
      this.form.tax_amount +
      this.form.loan_installment +
      this.form.absent_deduction +
      this.form.late_arrival_deduction +
      this.form.other_deduction
    );
  }

  get netSalary() {
    return this.totalEarnings - this.totalDeductions;
  }

  get formattedBaseSalary() {
    return this.form.base_salary.toLocaleString();
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
}
