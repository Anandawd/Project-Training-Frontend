import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import PayrollComponentsAPI from "@/services/api/payroll/payroll-components/payroll-component";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import { formatDateTimeUTC } from "@/utils/format";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import PayrollComponentModal from "../../../employee/components/payroll-component-modal/payroll-component-modal.vue";
import StatutoryModal from "../../../employee/components/statutory-component-modal/statutory-component-modal.vue";
import EmployeeInformation from "../../components/employee-information/employee-information.vue";
import CLoading from "../../components/loading-component/loading-component.vue";
import PayrollCard from "../../components/payroll-card/payroll-card.vue";
import ProrateModal from "../../components/prorate-modal/prorate-modal.vue";
import TaxCard from "../../components/tax-card/tax-card.vue";
import TaxModal from "../../components/tax-income-modal/tax-income-modal.vue";
import TotalPaymentCard from "../../components/total-payment-card/total-payment-card.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();
const payrollAPI = new PayrollAPI();
const employeeAPI = new EmployeeAPI();
const payrollComponentAPI = new PayrollComponentsAPI();

@Options({
  name: "EmployeePayrollDetail",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CModal,
    ProrateModal,
    PayrollComponentModal,
    EmployeeInformation,
    PayrollCard,
    TotalPaymentCard,
    TaxCard,
    CLoading,
    StatutoryModal,
    TaxModal,
  },
})
export default class EmployeePayrollDetail extends Vue {
  // data
  periodCode: any = ref("");
  employeeId: any = ref("");

  // form
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isEditing: boolean = false;
  public hasError: boolean = false;
  public errorMessage: string = "";
  public dataType: any;

  // tax income
  public showModalTax: boolean = false;
  modalTaxFormElement: any = ref();

  // prorate
  public showModalProrate: boolean = false;
  modalProrateFormElement: any = ref();

  // benefit
  public showModalBenefit: boolean = false;
  modalBenefitFormElement: any = ref();

  // benefit
  public showModalStatutory: boolean = false;
  modalStatutoryFormElement: any = ref();

  // options data
  public taxIncomeTypeOptions: any = [];
  public taxMethodOptions: any = [];
  public componentTypeOptions: any[] = [];
  public earningsComponentOptions: any[] = [];
  public deductionsComponentOptions: any[] = [];
  public statutoryComponentOptions: any[] = [];

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Employee Data
  public employeeData: any = ref();
  public employeePayrollData: any = ref();
  public payrollData: any = ref();
  public statutoryDetail: any = ref();
  public taxDetail: any = ref();

  // Payroll Data
  public earningsComponents: any = reactive([]);
  public deductionsComponents: any = reactive([]);
  public statutoryComponents: any = reactive([]);

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

  // RECYCLE LIFE FUNCTION =======================================================
  created(): void {
    this.periodCode = this.$route.params.periodCode;
    this.employeeId = this.$route.params.employeeId;
  }

  async beforeMount() {
    this.loadData();
  }

  async mounted() {}

  // GENERAL FUNCTION =======================================================
  async handleShowModal(params: any) {
    this.showModalBenefit = false;
    this.showModalProrate = false;
    await this.$nextTick();

    switch (params) {
      case "TAX":
        this.showModalTax = true;
        this.modalTaxFormElement.initialize();
        break;
      case "PRORATE":
        this.showModalProrate = true;
        this.modalProrateFormElement.initialize();
        break;
      case "BENEFIT":
        this.showModalBenefit = true;
        this.modalBenefitFormElement.initialize();
        break;
      case "STATUTORY":
        this.showModalStatutory = true;
        this.modalStatutoryFormElement.initialize();
        break;
    }
  }

  handleSubmitForApproval() {
    this.dialogMessage = this.$t(
      "messages.payroll.confirm.submitEmployeePayrollForApproval"
    );
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  handleSavePayroll() {
    this.savePayroll();
  }

  handleSaveTax(formData: any) {
    this.dataType = "TAX";
    const formattedData = this.formatModalData(formData);
    this.saveModal(formattedData);
  }

  handleSaveProrate(formData: any) {
    this.dataType = "PRORATE";
    const formattedData = this.formatModalData(formData);
    this.saveModal(formattedData);
  }

  handleSaveBenefit(formData: any) {
    this.dataType = "BENEFIT";
    const formattedData = this.formatModalData(formData);
    this.saveModal(formattedData);
  }

  handleSaveStatutory(formData: any) {
    this.dataType = "STATUTORY";
    const formattedData = this.formatModalData(formData);
    this.saveModal(formattedData);
  }

  confirmAction() {
    switch (this.dialogAction) {
      case "submit":
        this.submitPayroll();
        break;
      case "saveAndBack":
        this.savePayroll().then(() => {
          this.$router.push({
            name: "PeriodDetail",
            params: { code: this.periodCode },
          });
          this.isEditing = false;
        });
        break;
    }
  }

  handleBack() {
    if (this.isEditing) {
      this.dialogMessage = this.$t("messages.payroll.confirm.saveAndBack");
      this.dialogAction = "saveAndBack";
      this.showDialog = true;
    } else {
      this.$router.push({
        name: "PeriodDetail",
        params: { code: this.periodCode },
      });
    }
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.isLoading = true;

      await this.loadEmployeePayrollData();
      await this.loadAllComponents();
      await this.loadDropdown();

      if (this.employeeData || this.payrollData) {
        this.isLoading = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEmployeePayrollData() {
    try {
      const { data: period } =
        await payrollPeriodsAPI.GetPayrollPeriodsByPeriodCode(this.periodCode);
      if (period) {
        this.periodData = period;
      } else {
        this.periodData = {};
      }

      const { data: employee } = await employeeAPI.GetEmployeeByEmployeeID(
        this.employeeId
      );
      if (employee) {
        this.employeeData = employee[0];
      } else {
        this.employeeData = {};
      }

      const { data: payrollData } =
        await payrollAPI.GetPayrollByPeriodCodeAndEmployeeId(
          this.periodCode,
          this.employeeId
        );

      if (payrollData) {
        this.payrollData = payrollData[0];
      } else {
        this.payrollData = {};
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadAllComponents() {
    try {
      const promises = [
        payrollAPI
          .GetEmployeePayrollEarningsComponent(this.employeeId)
          .then((response) => {
            this.earningsComponents = response.data;
          }),

        payrollAPI
          .GetEmployeePayrollDeductionsComponent(this.employeeId)
          .then((response) => {
            this.deductionsComponents = response.data;
          }),

        payrollAPI
          .GetStatutoryDetailByPayrollId(this.payrollData.payroll_id)
          .then((response) => {
            this.statutoryDetail = response.data;
          }),

        payrollAPI
          .GetTaxDetailByPayrollId(this.payrollData.payroll_id)
          .then((response) => {
            this.taxDetail = response.data[0];
          }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const promises = [
        payrollAPI.GetConstTaxMethod().then((response) => {
          this.taxMethodOptions = response.data;
        }),

        payrollAPI.GetConstTaxIncomeType().then((response) => {
          this.taxIncomeTypeOptions = response.data;
        }),
        payrollComponentAPI.GetCategoryTypeList().then((response) => {
          this.componentTypeOptions = response.data;
        }),
        payrollComponentAPI.GetEarningsComponentList().then((response) => {
          this.earningsComponentOptions = response.data;
        }),
        payrollComponentAPI.GetDeductionsComponentList().then((response) => {
          this.deductionsComponentOptions = response.data;
        }),
        payrollComponentAPI.GetStatutoryComponentList({}).then((response) => {
          this.statutoryComponentOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async savePayroll() {
    try {
      this.isSaving = true;

      const { status2: tax } = await payrollAPI.UpdateEmployeePayroll(
        this.payrollData
      );
      if (tax.status === 0) {
        getToastSuccess(this.$t("messages.payroll.success.savePayroll"));
        this.$nextTick();
        this.loadData();
        this.isEditing = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async saveModal(formData: any) {
    try {
      console.log("saveModal", formData);
      this.isSaving = true;
      switch (this.dataType) {
        case "TAX":
          const { status2: tax } = await payrollAPI.UpdateEmployeePayroll(
            formData
          );
          if (tax.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.saveTaxConfiguration")
            );
            this.$nextTick();
            this.loadData();
            this.showModalTax = false;
            this.dataType = "";
          }
          break;
        case "PRORATE":
          const { status2: salary } = await payrollAPI.UpdateEmployeePayroll(
            formData
          );
          if (salary.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.saveProrate"));
            this.$nextTick();
            this.loadData();
            this.showModalProrate = false;
            this.dataType = "";
          }
          break;
        case "BENEFIT":
          const { status2: benefit } =
            await payrollAPI.InsertEmployeePayrollInEmployeePayrollDetail({
              ...formData,
              period_code: this.periodCode,
            });
          if (benefit.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.saveBenefit"));
            this.$nextTick();
            this.loadData();
            this.showModalBenefit = false;
            this.dataType = "";
          }
          break;
        case "STATUTORY":
          const { status2: statutory } =
            await payrollAPI.InsertEmployeeStatutoryInEmployeePayrollDetail({
              ...formData,
              period_code: this.periodCode,
            });
          if (statutory.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.saveStatutory"));
            this.$nextTick();
            this.loadData();
            this.showModalStatutory = false;
            this.dataType = "";
          }
          break;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async submitPayroll() {
    try {
      this.isSaving = true;

      getToastSuccess("Employee payroll submitted for approval");
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER ==================================================================
  formatModalData(params: any) {
    switch (this.dataType) {
      case "TAX":
        return {
          id: params.id,
          payroll_id: params.payroll_id,
          employee_id: params.employee_id,
          period_code: params.period_code,

          payment_date: params.payment_date,
          payment_method: params.payment_method,
          payment_reference: params.payment_reference,
          total_workdays: params.total_workdays,
          actual_workdays: params.actual_workdays,
          prorata_factor: params.prorata_factor,

          tax_income_type: params.tax_income_type,
          tax_method: params.tax_method,
          tax_amount: params.tax_amount,
          basic_salary: params.basic_salary,
          gross_salary: params.gross_salary,
          gross_salary_taxable: params.gross_salary_taxable,
          total_deductions: params.total_deductions,
          total_deductions_taxable: params.total_deductions_taxable,
          net_salary: params.net_salary,

          remark: params.remark,
          status: params.status,
          // modified
          created_at: formatDateTimeUTC(params.created_at),
          created_by: params.created_by,
          updated_at: formatDateTimeUTC(params.updated_at),
          updated_by: params.updated_by,
        };
      case "PRORATE":
        return {
          id: params.id,
          payroll_id: params.payroll_id,
          employee_id: params.employee_id,
          period_code: params.period_code,

          payment_date: params.payment_date,
          payment_method: params.payment_method,
          payment_reference: params.payment_reference,
          total_workdays: params.total_workdays,
          actual_workdays: params.actual_workdays,
          prorata_factor: params.prorata_factor,

          tax_income_type: params.tax_income_type,
          tax_method: params.tax_method,
          tax_amount: params.tax_amount,
          basic_salary: params.basic_salary,
          gross_salary: params.gross_salary,
          gross_salary_taxable: params.gross_salary_taxable,
          total_deductions: params.total_deductions,
          total_deductions_taxable: params.total_deductions_taxable,
          net_salary: params.net_salary,

          remark: params.remark,
          status: params.status,
          // modified
          created_at: formatDateTimeUTC(params.created_at),
          created_by: params.created_by,
          updated_at: formatDateTimeUTC(params.updated_at),
          updated_by: params.updated_by,
        };
      case "BENEFIT":
        return {
          employee_id: this.employeeId,
          id: params.id,
          payroll_component_code: params.payroll_component_code,
          amount: parseFloat(params.amount),
          quantity: parseInt(params.quantity),
          effective_date: formatDateTimeUTC(params.effective_date),
          end_date: formatDateTimeUTC(params.end_date),
          remark: params.remark,
          is_current: parseInt(params.is_current),
          is_override: params.is_override ? 1 : 0,
          is_taxable: parseInt(params.is_taxable),
          is_fixed: parseInt(params.is_fixed),
          is_prorated: parseInt(params.is_prorated),
          is_included_in_bpjs_health: parseInt(
            params.is_included_in_bpjs_health
          ),
          is_included_in_bpjs_employee: parseInt(
            params.is_included_in_bpjs_employee
          ),
          is_show_in_payslip: parseInt(params.is_show_in_payslip),
          updated_at: formatDateTimeUTC(params.updated_at),
          updated_by: params.updated_by,
          created_at: formatDateTimeUTC(params.created_at),
          created_by: params.created_by,
        };
      case "STATUTORY":
        return {
          employee_id: this.employeeId,
          id: params.id ? params.id : null,
          statutory_component_code: params.statutory_component_code,
          amount: params.amount ? parseFloat(params.amount) : 0,
          percentage: params.percentage ? parseFloat(params.percentage) : 0,
          min_amount: params.min_amount ? parseFloat(params.min_amount) : 0,
          max_amount: params.max_amount ? parseFloat(params.max_amount) : 0,
          quantity: parseInt(params.quantity),
          effective_date: formatDateTimeUTC(params.effective_date),
          end_date: formatDateTimeUTC(params.end_date),
          remark: params.remark,
          is_current: parseInt(params.is_current),
          // is_override: params.is_override ? 1 : 0,
          is_taxable: parseInt(params.is_taxable),
          is_fixed: parseInt(params.is_fixed),
          is_show_in_payslip: parseInt(params.is_show_in_payslip),
          updated_at: formatDateTimeUTC(params.updated_at),
          updated_by: params.updated_by,
          created_at: formatDateTimeUTC(params.created_at),
          created_by: params.created_by,
        };
    }
  }

  onComponentAmountChange(component: any) {
    this.isEditing = true;
    // Validasi minimum amount (opsional)
    if (component.amount < 0) {
      component.amount = 0;
    }

    // Hitung prorate amount berdasarkan apakah komponen ter-prorate atau tidak
    if (component.is_prorated) {
      component.prorate_amount =
        component.amount * Number(this.payrollData.prorata_factor);
    } else {
      component.prorate_amount = component.amount;
    }

    // Hitung total amount (amount * quantity)
    component.total_amount = component.amount * component.quantity;

    // Update total keseluruhan payroll
    // this.calculateTotals();
  }

  onComponentQuantityChange(component: any) {
    console.log("onComponentQuantityChange before", component);
    component.quantity = parseInt(component.quantity) || 0;
    this.isEditing = true;

    // Validasi quantity tidak boleh negatif
    if (component.quantity < 0) {
      component.quantity = 0;
    }

    // Hitung prorate amount berdasarkan apakah komponen ter-prorate atau tidak
    if (component.is_prorated) {
      component.prorate_amount =
        component.amount * Number(this.payrollData.prorata_factor || 1);
    } else {
      component.prorate_amount = component.amount;
    }

    // Hitung total amount (amount * quantity)
    component.total_amount = component.amount * component.quantity;

    // Update total keseluruhan payroll
    // this.calculateTotals();
    // console.log("onComponentQuantityChange after", component);
  }

  calculateTotals() {
    // Reset totals
    let totalEarnings = 0;
    let totalDeductions = 0;
    let totalTaxableEarnings = 0;
    let totalTaxableDeductions = 0;

    // Hitung total earnings dari basic salary
    totalEarnings += parseFloat(this.payrollData.basic_salary || 0);
    if (this.payrollData.is_basic_salary_taxable) {
      totalTaxableEarnings += parseFloat(this.payrollData.basic_salary || 0);
    }

    // Hitung total dari payroll components (earnings & deductions)
    if (this.payrollData.components) {
      this.payrollData.components.forEach((component: any) => {
        const componentTotal = component.amount * (component.quantity || 1);
        component.total_amount = componentTotal;

        if (component.component_type === "Earnings") {
          totalEarnings += componentTotal;
          if (component.is_taxable) {
            totalTaxableEarnings += componentTotal;
          }
        } else if (component.component_type === "Deductions") {
          totalDeductions += componentTotal;
          if (component.is_taxable) {
            totalTaxableDeductions += componentTotal;
          }
        }
      });
    }

    // Hitung total dari statutory components
    if (this.statutoryDetail) {
      this.statutoryDetail.forEach((component: any) => {
        const componentTotal = component.amount * (component.quantity || 1);
        component.total_amount = componentTotal;

        if (component.Type === "Earnings") {
          totalEarnings += componentTotal;
          if (component.is_taxable) {
            totalTaxableEarnings += componentTotal;
          }
        } else if (component.Type === "Deductions") {
          totalDeductions += componentTotal;
          if (component.is_taxable) {
            totalTaxableDeductions += componentTotal;
          }
        }
      });
    }

    // Update payroll data berdasarkan struktur yang ada
    this.payrollData.gross_salary = totalEarnings.toFixed(2);
    this.payrollData.total_deductions = totalDeductions.toFixed(2);
    this.payrollData.gross_salary_taxable = totalTaxableEarnings.toFixed(2);
    this.payrollData.total_deductions_taxable =
      totalTaxableDeductions.toFixed(2);

    // Hitung net salary
    const netSalary =
      totalEarnings -
      totalDeductions -
      parseFloat(this.payrollData.tax_amount || 0);
    this.payrollData.net_salary = netSalary.toFixed(2);

    // Trigger recalculation of tax jika diperlukan
    this.calculateTax();
  }

  // Method untuk menghitung pajak berdasarkan gross salary taxable
  calculateTax() {
    if (this.payrollData.gross_salary_taxable && this.payrollData.tax_rate) {
      const taxableAmount = parseFloat(this.payrollData.gross_salary_taxable);
      const taxRate = parseFloat(this.payrollData.tax_rate);

      // Hitung tax amount
      this.payrollData.tax_amount = ((taxableAmount * taxRate) / 100).toFixed(
        2
      );

      // Recalculate net salary
      const grossSalary = parseFloat(this.payrollData.gross_salary);
      const totalDeductions = parseFloat(this.payrollData.total_deductions);
      const taxAmount = parseFloat(this.payrollData.tax_amount);

      this.payrollData.net_salary = (
        grossSalary -
        totalDeductions -
        taxAmount
      ).toFixed(2);
    }
  }

  // GETTER AND SETTER =======================================================
  get earningsStatutoryDetail() {
    if (this.statutoryDetail) {
      return this.statutoryDetail.filter(
        (item: any) => item.Type === "Earnings"
      );
    }
    return [];
  }

  get deductionsStatutoryDetail() {
    if (this.statutoryDetail) {
      return this.statutoryDetail.filter(
        (item: any) => item.Type === "Deductions"
      );
    }
    return [];
  }

  get shouldShowError() {
    return this.hasError && !this.isLoading;
  }

  get isDraft() {
    return (
      // this.payrollData.status === "Draft" || this.payrollData.status === "DRAFT"
      true
    );
  }
}
