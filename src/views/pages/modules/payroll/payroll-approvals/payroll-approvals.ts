import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./payroll-approvals-input-form/payroll-approvals-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
    CInput,
  },
})
export default class PayrollApprovals extends Vue {
  //table
  public rowData: any = [];

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // modal
  public form: any = reactive({
    remark: "",
  });
  public showModal: boolean = false;
  public selectedRow: any = null;
  public isSaving: boolean = false;

  // dialog
  public showDialog: boolean = false;
  public dialogTitle: any = "";
  public dialogMessage: any = "";
  public dialogAction: any;

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

  // LIFECYCLE HOOKS
  created(): void {
    this.loadMockData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.all"), value: 0 },
      { text: this.$t("commons.filter.payroll.payroll.periodName"), value: 0 },
      { text: this.$t("commons.filter.payroll.payroll.status"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 2 },
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
        headerName: this.$t("commons.table.payroll.payroll.periodName"),
        field: "period_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.periodDate"),
        field: "period_date",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.paymentDate"),
        field: "payment_date",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        field: "status",
        width: 100,
        enableRowGroup: true,
        // cellRenderer: (params: any) => {
        //   const status = params.value;
        //   let badgeClass = 'text-bg-secondary';
        //   if (status === 'Pending') {
        //     badgeClass = 'text-bg-warning';
        //   } else if (status === 'Approved') {
        //     badgeClass = 'text-bg-success';
        //   } else if (status === 'Rejected') {
        //     badgeClass = 'text-bg-danger';
        //   }
        //   return `<span class="badge text-bg-secondary px-3 py-1 ${badgeClass}">${status}</span>`;
        // }
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

  // UI FUNCTION
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const canApproveReject = this.paramsData?.status === "Pending";

    const result = [
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowDetail(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.remark"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowModal(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.setApprove"),
        disabled: !canApproveReject,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleApprove(this.paramsData, $global.modePayroll.approve),
      },
      {
        name: this.$t("commons.contextMenu.setReject"),
        disabled: !canApproveReject,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleApprove(this.paramsData, $global.modePayroll.reject),
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

  handleMenu() {}

  // GENERAL FUNCTION
  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  async handleApprove(params: any, mode: any) {
    try {
      if (!params && this.gridApi) {
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
          getToastError("Please select data to approve/reject");
          return;
        }

        const pendingRows = selectedRows.filter(
          (row: any) => row.status === "Pending"
        );
        if (pendingRows.length === 0) {
          getToastError("Please select only pending payroll records");
          return;
        }

        this.selectedRow = selectedRows;
        this.dialogTitle = "Confirm Action";

        if (mode === $global.modePayroll.approve) {
          this.dialogMessage = `Are you sure you want to approve ${selectedRows.length} payroll record(s)?`;
          this.dialogAction = "bulkApprove";
        } else if (mode === $global.modePayroll.reject) {
          this.dialogMessage = `Are you sure you want to reject ${selectedRows.length} payroll record(s)?`;
          this.dialogAction = "bulkReject";
        }

        this.showDialog = true;
      } else if (params) {
        // ... kode yang sudah ada ...
      }
    } catch (error) {
      getError(error);
    }
  }

  async handleSaveModal() {
    try {
      this.isSaving = true;

      if (this.selectedRow && this.form.remark) {
        this.selectedRow.remark = this.form.remark;
        getToastSuccess("Remark has been updated successfully");
        this.rowData = [...this.rowData];
        this.resetFormAndModal();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  handleShowModal(params: any) {
    if (params) {
      this.selectedRow = params;
      this.form.remark = params.remark === "-" ? "" : params.remark;
      this.showModal = true;
    }
  }

  handleShowDetail(params: any) {
    if (params) {
      this.$router.push({
        name: "PeriodDetail",
        params: { id: params.id },
      });
    }
  }

  async confirmAction() {
    try {
      this.isSaving = true;

      if (this.dialogAction === "bulkApprove") {
        this.selectedRow.forEach((row: any) => {
          if (row.status === "Pending") {
            row.status = "Approved";
          }
        });
        getToastSuccess(this.$t("messages.approveSuccess"));
      } else if (this.dialogAction === "bulkReject") {
        this.selectedRow.forEach((row: any) => {
          if (row.status === "Pending") {
            row.status = "Rejected";
          }
        });
        getToastSuccess(this.$t("messages.rejectSuccess"));
      } else if (this.dialogAction === "approve") {
        if (this.selectedRow.status === "Pending") {
          this.selectedRow.status = "Approved";
          getToastSuccess(this.$t("messages.approveSuccess"));
        }
      } else if (this.dialogAction === "reject") {
        if (this.selectedRow.status === "Pending") {
          this.selectedRow.status = "Rejected";
          getToastSuccess(this.$t("messages.rejectSuccess"));
        }
      }

      this.rowData = [...this.rowData];
      this.resetFormAndModal();
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  resetFormAndModal() {
    this.form.remark = "";
    this.selectedRow = null;
    this.showDialog = false;
    this.showModal = false;
    this.dialogAction = "";
    this.dialogMessage = "";
    this.dialogTitle = "";
  }

  // API FUNCTION
  async loadMockData() {
    this.rowData = [
      {
        id: 4,
        period_name: "April 2025",
        period_date: "01/04/2025 - 30/04/2025",
        payment_date: "01/05/2025",
        remark: "-",
        status: "Pending",
      },
      {
        id: 1,
        period_name: "May 2025",
        period_date: "01/05/2025 - 31/05/2025",
        payment_date: "01/06/2025",
        remark: "-",
        status: "Pending",
      },
      {
        id: 2,
        period_name: "June 2025",
        period_date: "01/06/2025 - 30/06/2025",
        payment_date: "01/07/2025",
        remark: "-",
        status: "Pending",
      },
      {
        id: 3,
        period_name: "July 2025",
        period_date: "01/07/2025 - 30/07/2025",
        payment_date: "01/08/2025",
        remark: "-",
        status: "Pending",
      },
    ];
  }

  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      // const {data} = await payrollAPI.getPayrollApprovals(params)
      // this.rowData = data
    } catch (error) {
      getError(error);
    }
  }

  async approvePayroll(params: any) {
    try {
      // const {status2} = await payrollAPI.approvePayroll(params)
      // if(status2.status === 0) {
      //   this.loadDataGrid()
      // }
    } catch (error) {
      getError(error);
    }
  }

  async rejectPayroll(params: any) {
    try {
      // const {status2} = await payrollAPI.rejectPayroll(params)
      // if(status2.status === 0) {
      //   this.loadDataGrid()
      // }
    } catch (error) {
      getError(error);
    }
  }

  async updateRemark(params: any) {
    try {
      // const {status2} = await payrollAPI.updateRemark(params)
      // if(status2.status === 0) {
      //   this.loadDataGrid()
      // }
    } catch (error) {
      getError(error);
    }
  }

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get selectedRows() {
    if (!this.gridApi) return [];
    return this.gridApi.getSelectedRows();
  }

  get hasSelectedRows() {
    return this.selectedRows.length > 0;
  }
}
