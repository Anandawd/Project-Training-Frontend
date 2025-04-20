import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import $global from "@/utils/global";
import InputForm from "./components/input-form/input-form.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import { formatDateTime } from "@/utils/format";
import configStore from "@/stores/config";
import UserGroupGrid from "./components/user-group-grid/user-group-grid.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import GridAsset from "./components/grid-asset/grid-asset.vue";
import UserSettingAPI from "@/services/api/general/user-setting";
import UserGrid from "./components/user-grid/user-grid.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import UserInventorySubDepartment from "./components/user-inventory-sub-department/user-inventory-sub-department.vue";
import EncryptionHelper from "@/utils/crypto";
import SettingsAPI from "@/services/api/general/settings";

const settingsAPI = new SettingsAPI();
const userSettingAPI = new UserSettingAPI();
const encryptionHelper = new EncryptionHelper();

@Options({
  name: "user-setting",
  components: {
    CDialog,
    InputForm,
    CSelect,
    CRadio,
    CInput,
    Checkbox,
    AgGridVue,
    UserInventorySubDepartment,
    // SearchFilter,
    BCardText,
    BCard,
    BTabs,
    BTab,
    GridAsset,
    UserGrid,
    UserGroupGrid,
  },
})
export default class UserSetting extends Vue {
  public rowData: any = [];
  public actionGrid: boolean = false;
  public isActive: string = "1";
  public form: any = reactive({});
  public inputFormElement: any = ref();
  public hotelElement: any = ref();
  public posElement: any = ref();
  public banquetElement: any = ref();
  public accountingElement: any = ref();
  public assetElement: any = ref();

  // breakdownElement: any = ref()
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public modeData: any = 0;
  public activeTab: number = 0;
  deleteCode: any = "";
  searchDefault: {
    filter: any[];
  } = null;
  searchOptions: any = [];
  // public isActive: boolean = false
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
  config = configStore();
  showUserGroupForm: boolean = false;
  userGroupAccessDataEdit: any = null;
  userGroupAccessData: any = null;
  userFormElement: any = null;
  showUserForm: boolean = false;
  isSaving: boolean = false;
  oldPassword: any;
  confirmDialog: () => Promise<void> = null;
  propertyList: any = [];
  property: string = "";
  // event: any;
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
        action: () => this.handleInsert(),
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
      "separator",
      {
        name: !this.paramsData.is_active
          ? this.$t("commons.contextMenu.activate")
          : this.$t("commons.contextMenu.deactivate"),
        disabled: !this.paramsData,
        action: () => this.handleActivateDeactiveUser(),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
      },
    ];
    return result;
  }
  resetData() {
    this.form = {};
  }

  refreshData(isActive = this.isActive) {
    this.showUserGroupForm = false;
    this.isActive = isActive;
    this.loadData();
    this.getUserGroupAccessList();
  }

  uppercase() {
    this.form.code = this.form.code.toUpperCase();
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  handleInsert() {
    if (this.activeTab == 0) {
      this.resetData();
      this.modeData = $global.modeData.insert;
      this.showUserForm = true;
    } else {
      this.userGroupAccessDataEdit = null;
      this.showUserGroupForm = true;
    }
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
    this.confirmDialog = this.deleteUser;
  }

  handleEditUserGroupAccess(data: any) {
    this.userGroupAccessDataEdit = data;
    this.showUserGroupForm = true;
  }

  handleEdit(params: any) {
    if (params.id > 0) {
      this.modeData = $global.modeData.edit;
      this.getUser(params.id);
    }
  }

  handleSave() {
    this.userFormElement.$el.requestSubmit();
  }

  handleMenu(params: any) {}

  async onSave() {
    this.isSaving = true;
    const passwordChanged = this.form.password != this.oldPassword;
    const passwordEncrypted = await encryptionHelper.encrypt(
      this.form.password
    );
    this.form.password = passwordEncrypted;
    this.form.confirm_password = passwordEncrypted;
    if (this.modeData === $global.modeData.edit) {
      this.updateUser(passwordChanged);
    } else {
      await this.insertUser();
    }
    this.isSaving = false;
  }

  handleActivateDeactiveUser() {
    this.showDialog = true;
    this.confirmDialog = this.activateDeactivateUser;
  }

  onInvalidSubmit() {
    focusOnInvalid();
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
  async loadData() {
    try {
      let params = {
        IsActive: this.isActive,
      };
      const { data } = await userSettingAPI.getUserList(params);
      this.rowData = data ?? [];
    } catch (error) {
      getError(error);
    }
  }

  async getUserGroupAccessList() {
    try {
      let params = {
        IsActive: this.isActive,
      };
      const { data } = await userSettingAPI.getUserGroupAccessList(params);
      this.userGroupAccessData = data ?? [];
    } catch (error) {
      getError(error);
    }
  }

  async insertUser() {
    try {
      let params = {
        user_id: this.form.code,
        full_name: this.form.name,
        password: this.form.password,
        group_code: this.form.user_group_access_code,
        property_code: this.form.property_code,
      };
      await userSettingAPI.insertUser(params);
      this.showUserForm = false;
      this.refreshData();
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async updateUser(passwordChanged: boolean) {
    try {
      let params = {
        password_changed: passwordChanged,
        id: this.form.id,
        full_name: this.form.name,
        password: this.form.password,
        group_code: this.form.user_group_access_code,
        property_code: this.form.property_code,
      };
      await userSettingAPI.updateUser(params);
      this.showUserForm = false;
      this.refreshData();
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async getUser(Id: number) {
    try {
      const { data } = await userSettingAPI.getUser(Id);
      this.form = data;
      this.form.confirm_password = data.password;
      this.oldPassword = data.password;
      this.showUserForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async deleteUser() {
    try {
      await userSettingAPI.deleteUser(this.deleteCode);
      this.showDialog = false;
      this.refreshData();
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async getPropertyList() {
    try {
      const { data } = await settingsAPI.getHotelInformationList();
      this.propertyList = data ?? [];
    } catch {}
  }

  async activateDeactivateUser() {
    const params = {
      user_id: this.paramsData.id,
      is_active: !this.paramsData.is_active ? "1" : "0",
    };
    try {
      await userSettingAPI.activateDeactivateUser(params);
      this.showDialog = false;
      this.refreshData();
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.refreshData();
    this.getPropertyList();
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
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
        headerName: this.$t("commons.table.code"),
        field: "code",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "name",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.group"),
        field: "user_group_access_code",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.property"),
        field: "property_code",
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
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get disabledActionGrid() {
    return this.actionGrid;
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.user")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.user")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.user")}`
      )}`;
    }
  }

  // END GETTER AND SETTER FUNCTION ==================================================

  // Validation
  get schema() {
    return Yup.object().shape({
      "User ID": Yup.string()
        .min(4)
        .max(20)
        .matches(
          /^[a-zA-Z0-9_-]+$/,
          "Code must only contain alphanumeric characters, '-' or '_'"
        )

        .required(),
      Group: Yup.string().required(),
      "Full Name": Yup.string().required(),
      Property: Yup.string().required(),
      Password:
        this.form.password != this.oldPassword
          ? Yup.string()
              .required("Password is required")
              .matches(
                /^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/,
                "Need one special character"
              )
          : null,
      "Confirm Password":
        this.form.password != this.oldPassword
          ? Yup.string()
              .oneOf([Yup.ref("Password"), null], "Passwords must match")
              .required("Password confirm is required")
          : null,
    });
  }
}
