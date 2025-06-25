import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatDate, formatDateTime2, formatNumber2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
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
  props: {
    employeeId: {
      type: String,
      require: true,
    },
    rowData: {
      type: Array,
      default: (): any[] => [],
    },
    adjustmentReasonOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["insert", "edit", "delete"],
})
export default class SalaryTableComponent extends Vue {
  public employeeId!: string;
  public rowData!: any[];
  public adjustmentReasonOptions!: any[];

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
  detailCellRenderer: any;

  // RECYCLE LIFE FUNCTION ===================================================
  beforeMount(): void {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
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
    this.detailCellRenderer = "detailCellRenderer";
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

  // GENERAL FUNCTION ========================================================
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
        action: () => this.handleInsert(),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData || !this.paramsData.is_current,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
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

  handleInsert() {
    this.$emit("insert", { type: "SALARY" });
  }

  handleEdit(params: any) {
    this.$emit("edit", { type: "SALARY", event: "EDIT", params });
  }

  handleDelete(params: any) {
    this.$emit("delete", { type: "SALARY", event: "DELETEs", params });
  }

  refreshGrid() {
    if (this.gridApi) {
      this.gridApi.setRowData([...this.rowData]);
    }
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
