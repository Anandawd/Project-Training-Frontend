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
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import MultiForm from "./components/multi-form/multi-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import MultiUom from "./components/multi-uom/multi-uom.vue";
import DetailCellRender from "./components/detail-cell-renderer/detail-cell-renderer.vue";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Item");

@Options({
  components: {
    MultiUom,
    CDialog,
    MultiForm,
    Select,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
    CRadio,
  },
})
export default class Item extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public dataCode: string;
  public multiFormElement: any = ref();
  public multiUomElement: any = ref();
  public showForm: boolean = false;
  public showFormMultiUom: boolean = false;
  public showDialog: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public activity: boolean = true;
  public cellSelected: any;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
    filter: [],
  };
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
            this.$global.tableName.invCfgInitItem,
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

  onSelectedData(paramsData: any) {
    this.$emit("selected", paramsData);
  }

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  resetData() {
    this.form = {
      purchase_price: 0,
      sell_price: 0,
      stock_maximum: 0,
      stock_minimum: 0,
    };
  }

  async handleActivity() {
    let loader = this.$loading.show();
    if (this.cellSelected != undefined || this.cellSelected != null) {
      let params = {
        item_code: this.cellSelected.code,
        is_active: this.activity,
      };
      await this.approveInventoryItem(params);
    }
    loader.hide();
  }
  activityHandler() {
    if (this.cellSelected.is_active == 1) {
      this.activity = false;
    } else {
      this.activity = true;
    }
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.multiFormElement.initialize();
    this.modeData = mode;
    this.multiUomElement.showForm = false;
    this.showForm = true;
    // set focus
    this.multiFormElement.focus = true;
    this.multiUomElement.focus = false;
  }

  handleInsertDetail1(paramsData: any) {
    this.showForm = false;
    this.multiUomElement.code = paramsData.code;
    this.multiUomElement.handleShowForm("", $global.modeData.insert);
    // set focus
    this.multiFormElement.focus = false;
    this.multiUomElement.focus = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.multiUomElement.showForm = false;
    this.modeData = $global.modeData.edit;
    await this.editData(params.code);
  }

  async handleEditUom(params: any) {
    let loader = this.$loading.show();
    this.showForm = false;
    this.modeData = $global.modeData.edit;
    this.multiUomElement.handleEdit(params);
    loader.hide();
  }

  async handleDuplicate(params: any) {
    let loader = this.$loading.show();
    this.multiUomElement.showForm = false;
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.code);
    loader.hide();
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    formData.is_active = parseInt(formData.is_active);
    formData.purchase_price = parseFloat(formData.purchase_price);
    formData.sell_price = parseFloat(formData.sell_price);
    formData.stock_maximum = parseFloat(formData.stock_maximum);
    formData.stock_minimum = parseFloat(formData.stock_minimum);
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    }
    this.isSaving = false;
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
        Option1: search.filter[0],
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
    try {
      this.loadDropdown();
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.multiFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.dataCode = data.code;
      this.multiFormElement.onEdit(data);
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      formData.code = this.dataCode;
      // formData.is_system = false
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
    formData.is_active = 1;
    try {
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
      const params = ["ItemCategory", "UOM"];
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

  async approveInventoryItem(data: any) {
    try {
      const { status2 } = await resourceAPI.ActivateDeactivateItemInventory(
        data
      );
      if (status2.status == 0) {
        this.loadData();
        getToastSuccess(this.$t("messages.successTitle"));
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
      filter: ["1"],
    };

    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.category"), value: 2 },
      { text: this.$t("commons.filter.uom"), value: 3 },
      { text: this.$t("commons.filter.barcode"), value: 4 },
      { text: this.$t("commons.filter.remark"), value: 5 },
      { text: this.$t("commons.filter.createdBy"), value: 6 },
      { text: this.$t("commons.filter.updatedBy"), value: 7 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
        insertDetail1: {
          title: "Insert Multi UOM",
        },
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      onCellClicked: (params: any) => {
        this.cellSelected = params.data;
        this.activityHandler();
        this.onSelectedData(params.data);
      },
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
        width: 140,
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
      { headerName: this.$t("commons.table.name"), field: "name", width: 100 },
      {
        headerName: this.$t("commons.table.category"),
        field: "CategoryName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.uom"),
        field: "UOMName",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.purchasePrice"),
        field: "purchase_price",
        width: 120,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.sellPrice"),
        field: "sell_price",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.barcode"),
        field: "barcode",
        width: 70,
      },
      {
        headerName: this.$t("commons.table.stockMinimum"),
        field: "stock_minimum",
        width: 90,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.stockMaximum"),
        field: "stock_maximum",
        width: 90,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 60,
        cellRenderer: "checklistRenderer",
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
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
      // { headerName: this.$t('commons.table.lastUpdate'), field: 'updated_by', width: 110 },
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
    return this.showForm || this.multiUomElement.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required()
        .max(20),
      Name: Yup.string().required().max(100),
      Category: Yup.string().required(),
      "Basic UOM": Yup.string().required(),
      "Purchase Price": Yup.number(),
      "Sell Price": Yup.number(),
      "Stock Minimum": Yup.number(),
      "Stock Maximum": Yup.number(),
      // "Stock Minimum": Yup.number().test((val) => {
      //   return val >= 0 && val <= this.form.stock_maximum;
      // }),
      // "Stock Maximum": Yup.number().test((val) => {
      //   return val >= 0 && val >= this.form.stock_minimum;
      // }),
    });
  }

  // END GETTER AND SETTER ===========================================================
}
