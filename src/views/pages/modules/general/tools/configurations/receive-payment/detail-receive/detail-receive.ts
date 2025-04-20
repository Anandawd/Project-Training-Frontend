import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { getError, generateTotalFooterAgGrid } from "@/utils/general";
import $global from "@/utils/global";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import ReceiveAPI from "@/services/api/accounting/receive-payment/receive";
import PaymentAPI from "@/services/api/accounting/receive-payment/payment";

import { formatDateTime, formatNumber } from "@/utils/format";
const receiveAPI = new ReceiveAPI();
const paymentAPI = new PaymentAPI();

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
        headerName: this.$t("commons.table.subDepartment"),
        field: "SubDepartment",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.credit"),
        field: "Credit",
        width: 150,
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.debit"),
        field: "Debit",
        width: 150,
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 150,
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
    this.resourceAPI = this.$route.meta.isPayment ? paymentAPI : receiveAPI;
    this.detail = this.params.data.ref_number;
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
      const { data } = await this.resourceAPI.GetReceivePaymentDetailList(
        params
      );
      this.rowData = data;
      console.log(data);
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
