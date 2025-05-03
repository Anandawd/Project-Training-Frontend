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
  },
})
export default class Employee extends Vue {
  public form: any = reactive({});
  public modeData: any;
  // Period data
  public periodData: any = {
    id: 1,
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

  // Employee payroll data
  public rowData: any = [
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
  public departments: any = [
    { id: "D01", name: "IT" },
    { id: "D02", name: "Marketing" },
    { id: "D03", name: "Finance" },
    { id: "D04", name: "Human Resources" },
  ];
  public positions: any = [
    { id: "P01", name: "Manager" },
    { id: "P02", name: "Developer" },
    { id: "P03", name: "Accountant" },
    { id: "P04", name: "HR Officer" },
  ];

  // Dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Modal
  public showGenerateModal: boolean = false;

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

  // GENERAL FUNCTION
  async handleEdit(params: any) {
    // this.showDialog = true;
    this.modeData = $global.modeData.edit;
    this.handleShowEmployeePayrollDetails(params);
    // await this.loadEditData(params.id);
    // this.modeData = $global.modeData.edit;
    // await this.loadEditData(params.id);
  }

  handleDelete(params: any) {
    this.dialogMessage =
      "Are you sure you want to remove this employee from the payroll?";
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleSubmit(params: any) {
    this.periodData.status = "Pending";
    getToastSuccess("Payroll has been submitted for approval");
    this.showDialog = false;
  }

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
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowEmployeePayrollDetails(this.paramsData),
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

  handleShowDetail(params: any, mode: any) {}

  async insertData(formData: any) {
    try {
      // API call to insert data
      // const {status2} = await payrollAPI.InsertPayrollPeriod(formData)
      // if(status2.status == 0){
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
      // API call to get period data for editing
      // const {data} = await payrollAPI.GetPayrollPeriod(params)
      // this.inputFormElement.form = data
      // this.showForm = true
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      // API call to update data
      // const { status2 } = await payrollAPI.UpdatePayrollPeriod(formData);
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
      this.isGenerating = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const { status2 } = await payrollAPI.GeneratePayroll({
      //   periodId: this.periodData.id,
      //   selectionMode: this.generateOptions.selectionMode,
      //   departmentId: this.generateOptions.departmentId,
      //   positionId: this.generateOptions.positionId,
      //   selectedEmployeeIds: this.generateOptions.selectedEmployeeIds
      // });

      // if (status2.status == 0) {
      //   await this.loadEmployeePayrolls();
      //   getToastSuccess(this.$t("messages.generateSuccess"));
      // }

      this.showGenerateModal = false;
      getToastSuccess("Payroll has been generated successfully");
    } catch (error) {
      getError(error);
    } finally {
      this.isGenerating = false;
    }
  }

  async loadEmployees(search: any = this.searchDefault) {
    try {
      // API call to load employees
      // const { data } = await payrollAPI.GetEmployees(search);
      // this.employees = data;
    } catch (error) {
      getError(error);
    }
  }

  // API
  loadPeriodData(periodId: any) {
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
        // const { data } = await payrollAPI.GetPayrollPeriodDetail(periodId);
        // this.periodData = data;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEmployeePayrolls() {
    try {
      // API call to load employee payrolls
      // const { data } = await payrollAPI.GetEmployeePayrolls(this.periodData.id);
      // this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadDepartments() {
    try {
      // API call to load departments
      // const { data } = await payrollAPI.GetDepartments();
      // this.departments = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadPosition() {
    try {
      // API call to load positions
      // const { data } = await payrollAPI.GetPositions();
      // this.positions = data;
    } catch (error) {
      getError(error);
    }
  }

  // Payroll Actions
  handleShowEmployeePayrollDetails(employee: any) {
    console.log("button clicked", employee);
    this.$router.push({
      name: "EmployeePayrollDetail",
      params: {
        periodId: this.periodData.id,
        employeeId: employee.id,
      },
    });
  }

  async removeEmployeePayroll(employee: any) {
    try {
      // API call to remove employee from payroll
      // const { status2 } = await payrollAPI.RemoveEmployeePayroll(this.periodData.id, employee.id);

      // if (status2.status == 0) {
      //   await this.loadEmployeePayrolls();
      //   getToastSuccess(this.$t("messages.deleteSuccess"));
      // }

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== employee.id
      );
      getToastSuccess("Employee removed from payroll successfully");
      this.showDialog = false;
    } catch (error) {
      getError(error);
    }
  }

  // FORM ACTIONS
  handleSubmitForApproval() {
    this.dialogMessage =
      "Are you sure you want to submit this payroll for approval?";
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  handleSave() {
    getToastSuccess("Payroll saved successfully");
  }

  // handleShowForm() {
  //   this.showGenerateModal = true;
  // }
  handleShowModal() {
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
      this.isGenerating = true;

      await this.generatePayroll();

      this.showGenerateModal = false;
    } catch (error) {
      getError(error);
    } finally {
      this.isGenerating = false;
    }
  }

  confirmAction() {
    if (this.dialogAction === "submit") {
      this.handleSubmit(null);
    } else if (this.dialogAction === "delete") {
      this.removeEmployeePayroll(this.paramsData);
    }
    this.showDialog = false;
  }

  goBack() {
    if (this.form.status === "Draft") {
      this.dialogMessage =
        "You have unsaved changes. Do you want to save before going back?";
      this.dialogAction = "saveAndGoBack";
      this.showDialog = true;
    } else {
      this.$router.push({
        name: "PayrollPeriods",
      });
    }
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
    // params.api.sizeColumnsToFit();
  }

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get isRunPayrollDisabled(): boolean {
    return !this.rowData.some((item: any) => item.status === "Draft");
  }

  // COMPUTED PROPERTIES
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
    return this.rowData.length > 0;
  }
}
