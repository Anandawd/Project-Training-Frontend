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
import InputForm from "./purchase-order-input-form/purchase-order-input-form.vue";
import CDialog from "@/components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import PurchaseOrderAPI from "@/services/api/assets/purchase-order/purchase-order";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import DetailCellRender from "./detail-purchase/detail-purchase.vue";
import { getToastSuccess } from "@/utils/toast";
const purchaseOrderAPI = new PurchaseOrderAPI();

@Options({
  components: {
    AgGridVue,
    CDialog,
    SearchFilter,
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
  refreshData(search: any) {
    this.loadData(search);
  }
  // END GENERAL FUNCTION ============================================================

  // HANDLE UI =======================================================================
  async handleShowForm(params: any, mode: any) {
    await this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
    this.inputFormElement.initialize();
  }

  async handleDuplicate(params: any) {
    this.modeData = $global.modeData.duplicate;
    await this.loadDropdown();
    this.inputFormElement.initialize();
    await this.loadEditData(params.id);
  }

  async handleInsert(params: any) {
    this.modeData = $global.modeData.insert;
    await this.loadDropdown();
    this.inputFormElement.initialize();
    await this.loadEditData(params.id);
  }

  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    await this.loadDropdown();
    this.inputFormElement.initialize();
    this.loadEditData(params.id);
    // console.log(params.number);

    // console.log(params);
  }

  handleSave(formData: any) {
    if (
      this.modeData == $global.modeData.insert ||
      this.modeData == $global.modeData.duplicate
    ) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    }
  }
  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
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
        Status: search.filter[0],
      };
      const { data } = await purchaseOrderAPI.GetPurchaseOrderList(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }
  async loadDropdown() {
    try {
      const params = {};
      const { data } = await purchaseOrderAPI.GetPurchaseOrderComboList(params);
      this.inputFormElement.listDropdown = data;
    } catch (error: any) {
      getError(error);
    }
  }
  async loadEditData(params: any) {
    try {
      const { data } = await purchaseOrderAPI.GetPurchaseOrder(params);
      this.inputFormElement.onEdit(data);
      this.number = data.number;
      this.formId = data.data.id;
      // this.number = data.Data.ref_number
      console.log(data);
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }
  async insertData(formData: any) {
    console.log(formData);
    try {
      const { status2 } = await purchaseOrderAPI.InsertPurchaseOrder(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadData(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    }
  }
  async updateData(formData: any) {
    console.log(formData);
    try {
      formData.number = this.number;
      formData.id = this.formId;
      console.log(formData.number);

      const { status2 } = await purchaseOrderAPI.UpdatePurchaseOrder(formData);
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
      const { status2 } = await purchaseOrderAPI.DeletePurchaseOrder(
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
      { text: this.$t("commons.filter.prNumber"), value: 1 },
      { text: this.$t("commons.filter.date"), value: 2 },
      { text: this.$t("commons.filter.supplier"), value: 3 },
      { text: this.$t("commons.filter.shippingAddress"), value: 4 },
      { text: this.$t("commons.filter.contactPerson"), value: 5 },
      { text: this.$t("commons.filter.address"), value: 6 },
      { text: this.$t("commons.filter.phone"), value: 7 },
      { text: this.$t("commons.filter.fax"), value: 8 },
      { text: this.$t("commons.filter.email"), value: 9 },
      { text: this.$t("commons.filter.requestedBy"), value: 10 },
      { text: this.$t("commons.filter.remark"), value: 11 },
      { text: this.$t("commons.filter.lastUpdate"), value: 12 },
    ];

    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: true,
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
        width: 130,
        cellClass: "action-grid-buttons",
        headerClass: "align-header-center-suppress-menu",
      },
      {
        headerName: this.$t("commons.table.number"),
        field: "number",
        cellRenderer: "agGroupCellRenderer",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.prNumber"),
        field: "pr_number",
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
        headerName: this.$t("commons.table.supplier"),
        field: "company_code",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.expedition"),
        field: "Expedition",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.shippingAddress"),
        field: "ShippingAddress",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.contactPerson"),
        field: "contact_person",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.address"),
        field: "Address",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.phone"),
        field: "Phone",
        width: 130,
      },
      { headerName: this.$t("commons.table.fax"), field: "fax", width: 130 },
      {
        headerName: this.$t("commons.table.email"),
        field: "email",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.requestedBy"),
        field: "request_by",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
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
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
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
