import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
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
  public isSaving: boolean = false;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [4],
  };

  // stats
  public statusCounts: any = ref({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    is_current: 0,
  });

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
  mounted(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.name"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 3 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 4 },
      {
        text: this.$t("commons.filter.remark"),
        value: 5,
      },
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
        headerName: this.$t("commons.table.payroll.employee.adjustmentReason"),
        field: "AdjustmentReasonName",
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
        headerName: this.$t("commons.table.payroll.employee.baseSalary"),
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
          const value = parseFloat(params.value);

          return !isNaN(value) ? `${value.toFixed(2)}%` : "0%";
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
            case "CANCELLED":
              badgeClass = "bg-danger";
              statusText = "Cancelled";
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
        headerName: this.$t("commons.table.payroll.employee.applied"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_current",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
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
      checklistRenderer: Checklist,
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
    console.log("handleShowForm", { params, mode });

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
    if (!formData || formData.status !== "PENDING") {
      getToastError(this.$t("messages.employee.error.cannotApproveNonPending"));
      return;
    }
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    // if (!params || params.status !== "PENDING") {
    //   getToastError(this.$t("messages.employee.error.cannotApproveNonPending"));
    //   return;
    // }

    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.employee.confirm.deleteSalaryAdjustment"
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
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
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

      const { data: statusData } =
        await salaryAdjustmentAPI.GetAdjustmentSalaryCount({});
      this.statusCounts = statusData;
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

  async loadDropdown() {
    try {
      const promises = [
        salaryAdjustmentAPI
          .GetEmployeeSalaryAdjustmentOptions({})
          .then((response) => {
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
      this.isSaving = true;
      console.log("insertData", formData);
      const { status2 } = await salaryAdjustmentAPI.InsertSalaryAdjustment(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.saveSalaryAdjustment")
        );
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      this.isSaving = true;
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
    } finally {
      this.isSaving = false;
    }
  }

  async deleteData() {
    try {
      this.isSaving = true;
      const { status2 } = await salaryAdjustmentAPI.DeleteSalaryAdjustment(
        this.deleteParam
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.deleteSalaryAdjustment")
        );
        this.showDialog = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async approveData() {
    try {
      this.isSaving = true;
      const { status2 } =
        await salaryAdjustmentAPI.UpdateStatusSalaryAdjustment(
          this.approveParam.id,
          "APPROVED"
        );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.approveSalaryAdjustment")
        );
        this.showDialog = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async rejectData() {
    try {
      this.isSaving = true;
      const { status2 } =
        await salaryAdjustmentAPI.UpdateStatusSalaryAdjustment(
          this.approveParam.id,
          "REJECTED"
        );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.employee.success.rejectSalaryAdjustment")
        );
        this.showDialog = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
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
      employee_name: params.employee_name,
      Position: params.PositionName,
      Department: params.DepartmentName,
      Placement: params.PlacementName,

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
