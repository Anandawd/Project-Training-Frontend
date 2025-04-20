import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";

import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CSelect from "@/components/select/select.vue";
import { Form } from "vee-validate";
import {
  generateTotalFooterAgGrid,
  getError,
  printPreview,
} from "@/utils/general";
import SearchFilter from "../filter/filter.vue";
import $global from "@/utils/global";
import { formatNumber, formatDate, formatDateTimeUTC } from "@/utils/format";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import StoreStockAPI from "../../../../services/api/assets/store-stock";
import AllStoreStockAPI from "../../../../services/api/assets/all-store-stock";
import Modal from "@/components/modal/modal.vue";
const storeStockAPI = new StoreStockAPI();
const allStoreStockAPI = new AllStoreStockAPI();

@Options({
  components: {
    Form,
    CSelect,
    AgGridVue,
    SearchFilter,
    Modal,
  },
  emits: ["close"],
  props: {
    formType: {
      type: String,
      default: "",
      require: true,
    },
  },
})
export default class StockCard extends Vue {
  public rowData: any = [];
  public searchOptions: any;
  public formType: any;
  public filterComboList: any = [];
  public storeCode: string;
  public itemCode: string;
  public storeName: string;
  public itemName: string;
  public dataFilter: any = {};
  searchDefault: any = {
    index: 1,
    text: "",
    start_date: "",
    end_date: "",
    filter: ["", ""],
  };
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
  totalPayment: number;

  // GENERAL FUNCTION ================================================================
  onClose() {
    this.$emit("close");
  }

  async refreshData(search: any) {
    this.rowData = [];
    await this.loadStoreStockCard(search);
  }

  handlePrintStoreStock() {
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.StoreStockCard}&param=${this.dataFilter.Index}&param2=${this.dataFilter.Text}&param3=${this.dataFilter.StoreCode}&param4=${this.dataFilter.ItemCode}&param5=${this.dataFilter.StartDate}&param6=${this.dataFilter.EndDate}&param7=${this.storeName}&param8=${this.itemName}&template=${$global.stimulsoftReportFileDirectory.storeStockCard}`
    );
    printPreview(newTabReport.href);
  }

  handlePrintAllStoreStock() {
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.AllStoreStockCard}&param=${this.dataFilter.Index}&param2=${this.dataFilter.Text}&param3=${this.dataFilter.ItemCode}&param4=${this.dataFilter.StartDate}&param5=${this.dataFilter.EndDate}&param6=${this.itemName}&template=${$global.stimulsoftReportFileDirectory.allStoreStockCard}`
    );
    printPreview(newTabReport.href);
  }

  async getStoreStockCard(search: any) {
    this.rowData = [];
    this.searchDefault.filter[0] = search.filter[1];
    this.searchDefault.filter[1] = search.filter[2];
    await this.loadStoreStockCard(this.searchDefault);
  }

  getStoreItemName(Storecode: any, ItemCode: any) {
    for (const i in this.filterComboList.Store) {
      if (Storecode == this.filterComboList.Store[i].code) {
        this.storeName = this.filterComboList.Store[i].name;
      }
    }

    for (const i in this.filterComboList.Item) {
      if (ItemCode == this.filterComboList.Item[i].code) {
        this.itemName = this.filterComboList.Item[i].name;
      }
    }
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadStoreStockCard(search: any) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        StoreCode: search.filter[0],
        StartDate: formatDateTimeUTC(search.start_date),
        EndDate: formatDateTimeUTC(search.end_date),
        ItemCode: search.filter[1],
      };

      this.getStoreItemName(params.StoreCode, params.ItemCode);
      this.dataFilter = params;

      if (this.formType === $global.formType.storeStock) {
        const { data } = await storeStockAPI.GetStoreStockCardList(params);
        this.rowData = data;
      }
      if (this.formType === $global.formType.allStoreStock) {
        const { data } = await allStoreStockAPI.GetAllStoreStockCardList(
          params
        );
        this.rowData = data;
      }
    } catch (error) {
      getError(error);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  async loadComboList() {
    try {
      const { data } = await storeStockAPI.GetStoreStockComboList();
      this.filterComboList = data;
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    if (this.formType == $global.formType.storeStock) {
      this.searchOptions = [
        { text: this.$t("commons.filter.number"), value: 0 },
        { text: this.$t("commons.filter.supplier"), value: 1 },
        { text: this.$t("commons.filter.uom"), value: 2 },
        { text: this.$t("commons.filter.receiveId"), value: 3 },
      ];
    }
    if (this.formType == $global.formType.allStoreStock) {
      this.searchOptions = [
        { text: this.$t("commons.filter.store"), value: 0 },
        { text: this.$t("commons.filter.number"), value: 1 },
        { text: this.$t("commons.filter.supplier"), value: 2 },
        { text: this.$t("commons.filter.uom"), value: 3 },
        { text: this.$t("commons.filter.receiveId"), value: 4 },
      ];
    }
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.date"),
        field: "PostingDate",
        width: 120,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        textTotal: this.$t("commons.total"),
      },
      {
        headerName: this.$t("commons.table.number"),
        field: "Number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.supplier"),
        field: "Supplier",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.store"),
        field: "Store",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "Remark",
        width: 150,
      },
      { headerName: this.$t("commons.table.uom"), field: "UOM", width: 150 },
      {
        headerName: this.$t("commons.table.receiveId"),
        field: "ReceiveID",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.receiveQty"),
        field: "ReceiveQty",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.costingQty"),
        field: "CostingQty",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.transInQty"),
        field: "TransferInQty",
        hide: this.formType === $global.formType.allStoreStock ? true : false,
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.transOutQty"),
        field: "TransferOutQty",
        hide: this.formType === $global.formType.allStoreStock ? true : false,
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.balanceQty"),
        field: "BalanceQty",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.receivePrice"),
        field: "ReceivePrice",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.costingPrice"),
        field: "CostingPrice",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.transInPrice"),
        field: "TransferInPrice",
        hide: this.formType === $global.formType.allStoreStock ? true : false,
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.transOutPrice"),
        field: "TransferOutPrice",
        hide: this.formType === $global.formType.allStoreStock ? true : false,
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.balancePrice"),
        field: "BalancePrice",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.requestBy"),
        field: "request_by",
        width: 150,
      },
    ];

    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
      statusBarTotalRenderer: StatusBarTotalRenderer,
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
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadComboList();
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
  }

  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================
  get pinnedBottomRowData() {
    if (this.rowData != null) {
      return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
    }
  }

  get titleStoreStockCard() {
    return `${this.$t("title.storeStockCard")}`;
  }

  get titleAllStoreStockCard() {
    return `${this.$t("title.allStoreStockCard")}`;
  }

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
