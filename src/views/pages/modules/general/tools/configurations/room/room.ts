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
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import InputForm from "../components/input-form/input-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import {
  formatDate,
  formatDateDatabase,
  formatDateTime,
  formatDateTimeUTC,
} from "@/utils/format";
import * as Yup from "yup";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Room");

@Options({
  components: {
    CDialog,
    InputForm,
    Select,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class Room extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public inputFormElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  searchDefault: any = {
    index: 0,
    text: "",
  };
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
  handleRowDoubleClicked(params: any) {
    this.handleEdit(params.data);
  }

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
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.cfgInitRoom,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
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

  refreshData(search: any) {
    this.loadData(search);
  }

  resetData() {
    this.form = {
      start_date: formatDateTimeUTC(new Date()),
      tv_quantity: 1,
      max_adult: 1,
      id_sort: 0,
    };
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
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
    this.deleteCode = params.number;
  }

  async handleEdit(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(`${params.id}`);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(`${params.id}`);
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    formData.start_date = formatDateTimeUTC(formData.start_date);
    formData.max_adult = parseInt(formData.max_adult);
    formData.is_smoking = parseInt(formData.is_smoking);
    formData.tv_quantity = parseInt(formData.tv_quantity);
    formData.id_sort = parseInt(formData.id_sort);
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
    this.gridApi.showLoadingOverlay();
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "number", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async editData(id: any) {
    try {
      this.loadDropdown();
      let { data } = await resourceAPI.edit(id);
      if (data) {
        this.inputFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.inputFormElement.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      formData.number = this.form.number;
      // formData.is_system = false
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
      const params = [
        "RoomType",
        "BedType",
        "RoomView",
        "Owner",
        "AccountRoomCharge",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.inputFormElement.listDropdown.room = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
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
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.number"), value: 0 },
      { text: this.$t("commons.filter.lockNumber"), value: 1 },
      { text: this.$t("commons.filter.name"), value: 2 },
      { text: this.$t("commons.filter.roomType"), value: 3 },
      { text: this.$t("commons.filter.roomView"), value: 4 },
      { text: this.$t("commons.filter.building"), value: 5 },
      { text: this.$t("commons.filter.floor"), value: 6 },
      { text: this.$t("commons.filter.description"), value: 7 },
      { text: this.$t("commons.filter.phoneNumber"), value: 8 },
      { text: this.$t("commons.filter.owner"), value: 9 },
      { text: this.$t("commons.filter.smoking"), value: 10 },
      { text: this.$t("commons.filter.createdBy"), value: 11 },
      { text: this.$t("commons.filter.updatedBy"), value: 12 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        duplicate: true,
        delete: true,
        edit: true,
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
        headerName: this.$t("commons.table.statusCode"),
        field: "status_code",
        width: 40,
      },
      {
        headerName: this.$t("commons.table.number"),
        field: "number",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.lockNumber"),
        field: "lock_number",
        width: 90,
      },
      { headerName: this.$t("commons.table.name"), field: "name", width: 170 },
      {
        headerName: this.$t("commons.table.roomType"),
        field: "RoomType",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.roomView"),
        field: "ViewName",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.building"),
        field: "building",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.floor"),
        field: "floor",
        width: 60,
      },
      {
        headerName: this.$t("commons.table.maxAdult"),
        field: "max_adult",
        width: 90,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.description"),
        field: "description",
        width: 250,
      },
      {
        headerName: this.$t("commons.table.phoneNumber"),
        field: "phone_number",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.tvQuantity"),
        field: "tv_quantity",
        width: 70,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.startDate"),
        field: "start_date",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.owner"),
        field: "OwnerName",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.revenueAccount"),
        field: "RevenueAccount",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.smoking"),
        field: "Smoking",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.idSort"),
        field: "id_sort",
        width: 70,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
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
      Number: Yup.string()
        .required()
        .max(20)
        .matches(
          /^[a-zA-Z0-9-/]+$/,
          "Code must only contain alphanumeric characters or the '-' symbol"
        ),
      Name: Yup.string().max(250),
      "Room Type": Yup.string().required(),
      Building: Yup.string().required(),
      Floor: Yup.string().required(),
      "Max Adult": Yup.number()
        .required()
        .test((val) => {
          return val > 0;
        }),
      "Start Date": Yup.string().required(),
      "Bed Type": Yup.string().required(),
      "TV Quantity": Yup.number()
        .required()
        .test((val) => {
          return val > 0;
        }),
    });
  }

  // END GETTER AND SETTER ===========================================================
}
