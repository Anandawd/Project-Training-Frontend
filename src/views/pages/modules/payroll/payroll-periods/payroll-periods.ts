import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import { formatDateTime2, formatDateTimeUTC } from "@/utils/format";
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
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./components/payroll-period-input-form/payroll-period-input-form.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();
const organizationAPI = new OrganizationAPI();
const employeeAPI = new EmployeeAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class PayrollPeriods extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;
  public approveParam: any;

  // options data
  public placementOptions: any = [];
  public periodTypeOptions: any = [];

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

  // RECYCLE LIFE FUNCTION =======================================================
  mounted(): void {
    this.loadDataGrid();
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
        edit: true,
        delete: true,
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
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime2,
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
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleToPeriodDetail(this.paramsData),
      },
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

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);
    this.isSaving = true;
    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleEdit(formData: any) {
    console.log("handleEdit", formData);
    // if (
    //   !formData ||
    //   formData.status !== "DRAFT" ||
    //   formData.status !== "Draft"
    // ) {
    //   getToastError(this.$t("messages.payroll.error.cannotEditNonDraft"));
    //   return;
    // }
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    // if (!params || params.status !== "PENDING") {
    //   getToastError(this.$t("messages.payroll.error.cannotApproveNonPending"));
    //   return;
    // }

    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.payroll.confirm.deletePayrollPeriods"
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleApprove(params: any) {
    if (!params || params.status !== "PENDING") {
      getToastError(this.$t("messages.payroll.error.cannotApproveNonPending"));
      return;
    }
    this.approveParam = params;
    this.dialogMessage = this.$t(
      "messages.payroll.confirm.approvePayrollPeriods"
    );
    this.dialogAction = "approve";
    this.showDialog = true;
  }

  handleReject(params: any) {
    this.approveParam = params;
    this.dialogMessage = this.$t(
      "messages.payroll.confirm.rejectPayrollPeriods"
    );
    this.dialogAction = "reject";
    this.showDialog = true;
  }

  handleToPeriodDetail(params: any) {
    // if (!params.period_code) {
    //   getToastSuccess(this.$t("messages.payroll.error.notFoundPeriod"));
    //   return;
    // }
    console.log("handleToPeriodDetail", params.period_code);
    this.$router.push({
      name: "PeriodDetail",
      params: { code: params.period_code },
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

  handleMenu() {}

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
      const { data } = await payrollPeriodsAPI.GetPayrollPeriodsList(params);
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }

      const { data: statusData } =
        await payrollPeriodsAPI.GetPayrollPeriodsStatusStatistic();
      this.statusCounts = statusData;

      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      const { data } = await payrollPeriodsAPI.GetPayrollPeriods(params.id);
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
        organizationAPI.GetPlacementActiveList({}).then((response) => {
          this.placementOptions = response.data;
        }),

        employeeAPI.GetPaymentFrequencyOptions().then((response) => {
          this.periodTypeOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await payrollPeriodsAPI.InsertPayrollPeriods(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.payroll.success.savePayrollPeriods"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await payrollPeriodsAPI.UpdatePayrollPeriods(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.payroll.success.updatePayrollPeriods")
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
      const { status2 } = await payrollPeriodsAPI.DeletePayrollPeriods(
        this.deleteParam
      );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.payroll.success.deletePayrollPeriods")
        );
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.showDialog = false;
    }
  }

  async approveData() {
    try {
      // const { status2 } = await payrollPeriodsAPI.UpdateStatusPayrollPeriods(
      //   this.approveParam.id,
      //   "APPROVED"
      // );
      // if (status2.status == 0) {
      //   getToastSuccess(
      //     this.$t("messages.payroll.success.approvePayrollPeriods")
      //   );
      //   this.loadDataGrid(this.searchDefault);
      //   this.showDialog = false;
      // }
    } catch (error) {
      getError(error);
    } finally {
      this.showDialog = false;
    }
  }

  async rejectData() {
    try {
      // const { status2 } = await PayrollPeriodsAPI.UpdateStatusPayrollPeriods(
      //   this.approveParam.id,
      //   "REJECTED"
      // );
      // if (status2.status == 0) {
      //   getToastSuccess(
      //     this.$t("messages.payroll.success.rejectPayrollPeriods")
      //   );
      //   this.loadDataGrid(this.searchDefault);
      //   this.showDialog = false;
      // }
    } catch (error) {
      getError(error);
    } finally {
      this.showDialog = false;
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id ? params.id : null,
      period_code: params.period_code,
      period_name: params.period_name,
      period_type: params.period_type,
      placement_code: params.placement_code,

      default_tax_income_type: params.default_tax_income_type,
      default_tax_method: params.default_tax_method,
      start_date: formatDateTimeUTC(params.start_date),
      end_date: formatDateTimeUTC(params.end_date),
      payment_date: formatDateTimeUTC(params.payment_date),
      status: params.status,
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
      period_code: params.period_code,
      period_name: params.period_name,
      period_type: params.period_type,
      placement_code: params.placement_code,

      default_tax_income_type: params.default_tax_income_type,
      default_tax_method: params.default_tax_method,
      start_date: params.start_date,
      end_date: params.end_date,
      payment_date: params.payment_date,
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
