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

  // Payroll Components
  public payrollComponents: any = reactive([
    // Earnings Components
    {
      id: 1,
      component_id: 101,
      name: "Base Salary",
      type: "earnings",
      category: "Basic",
      amount: 10000000,
      original_amount: 10000000,
      prorata_amount: 10000000,
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      unit: "",
      quantity: 1,
      remark: "",
    },
    {
      id: 2,
      component_id: 102,
      name: "Transport Allowance",
      type: "earnings",
      category: "Fixed Allowance",
      amount: 1500000,
      original_amount: 1500000,
      prorata_amount: 1500000,
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      unit: "",
      quantity: 1,
      remark: "Monthly transportation allowance",
    },
    {
      id: 3,
      component_id: 103,
      name: "Meal Allowance",
      type: "earnings",
      category: "Fixed Allowance",
      amount: 1000000,
      original_amount: 1000000,
      prorata_amount: 1000000,
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      unit: "",
      quantity: 1,
      remark: "",
    },
    {
      id: 4,
      component_id: 104,
      name: "Position Allowance",
      type: "earnings",
      category: "Fixed Allowance",
      amount: 2000000,
      original_amount: 2000000,
      prorata_amount: 2000000,
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      unit: "",
      quantity: 1,
      remark: "",
    },
    {
      id: 5,
      component_id: 105,
      name: "Overtime",
      type: "earnings",
      category: "Variable Allowance",
      amount: 750000,
      original_amount: 50000,
      prorata_amount: 750000,
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "Hours",
      quantity: 15,
      remark: "Overtime hours for April 2025",
    },
    {
      id: 6,
      component_id: 106,
      name: "Performance Bonus",
      type: "earnings",
      category: "Incentive",
      amount: 3000000,
      original_amount: 3000000,
      prorata_amount: 3000000,
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "",
      quantity: 1,
      remark: "Quarterly performance bonus",
    },
    {
      id: 7,
      component_id: 107,
      name: "THR",
      type: "earnings",
      category: "Religious Holiday Allowance",
      amount: 0,
      original_amount: 0,
      prorata_amount: 0,
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: true,
      unit: "",
      quantity: 1,
      remark: "Tunjangan Hari Raya",
    },
    {
      id: 8,
      component_id: 108,
      name: "Reimbursement",
      type: "earnings",
      category: "Reimbursement",
      amount: 450000,
      original_amount: 450000,
      prorata_amount: 450000,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "",
      quantity: 1,
      remark: "Internet and mobile phone reimbursement",
    },

    // Deduction Components
    {
      id: 9,
      component_id: 201,
      name: "BPJS Health Employee",
      type: "deductions",
      category: "Statutory",
      amount: 110000,
      original_amount: 110000,
      prorata_amount: 110000,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      unit: "%",
      quantity: 1,
      remark: "Employee portion of BPJS Kesehatan (1%)",
    },
    {
      id: 10,
      component_id: 202,
      name: "BPJS JHT Employee",
      type: "deductions",
      category: "Statutory",
      amount: 220000,
      original_amount: 220000,
      prorata_amount: 220000,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      unit: "%",
      quantity: 1,
      remark: "Employee portion of BPJS JHT (2%)",
    },
    {
      id: 11,
      component_id: 203,
      name: "BPJS JP Employee",
      type: "deductions",
      category: "Statutory",
      amount: 110000,
      original_amount: 110000,
      prorata_amount: 110000,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      unit: "%",
      quantity: 1,
      remark: "Employee portion of BPJS JP (1%)",
    },
    {
      id: 12,
      component_id: 204,
      name: "Position Deduction",
      type: "deductions",
      category: "Fixed Deduction",
      amount: 500000,
      original_amount: 500000,
      prorata_amount: 500000,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: true,
      unit: "",
      quantity: 1,
      remark: "Biaya jabatan",
    },
    {
      id: 13,
      component_id: 205,
      name: "Loan Installment",
      type: "deductions",
      category: "Loan",
      amount: 0,
      original_amount: 0,
      prorata_amount: 0,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "",
      quantity: 1,
      remark: "Employee loan repayment",
    },
    {
      id: 14,
      component_id: 206,
      name: "Unpaid Leave",
      type: "deductions",
      category: "Variable Deduction",
      amount: 0,
      original_amount: 0,
      prorata_amount: 0,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "Days",
      quantity: 0,
      remark: "Unpaid leave deduction",
    },
    {
      id: 15,
      component_id: 207,
      name: "Late Arrival",
      type: "deductions",
      category: "Variable Deduction",
      amount: 0,
      original_amount: 0,
      prorata_amount: 0,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "Hours",
      quantity: 0,
      remark: "Late arrival deduction",
    },

    // Statutory Components (Company Contributions - not deducted from employee)
    {
      id: 16,
      component_id: 301,
      name: "BPJS Health Company",
      type: "statutory",
      category: "Company Contribution",
      amount: 440000,
      original_amount: 440000,
      prorata_amount: 440000,
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      unit: "%",
      quantity: 1,
      remark: "Company portion of BPJS Kesehatan (4%)",
    },
    {
      id: 17,
      component_id: 302,
      name: "BPJS JKK",
      type: "statutory",
      category: "Company Contribution",
      amount: 97900,
      original_amount: 97900,
      prorata_amount: 97900,
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      unit: "%",
      quantity: 1,
      remark: "Company portion of BPJS JKK (0.89%)",
    },
    {
      id: 18,
      component_id: 303,
      name: "BPJS JKM",
      type: "statutory",
      category: "Company Contribution",
      amount: 33000,
      original_amount: 33000,
      prorata_amount: 33000,
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      unit: "%",
      quantity: 1,
      remark: "Company portion of BPJS JKM (0.3%)",
    },

    // Tax Component (calculated based on taxable earnings minus deductions)
    {
      id: 19,
      component_id: 401,
      name: "PPh 21",
      type: "deductions",
      category: "Tax",
      amount: 459000,
      original_amount: 459000,
      prorata_amount: 459000,
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      unit: "",
      quantity: 1,
      remark: "Income tax (PPh 21)",
    },
  ]);

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
    return Yup.object().shape({
      type: Yup.string().required("Component type is required"),
      component: Yup.string().required("Component is required"),
    });
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

  handleSave(formData: any, mode: any) {
    if (mode === $global.modePayroll.save) {
      this.isSave;
      setTimeout(() => {
        // In a real implementation, you would make an API call here
        // const { status2 } = await payrollAPI.SaveEmployeePayroll(this.form);
        this.form.status = "Draft";
        getToastSuccess("Employee payroll saved successfully");
        this.isSave = false;
        this.showForm = false;
      }, 1000);
    } else {
      // Handle component addition
      console.log("Adding component:", formData);
      getToastSuccess("Component added successfully");
      this.showForm = false;
    }
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

  handleShowForm(params: any, mode: any) {
    this.modeData = mode;
    if (this.inputFormElement && this.inputFormElement.initialize) {
      this.inputFormElement.initialize();
    }
    this.showForm = true;
  }

  getComponentsByType(type: string) {
    return this.payrollComponents.filter(
      (component: any) => component.type === type
    );
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
}
