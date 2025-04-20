import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatNumber, formatNumber2 } from "@/utils/format";
import { generateIconContextMenuAgGrid } from "@/utils/general";
import $global from "@/utils/global";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./payroll-component-input-form/payroll-component-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class Employee extends Vue {
  //table
  public rowEarningsData: any = [
    {
      code: "CE001",
      name: "Tunjangan Transportasi",
      description: "-",
      category: "Variable Allowance",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: true,
      included_bpjs_employee: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "CE002",
      name: "Tunjangan Rumah",
      description: "-",
      category: "Fix Allowance",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: true,
      included_bpjs_employee: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "CE003",
      name: "Tunjangan Makan",
      description: "-",
      category: "Variable Allowance",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: true,
      included_bpjs_employee: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "CE004",
      name: "Tunjangan Makan",
      description: "-",
      category: "Fix Allowance",
      default_amount: 30000,
      quantity: 1,
      unit: "Day",
      taxable: true,
      included_bpjs_health: true,
      included_bpjs_employee: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "CE005",
      name: "Bonus",
      description: "-",
      category: "Incentive",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: false,
      included_bpjs_employee: false,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "CE006",
      name: "Uang Lembur",
      description: "-",
      category: "Incentive",
      default_amount: 50000,
      quantity: 1,
      unit: "Hour",
      taxable: true,
      included_bpjs_health: false,
      included_bpjs_employee: false,
      show_in_payslip: true,
      active: true,
    },
  ];
  public rowDeductionsData: any = [
    {
      code: "DE001",
      name: "Biaya Jabatan",
      description: "Khusus Manager",
      category: "Fix Deduction",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: true,
      included_bpjs_employee: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "DE002",
      name: "Unpaid Leave",
      description: "-",
      category: "Variable Deduction",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: true,
      included_bpjs_employee: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "DE003",
      name: "Cicilan Kasbon",
      description: "-",
      category: "Kasbon",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: false,
      included_bpjs_health: false,
      included_bpjs_employee: false,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "DE004",
      name: "Late Arrival",
      description: "-",
      category: "Variable Allowance",
      default_amount: 30000,
      quantity: 1,
      unit: "Hour",
      taxable: false,
      included_bpjs_health: false,
      included_bpjs_employee: false,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "dE005",
      name: "Iuran Keagamaan",
      description: "-",
      category: "Fix Deduction",
      default_amount: 200000,
      quantity: 1,
      unit: "",
      taxable: true,
      included_bpjs_health: false,
      included_bpjs_employee: false,
      show_in_payslip: true,
      active: true,
    },
  ];
  public rowStatutoryData: any = [
    {
      code: "S001",
      name: "BPJS TK JKK",
      description: "Dibayar perusahaan",
      type: "Earnings",
      default_amount: 0.3,
      quantity: 1,
      unit: "Percent",
      taxable: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "S002",
      name: "BPJS TK JKM",
      description: "Dibayar perusahaan",
      type: "Earnings",
      default_amount: 0.89,
      quantity: 1,
      unit: "Percent",
      taxable: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "S003",
      name: "BPJS TK JP",
      description: "Dibayar pekerja",
      type: "Deductions",
      default_amount: 1,
      quantity: 1,
      unit: "Percent",
      taxable: false,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "S004",
      name: "BPJS TK JHT",
      description: "Dibayar pekerja",
      type: "Deductions",
      default_amount: 2,
      quantity: 1,
      unit: "Percent",
      taxable: false,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "S005",
      name: "BPJS Kesehatan",
      description: "Dibayar perusahaan",
      type: "Earnings",
      default_amount: 20000,
      quantity: 1,
      unit: "",
      taxable: true,
      show_in_payslip: true,
      active: true,
    },
    {
      code: "S006",
      name: "Iuran BPJS Kesehatan",
      description: "Dibayar pekerja",
      type: "Deductions",
      default_amount: 20000,
      quantity: 1,
      unit: "",
      taxable: true,
      show_in_payslip: true,
      active: true,
    },
  ];
  public rowCategoryData: any = [
    {
      code: "C001",
      name: "Fix Allowance",
      description: "Tunjangan tetap",
      type: "Earnings",
      active: true,
    },
    {
      code: "C002",
      name: "Variable Allowance",
      description: "Tunjangan tidak tetap",
      type: "Earnings",
      active: true,
    },
    {
      code: "C003",
      name: "Incentive",
      description: "Uang tambahan",
      type: "Earnings",
      active: true,
    },
    {
      code: "C004",
      name: "Fix Deduction",
      description: "Potongan tetap",
      type: "Deductions",
      active: true,
    },
    {
      code: "C005",
      name: "Variable Deduction",
      description: "Potongan tidak tetap",
      type: "Deductions",
      active: true,
    },
    {
      code: "C006",
      name: "Kasbon",
      description: "Cicilan pinjaman",
      type: "Deductions",
      active: true,
    },
  ];

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [1],
  };

  // form
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public formType: any;

  // dialog
  public showDialog: boolean = false;

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDefs: any;
  columnStatutoryDefs: any;
  columnCategoryDefs: any;
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
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
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

  handleShowForm(params: any, mode: any) {
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  // API FUNCTION

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.department"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.supervisor"), value: 3 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
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
        headerName: this.$t("commons.table.payroll.employee.code"),
        headerClass: "align-header-center",
        field: "code",
        width: 80,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        headerClass: "align-header-center",
        field: "name",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        headerClass: "align-header-center",
        field: "description",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.category"),
        headerClass: "align-header-center",
        field: "category",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.defaultAmount"),
        headerClass: "align-header-center",
        field: "default_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.qty"),
        headerClass: "align-header-center",
        field: "quantity",
        width: 50,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.unit"),
        headerClass: "align-header-center",
        field: "unit",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.taxable"),
        headerClass: "align-header-center",
        field: "taxable",
        width: 80,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.includedBpjsHealth"),
        headerClass: "align-header-center",
        field: "included_bpjs_health",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t(
          "commons.table.payroll.payroll.includedBpjsEmployee"
        ),
        headerClass: "align-header-center",
        field: "included_bpjs_employee",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        field: "show_in_payslip",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        field: "active",
        width: 50,
        enableRowGroup: true,
      },
    ];
    this.columnStatutoryDefs = [
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
        headerName: this.$t("commons.table.payroll.employee.code"),
        headerClass: "align-header-center",
        field: "code",
        width: 80,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        headerClass: "align-header-center",
        field: "name",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        headerClass: "align-header-center",
        field: "description",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.type"),
        headerClass: "align-header-center",
        field: "type",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.defaultAmount"),
        headerClass: "align-header-center",
        field: "default_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.qty"),
        headerClass: "align-header-center",
        field: "quantity",
        width: 50,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.unit"),
        headerClass: "align-header-center",
        field: "unit",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.taxable"),
        headerClass: "align-header-center",
        field: "taxable",
        width: 80,
        enableRowGroup: true,
      },

      {
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        field: "show_in_payslip",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        field: "active",
        width: 50,
        enableRowGroup: true,
      },
    ];
    this.columnCategoryDefs = [
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
        headerName: this.$t("commons.table.payroll.employee.code"),
        headerClass: "align-header-center",
        field: "code",
        width: 80,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        headerClass: "align-header-center",
        field: "name",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        headerClass: "align-header-center",
        field: "description",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.type"),
        headerClass: "align-header-center",
        field: "type",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        field: "active",
        width: 50,
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
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
