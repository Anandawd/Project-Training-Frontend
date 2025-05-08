import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
  },
})
export default class PayrollApprovals extends Vue {
  //table
  public rowData: any = [];
  public selectedRowData: any = null;

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // form
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public formType: any;

  // dialog
  public showDialog: boolean = false;
  public deleteParam: any;

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

  // LIFECYCLE HOOKs
  created(): void {
    this.loadMockData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.all"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 1 },
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
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 140,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "text-bg-secondary";
          if (status === "Pending") {
            badgeClass = "text-bg-warning";
          } else if (status === "Approved") {
            badgeClass = "text-bg-success";
          } else if (status === "Ready To Payment") {
            badgeClass = "text-bg-info";
          } else if (status === "Completed") {
            badgeClass = "text-bg-success";
          } else if (status === "Rejected") {
            badgeClass = "text-bg-danger";
          }
          return `<span class="badge text-bg-secondary px-3 py-1 ${badgeClass}">${status}</span>`;
        },
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

  // GENERAL FUNCTION
  handleSave(formData: any) {
    if (this.modeData === $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData === $global.modePayroll.process) {
      this.handleShowDetail(formData, $global.modePayroll.process);
    } else {
      this.updateData(formData);
    }
  }

  async handleEdit(params: any) {
    this.showForm = true;
    this.modeData = $global.modeData.edit;
    await this.loadEditData(params.id);
  }

  handleMenu() {}

  handleApprove(params: any, mode: any) {}

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  async loadMockData() {
    this.rowData = [
      {
        id: 4,
        period_name: "April 2025",
        period_date: "01/04/2025 - 30/04/2025",
        payment_date: "01/05/2025",
        remark: "-",
        status: "Completed",
      },
      {
        id: 1,
        period_name: "May 2025",
        period_date: "01/05/2025 - 31/05/2025",
        payment_date: "01/06/2025",
        remark: "-",
        status: "Ready To Payment",
      },
      {
        id: 2,
        period_name: "June 2025",
        period_date: "01/06/2025 - 30/06/2025",
        payment_date: "01/07/2025",
        remark: "-",
        status: "Ready To Payment",
      },
      {
        id: 3,
        period_name: "July 2025",
        period_date: "01/07/2025 - 30/07/2025",
        payment_date: "01/08/2025",
        remark: "-",
        status: "Ready To Payment",
      },
    ];
  }

  // UI FUNCTION
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
        action: () => this.handleShowDetail("", $global.modePayroll.detail),
      },
      {
        name: this.$t("commons.contextMenu.process"),
        disabled:
          !this.paramsData ||
          this.paramsData.status === "Completed" ||
          this.paramsData.status === "Processing",
        icon: generateIconContextMenuAgGrid("process_icon24"),
        action: () => this.handleShowDetail("", $global.modePayroll.process),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const rightClickedData = { ...this.paramsData };
      this.selectedRowData = rightClickedData;
      this.gridApi.forEachNode((node: any) => {
        if (node.data && node.data.id === rightClickedData.id) {
          node.setSelected(true);
          this.gridApi.ensureNodeVisible(node);
        } else if (node.selected) {
          node.setSelected(false);
        }
      });
    }
  }

  handleShowForm(params: any, mode: any) {
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleShowDetail(params: any, mode: any) {
    const rowData = params || this.selectedRowData;

    if (!rowData) {
      return;
    }

    if (mode === $global.modePayroll.process) {
      this.$router.push({
        name: "DisbursementProcess",
        params: { id: params.id },
      });
    } else {
      this.$router.push({
        name: "DisbursementProcess",
        params: { id: params.id },
      });
    }
  }

  // API FUNCTION
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      // const {data} = await payrollAPI.getPayrollPeriod(params)
      // this.rowData = data
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      // const {status2} = await payrollAPI.InsertPayrollPeriod(formData)
      // if(status2.status ==0){
      //   getToastSuccess(this.$t('messages.saveSuccess'))
      //   this.showForm = false
      //   this.loadDataGrid()
      // }
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      // const {data} = await payrollAPI.GetPayrollPeriod(params)
      // this.inputFormElement.form = data
      // this.showForm = true
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      // const { status2 } = await trainingAPI.UpdateLostAndFound(formData);
      // if (status2.status == 0) {
      //   this.loadDataGrid("");
      //   this.showForm = false;
      //   getToastSuccess(this.$t("messages.saveSuccess"));
      // }
    } catch (error) {
      getError(error);
    }
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectedRowData = selectedRows.length > 0 ? selectedRows[0] : null;
  }

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get isRunPayrollDisabled(): boolean {
    return !this.rowData.some((item: any) => item.status === "Draft");
  }

  get isProcessButtonDisabled(): boolean {
    if (!this.selectedRowData) {
      return true;
    }

    return this.selectedRowData.status !== "Ready To Payment";
  }
}
