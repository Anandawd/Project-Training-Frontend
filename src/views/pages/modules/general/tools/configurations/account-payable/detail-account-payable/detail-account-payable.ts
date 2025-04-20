import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import AccountPayableAPI from "@/services/api/accounting/account-payable/account-payable";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";

const accountPayableAPI = new AccountPayableAPI();

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
        headerName: this.$t("commons.table.action"),
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.date"),
        field: "date",
        width: 130,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.refNumber"),
        field: "date",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        width: 130,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "account",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.apCreateNumber"),
        field: "account",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
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
    //  console.log(this.detail);
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
      const { data } = await accountPayableAPI.GetAPARDetailList(params);
      this.rowData = data;
      console.log(data);
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
