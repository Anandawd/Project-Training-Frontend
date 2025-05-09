import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CheckboxRenderer from "@/components/ag_grid-framework/checkbox.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { formatNumber } from "@/utils/format";
import { generateIconContextMenuAgGrid } from "@/utils/general";
import $global from "@/utils/global";
import { ICellRendererParams } from "ag-grid-community";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./payroll-component-input-form/payroll-component-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CDialog,
    CInputForm,
  },
})
export default class PayrollComponents extends Vue {
  // data
  public rowEarningsData: any = [];
  public rowDeductionsData: any = [];
  public rowStatutoryData: any = [];
  public rowCategoryData: any = [];

  // form
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public formType: any;

  // dialog
  public showDialog: boolean = false;
  public dialogAction: string = "";
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogParams: any;

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

  checkBoxRenderer = (params: ICellRendererParams) => {
    const checked = params.value === true ? "checked" : "";
    return `<div class='d-flex justify-content-center'>
    <input type='checkbox' ${checked} disabled />
    <div/>
    `;
  };

  // LIFECYCLE HOOKS
  created(): void {
    this.loadMockData();
  }

  beforeMount(): void {
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
        field: "code",
        width: 80,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "name",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        field: "description",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.category"),
        field: "category",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.defaultAmount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "default_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.qty"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "quantity",
        width: 50,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.unit"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "unit",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.taxable"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "taxable",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.bpjsKesehatan"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "included_bpjs_health",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.bpjsTk"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "included_bpjs_employee",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.prorata"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "included_prorate",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "show_in_payslip",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
        editable: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
        editable: false,
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
        field: "code",
        width: 80,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "name",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        field: "description",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.type"),
        field: "type",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.defaultAmount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "default_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.qty"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "quantity",
        width: 50,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.unit"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "unit",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.taxable"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "taxable",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },

      {
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "show_in_payslip",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
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
        field: "code",
        width: 80,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "name",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        field: "description",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.type"),
        field: "type",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checkboxRenderer",
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checkboxRenderer: CheckboxRenderer,
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
        action: () =>
          this.handleDelete(this.paramsData, $global.modeData.delete),
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

  showConfirmationDialog(
    action: string,
    title: string = "Confirm",
    message: string,
    params: any = null
  ): void {
    this.dialogAction = action;
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogParams = params;
    this.showDialog = true;
  }

  confirmAction() {
    this.showDialog = false;

    switch (this.dialogAction) {
      case $global.dialogActions.save:
        break;
      case $global.dialogActions.delete:
        break;
      case $global.dialogActions.saveAndReturn:
        break;
      default:
        console.warn("Unsupported dialog action:", this.dialogAction);
    }

    this.dialogParams = null;
  }

  handleShowForm(params: any, mode: any) {
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any, mode: any) {
    this.modeData = mode;
  }

  // API FUNCTION
  async loadMockData() {
    this.rowEarningsData = [
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

    this.rowDeductionsData = [
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

    this.rowStatutoryData = [
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

    this.rowCategoryData = [
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
  }

  // GETTER AND SETTER
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
