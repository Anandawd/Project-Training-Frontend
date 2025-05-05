import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CCheckBox from "@/components/checkbox/checkbox.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { formatCurrency, formatNumber2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive } from "vue";
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
export default class PayrollDisbursementProcess extends Vue {
  public periodId: string = "";
  public periodData: any = {};
  public processOptions: any = reactive({
    selectedBank: "",
    formatFile: "",
    includeId: false,
    includeName: false,
  });
  public isProcessing: boolean = false;
  public formatCurrency = formatCurrency;

  public rowData: any = [];

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
  public isGenerating: boolean = false;
  public isSubmitting: boolean = false;
  public isSaving: boolean = false;

  // Dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Modal
  public showModal: boolean = false;
  public showEmployeeSelectorModal: boolean = false;

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

  // LIFECYCLE HOOKS
  async created() {
    const periodId = this.$route.params.id as string;

    const query = this.$route.query;
    this.processOptions = {
      selectedBank: query.selectedBank || "all",
      formatFile: query.formatFile || "CSV",
      separateFiles: query.separateFiles === "true",
      includeId: query.includeId === "true",
      includeName: query.includeName === "true",
    };

    await this.loadPeriodData();
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

  // API METHOD
  async loadPeriodData() {
    try {
      await this.loadMockDisbursementData();
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
  }

  async handleDownloadFile() {
    try {
      this.isProcessing = true;

      const filename = `Payroll_${this.periodData.period_name.replace(
        /\s+/g,
        "_"
      )}_${this.processOptions.formatFile}`;

      // Mock download logic
      getToastSuccess(`File ${filename} has been downloaded successfully`);

      this.markAsProccesing();
    } catch (error) {
      getError(error);
    } finally {
      this.isProcessing = false;
    }
  }

  async handleMarkAsCompleted() {
    try {
      this.periodData.status = "Completed";
      getToastSuccess("Payroll disbursement has been marked as completed");
    } catch (error) {
      getError(error);
    }
  }

  async markAsProccesing() {
    try {
      this.periodData.status = "Processing";
      getToastSuccess("Payroll status updated to Processing");
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

  refreshData(search: any) {
    // this.loadDataGrid(search);
  }

  handleShowModal() {
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
      // const success = await this.generatePayroll();
      // if (success) {
      //   this.showModal = false;
      // }
    } catch (error) {
      getError(error);
    }
  }

  confirmAction() {
    if (this.dialogAction === "submit") {
      // this.handleSubmit();
    } else if (this.dialogAction === "saveAndGoBack") {
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

  goBack() {
    this.$router.push({
      name: "DisbursementDetail",
      params: { id: this.periodId },
    });
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

  get canMarkComplete(): boolean {
    return this.periodData.status === "Processing";
  }
}
