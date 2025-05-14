import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { formatNumber } from "@/utils/format";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { GridApi } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CategoryInputForm from "./category-component-input-form/category-component-input-form.vue";
import DeductionsInputForm from "./deductions-component-input-form/deductions-component-input-form.vue";
import EarningsInputForm from "./earnings-component-input-form/earnings-component-input-form.vue";
import StatutoryInputForm from "./statutory-component-input-form/statutory-component-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CDialog,
    EarningsInputForm,
    DeductionsInputForm,
    StatutoryInputForm,
    CategoryInputForm,
  },
})
export default class PayrollComponents extends Vue {
  // data
  public deleteParam: any;
  public rowEarningsData: any = [];
  public rowDeductionsData: any = [];
  public rowStatutoryData: any = [];
  public rowCategoryData: any = [];

  // form
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public activeTab: string = "earnings";

  public earningsFormElement: any = ref();
  public deductionsFormElement: any = ref();
  public statutoryFormElement: any = ref();
  public categoryFormElement: any = ref();

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

  earningsTabGridApi: any;
  deductionsTabGridApi: any;
  statutoryTabGridApi: any;
  categoryTabGridApi: any;

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
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.bpjsKesehatan"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "included_bpjs_health",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.bpjsTk"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "included_bpjs_employee",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.prorata"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "included_prorate",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "show_in_payslip",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
        editable: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
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
        cellRenderer: "checklistRenderer",
      },

      {
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "show_in_payslip",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
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
        cellRenderer: "checklistRenderer",
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
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

  onGridReady(params: any, gridId?: string) {
    const id = gridId || params.api.gridOptionsWrapper.gridOptions.id;
    switch (id) {
      case "earnings-tab-grid":
        this.earningsTabGridApi = params.api;
        break;
      case "deductions-tab-grid":
        this.deductionsTabGridApi = params.api;
        break;
      case "statutory-tab-grid":
        this.statutoryTabGridApi = params.api;
        break;
      case "category-tab-grid":
        this.categoryTabGridApi = params.api;
        break;
    }

    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
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
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.code == vm.paramsData.code) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  handleShowForm(params: any, mode: any) {
    this.modeData = mode;

    if (typeof params === "string") {
      this.activeTab = params;
    } else if (params.entity_type) {
      this.activeTab = params.entity_type;
    }

    this.showForm = true;

    this.$nextTick(() => {
      const formElement = this.getFormElementByType(this.activeTab);
      if (formElement && typeof formElement.initialize === "function") {
        formElement.initialize();

        if (mode === $global.modeData.edit) {
          this.populateForm(params);
        }
      }
    });
  }

  handleSave(formData: any) {
    if (!this.validateFormData(formData)) {
      return;
    }
    const entityType = this.getCurrentEntityType(formData);
    const formattedData = this.formatComponentData(formData, entityType);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData).then(() => {
        this.showForm = false;
      });
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formattedData).then(() => {
        this.showForm = false;
      });
    }
  }

  handleEdit(params: any) {
    const entityType = params.entity_type;
    this.activeTab = entityType;
    this.loadEditData(params, entityType);
  }

  handleDelete(params: any) {
    this.deleteParam = params;
    this.deleteData();
    // this.showDialog = true;
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  validateFormData(formData: any): boolean {
    const entityType = this.getCurrentEntityType(formData);
    const formElement = this.getFormElementByType(entityType);

    if (!formElement) {
      getToastError(`Form element for ${entityType} not found`);
      return false;
    }

    switch (entityType) {
      case "earnings":
        if (
          !formData.earningsCode ||
          !formData.earningsName ||
          !formData.earningCategory
        ) {
          getToastError("Please complete all required fields");
          return false;
        }
        break;
      case "deductions":
        if (
          !formData.deductionsCode ||
          !formData.deductionsName ||
          !formData.deductionsCategory
        ) {
          getToastError("Please complete all required fields");
          return false;
        }
        break;
      case "statutory":
        if (
          !formData.statutoryCode ||
          !formData.statutoryName ||
          !formData.statutoryType
        ) {
          getToastError("Please complete all required fields");
          return false;
        }
        break;
      case "category":
        if (
          !formData.categoryCode ||
          !formData.categoryName ||
          !formData.categoryType
        ) {
          getToastError("Please complete all required fields");
          return false;
        }
        break;
    }
    return true;
  }

  // API FUNCTION
  async loadData() {
    try {
      // const { data: earningsData } = await this.payrollComponentAPI.getPayrollComponentList({ type: 'Earnings' });
      // const { data: deductionsData } = await this.payrollComponentAPI.getPayrollComponentList({ type: 'Deductions' });
      // const { data: statutoryData } = await this.payrollComponentAPI.getPayrollComponentList({ type: 'Statutory' });
      // const { data: categoryData } = await this.payrollComponentAPI.getPayrollComponentList({ type: 'Category' });
      // this.rowEarningsData = earningsData;
      // this.rowDeductionsData = deductionsData;
      // this.rowStatutoryData = statutoryData;
      // this.rowCategoryData = categoryData;

      // For demo, load mock data
      this.loadMockData();
    } catch (error) {
      getError;
    }
  }

  async loadDataGrid(entityType: any = this.activeTab) {
    let gridApi: GridApi;
    switch (entityType) {
      case "earnings":
        gridApi = this.earningsTabGridApi;
        break;
      case "deductions":
        gridApi = this.deductionsTabGridApi;
        break;
      case "statutory":
        gridApi = this.statutoryTabGridApi;
        break;
      case "category":
        gridApi = this.categoryTabGridApi;
        break;
    }

    if (gridApi) {
      let rowData;
      switch (entityType) {
        case "earnings":
          rowData = [...this.rowEarningsData];
          break;
        case "deductions":
          rowData = [...this.rowDeductionsData];
          break;
        case "statutory":
          rowData = [...this.rowStatutoryData];
          break;
        case "category":
          rowData = [...this.rowCategoryData];
          break;
      }

      gridApi.setRowData(rowData);

      setTimeout(() => {
        // gridApi.refreshCells({ force: true });
      }, 100);
    }
  }

  async loadMockData() {
    this.rowEarningsData = [
      {
        id: 1,
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
        entity_type: "earnings",
      },
      {
        id: 2,
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
        entity_type: "earnings",
      },
      {
        id: 3,
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
        entity_type: "earnings",
      },
      {
        id: 4,
        code: "CE004",
        name: "Tunjangan Fasilitas",
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
        entity_type: "earnings",
      },
      {
        id: 5,
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
        entity_type: "earnings",
      },
      {
        id: 6,
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
        entity_type: "earnings",
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
        entity_type: "deductions",
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
        entity_type: "deductions",
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
        entity_type: "deductions",
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
        entity_type: "deductions",
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
        entity_type: "deductions",
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
        entity_type: "statutory",
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
        entity_type: "statutory",
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
        entity_type: "statutory",
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
        entity_type: "statutory",
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
        entity_type: "statutory",
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
        entity_type: "statutory",
      },
    ];

    this.rowCategoryData = [
      {
        code: "C001",
        name: "Fix Allowance",
        description: "Tunjangan tetap",
        type: "Earnings",
        active: true,
        entity_type: "category",
      },
      {
        code: "C002",
        name: "Variable Allowance",
        description: "Tunjangan tidak tetap",
        type: "Earnings",
        active: true,
        entity_type: "category",
      },
      {
        code: "C003",
        name: "Incentive",
        description: "Uang tambahan",
        type: "Earnings",
        active: true,
        entity_type: "category",
      },
      {
        code: "C004",
        name: "Fix Deduction",
        description: "Potongan tetap",
        type: "Deductions",
        active: true,
        entity_type: "category",
      },
      {
        code: "C005",
        name: "Variable Deduction",
        description: "Potongan tidak tetap",
        type: "Deductions",
        active: true,
        entity_type: "category",
      },
      {
        code: "C006",
        name: "Kasbon",
        description: "Cicilan pinjaman",
        type: "Deductions",
        active: true,
        entity_type: "category",
      },
    ];
  }

  async loadEditData(params: any, entityType: any) {
    try {
      this.showForm = true;

      await this.$nextTick();

      const formElement = this.getFormElementByType(entityType);

      if (!formElement) {
        console.error(`Form element for ${entityType} not found`);
        return;
      }

      this.populateForm(params);
      // if (mode === $global.modePayroll.editEarnings) {
      //   const { data } = await trainingAPI.GetLostAndFound(params);
      //   this.inputFormElement.form = data;
      //   this.showForm = true;
      // } else if (mode === $global.modePayroll.editDeductions) {
      //   const { data } = await trainingAPI.GetLostAndFound(params);
      //   this.inputFormElement.form = data;
      //   this.showForm = true;
      // } else if (mode === $global.modePayroll.editStatutory) {
      //   const { data } = await trainingAPI.GetLostAndFound(params);
      //   this.inputFormElement.form = data;
      //   this.showForm = true;
      // } else if (mode === $global.modePayroll.editCategory) {
      //   const { data } = await trainingAPI.GetLostAndFound(params);
      //   this.inputFormElement.form = data;
      //   this.showForm = true;
      // }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      // const { status2 } = await payrollComponentAPI.InsertPayrollComponent(formData);
      const entityType = formData.entity_type;
      formData.id = this.generateUniqueId(entityType);

      if (entityType === "earnings") {
        this.rowEarningsData = [...this.rowEarningsData, formData];
      } else if (entityType === "deductions") {
        this.rowDeductionsData = [...this.rowDeductionsData, formData];
      } else if (entityType === "statutory") {
        this.rowStatutoryData = [...this.rowStatutoryData, formData];
      } else if (entityType === "category") {
        this.rowCategoryData = [...this.rowCategoryData, formData];
      }
      await this.loadDataGrid(entityType);
      getToastSuccess(
        this.$t("messages.insertSuccess") || "Data added successfully"
      );
      return { status: 0 };
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      // const { status2 } = await payrollComponentAPI.UpdatePayrollComponent(formData);

      const entityType = formData.entity_type;

      if (entityType === "earnings") {
        const index = this.rowEarningsData.findIndex(
          (item: any) => item.code === formData.code
        );
        if (index !== -1) {
          this.rowEarningsData = [
            ...this.rowEarningsData.slice(0, index),
            { ...formData },
            ...this.rowEarningsData.slice(index + 1),
          ];
        }
      } else if (entityType === "deductions") {
        const index = this.rowDeductionsData.findIndex(
          (item: any) => item.code === formData.code
        );
        if (index !== -1) {
          this.rowDeductionsData = [
            ...this.rowDeductionsData.slice(0, index),
            { ...formData },
            ...this.rowDeductionsData.slice(index + 1),
          ];
        }
      } else if (entityType === "statutory") {
        const index = this.rowStatutoryData.findIndex(
          (item: any) => item.code === formData.code
        );
        if (index !== -1) {
          this.rowStatutoryData = [
            ...this.rowStatutoryData.slice(0, index),
            { ...formData },
            ...this.rowStatutoryData.slice(index + 1),
          ];
        }
      } else if (entityType === "category") {
        const index = this.rowCategoryData.findIndex(
          (item: any) => item.code === formData.code
        );
        if (index !== -1) {
          this.rowCategoryData = [
            ...this.rowCategoryData.slice(0, index),
            { ...formData },
            ...this.rowCategoryData.slice(index + 1),
          ];
        }
      }

      // Properly refresh the grid
      await this.loadDataGrid(entityType);

      getToastSuccess(
        this.$t("messages.updateSuccess") || "Data updated successfully"
      );
      return { status: 0 };
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      // const { status2 } = await payrollComponentAPI.DeletePayrollComponent(params.id);
      const params = this.deleteParam;
      const entityType = params.entity_type;

      if (entityType === "earnings") {
        this.rowEarningsData = this.rowEarningsData.filter(
          (item: any) => item.code !== params.code
        );
      } else if (entityType === "deductions") {
        this.rowDeductionsData = this.rowDeductionsData.filter(
          (item: any) => item.code !== params.code
        );
      } else if (entityType === "statutory") {
        this.rowStatutoryData = this.rowStatutoryData.filter(
          (item: any) => item.code !== params.code
        );
      } else if (entityType === "category") {
        this.rowCategoryData = this.rowCategoryData.filter(
          (item: any) => item.code !== params.code
        );
      } else {
        getToastError("Component not found");
        return;
      }

      await this.loadDataGrid(entityType);

      getToastSuccess(`Component ${entityType} has been removed successfully`);
    } catch (error) {
      getError(error);
    }
  }

  // refreshGridAfterSave(entityType: string) {
  //   switch (entityType) {
  //     case "earnings":
  //       if (this.earningsTabGridApi) {
  //         this.earningsTabGridApi.setRowData([...this.rowEarningsData]);
  //       }
  //       break;
  //     case "deductions":
  //       if (this.deductionsTabGridApi) {
  //         this.deductionsTabGridApi.setRowData([...this.rowDeductionsData]);
  //       }
  //       break;
  //     case "statutory":
  //       if (this.statutoryTabGridApi) {
  //         this.statutoryTabGridApi.setRowData([...this.rowStatutoryData]);
  //       }
  //       break;
  //     case "category":
  //       if (this.categoryTabGridApi) {
  //         this.categoryTabGridApi.setRowData([...this.rowCategoryData]);
  //       }
  //       break;
  //   }
  // }

  generateUniqueId(entityType: string): number {
    let maxId = 0;

    if (entityType === "earnings") {
      maxId = Math.max(
        ...this.rowEarningsData.map((item: any) => item.id || 0),
        0
      );
    } else if (entityType === "deductions") {
      maxId = Math.max(
        ...this.rowDeductionsData.map((item: any) => item.id || 0),
        0
      );
    } else if (entityType === "statutory") {
      maxId = Math.max(
        ...this.rowStatutoryData.map((item: any) => item.id || 0),
        0
      );
    } else if (entityType === "category") {
      maxId = Math.max(
        ...this.rowCategoryData.map((item: any) => item.id || 0),
        0
      );
    }

    return maxId + 1;
  }

  formatEarningsData(formData: any) {
    return {
      id: formData.id,
      code: formData.earningsCode,
      name: formData.earningsName,
      description: formData.earningsDescription,
      category: formData.earningCategory,
      default_amount: formData.earningDefaultAmount,
      quantity: formData.earningQty,
      unit: formData.earningUnit,
      taxable: formData.earningTaxable === "YES",
      included_bpjs_health: formData.earningIncludedBpjsHealth === "YES",
      included_bpjs_employee: formData.earningIncludedBpjsEmplyoee === "YES",
      included_prorate: formData.earningIncludedProrate === "YES",
      show_in_payslip: formData.earningsShowInPayslip === "YES",
      active: formData.earningsStatus === "A",
      entity_type: "earnings",
    };
  }

  formatDeductionsData(formData: any) {
    return {
      id: formData.id,
      code: formData.deductionsCode,
      name: formData.deductionsName,
      description: formData.deductionsDescription,
      category: formData.deductionsCategory,
      default_amount: formData.deductionsDefaultAmount,
      quantity: formData.deductionsQty,
      unit: formData.deductionsUnit,
      taxable: formData.deductionsTaxable === "YES",
      included_bpjs_health: formData.deductionsIncludedBpjsHealth === "YES",
      included_bpjs_employee: formData.deductionsIncludedBpjsEmplyoee === "YES",
      included_prorate: formData.deductionsIncludedProrate === "YES",
      show_in_payslip: formData.deductionsShowInPayslip === "YES",
      active: formData.deductionsStatus === "A",
      entity_type: "deductions",
    };
  }

  formatStatutoryData(formData: any) {
    return {
      id: formData.id || undefined,
      code: formData.statutoryCode,
      name: formData.statutoryName,
      description: formData.statutoryDescription,
      type: formData.statutoryType,
      default_amount: formData.statutoryDefaultAmount,
      quantity: formData.statutoryQty,
      unit: formData.statutoryUnit,
      taxable: formData.statutoryTaxable === "YES",
      included_prorate: formData.statutoryIncludedProrate === "YES",
      show_in_payslip: formData.statutoryShowInPayslip === "YES",
      active: formData.statutoryStatus === "A",
      entity_type: "statutory",
    };
  }

  formatCategoryData(formData: any) {
    return {
      id: formData.id || undefined,
      code: formData.categoryCode,
      name: formData.categoryName,
      description: formData.categoryDescription,
      type: formData.categoryType,
      active: formData.categoryStatus === "A",
      entity_type: "category",
    };
  }

  populateForm(params: any) {
    if (!params || !params.entity_type) {
      console.info("Invalid data for form population:", params);
      return;
    }

    const entityType = params.entity_type;
    const formElement = this.getFormElementByType(entityType);

    if (!formElement) {
      console.info(
        `Form element for ${entityType} not found during population`
      );
      return;
    }

    this.$nextTick(() => {
      switch (entityType) {
        case "earnings":
          formElement.form = {
            earningsCode: params.code || "",
            earningsName: params.name || "",
            earningsDescription: params.description || "",
            earningCategory: params.category || "",
            earningDefaultAmount: params.default_amount || 0,
            earningQty: params.quantity || 1,
            earningUnit: params.unit || "",
            earningTaxable: params.taxable ? "YES" : "NO",
            earningIncludedBpjsHealth: params.included_bpjs_health
              ? "YES"
              : "NO",
            earningIncludedBpjsEmplyoee: params.included_bpjs_employee
              ? "YES"
              : "NO",
            earningIncludedProrate: params.included_prorate ? "YES" : "NO",
            earningsShowInPayslip: params.show_in_payslip ? "YES" : "NO",
            earningsStatus: params.active ? "A" : "I",
            entityType: "earnings",
            id: params.id,
          };

          break;
        case "deductions":
          formElement.form = {
            deductionsCode: params.code || "",
            deductionsName: params.name || "",
            deductionsDescription: params.description || "",
            deductionsCategory: params.category || "",
            deductionsDefaultAmount: params.default_amount || 0,
            deductionsQty: params.quantity || 1,
            deductionsUnit: params.unit || "",
            deductionsTaxable: params.taxable ? "YES" : "NO",
            deductionsIncludedBpjsHealth: params.included_bpjs_health
              ? "YES"
              : "NO",
            deductionsIncludedBpjsEmplyoee: params.included_bpjs_employee
              ? "YES"
              : "NO",
            deductionsIncludedProrate: params.included_prorate ? "YES" : "NO",
            deductionsShowInPayslip: params.show_in_payslip ? "YES" : "NO",
            deductionsStatus: params.active ? "A" : "I",
            entityType: "deductions",
            id: params.id,
          };

          break;
        case "statutory":
          formElement.form = {
            statutoryCode: params.code || "",
            statutoryName: params.name || "",
            statutoryDescription: params.description || "",
            statutoryType: params.type || "",
            statutoryDefaultAmount: params.default_amount || 0,
            statutoryQty: params.quantity || 1,
            statutoryUnit: params.unit || "",
            statutoryTaxable: params.taxable ? "YES" : "NO",
            statutoryShowInPayslip: params.show_in_payslip ? "YES" : "NO",
            statutoryStatus: params.active ? "A" : "I",
            entityType: "statutory",
            id: params.id,
          };

          break;
        case "category":
          formElement.form = {
            categoryCode: params.code || "",
            categoryName: params.name || "",
            categoryDescription: params.description || "",
            categoryType: params.type || "",
            categoryStatus: params.active ? "A" : "I",
            entityType: "category",
            id: params.id,
          };

          break;
      }

      if (formElement.form) {
        formElement.form.id = params.id;
      }
    });
  }

  getCurrentEntityType(formData: any): string {
    if (formData.entityType) return formData.entityType;
    if (formData.earningsCode !== undefined) return "earnings";
    if (formData.deductionsCode !== undefined) return "deductions";
    if (formData.statutoryCode !== undefined) return "statutory";
    if (formData.categoryCode !== undefined) return "category";
    return this.activeTab;
  }

  getFormElementByType(type: string): any {
    switch (type) {
      case "earnings":
        return this.$refs.earningsFormElement;
      case "deductions":
        return this.$refs.deductionsFormElement;
      case "statutory":
        return this.$refs.statutoryFormElement;
      case "category":
        return this.$refs.categoryFormElement;
      default:
        console.info(`Unknown component type: ${type}`);
        return null;
    }
  }

  formatComponentData(formData: any, entityType: string): any {
    let formatted;
    switch (entityType) {
      case "earnings":
        formatted = this.formatEarningsData(formData);
        break;
      case "deductions":
        formatted = this.formatDeductionsData(formData);
        break;
      case "statutory":
        formatted = this.formatStatutoryData(formData);
        break;
      case "category":
        formatted = this.formatCategoryData(formData);
        break;
      default:
        throw new Error("Unknown component type");
    }

    if (formData.id) {
      formatted.id = formData.id;
    }

    formatted.entity_type = entityType;
    return formatted;
  }

  getCurrentFormComponent() {
    switch (this.activeTab) {
      case "earnings":
        return "earnings-input-form";
      case "deductions":
        return "deductions-input-form";
      case "statutory":
        return "statutory-input-form";
      case "category":
        return "category-input-form";
      default:
        return "c-input-form";
    }
  }

  getCurrentFormRef() {
    switch (this.activeTab) {
      case "earnings":
        return "earningsFormElement";
      case "deductions":
        return "deductionsFormElement";
      case "statutory":
        return "statutoryFormElement";
      case "category":
        return "categoryFormElement";
      default:
        return "inputFormElement";
    }
  }

  // GETTER AND SETTER
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
