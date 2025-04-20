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
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import InputForm from "../components/input-form/input-form.vue";
import BarcodeForm from "./component/barcode-form/barcode-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess, getToastInfo } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CRadio from "@/components/radio/radio.vue";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Product");

@Options({
  components: {
    CDialog,
    InputForm,
    BarcodeForm,
    CSelect,
    CRadio,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class Product extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public inputFormElement: any = ref();
  public barcodeFormElement: any = ref();
  public showForm: boolean = false;
  public showBarcodeForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public cellSelected: any;
  public emptyString: any = "";
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
    filter: [0],
  };
  listDropdown: any = {
    Outlet: [],
  };
  searchOptions: any = [];
  isSaving: boolean = false;
  isLoading: boolean = false;
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
            this.$global.tableName.posCfgInitProduct,
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

  resetData() {
    this.form = {
      price: 0,
      estimation_cost: 0,
      buy: 1,
      free: 0,
      discount: 0,
      is_active: 1,
      is_for_iptv: 0,
      is_using_spa_room: 0,
    };
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.resetData();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
    this.showBarcodeForm = false;
  }

  async handleShowFormBarcode(params: any) {
    // this.modeData = $global.modeData.edit;
    // await this.editData(params.code);
    this.resetData();
    this.barcodeFormElement.initialize();
    this.showBarcodeForm = true;
    this.showForm = false;
  }

  onEnter() {
    // this.handleSave(this.form)
    this.form.msg = "hellooooooooooooooo";
  }

  dataFormatForUpdateCell() {
    this.form = {
      PackageName: "",
      TenanName: "",
      TaxAndServiceName: "",
      PrinterName2: "",
      estimation_cost: this.cellSelected,
      discount: this.cellSelected,
    };
  }

  cellValueChanged(event: any) {
    event.data.is_for_iptv = parseInt(event.data.is_for_iptv);
    event.data.is_active = parseInt(event.data.is_active);
    event.data.is_using_spa_room = parseInt(event.data.is_using_spa_room);
    event.data.discount = parseFloat(event.data.discount);
    event.data.estimation_cost = parseFloat(event.data.estimation_cost);
    event.data.price = parseFloat(event.data.price);
    event.data.PackageName = event.data.PackageName ?? this.emptyString;
    event.data.PrinterName = event.data.PrinterName ?? this.emptyString;
    event.data.PrinterName2 = event.data.PrinterName2 ?? this.emptyString;
    event.data.TaxAndServiceName =
      event.data.TaxAndServiceName ?? this.emptyString;
    event.data.TenanName = event.data.TenanName ?? this.emptyString;

    this.updateBarcode(event.data);
  }

  handleDelete(params: any) {
    if (params.category_code === "[SPECIAL]") {
      getToastInfo(this.$t("messages.cantDeleteSpecialProduct"));
    } else {
      this.showDialog = true;
      this.deleteCode = params.code;
    }
  }

  async handleEdit(params: any) {
    if (params.category_code === "[SPECIAL]") {
      getToastInfo(this.$t("messages.cantUpdateSpecialProduct"));
    } else {
      this.loadDropdown();
      this.modeData = $global.modeData.edit;
      await this.editData(params.code);
    }
  }
  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.code);
  }

  async handleSave(formData: any) {
    formData.is_for_iptv = parseInt(this.form.is_for_iptv);
    formData.is_active = parseInt(this.form.is_active);
    formData.is_using_spa_room = parseInt(this.form.is_using_spa_room);
    formData.disable_discount = parseInt(this.form.disable_discount);
    formData.discount = parseFloat(this.form.discount);
    formData.estimation_cost = parseFloat(this.form.estimation_cost);
    formData.price = parseFloat(this.form.price);
    this.isSaving = true;
    if (
      this.modeData == $global.modeData.insert ||
      this.modeData == $global.modeData.duplicate
    ) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    }
    this.isSaving = false;
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
        String1: search.filter[0],
        Option1: search.filter[1],
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
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.inputFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.inputFormElement.form = data;
      // if(this.modeData = $global.modeData.edit){
      //   this.showForm = true;
      //   this.showBarcodeForm = false;
      // }else{
      //   this.showForm = false;
      //   this.showBarcodeForm = true;
      // }
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
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

  async updateBarcode(formData: any) {
    try {
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
        "Outlet",
        "Tenan",
        "TaxAndService",
        "Package",
        "Printer",
        "ProductCategory",
        "ProductGroup",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.inputFormElement.listDropdown.global = data;
      this.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    this.isLoading = true;
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
    this.isLoading = false;
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      index: 2,
      text: "",
      filter: ["", "1"],
    };

    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.barcode"), value: 1 },
      { text: this.$t("commons.filter.name"), value: 2 },
      { text: this.$t("commons.filter.category"), value: 3 },
      { text: this.$t("commons.filter.description"), value: 4 },
      { text: this.$t("commons.filter.group"), value: 5 },
      { text: this.$t("commons.filter.outletCode"), value: 6 },
      { text: this.$t("commons.filter.taxAndService"), value: 7 },
      { text: this.$t("commons.filter.tenan"), value: 8 },
      { text: this.$t("commons.filter.package"), value: 9 },
      { text: this.$t("commons.filter.printer"), value: 10 },
      { text: this.$t("commons.filter.printer2"), value: 11 },
      { text: this.$t("commons.filter.createdBy"), value: 12 },
      { text: this.$t("commons.filter.updatedBy"), value: 13 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      onCellClicked: (params: any) => {
        this.cellSelected = params.data;
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
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      { headerName: this.$t("commons.table.code"), field: "code", width: 80 },
      {
        headerName: this.$t("commons.table.barcode"),
        field: "barcode",
        width: 100,
        editable: true,
      },
      { headerName: this.$t("commons.table.name"), field: "name", width: 150 },
      {
        headerName: this.$t("commons.table.category"),
        field: "category_code",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.description"),
        field: "description",
        width: 180,
      },
      {
        headerName: this.$t("commons.table.group"),
        field: "GroupName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.outletCode"),
        field: "outlet_code",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.tenan"),
        field: "TenanName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.package"),
        field: "PackageName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.printer"),
        field: "PrinterName",
        width: 190,
      },
      {
        headerName: this.$t("commons.table.printer2"),
        field: "PrinterName2",
        width: 190,
      },
      {
        headerName: this.$t("commons.table.taxAndService"),
        field: "TaxAndServiceName",
        width: 260,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "price",
        width: 80,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.disableDiscount"),
        field: "disable_discount",
        width: 100,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.discount"),
        field: "discount",
        width: 80,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.estimationCost"),
        field: "estimation_cost",
        width: 120,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.buy"),
        field: "buy",
        width: 60,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.free"),
        field: "free",
        width: 60,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.ipTv"),
        field: "is_for_iptv",
        width: 80,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.imageLink"),
        field: "image_link",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 80,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.usingSpaRoom"),
        field: "is_using_spa_room",
        width: 120,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
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
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: Checklist,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadData(this.searchDefault);
    this.loadDropdown();
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required().max(100),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required()
        .max(10),
      Category: Yup.string().required(),
      Group: Yup.string().required(),
      Outlet: Yup.string().required(),
      Price: Yup.number(),
      discount: Yup.number(),
      "Estimation Cost": Yup.number(),
      Buy: Yup.number().test((val) => {
        return val > 0;
      }),
      Free: Yup.number(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
