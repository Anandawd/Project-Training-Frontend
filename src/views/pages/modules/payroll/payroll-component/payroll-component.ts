import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { formatNumber } from "@/utils/format";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CategoryInputForm from "./category-component-input-form/category-component-input-form.vue";
import DeductionsInputForm from "./deductions-component-input-form/deductions-component-input-form.vue";
import EarningsInputForm from "./earnings-component-input-form/earnings-component-input-form.vue";
import StatutoryInputForm from "./statutory-component-input-form/statutory-component-input-form.vue";

import CInputForm from "./payroll-component-input-form/payroll-component-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CDialog,
    CInputForm,
    EarningsInputForm,
    DeductionsInputForm,
    StatutoryInputForm,
    CategoryInputForm,
  },
})
export default class PayrollComponents extends Vue {
  // data
  public selectedRowData: any;
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
  standaloneEarningsGridApi: any;
  standaloneDeductionsGridApi: any;

  // LIFECYCLE HOOKS
  created(): void {
    this.loadMockData();
  }

  mounted() {}

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
    console.info("gridId", gridId);
    // Store based on explicit ID
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
      case "standalone-earnings-grid":
        this.standaloneEarningsGridApi = params.api;
        break;
      case "standalone-deductions-grid":
        this.standaloneDeductionsGridApi = params.api;
        break;
    }

    // Also keep the generic gridApi for other operations
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

    let componentType = "";
    const activeTabId = document.querySelector(
      ".nav-tabs .nav-link.active"
    )?.id;

    if (activeTabId) {
      if (activeTabId === "earnings-tab") componentType = "earnings";
      else if (activeTabId === "deductions-tab") componentType = "deductions";
      else if (activeTabId === "statutory-tab") componentType = "statutory";
      else if (activeTabId === "category-tab") componentType = "category";
    }

    if (this.paramsData) {
      this.paramsData.componentType = componentType;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(
            componentType,
            $global.modeData.edit,
            this.paramsData
          ),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(componentType, this.paramsData),
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
    console.log("confirmAction called");

    // Add debugging to see dialog state
    console.log("Before: showDialog =", this.showDialog);

    // Try to force the dialog to close
    this.showDialog = false;

    // Add debugging to confirm state change
    console.log("After: showDialog =", this.showDialog);

    switch (this.dialogAction) {
      case $global.dialogActions.delete:
        this.deleteData(this.dialogParams);
        break;
      default:
        console.info("Unsupported dialog action:", this.dialogAction);
    }

    this.dialogParams = null;
  }

  handleShowForm(formType: string, mode: any, params?: any) {
    // this.inputFormElement.initialize();
    this.modeData = mode;
    this.formType = formType;
    this.showForm = false;
    this.$nextTick(() => {
      this.showForm = true;

      if (mode === $global.modeData.edit && params) {
        this.$nextTick(() => {
          this.populateForm(formType, params);
        });
      } else if (mode === $global.modeData.insert) {
        this.$nextTick(() => {
          const formElement = this.getFormElementByType(formType);
          if (formElement && formElement.resetForm) {
            formElement.resetForm();
          }
        });
      }
    });
  }

  handleSave(formData: any) {
    let componentType = "";
    if (formData.earningsCode !== undefined) {
      componentType = "earnings";
    } else if (formData.deductionsCode !== undefined) {
      componentType = "deductions";
    } else if (formData.statutoryCode !== undefined) {
      componentType = "statutory";
    } else if (formData.categoryCode !== undefined) {
      componentType = "category";
    }

    if (this.modeData === $global.modeData.insert) {
      this.saveData(formData, componentType);
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formData, componentType);
    }
  }

  handleDelete(componentType: string, params: any) {
    this.showConfirmationDialog(
      $global.dialogActions.delete,
      "Confirm Delete",
      `Are you sure you want to delete this component?`,
      { componentType, params }
    );
  }

  getFormElementByType(type: string): any {
    switch (type) {
      case "earnings":
        return this.earningsFormElement;
      case "deductions":
        return this.deductionsFormElement;
      case "statutory":
        return this.statutoryFormElement;
      case "category":
        return this.categoryFormElement;
      default:
        return null;
    }
  }

  refreshData(search: any) {
    // this.loadDataGrid(search);
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

  async loadEditData(params: any, mode: any) {
    try {
      if (mode === $global.modePayroll.editEarnings) {
        // const { data } = await trainingAPI.GetLostAndFound(params);
        // this.inputFormElement.form = data;
        this.showForm = true;
      } else if (mode === $global.modePayroll.editDeductions) {
        // const { data } = await trainingAPI.GetLostAndFound(params);
        // this.inputFormElement.form = data;
        this.showForm = true;
      } else if (mode === $global.modePayroll.editStatutory) {
        // const { data } = await trainingAPI.GetLostAndFound(params);
        // this.inputFormElement.form = data;
        this.showForm = true;
      } else if (mode === $global.modePayroll.editCategory) {
        // const { data } = await trainingAPI.GetLostAndFound(params);
        // this.inputFormElement.form = data;
        this.showForm = true;
      }
    } catch (error) {
      getError(error);
    }
  }

  async saveData(formData: any, componentType: string) {
    try {
      getToastSuccess(
        this.$t("messages.saveSuccess") || "Data saved successfully"
      );
      this.showForm = false;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any, componentType: string) {
    try {
      let updated = false;

      if (updated) {
        getToastSuccess(`${componentType} component updated successfully`);
        this.showForm = false;
        return true;
      } else {
        getToastError(`Failed to update ${componentType} component`);
        return false;
      }
    } catch (error) {}
  }

  async deleteData(data: any) {
    try {
      console.info("data di deleteDate", data);
      if (data.componentType === "earnings") {
        this.rowEarningsData = this.rowEarningsData.filter(
          (item: any) => item.code !== data.params.code
        );
        // Update both earnings grids explicitly
        if (this.earningsTabGridApi) {
          this.earningsTabGridApi.setRowData([...this.rowEarningsData]);
        }
        if (this.standaloneEarningsGridApi) {
          this.standaloneEarningsGridApi.setRowData([...this.rowEarningsData]);
        }
        getToastSuccess("Component Earnings has remove successfully");
      } else if (data.componentType === "deductions") {
        this.rowDeductionsData = this.rowDeductionsData.filter(
          (item: any) => item.code !== data.params.code
        );
        // Update both deductions grids explicitly
        if (this.deductionsTabGridApi) {
          this.deductionsTabGridApi.setRowData([...this.rowDeductionsData]);
        }
        if (this.standaloneDeductionsGridApi) {
          this.standaloneDeductionsGridApi.setRowData([
            ...this.rowDeductionsData,
          ]);
        }

        getToastSuccess("Component Deductions has remove successfully");
      } else {
        getToastError("Component not found");
      }

      return true;
    } catch (error) {
      getError(error);
      return false;
    }
  }

  refreshGridData(componentType: string) {
    const gridElements = document.querySelectorAll(".ag-root-wrapper");
    if (gridElements.length > 0) {
      // We need to find the correct grid based on which tab is active
      const activeTabId = document.querySelector(
        ".nav-tabs .nav-link.active"
      )?.id;

      // Update data for all relevant grid instances
      // This forces every grid instance to refresh with the latest data
      gridElements.forEach((gridElement, index) => {
        const gridApi = (gridElement as any).__agGridApi;
        if (gridApi) {
          switch (componentType) {
            case "earnings":
              gridApi.setRowData(this.rowEarningsData);
              break;
            case "deductions":
              gridApi.setRowData(this.rowDeductionsData);
              break;
            case "statutory":
              gridApi.setRowData(this.rowStatutoryData);
              break;
            case "category":
              gridApi.setRowData(this.rowCategoryData);
              break;
          }
        }
      });
    }
  }

  formatEarningsData(formData: any) {
    return {
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
    };
  }

  formatDeductionsData(formData: any) {
    return {
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
    };
  }

  formatStatutoryData(formData: any) {
    return {
      code: formData.statutoryCode,
      name: formData.statutoryName,
      description: formData.statutoryDescription,
      type: formData.statutoryType,
      default_amount: formData.statutoryDefaultAmount,
      quantity: formData.statutoryQty,
      unit: formData.statutoryUnit,
      taxable: formData.statutoryTaxable === "YES",
      show_in_payslip: formData.statutoryShowInPayslip === "YES",
      active: formData.statutoryStatus === "A",
    };
  }

  formatCategoryData(formData: any) {
    return {
      code: formData.categoryCode,
      name: formData.categoryName,
      description: formData.categoryDescription,
      type: formData.categoryType,
      active: formData.categoryStatus === "A",
    };
  }

  populateForm(formType: string, data: any) {
    const formElement = this.getFormElementByType(formType);
    if (!formElement) return;

    switch (formType) {
      case "earnings":
        formElement.form = {
          earningsCode: data.code || "",
          earningsName: data.name || "",
          earningsDescription: data.description || "",
          earningCategory: data.category || "",
          earningDefaultAmount: data.default_amount || 0,
          earningQty: data.quantity || 1,
          earningUnit: data.unit || "",
          earningTaxable: data.taxable ? "YES" : "NO",
          earningIncludedBpjsHealth: data.included_bpjs_health ? "YES" : "NO",
          earningIncludedBpjsEmplyoee: data.included_bpjs_employee
            ? "YES"
            : "NO",
          earningIncludedProrate: data.included_prorate ? "YES" : "NO",
          earningsShowInPayslip: data.show_in_payslip ? "YES" : "NO",
          earningsStatus: data.active ? "A" : "I",
        };
        break;
      case "deductions":
        formElement.form = {
          deductionsCode: data.code || "",
          deductionsName: data.name || "",
          deductionsDescription: data.description || "",
          deductionsCategory: data.category || "",
          deductionsDefaultAmount: data.default_amount || 0,
          deductionsQty: data.quantity || 1,
          deductionsUnit: data.unit || "",
          deductionsTaxable: data.taxable ? "YES" : "NO",
          deductionsIncludedBpjsHealth: data.included_bpjs_health
            ? "YES"
            : "NO",
          deductionsIncludedBpjsEmplyoee: data.included_bpjs_employee
            ? "YES"
            : "NO",
          deductionsIncludedProrate: data.included_prorate ? "YES" : "NO",
          deductionsShowInPayslip: data.show_in_payslip ? "YES" : "NO",
          deductionsStatus: data.active ? "A" : "I",
        };
        break;
      case "statutory":
        formElement.form = {
          statutoryCode: data.code || "",
          statutoryName: data.name || "",
          statutoryDescription: data.description || "",
          statutoryType: data.type || "",
          statutoryDefaultAmount: data.default_amount || 0,
          statutoryQty: data.quantity || 1,
          statutoryUnit: data.unit || "",
          statutoryTaxable: data.taxable ? "YES" : "NO",
          statutoryShowInPayslip: data.show_in_payslip ? "YES" : "NO",
          statutoryStatus: data.active ? "A" : "I",
        };
        break;
      case "category":
        formElement.form = {
          categoryCode: data.code || "",
          categoryName: data.name || "",
          categoryDescription: data.description || "",
          categoryType: data.type || "",
          categoryStatus: data.active ? "A" : "I",
        };
        break;
    }
    formElement.form.id = data.id;
  }

  getCurrentFormComponent() {
    switch (this.formType) {
      case "earnings":
        return EarningsInputForm;
      case "deductions":
        return DeductionsInputForm;
      case "statutory":
        return StatutoryInputForm;
      case "category":
        return CategoryInputForm;
      default:
        return null;
    }
  }

  getCurrentFormRef(el: any) {
    if (!el) return;
    switch (this.formType) {
      case "earnings":
        this.earningsFormElement = el;
        break;
      case "deductions":
        this.deductionsFormElement = el;
        break;
      case "statutory":
        this.statutoryFormElement = el;
        break;
      case "category":
        this.categoryFormElement = el;
        break;
    }
  }

  // GETTER AND SETTER
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
