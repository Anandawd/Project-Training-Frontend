import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { AgGridVue } from "ag-grid-vue3";
import { formatDateDatabase, formatNumber } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
  handleRowRightClickedAgGrid,
} from "@/utils/general";
import { Skeleton } from "vue-loading-skeleton";
import Properties3 from "../properties3/properties3.vue";
import TransactionAPI from "@/services/api/transaction";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CInput,
    CModal,
    Skeleton,
    CDatepicker,
    AgGridVue,
    Properties3,
  },
  props: {
    breakdown1: {
      type: Number,
      require: true,
    },
    breakdown2: {
      type: Number,
      require: true,
    },
  },
})
export default class Properties2 extends Vue {
  public rowData: any = null;
  public form: any = {};
  gridOptions: any;
  columnDefs: any[] = null;
  context: any;
  frameworkComponents: { statusBarTotal: any; actionGrid: any };
  statusBar: {
    statusPanels: (
      | { statusPanel: string; align: string }
      | { statusPanel: string; align?: undefined }
    )[];
  };
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  bottomRowTotal: any;
  total: any;
  gridApi: any;
  paramsData: any;
  breakdown1: number;
  breakdown2: number;
  showProperties3: boolean = false;

  beforeMount() {
    this.gridOptions = {
      actionGrid: {
        menu: true,
      },
      suppressCopyRowsToClipboard: true,
      ...this.$global.agGrid.defaultGridOptions,
      rowGroupPanelShow: "none",
    };
    // ------------------need setting manual for column table-----------------//
    this.columnDefs = [
      {
        headerName: this.$t("transaction.table.subDepartment"),
        field: "SubDepartment",
        textTotal: this.$t("commons.table.total"),
        width: 120,
      },
      {
        headerName: this.$t("transaction.table.account"),
        field: "Account",
        width: 120,
      },
      {
        headerName: this.$t("transaction.table.debit"),
        field: "DebitAmount",
        width: 100,
        sumTotal: true,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.credit"),
        field: "CreditAmount",
        width: 100,
        sumTotal: true,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.currency"),
        field: "default_currency_code",
        width: 100,
      },
      {
        headerName: this.$t("transaction.table.debitForeign"),
        field: "DebitAmountForeign",
        width: 100,
        sumTotal: true,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.creditForeign"),
        field: "CreditAmountForeign",
        width: 105,
        sumTotal: true,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.currencyForeign"),
        field: "currency_code",
        width: 80,
      },
      {
        headerName: this.$t("transaction.table.exchangeRate"),
        field: "exchange_rate",
        width: 80,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "left" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.$global.agGrid.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.getPropertiesData();
  }

  onGridReady() {
    this.bottomRowTotal = this.total;
  }

  onPageSizeChanged(newPageSize: number) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    //TODO add access
    const result: any = [
      {
        disabled: !this.paramsData,
        name: this.$t("commons.contextMenu.properties"),
        icon: generateIconContextMenuAgGrid("properties_icon24"),
        action: () => this.handleProperties(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.close"),
        icon: generateIconContextMenuAgGrid("close_icon24"),
        action: () => {
          this.$emit("close");
        },
      },
    ];
    return result;
  }

  handleUpdateType(paramsData: any, arg1: number) {
    throw new Error("Method not implemented.");
  }

  handleProperties(paramsData: any) {
    this.showProperties3 = true;
  }

  handleRowRightClicked() {
    handleRowRightClickedAgGrid(this.paramsData, this, "id");
  }

  //API CALL================================================================================================
  async getPropertiesData() {
    try {
      const { data } = await transactionAPI.getProperties2(
        this.breakdown1,
        this.breakdown2
      );
      this.rowData = data.breakdown_detail;
      this.form = data.transaction_detail;
      this.form.audit_date = formatDateDatabase(this.form.audit_date);
    } catch (error) {
      getError(error);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }
  //END API CALL================================================================================================

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
