import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
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
  },
})
export default class Employee extends Vue {
  public form: any = reactive({});
  // Period data
  public periodData: any = {
    id: null,
    period_name: "",
    period_date: "",
    payment_date: "",
    remark: "",
    status: "Draft",
  };
  // Employee payroll data
  public rowData: any = [];

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

  // lookup data
  public departments: any = [];
  public positions: any = [];

  // Dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Modal
  public showInsertModal: boolean = true;

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

  // COMPUTED PROPERTIES
  get totalEmployees(): number {
    return this.rowData.length;
  }

  get totalGrossSalary(): number {
    return 0;
  }

  get totalDeductions(): number {
    return 0;
  }

  get totalNetSalary(): number {
    return 0;
  }

  get canSubmit(): boolean {
    return this.rowData.length > 0;
  }

  handleSubmit(params: any) {}

  refreshData(search: any) {
    // this.loadDataGrid(search);
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
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        // action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        // action: () => this.handleShowForm(this.paramsData, 1),
      },
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        // action: () => this.handleShowDetail("", 0),
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
        return "badge-secondary";
      case "Pending":
        return "badge-warning";
      case "Approve":
        return "badge-success";
      case "Ready to Payment":
        return "badge-info";
      case "Completed":
        return "badge-primary";
      case "Rejected":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  }

  handleShowDetail(params: any, mode: any) {}

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

  async generatePayroll() {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async loadEmployees(search: any = this.searchDefault) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  // API
  loadPeriodData(periodId: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async loadEmployeePayrolls() {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async loadDepartments() {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async loadPosition() {
    try {
    } catch (error) {
      getError(error);
    }
  }

  // Payroll Actions
  handleShowEmployeePayrollDetails(employee: any) {
    this.$router.push({
      name: "EmployeePayrollDetail",
      params: {
        periodId: this.periodData.id,
        employeeId: employee.id,
      },
    });
  }

  async removeEmployeePayroll(employee: any) {}

  // FORM ACTIONS
  handleSubmitForApproval() {
    // this.dialog;
  }

  handleSave() {}

  handleShowForm() {
    this.showInsertModal = true;
  }

  handleSaveForm() {
    this.showInsertModal = false;
  }

  // METHODS
  async created() {
    this.initializeData();

    const periodId = this.$route.params.id;
    if (periodId) {
      await this.loadPeriodData(periodId);
    }

    await this.loadDepartments();
    await this.loadPosition();

    if (this.periodData.status !== "Draft") {
      await this.loadEmployeePayrolls();
    }
  }

  initializeData() {}

  beforeMount(): void {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        edit: true,
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
        headerName: this.$t("commons.table.payroll.employee.employeeId"),
        headerClass: "align-header-center",
        field: "employe_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        headerClass: "align-header-center",
        field: "employee_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        headerClass: "align-header-center",
        field: "department_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        headerClass: "align-header-center",
        field: "position_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.baseSalary"),
        headerClass: "align-header-center",
        field: "base_salary",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.grossSalary"),
        headerClass: "align-header-center",
        field: "gross_salary",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.totalDeductions"),
        headerClass: "align-header-center",
        field: "total_deductions",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.pph21"),
        headerClass: "align-header-center",
        field: "tax",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.takeHomePay"),
        headerClass: "align-header-center",
        field: "net_salary",
        width: 100,
        enableRowGroup: true,
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
    params.api.sizeColumnsToFit();
  }

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get isRunPayrollDisabled(): boolean {
    return !this.rowData.some((item: any) => item.status === "Draft");
  }
}
