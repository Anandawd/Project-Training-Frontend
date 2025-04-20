import { Options, Vue } from "vue-class-component";
import { ref, reactive, nextTick } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  formatDate,
  formatNumber,
  formatDateTimeUTC,
  formatDateTime,
  formatDateTimeDatabase,
  formatDateTimeZeroUTC,
} from "@/utils/format";
import $global from "@/utils/global";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import InputForm from "./input-form/input-form.vue";
import checklistVue from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import BookingApi from "@/services/api/banquet/booking";
import { getToastSuccess } from "@/utils/toast";
const bookingApi = new BookingApi();

@Options({
  components: {
    AgGridVue,
    InputForm,
    CDialog,
    SearchFilter,
  },
  props: {
    title: String,
  },
})
export default class SchedulePayment extends Vue {
  public form: any = reactive({});
  public isSaving: boolean = false;
  isLoading: boolean = false;
  searchDefault: any = {
    index: 0,
    text: "",
  };
  searchOptions: any = [];
  showForm: boolean = false;
  modeData: number = 0;
  rowData: any = [];
  title: string;
  inputFormElement: any = ref();
  showDialog: boolean = false;
  deletedId: number;
  id: any;
  paginationData: any = null;
  pagination: any = {};
  dataBooking: any = {};
  bookingNumber: any;
  columnOptionsPayment = [
    {
      label: "account",
      field: "Account",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "auditDate",
      field: "audit_date",
      align: "center",
      width: "100",
      format: "date",
      filter: true,
    },
    {
      label: "amount",
      field: "amount",
      format: "number",
      align: "right",
      width: "120",
      filter: true,
    },
    {
      label: "remark",
      field: "remark",
      align: "left",
      width: "150",
      filter: true,
    },
  ];
  // Ag grid variable
  getRowId: any;
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
  // GENERAL FUNCTION ================================================================
  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  onClose() {
    this.rowData = [];
    this.$emit("close");
  }

  onPaginationChange(data: any) {
    this.pagination = data;
    this.refreshData(this.searchDefault);
  }

  refreshData(search: any) {
    if (search) {
      this.searchDefault = search;
      this.loadData(this.searchDefault);
    }
  }

  async initialize(params: any) {
    this.dataBooking = params;
    this.searchDefault.text = params.number ?? "";
    await this.loadData(this.searchDefault);
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    formData.date = formatDateTimeUTC(formData.date);
    formData.amount = parseFloat(formData.amount);
    if (
      this.modeData == $global.modeData.insert ||
      this.modeData == $global.modeData.duplicate
    ) {
      await this.insertData(formData);
    } else {
      await this.updateData(formData);
    }
    this.isSaving = false;
  }

  handleDelete(param: any) {
    this.showDialog = true;
    this.deletedId = param.id;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
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
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.duplicate),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        // action: () =>
        // this.handleTrackingData(
        //   this.$global.tableName.guestLoanItem,
        //   this.paramsData.id
        // ),
      },
    ];
    return result;
  }

  handleRowRightClicked(params: any) {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.number == vm.paramsData.number) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  handleInsert() {
    this.handleShowForm("", $global.modeData.insert);
  }
  handleDuplicate(params: any) {
    this.handleShowForm(params, $global.modeData.duplicate);
  }
  handleEdit(params: any) {
    this.id = params.id;
    this.handleShowForm(params, $global.modeData.edit);
  }

  async handleShowForm(param: any, modeData: number) {
    let loader = this.$loading.show();
    this.bookingNumber = this.dataBooking.number;
    this.modeData = modeData;
    await this.$nextTick(() => {
      this.loadBookingDepositList(this.dataBooking.number);
      this.form = {
        amount: 0,
        booking_number: this.dataBooking.number,
        guest_deposit_id: "",
      };
    });
    if (
      modeData == $global.modeData.edit ||
      modeData == $global.modeData.duplicate
    ) {
      await this.editData(param.id);
    } else {
      this.inputFormElement.initialize();
    }
    this.showForm = true;
    loader.hide();
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    this.rowData = [];
    const selectedRow = this.gridApi.getSelectedRows();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    this.gridApi.showLoadingOverlay();
    try {
      const params = {
        Index: search.index,
        Text: search.text,
        Limit: this.pagination.limit,
        Page: this.pagination.page,
      };
      const { data } = await bookingApi.getSchedulePaymentList(params);
      this.rowData = data ? data.List : [];
      this.paginationData = data;
      this.$nextTick(() => {
        rowSelectedAfterRefresh(this, null, selectedRow[0], "id", rowNodes);
      });
    } catch (error: any) {
      this.rowData = [];
      throw getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await bookingApi.insertSchedulePayment(formData);
      if (status2.status == 0) {
        this.showForm = false;
        this.loadData(this.searchDefault);
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async editData(id: any) {
    try {
      const { data } = await bookingApi.getSchedulePayment(id);
      this.inputFormElement.onEdit(data);
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await bookingApi.updateSchedulePayment(formData);
      if (status2.status == 0) {
        this.showForm = false;
        this.loadData(this.searchDefault);
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadBookingDepositList(bookingNumber: any = this.bookingNumber) {
    try {
      const { data } = await bookingApi.getBookingDepositList(bookingNumber);
      this.inputFormElement.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    this.isLoading = true;
    try {
      const { status2 } = await bookingApi.deleteBookingSchedulePayment(
        this.deletedId
      );
      if (status2.status == 0) {
        this.showDialog = false;
        this.loadData(this.searchDefault);
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
    this.isLoading = false;
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.bookingNumber"), value: 0 },
    ];
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: true,
        edit: true,
        duplicate: true,
        delete: true,
      },
      rowSelection: "single",
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        resizable: false,
        filter: false,
        editable: false,
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        headerClass: "align-header-center-suppress-menu",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.isPaid"),
        field: "is_paid",
        width: 50,
        cellRenderer: "checklist",
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "name",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.date"),
        field: "date",
        width: 80,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 150,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.userId"),
        field: "id",
        width: 100,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: checklistVue,
    };
    this.agGridSetting = $global.agGrid;
    this.statusBar = $global.agGrid.statusBar;
    this.paginationPageSize = $global.agGrid.limitDefaultPageSize;
    this.rowModelType = "serverSide";
    this.limitPageSize = $global.agGrid.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }

  // END RECYCLE LIFE FUNCTION =======================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  // GETTER AND SETTER ===============================================================
  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
