import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { AgGridVue } from "ag-grid-vue3";
import { formatDateDatabase, formatNumber } from "@/utils/format";
import { getToastSuccess } from "@/utils/toast";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
  handleRowRightClickedAgGrid,
} from "@/utils/general";
import CDialog from "@/components/dialog/dialog.vue";
import CSelect from "@/components/select/select.vue";
import CModal from "@/components/modal/modal.vue";
import { Skeleton } from "vue-loading-skeleton";
import Properties2 from "../properties2/properties2.vue";
import TransactionAPI from "@/services/api/transaction";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CInput,
    CDatepicker,
    AgGridVue,
    CModal,
    CSelect,
    CDialog,
    Skeleton,
    Properties2,
  },
  props: {
    breakdown1: {
      type: Number,
      require: true,
    },
  },
})
export default class Properties1 extends Vue {
  public rowData: any = null;
  public form: any = {};
  public showProperties2: boolean = false;
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
  showDialogUpdateSubDepartment: boolean = false;
  options: any = {};
  subDepartmentCode: string = "";
  isSaving: boolean = false;

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
        sumTotal: true,
        width: 100,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.creditForeign"),
        field: "CreditAmountForeign",
        sumTotal: true,
        width: 105,
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

  async mounted() {
    this.gridApi = this.gridOptions.api;
    await this.getPropertiesData();
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
      {
        name: this.$t("commons.contextMenu.updateSubDepartment"),
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        disabled: !this.paramsData, // || !this.userAccess.updateSubDepartment,
        action: () => this.handleUpdateSubDepartment(this.paramsData),
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

  async handleUpdateSubDepartment(paramsData: any) {
    this.subDepartmentCode = paramsData.sub_department_code;
    await this.loadSubDepartment(true);
  }

  handleUpdateType(paramsData: any, arg1: number) {
    throw new Error("Method not implemented.");
  }

  handleProperties(paramsData: any) {
    this.showProperties2 = true;
  }

  handleRowRightClicked() {
    handleRowRightClickedAgGrid(this.paramsData, this, "id");
  }

  //API CALL================================================================================================
  async getPropertiesData() {
    this.gridApi.showLoadingOverlay();
    try {
      const { data } = await transactionAPI.getProperties1(this.breakdown1);
      this.rowData = data.breakdown_detail;
      this.form = data.transaction_detail;
      this.form.audit_date = formatDateDatabase(this.form.audit_date);
    } catch (error) {
      getError(error);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
    this.gridApi.hideOverlay();
  }

  async updateSubDepartment() {
    if (
      this.isSaving ||
      this.subDepartmentCode == "" ||
      this.paramsData.id <= 0
    )
      return;
    this.isSaving = true;
    try {
      const params = {
        code: this.subDepartmentCode,
        id: this.paramsData.id,
      };
      await transactionAPI.updateSubDepartment(params);
      getToastSuccess();
      this.getPropertiesData();
      this.showDialogUpdateSubDepartment = false;
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
  }

  async loadSubDepartment(showDialog: boolean) {
    try {
      const { data } = await transactionAPI.codeNameList("SubDepartment");
      this.options.subDepartments = data;
      if (showDialog) this.showDialogUpdateSubDepartment = true;
    } catch (err) {
      getError(err);
    }
  }
  //END API CALL================================================================================================

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
