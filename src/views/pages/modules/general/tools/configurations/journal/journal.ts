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
import InputForm from "./journal-input-form/journal-input-form.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import $global from "@/utils/global";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import JournalAPI from "@/services/api/accounting/journal/journal";
import {
  generateTotalFooterAgGrid,
  generateIconContextMenuAgGrid,
  getError,
} from "@/utils/general";
import authModule from "@/stores/auth";
import { getToastSuccess, getToastError } from "@/utils/toast";
const journalAPI = new JournalAPI();

@Options({
  components: {
    AgGridVue,
    CDialog,
    SearchFilter,
    CSelect,
    CInput,
    InputForm,
  },
})
export default class Journal extends Vue {
  public id = 0;
  public rowData: any = [];
  public inputFormData: any = [];
  public showForm: boolean = false;
  public modeData: any;
  public ref_number: any;
  public form: any = {};
  public duplicateData: any = {};
  public inputFormElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  public limitData: number = 30;
  public user_id: any;
  public userListDropdown: any = [];
  auth: any = authModule();

  searchDefault: any = {
    index: 0,
    text: "",
    start_date: "",
    end_date: "",
    filter: [0],
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
  user: any = {};

  // GENERAL FUNCTION ================================================================

  refreshData(search: any) {
    this.loadData(search);
    console.log(this.user_id);
  }

  showLastInsert() {
    this.loadData(this.searchDefault, true);
  }

  logout() {
    this.auth.logout();
  }
  // END GENERAL FUNCTION ============================================================

  // HANDLE UI =======================================================================
  async handleShowForm(params: any, mode: any) {
    await this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
    this.inputFormElement.initialize();
  }

  async handleEdit(params: any) {
    let str = params.ref_number;

    this.modeData = $global.modeData.edit;
    await this.loadDropdown();
    this.inputFormElement.initialize();
    if (str.slice(0, 2) === "JM" || str.slice(0, 2) === "JA") {
      await this.loadEditData(params.ref_number);
    } else {
      getToastError(this.$t("messages.cantEdit"));
    }
    // console.log(params);
  }

  async handleDuplicate(params: any) {
    let str = params.ref_number;

    this.modeData = $global.modeData.duplicate;
    await this.loadDropdown();
    if (str.slice(0, 2) === "JM" || str.slice(0, 2) === "JA") {
      await this.loadEditData(params.ref_number);
    } else {
      getToastError(this.$t("messages.cantDuplicate"));
    }
  }

  handleDelete(params: any) {
    let str = params.ref_number;

    if (str.slice(0, 2) === "JM" || str.slice(0, 2) === "JA") {
      this.showDialog = true;
      this.deleteParam = params.ref_number;
    } else {
      getToastError(this.$t("messages.cantDelete"));
    }
  }

  handleSave(formData: any) {
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    }
  }
  // END HANDLE UI====================================================================

  // API REQUEST======================================================================
  async loadData(
    search: any = this.searchDefault,
    isShowLastInsert: boolean = false
  ) {
    try {
      // open if you want to use filter
      this.searchDefault.start_date = formatDateTimeZeroUTC(
        this.searchDefault.start_date
      );
      this.searchDefault.end_date = formatDateTimeZeroUTC(
        this.searchDefault.end_date
      );
      let params = {
        Index: search.index,
        Text: search.text,
        // StartDate: formatDateTimeZeroUTC(search.start_date),
        // EndDate: formatDateTimeZeroUTC(search.end_date),
        Type: search.filter[0],
        UserId: this.user_id,
        Limit: this.limitData,
        IsShowLastInsert: isShowLastInsert,
      };
      const { data } = await journalAPI.GetJournalList(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }
  async loadDropdown() {
    try {
      const params = {};
      const { data } = await journalAPI.GetJournalComboList(params);
      this.inputFormElement.listDropdown = data;
    } catch (error: any) {
      getError(error);
    }
  }
  async loadUserIdDropdown() {
    try {
      const params = {};
      const { data } = await journalAPI.GetJournalUserList(params);
      this.userListDropdown = data;
      console.log(this.userListDropdown);
    } catch (error: any) {
      getError(error);
    }
  }
  async insertData(formData: any) {
    console.log(formData);
    try {
      const { status2 } = await journalAPI.InsertJournal(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadData(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    }
  }
  async loadEditData(params: any) {
    try {
      const { data } = await journalAPI.GetJournal(params);
      this.inputFormElement.onEdit(data);
      this.ref_number = data.Data.ref_number;
      // console.log(inputForm);

      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }
  async updateData(formData: any) {
    console.log(formData);
    try {
      formData.ref_number = this.ref_number;
      console.log(formData.ref_number);

      const { status2 } = await journalAPI.UpdateJournal(formData);
      if (status2.status == 0) {
        this.loadData(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  async deleteData() {
    try {
      const { status2 } = await journalAPI.DeleteJournal(this.deleteParam);
      if (status2.status == 0) {
        this.loadData(this.searchDefault);
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
    this.getUserId();

    this.searchOptions = [
      { text: this.$t("commons.filter.refNumber"), value: 0 },
      { text: this.$t("commons.filter.company"), value: 1 },
      { text: this.$t("commons.filter.account"), value: 2 },
      { text: this.$t("commons.filter.memo"), value: 3 },
      { text: this.$t("commons.filter.remark"), value: 4 },
      { text: this.$t("commons.filter.type"), value: 5 },
      { text: this.$t("commons.filter.department"), value: 6 },
      { text: this.$t("commons.filter.accountSubGroup"), value: 7 },
      { text: this.$t("commons.filter.accountSubGroupType"), value: 8 },
      { text: this.$t("commons.filter.accountGroup"), value: 9 },
      { text: this.$t("commons.filter.accountCategory"), value: 10 },
      { text: this.$t("commons.filter.itemGroup"), value: 11 },
      { text: this.$t("commons.filter.lastUpdate"), value: 12 },
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
        width: 100,
        cellClass: "action-grid-buttons",
        headerClass: "align-header-center-suppress-menu",
      },
      {
        headerName: this.$t("commons.table.refNumber"),
        field: "ref_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        width: 80,
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
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.company"),
        field: "Company",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "SubDepartment",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.debit"),
        field: "Debit",
        width: 140,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.credit"),
        field: "Credit",
        width: 140,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      { headerName: this.$t("commons.table.memo"), field: "memo", width: 130 },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.type"),
        field: "TransactionType",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.department"),
        field: "Department",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.accountSubGroup"),
        field: "AccountSubGroup",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.accountSubType"),
        field: "AccountSubGroupType",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.accountGroup"),
        field: "AccountGroup",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.accountCategory"),
        field: "AccountCategory",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.itemGroup"),
        field: "ItemGroup",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      statusBarTotalRenderer: StatusBarTotalRenderer,
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

  async mounted() {
    this.loadData(this.searchDefault);
    this.loadUserIdDropdown();

    // console.log(this.limitData);
  }

  async getUser() {
    this.user = await this.auth.user;
    if (!this.user) return this.auth.logout();
  }

  created(): void {
    this.getUser();
  }

  get userId() {
    return this.user.ID;
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER FUNCTION ======================================================

  getUserId() {
    this.user_id = this.userId;
  }
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
