import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import {
  formatCurrency,
  formatNumber2,
  formatNumberValue,
} from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, watch } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
    CSelect,
  },
})
export default class Employee extends Vue {
  // form and data
  public form: any = reactive({
    select_employee: "all",
    departments: [],
    positions: [],
    tax_income_type: "PPH21",
    tax_method: "GROSS",
    selectedEmployees: [],
  });
  public modeData: any;
  public periodId: string = "";
  public periodData: any = {};
  public rowData: any = [];
  public employees: any = [];

  // Selector options
  public selectEmployeeOptions: any = [
    { code: "all", name: "All Employees" },
    { code: "department", name: "By Department" },
    { code: "position", name: "By Position" },
    { code: "specific", name: "Select Specific Employees" },
  ];

  public departmentsOptions: any = [
    { code: "D01", name: "IT" },
    { code: "D02", name: "Marketing" },
    { code: "D03", name: "Finance" },
    { code: "D04", name: "Human Resources" },
  ];

  public positionsOptions: any = [
    { code: "P01", name: "Manager" },
    { code: "P02", name: "Developer" },
    { code: "P03", name: "Accountant" },
    { code: "P04", name: "HR Officer" },
  ];

  public employeesOptions: any = [
    { code: "EMP01", name: "John Doe" },
    { code: "EMP02", name: "James Smith" },
    { code: "EMP03", name: "Budi Doremi" },
    { code: "EMP04", name: "Lukas Graham" },
  ];

  public taxIncomeOptions: any = [
    { code: "PPH21", name: "PPh 21" },
    { code: "PPH26", name: "PPh 26" },
  ];

  public taxMethodOptions: any = [
    { code: "GROSS", name: "Gross" },
    { code: "GROSSUP", name: "Gross Up" },
    { code: "NETTO", name: "Netto" },
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

  // Processing state
  public isGenerating: boolean = false;
  public isSubmitting: boolean = false;
  public isSaving: boolean = false;

  // Dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Modal
  public showGenerateModal: boolean = false;
  public showEmployeeSelectorModal: boolean = false;

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

  // LIFECYCLE HOOKS
  created() {
    const periodId = this.$route.params.id as string;
    this.loadInitialData();

    // Watch for form changes to update generateOptions
    watch(
      () => this.form.select_employee,
      (newValue) => {
        this.generateOptions.selectionMode = newValue;
      }
    );
    watch(
      () => this.form.departments,
      (newValue) => {
        this.generateOptions.departmentId = newValue;
      }
    );
    watch(
      () => this.form.positions,
      (newValue) => {
        this.generateOptions.positionId = newValue;
      }
    );

    watch(
      () => this.form.selectedEmployees,
      (newValue) => {
        this.generateOptions.selectedEmployeeIds = newValue;
      }
    );
  }

  beforeMount(): void {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "Code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeId"),
        field: "employe_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "employee_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "department_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "position_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.baseSalary"),
        field: "base_salary",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.grossSalary"),
        field: "gross_salary",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalDeductions"),
        field: "total_deductions",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.pph21"),
        field: "tax",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.takeHomePay"),
        field: "net_salary",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        field: "status",
        width: 100,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  // DATA LOADING METHODS
  async loadInitialData() {
    try {
      await this.loadPeriodData(this.periodId);
      await Promise.all([
        this.loadDepartments(),
        this.loadPositions(),
        this.loadEmployees,
      ]);

      if (this.periodData.id) {
        await this.loadEmployeePayrolls();
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadPeriodData(periodId: any) {
    try {
      if (periodId === "new") {
        // this.periodData = {
        //   id: null,
        //   period_name: "",
        //   placement: "",
        //   period_type: "",
        //   start_date: "",
        //   end_date: "",
        //   payment_date: "",
        //   remark: "",
        //   status: "Draft",
        //   created_by: "",
        //   created_at: "",
        //   updated_at: "",
        // };
        // this.rowData = [];
      } else {
        // In a real implementation, this would be an API call
        // const { data } = await payrollAPI.GetPayrollPeriodDetail(periodId);
        // this.periodData = data;

        // For demonstration, we're using mock data
        await this.loadMockPeriodData();
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadMockPeriodData() {
    this.periodData = {
      id: this.periodId || 1,
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

    this.rowData = [
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
      // this.rowData = data;
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

  async loadEmployees(search: any = this.searchDefault) {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetEmployees(search);
      // this.employees = data;
      // Mock data for now
      this.employees = [
        {
          id: 1,
          code: "EMP001",
          name: "John Doe",
          department: "IT",
          position: "Developer",
        },
        {
          id: 2,
          code: "EMP002",
          name: "Jane Smith",
          department: "Marketing",
          position: "Manager",
        },
        {
          id: 3,
          code: "EMP003",
          name: "Robert Johnson",
          department: "Finance",
          position: "Accountant",
        },
        {
          id: 4,
          code: "EMP004",
          name: "Emily Davis",
          department: "HR",
          position: "HR Officer",
        },
        {
          id: 5,
          code: "EMP005",
          name: "Michael Wilson",
          department: "IT",
          position: "Project Manager",
        },
      ];
    } catch (error) {
      getError(error);
    }
  }

  // UI EVENT HANDLERS
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowDetail(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData || this.periodData.status !== "Draft",
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => {
          this.dialogMessage =
            "Are you sure you want to remove this employee from the payroll?";
          this.dialogAction = "delete";
          this.showDialog = true;
        },
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

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

  // GENERAL FUNCTION
  async handleSave() {
    try {
      this.isSaving = true;

      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.SavePayrollPeriod({
      //   id: this.periodData.id,
      //   employeePayrolls: this.rowData
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

  async handleShowDetail(employee: any) {
    this.$router.push({
      name: "EmployeePayrollDetail",
      params: {
        periodId: this.periodData.id,
        employeeId: employee.id,
      },
    });
  }

  async handleDelete(params: any) {
    try {
      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.RemoveEmployeeFromPayroll({
      //   periodId: this.periodData.id,
      //   employeeId: employee.id
      // });

      // For now, simulate a successful deletion
      this.rowData = this.rowData.filter((item: any) => item.id !== params.id);

      getToastSuccess("Employee removed from payroll successfully");
      return true;
    } catch (error) {
      getError(error);
      return false;
    }
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
    if (this.rowData.length === 0) {
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
      //   this.rowData = data;
      // }

      // For now, simulate a successful generation with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If we're adding more employees, simulate it
      if (this.generateOptions.selectionMode === "all") {
        // Add more employees to the rowData if they don't already exist
        const existingIds = this.rowData.map((r: any) => r.id);
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

        this.rowData = [...this.rowData, ...newEmployees];
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

        // Add only employees that don't already exist in rowData
        const existingIds = this.rowData.map((r: any) => r.id);
        const newEmployees = filteredEmployees.filter(
          (e: any) => !existingIds.includes(e.id)
        );

        this.rowData = [...this.rowData, ...newEmployees];
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
      this.handleDelete(this.paramsData);
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

  // COMPUTED PROPERTIES
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get totalEmployees(): number {
    return this.rowData.length;
  }

  get totalGrossSalary(): number {
    return this.rowData.reduce((total: number, item: any) => {
      return total + (item.gross_salary || 0);
    }, 0);
  }

  get totalDeductions(): number {
    return this.rowData.reduce((total: number, item: any) => {
      return total + (item.total_deductions || 0) + (item.tax || 0);
    }, 0);
  }

  get totalNetSalary(): number {
    return this.rowData.reduce((total: number, item: any) => {
      return total + (item.net_salary || 0);
    }, 0);
  }

  get canSubmit(): boolean {
    return this.rowData.length > 0 && this.periodData.status === "Draft";
  }

  get canEdit(): boolean {
    return this.periodData.status === "Draft";
  }
}
