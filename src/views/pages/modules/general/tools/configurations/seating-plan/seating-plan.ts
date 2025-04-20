import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import Select from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import InputForm from "../components/input-form/input-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime } from "@/utils/format";
import * as Yup from "yup";
const resourceAPI = new ConfigurationResource("SeatingPlan");

@Options({
  components: {
    CDialog,
    InputForm,
    Select,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class SeatingPlan extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public inputFormElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public uploadURL: string;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  searchOptions: any = [];
  isSaving: boolean = false;
  isLoading: boolean = false;
  dataCode: any;
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
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
  // ------------------------additional for context menu ag-Grid-----------//
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
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
        action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.trackingData(this.paramsData),
      },
    ];
    return result;
  }

  handleRowDoubleClicked(params: any) {
    this.handleEdit(params.data);
  }

  handleMenu() {
    //
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  async resetData() {
    this.form = {
      id_sort: 0,
    };
  }

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.resetData();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    // TODO: TAMBAHKAN NNTI URLNYA
    this.uploadURL =
      import.meta.env.VITE_APP_URL_API + "/upload/-/" + params.code;
    this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.code);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.code);
  }

  async handleSave(formData: any) {
    formData.id_sort = parseInt(formData.id_sort);
    this.isSaving = true;
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    }
    this.isSaving = false;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    const selectedRow = this.gridApi.getSelectedRows();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {}
  }

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.inputFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.inputFormElement.form = data;
      this.dataCode = data.code;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    formData.code = this.dataCode;
    try {
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const { data } = await resourceAPI.codeNameList("Venue");
      this.inputFormElement.listDropdown.global = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    this.isLoading = true;
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
    this.isLoading = false;
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      index: 1,
      text: "",
    };

    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.createdBy"), value: 2 },
      { text: this.$t("commons.filter.updatedBy"), value: 3 },
    ];
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
        lockPosition: true,
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.code"),
        field: "code",
        width: 60,
      },
      { headerName: this.$t("commons.table.name"), field: "name", width: 110 },
      {
        headerName: this.$t("commons.table.venueCode"),
        field: "assign_venue_code",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.description"),
        field: "description",
        width: 150,
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
      // { headerName: this.$t('commons.table.lastUpdate'), field: 'updated_by', width: 110 },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
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
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required().max(50),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required()
        .max(4),
      "Assign Venue": Yup.string().required(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
