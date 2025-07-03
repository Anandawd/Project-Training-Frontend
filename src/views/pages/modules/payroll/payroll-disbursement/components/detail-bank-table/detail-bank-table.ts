import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import { formatNumber2 } from "@/utils/format";
import { generateTotalFooterAgGrid, getError } from "@/utils/general";
import $global from "@/utils/global";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { Options, Vue } from "vue-class-component";

const payrollAPI = new PayrollAPI();

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
  },
})
export default class DisbursementDetail extends Vue {
  // data
  public periodCode: string = "";
  public rowData: any = [];
  public isLoading: boolean = false;
  public params: any;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

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

  async mounted() {
    // await this.loadData();
    console.log("detail bank params: ", this.params.data);
  }

  beforeMount(): void {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.payroll.employee.employeeId"),
        field: "employee_id",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "FullName",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "Position",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "Department",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.baseSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "basic_salary",
        width: 130,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.grossSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "gross_salary",
        width: 130,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.deductionSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "total_deductions",
        width: 130,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.pph21"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "tax_amount",
        width: 130,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.takeHomePay"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "net_salary",
        width: 130,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
    ];
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
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
  }

  async loadData() {
    try {
      // const { data } = await payrollAPI.GetPayrollListByBank(this.params.data.bank_name);
      // if (data) {
      //   this.rowData = data;
      // } else {
      //   this.rowData = [];
      // }
      this.loadMockData;
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowData = [
      {
        FullName: "John Cena",
        PeriodName: "Gaji Bulan Juni 2025",
        actual_workdays: 30,
        basic_salary: "10000000.00",
        created_at: "2025-07-03T03:48:37Z",
        created_by: "",
        employee_id: "EMP003",
        gross_salary: "10180000.00",
        gross_salary_taxable: "10180000.00",
        id: 220,
        net_salary: "9650950.00",
        payment_date: "0001-01-01T00:00:00Z",
        payment_method: "Bank Transfer",
        payment_reference: "",
        payroll_id: "payroll-cakra-bali-juni_EMP003",
        period_code: "payroll-cakra-bali-juni",
        prorata_factor: "1.00",
        remark: "",
        status: "",
        tax_amount: "229050.00",
        tax_income_type: "PPh21",
        tax_method: "Gross",
        total_deductions: "300000.00",
        total_deductions_taxable: "300000.00",
        total_workdays: 30,
        updated_at: "2025-07-03T03:48:37Z",
        updated_by: "",
      },
      {
        FullName: "Mike Moos",
        PeriodName: "Gaji Bulan Juni 2025",
        actual_workdays: 30,
        basic_salary: "7000000.00",
        created_at: "2025-07-03T03:48:37Z",
        created_by: "",
        employee_id: "EMP002",
        gross_salary: "7996800.00",
        gross_salary_taxable: "7996800.00",
        id: 221,
        net_salary: "7606848.00",
        payment_date: "0001-01-01T00:00:00Z",
        payment_method: "Bank Transfer",
        payment_reference: "",
        payroll_id: "payroll-cakra-bali-juni_EMP002",
        period_code: "payroll-cakra-bali-juni",
        prorata_factor: "1.00",
        remark: "",
        status: "",
        tax_amount: "119952.00",
        tax_income_type: "PPh21",
        tax_method: "Gross",
        total_deductions: "270000.00",
        total_deductions_taxable: "270000.00",
        total_workdays: 30,
        updated_at: "2025-07-03T03:48:37Z",
        updated_by: "",
      },
      {
        FullName: "Mike Moos",
        PeriodName: "Gaji Bulan Juni 2025",
        actual_workdays: 30,
        basic_salary: "7000000.00",
        created_at: "2025-07-03T03:48:37Z",
        created_by: "",
        employee_id: "EMP002",
        gross_salary: "7996800.00",
        gross_salary_taxable: "7996800.00",
        id: 221,
        net_salary: "7606848.00",
        payment_date: "0001-01-01T00:00:00Z",
        payment_method: "Bank Transfer",
        payment_reference: "",
        payroll_id: "payroll-cakra-bali-juni_EMP002",
        period_code: "payroll-cakra-bali-juni",
        prorata_factor: "1.00",
        remark: "",
        status: "",
        tax_amount: "119952.00",
        tax_income_type: "PPh21",
        tax_method: "Gross",
        total_deductions: "270000.00",
        total_deductions_taxable: "270000.00",
        total_workdays: 30,
        updated_at: "2025-07-03T03:48:37Z",
        updated_by: "",
      },
      {
        FullName: "Robert Junior",
        PeriodName: "Gaji Bulan Juni 2025",
        actual_workdays: 30,
        basic_salary: "5000000.00",
        created_at: "2025-07-03T03:48:37Z",
        created_by: "",
        employee_id: "EMP004",
        gross_salary: "5000000.00",
        gross_salary_taxable: "5000000.00",
        id: 222,
        net_salary: "5000000.00",
        payment_date: "0001-01-01T00:00:00Z",
        payment_method: "Bank Transfer",
        payment_reference: "",
        payroll_id: "payroll-cakra-bali-juni_EMP004",
        period_code: "payroll-cakra-bali-juni",
        prorata_factor: "1.00",
        remark: "",
        status: "",
        tax_amount: "0.00",
        tax_income_type: "PPh21",
        tax_method: "Gross",
        total_deductions: "0.00",
        total_deductions_taxable: "0.00",
        total_workdays: 30,
        updated_at: "2025-07-03T03:48:37Z",
        updated_by: "",
      },
    ];
  }

  // COMPUTED PROPERTIES
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
