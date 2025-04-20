import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "../modal/modal.vue";
import trackingDataModule from "@/stores/tracking-data";
import { formatDate, formatTime } from "@/utils/format";

@Options({
  name: "tracking-data",
  components: {
    CModal,
    AgGridVue,
  },
  props: {
    modelValue: { default: "" },
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    value: {
      default: "",
    },
  },
})
export default class TrackingData extends Vue {
  trackingDataModule = trackingDataModule();
  text: string = "";
  rowSelection: string;
  rowModelType: string;
  columnDefs: any;
  agGridSetting: any;
  gridOptions: any;

  handleClose() {
    this.trackingDataModule.hide();
  }

  async beforeMount() {
    this.agGridSetting = this.$global.agGrid;
    this.gridOptions = {
      ...this.agGridSetting.defaultGridOptions,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.date"),
        field: "created_at",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 100,
      },
      {
        headerName: this.$t("commons.table.time"),
        field: "created_at",
        valueFormatter: formatTime,
        filterParams: {
          valueFormatter: formatTime,
        },
        width: 100,
      },
      {
        headerName: this.$t("commons.table.userId"),
        field: "created_by",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.mode"),
        field: "mode",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.tableName"),
        field: "table_name_log",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.data"),
        field: "data_query",
        flex: 1,
        minWidth: 300,
        width: 30,
      },
    ];

    // ------------------end need setting manual for column table-----------------//

    this.rowSelection = "single";
    this.rowModelType = "serverSide";
  }

  get visible() {
    return this.trackingDataModule.visible;
  }

  get id() {
    return this.trackingDataModule.id;
  }

  get title() {
    return `Tracking Data - Log ID: ${this.id}`;
  }

  get logData() {
    return this.trackingDataModule.logData;
  }
}
