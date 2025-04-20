import { Options, Vue } from "vue-class-component";
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import { Form } from "vee-validate";
import ActionDuplicate from "@/components/ag_grid-framework/action_grid_duplicate.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import $global from "@/utils/global";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";

@Options({
  components: {
    Form,
    CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
    CDialog,
    SearchFilter,
    ActionDuplicate,
  },

  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
})
export default class Receive extends Vue {
  // public resourceAPI:any = this.$route.meta.isPayment ? paymentAPI : receiveAPI;
  public resourceAPI: any;

  public id = 0;
  public rowData: any = [];
  public inputFormData: any = [];
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public formPayment: any = {};
  public duplicateData: any = {};
  public inputFormElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  searchDefault: any = {
    index: 0,
    text: "",
    start_date: "",
    end_date: "",
  };
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  detailCellRenderer: any;
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

  async resetForm() {
    // this.inputFormElement.resetForm();
    await this.$nextTick();
    this.formPayment = {
      remark: "",
      date: formatDateTimeUTC(new Date()),
    };
  }

  async initialize() {
    // await this.loadDropdownGL(this.formDetail.sub_department.code)
    this.resetForm();
  }
  onClose() {
    this.$emit("close");
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} Multi Payment`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} Multi Payment`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} Multi Payment`;
    }
  }

  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.refNumber"), value: 0 },
      { text: this.$t("commons.filter.company"), value: 1 },
      { text: this.$t("commons.filter.memo"), value: 2 },
      { text: this.$t("commons.filter.lastUpdate"), value: 3 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
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
        width: 120,
      },
      {
        headerName: this.$t("commons.table.number"),
        field: "ref_number",
        cellRenderer: "agGroupCellRenderer",
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
        headerName: this.$t("commons.table.documentNumber"),
        field: "Company",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.outstanding"),
        field: "memo",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "memo",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "memo",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.result"),
        field: "memo",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 130,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 130,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 130,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionDuplicate,
      iconLockRenderer: IconLockRenderer,
    };
    this.rowGroupPanelShow = "always";

    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {}
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER FUNCTION ======================================================

  // END GETTER AND SETTER FUNCTION ==================================================
}
