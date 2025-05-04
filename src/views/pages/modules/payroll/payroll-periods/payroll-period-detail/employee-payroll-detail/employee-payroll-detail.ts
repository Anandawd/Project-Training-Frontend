import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { formatCurrency, formatNumber2 } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { Form as CForm } from "vee-validate";
import { reactive, ref, watch } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";
import CInputForm from "./component-input-form/component-input-form.vue";

interface PayrollComponent {
  id?: number;
  component_id: string;
  name: string;
  type: "earnings" | "deductions" | "statutory";
  category: string;
  amount: number;
  original_amount: number;
  prorate_amount: number;
  quantity: number;
  is_taxable: boolean;
  is_included_in_bpjs_health: boolean;
  is_included_in_bpjs_employee: boolean;
  is_fixed: boolean;
  is_prorated: boolean;
  unit: string;
  remark: string;
}

@Options({
  name: "EmployeePayrollDetail",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CInputForm,
    CModal,
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
  public isGenerating: boolean = false;
  public showDialog: boolean = false;
  public showForm: boolean = false;
  public showModal: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public formatCurrency = formatCurrency;
  public formatNumber2 = formatNumber2;

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
    salary_type: "monthly",
    tax_income_type: "",
    tax_method: "",
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
  public payrollComponents: PayrollComponent[] = reactive([]);

  // Payroll Data
  public form: any = reactive({
    employee_id: "",
    period_id: "",
    tax_income: "pph21",
    tax_method: "gross",
    base_salary: 0,
    overtime: 0,
    reimbursement: 0,
    loan: 0,

    company_bpjs_health: 0,
    company_bpjs_jkk: 0,
    company_bpjs_jkm: 0,

    employee_bpjs_health: 0,
    employee_bpjs_jp: 0,
    employee_bpjs_jht: 0,
    loan_installment: 0,
    absent_deduction: 0,
    late_arrival_deduction: 0,

    total_gross_salary_taxable: 0,
    total_deductions_salary_taxable: 0,
    pkp: 0,
    tax_rate: 0,
    ter_tax_rate: 0,
    progressive_tax_rate_layer_1: 5,
    progressive_tax_rate_layer_2: 15,
    progressive_tax_rate_layer_3: 25,
    progressive_tax_rate_layer_4: 30,
    progressive_tax_rate_layer_5: 35,
    tax_amount: 0,
    tax_amount_floor_up: 0,

    total_gross_salary: 0,
    total_deductions_salary: 0,
    take_home_pay: 0,

    ter_category: "",
    status: "Draft",
    workdays_in_month: 22,
    actual_workdays: 22,
    prorate_factor: 1,
    yearly_calculation: false,
  });

  public taxIncomeOptions: any = [
    { code: "PPH21", name: "PPh 21" },
    { code: "PPH26", name: "PPh 26" },
  ];

  public taxMethodOptions: any = [
    { code: "GROSS", name: "Gross" },
    { code: "GROSSUP", name: "Gross Up" },
    { code: "NETTO", name: "Netto" },
  ];

  // LIFECYCLE HOOKS
  created(): void {
    this.periodId = this.$route.params.periodId;
    this.employeeId = this.$route.params.employeeId;
    this.loadData();

    watch(
      () => this.form.workdays_in_month,
      () => this.calculateProrateFactor()
    );

    watch(
      () => this.form.actual_workdays,
      () => this.calculateProrateFactor()
    );
  }

  // METHODS
  async loadData() {
    try {
      this.isLoading = true;

      // In a real implementation, you would make API calls here
      // await Promise.all([
      //   this.loadPeriodData(this.periodId),
      //   this.loadEmployeeData(this.employeeId)
      // ]);

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
      maritial_status: "TK/0",
      employee_type: "Fixed Employee",
      salary_type: "monthly",
      bank_name: "BRI",
      bank_account_holder: "JOHN DOE",
      bank_account_number: "101010101",
      tax_income_type: "PPH21",
      tax_method: "GROSS",
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
      // Base salary component
      {
        id: 1,
        component_id: "EC001",
        name: "Base Salary",
        type: "earnings",
        category: "Basic",
        amount: 10000000,
        original_amount: 10000000,
        prorate_amount: 10000000,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: true,
        is_included_in_bpjs_employee: true,
        is_fixed: true,
        is_prorated: true,
        unit: "",
        remark: "Monthly base salary",
      },
      // Earnings Components
      {
        id: 2,
        component_id: "EC002",
        name: "Transport Allowance",
        type: "earnings",
        category: "Fixed Allowance",
        amount: 1000000,
        original_amount: 1000000,
        prorate_amount: 1000000,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: true,
        is_included_in_bpjs_employee: true,
        is_fixed: true,
        is_prorated: true,
        unit: "",
        remark: "Monthly transportation allowance",
      },
      {
        id: 3,
        component_id: "EC003",
        name: "Incentive",
        type: "earnings",
        category: "Incentive",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: false,
        is_prorated: true,
        unit: "",
        remark: "Monthly meal allowance",
      },
      {
        id: 4,
        component_id: "EC004",
        name: "THR",
        type: "earnings",
        category: "Variable Allowance",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: false,
        is_prorated: false,
        unit: "",
        remark: "",
      },
      {
        id: 5,
        component_id: "EC005",
        name: "JKM (0,3%)",
        type: "earnings",
        category: "Fix Allowance",
        amount: 33000,
        original_amount: 33000,
        prorate_amount: 33000,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "",
        remark: "",
      },
      {
        id: 6,
        component_id: "EC006",
        name: "JKK (0,89%)",
        type: "earnings",
        category: "Fix Allowance",
        amount: 97900,
        original_amount: 97900,
        prorate_amount: 97900,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "",
        remark: "",
      },
      {
        id: 7,
        component_id: "SC001",
        name: "BPJS Health Company",
        type: "earnings",
        category: "Company Contribution",
        amount: 440000,
        original_amount: 440000,
        prorate_amount: 440000,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "Company portion of BPJS Kesehatan (4%)",
      },
      {
        id: 8,
        component_id: "EC008",
        name: "Overtime",
        type: "earnings",
        category: "Variable Allowance",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        quantity: 1,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: false,
        is_prorated: false,
        unit: "Hours",
        remark: "Overtime hours",
      },
      {
        id: 9,
        component_id: "EC009",
        name: "Reimburse",
        type: "earnings",
        category: "Reimburse",
        amount: 1000000,
        original_amount: 1000000,
        prorate_amount: 1000000,
        quantity: 1,
        is_taxable: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: false,
        is_prorated: false,
        unit: "",
        remark: "",
      },
      {
        id: 10,
        component_id: "EC008",
        name: "Loan",
        type: "earnings",
        category: "Loan",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        quantity: 1,
        is_taxable: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: false,
        is_prorated: false,
        unit: "",
        remark: "",
      },
      // Deduction Components
      {
        id: 11,
        component_id: "DC001",
        name: "BPJS Health Employee",
        type: "deductions",
        category: "Statutory",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "Employee portion of BPJS Kesehatan (1%)",
      },
      {
        id: 12,
        component_id: "DC002",
        name: "BPJS Employee JP (1%)",
        type: "deductions",
        category: "Statutory",
        amount: 110000,
        original_amount: 110000,
        prorate_amount: 110000,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "",
      },
      {
        id: 13,
        component_id: "DC003",
        name: "BPJS Employee JHT (2%)",
        type: "deductions",
        category: "Statutory",
        amount: 220000,
        original_amount: 220000,
        prorate_amount: 220000,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "",
      },
      {
        id: 14,
        component_id: "DC004",
        name: "Position Deductions (5%)",
        type: "deductions",
        category: "Statutory",
        amount: 500000,
        original_amount: 500000,
        prorate_amount: 500000,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "",
      },
      {
        id: 15,
        component_id: "DC005",
        name: "Unpaid Leave",
        type: "deductions",
        category: "Statutory",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        is_taxable: true,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "",
      },
      {
        id: 16,
        component_id: "DC006",
        name: "Loan Installment",
        type: "deductions",
        category: "Statutory",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        is_taxable: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "",
      },
      {
        id: 17,
        component_id: "DC007",
        name: "Late Arrival",
        type: "deductions",
        category: "Statutory",
        amount: 0,
        original_amount: 0,
        prorate_amount: 0,
        is_taxable: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_fixed: true,
        is_prorated: false,
        unit: "%",
        quantity: 1,
        remark: "",
      },
    ];
  }

  async savePayroll() {
    try {
      this.isSave = true;

      this.calculateTotals();

      const payrollData = {
        employee_id: this.employeeId,
        period_id: this.periodId,
        basic_salary: this.form.base_salary,
        gross_salary: this.form.total_gross_salary,
        total_deductions: this.form.total_deductions_salary,
        tax_amount: this.form.tax_amount_floor_up,
        net_salary: this.form.take_home_pay,
        status: "Pending",
        components: this.payrollComponents,
        workdays_in_month: this.form.workdays_in_month,
        actual_workdays: this.form.actual_workdays,
        prorate_factor: this.form.prorate_factor,
      };

      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.SubmitEmployeePayroll(payrollData);

      // For demonstration, just show success message and update status
      this.form.status = "Pending";
      getToastSuccess("Employee payroll submitted for approval");
    } catch (error) {
      getError(error);
    } finally {
      this.isSave = false;
    }
  }

  async saveProrate() {
    try {
      if (!this.form.workdays_in_month || this.form.workdays_in_month <= 0) {
        getToastError("Work days in month must be greateer than 0");
        return;
      }

      if (!this.form.actual_workdays || this.form.actual_workdays <= 0) {
        getToastError("Actual work days must be greater than 0");
        return;
      }

      if (this.form.actual_workdays > this.form.workdays_in_month) {
        getToastError(
          "Actual work days cannot exceed total work days in month"
        );
        return;
      }

      this.isGenerating = true;

      this.calculateProrateFactor();

      this.payrollComponents.forEach((component: any) => {
        if (component.is_prorated) {
          component.prorate_amount =
            component.amount * Number(this.form.prorate_factor);
        }
      });

      this.calculateTotals();
      this.showModal = false;
      getToastSuccess("Prorate has been applied successfully");
    } catch (error) {
      getError(error);
    } finally {
      this.isGenerating = false;
    }
  }

  async submitPayroll() {
    try {
      this.isSave = true;

      this.calculateTotals();

      const payrollData = {
        employee_id: this.employeeId,
        period_id: this.periodId,
        basic_salary: this.form.base_salary,
        gross_salary: this.form.total_gross_salary,
        total_deductions: this.form.total_deductions_salary,
        tax_amount: this.form.tax_amount_floor_up,
        net_salary: this.form.take_home_pay,
        status: "Pending",
        components: this.payrollComponents,
        workdays_in_month: this.form.workdays_in_month,
        actual_workdays: this.form.actual_workdays,
        prorate_factor: this.form.prorate_factor,
      };

      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.SubmitEmployeePayroll(payrollData);

      // For demonstration, just show success message and update status
      this.form.status = "Pending";
      getToastSuccess("Employee payroll submitted for approval");
    } catch (error) {
      getError(error);
    } finally {
      this.isSave = false;
    }
  }

  addComponent(componentData: any) {
    const existingComponent = this.payrollComponents.find(
      (comp: PayrollComponent) =>
        comp.component_id === componentData.component_id
    );

    if (existingComponent) {
      getToastError("Component already exists in this payroll");
      this.showForm = false;
      return;
    }

    const newId = new Date().getTime();

    this.payrollComponents.push({
      id: newId,
      component_id: componentData.component_id,
      name: componentData.name,
      type: componentData.type,
      category: componentData.category,
      amount: componentData.amount,
      original_amount: componentData.amount,
      prorate_amount: componentData.is_prorated
        ? componentData.amount * this.form.prorate_factor
        : componentData.amount,
      is_taxable: componentData.is_taxable,
      is_included_in_bpjs_health: componentData.is_included_in_bpjs_health,
      is_included_in_bpjs_employee: componentData.is_included_in_bpjs_employee,
      is_fixed: componentData.is_fixed,
      is_prorated: componentData.is_prorated,
      unit: componentData.unit,
      quantity: componentData.quantity,
      remark: componentData.remark,
    });

    this.calculateTotals();

    this.showForm = false;

    getToastSuccess("Component added successfully");
  }

  onComponentAmountChange(component: PayrollComponent) {
    if (component.is_fixed) {
      component.amount = component.original_amount;
      return;
    }

    if (component.is_prorated) {
      component.prorate_amount =
        component.amount * Number(this.form.prorate_factor);
    } else {
      component.prorate_amount = component.amount;
    }

    this.calculateTotals();
  }

  onComponentQuantityChange(component: PayrollComponent) {
    if (component.quantity < 0) {
      component.quantity = 0;
    }

    if (component.is_fixed) {
      component.quantity = 1;
    }

    if (component.is_prorated) {
      component.prorate_amount =
        component.amount * Number(this.form.prorate_factor);
    } else {
      component.prorate_amount = component.amount;
    }

    this.calculateTotals();
  }

  getComponentsByType(type: string) {
    return this.payrollComponents.filter(
      (component: any) => component.type === type
    );
  }

  handleSave(formData: any, mode: any) {
    if (mode === $global.modePayroll.save) {
      this.savePayroll();
    } else if (mode === $global.modePayroll.prorate) {
      this.saveProrate();
    } else if (mode === $global.modePayroll.component) {
      this.addComponent(formData);
    } else {
      return;
    }
  }

  handleShowForm(params: any, mode: any) {
    this.modeData = mode;

    if (this.inputFormElement && this.inputFormElement.initialize) {
      this.inputFormElement.initialize();
    }

    this.showForm = true;
  }

  handleShowModal() {
    this.form = {
      ...this.form,
      workdays_in_month: 22,
      actual_workdays: 22,
      prorate_factor: 1,
    };
    this.showModal = true;
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
    } else if (this.dialogAction === "saveAndGoBack") {
      this.savePayroll().then(() => {
        this.$router.push({
          name: "PeriodDetail",
          params: { id: this.periodId },
        });
      });
    }
    this.showDialog = false;
  }

  goBack() {
    if (this.form.status === "Draft") {
      this.dialogMessage =
        "You have unsaved changes. Do you want to save before going back?";
      this.dialogAction = "saveAndGoBack";
      this.showDialog = true;
    } else {
      this.$router.push({
        name: "PeriodDetail",
        params: { id: this.periodId },
      });
    }
  }

  // COMPUTED PROPERTIES

  get schema() {
    return Yup.object().shape({
      type: Yup.string().required("Component type is required"),
      component: Yup.string().required("Component is required"),
    });
  }

  get canSubmit() {
    return this.periodData.status === "Draft" && this.form.status === "Draft";
  }

  get isDecemberPeriod() {
    if (this.periodData && this.periodData.period_name) {
      return this.periodData.period_name.toLowerCase().includes("december");
    }
    return false;
  }

  get amountPtkp(): number {
    const maritialStatus = this.employee.maritial_status;
    let ptkp = 0;
    switch (maritialStatus) {
      case "TK/0":
        ptkp = 54000000;
        break;
      case "TK/1":
        ptkp = 58500000;
        break;
      case "TK/2":
        ptkp = 63000000;
        break;
      case "TK/3":
        ptkp = 67500000;
        break;
      case "K/0":
        ptkp = 58500000;
        break;
      case "K/1":
        ptkp = 63000000;
        break;
      case "K/2":
        ptkp = 67500000;
        break;
      case "K/3":
        ptkp = 72000000;
        break;
    }
    return ptkp;
  }

  get terCategory() {
    const maritialStatus = this.employee.maritial_status;

    if (
      maritialStatus === "TK/0" ||
      maritialStatus === "TK/1" ||
      maritialStatus === "K/0"
    ) {
      return (this.form.ter_category = "A");
    } else if (
      maritialStatus === "TK/2" ||
      maritialStatus === "TK/3" ||
      maritialStatus === "K/1" ||
      maritialStatus === "K/2"
    ) {
      return (this.form.ter_category = "B");
    } else {
      return (this.form.ter_category = "C");
    }
  }

  /**
   * Calculation Methods
   */
  calculateTotals() {
    this.resetTotals();

    this.calculateComponentTotals();

    if (this.isDecemberPeriod || this.form.yearly_calculation) {
      this.calculateAnnualTax();
    } else {
      this.calculateMonthlyTax(
        this.form.total_gross_salary_taxable,
        this.employee.salary_type
      );
    }

    // Calculate final totals
    this.calculateFinalTotals();
  }

  resetTotals() {
    // Reset earnings totals
    this.form.base_salary = 0;
    this.form.company_bpjs_health = 0;
    this.form.company_bpjs_jkk = 0;
    this.form.company_bpjs_jkm = 0;
    this.form.overtime = 0;
    this.form.reimbursements = 0;
    this.form.loan = 0;

    // Reset deduction totals
    this.form.employee_bpjs_health = 0;
    this.form.employee_bpjs_jp = 0;
    this.form.employee_bpjs_jht = 0;
    this.form.loan_installment = 0;
    this.form.absent_deduction = 0;
    this.form.late_arrival_deduction = 0;

    // Reset tax totals
    this.form.total_gross_salary_taxable = 0;
    this.form.total_deductions_salary_taxable = 0;
    this.form.pkp = 0;
    this.form.tax_rate = 0;
    this.form.ter_tax_rate = 0;
    this.form.tax_amount = 0;
    this.form.tax_amount_floor_up = 0;

    // Reset final totals
    this.form.total_gross_salary = 0;
    this.form.total_deductions_salary = 0;
    this.form.take_home_pay = 0;
  }

  calculateProrateFactor() {
    if (this.form.workdays_in_month && this.form.actual_workdays) {
      this.form.prorate_factor = Math.min(
        1,
        this.form.actual_workdays / this.form.workdays_in_month
      ).toFixed(3);
    }
  }

  calculateWorkdaysAndProrate() {
    // Calculate workdays in month based on period start and end date
    // This is a simplified example - in a real app, you'd calculate actual workdays
    this.form.workdays_in_month = 22;

    // For employee who just joined or resigned in the middle of the period
    // we'd calculate the actual workdays
    this.form.actual_workdays = 22;

    // Calculate prorata factor
    this.form.prorate_factor = Math.min(
      1,
      this.form.actual_workdays / this.form.workdays_in_month
    );
  }

  calculateComponentTotals() {
    this.payrollComponents.forEach((component: any) => {
      const effectiveAmount = component.is_prorated
        ? component.amount * this.form.prorate_factor
        : component.amount;

      const totalAmount = effectiveAmount * component.quantity;

      if (component.type === "earnings") {
        this.form.total_gross_salary += totalAmount;

        if (component.is_taxable) {
          this.form.total_gross_salary_taxable += totalAmount;
        }

        if (component.name === "Base Salary") {
          this.form.base_salary = totalAmount;
        } else if (component.name === "Overtime") {
          this.form.overtime += totalAmount;
        }
      } else if (component.type === "deductions") {
        this.form.total_deductions_salary += totalAmount;

        if (component.is_taxable) {
          this.form.total_deductions_salary_taxable += totalAmount;
        }

        if (component.name === "BPJS Health Employee") {
          this.form.employee_bpjs_health = totalAmount;
        } else if (component.name === "BPJS JHT Employee") {
          this.form.employee_bpjs_jht = totalAmount;
        } else if (component.name === "BPJS JP Employee") {
          this.form.employee_bpjs_jp = totalAmount;
        } else if (component.name.includes("Loan")) {
          this.form.loan_installment += totalAmount;
        }
      } else if (component.type === "statutory") {
        if (component.name === "BPJS Health Company") {
          this.form.company_bpjs_health = totalAmount;
        } else if (component.name === "BPJS JKK") {
          this.form.company_bpjs_jkk = totalAmount;
        } else if (component.name === "BPJS JKM") {
          this.form.company_bpjs_jkm = totalAmount;
        } else if (component.name === "BPJS JHT Company") {
          this.form.company_bpjs_jht = totalAmount;
        } else if (component.name === "BPJS JP Company") {
          this.form.company_bpjs_jp = totalAmount;
        }

        // if (component.is_taxable) {
        //   this.form.total_gross_salary += totalAmount;
        //   this.form.total_gross_salary_taxable += totalAmount;
        // }
      }
    });
  }

  // PTKP = Penghasilan Tidak Kena Pajak
  calculatePTKP() {
    const maritalStatus = this.employee.maritial_status;

    const statusParts = maritalStatus.split("/");
    const statusCode = statusParts[0];
    const dependents = statusParts.length > 1 ? parseInt(statusParts[1]) : 0;

    // Base PTKP values (2023 rates)
    const basePTKP = 54000000;
    const marriedAddition = 4500000;
    const dependentAddition = 4500000;

    let ptkp = basePTKP;

    if (statusCode === "K") {
      ptkp += marriedAddition;
    }

    ptkp += Math.min(dependents, 3) * dependentAddition;

    return ptkp;
  }

  // PKP = Penghasilan Kena Pajak
  calculatePKP(monthlyGrossSalaryTaxable: number) {
    const annualIncome = monthlyGrossSalaryTaxable * 12;
    let ptkp = this.amountPtkp;

    const pkp = Math.max(0, annualIncome - ptkp);

    return pkp;
  }

  // Tahunan (Khusus Desember) memakai tarif umum/progresif
  calculateAnnualTax() {
    let annualTax = 0;
    const pkp = this.form.pkp;

    if (pkp <= 60000000) {
      // layer 1
      annualTax = pkp * 0.05;
      this.form.tax_rate = 5;
    } else if (pkp <= 250000000) {
      // layer 2
      annualTax = 60000000 * 0.05 + (pkp - 60000000) * 0.15;
      this.form.tax_rate = 15;
    } else if (pkp <= 500000000) {
      // layer 3
      annualTax = 60000000 * 0.05 + 190000000 * 0.15 + (pkp - 250000000) * 0.25;
      this.form.tax_rate = 25;
    } else if (pkp <= 50000000000) {
      // layer 4
      annualTax =
        60000000 * 0.05 +
        190000000 * 0.15 +
        250000000 * 0.25 +
        (pkp - 500000000) * 0.3;
      this.form.tax_rate = 30;
    } else {
      // layer 5
      annualTax =
        60000000 * 0.05 +
        190000000 * 0.15 +
        250000000 * 0.25 +
        5000000000 * 0.3 +
        (pkp - 5000000000) * 0.35;
      this.form.tax_rate = 35;
    }

    // Calculate monthly tax (annual tax / 12)
    const monthlyTax = annualTax / 12;

    // Set tax amount
    this.form.tax_amount = monthlyTax;

    // Round up to nearest 1000
    this.form.tax_amount_floor_up = Math.ceil(monthlyTax / 1000) * 1000;
  }

  // Bulanan (Januari-November) memakai tarif TER
  // TER = Tarif Efektif Rata Rata
  calculateMonthlyTax(salary: number, salaryType: string) {
    if (salary <= 0) {
      this.form.ter_tax_rate = 0;
      this.form.tax_amount = 0;
      this.form.tax_amount_floor_up = 0;
      return;
    }

    const terCategory = this.terCategory;
    let dailySalary = 0;

    // Convert salary to daily basis for non-monthly salary types
    if (salaryType === "bi-weekly") {
      dailySalary = salary / 14;
    } else if (salaryType === "weekly") {
      dailySalary = salary / 7;
    } else if (salaryType === "daily") {
      dailySalary = salary;
    }

    // Apply TER rates based on salary type and category
    if (salaryType === "monthly") {
      this.applyMonthlyTerRates(salary, terCategory);
    } else {
      this.applyDailyTerRates(dailySalary);
    }

    // Calculate tax amount based on TER rate
    const taxAmount = salary * (this.form.ter_tax_rate / 100);
    this.form.tax_rate = this.form.ter_tax_rate;
    this.form.tax_amount = taxAmount;

    // Round up to nearest 1000
    this.form.tax_amount_floor_up = Math.ceil(taxAmount / 1000) * 1000;
  }

  applyMonthlyTerRates(salary: number, category: string) {
    switch (category) {
      case "A":
        if (salary <= 5400000) {
          this.form.ter_tax_rate = 0;
        } else if (salary > 5400000 && salary <= 5650000) {
          this.form.ter_tax_rate = 0.25;
        } else if (salary > 5650000 && salary <= 5950000) {
          this.form.ter_tax_rate = 0.5;
        } else if (salary > 5950000 && salary <= 6300000) {
          this.form.ter_tax_rate = 0.75;
        } else if (salary > 6300000 && salary <= 6750000) {
          this.form.ter_tax_rate = 1;
        } else if (salary > 6750000 && salary <= 7500000) {
          this.form.ter_tax_rate = 1.25;
        } else if (salary > 7500000 && salary <= 8550000) {
          this.form.ter_tax_rate = 1.5;
        } else if (salary > 8550000 && salary <= 9650000) {
          this.form.ter_tax_rate = 1.75;
        } else if (salary > 9650000 && salary <= 10050000) {
          this.form.ter_tax_rate = 2;
        } else if (salary > 10050000 && salary <= 10350000) {
          this.form.ter_tax_rate = 2.25;
        } else if (salary > 10350000 && salary <= 10700000) {
          this.form.ter_tax_rate = 2.5;
        } else if (salary > 10700000 && salary <= 11050000) {
          this.form.ter_tax_rate = 3;
        } else if (salary > 11050000 && salary <= 11600000) {
          this.form.ter_tax_rate = 3.5;
        } else if (salary > 11600000 && salary <= 12500000) {
          this.form.ter_tax_rate = 4;
        } else if (salary > 12500000 && salary <= 13750000) {
          this.form.ter_tax_rate = 5;
        }
        break;
      case "B":
        if (salary <= 6200000) {
          this.form.ter_tax_rate = 0;
        } else if (salary > 6200000 && salary <= 6500000) {
          this.form.ter_tax_rate = 0.25;
        } else if (salary > 6500000 && salary <= 6850000) {
          this.form.ter_tax_rate = 0.5;
        } else if (salary > 6850000 && salary <= 7300000) {
          this.form.ter_tax_rate = 0.75;
        } else if (salary > 7300000 && salary <= 9200000) {
          this.form.ter_tax_rate = 1;
        } else if (salary > 9200000 && salary <= 10750000) {
          this.form.ter_tax_rate = 1.5;
        } else if (salary > 10750000 && salary <= 11250000) {
          this.form.ter_tax_rate = 2;
        }
        break;
      case "C":
        if (salary <= 6600000) {
          this.form.ter_tax_rate = 0;
        } else if (salary > 6600000 && salary <= 6950000) {
          this.form.ter_tax_rate = 0.25;
        } else if (salary > 6950000 && salary <= 7350000) {
          this.form.ter_tax_rate = 0.5;
        } else if (salary > 7350000 && salary <= 7800000) {
          this.form.ter_tax_rate = 0.75;
        } else if (salary > 7800000 && salary <= 8850000) {
          this.form.ter_tax_rate = 1;
        } else if (salary > 8850000 && salary <= 9800000) {
          this.form.ter_tax_rate = 1.25;
        } else if (salary > 9800000 && salary <= 10950000) {
          this.form.ter_tax_rate = 1.5;
        }
        break;
      default:
        this.form.ter_tax_rate = 0;
        break;
    }
  }

  applyDailyTerRates(dailySalary: number) {
    if (dailySalary <= 450000) {
      this.form.ter_tax_rate = 0;
    } else if (dailySalary > 450000 && dailySalary <= 2500000) {
      this.form.ter_tax_rate = 0.5;
    }
  }

  calculateFinalTotals() {
    let grossSalary = 0;
    let totalDeductions = 0;

    this.payrollComponents.forEach((component: any) => {
      const effectiveAmount = component.is_prorated
        ? component.prorate_amount
        : component.amount;

      const totalComponentAmount = effectiveAmount * component.quantity;

      if (component.type === "earnings") {
        grossSalary += totalComponentAmount;
      } else if (component.type === "deductions") {
        totalDeductions += totalComponentAmount;
      }
    });

    this.form.total_gross_salary = grossSalary;
    this.form.total_deductions_salary = totalDeductions;

    this.form.take_home_pay = Math.max(
      0,
      this.form.total_gross_salary -
        (this.form.total_deductions_salary + this.form.tax_amount_floor_up)
    );
  }
}
