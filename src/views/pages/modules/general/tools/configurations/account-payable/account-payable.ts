import { Options, Vue } from "vue-class-component";
import "ag-grid-enterprise";
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import InputForm from "./account-payable-form/account-payable-form.vue";
import PaymentForm from "./payment-form/payment-form.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import $global from "@/utils/global";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import AccountPayableAPI from "@/services/api/accounting/account-payable/account-payable";
import {
  generateTotalFooterAgGrid,
  generateIconContextMenuAgGrid,
  getError,
} from "@/utils/general";
import authModule from "@/stores/auth";
import { getToastSuccess, getToastError } from "@/utils/toast";
import DetailCellRender from "./detail-account-payable/detail-account-payable.vue";

const accountPayableAPI = new AccountPayableAPI();

@Options({
  components: {
    AgGridVue,
    CDialog,
    SearchFilter,
    CSelect,
    CInput,
    InputForm,
    PaymentForm,
    DetailCellRender,
  },
})
export default class AccountPayable extends Vue {
  public id = 0;
  public rowData: any = [];
  public inputFormData: any = [];
  public showPaymentForm: boolean = false;
  public showPaymentButton: boolean = false;
  public showForm: boolean = false;
  public showFormExpense: boolean = false;
  public modeData: any;
  public number: any;
  public form: any = {};
  public duplicateData: any = {};
  public inputFormElement: any = ref();
  public expenseFormElement: any = ref();
  public paymentFormElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  public limitData: number = 30;
  public user_id: any;
  public userListDropdown: any = [];
  auth: any = authModule();
  public selectedRow: any;

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

  // GENERAL FUNCTION ================================================================
  onSelectionChanged() {
    this.showPaymentButton = true;
  }

  refreshData(search: any) {
    this.loadData(search);
  }
  // END GENERAL FUNCTION ============================================================

  // HANDLE UI =======================================================================
  async handleShowForm(params: any, mode: any) {
    await this.loadDropdown();
    this.inputFormData = [];
    this.showForm = true;
    this.inputFormElement.initialize();
    this.modeData = mode;
  }

  async handleShowFormExpense() {
    this.formType = $global.formType.accruedExpense;
    this.handleShowForm("", $global.modeData.insert);
  }

  async handleShowFormInput() {
    this.formType = $global.formType.accountPayable;
    this.handleShowForm("", $global.modeData.insert);
  }

  async handleShowPayment(params: any, mode: any) {
    this.selectedRow = this.gridOptions.api.getSelectedRows();
    this.inputFormData = [];
    this.paymentFormElement.initialize();

    console.log(this.selectedRow);

    this.modeData = mode;
    this.showPaymentForm = true;
  }

  handleSave(formData: any) {
    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    }
  }

  async handleEdit(params: any) {
    this.inputFormElement.initialize();
    this.inputFormElement.onEditForm();
    this.modeData = $global.modeData.edit;
    await this.loadEditData(params.number);
    await this.loadDropdown();
    console.log(this.inputFormData);

    // console.log(params);
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.number;
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
        IsPaid: search.filter[0],
        IsAP: this.$route.meta.isAp,
      };
      const { data } = await accountPayableAPI.GetAPARList(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }
  async loadDropdown() {
    try {
      const params = {};
      const { data } = await accountPayableAPI.GetAPARComboList(params);
      this.inputFormElement.listDropdown = data;
    } catch (error: any) {
      getError(error);
    }
  }
  async insertData(formData: any) {
    console.log(formData);
    try {
      const { status2 } = await accountPayableAPI.InsertAPAR(formData);
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
      let inputForm: any = {};
      const type: any = this.$route.meta.isAp ? "AP" : "AR";
      const { data } = await accountPayableAPI.GetAPAR(type, params);
      // this.inputFormElement.form = data.Data
      (inputForm.number = params),
        (inputForm.date = data.data.date),
        (inputForm.due_date = data.data.due_date),
        (inputForm.remark = data.data.remark),
        (inputForm.company_code = data.data.company_code),
        (inputForm.document_number = data.data.document_number),
        (inputForm.sub_department_code = data.data.sub_department_code),
        (inputForm.ap_account = data.data.account_code);
      this.inputFormElement.form = inputForm;
      this.inputFormData = data.detail;
      this.number = params;
      console.log(this.number);

      this.showForm = true;
    } catch (error) {
      // getError(error)
    }
  }
  async updateData(formData: any) {
    console.log(formData);
    try {
      formData.number = this.number;
      console.log(formData.number);

      const { status2 } = await accountPayableAPI.UpdateAPAR(formData);
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
      const type: any = this.$route.meta.isAp ? "AP" : "AR";
      const { status2 } = await accountPayableAPI.DeleteAPAR(
        type,
        this.deleteParam
      );
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
    this.searchOptions = [
      { text: this.$t("commons.filter.number"), value: 0 },
      { text: this.$t("commons.filter.documentNumber"), value: 1 },
      { text: this.$t("commons.filter.refNumber"), value: 2 },
      { text: this.$t("commons.filter.company"), value: 3 },
      { text: this.$t("commons.filter.accountDebit"), value: 4 },
      { text: this.$t("commons.filter.accountCredit"), value: 5 },
      { text: this.$t("commons.filter.remark"), value: 6 },
      { text: this.$t("commons.filter.lastUpdate"), value: 7 },
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
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
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
        headerName: this.$t("commons.table.number"),
        field: "number",
        cellRenderer: "agGroupCellRenderer",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.document"),
        field: "document_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.refNumber"),
        field: "ref_number",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.company"),
        field: "Company",
        width: 140,
      },

      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 140,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.amountPaid"),
        field: "amount_paid",
        width: 140,
        cellStyle: { textAlign: "right" },
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.outstanding"),
        field: "Outstanding",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        sumTotal: true,
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.dueDate"),
        field: "due_date",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "JournalAccountCredit",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.accrued"),
        field: "is_accrued",
        width: 130,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
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
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
      detailCellRenderer: DetailCellRender,
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
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER FUNCTION ======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
