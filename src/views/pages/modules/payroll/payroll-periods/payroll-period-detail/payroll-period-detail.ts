import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import {
  formatCurrency,
  formatDateTime,
  formatFullDate,
  formatNumberValue,
} from "@/utils/format";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EmployeePayrollTable from "../components/employee-payroll-table/employee-payroll-table.vue";
import GenerateModal from "../components/generate-modal/generate-modal.vue";
import PayrollPeriodSummary from "../components/payroll-period-summary/payroll-period-summary.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();
const payrollAPI = new PayrollAPI();

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
    CSelect,
    EmployeePayrollTable,
    PayrollPeriodSummary,
    GenerateModal,
  },
})
export default class Employee extends Vue {
  // data
  public modeData: any;
  public periodCode: any = ref("");
  public periodData: any = ref({});
  public rowEmployeeData: any = [];
  public employees: any = [];

  // modal
  public showGenerateModal: boolean = false;

  // options data
  public employeeOptions: any = [];
  public positionsOptions: any = [];
  public departmentsOptions: any = [];
  public taxIncomeOptions: any = [];
  public taxMethodOptions: any = [];

  // processing state
  public isGenerating: boolean = false;
  public isSaving: boolean = false;

  // statistic
  public statusCounts: any = ref({
    employee: 0,
    gross_salary: 0,
    total_deductions: 0,
    net_salary: 0,
  });

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public deleteParam: any;

  // table refs
  employeePayrollTableRef: any = ref();

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;

  // FORMAT FUNCTION
  formatCurrency = formatCurrency;
  formatNumberValue = formatNumberValue;
  formatDate = formatDateTime;
  // RECYCLE LIFE FUNCTION =======================================================

  beforeMount(): void {
    this.periodCode = this.$route.params.code as string;
  }

  async mounted() {
    await this.loadData();
    await this.loadPayrollStatistic();
    await this.loadDropdown();
    await this.loadPayroll();
  }

  // GENERAL FUNCTION =======================================================
  handleTableAction(params: any) {
    switch (params.event) {
      case "EDIT":
        this.handleToEmployeePayroll(params.params);
        break;
      case "DELETE":
        this.handledeletePayroll(params.params);
        break;
      default:
        break;
    }
  }

  handleSubmitForApproval() {
    this.dialogMessage = this.$t("messages.payroll.confirm.submitForApproval");
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  handleSaveDraft() {}

  handledeletePayroll(params: any) {
    this.deleteParam = params;
    this.dialogAction = "delete";
    this.dialogMessage = this.$t("messages.payroll.confirm.deletePayroll", {
      employeeName: params.employee_name,
    });
    this.showDialog = true;
  }

  handleGenerate(params: any) {
    this.generatePayroll(params);
  }

  confirmAction() {
    if (this.dialogAction === "submit") {
      this.submitPayroll();
    } else if (this.dialogAction === "delete") {
      this.deletePayroll();
    } else if (this.dialogAction === "saveAndBack") {
      this.savePayrollPeriod();
    }
  }

  handleToEmployeePayroll(employee: any) {
    this.$router.push({
      name: "EmployeePayrollDetail",
      params: {
        periodCode: this.periodCode,
        employeeId: employee.employee_id,
      },
    });
  }

  handleBack() {
    this.$router.push({
      name: "Periods",
    });
    // if (this.form.status.toUpperCase() === "DRAFT") {
    //   this.dialogMessage = this.$t("messages.payroll.confirm.saveAndBack");
    //   this.dialogAction = "saveAndBack";
    //   this.showDialog = true;
    // } else {
    //   this.$router.push({
    //     name: "Periods",
    //   });
    // }
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      const { data } = await payrollPeriodsAPI.GetPayrollPeriodsByPeriodCode(
        this.periodCode
      );
      if (data) {
        this.periodData = this.formatData(data[0]);
      } else {
        this.periodData = {};
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const promises = [
        payrollAPI
          .GetEmployeeListByPlacementCode(this.periodData.placement_code)
          .then((response) => {
            this.employeeOptions = response.data;
          }),

        payrollAPI
          .GetPositionListByPlacementCode(this.periodData.placement_code)
          .then((response) => {
            this.positionsOptions = response.data;
          }),

        payrollAPI
          .GetDepartmentListByPlacementCode(this.periodData.placement_code)
          .then((response) => {
            this.departmentsOptions = response.data;
          }),

        payrollAPI.GetConstTaxMethod().then((response) => {
          this.taxMethodOptions = response.data;
        }),

        payrollAPI.GetConstTaxIncomeType().then((response) => {
          this.taxIncomeOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async loadPayrollStatistic() {
    try {
      const { data } = await payrollPeriodsAPI.GetPayrollStatistic(
        this.periodCode
      );
      if (data) {
        this.statusCounts = data;
      } else {
        this.statusCounts = {};
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadPayroll() {
    const { data } = await payrollAPI.GetPayrollListByPeriodCode(
      this.periodData.period_code
    );
    if (data) {
      this.rowEmployeeData = data;
    } else {
      this.rowEmployeeData = [];
    }
  }

  async generatePayroll(formData: any) {
    try {
      this.isGenerating = true;

      const { status2 } = await payrollAPI.GeneratePayroll(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.payroll.success.saveGenerate"));
        this.$nextTick();
        this.showGenerateModal = false;
        this.loadPayroll();
        this.loadPayrollStatistic();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isGenerating = false;
    }
  }

  async submitPayroll() {
    try {
      this.isSaving = true;
      const { status2 } = await payrollPeriodsAPI.UpdateStatusPayrollPeriod(
        this.periodData.id,
        "PENDING"
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.payroll.success.submitForApproval"));
        this.loadPayroll();
        this.showDialog = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deletePayroll() {
    try {
      this.isSaving = true;
      const { status2 } = await payrollAPI.DeletePayroll(
        this.deleteParam.payroll_id
      );
      if (status2.status === 0) {
        getToastSuccess(
          this.$t("messages.payroll.success.deletePayroll", {
            employeeName: this.deleteParam.employee_name,
          })
        );
        this.$nextTick();
        this.deleteParam = null;
        this.showDialog = false;
        this.loadPayroll();
        this.loadPayrollStatistic();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async savePayrollPeriod() {
    try {
      this.isSaving = true;
      getToastSuccess(
        this.$t("messages.payroll.success.savePayrollPeriodPeriods")
      );
      this.showDialog = false;
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id ? params.id : null,
      period_code: params.period_code ? params.period_code : "",
      period_name: params.period_name ? params.period_name : "",
      period_type: params.period_type ? params.period_type : "",
      period_date: params.period_date ? params.period_date : "",
      Placement: params.Placement ? params.Placement : "",
      placement_code: params.placement_code ? params.placement_code : "",
      default_tax_income_type: params.default_tax_income_type
        ? params.default_tax_income_type
        : "",
      default_tax_method: params.default_tax_method
        ? params.default_tax_method
        : "",
      start_date: params.start_date ? params.start_date : "",
      end_date: params.end_date ? params.end_date : "",
      payment_date: params.payment_date
        ? formatFullDate(params.payment_date)
        : "",
      status: params.status ? params.status : "",
      remark: params.remark ? params.remark : "",

      // modified
      created_at: params.created_at ? formatFullDate(params.created_at) : "",
      created_by: params.created_by ? params.created_by : "",
      updated_at: params.updated_at ? formatFullDate(params.updated_at) : "",
      updated_by: params.updated_by ? params.updated_by : "",
    };
  }

  getStatusBadgeClass(params: string): string {
    // const status = params.toUpperCase();
    switch (params) {
      case "Draft":
        return "text-bg-secondary";
      case "Pending":
        return "text-bg-warning";
      case "Approved":
        return "text-bg-success";
      case "Rejected":
        return "text-bg-danger";
      case "Ready To Payment":
        return "text-bg-info";
      case "Processing":
        return "text-bg-info";
      case "Completed":
        return "text-bg-primary";
      default:
        return "text-bg-secondary";
    }
  }

  // HELPER =======================================================
  get canSubmit(): boolean {
    return (
      this.rowEmployeeData.length > 0 && this.periodData.status === "Draft"
    );
  }

  get canEdit(): boolean {
    return this.periodData.status === "Draft";
  }
}
