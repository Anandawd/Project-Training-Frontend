import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import { formatNumber2 } from "@/utils/format";
import { generateTotalFooterAgGrid, getError } from "@/utils/general";
import $global from "@/utils/global";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { Options, Vue } from "vue-class-component";
// import DetailCellRender from "./detail-bank/detail-bank.vue";
import { reactive } from "vue";
import DetailBank from "../detail-bank/detail-bank.vue";

@Options({
  components: {
    AgGridVue,
    DetailBank,
  },
  emits: ["continue"],
})
export default class DisbursementDetail extends Vue {
  // data
  public rowData: any = [];
  public periodCode: string = "";
  public disbursementData: any = reactive({});
  public isLoading: boolean = false;
  public isSaving: boolean = false;

  // dialog
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

  // LIFECYCLE HOOKS
  mounted() {
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
      masterDetail: true,
      detailRowAutoHeight: true,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.payroll.payroll.bank"),
        field: "bank_name",
        headerClass: "align-header-center",
        width: 120,
        enableRowGroup: false,
        cellRenderer: "agGroupCellRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalEmployees"),
        field: "total_employees",
        headerClass: "align-header-center",
        cellClass: "text-center",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalAmount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "total_amount",
        width: 150,
        enableRowGroup: false,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 120,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      detailCellRenderer: DetailBank,
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

  // GENERAL FUNCTION
  handleAction(params: any, mode: any = null, ...additonalParams: any[]) {
    const actionMode = mode || this.modeData;

    switch (actionMode) {
      case $global.modePayroll.back:
        this.handleBack();
        break;
      case $global.modePayroll.next:
        this.handleContinue();
        break;
      default:
        console.warn("Unsupported action mode:", actionMode);
        break;
    }
  }

  handleContinue() {
    this.$emit("continue");
  }

  handleBack() {
    this.$router.push({
      name: "PayrollDisbursement",
    });
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

  // COMPUTED PROPERTIES
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get canContinue(): boolean {
    return this.periodData.status === "Ready to Payment";
  }
}
