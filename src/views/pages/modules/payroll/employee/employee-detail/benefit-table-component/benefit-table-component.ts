import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDate, formatDateTime, formatNumber2 } from "@/utils/format";
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
    componentTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    earningsComponentOptions: {
      type: Array,
      default: (): any[] => [],
    },
    deductionsComponentOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["insert", "edit", "delete"],
})
export default class BenefitTableComponent extends Vue {
  public modeData!: any;
  public employeeId!: string;
  public rowData!: any[];
  public componentTypeOptions!: any[];
  public earningsComponentOptions!: any[];
  public deductionsComponentOptions!: any[];

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
        headerName: this.$t("commons.table.payroll.payroll.type"),
        field: "component_type",
        width: 120,
        enableRowGroup: true,
        // valueGetter: (params: any) => {
        //   if (params.data?.payroll_component) {
        //     return params.data.payroll_component.startsWith("CE")
        //       ? "Earnings"
        //       : "Deductions";
        //   }
        //   return "";
        // },
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.code"),
        field: "payroll_component_code",
        width: 100,
        enableRowGroup: true,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "payroll_component_name",
        width: 200,
        enableRowGroup: true,
        // valueGetter: (params: any) => {
        //   if (params.data?.payroll_component_name) {
        //     return params.data.payroll_component_name;
        //   }
        //   if (params.data?.payroll_component) {
        //     const parentComponent = params.context?.componentParent;
        //     if (parentComponent && parentComponent.getComponentDisplayName) {
        //       return parentComponent.getComponentDisplayName(
        //         params.data.payroll_component
        //       );
        //     }
        //     return params.data?.payroll_component || "";
        //   }
        // },
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.category"),
        field: "category",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.amount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "amount",
        width: 150,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.qty"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "qty",
        width: 100,
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
        headerName: this.$t("commons.table.payroll.employee.endDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "end_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_current",
        width: 100,
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
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: false,
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
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleInsert(),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled:
          !this.paramsData ||
          (!this.paramsData.is_current && this.paramsData.base_salary),
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled:
          !this.paramsData ||
          (!this.paramsData.is_current && this.paramsData.base_salary),
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
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
    this.$emit("insert", { type: "BENEFIT" });
  }

  handleEdit(params: any) {
    this.$emit("edit", { type: "BENEFIT", event: "EDIT", params });
  }

  handleDelete(params: any) {
    this.$emit("delete", { type: "BENEFIT", event: "DELETE", params });
  }

  refreshGrid() {
    if (this.gridApi) {
      this.gridApi.setRowData([...this.rowData]);
    }
  }

  getComponentDisplayName(componentCode: string): string {
    // Akses parent component untuk mendapatkan data komponen
    const parentComponent = this.$parent as any;
    if (parentComponent && parentComponent.getComponentDisplayName) {
      return parentComponent.getComponentDisplayName(componentCode);
    }
    return componentCode;
  }
  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
