<template>
  <div>
    <h2>Stimulsoft Reports.JS - cobagan.mrt - Viewer</h2>
    <div id="viewerContent"></div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Stimulsoft } from "stimulsoft-reports-js/Scripts/stimulsoft.blockly.editor";
import "stimulsoft-reports-js/Css/stimulsoft.designer.office2013.whiteblue.css";
import "stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css";

@Options({
  name: "DropDownRenderer",
  components: {
    Stimulsoft,
  },
  props: {},
  emits: ["params"],
})
export default class DropDownRenderer extends Vue {
  public params: any;
  public datas: any;

  async fetchData() {
    const response = await fetch(
      "https://6381d7709842ca8d3c9ac0f0.mockapi.io/users"
    );
    this.datas = await response.json();
    console.log(this.datas);
  }
  async created() {
    await this.fetchData();
    var report = Stimulsoft.Report.StiReport.createNewReport();
    report.loadFile("/report/reports/cobagan.mrt");

    // var dbJSON2 = report.dictionary.databases.getByName("JSON2");
    // dbJSON2.pathData = "https://63ddbfa6367aa5a7a413a89e.mockapi.io/users";

    report.dictionary.databases.clear();

    // You need to create and copy the 'JSON2.json' file to the project, or change this path to the desired one.
    var dsJSON2 = new Stimulsoft.System.Data.DataSet();
    dsJSON2.readJson(this.datas);
    console.log(this.datas);
    console.log(dsJSON2);

    report.regData("JSON2", null, dsJSON2);

    var options = new Stimulsoft.Viewer.StiViewerOptions();
    options.appearance.fullScreenMode = true;
    options.toolbar.displayMode =
      Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;

    var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.report = report;
    viewer.renderHtml("viewerContent");

    // console.log("Loading Viewer view");

    // console.log("Creating the report viewer with default options");
    // let viewer = new Stimulsoft.Viewer.StiViewer(undefined, "StiViewer", false);

    // console.log("Creating a new report instance");
    // let report = new Stimulsoft.Report.StiReport();

    // console.log("Load report from url");
    // report.loadFile("/report/reports/cobagan.mrt");

    // console.log("Assigning report to the viewer, the report will be built automatically after rendering the viewer");
    // viewer.report = report;

    // console.log("Rendering the viewer to selected element");
    // viewer.renderHtml("viewer");

    // console.log("Loading completed successfully!");
  }
}
</script>
