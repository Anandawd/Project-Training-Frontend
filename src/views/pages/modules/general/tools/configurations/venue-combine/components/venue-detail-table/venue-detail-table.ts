import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import { reactive, ref } from "vue";
import { formatDateTime } from "@/utils/format";

@Options({
  components: {
    Form,
    CCheckbox,
    // InputForm,
    AgGridVue,
  },
  props: {
    rowData: {
      type: Array,
      default: [],
    },
  },
})
export default class VenueDetail extends Vue {
  public rowData: any = [];
  public code: string;
  public form: any = reactive({});
  public formElement: any = ref();
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
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
  folioNumber: any;
  global: any;

  // GENERAL FUNCTION ================================================================
  onGridReady() {
    //
  }

  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  refreshData(search: any) {}

  initialize(code: string) {
    this.code = code;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
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
        headerName: this.$t("commons.table.venue"),
        field: "Venue",
        width: 120,
      },
      // {
      //   headerName: this.$t("commons.table.createdAt"),
      //   field: "created_at",
      //   width: 120,
      //    valueFormatter:  formatDateTime,
      // filterParams: {
      //   valueFormatter:  formatDateTime,
      // },
      //   cellStyle: { textAlign: "center" },
      //   headerClass: "align-header-center",
      // },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      // {
      //   headerName: this.$t("commons.table.updatedAt"),
      //   field: "updated_at",
      //   width: 120,
      //    valueFormatter:  formatDateTime,
      // filterParams: {
      //   valueFormatter:  formatDateTime,
      // },
      //   cellStyle: { textAlign: "center" },
      //   headerClass: "align-header-center ",
      // },
      // {
      //   headerName: this.$t("commons.table.updatedBy"),
      //   field: "updated_by",
      //   width: 100,
      // },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  // END GETTER AND SETTER ===========================================================
}
