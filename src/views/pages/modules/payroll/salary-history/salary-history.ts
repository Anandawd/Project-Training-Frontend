import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { formatNumber2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
} from "@/utils/general";
import $global from "@/utils/global";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    AgGridVue,
    SearchFilter,
  },
})
export default class Employee extends Vue {
  public rowData: any = [
    {
      employee_id: "EMP001",
      employee_name: "Ahmad Saputra",
      department: "Finance",
      position: "Staff Keuangan",
      base_salary: 5000000, // baseSalary
      earnings: 1000000, // earnings
      deductions: 250000, // deductions
      take_home_pay: 5750000,
      period_date: "01/04/2025",
    },
    {
      employee_id: "EMP002",
      employee_name: "Siti Marlina",
      department: "HRD",
      position: "Recruiter",
      base_salary: 6000000,
      earnings: 1500000,
      deductions: 300000,
      take_home_pay: 7200000,
      period_date: "01/04/2025",
    },
    {
      employee_id: "EMP003",
      employee_name: "Rizky Maulana",
      department: "IT",
      position: "Frontend Developer",
      base_salary: 7000000,
      earnings: 2000000,
      deductions: 400000,
      take_home_pay: 8600000,
      period_date: "01/04/2025",
    },
  ];
  public showForm: boolean = false;
  public modeData: any;
  public searchOptions: any;
  public inputFormElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [1],
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

  handleShowForm(params: any, mode: any) {
    // this.loadDropdown();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
  }

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
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.handleShowForm(this.paramsData, 2),
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

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.department"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 1 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        print: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        HeaderClass: "align-header-center",
        cellClass: "action-grid-buttons",
        field: "id",
        enableRowGroup: false,
        resizeable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeId"),
        headerClass: "align-header-center",
        field: "employee_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeName"),
        headerClass: "align-header-center",
        field: "employee_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        headerClass: "align-header-center",
        field: "department",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        headerClass: "align-header-center",
        field: "position",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.baseSalary"),
        headerClass: "align-header-center",
        field: "base_salary",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.earnings"),
        headerClass: "align-header-center",
        field: "earnings",
        width: 200,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.deductions"),
        headerClass: "align-header-center",
        field: "deductions",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.takeHomePay"),
        headerClass: "align-header-center",
        field: "take_home_pay",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.periodDate"),
        headerClass: "align-header-center",
        field: "period_date",
        width: 100,
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

    params.api.sizeColumnsToFit();
  }

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
