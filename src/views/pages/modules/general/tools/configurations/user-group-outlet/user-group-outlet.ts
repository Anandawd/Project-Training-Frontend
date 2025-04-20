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
import UserGroupOutletAPI from "@/services/api/configuration/user-group-outlet/user-group-outlet";
import GroupForm from "./components/group_form/group_form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import {
  formatDateDatabase,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import * as Yup from "yup";
import trackingDataModule from "@/stores/tracking-data";
import DetailCellRender from "./components/detail-cell-renderer/detail-cell-renderer.vue";
const userGroupOutletAPI = new UserGroupOutletAPI();

@Options({
  components: {
    CDialog,
    GroupForm,
    Select,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class UserGroupOutlet extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public groupFormElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public activity: boolean = true;
  public cellSelected: any;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
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
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.posUserGroupOutlet,
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

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  resetData() {}

  // handleActivity(){
  //   if (this.cellSelected != undefined || this.cellSelected != null) {
  //     let params = {
  //       id: this.cellSelected.id,
  //       is_active: this.activity
  //     }
  //     // this.approveInventoryItem(params) tunggu api
  //   }
  // }
  // activityHandler(){
  //   if (this.cellSelected.is_active == 1) {
  //     this.activity = false
  //   } else {
  //     this.activity = true
  //   }
  // }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.groupFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.user_group_code;
  }

  async handleEdit(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.user_group_code);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.user_group_code);
  }

  handleSave(formData: any) {
    const word = this.form.OutletCodeList;
    const dataSplit = word.split("|");
    this.form.OutletCodeList = dataSplit;
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      this.insertData(formData);
    }
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
      const { data } = await userGroupOutletAPI.GetUserGroupOutletList(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async editData(UserGroupCode: any) {
    try {
      const { data } = await userGroupOutletAPI.GetUserGroupOutlet(
        UserGroupCode
      );
      this.form = data;
      this.groupFormElement.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      let params = {
        UserGroupCode: formData.UserGroupCode,
        OutletCodeList: formData.OutletCodeList,
      };
      const { status2 } = await userGroupOutletAPI.UpdateUserGroupOutlet(
        params
      );
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
      let params = {
        UserGroupCode: formData.UserGroupCode,
        OutletCodeList: formData.OutletCodeList,
      };
      const { status2 } = await userGroupOutletAPI.InsertUserGroupOutlet(
        params
      );
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
      const params = ["UserGroup", "Outlet"];
      const { data } = await userGroupOutletAPI.codeNameListArray(params);
      this.groupFormElement.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await userGroupOutletAPI.DeleteUserGroupOutlet(
        this.deleteCode
      );
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
    this.searchDefault = {
      index: 0,
      text: "",
    };

    this.searchOptions = [
      { text: this.$t("commons.filter.userGroup"), value: 0 },
      { text: this.$t("commons.filter.createdBy"), value: 1 },
      { text: this.$t("commons.filter.updatedBy"), value: 2 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
        // insertDetail1: {
        //   title: "Insert Outlet",
        // },
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      // onCellClicked: (params: any) => {
      //   this.cellSelected = params.data
      //  this.activityHandler()
      // },
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
        headerName: this.$t("commons.table.userGroup"),
        field: "user_group_code",
        width: 120,
        cellRenderer: "agGroupCellRenderer",
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
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
      detailCellRenderer: DetailCellRender,
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
      "User Group": Yup.string().required(),
    });
  }

  // END GETTER AND SETTER ===========================================================
}
