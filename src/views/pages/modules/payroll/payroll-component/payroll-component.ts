import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CheckboxRenderer from "@/components/ag_grid-framework/checkbox.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { formatNumber } from "@/utils/format";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { ICellRendererParams } from "ag-grid-community";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EarningsInputForm from "./earnings-component-input-form/earnings-component-input-form.vue";
import CInputForm from "./payroll-component-input-form/payroll-component-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CDialog,
    CInputForm,
    EarningsInputForm,
  },
})
export default class PayrollComponents extends Vue {
  // data
  public rowEarningsData: any = [];
  public rowDeductionsData: any = [];
  public rowStatutoryData: any = [];
  public rowCategoryData: any = [];
  public activeTabIndex: number = 0;
  public activeTab: string = "earnings";

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
      case $global.dialogActions.delete:
        this.deleteData(this.paramsData);
        break;
      default:
        console.warn("Unsupported dialog action:", this.dialogAction);
    }

    this.dialogParams = null;
  }

  handleTabChange(tabIndex: number) {
    this.activeTabIndex = tabIndex;
    switch (tabIndex) {
      case 0:
        this.activeTab = "earnings";
        break;
      case 1:
        this.activeTab = "deductions";
        break;
      case 2:
        this.activeTab = "statutory";
        break;
      case 3:
        this.activeTab = "category";
        break;
      default:
        this.activeTab = "earnings";
    }
  }

  handleShowForm(params: any, mode: any) {
    this.inputFormElement.initialize();
    this.modeData = mode;

    if (mode === $global.modeData.edit && params) {
      console.info("Editing component:", params); // Logging untuk debug

      // 1. Tentukan tab yang harus diaktifkan berdasarkan data
      let tabToActivate = "";

      if (params.type === "Deductions") {
        tabToActivate = "deductions";
      } else if (params.type === "Statutory") {
        tabToActivate = "statutory";
      } else if (params.type === "Category") {
        tabToActivate = "category";
      } else {
        tabToActivate = "earnings"; // Default
      }

      // 2. Setel tab aktif di dalam komponen form
      this.inputFormElement.activeTab = tabToActivate;

      // 3. Tunjukkan form terlebih dahulu
      this.showForm = true;

      // 4. Tunggu hingga form terlihat sebelum melakukan populasi dan mengaktifkan tab
      this.$nextTick().then(() => {
        // 5. Populasi data setelah form benar-benar terlihat
        this.populateForm(params);

        // 6. Aktifkan tab setelah form terisi
        this.$nextTick().then(() => {
          const tabElement = document.getElementById(
            `form-${tabToActivate}-tab`
          );
          if (tabElement) {
            console.log(`Activating tab: form-${tabToActivate}-tab`);
            tabElement.click();
          } else {
            console.error(`Tab element not found: form-${tabToActivate}-tab`);
          }
        });
      });
    } else {
      // Untuk item baru, cukup tampilkan form dengan tab default
      this.showForm = true;
    }
  }

  handleSave(formData: any) {
    if (this.modeData === $global.modeData.insert) {
      this.saveData(formData);
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formData);
    }
  }

  handleDelete(params: any) {
    this.showConfirmationDialog(
      $global.dialogActions.delete,
      "Confirm Delete",
      "Are you sure you want to delete this component?",
      params
    );
  }

  // API FUNCTION
  async loadData() {
    try {
      // In a real implementation, fetch data from API
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

  async saveData(formData: any) {
    try {
      const processedData = this.prepareFormData(formData);
      // In a real implementation, use the API
      // const { data, status2 } = await this.payrollComponentAPI.insertPayrollComponent(processedData);
      // if (status2.status === 0) {
      //   getToastSuccess(this.$t('messages.saveSuccess'));
      //   this.showForm = false;
      //   this.loadData();
      // }

      // For mock demo purposes
      getToastSuccess(
        this.$t("messages.saveSuccess") || "Data saved successfully"
      );
      this.showForm = false;
      this.refreshDataAfterSave(processedData);
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const processedData = this.prepareFormData(formData);
      // In a real implementation, use the API
      // const { data, status2 } = await this.payrollComponentAPI.updatePayrollComponent(processedData);
      // if (status2.status === 0) {
      //   getToastSuccess(this.$t('messages.saveSuccess'));
      //   this.showForm = false;
      //   this.loadData();
      // }

      // For mock demo purposes
      getToastSuccess(
        this.$t("messages.saveSuccess") || "Data updated successfully"
      );
      this.showForm = false;
      this.refreshDataAfterUpdate(processedData);
    } catch (error) {}
  }

  async deleteData(params: any) {
    try {
      if (!params) {
        getToastError("Invalid component to delete");
        return false;
      }

      getToastSuccess(
        this.$t("messages.deleteSuccess") || "Data deleted successfully"
      );

      let deleted = false;

      if (
        params.type === "Earnings" ||
        (!params.type && this.activeTab === "earnings")
      ) {
        this.rowEarningsData = this.rowEarningsData.filter(
          (item: any) =>
            (item.id && item.id !== params.id) || item.code !== params.code
        );
        deleted = true;
      } else if (
        params.type === "Deductions" ||
        (!params.type && this.activeTab === "deductions")
      ) {
        this.rowDeductionsData = this.rowDeductionsData.filter(
          (item: any) =>
            (item.id && item.id !== params.id) || item.code !== params.code
        );
        deleted = true;
      } else if (
        params.type === "Statutory" ||
        (!params.type && this.activeTab === "statutory")
      ) {
        this.rowStatutoryData = this.rowStatutoryData.filter(
          (item: any) =>
            (item.id && item.id !== params.id) || item.code !== params.code
        );
        deleted = true;
      } else if (
        params.type === "Category" ||
        (!params.type && this.activeTab === "category")
      ) {
        this.rowCategoryData = this.rowCategoryData.filter(
          (item: any) =>
            (item.id && item.id !== params.id) || item.code !== params.code
        );
        deleted = true;
      }

      if (!deleted) {
        getToastError("Could not find component to delete");
        return false;
      }

      // Refresh the grid
      if (this.gridApi) {
        this.gridApi.refreshCells();
      }

      return true;
    } catch (error) {
      getError(error);
      return false;
    }
  }

  removeFromDataArray(params: any) {
    // Remove from the appropriate data array based on the item's type
    if (params.type === "Earnings" || this.activeTab === "earnings") {
      this.rowEarningsData = this.rowEarningsData.filter(
        (item: any) => item.id !== params.id
      );
    } else if (
      params.type === "Deductions" ||
      this.activeTab === "deductions"
    ) {
      this.rowDeductionsData = this.rowDeductionsData.filter(
        (item: any) => item.id !== params.id
      );
    } else if (params.type === "Statutory" || this.activeTab === "statutory") {
      this.rowStatutoryData = this.rowStatutoryData.filter(
        (item: any) => item.id !== params.id
      );
    } else if (params.type === "Category" || this.activeTab === "category") {
      this.rowCategoryData = this.rowCategoryData.filter(
        (item: any) => item.id !== params.id
      );
    }

    // Refresh the grid
    if (this.gridApi) {
      this.gridApi.refreshCells();
    }
  }

  refreshDataAfterSave(data: any) {
    if (data.type === "Earnings") {
      this.rowEarningsData = [...this.rowEarningsData, data];
    } else if (data.type === "Deductions") {
      this.rowDeductionsData = [...this.rowDeductionsData, data];
    } else if (data.type === "Statutory") {
      this.rowStatutoryData = [...this.rowStatutoryData, data];
    } else if (data.type === "Category") {
      this.rowCategoryData = [...this.rowCategoryData, data];
    }

    if (this.gridApi) {
      this.gridApi.refreshCells();
    }
  }

  refreshDataAfterUpdate(data: any) {
    let updated = false;

    if (data.type === "Earnings") {
      const index = this.rowEarningsData.findIndex(
        (item: any) =>
          (item.id && item.id === data.id) || item.code === data.code
      );

      if (index !== -1) {
        this.rowEarningsData[index] = { ...data };
        updated = true;
      }
    } else if (data.type === "Deductions") {
      const index = this.rowDeductionsData.findIndex(
        (item: any) =>
          (item.id && item.id === data.id) || item.code === data.code
      );

      if (index !== -1) {
        this.rowDeductionsData[index] = { ...data };
        updated = true;
      }
    } else if (data.type === "Statutory") {
      const index = this.rowStatutoryData.findIndex(
        (item: any) =>
          (item.id && item.id === data.id) || item.code === data.code
      );

      if (index !== -1) {
        this.rowStatutoryData[index] = { ...data };
        updated = true;
      }
    } else if (data.type === "Category") {
      const index = this.rowCategoryData.findIndex(
        (item: any) =>
          (item.id && item.id === data.id) || item.code === data.code
      );

      if (index !== -1) {
        this.rowCategoryData[index] = { ...data };
        updated = true;
      }
    }

    if (!updated) {
      this.refreshDataAfterSave(data);
    }

    if (this.gridApi) {
      this.gridApi.refreshCells();
    }
  }

  prepareFormData(formData: any) {
    const result: any = { id: formData.id || null };
    if (this.activeTab === "earnings") {
      result.code = formData.earningsCode;
      result.name = formData.earningsName;
      result.description = formData.earningsDescription;
      result.category = formData.earningCategory;
      result.default_amount = formData.earningDefaultAmount;
      result.quantity = formData.earningQty;
      result.unit = formData.earningUnit;
      result.taxable = formData.earningTaxable === "YES";
      result.included_bpjs_health =
        formData.earningIncludedBpjsHealth === "YES";
      result.included_bpjs_employee =
        formData.earningIncludedBpjsEmplyoee === "YES";
      result.included_prorate = formData.earningIncludedProrate === "YES";
      result.show_in_payslip = formData.earningsShowInPayslip === "YES";
      result.active = formData.earningsStatus === "A";
      result.type = "Earnings";
    } else if (this.activeTab === "deductions") {
      result.code = formData.deductionsCode;
      result.name = formData.deductionsName;
      result.description = formData.deductionsDescription;
      result.category = formData.deductionsCategory;
      result.default_amount = formData.deductionsDefaultAmount;
      result.quantity = formData.deductionsQty;
      result.unit = formData.deductionsUnit;
      result.taxable = formData.deductionsTaxable === "YES";
      result.included_bpjs_health =
        formData.deductionsIncludedBpjsHealth === "YES";
      result.included_bpjs_employee =
        formData.deductionsIncludedBpjsEmplyoee === "YES";
      result.included_prorate = formData.deductionsIncludedProrate === "YES";
      result.show_in_payslip = formData.deductionsShowInPayslip === "YES";
      result.active = formData.deductionsStatus === "A";
      result.type = "Deductions";
    } else if (this.activeTab === "statutory") {
      result.code = formData.statutoryCode;
      result.name = formData.statutoryName;
      result.description = formData.statutoryDescription;
      result.type = formData.statutoryType;
      result.default_amount = formData.statutoryDefaultAmount;
      result.quantity = formData.statutoryQty;
      result.unit = formData.statutoryUnit;
      result.taxable = formData.statutoryTaxable === "YES";
      result.show_in_payslip = formData.statutoryShowInPayslip === "YES";
      result.active = formData.statutoryStatus === "A";
      result.type = "Statutory";
    } else if (this.activeTab === "category") {
      result.code = formData.categoryCode;
      result.name = formData.categoryName;
      result.description = formData.categoryDescription;
      result.type = formData.categoryType;
      result.active = formData.categoryStatus === "A";
      result.type = "Category";
    }

    return result;
  }

  populateForm(data: any) {
    this.inputFormElement.form = {};

    if (data.type === "Earnings" || !data.type) {
      this.inputFormElement.form = {
        earningsCode: data.code || "",
        earningsName: data.name || "",
        earningsDescription: data.description || "",
        earningCategory: data.category || "",
        earningDefaultAmount: data.default_amount || 0,
        earningQty: data.quantity || 1,
        earningUnit: data.unit || "",
        earningTaxable: data.taxable ? "YES" : "NO",
        earningIncludedBpjsHealth: data.included_bpjs_health ? "YES" : "NO",
        earningIncludedBpjsEmplyoee: data.included_bpjs_employee ? "YES" : "NO",
        earningIncludedProrate: data.included_prorate ? "YES" : "NO",
        earningsShowInPayslip: data.show_in_payslip ? "YES" : "NO",
        earningsStatus: data.active ? "A" : "I",
      };
    } else if (data.type === "Deductions") {
      this.inputFormElement.form = {
        deductionsCode: data.code || "",
        deductionsName: data.name || "",
        deductionsDescription: data.description || "",
        deductionsCategory: data.category || "",
        deductionsDefaultAmount: data.default_amount || 0,
        deductionsQty: data.quantity || 1,
        deductionsUnit: data.unit || "",
        deductionsTaxable: data.taxable ? "YES" : "NO",
        deductionsIncludedBpjsHealth: data.included_bpjs_health ? "YES" : "NO",
        deductionsIncludedBpjsEmplyoee: data.included_bpjs_employee
          ? "YES"
          : "NO",
        deductionsIncludedProrate: data.included_prorate ? "YES" : "NO",
        deductionsShowInPayslip: data.show_in_payslip ? "YES" : "NO",
        deductionsStatus: data.active ? "A" : "I",
      };
    } else if (data.type === "Statutory") {
      this.inputFormElement.form = {
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
    } else if (data.type === "Category") {
      this.inputFormElement.form = {
        categoryCode: data.code || "",
        categoryName: data.name || "",
        categoryDescription: data.description || "",
        categoryType: data.type || "",
        categoryStatus: data.active ? "A" : "I",
      };
    }

    this.inputFormElement.form.id = data.id;
  }

  // GETTER AND SETTER
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
  get diplayedData() {
    switch (this.activeTab) {
      case "earnings":
        return this.rowEarningsData;
      case "deductions":
        return this.rowDeductionsData;
      case "statutory":
        return this.rowStatutoryData;
      case "category":
        return this.rowCategoryData;
      default:
        return this.rowEarningsData;
    }
  }
}
