import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import { formatCurrency, formatNumberValue } from "@/utils/format";
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
  public periodCode: string = "";
  public periodData: any = ref([]);
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
    total_employee: 0,
    total_gross: 0,
    total_deductions: 0,
    total_net: 0,
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

  // RECYCLE LIFE FUNCTION =======================================================

  created(): void {
    this.periodCode = this.$route.params.code as string;
    console.log("route", this.$route.params);
    console.log("periodCode", this.periodCode);
    this.loadMockData();
  }

  mounted() {
    this.periodCode = this.$route.params.id as string;
    console.log("route", this.$route.params);
    console.log("periodCode", this.periodCode);

    // this.loadData();
    this.loadMockData();
  }

  // GENERAL FUNCTION =======================================================
  handleTableAction(params: any) {
    console.log("handleTableAction", params);
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
    console.log("handleGenerate params", params);
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
    this.periodCode = "pay0001";
    console.log("handleToEmployeePayroll employeeID:", employee.employee_id);
    console.log("handleToEmployeePayroll periodCOde", this.periodCode);

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
  async generatePayroll(formData: any) {
    try {
      this.isGenerating = true;

      // In a real implementation, this would be an API call
      // const { data, status2 } = await payrollAPI.GeneratePayroll(formData);
      // if (status2.status === 0) {
      //   this.rowEmployeeData = data;
      // }

      getToastSuccess("Payroll has been generated successfully");
    } catch (error) {
      getError(error);
    } finally {
      this.isGenerating = false;
      this.showGenerateModal = false;
    }
  }

  async loadData() {
    try {
      const { data } = await payrollPeriodsAPI.GetPayrollPeriods(
        this.periodCode
      );
      if (data) {
        this.periodData = data;
      } else {
        this.periodData = [];
      }

      console.log("data", data);
      console.log("periodData", this.periodData);
      // await Promise.all([this.loadDepartmentOptions(), this.loadPositionOptions()]);
      // this.loadPayroll();
      this.loadMockData();
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowEmployeeData = [
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_name: "IT",
        position_name: "Developer",
        base_salary: 7000000,
        gross_salary: 8500000,
        total_deductions: 1200000,
        tax: 500000,
        net_salary: 6800000,
        status: "Draft",
      },
      {
        id: 2,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_name: "Marketing",
        position_name: "Manager",
        base_salary: 8500000,
        gross_salary: 10000000,
        total_deductions: 1500000,
        tax: 600000,
        net_salary: 7900000,
        status: "Draft",
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "Robert Johnson",
        department_name: "Finance",
        position_name: "Accountant",
        base_salary: 6000000,
        gross_salary: 7200000,
        total_deductions: 950000,
        tax: 450000,
        net_salary: 5800000,
        status: "Draft",
      },
    ];

    this.statusCounts = {
      total_employee: 10,
      total_gross: 20000000,
      total_deductions: 1000000,
      total_net: 19000000,
    };

    this.taxIncomeOptions = [
      {
        code: "PPH21",
        name: "PPH 21",
      },
      {
        code: "PPH26",
        name: "PPH 26",
      },
    ];

    this.taxMethodOptions = [
      {
        code: "GROSS",
        name: "Gross",
      },
      {
        code: "GROSSUP",
        name: "Gross Up",
      },
      {
        code: "NETTO",
        name: "Netto",
      },
    ];
    this.positionsOptions = [
      {
        code: "GROSS",
        name: "Gross",
      },
      {
        code: "GROSSUP",
        name: "Gross Up",
      },
      {
        code: "NETTO",
        name: "Netto",
      },
    ];
    this.departmentsOptions = [
      {
        code: "GROSS",
        name: "Gross",
      },
      {
        code: "GROSSUP",
        name: "Gross Up",
      },
      {
        code: "NETTO",
        name: "Netto",
      },
    ];
  }

  async loadPayroll() {
    // tambahkan GetPayrollListByPeriodCode
    const { data } = await payrollAPI.GetPayrollList(this.periodData);
    if (data) {
      this.rowEmployeeData = data;
    } else {
      this.rowEmployeeData = [];
    }
    // if (this.employeePayrollTableRef) {
    //   this.employeePayrollTableRef.refreshGrid();
    // }
  }

  async loadEmployeeOptions() {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetEmployeePayrolls(this.periodData.id);
      // this.rowEmployeeData = data;
      // For now, we're using the mock data loaded in loadMockData
    } catch (error) {
      getError(error);
    }
  }

  async loadDepartmentOptions() {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetDepartments();
      // this.departments = data;
      // this.departmentsOptions = data.map(d => ({ code: d.id, name: d.name }));
      // Using mock data for now
    } catch (error) {
      getError(error);
    }
  }

  async loadPositionOptions() {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetPositions();
      // this.positions = data;
      // this.positionsOptions = data.map(p => ({ code: p.id, name: p.name }));
      // Using mock data for now
    } catch (error) {
      getError(error);
    }
  }

  async submitPayroll() {
    try {
      this.isSaving = true;
      getToastSuccess(this.$t("messages.payroll.success.submitForApproval"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
      this.showDialog = false;
    }
  }

  async savePayrollPeriod() {
    try {
      this.isSaving = true;
      getToastSuccess(
        this.$t("messages.payroll.success.savePayrollPeriodPeriods")
      );
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
      this.showDialog = false;
    }
  }

  async deletePayroll() {
    try {
      this.isSaving = true;
      const { status2 } = await payrollAPI.DeletePayroll(this.deleteParam);
      if (status2.status === 0) {
        getToastSuccess(
          this.$t("messages.payroll.success.deletePayroll", {
            employeeName: this.deleteParam.employee_name,
          })
        );
        this.$nextTick();
        this.loadPayroll();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.deleteParam = null;
      this.isSaving = false;
      this.showDialog = false;
    }
  }

  // HELPER =======================================================
  getStatusBadgeClass(params: string): string {
    const status = params.toUpperCase();
    switch (status) {
      case "DRAFT":
        return "text-bg-secondary";
      case "PENDING":
        return "text-bg-warning";
      case "APPROVED":
        return "text-bg-success";
      case "REJECTED":
        return "text-bg-danger";
      case "READY TO PAYMENT":
        return "text-bg-info";
      case "PROCESSING":
        return "text-bg-info";
      case "COMPLETED":
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
