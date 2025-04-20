import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import ReceivingAPI from "@/services/api/assets/receive-stock/receive-stock";

import { formatDateTime, formatDate } from "@/utils/format";
const receivingAPI = new ReceivingAPI();

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
        headerName: this.$t("commons.table.receiveId"),
        field: "id",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.store"),
        field: "StoreName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.item"),
        field: "ItemName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.poQuantity"),
        field: "po_quantity",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "receive_quantity",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.uom"),
        field: "UOMName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "receive_price",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.stock"),
        field: "quantity",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.discount"),
        field: "discount",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.tax"),
        field: "tax",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.shipping"),
        field: "shipping",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.totalPrice"),
        field: "total_price",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.expire"),
        field: "expire_date",
        width: 130,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.lastUpdate"),
        field: "updated_by",
        width: 130,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
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
      const { data } = await receivingAPI.GetReceivingDetailList(params);
      this.rowData = data;
      // console.log(params);
    } catch (error) {
      getError(error);
    }
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
}
