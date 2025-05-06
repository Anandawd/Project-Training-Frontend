import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatCurrency, formatNumber2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
  },
  emits: ["continue"],
})
export default class DisbursementDetail extends Vue {
  public periodId: string = "";
  public periodData: any = {};
  public rowData: any = [];
  public isLoading: boolean = false;

  // Dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

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
  formatNumber2 = formatNumber2;

  // LIFECYCLE HOOKS
  created() {
    const periodId = this.$route.params.id as string;
    this.loadInitialData();
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
        headerName: this.$t("commons.table.payroll.payroll.bank"),
        field: "bank_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalEmployees"),
        field: "total_employees",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalAmount"),
        field: "total_amount",
        width: 150,
        enableRowGroup: true,
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
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  // API METHODS
  async loadInitialData() {
    try {
      this.isLoading = true;
      await this.loadPeriodData();
      await this.loadBankSummary();
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadPeriodData() {
    // In a real implementation, this would be an API call
    // const { data } = await payrollAPI.GetPayrollDisbursementDetail(this.periodId);
    // this.periodData = data;

    // Mock data
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
      status: "Ready to Payment",
      current_level: 2,
      total_level: 2,
      approved_by: "Finance Manager",
    };
  }

  async loadBankSummary() {
    // In a real implementation, this would be an API call
    // const { data } = await payrollAPI.GetBankSummary(this.periodId);
    // this.rowDataSummary = data;

    // Mock data
    this.rowData = [
      {
        id: 1,
        bank_name: "BCA",
        total_employees: 8,
        total_amount: 40000000,
        status: "Ready",
      },
      {
        id: 2,
        bank_name: "Mandiri",
        total_employees: 5,
        total_amount: 25000000,
        status: "Ready",
      },
      {
        id: 3,
        bank_name: "BNI",
        total_employees: 4,
        total_amount: 20000000,
        status: "Ready",
      },
      {
        id: 4,
        bank_name: "BRI",
        total_employees: 3,
        total_amount: 15000000,
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
      case "Processing":
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
  handleContinue() {
    this.$emit("continue");
  }

  async handleShowDetail(bank: any) {
    this.$router.push({
      name: "BankDisbursementDetail",
      params: {
        periodId: this.periodId,
        bank: bank.bank_name,
      },
    });
  }

  handleBack() {
    this.$router.push({
      name: "PayrollDisbursement",
    });
  }

  confirmAction() {
    this.showDialog = false;
  }

  // COMPUTED PROPERTIES
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
  get canContinue(): boolean {
    return this.periodData.status === "Ready to Payment";
  }
}
