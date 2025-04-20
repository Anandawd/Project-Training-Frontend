import { Options, Vue } from "vue-class-component";
import configStore from "@/stores/config";
import authModule from "@/stores/auth";
import CashierReportAPI from "@/services/api/cashier-report";
import { formatCurrency } from "@/utils/format";
import QuantityRenderer from "./components/quantity-renderer.vue";
import RemittanceReport from "./components/remittance-report/remittance-report.vue";
import { AgGridVue } from "ag-grid-vue3";
import { anyToFloat, generateTotalFooterAgGrid } from "@/utils/general";
const cashierReportAPI = new CashierReportAPI();

@Options({
  components: {
    AgGridVue,
    RemittanceReport,
  },
})
export default class CashierReport extends Vue {
  public formatCurrency = formatCurrency;
  public rowData: any = null;
  public config: any = configStore();
  public authModule = authModule();
  rowSelection: string = "";
  gridOptions: any = null;
  columnDefs: any = null;
  frameworkComponents: any = null;
  gridApi: any = null;
  context: any = null;
  pinnedBottomRowData: any = null;
  shiftInformation: any = {};
  balance: any = {};
  reportData: any = null;
  showRemittance: boolean = false;
  remittanceReportElement: any = null;
  timeOutId: NodeJS.Timeout;
  showDialog: boolean = false;
  // GENERAL FUNCTION ================================================================

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  async generateTotalFooter(reloadReport = true, paramsData?: any) {
    const rowData: any = [];
    this.gridApi.forEachNode((node: any) => {
      if (paramsData) {
        if (node.data.nominal == paramsData.nominal) {
          node.setDataValue(
            "SubTotal",
            anyToFloat(paramsData.nominal) * anyToFloat(paramsData.quantity)
          );
        }
      }
      rowData.push(node.data);
    });
    this.pinnedBottomRowData = generateTotalFooterAgGrid(
      rowData,
      this.columnDefs
    );
    this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    if (reloadReport) {
      this.reloadReport(rowData);
    }
  }

  async reloadReport(rowData: any) {
    // this.remittanceReportElement.report.print();
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(async () => {
      this.reportData.cash_count = rowData;
      this.showRemittance = false;
      await this.$nextTick();
      this.showRemittance = true;
    }, 800);
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handlePrintCashierReport() {
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${this.$global.reportID.cashierReport}&param=true&template=${this.$global.stimulsoftReportFileDirectory.cashierReport}`
    );
    window.open(newTabReport.href, "_blank");
  }

  async handlePrintRemittance() {
    // this.remittanceReportElement.report.print();
    this.remittanceReportElement.report.printToPdf(
      this.remittanceReportElement.Stimulsoft.Report.StiPagesRange.All
    );

    // Generate the report HTML
    var reportHtml = this.remittanceReportElement.report.exportDocument(
      this.remittanceReportElement.Stimulsoft.Report.StiExportFormat.Pdf
    );
    this.printToQzService(reportHtml);
    // printWindow.close();
  }

  handleCloseShift() {
    this.showDialog = true;
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getCashRemittance() {
    try {
      const { data } = await cashierReportAPI.getCashRemittance();
      this.balance = data.current_balance;
      this.shiftInformation = data.shift_information ?? {};
      this.rowData = data.cash_count ?? [];
      this.reportData = data;
      this.showRemittance = true;
      this.generateTotalFooter(false);
    } catch (error) {
      console.log(error);
    }
    // setTimeout(() => {
    //   this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    // }, 200);
  }

  async closeShift() {
    try {
      await cashierReportAPI.closeShift();
      this.authModule.logout();
    } catch (error) {
      console.log(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.getCashRemittance();
    this.gridOptions = {
      ...this.$global.agGrid.defaultGridOptions,
      rowGroupPanelShow: "never",
      suppressRowGroupHidesColumns: true,
      suppressDragLeaveHidesColumns: true,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.sign"),
        field: "currency_sign",
        width: 50,
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        textTotal: this.$t("commons.total"),
      },
      {
        headerName: this.$t("commons.table.nominal"),
        field: "nominal",
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          if (params.node.rowPinned) return "";
          return formatCurrency(params.data.nominal, 2);
        },
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: this.$t("commons.table.qty"),
        headerClass: "align-header-center",
        field: "quantity",
        width: 100,
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        sumTotal: true,
        cellStyle: { textAlign: "center" },
        type: "numericColumn",
        cellRenderer: "quantityRenderer",
        valueFormatter: (params: any) =>
          formatCurrency(params.data.quantity, 2),
      },
      {
        headerName: this.$t("commons.table.total"),
        field: "SubTotal",
        flex: 1,
        minWidth: 150,
        sumTotal: true,
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        type: "numericColumn",
        valueFormatter: (params: any) =>
          formatCurrency(params.data.SubTotal, 2),

        // valueFormatter: (params: any) =>
        //   params.node.setDataValue(
        //     params.column.colId,
        //     anyToFloat(params.data.quantity) * anyToFloat(params.data.nominal)
        //   ),
        // formatCurrency(
        //   anyToFloat(params.data.quantity) * anyToFloat(params.data.nominal),
        //   2
        // ),
      },
    ];
    this.context = { componentParent: this };
    this.rowSelection = "single";
    this.frameworkComponents = {
      quantityRenderer: QuantityRenderer,
    };
  }

  getRowId(params: any) {
    return params.data.nominal;
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================
  get closingBalance() {
    return formatCurrency(
      anyToFloat(this.shiftInformation.opening_balance) +
        anyToFloat(this.balance.Balance)
    );
  }
  // END GETTER AND SETTER ===========================================================
}
