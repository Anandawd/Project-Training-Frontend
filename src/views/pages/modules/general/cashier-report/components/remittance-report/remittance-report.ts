import $global from "@/utils/global";
import ReportAPI from "@/services/api/report";
import CDialog from "@/components/dialog/dialog.vue";
import { Options, Vue } from "vue-class-component";
import { Stimulsoft } from "stimulsoft-reports-js/Scripts/stimulsoft.viewer";
import "stimulsoft-reports-js/Css/stimulsoft.designer.office2013.whiteblue.css";
import "stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css";
import { getError } from "@/utils/general";
import CashierReportAPI from "@/services/api/cashier-report";

@Options({
  components: {
    CDialog,
  },
  props: {
    reportData: Object,
  },
})
export default class RemittanceReport extends Vue {
  public showDialog: any = false;
  public Stimulsoft = Stimulsoft;
  public dialogText: string = "";
  public dialogTitle: string = "";
  public reportData: any = null;
  public report = new Stimulsoft.Report.StiReport();

  async print() {
    const options = new Stimulsoft.Viewer.StiViewerOptions();

    options.appearance.backgroundColor = Stimulsoft.System.Drawing.Color.gray;
    options.appearance.pageBorderColor = Stimulsoft.System.Drawing.Color.yellow;
    options.toolbar.visible = false;
    options.appearance.scrollbarsMode = true;

    const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

    this.report.dictionary.databases.clear();
    const dataSet = new Stimulsoft.System.Data.DataSet();
    this.report.loadFile(
      this.$global.stimulsoftReportFileDirectory.cashRemittance
    );
    if (this.report.script == "") {
      this.showDialogX(this.$t("messages.reportTemplateNotFound"));
      return;
    }
    // =======================================================================
    try {
      dataSet.readJson(this.reportData);
      this.report.regData(dataSet.dataSetName, "", dataSet);
      // Set the print settings
      // var printSettings = new Stimulsoft.System.Print.StiPrinterSettings();
      // printSettings.setPrinterName("PrinterName");
      // printSettings.setPrintSilent(true);
      // // viewer.onPrintReport()
      // this.report.Printt;
      viewer.report = this.report;
      // Get the Stimulsoft viewer object
      // this.report.print();
      viewer.showProcessIndicator;

      viewer.renderHtml("reportRenderer");
      // // Print the this.report directly to the printer
      // viewer2.printDirect();
    } catch (error) {
      getError(error);
    }
  }

  showDialogX(text: string) {
    this.dialogText = text;
    alert(text);
    return (this.showDialog = true);
  }

  closeWindowTab() {
    this.showDialog = false;
    window.close();
  }

  created(): void {
    // Setup Licenci Stimulsoft
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHnPa5/5XoYd+qNFMUW374+2A15lkDEmsFbZidCcj4z6A0fW29" +
      "qY4qqFX38PjvyDKBhrkx+ul3oYnrgqg3XSk0mOzjR42PEALIa9fqUQ4iscOiXXv93u8TJrXsp5mYVhWJ/Umix2Bqwb" +
      "IhXflLD+hq7eMu0FY4xv2+l2cbnW4+2t6azb660R/N3uDD3NV0sOoOSUaBzEyWGX79ppoHXUYPHdga0wZ+egnmkR7Q" +
      "Jg/fZjmLC8IJQSU+HTZUaXuRlg4ny9HOfuy6AZa0pJbHtWl2sowps0cOqDX533NJCrw90zrF9q6ymMP1f96ZoI6RsY" +
      "WlS78TC9RsoO5M1wEDq+JW/k13F5jLIYMwZQlB/oPwb8PazJx8/Flek8RapGoBOgO8loyZtdRP4SA8qavbCjK7ZML5" +
      "b6OXG/trsgeZb0ikZ7W4hX9wldd6AzVxMkjkIrx+HjdVFYbL5R4M1yRicKpDMBVW1HmWLKbBcJORVu2pgbfRTfbQMb" +
      "vwE995r1kuazqHJdj1zNkqNs2h5FhkJpAKif";

    // this.rint($global.stimulsoftReportFileDirectory.registrationFormReservation)
  }
  async mounted() {
    // await this.$nextTick();
    // setTimeout(() => {
    this.print();
    // }, 2000);
  }
}
