import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import SalaryAdjustmentAPI from "@/services/api/payroll/salary-adjustment/salary-adjustment";
import {
  formatDate,
  formatDateTime2,
  formatDateTimeUTC,
  formatNumber2,
} from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./salary-adjustment-input-form/salary-adjustment-input-form.vue";

const employeeAPI = new EmployeeAPI();
const salaryAdjustmentAPI = new SalaryAdjustmentAPI();

@Options({
  components: {
    AgGridVue,
    SearchFilter,
    CInputForm,
    CDialog,
    CModal,
  },
})
export default class SalaryAdjustment extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;
  public approveParam: any;

  // options data
  public employeeOptions: any = [];
  public adjustmentReasonOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [2],
  };

  // Ag grid variable
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

  // RECYCLE LIFE FUNCTION =======================================================
  created(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.name"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 2 },
      {
        text: this.$t("commons.filter.payroll.employee.adjustmentReason"),
        value: 3,
      },
      { text: this.$t("commons.filter.createdBy"), value: 4 },
      { text: this.$t("commons.filter.updatedBy"), value: 5 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
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
        headerName: this.$t("commons.table.payroll.employee.id"),
        field: "employee_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employee"),
        field: "employee_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "PositionName",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "DepartmentName",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "PlacementName",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.effectiveDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "effective_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.currentSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "base_salary",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.newSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "new_salary",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.difference"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "difference_amount",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.percentage"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "percentage_change",
        width: 100,
        enableRowGroup: true,
        valueFormatter: (params: any) => {
          return params.value ? `${params.value.toFixed(2)}%` : "0%";
        },
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 120,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "";
          let statusText = "";

          switch (status) {
            case "PENDING":
              badgeClass = "bg-warning";
              statusText = "Pending";
              break;
            case "APPROVED":
              badgeClass = "bg-success";
              statusText = "Approved";
              break;
            case "REJECTED":
              badgeClass = "bg-danger";
              statusText = "Rejected";
              break;
            case "APPLIED":
              badgeClass = "bg-primary";
              statusText = "Applied";
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
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData || this.paramsData.status !== "PENDING",
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData || this.paramsData.status !== "PENDING",
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.approve"),
        disabled: !this.paramsData || this.paramsData.status !== "PENDING",
        icon: generateIconContextMenuAgGrid("approve_icon24"),
        action: () => this.handleApprove(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.reject"),
        disabled: !this.paramsData || this.paramsData.status !== "PENDING",
        icon: generateIconContextMenuAgGrid("reject_icon24"),
        action: () => this.handleReject(this.paramsData),
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

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else {
        this.loadEditData(params);
      }
    });
    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.employee.delete.deleteSalaryAdjustment"
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleApprove(params: any) {
    if (!params || params.status !== "PENDING") {
      getToastError(this.$t("messages.employee.error.cannotApproveNonPending"));
      return;
    }

    this.approveParam = params;
    this.dialogMessage = this.$t(
      "messages.employee.confirm.approveSalaryAdjustment"
    );
    this.dialogAction = "approve";
    this.showDialog = true;
  }

  handleReject(params: any) {
    if (!params || params.status !== "PENDING") {
      getToastError(this.$t("messages.employee.error.cannotRejectNonPending"));
      return;
    }

    this.approveParam = params;
    this.dialogMessage = this.$t(
      "messages.employee.confirm.rejectSalaryAdjustment"
    );
    this.dialogAction = "reject";
    this.showDialog = true;
  }

  handleToAdjustmentReason() {
    this.$router.push({
      name: "AdjustmentReason",
    });
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    } else if (this.dialogAction === "approve") {
      this.approveData();
    } else if (this.dialogAction === "reject") {
      this.rejectData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustmentList(
        params
      );
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustment(params.id);
      this.$nextTick(() => {
        this.inputFormElement.form = this.populateForm(data[0]);
      });
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.rowData = [
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_name: "Operations",
        position_name: "Junior Manager",
        adjustment_reason_code: "PROMOTION",
        adjustment_reason_name: "Promotion",
        effective_date: "2025-02-01",
        current_salary: 9000000,
        new_salary: 11000000,
        difference_amount: 2000000,
        percentage_change: 22.22,
        status: "PENDING",
        remark: "Promotion to Senior Operations Manager",
        created_at: "2025-01-15",
        created_by: "HR Manager",
        updated_at: "2025-01-15",
        updated_by: "HR Manager",
      },
      {
        id: 2,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_name: "Human Resources",
        position_name: "Staff",
        adjustment_reason_code: "ANNUAL_REVIEW",
        adjustment_reason_name: "Annual Review",
        effective_date: "2025-01-01",
        current_salary: 13500000,
        new_salary: 14500000,
        difference_amount: 1000000,
        percentage_change: 7.41,
        status: "APPROVED",
        remark: "Annual salary review - performance based increase",
        created_at: "2024-12-20",
        created_by: "Operations Director",
        updated_at: "2025-01-02",
        updated_by: "CEO",
      },
      {
        id: 3,
        employee_id: "EMP004",
        employee_name: "Emily Davis",
        department_name: "Information Technology",
        position_name: "Staff",
        adjustment_reason_code: "MARKET_ADJUSTMENT",
        adjustment_reason_name: "Market Adjustment",
        effective_date: "2025-03-01",
        current_salary: 7500000,
        new_salary: 8500000,
        difference_amount: 1000000,
        percentage_change: 13.33,
        status: "PENDING",
        remark: "Market adjustment for IT specialists",
        created_at: "2025-01-10",
        created_by: "IT Director",
        updated_at: "2025-01-10",
        updated_by: "IT Director",
      },
      {
        id: 4,
        employee_id: "EMP007",
        employee_name: "James Carter",
        department_name: "Security",
        position_name: "Staff",
        adjustment_reason_code: "PERFORMANCE",
        adjustment_reason_name: "Performance",
        effective_date: "2024-12-01",
        current_salary: 6000000,
        new_salary: 6300000,
        difference_amount: 300000,
        percentage_change: 5.0,
        status: "APPLIED",
        remark: "Performance-based salary increase",
        created_at: "2024-11-15",
        created_by: "Security Manager",
        updated_at: "2024-12-01",
        updated_by: "HR Manager",
      },
      {
        id: 5,
        employee_id: "EMP008",
        employee_name: "Jessica Walker",
        department_name: "Housekeeping",
        position_name: "Staff",
        adjustment_reason_code: "COST_OF_LIVING",
        adjustment_reason_name: "Cost of Living",
        effective_date: "2025-01-15",
        current_salary: 9000000,
        new_salary: 8500000,
        difference_amount: -500000,
        percentage_change: -5.56,
        status: "REJECTED",
        remark:
          "Cost of living adjustment request denied due to budget constraints",
        created_at: "2024-12-05",
        created_by: "Housekeeping Manager",
        updated_at: "2025-01-05",
        updated_by: "Finance Director",
      },
    ];
  }

  async loadDropdown() {
    try {
      const promises = [
        employeeAPI.GetEmployeeList({}).then((response) => {
          this.employeeOptions = response.data;
        }),
        salaryAdjustmentAPI.GetAdjustmentReasonList({}).then((response) => {
          this.adjustmentReasonOptions = response.data;
        }),
      ];
      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      console.log("insertData", formData);
      const { status2 } = await salaryAdjustmentAPI.InsertSalaryAdjustment(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.saveSalaryAdjustment")
        );
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await salaryAdjustmentAPI.UpdateSalaryAdjustment(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.updateSalaryAdjustment")
        );
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await salaryAdjustmentAPI.DeleteSalaryAdjustment(
        this.deleteParam
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.deleteSalaryAdjustment")
        );
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    }
  }

  async approveData() {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.ApproveSalaryAdjustment({ id: this.deleteParam });
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.salaryAdjustment.success.approve"));
      }
      */

      const index = this.rowData.findIndex(
        (item: any) => item.id === this.approveParam.id
      );
      if (index !== -1) {
        this.rowData[index].status = "APPROVED";
        this.rowData[index].updated_at = formatDateTimeUTC(new Date());
        this.rowData[index].updated_by = "Current User";
      }

      this.searchDefault.filter = [1];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(
        this.$t("messages.employee.success.approveSalaryAdjustment")
      );
      this.showDialog = false;
    } catch (error) {
      getError(error);
    }
  }

  async rejectData() {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.RejectSalaryAdjustment({ id: this.deleteParam });
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.salaryAdjustment.success.reject"));
      }
      */

      const index = this.rowData.findIndex(
        (item: any) => item.id === this.approveParam.id
      );
      if (index !== -1) {
        this.rowData[index].status = "REJECTED";
        this.rowData[index].updated_at = formatDateTimeUTC(new Date());
        this.rowData[index].updated_by = "Current User";
      }
      this.searchDefault.filter = [1];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(
        this.$t("messages.employee.success.rejectSalaryAdjustment")
      );
      this.showDialog = false;
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      // employee information
      employee_id: params.employee_id,

      // adjustment information
      adjustment_reason_code: params.adjustment_reason_code,
      effective_date: formatDateTimeUTC(params.effective_date),
      end_date: formatDateTimeUTC(params.end_date),
      base_salary: parseFloat(params.base_salary),
      new_salary: parseFloat(params.new_salary),
      status: params.status,
      is_current: parseInt(params.is_current),
      difference_amount: parseFloat(params.difference_amount),
      percentage_change: parseFloat(params.percentage_change),
      remark: params.remark,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      // employee information
      employee_id: params.employee_id,

      // adjustment information
      adjustment_reason_code: params.adjustment_reason_code,
      effective_date: params.effective_date,
      base_salary: parseFloat(params.base_salary),
      new_salary: parseFloat(params.new_salary),
      status: params.status,
      is_current: parseInt(params.is_current),
      difference_amount: parseFloat(params.difference_amount),
      percentage_change: parseFloat(params.percentage_change),
      remark: params.remark,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
