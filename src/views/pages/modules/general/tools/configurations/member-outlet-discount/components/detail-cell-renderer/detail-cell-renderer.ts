import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import {
  cloneObject,
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import InputForm from "../../../components/input-form/input-form.vue";
import { reactive, ref } from "vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
const resourceAPI = new ConfigurationResource("PackageBusinessSource");

@Options({
  components: {
    Form,
    CCheckbox,
    InputForm,
    AgGridVue,
  },
  props: ["params"],
})
export default class BusinessSource extends Vue {
  public rowData: any = [];
  public code: string;
  public form: any = reactive({});
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public params: any;

  listDropdown = {};
  searchOptions: any = [];
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

  refreshData(search: any) {
    this.loadData(this.code);
  }

  initialize(code: string) {
    this.code = code;
    this.loadData(code);
    // this.resetForm();
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(param: any) {
    // this.gridApi.showLoadingOverlay()
    try {
      const { data } = await resourceAPI.GetMemberProductDiscount(param);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
    // this.gridApi.hideOverlay()
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.loadData(this.params.data.code);

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
        headerName: this.$t("commons.table.product"),
        field: "id",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "product_code",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "member_code",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "outlet_code",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.outlet"),
        field: "Outlet",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "Product",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.discount(%)"),
        field: "discount_percent",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
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
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
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
