import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import Select from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import MultiForm from "./components/multi-form/multi-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime } from "@/utils/format";
import OtherCogs from "./components/other-cogs/other-cogs.vue";
import OtherCogs2 from "./components/other-cogs2/other-cogs2.vue";
import OtherExpense from "./components/other-expense/other-expense.vue";
import * as Yup from "yup";
import DetailCellRender from "./components/detail-cell-renderer/detail-cell-renderer.vue";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("ItemCategory");

@Options({
  components: {
    CDialog,
    OtherCogs,
    OtherCogs2,
    OtherExpense,
    MultiForm,
    Select,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class ItemCategory extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public multiFormElement: any = ref();
  otherCogsFormElement: any = ref();
  otherCogs2FormElement: any = ref();
  otherExpenseFormElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public hideButtons: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  searchDefault: {
    index: number;
    text: string;
  } = null;
  searchOptions: any = [];
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  gridOptions: any = {};
  detailCellRenderer: any;
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
  folioNumber: any;
  global: any;
  isSaving: boolean = false;
  // GENERAL FUNCTION ================================================================

  onGridReady() {
    //
  }

  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  // ------------------------additional for context menu ag-Grid-----------//

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
        action: () => this.handleShowForm("", $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.invCfgInitItemCategory,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
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

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  resetData() {}

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.multiFormElement.initialize();
    this.modeData = mode;
    this.otherCogsFormElement.showForm = false;
    this.otherCogs2FormElement.showForm = false;
    this.otherExpenseFormElement.showForm = false;
    this.showForm = true;
    this.hideButtons = true;
  }

  handleInsertDetail1(paramsData: any) {
    this.showForm = false;
    this.otherCogs2FormElement.showForm = false;
    this.otherExpenseFormElement.showForm = false;
    this.otherCogsFormElement.code = paramsData.code;
    this.hideButtons = true;
    this.otherCogsFormElement.handleShowForm("", $global.modeData.insert);
  }

  handleInsertDetail2(paramsData: any) {
    this.hideButtons = true;
    this.showForm = false;
    this.otherCogsFormElement.showForm = false;
    this.otherExpenseFormElement.showForm = false;
    this.otherCogs2FormElement.code = paramsData.code;
    this.otherCogs2FormElement.handleShowForm("", $global.modeData.insert);
  }

  handleInsertDetail3(paramsData: any) {
    this.hideButtons = true;
    this.showForm = false;
    this.otherCogsFormElement.showForm = false;
    this.otherCogs2FormElement.showForm = false;
    this.otherExpenseFormElement.code = paramsData.code;
    this.otherExpenseFormElement.handleShowForm("", $global.modeData.insert);
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.hideButtons = true;
    this.otherCogsFormElement.showForm = false;
    this.otherCogs2FormElement.showForm = false;
    this.otherExpenseFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    await this.$nextTick(() => {
      this.loadDropdown();
      this.editData(params.code);
    });
  }

  async handleEditOtherCogs(params: any) {
    this.hideButtons = true;
    this.showForm = false;
    this.otherCogs2FormElement.showForm = false;
    this.otherExpenseFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.otherCogsFormElement.handleEdit(params);
  }

  async handleEditOtherCogs2(params: any) {
    this.hideButtons = true;
    this.otherCogsFormElement.showForm = false;
    this.showForm = false;
    this.otherExpenseFormElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.otherCogs2FormElement.handleEdit(params);
  }

  async handleEditOtherExpense(params: any) {
    this.hideButtons = true;
    this.otherCogsFormElement.showForm = false;
    this.otherCogs2FormElement.showForm = false;
    this.showForm = false;
    this.modeData = $global.modeData.edit;
    this.otherExpenseFormElement.handleEdit(params);
  }

  async handleDuplicate(params: any) {
    this.hideButtons = true;
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.$nextTick(() => {
      this.editData(params.code);
    });
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    }
    this.isSaving = false;
  }

  onClose() {
    this.showForm = false;
    this.hideButtons = false;
  }

  onSaveData() {
    this.loadData();
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    const selectedRow = this.gridApi.getSelectedRows();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    this.gridApi.showLoadingOverlay();
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async editData(code: any) {
    let loader = this.$loading.show();
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.multiFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.form.code = data.code;
      // this.multiFormElement.form = data;
      this.multiFormElement.onEdit(data);
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
    loader.hide();
  }

  async updateData(formData: any) {
    try {
      formData.code = this.form.code;
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      // formData.id_sort = parseInt(formData.id_sort)
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const params = [
        "Account",
        "JournalAccount",
        "JournalAccountExpense",
        "JournalAccountIncome",
        "JournalAccountCosting",
        "JournalAccountInventory",
        "ItemGroup",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.multiFormElement.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      index: 1,
      text: "",
    };
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.group"), value: 2 },
      { text: this.$t("commons.filter.inventoryAccount"), value: 3 },
      { text: this.$t("commons.filter.cogsAccount"), value: 4 },
      { text: this.$t("commons.filter.cogs2Account"), value: 5 },
      { text: this.$t("commons.filter.expenseAccount"), value: 6 },
      { text: this.$t("commons.filter.sellAccount"), value: 7 },
      { text: this.$t("commons.filter.adjustmentAccount"), value: 8 },
      { text: this.$t("commons.filter.spoilAccount"), value: 9 },
      { text: this.$t("commons.filter.createdBy"), value: 10 },
      { text: this.$t("commons.filter.updatedBy"), value: 11 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
        insertDetail1: {
          title: "Insert Other COGS",
        },
        insertDetail2: {
          title: "Insert Other COGS2",
        },
        insertDetail3: {
          title: "Insert Other Expense",
        },
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 200,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.code"),
        field: "code",
        width: 120,
        cellRenderer: "agGroupCellRenderer",
      },
      { headerName: this.$t("commons.table.name"), field: "name", width: 140 },
      {
        headerName: this.$t("commons.table.itemGroupName"),
        field: "ItemGroupName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.inventoryAccount"),
        field: "AccountInventory",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.cogsAccount"),
        field: "AccountCOGS",
        width: 240,
      },
      {
        headerName: this.$t("commons.table.cogs2Account"),
        field: "AccountCOGS2",
        width: 240,
      },
      {
        headerName: this.$t("commons.table.expenseAccount"),
        field: "AccountExpense",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.accountSell"),
        field: "AccountSell",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.adjustmentAccount"),
        field: "AccountAdjustment",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.accountSpoil"),
        field: "AccountSpoil",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
      detailCellRenderer: DetailCellRender,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required(),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required(),
      Group: Yup.string().required(),
      "Inventory Account": Yup.string().required(),
      "Adjustment Account": Yup.string().required(),
      "Cogs Account": Yup.string().required(),
      "Cogs Account 2": Yup.string().required(),
      "Expense Account": Yup.string().required(),
      "Sell Account": Yup.string().required(),
      "Spoil Account": Yup.string().required(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
