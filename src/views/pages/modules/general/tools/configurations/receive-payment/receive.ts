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
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import $global from "@/utils/global";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import InputForm from "./receive-input-form/receive-input-form.vue";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import ReceiveAPI from "@/services/api/accounting/receive-payment/receive";
import PaymentAPI from "@/services/api/accounting/receive-payment/payment";
import {
  generateTotalFooterAgGrid,
  generateIconContextMenuAgGrid,
  getError,
} from "@/utils/general";
import DetailCellRender from "./detail-receive/detail-receive.vue";
import { getToastSuccess } from "@/utils/toast";
const receiveAPI = new ReceiveAPI();
const paymentAPI = new PaymentAPI();

@Options({
  components: {
    AgGridVue,
    CDialog,
    SearchFilter,
    InputForm,
    DetailCellRender,
  },
})
export default class Receive extends Vue {
  // public resourceAPI:any = this.$route.meta.isPayment ? paymentAPI : receiveAPI;
  public resourceAPI: any;

  public id = 0;
  public rowData: any = [];
  public inputFormData: any = [];
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  public duplicateData: any = {};
  public inputFormElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  searchDefault: any = {
    index: 0,
    text: "",
    start_date: "",
    end_date: "",
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
  refreshData(search: any) {
    this.loadData(search);
  }

  generateId(rowData: any) {
    for (const i in rowData) {
      rowData[i].id = this.id++;
      rowData[i].amount = parseFloat(rowData[i].amount);
    }
    return rowData;
  }
  // END GENERAL FUNCTION ============================================================

  // HANDLE UI =======================================================================
  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    await this.loadDropdown();
    // await this.loadDropdownGL(params);
    await this.loadDetailData(params.ref_number);
    this.inputFormElement.initialize();
    console.log(this.inputFormData);

    // console.log(params);
    await this.loadEditData(params.ref_number);
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.ref_number;
  }

  async handleDuplicate(params: any) {
    this.modeData = $global.modeData.duplicate;
    await this.loadDropdown();
    // await this.loadDropdownGL(params);
    await this.loadDetailData(params.ref_number);
    await this.loadEditData(params.ref_number);
  }

  async handleInsert(params: any) {
    this.modeData = $global.modeData.insert;
    await this.loadDropdown();
    // await this.loadDropdownGL(params);
    await this.loadDetailData(params.ref_number);
    await this.loadEditData(params.ref_number);
  }

  async handleShowForm(params: any, mode: any) {
    this.id = 0;
    await this.loadDropdown();
    // await this.loadDropdownGL(params);
    this.inputFormData = [];
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
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
  async loadData(search: any = this.searchDefault) {
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
      };
      const { data } = await this.resourceAPI.GetReceivePaymentList(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }
  async loadEditData(params: any) {
    try {
      let inputForm: any = {};
      const { data } = await this.resourceAPI.GetReceivePayment(params);
      // this.inputFormElement.form = data.Data
      (inputForm.ref_number = params),
        (inputForm.date = data.Data.date),
        (inputForm.remark = data.Data.memo),
        (inputForm.company_code = data.Data.company_code),
        (inputForm.sub_department_code = data.Detail[0].sub_department_code),
        (inputForm.journal_account_code = data.Detail[0].account_code);

      this.inputFormElement.form = inputForm;
      // console.log(inputForm);

      this.showForm = true;
    } catch (error) {
      // getError(error)
    }
  }
  async loadDropdown() {
    try {
      const params = {};
      const { data } = await this.resourceAPI.GetReceivePaymentComboList(
        params
      );
      this.inputFormElement.listDropdown = data;
    } catch (error: any) {
      getError(error);
    }
  }
  // async loadDropdownGL(params: any) {
  //   try {
  //     let params = {
  //       SubDepartmentCode: "ACCN",
  //     };
  //     const { data } = await this.resourceAPI.GetGLAccountList(params);
  //     this.inputFormElement.listDropdownGL = data;
  //   } catch (error: any) {
  //     getError(error);
  //   }
  // }
  async loadDetailData(params: any) {
    try {
      const { data } = await this.resourceAPI.GetReceivePayment(params);
      this.inputFormElement.getData(this.generateId(data.Detail.slice(1)));
      // this.inputFormData = this.generateId(data.Detail.slice(1));
      // console.log(this.inputFormData);
    } catch (error) {
      getError(error);
    }
  }
  async insertData(formData: any) {
    console.log(formData);
    try {
      const { status2 } = await this.resourceAPI.InsertReceivePayment(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadData(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    }
  }
  async deleteData() {
    try {
      const { status2 } = await this.resourceAPI.DeleteReceivePayment(
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
  async updateData(formData: any) {
    console.log(formData);
    try {
      const { status2 } = await this.resourceAPI.UpdateReceivePayment(formData);
      if (status2.status == 0) {
        this.loadData(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================

  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.refNumber"), value: 0 },
      { text: this.$t("commons.filter.company"), value: 1 },
      { text: this.$t("commons.filter.memo"), value: 2 },
      { text: this.$t("commons.filter.lastUpdate"), value: 3 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
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
        cellClass: "action-grid-buttons",
        width: 120,
        headerClass: "align-header-center-suppress-menu",
      },
      {
        headerName: this.$t("commons.table.refNumber"),
        field: "ref_number",
        cellRenderer: "agGroupCellRenderer",
        width: 130,
      },
      { headerName: this.$t("commons.table.id"), field: "id", width: 80 },
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
      { headerName: this.$t("commons.table.memo"), field: "memo", width: 130 },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
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
        headerClass: "align-header-center ",
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

  mounted() {
    this.resourceAPI = this.$route.meta.isPayment ? paymentAPI : receiveAPI;

    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER FUNCTION ======================================================
  // END GETTER AND SETTER FUNCTION ==================================================
}
