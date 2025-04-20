import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
// import SearchFilter from "@/views/pages/components/filter/filter.vue";
import { reactive, ref } from "vue";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import { formatDateTime, formatDateTimeUTC } from "@/utils/format";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CRadio from "@/components/radio/radio.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import UserGroupGrid from "../user-group-grid/user-group-grid.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";

@Options({
  components: {
    // SearchFilter,
    AgGridVue,
    ActionGrid,
    BCard,
    BTabs,
    BTab,
    BCardText,
    CRadio,
    Checkbox,
    UserGroupGrid,
  },
  watch: {
    isActive(val) {
      this.$emit("isActive", this.isActive);
    },
  },
})
export default class GridPos extends Vue {
  public rowData: any = [];
  public actionGrid: boolean = false;
  public isActive: boolean = false;
  public form: any = reactive({});
  public inputFormElement: any = ref();
  // breakdownElement: any = ref()
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public modeData: any = 0;
  deleteCode: any = "";
  searchDefault: {
    filter: any[];
  } = null;
  searchOptions: any = [];
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  gridOptions: any = {};
  detailCellRenderer: any;
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

  // GENERAL FUNCTION ================================================================

  async handleShowForm(params: any, mode: any) {
    // await this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
    this.inputFormElement.initialize();
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.number;
  }

  async handleEdit(params: any) {
    params.date = formatDateTimeUTC(params.date);
    // this.loadDropdown();
    this.modeData = $global.modeData.edit;
    // await this.loadEditData(params.number);
  }

  handleSave(formData: any) {
    if (
      this.modeData == $global.modeData.insert ||
      this.modeData == $global.modeData.duplicate
    ) {
      // this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      // this.updateData(formData);
    }
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onSelectedRowGroup(value: boolean) {
    this.isActive = value;
  }

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    if (node.data.is_active == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        // action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.isActive
          ? this.$t("commons.contextMenu.deactivate")
          : this.$t("commons.contextMenu.active"),
        disabled: !this.paramsData,
        action: () => this.handleShowForm(this.paramsData, 2),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.handleShowForm(this.paramsData, 2),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      filter: [""],
    };

    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.code"),
        field: "name",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "name",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.group"),
        field: "group_name",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 70,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklistRenderer: Checklist,
      // detailCellRenderer: DetailCellRender,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.rowData = [
      {
        code: 123456,
        is_active: 1,
        group_name: "uuuyyee",
        name: "ikik",
        id: 1,
      },
      {
        code: 343433,
        is_active: 0,
        group_name: "uuuyyee",
        name: "ffdfsdfs",
        id: 2,
      },
    ];
  }

  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
