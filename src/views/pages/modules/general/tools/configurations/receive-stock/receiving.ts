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
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import ActionDuplicate from "@/components/ag_grid-framework/action_grid_duplicate.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import $global from "@/utils/global";
import InputForm from "./receive-stock-input-form/receiving-input-form.vue";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import ReceivingAPI from "@/services/api/assets/receive-stock/receive-stock";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import DetailCellRender from "./detail-receive/detail-receive.vue";
import { getToastSuccess } from "@/utils/toast";
const receivingAPI = new ReceivingAPI();

@Options({
  components: {
    AgGridVue,
    CDialog,
    SearchFilter,
    ActionDuplicate,
    InputForm,
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
  public number: any;
  public formId: any;
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
  // refreshData(search: any) {
  //   this.loadData(search);
  // }
  // END GENERAL FUNCTION ============================================================

  // HANDLE UI =======================================================================
  async handleShowForm(params: any, mode: any) {
    await this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
    this.inputFormElement.initialize();
  }

  // async handleDuplicate(params: any) {
  //   this.modeData = $global.modeData.duplicate;
  //   await this.loadDropdown();
  //   this.inputFormElement.initialize();
  //   await this.loadEditData(params.id);

  // }

  // async handleEdit(params: any) {
  //   this.modeData = $global.modeData.edit;
  //   await this.loadDropdown();
  //   this.inputFormElement.initialize();
  //   this.loadEditData(params.id);
  //   // console.log(params.number);

  //   // console.log(params);
  // }

  // handleSave(formData: any) {
  //   if (this.modeData == $global.modeData.insert || this.modeData == $global.modeData.duplicate) {
  //     this.insertData(formData);
  //   } else if (this.modeData == $global.modeData.edit) {
  //     this.updateData(formData);
  //   }
  // }
  // handleDelete(params: any) {
  //     this.showDialog = true;
  //     this.deleteParam = params.id;
  // }
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
      const { data } = await receivingAPI.GetReceivingList(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }
  async loadDropdown() {
    try {
      const params = {};
      const { data } = await receivingAPI.GetReceivingComboList(params);
      this.inputFormElement.listDropdown = data;
    } catch (error: any) {
      getError(error);
    }
  }
  // async loadEditData(params: any) {
  //   try {
  //     const { data } = await purchaseOrderAPI.GetPurchaseOrder(params);
  //     this.inputFormElement.onEdit(data)
  //     this.number = data.number
  //     this.formId = data.data.id
  //     // this.number = data.Data.ref_number
  //     console.log(data);
  //     this.showForm = true;
  //   } catch (error) {
  //     getError(error)
  //   }
  // }
  // async insertData(formData: any) {
  //   console.log(formData);
  //   try {
  //     const { status2 } = await purchaseOrderAPI.InsertPurchaseOrder(formData);
  //     if (status2.status == 0) {
  //       getToastSuccess(this.$t("messages.saveSuccess"));
  //       this.showForm = false;
  //       this.loadData(this.searchDefault);
  //     }
  //   } catch (error) {
  //     getError(error);
  //   }
  // }
  // async updateData(formData: any) {
  //   console.log(formData);
  //   try {
  //     formData.number = this.number
  //     formData.id = this.formId
  //     console.log(formData.number);

  //     const { status2 } = await purchaseOrderAPI.UpdatePurchaseOrder(formData);
  //     if (status2.status == 0) {
  //       this.loadData(this.searchDefault);
  //       this.showForm = false;
  //       getToastSuccess(this.$t("messages.saveSuccess"));
  //     }
  //   } catch (error) {
  //     getError(error);
  //   }
  // }
  // async deleteData() {
  //   try {
  //     const { status2 } = await purchaseOrderAPI.DeletePurchaseOrder(
  //       this.deleteParam
  //     );
  //     if (status2.status == 0) {
  //       this.loadData(this.searchDefault);
  //       this.showDialog = false;
  //       getToastSuccess(this.$t("messages.deleteSuccess"));
  //     }
  //   } catch (error) {
  //     getError(error);
  //   }
  // }
  // END API REQUEST==================================================================

  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.number"), value: 0 },
      { text: this.$t("commons.filter.refNumber"), value: 1 },
      { text: this.$t("commons.filter.poNumber"), value: 2 },
      { text: this.$t("commons.filter.supplier"), value: 3 },
      { text: this.$t("commons.filter.apNumber"), value: 4 },
      { text: this.$t("commons.filter.costingNumber"), value: 5 },
      { text: this.$t("commons.filter.remark"), value: 6 },
      { text: this.$t("commons.filter.lastUpdate"), value: 7 },
    ];

    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
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
        width: 130,
        headerClass: "align-header-center-suppress-menu",
      },
      {
        headerName: this.$t("commons.table.number"),
        field: "number",
        cellRenderer: "agGroupCellRenderer",
        width: 130,
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
        headerName: this.$t("commons.table.refNumber"),
        field: "ref_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.poNumber"),
        field: "po_number",
        width: 130,
      },

      {
        headerName: this.$t("commons.table.supplier"),
        field: "CompanyName",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.apNumber"),
        field: "ap_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.costingNumber"),
        field: "costing_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.invoiceNumber"),
        field: "invoice_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.amountPayment"),
        field: "amount_payment",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        width: 130,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.credit"),
        field: "is_credit",
        width: 130,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.dueDate"),
        field: "due_date",
        width: 130,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.paid"),
        field: "is_paid",
        width: 130,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
        headerClass: "align-header-center",
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
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        width: 120,
        headerClass: "align-header-center",
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
      actionGrid: ActionDuplicate,
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
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER FUNCTION ======================================================
  // END GETTER AND SETTER FUNCTION ==================================================
}
