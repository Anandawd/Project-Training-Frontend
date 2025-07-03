import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import { formatDate2, formatDateTime2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";

const payrollAPI = new PayrollAPI();
const payrollPeriodsAPI = new PayrollPeriodsAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
  },
})
export default class PayrollDisbursement extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;
  public approveParam: any;

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();
  public isSaving: boolean = false;
  public isLoading: boolean = false;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // stats
  public statusCounts: any = ref({
    all: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
    completed: 0,
  });

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

  cellSelected: any;

  // RECYCLE LIFE FUNCTION =======================================================
  mounted(): void {
    this.loadDataGrid();
    // this.loadMockData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.payroll.periodName"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 1 },
      { text: this.$t("commons.filter.remark"), value: 2 },
    ];
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
        field: "id",
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
        headerName: this.$t("commons.table.payroll.employee.code"),
        field: "period_code",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.periodName"),
        field: "period_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "Placement",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.periodDate"),
        field: "period_date",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.paymentDate"),
        field: "payment_date",
        headerClass: "align-header-center",
        cellClass: "text-center",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 150,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value.toUpperCase();
          let badgeClass = "";
          let statusText = "";

          switch (status) {
            case "PENDING":
              badgeClass = "bg-warning";
              statusText = "PENDING";
              break;
            case "APPROVED":
              badgeClass = "bg-success";
              statusText = "APPROVED";
              break;
            case "REJECTED":
              badgeClass = "bg-danger";
              statusText = "REJECTED";
              break;
            case "READY TO PAYMENT":
              badgeClass = "bg-success";
              statusText = "READY TO PAYMENT";
              break;
            case "PROCESSING":
              badgeClass = "bg-primary";
              statusText = "PROCESSING";
              break;
            case "COMPLETED":
              badgeClass = "bg-primary";
              statusText = "COMPLETED";
              break;
            default:
              badgeClass = "bg-secondary";
              statusText = status;
          }
          return `<span class="badge ${badgeClass} py-1 px-3">${statusText}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
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

  // GENERAL FUNCTION =======================================================
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
        disabled:
          !this.paramsData || this.paramsData.status === "Ready To Payment",
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () =>
          this.handleToDisbursementDetail(
            this.paramsData,
            $global.modePayroll.detail
          ),
      },
      {
        name: this.$t("commons.contextMenu.process"),
        disabled:
          !this.paramsData ||
          this.paramsData.status === "Completed" ||
          this.paramsData.status === "Processing",
        icon: generateIconContextMenuAgGrid("process_icon24"),
        action: () =>
          this.handleToDisbursementDetail(
            this.paramsData,
            $global.modePayroll.process
          ),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.downloadBulkPayslip"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("download_icon24"),
        //  action: () => this.handleApprove(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.downloadBulkFormA1"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("download_icon24"),
        // action: () => this.handleShowDetail(this.paramsData),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  handleToProcess() {
    this.$router.push({
      name: "DisbursementProcess",
      params: { periodCode: this.paramsData.period_code },
    });
  }

  handleToDetail() {
    this.$router.push({
      name: "DisbursementDetail",
      params: { periodCode: this.paramsData.period_code },
    });
  }

  handleToDisbursementDetail(params: any, mode: any) {
    console.log("handleToDisbursementDetail", { params, mode });
    if (mode === $global.modePayroll.process) {
      this.insertData();
    } else {
      this.$router.push({
        name: "DisbursementProcess",
        params: { periodCode: params.period_code },
      });
    }
  }

  handleMenu() {}

  onSelectionChanged() {
    const data = this.gridApi.getSelectedRows();
    this.cellSelected = data[0];
    console.log("davif", this.cellSelected);
  }

  refreshData(search: any) {
    // this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      this.isLoading = true;
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await payrollPeriodsAPI.GetPayrollPeriodsList(params);
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }

      const { data: statusData } =
        await payrollPeriodsAPI.GetPayrollPeriodsStatusStatistic();
      this.statusCounts = statusData;
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = true;
    }
  }

  async loadMockData() {
    this.rowData = [
      {
        id: 4,
        period_code: "payroll-cakra-april-2025",
        period_name: "April 2025",
        period_date: "01/04/2025 - 30/04/2025",
        payment_date: "01/05/2025",
        remark: "-",
        status: "Completed",
      },
      {
        id: 1,
        period_code: "payroll-cakra-mei-2025",
        period_name: "May 2025",
        period_date: "01/05/2025 - 31/05/2025",
        payment_date: "01/06/2025",
        remark: "-",
        status: "Ready To Payment",
      },
      {
        id: 2,
        period_code: "payroll-cakra-juni-2025",
        period_name: "June 2025",
        period_date: "01/06/2025 - 30/06/2025",
        payment_date: "01/07/2025",
        remark: "-",
        status: "Ready To Payment",
      },
      {
        period_code: "payroll-cakra-juli-2025",
        id: 3,
        period_name: "July 2025",
        period_date: "01/07/2025 - 30/07/2025",
        payment_date: "01/08/2025",
        remark: "-",
        status: "Ready To Payment",
      },
    ];
  }

  async insertData() {
    try {
      this.isSaving = true;
      const formData = {
        payment_processing_id: "payment+period_code+bank_name",
        period_code: this.paramsData.payment_date,
        payment_date: this.paramsData.payment_date,
        bank_name: "",
        current_step: 1,
        file_format: "",
        processing_method: "",
        total_amount: 0,
        total_employees: 0,
        completion_time: "",
        status: "Processing",
        remark: "",
      };
      const { status2 } = await payrollAPI.InsertPaymentProcessing(formData);
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.payroll.payroll.savePaymentProcessing")
        );
        this.handleToProcess();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER =======================================================

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get enableProcess() {
    console.log("enableProcess", this.cellSelected);
    if (this.cellSelected) {
      return true;
      // return (
      //   this.cellSelected.status === "Ready To Payment" ||
      //   this.cellSelected.status === "READY TO PAYMENT" ||
      //   this.cellSelected.status === ""
      // );
    } else {
      return false;
    }
  }

  get isDetailButton() {
    if (this.paramsData) {
      return (
        this.paramsData.status === "Completed" ||
        this.paramsData.status === "COMPLETED"
      );
    }
    return false;
  }
}
