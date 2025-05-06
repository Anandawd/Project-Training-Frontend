import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CCheckBox from "@/components/checkbox/checkbox.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CRadio from "@/components/radio/radio.vue";
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
    CRadio,
    CCheckBox,
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
  public rowDataSummary: any = [];
  public employees: any = [];

  // Selector options
  public selectBankOptions: any = [
    { code: "all", name: "All Bank" },
    { code: "bca", name: "BCA" },
    { code: "bni", name: "BNI" },
    { code: "bri", name: "BRI" },
    { code: "mandiri", name: "Mandiri" },
    { code: "cash", name: "Cash" },
  ];

  public selectProviderOptions: any = [
    { code: "P01", name: "Xendit" },
    { code: "P02", name: "Midtrans" },
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
  public isProcessing: boolean = false;
  public isSubmitting: boolean = false;
  public isSaving: boolean = false;

  // Dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Modal
  public showModal: boolean = false;

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDefs: any;
  columnDefsSummary: any;
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
        width: 80,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.id"),
        field: "employe_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employee"),
        field: "employee_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.bank"),
        field: "bank_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.accountNumber"),
        field: "bank_account_number",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.accountHolder"),
        field: "bank_account_holder",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.amount"),
        field: "total_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        field: "status",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.reference"),
        field: "reference",
        width: 100,
        enableRowGroup: true,
      },
    ];
    this.columnDefsSummary = [
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
        width: 80,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.bank"),
        field: "bank_name",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.employees"),
        field: "total_employees",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalAmount"),
        field: "total_amount",
        width: 100,
        enableRowGroup: false,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
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
    this.rowSelection = "multiple";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
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
        await this.loadMockDisbursementData();
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadMockDisbursementData() {
    this.periodData = {
      id: this.periodId || 1,
      period_name: "April 2025",
      placement: "Amora Ubud",
      period_type: "Monthly",
      start_date: "01/04/2025",
      end_date: "30/04/2025",
      payment_date: "01/05/2025",
      total_employees: 5,
      total_payment: 25000000,
      current_level: 2,
      total_level: 2,
      remark: "",
      status: "Ready to Payment",
      created_by: "Budi Admin",
      approved_by: "Finance Manager",
      created_at: "25/04/2025",
      updated_at: "25/04/2025",
    };

    this.rowData = [
      {
        id: 1,
        employe_id: "EMP001",
        employee_name: "John Doe",
        bank_name: "BCA",
        bank_account_number: "11111111",
        bank_account_holder: "JOHN DOE",
        total_amount: 5000000,
        status: "Ready",
        reference: "",
      },
      {
        id: 2,
        employe_id: "EMP001",
        employee_name: "Lukas Graham",
        bank_name: "BNI",
        bank_account_number: "11111111",
        bank_account_holder: "LUKAS GRAHAM",
        total_amount: 5000000,
        status: "Ready",
        reference: "",
      },
      {
        id: 3,
        employe_id: "EMP001",
        employee_name: "James Smith",
        bank_name: "Mandiri",
        bank_account_number: "11111111",
        bank_account_holder: "JAMES SMITH",
        total_amount: 5000000,
        status: "Ready",
        reference: "",
      },
      {
        id: 4,
        employe_id: "EMP001",
        employee_name: "Budi Doremi",
        bank_name: "BCA",
        bank_account_number: "11111111",
        bank_account_holder: "BUDI DOREMI",
        total_amount: 5000000,
        status: "Ready",
        reference: "",
      },
      {
        id: 5,
        employe_id: "EMP001",
        employee_name: "John Smith",
        bank_name: "BRI",
        bank_account_number: "11111111",
        bank_account_holder: "JOHN SMITH",
        total_amount: 5000000,
        status: "Ready",
        reference: "",
      },
    ];

    this.rowDataSummary = [
      {
        id: 1,
        bank_name: "BCA",
        total_employees: 8,
        total_amount: 85000000,
        status: "Ready",
      },
      {
        id: 2,
        bank_name: "BRI",
        total_employees: 7,
        total_amount: 74500000,
        status: "Ready",
      },
      {
        id: 3,
        bank_name: "Mandiri",
        total_employees: 4,
        total_amount: 48000000,
        status: "Ready",
      },
      {
        id: 4,
        bank_name: "BNI",
        total_employees: 2,
        total_amount: 29000000,
        status: "Ready",
      },
      {
        id: 5,
        bank_name: "Cash",
        total_employees: 2,
        total_amount: 10000000,
        status: "Ready",
      },
    ];
  }

  async loadEmployeePayrolls() {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetEmployeePayrolls(this.periodData.id);
      // this.rowData = data;
      // For now, we're using the mock data loaded in loadMockDisbursementData
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
      // const { data } = await payrollAPI.GetEmployees(search);
      // this.employees = data;
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

  refreshData(search: any) {
    // this.loadDataGrid(search);
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

    this.showModal = true;
  }

  async handleSaveModal() {
    try {
      this.isProcessing = true;

      if (this.form.payment_method === "Manual") {
        this.$router.push({
          name: "DisbursementProcess",
          params: { id: this.periodData.id },
          query: {
            selectedBank: this.form.select_bank,
            formatFile: this.form.format_file,
            separateFiles: this.form.is_separate_file_each_bank,
            inludeId: this.form.is_include_employee_id,
            inludeName: this.form.is_include_employee_name,
          },
        });
      } else {
        await this.processAutomaticPayment();
      }
      this.showModal = false;
    } catch (error) {
      getError(error);
    } finally {
      this.isProcessing = false;
    }
  }

  handleProcessPayment() {
    this.$router.push({
      name: "DisbursementProcess",
      params: { id: this.periodData.id },
    });
  }

  processAutomaticPayment() {}

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
        name: "PayrollDisbursement",
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
