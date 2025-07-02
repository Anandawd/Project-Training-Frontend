import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import PayrollComponentsAPI from "@/services/api/payroll/payroll-components/payroll-component";
import {
  formatDate,
  formatDateTime2,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./tax-component-input-form/tax-component-input-form.vue";

const payrollComponentsAPI = new PayrollComponentsAPI();
const organizationAPI = new OrganizationAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CSelect,
    CInput,
    CInputForm,
  },
})
export default class ShiftConfigurations extends Vue {
  // Data
  public rowData: any[] = [];
  public deleteParam: any;
  public isSaving: boolean = false;

  // options data
  public typeOptions: any = [];
  public categoryOptions: any = [];
  public placementOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // Dialog
  public showDialog = false;
  public dialogMessage = "";
  public dialogAction = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

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
  mounted(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.updatedBy"), value: 2 },
      {
        text: this.$t("commons.filter.createdBy"),
        value: 3,
      },
    ];
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
        cellClass: "action-grid-buttons",
        field: "id",
        width: 100,
        enableRowGroup: false,
        resizeable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
      },
      {
        headerName: this.$t("commons.table.payroll.employee.code"),
        field: "code",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.name"),
        field: "name",
        width: 200,
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
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.category"),
        field: "tax_category",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.rate"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "rate",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.minAmount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "min_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.maxAmount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "max_amount",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.formula"),
        field: "formula",
        width: 150,
        enableRowGroup: false,
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
        headerName: this.$t("commons.table.payroll.payroll.showInPayslip"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "show_in_payslip",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.active"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: true,
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
        enableRowGroup: true,
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
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
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
        this.loadEditData(params.id);
      }
    });
    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleInsert() {
    this.handleShowForm("", $global.modeData.insert);
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t("messages.payroll.confirm.deleteTaxComponent");
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await payrollComponentsAPI.GetTaxComponentList(params);
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }
      this.loadDropdown();
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

        payrollComponentsAPI.GetTaxTypeList().then((response) => {
          this.typeOptions = response.data;
        }),

        payrollComponentsAPI.GetTaxCategoryList().then((response) => {
          this.categoryOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(id: any) {
    try {
      const { data } = await payrollComponentsAPI.GetTaxComponent(id);
      if (data) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(data);
        });
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } = await payrollComponentsAPI.InsertTaxComponent(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.payroll.success.saveTaxComponent"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
      if (status2.status == 7) {
        getToastSuccess(this.$t("messages.payroll.error.saveTaxComponent"));
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } = await payrollComponentsAPI.UpdateTaxComponent(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.payroll.success.updateTaxComponent"));
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
      this.isSaving = true;
      const { status2 } = await payrollComponentsAPI.DeleteTaxComponent(
        this.deleteParam
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.payroll.success.deleteTaxComponent"));
        this.loadDataGrid(this.searchDefault);
        this.deleteParam = null;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      code: params.code,
      name: params.name,
      description: params.description,
      type: params.type,
      tax_category: params.tax_category,
      rate: parseFloat(params.rate),
      min_amount: parseFloat(params.min_amount),
      max_amount: parseFloat(params.max_amount),
      effective_date: formatDateTimeUTC(params.effective_date),
      end_date: formatDateTimeUTC(params.end_date),
      formula: params.formula,
      show_in_payslip: parseInt(params.show_in_payslip),
      active: parseInt(params.active),

      created_at: formatDateTimeUTC(params.created_at),
      created_by: params.code,
      updated_at: formatDateTimeUTC(params.updated_at),
      updated_by: params.code,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      code: params.code,
      name: params.name,
      description: params.description,
      type: params.type,
      tax_category: params.tax_category,
      rate: params.rate,
      min_amount: params.min_amount,
      max_amount: params.max_amount,
      effective_date: params.effective_date,
      end_date: params.end_date,
      formula: params.formula,
      show_in_payslip: parseInt(params.show_in_payslip),
      active: parseInt(params.active),

      created_at: params.code,
      created_by: params.code,
      updated_at: params.code,
      updated_by: params.code,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
