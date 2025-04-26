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
  // Refs
  inputFormValidation: any = ref();
  inputFormElement: any = ref();

  // Props and data from route
  modeData: any;
  periodId: any = "";
  employeeId: any = "";

  // UI State
  public isSave: boolean = false;
  public isLoading: boolean = false;
  public showDialog: boolean = false;
  public showForm: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Component editing
  public editingComponent: any = null;

  // Employee Data
  public employee: any = reactive({
    id: 0,
    employee_id: "",
    employee_name: "",
    placement: "",
    department: "",
    position: "",
    gender: "",
    tax_number: "",
    maritial_status: "",
    employee_type: "",
    bank_name: "",
    bank_account_holder: "",
    bank_account_number: "",
  });

  // Period data
  public periodData: any = reactive({
    id: 0,
    period_name: "",
    placement: "",
    period_type: "",
    start_date: "",
    end_date: "",
    payment_date: "",
    remark: "",
    status: "",
    created_by: "",
    created_at: "",
    updated_at: "",
  });

  // Payroll Components
  public payrollComponents: any = reactive([]);

  // Payroll Data
  public form: any = reactive({
    employee_id: "",
    period_id: "",

    base_salary: 0,
    allowances: 0,
    incentives: 0,
    thr: 0,
    overtime: 0,
    reimbursements: 0,

    company_bpjs_health: 0,
    company_bpjs_jkk: 0,
    company_bpjs_jkm: 0,

    employee_bpjs_health: 0,
    employee_bpjs_jp: 0,
    employee_bpjs_jht: 0,
    position_deduction: 0,
    loan_installment: 0,
    absent_deduction: 0,
    late_arrival_deduction: 0,
    other_deduction: 0,

    total_gross_salary_taxable: 11473000,
    pkp: 4000000,
    tax_rate: 4,
    tax_amount: 458920,
    tax_amount_floor_up: 459000,

    total_gross_salary: 12473000,
    total_deduction_salary: 830000,
    take_home_pay: 11184000,

    ter_category: "A",
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
      this.isLoading = true;
      const periodId = this.$route.params.periodId;
      const employeeId = this.$route.params.employeeId;

      // In a real implementation, you would make API calls here
      // const { data } = await payrollAPI.GetEmployeePayrollDetail(this.periodId, this.employeeId);
      // this.employee = data.employee;
      // this.form = data.payroll;
      // this.periodData = data.period;
      // this.payrollComponents = data.components;

      // For demonstration, we'll load some mock data
      await this.loadMockData();

      // Set the basic form values
      this.form.employee_id = this.employee.employee_id;
      this.form.period_id = this.periodData.id;

      // Calculate all totals
      this.calculateTotals();
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMockData() {
    this.employee = {
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
    };

    this.periodData = {
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
    };

    this.payrollComponents = [
      // Earnings Components
      {
        id: 1,
        component_id: "EC001",
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
        component_id: "EC002",
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
      // Add more mock components as needed
      // Deduction Components
      {
        id: 9,
        component_id: "DC001",
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
      // Statutory Components
      {
        id: 16,
        component_id: "SC001",
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
    ];
  }

  handleSave(formData: any, mode: any) {
    if (mode === $global.modePayroll.save) {
      this.savePayroll();
    } else {
      this.addComponent(formData);
    }
  }

  async savePayroll() {
    try {
      this.isSave = true;
      this.calculateTotals();

      const payrollData = {
        // id: null,
        employee_id: this.employeeId,
        period_id: this.periodId,
        basic_salary: this.form.base_salary,
        gross_salary: this.form.total_gross_salary,
        total_deductions: this.form.total_deductions,
        tax_amount: this.form.tax_amount_floor_up,
        net_salary: this.form.take_home_pay,
        status: "Draft",
        components: this.payrollComponents,
      };

      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.SaveEmployeePayroll(payrollData);

      // if (status2.status === 0) {
      //   getToastSuccess(this.$t("messages.saveSuccess"));
      // }

      // For demonstration, just show success message
      getToastSuccess("Employee payroll saved successfully");
    } catch (error) {
      getError(error);
    } finally {
      this.isSave = false;
    }
  }

  async submitPayroll() {
    try {
      this.isSave = true;
      this.calculateTotals();

      const payrollData = {
        // id: null,
        employee_id: this.employeeId,
        period_id: this.periodId,
        basic_salary: this.form.base_salary,
        gross_salary: this.form.total_gross_salary,
        total_deductions: this.form.total_deductions,
        tax_amount: this.form.tax_amount_floor_up,
        net_salary: this.form.take_home_pay,
        status: "Pending", // Changed to Pending for submission
        components: this.payrollComponents,
      };

      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.SubmitEmployeePayroll(payrollData);

      // if (status2.status === 0) {
      //   getToastSuccess(this.$t("messages.submitSuccess"));
      //   this.form.status = "Pending";
      // }

      // For demonstration, just show success message and update status
      this.form.status = "Pending";
      getToastSuccess("Employee payroll submitted for approval");
    } catch (error) {
      getError(error);
    } finally {
      this.isSave = false;
    }
  }

  addComponent(componentData: any) {}

  editComponent(component: any) {}

  deleteComponent(component: any) {}

  handleShowForm(params: any, mode: any) {
    this.modeData = mode;

    if (mode === $global.modeData.edit && params) {
      this.editingComponent = params;
    } else {
      this.editingComponent = null;
    }

    if (this.inputFormElement && this.inputFormElement.initialize) {
      this.inputFormElement.initialize();
    }

    this.showForm = true;
  }

  handleSubmitForApproval() {
    this.dialogMessage =
      "Are you sure you want to submit this employee payroll for approval?";
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  confirmAction() {
    if (this.dialogAction === "submit") {
      this.submitPayroll();
    } else if (this.dialogAction === "delete") {
      if (this.editingComponent) {
        this.deleteComponent(this.editingComponent);
      }
    }
    this.showDialog = false;
  }

  goBack() {
    this.$router.push({
      name: "PeriodDetail",
      params: { id: this.periodId },
    });
  }

  created(): void {
    this.periodId = this.$route.params.periodId;
    this.employeeId = this.$route.params.employeeId;
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

  /**
   * Calculation Methods
   */
  calculateTotals() {
    // Reset all totals
    this.resetTotals();

    // Calculate totals for each component type
    this.calculateEarningsTotals();
    this.calculateDeductionsTotals();
    this.calculateStatutoryTotals();

    // Calculate taxable earnings for tax calculation
    this.calculateTaxableEarnings();

    // Calculate tax
    this.calculateTax();

    // Calculate final totals
    this.calculateFinalTotals();
  }

  resetTotals() {
    // Reset earnings totals
    this.form.base_salary = 0;
    this.form.allowances = 0;
    this.form.incentives = 0;
    this.form.thr = 0;
    this.form.overtime = 0;
    this.form.reimbursements = 0;

    // Reset deduction totals
    this.form.bpjs_health_employee = 0;
    this.form.bpjs_employment_employee = 0;
    this.form.position_deduction = 0;
    this.form.loan_installment = 0;
    this.form.absent_deduction = 0;
    this.form.late_arrival_deduction = 0;
    this.form.other_deduction = 0;

    // Reset statutory totals
    this.form.company_bpjs_health = 0;
    this.form.company_bpjs_jkk = 0;
    this.form.company_bpjs_jkm = 0;

    // Reset tax totals
    this.form.total_gross_salary_taxable = 0;
    this.form.pkp = 0;
    this.form.tax_amount = 0;
    this.form.tax_amount_floor_up = 0;

    // Reset final totals
    this.form.total_gross_salary = 0;
    this.form.total_deductions = 0;
    this.form.take_home_pay = 0;
  }

  calculateEarningsTotals() {
    // Get all earnings components
    const earningsComponents = this.getComponentsByType("earnings");

    // Calculate each category total
    earningsComponents.forEach((component: any) => {
      const totalAmount = component.amount * component.quantity;

      switch (component.category) {
        case "Basic":
          this.form.base_salary += totalAmount;
          break;
        case "Fixed Allowance":
        case "Variable Allowance":
          this.form.allowances += totalAmount;
          break;
        case "Incentive":
          this.form.incentives += totalAmount;
          break;
        case "Religious Holiday Allowance":
          this.form.thr += totalAmount;
          break;
        case "Overtime":
          this.form.overtime += totalAmount;
          break;
        case "Reimbursement":
          this.form.reimbursements += totalAmount;
          break;
      }
    });
  }

  calculateDeductionsTotals() {
    // Get all deductions components
    const deductionsComponents = this.getComponentsByType("deductions");

    // Calculate each category total
    deductionsComponents.forEach((component: any) => {
      const totalAmount = component.amount * component.quantity;

      switch (component.name) {
        case "BPJS Health Employee":
          this.form.bpjs_health_employee += totalAmount;
          break;
        case "BPJS JHT Employee":
        case "BPJS JP Employee":
          this.form.bpjs_employment_employee += totalAmount;
          break;
        case "Position Deduction":
          this.form.position_deduction += totalAmount;
          break;
        case "Loan Installment":
          this.form.loan_installment += totalAmount;
          break;
        case "Unpaid Leave":
          this.form.absent_deduction += totalAmount;
          break;
        case "Late Arrival":
          this.form.late_arrival_deduction += totalAmount;
          break;
        case "PPh 21":
          // Skip tax component as it will be calculated separately
          break;
        default:
          this.form.other_deduction += totalAmount;
          break;
      }
    });
  }

  calculateStatutoryTotals() {
    // Get all statutory components
    const statutoryComponents = this.getComponentsByType("statutory");

    // Calculate each category total
    statutoryComponents.forEach((component: any) => {
      const totalAmount = component.amount * component.quantity;

      switch (component.name) {
        case "BPJS Health Company":
          this.form.company_bpjs_health += totalAmount;
          break;
        case "BPJS JKK":
          this.form.company_bpjs_jkk += totalAmount;
          break;
        case "BPJS JKM":
          this.form.company_bpjs_jkm += totalAmount;
          break;
      }
    });
  }

  calculateTaxableEarnings() {
    // Calculate taxable earnings (all earnings and statutory that are taxable)
    let taxableEarnings = 0;

    // Add taxable earnings
    this.payrollComponents.forEach((component: any) => {
      if (component.is_taxable) {
        taxableEarnings += component.amount * component.quantity;
      }
    });

    // Set taxable earnings
    this.form.total_gross_salary_taxable = taxableEarnings;

    // Calculate PKP (estimated annual taxable income)
    // This is a simplified calculation - in a real system, you would need more complex logic
    this.form.pkp = this.calculatePkp(taxableEarnings);
  }

  calculatePkp(monthlyTaxableIncome: number) {
    // This is a simplified calculation
    // Assuming monthly income * 12 for annual income
    const annualIncome = monthlyTaxableIncome * 12;

    // Assuming PTKP for TK/0 is Rp 54,000,000 per year
    const ptkp = 54000000;

    // PKP = Annual income - PTKP
    const pkp = Math.max(0, annualIncome - ptkp);

    return pkp;
  }

  calculateTax() {
    // This is a simplified implementation of Indonesian income tax calculation
    // In a real system, you would need more complex logic based on tax brackets

    let annualTax = 0;
    const pkp = this.form.pkp;

    // Tax rates based on PKP brackets (simplified)
    if (pkp <= 50000000) {
      // 5% for first 50 million
      annualTax = pkp * 0.05;
      this.form.tax_rate = 5;
    } else if (pkp <= 250000000) {
      // 5% for first 50 million + 15% for next 200 million
      annualTax = 50000000 * 0.05 + (pkp - 50000000) * 0.15;
      this.form.tax_rate = 15;
    } else if (pkp <= 500000000) {
      // 5% for first 50 million + 15% for next 200 million + 25% for next 250 million
      annualTax = 50000000 * 0.05 + 200000000 * 0.15 + (pkp - 250000000) * 0.25;
      this.form.tax_rate = 25;
    } else {
      // 5% for first 50 million + 15% for next 200 million + 25% for next 250 million + 30% for the remainder
      annualTax =
        50000000 * 0.05 +
        200000000 * 0.15 +
        250000000 * 0.25 +
        (pkp - 500000000) * 0.3;
      this.form.tax_rate = 30;
    }

    // Calculate monthly tax (annual tax / 12)
    const monthlyTax = annualTax / 12;

    // Set tax amount
    this.form.tax_amount = monthlyTax;

    // Round up to nearest 1000
    this.form.tax_amount_floor_up = Math.ceil(monthlyTax / 1000) * 1000;

    // Update or add tax component
    this.updateTaxComponent();
  }

  updateTaxComponent() {
    // Find existing tax component
    const taxComponent = this.payrollComponents.find(
      (component: any) =>
        component.name === "PPh 21" && component.type === "deductions"
    );

    if (taxComponent) {
      // Update existing tax component
      taxComponent.amount = this.form.tax_amount_floor_up;
      taxComponent.original_amount = this.form.tax_amount_floor_up;
      taxComponent.prorata_amount = this.form.tax_amount_floor_up;
    } else {
      // Add new tax component
      this.payrollComponents.push({
        id: new Date().getTime(), // Temporary ID
        component_id: "DC008",
        name: "PPh 21",
        type: "deductions",
        category: "Tax",
        amount: this.form.tax_amount_floor_up,
        original_amount: this.form.tax_amount_floor_up,
        prorata_amount: this.form.tax_amount_floor_up,
        is_taxable: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: false,
        apply_prorata: false,
        unit: "",
        quantity: 1,
        remark: "Income tax (PPh 21)",
      });
    }
  }

  calculateFinalTotals() {
    // Calculate gross salary (all earnings + taxable statutory)
    let grossSalary = 0;

    // Add all earnings and statutory components
    this.payrollComponents.forEach((component: any) => {
      if (
        component.type === "earnings" ||
        (component.type === "statutory" && component.is_taxable)
      ) {
        grossSalary += component.amount * component.quantity;
      }
    });

    this.form.total_gross_salary = grossSalary;

    // Calculate total deductions (all deductions)
    let totalDeductions = 0;

    // Add all deduction components
    this.payrollComponents.forEach((component: any) => {
      if (component.type === "deductions") {
        totalDeductions += component.amount * component.quantity;
      }
    });

    this.form.total_deductions = totalDeductions;

    // Calculate take home pay (gross salary - deductions)
    this.form.take_home_pay =
      this.form.total_gross_salary - this.form.total_deductions;
  }
  /**
   * Helper Methods
   */
  getComponentsByType(type: string) {
    return this.payrollComponents.filter(
      (component: any) => component.type === type
    );
  }
}
