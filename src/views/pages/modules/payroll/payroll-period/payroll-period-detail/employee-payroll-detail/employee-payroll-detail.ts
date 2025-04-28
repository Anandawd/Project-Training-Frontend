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
    ter_tax_rate: 0,
    progressive_tax_rate_layer_1: 5,
    progressive_tax_rate_layer_2: 15,
    progressive_tax_rate_layer_3: 25,
    progressive_tax_rate_layer_4: 30,
    progressive_tax_rate_layer_5: 35,
    tax_amount: 0,
    tax_amount_floor_up: 0,

    total_gross_salary: 0,
    total_deduction_salary: 0,
    take_home_pay: 0,

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
      const periodDate = "april";
      this.calculateTotals(periodDate);
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
      {
        id: 3,
        component_id: "EC002",
        name: "Meal Allowance",
        type: "earnings",
        category: "Fixed Allowance",
        amount: 1500000,
        original_amount: 1500000,
        prorata_amount: 1500000,
        is_taxable: false,
        is_included_in_bpjs_health: true,
        is_included_in_bpjs_employee: true,
        is_fixed: false,
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
      const periodDate = "april";
      this.calculateTotals(periodDate);

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
      const periodDate = "april";
      this.calculateTotals(periodDate);

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

  addComponent(componentData: any) {
    const newId = new Date().getTime();

    this.payrollComponents.push({
      id: newId,
      component_id: componentData.component_id,
      name: componentData.name,
      type: componentData.type,
      category: componentData.category,
      amount: componentData.amount,
      original_amount: componentData.original_amount,
      prorata_amount: componentData.prorata_amount,
      is_taxable: componentData.is_taxable,
      is_included_in_bpjs_health: componentData.is_included_in_bpjs_health,
      is_included_in_bpjs_employee: componentData.is_included_in_bpjs_employee,
      is_fixed: componentData.is_fixed,
      apply_prorata: componentData.apply_prorata,
      unit: componentData.unit,
      quantity: componentData.quantity,
      remark: componentData.remark,
    });

    const periodDate = "april";
    this.calculateTotals(periodDate);

    this.showForm = false;

    getToastSuccess("Component added successfully");
  }

  onComponentAmountChange(component: any) {
    if (component.is_fixed) {
      component.amount = component.original_amount;
      return;
    }

    component.prorata_amount = component.amount;
    const periodDate = "april";
    this.calculateTotals(periodDate);
  }

  getComponentsByType(type: string) {
    return this.payrollComponents.filter(
      (component: any) => component.type === type
    );
  }

  handleShowForm(params: any, mode: any) {
    this.modeData = mode;

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
      return (this.employee.maritial_status = "C");
    }
  }

  /**
   * Calculation Methods
   */
  calculateTotals(periodDate: string) {
    // Reset all totals
    this.resetTotals();

    // Calculate totals for each component type
    this.calculateTotalGrossSalary();
    this.calculateTotalDeductionsSalary();

    // Calculate taxable earnings for tax calculation
    this.calculateTotalGrossSalaryTaxable();

    if (periodDate === "december") {
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
    this.form.total_deductions_taxable = 0;
    this.form.pkp = 0;
    this.form.ter_tax_rate = 0;
    this.form.tax_amount = 0;
    this.form.tax_amount_floor_up = 0;

    // Reset final totals
    this.form.total_gross_salary = 0;
    this.form.total_deductions = 0;
    this.form.take_home_pay = 0;
  }

  calculateTotalGrossSalary() {
    const earningsComponents = this.getComponentsByType("earnings");

    earningsComponents.forEach((component: any) => {
      const totalAmount = component.amount * component.quantity;
      this.form.total_gross_salary += totalAmount;
    });
  }

  calculateTotalDeductionsSalary() {
    const deductionsComponents = this.getComponentsByType("deductions");

    deductionsComponents.forEach((component: any) => {
      const totalAmount = component.amount * component.quantity;
      this.form.total_deduction_salary += totalAmount;
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

  calculateTotalGrossSalaryTaxable() {
    let totalGrossSalaryTaxable = 0;
    const earningsComponents = this.getComponentsByType("earnings");
    earningsComponents.forEach((component: any) => {
      if (component.is_taxable) {
        totalGrossSalaryTaxable += component.amount * component.quantity;
      }
    });

    this.form.total_gross_salary_taxable = totalGrossSalaryTaxable;

    this.form.pkp = this.calculatePkp(totalGrossSalaryTaxable);
  }

  calculateTotalDeductionsSalaryTaxable() {
    let totalDeductionsSalaryTaxable = 0;
    const deductionsComponents = this.getComponentsByType("deductions");
    deductionsComponents.forEach((component: any) => {
      if (component.is_taxable) {
        totalDeductionsSalaryTaxable += component.amount * component.quantity;
      }
    });

    this.form.total_gross_salary_taxable = totalDeductionsSalaryTaxable;

    this.form.pkp = this.calculatePkp(totalDeductionsSalaryTaxable);
  }

  calculatePkp(monthlyGrossSalaryTaxable: number) {
    const annualIncome = monthlyGrossSalaryTaxable * 12;
    let ptkp = this.amountPtkp;

    const pkp = Math.max(0, annualIncome - ptkp);

    return pkp;
  }

  calculateAnnualTax() {
    let annualTax = 0;
    const pkp = this.form.pkp;
    if (pkp <= 60000000) {
      // layer 1
      annualTax = pkp * 0.05;
    } else if (pkp <= 250000000) {
      // layer 2
      annualTax = 60000000 * 0.05 + (pkp - 60000000) * 0.15;
    } else if (pkp <= 500000000) {
      // layer 3
      annualTax = 60000000 * 0.05 + 190000000 * 0.15 + (pkp - 250000000) * 0.25;
    } else if (pkp <= 50000000000) {
      // layer 4
      annualTax =
        60000000 * 0.05 +
        190000000 * 0.15 +
        250000000 * 0.25 +
        (pkp - 500000000) * 0.3;
    } else {
      // layer 5
      annualTax =
        60000000 * 0.05 +
        190000000 * 0.15 +
        250000000 * 0.25 +
        5000000000 * 0.3;
      (pkp - 5000000000) * 0.35;
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

  calculateMonthlyTax(salary: number, salaryType: string) {
    const terCategory = this.terCategory;
    let dailySalary = 0;
    // Tarif TER Bulanan
    if (salaryType === "monthly") {
      switch (terCategory) {
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
      if (terCategory === "A") {
      }
    }

    // Tarif TER Harian
    if ((salaryType = "bi-weekly")) {
      dailySalary = salary / 14;
      if (dailySalary <= 450000) {
        this.form.ter_tax_rate = 0;
      } else if (dailySalary > 450000 && dailySalary <= 2500000) {
        this.form.ter_tax_rate = 0.5;
      }
    } else if ((salaryType = "weekly")) {
      dailySalary = salary / 7;
      if (dailySalary <= 450000) {
        this.form.ter_tax_rate = 0;
      } else if (dailySalary > 450000 && dailySalary <= 2500000) {
        this.form.ter_tax_rate = 0.5;
      }
    } else if ((salaryType = "daily")) {
      dailySalary = salary;
      if (dailySalary <= 450000) {
        this.form.ter_tax_rate = 0;
      } else if (dailySalary > 450000 && dailySalary <= 2500000) {
        this.form.ter_tax_rate = 0.5;
      }
    }
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
}
