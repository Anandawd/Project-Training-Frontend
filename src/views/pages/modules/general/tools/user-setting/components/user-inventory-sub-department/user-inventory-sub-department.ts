import { Options, Vue } from "vue-class-component";
import $global from "@/utils/global";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import { formatDateTime } from "@/utils/format";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import { Form } from "vee-validate";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
// import InputForm from "./components/input-form/input-form.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import UserSettingAPI from "@/services/api/general/user-setting";
import authModule from "@/stores/auth";
import CModal from "@/components/modal/modal.vue";
import { focusOnInvalid } from "@/utils/validation";
import { getToastSuccess } from "@/utils/toast";
const userSettingAPI = new UserSettingAPI();

@Options({
  components: {
    AgGridVue,
    CModal,
    // InputForm,
    CSelect,
    CRadio,
    CInput,
    CCheckbox,
  },
  props: {
    userCode: {
      type: String,
      require: true,
    },
  },
})
export default class UserInventorySubDepartment extends Vue {
  form: any = {};
  subDepartments: any = [];
  showInputForm: boolean = false;
  auth = authModule();
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
  userCode: string;
  rowData: any = [];
  modeEditor: number = 0;
  inputFormElement: any = null;
  isSaving: boolean = false;
  showConfirm: boolean = false;
  deleteID: number;

  beforeMount() {
    this.getInvSubDepartmentList();
    this.getSubDepartment();

    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
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
        headerName: this.$t("commons.table.subDepartment"),
        field: "sub_department",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.dhPRApprove"),
        field: "is_can_inv_pr_approve1",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.pcPRApprove"),
        field: "is_can_inv_pr_approve12",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.ccPRApprove"),
        field: "is_can_inv_pr_approve2",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.finalPRApprove"),
        field: "is_can_inv_pr_approve3",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.assignPricePR"),
        field: "is_can_inv_pr_assign_price",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.dhSRApprove"),
        field: "is_can_inv_sr_approve1",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.finalSRApprove"),
        field: "is_can_inv_sr_approve2",
        width: 100,
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

  async handleInsert() {
    this.modeEditor = $global.modeData.insert;
    await this.getSubDepartment();
    this.form.user_id = this.userCode;
    this.showInputForm = true;
  }

  async handleEdit(paramsData: any) {
    this.modeEditor = $global.modeData.edit;
    this.getSubDepartment();
    await this.getInvSubDepartment(paramsData.id);
    this.form.user_id = this.userCode;
  }

  handleDelete(paramsData: any) {
    this.deleteID = paramsData.id;
    this.showConfirm = true;
  }

  onDelete() {
    this.delete();
  }

  handleSave() {
    this.inputFormElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onSubmit() {
    if (this.modeEditor == $global.modeData.edit) {
      this.update();
    } else {
      this.insert();
    }
  }

  async getInvSubDepartmentList() {
    try {
      const { data } =
        await userSettingAPI.getUserInventorySubDepartmentAccessList(
          this.userCode
        );
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }

  async getInvSubDepartment(id: number) {
    try {
      const { data } = await userSettingAPI.getUserInventorySubDepartmentAccess(
        id
      );
      this.form = data ?? {};
      this.showInputForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async getSubDepartment() {
    try {
      const { data } = await userSettingAPI.codeNameList("SubDepartment");
      this.subDepartments = data ?? [];
    } catch (error) {
      getError(error);
    }
  }

  async insert() {
    if (this.isSaving) return;
    this.isSaving = true;
    this.form.user_code = this.userCode;
    try {
      await userSettingAPI.insertUserInventorySubDepartment(this.form);
      getToastSuccess();
      this.getInvSubDepartmentList();
      this.showInputForm = false;
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  async update() {
    if (this.isSaving) return;
    this.isSaving = true;
    this.form.user_code = this.userCode;
    try {
      await userSettingAPI.updateUserInventorySubDepartment(this.form);
      getToastSuccess();
      this.getInvSubDepartmentList();
      this.showInputForm = false;
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  async delete() {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      await userSettingAPI.deleteUserInventorySubDepartment(this.deleteID);
      getToastSuccess();
      this.getInvSubDepartmentList();
      this.showConfirm = false;
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  get title() {
    let prefix = this.$t("commons.insert");
    if (this.modeEditor == $global.modeData.edit) {
      prefix = this.$t("commons.edit");
    }

    if (this.modeEditor == $global.modeData.duplicate) {
      prefix = this.$t("commons.duplicate");
    }

    return `${prefix} ${this.$t("title.userSubDepartment")}`;
  }
}
