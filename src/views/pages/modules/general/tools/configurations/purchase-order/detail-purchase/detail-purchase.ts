import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { getError, generateTotalFooterAgGrid } from "@/utils/general";
import $global from "@/utils/global";
import PurchaseOrderAPI from "@/services/api/assets/purchase-order/purchase-order";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
  formatDateTimeZeroUTC,
} from "@/utils/format";
const purchaseOrderAPI = new PurchaseOrderAPI();

@Options({
  components: {
    AgGridVue,
  },
})
export default class Payment extends Vue {
  public resourceAPI: any;
  public rowData: any = [];
  public detail: any;
  public params: any;
  public code: string;
  public options: any = {};
  searchOptions: any = {};
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

  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.store"),
        field: "Store",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.item"),
        field: "Item",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
        width: 130,
      },
      {
        headerName: this.$t("commons.table.uom"),
        field: "Uom",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "price",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        width: 130,
      },
      {
        headerName: this.$t("commons.table.totalPrice"),
        field: "TotalPrice",
        width: 130,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.received"),
        field: "quantity_received",
        width: 130,
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.notYetReceived"),
        field: "quantity_not_received",
        width: 130,
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.quantityClosed"),
        field: "quantity_closed",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.lastUpdate"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      statusBarTotalRenderer: StatusBarTotalRenderer,
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.detail = this.params.data.number;
    console.log(this.detail);

    this.loadDetailData(this.detail);
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }

  onGridReady() {
    //
  }

  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  // ------------------------additional for context menu ag-Grid-----------//

  async loadDetailData(params: any) {
    try {
      const { data } = await purchaseOrderAPI.GetPurchaseOrderDetailList(
        params
      );
      this.rowData = data;
      // console.log(params);
    } catch (error) {
      getError(error);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
