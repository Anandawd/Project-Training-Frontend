import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import { formatCurrency, formatNumberValue } from "@/utils/format";
import { getError } from "@/utils/general";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EmployeePayrollTable from "../components/employee-payroll-table/employee-payroll-table.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();
const payrollAPI = new PayrollAPI();

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
    CSelect,
    EmployeePayrollTable,
  },
})
export default class Employee extends Vue {
  // data
  public modeData: any;
  public periodId: string = "";
  public periodData: any = ref([]);
  public rowEmployeeData: any = [];
  public employees: any = [];

  // form
  public form: any = reactive({
    select_employee: "all",
    departments: [],
    positions: [],
    tax_income_type: "PPH21",
    tax_method: "GROSS",
    selectedEmployees: [],
  });

  // options data
  public employeeOptions: any = [];
  public taxIncomeOptions: any = [];
  public taxMethodOptions: any = [];
  public departmentsOptions: any = [];
  public positionsOptions: any = [];

  // selector options
  public selectEmployeeOptions: any = [
    { code: "all", name: "All Employees" },
    { code: "department", name: "By Department" },
    { code: "position", name: "By Position" },
    { code: "specific", name: "Select Specific Employees" },
  ];

  // Filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [1],
  };

  // Generate options
  public generateOptions: any = {
    selectionMode: "all",
    departmentId: [],
    positionId: [],
    selectedEmployeeIds: [],
  };

  // processing state
  public isGenerating: boolean = false;
  public isSubmitting: boolean = false;
  public isSaving: boolean = false;

  // stats
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

  // modal
  public showGenerateModal: boolean = false;
  public showEmployeeSelectorModal: boolean = false;

  // table ref
  employeePayrollTableRef: any;

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
  created() {
    this.periodId = this.$route.params.id as string;
    this.loadData();
    console.log("periodId", this.periodId);

    // Watch for form changes to update generateOptions
    // watch(
    //   () => this.form.select_employee,
    //   (newValue) => {
    //     this.generateOptions.selectionMode = newValue;
    //   }
    // );
    // watch(
    //   () => this.form.departments,
    //   (newValue) => {
    //     this.generateOptions.departmentId = newValue;
    //   }
    // );
    // watch(
    //   () => this.form.positions,
    //   (newValue) => {
    //     this.generateOptions.positionId = newValue;
    //   }
    // );

    // watch(
    //   () => this.form.selectedEmployees,
    //   (newValue) => {
    //     this.generateOptions.selectedEmployeeIds = newValue;
    //   }
    // );
  }

  // GENERAL FUNCTION =======================================================
  handleTableAction(params: any) {
    switch (params.event) {
      case "EDIT":
        this.handleToEmployeePayroll(params.params);
        break;
      case "DELETE":
        this.handleDelete(params.params);
        break;
      default:
        break;
    }
  }

  async handleSave() {
    try {
      this.isSaving = true;

      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.SavePayrollPeriod({
      //   id: this.periodData.id,
      //   employeePayrolls: this.rowEmployeeData
      // });

      // For now, simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      getToastSuccess("Payroll saved successfully");
      return true;
    } catch (error) {
      getError(error);
      return false;
    } finally {
      this.isSaving = false;
    }
  }

  handleDelete(params: any) {
    this.deleteParam = { ...params };
    this.dialogAction = "delete";
    this.dialogMessage = this.$t(
      "messages.payroll.confirm.deleteEmployeePayroll"
    );
    this.showDialog = true;
  }

  async handleSubmit() {
    try {
      this.isSubmitting = true;

      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.SubmitPayrollForApproval({
      //   id: this.periodData.id
      // });

      // For now, simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.periodData.status = "Pending";
      getToastSuccess("Payroll has been submitted for approval");

      return true;
    } catch (error) {
      getError(error);
      return false;
    } finally {
      this.isSubmitting = false;
    }
  }

  async handleSubmitForApproval() {
    if (this.rowEmployeeData.length === 0) {
      getToastError(
        "Cannot submit empty payroll. Please generate payroll data first."
      );
      return;
    }

    this.dialogMessage =
      "Are you sure you want to submit this payroll for approval?";
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  handleShowModal() {
    this.form = {
      select_employee: "all",
      departments: [],
      positions: [],
      tax_income_type: "TI01",
      tax_method: "TM01",
      selectedEmployees: [],
    };

    this.generateOptions = {
      selectionMode: "all",
      departmentId: [],
      positionId: [],
      selectedEmployeeIds: [],
    };

    this.showGenerateModal = true;
  }

  async handleSaveModal() {
    try {
      const success = await this.generatePayroll();
      if (success) {
        this.showGenerateModal = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  confirmAction() {
    if (this.dialogAction === "submit") {
      this.handleSubmit();
    } else if (this.dialogAction === "delete") {
      this.deleteData();
    } else if (this.dialogAction === "saveAndhandleBack") {
      this.handleSave().then((success) => {
        if (success) {
          this.$router.push({
            name: "PayrollPeriods",
          });
        }
      });
    }

    this.showDialog = false;
  }

  async handleToEmployeePayroll(employee: any) {
    this.$router.push({
      name: "EmployeePayrollDetail",
      params: {
        periodId: this.periodData.id,
        employeeId: employee.id,
      },
    });
  }

  handleBack() {
    if (this.form.status === "Draft") {
      this.dialogMessage =
        "You have unsaved changes. Do you want to save before going back?";
      this.dialogAction = "saveAndhandleBack";
      this.showDialog = true;
    } else {
      this.$router.push({
        name: "PayrollPeriods",
      });
    }
  }

  // API REQUEST =======================================================
  async generatePayroll() {
    try {
      this.isGenerating = true;
      const payload = {
        periodId: this.periodData.id,
        selectionMode: this.generateOptions.selectionMode,
        departmentId: this.generateOptions.departmentId,
        positionId: this.generateOptions.positionId,
        selectedEmployeeIds: this.generateOptions.selectedEmployeeIds,
        taxMethod: this.form.tax_method,
        taxIncome: this.form.tax_income_type_type,
      };

      // In a real implementation, this would be an API call
      // const { data, status2 } = await payrollAPI.GeneratePayroll(payload);
      // if (status2.status === 0) {
      //   this.rowEmployeeData = data;
      // }

      // For now, simulate a successful generation with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If we're adding more employees, simulate it
      if (this.generateOptions.selectionMode === "all") {
        // Add more employees to the rowEmployeeData if they don't already exist
        const existingIds = this.rowEmployeeData.map((r: any) => r.id);
        const newEmployees = [
          {
            id: 4,
            employe_id: "EMP004",
            employee_name: "Emily Davis",
            department_name: "HR",
            position_name: "HR Officer",
            base_salary: 5500000,
            gross_salary: 6200000,
            total_deductions: 850000,
            tax: 300000,
            net_salary: 5050000,
            status: "Draft",
          },
          {
            id: 5,
            employe_id: "EMP005",
            employee_name: "Michael Wilson",
            department_name: "IT",
            position_name: "Project Manager",
            base_salary: 9000000,
            gross_salary: 11000000,
            total_deductions: 1800000,
            tax: 700000,
            net_salary: 8500000,
            status: "Draft",
          },
        ].filter((e) => !existingIds.includes(e.id));

        this.rowEmployeeData = [...this.rowEmployeeData, ...newEmployees];
      } else if (
        this.generateOptions.selectionMode === "department" &&
        this.form.departments.length > 0
      ) {
        // Add employees based on department
        const filteredEmployees = this.employees
          .filter((e: any) => this.form.departments.includes(e.department))
          .map((e: any) => ({
            id: e.id,
            employe_id: e.code,
            employee_name: e.name,
            department_name: e.department,
            position_name: e.position,
            base_salary: Math.floor(Math.random() * 5000000) + 5000000,
            gross_salary: Math.floor(Math.random() * 2000000) + 6000000,
            total_deductions: Math.floor(Math.random() * 800000) + 700000,
            tax: Math.floor(Math.random() * 400000) + 300000,
            net_salary: Math.floor(Math.random() * 2000000) + 5000000,
            status: "Draft",
          }));

        // Add only employees that don't already exist in rowEmployeeData
        const existingIds = this.rowEmployeeData.map((r: any) => r.id);
        const newEmployees = filteredEmployees.filter(
          (e: any) => !existingIds.includes(e.id)
        );

        this.rowEmployeeData = [...this.rowEmployeeData, ...newEmployees];
      }

      getToastSuccess("Payroll has been generated successfully");
      return true;
    } catch (error) {
      getError(error);
      return false;
    } finally {
      this.isGenerating = false;
      this.showGenerateModal = false;
    }
  }

  async loadData() {
    try {
      const { data } = await payrollPeriodsAPI.GetPayrollPeriods(this.periodId);
      if (data) {
        this.periodData = data;
      } else {
        this.periodData = [];
      }

      console.log("data", this.periodData);
      console.log("data", data);
      // await Promise.all([this.loadDepartments(), this.loadPositions()]);

      // if (this.periodData.id) {
      //   await this.loadEmployeePayrolls();
      // }
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid() {
    if (this.employeePayrollTableRef) {
      this.employeePayrollTableRef.refreshGrid();
    }
  }

  async loadPeriodData(params: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async loadMockPeriodData() {
    this.rowEmployeeData = [
      {
        id: 1,
        employe_id: "EMP001",
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
        employe_id: "EMP002",
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
        employe_id: "EMP003",
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
  }

  async loadEmployeePayrolls() {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetEmployeePayrolls(this.periodData.id);
      // this.rowEmployeeData = data;
      // For now, we're using the mock data loaded in loadMockPeriodData
    } catch (error) {
      getError(error);
    }
  }

  async loadDepartments() {
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

  async loadPositions() {
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

  async deleteData() {
    try {
      const { status2 } = await payrollPeriodsAPI.GetPayrollPeriods(
        this.deleteParam.id
      );
      if (status2.status === 0) {
        getToastSuccess(
          this.$t("messages.payroll.success.deleteEmployeePayroll")
        );
        this.$nextTick();
        this.loadDataGrid();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.deleteParam = null;
      this.showDialog = false;
    }
  }

  // HELPER =======================================================
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Draft":
        return "text-bg-secondary";
      case "Pending":
        return "text-bg-warning";
      case "Approve":
        return "text-bg-success";
      case "Ready to Payment":
        return "text-bg-info";
      case "Completed":
        return "text-bg-primary";
      case "Rejected":
        return "text-bg-danger";
      default:
        return "text-bg-secondary";
    }
  }

  onSelectEmployeeChange() {
    this.generateOptions.selectionMode = this.form.select_employee;
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
