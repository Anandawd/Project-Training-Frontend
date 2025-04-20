import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import { ref, reactive } from "vue";
import { Form } from "vee-validate";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CDropdown from "@/components/dropdown/dropdown.vue";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import CRadio from "@/components/radio/radio.vue";
import Credential from "@/views/pages/components/credential/credential.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import ReservationForm from "./components/reservation-form/reservation-form.vue";
import BanquetReservationAPI from "@/services/api/banquet/booking";
const banquetReservationAPI = new BanquetReservationAPI();
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";

@Options({
  components: {
    CCheckbox,
    AgGridVue,
    CDialog,
    CDropdown,
    SearchFilter,
    ReservationForm,
    CRadio,
    Form,
    CInput,
    Credential,
  },
  props: {
    formType: {
      type: String,
      require: true,
    },
    isUpdateResBV: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  emits: [""],
})
export default class ReservationListForm extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public dialogForm: any = reactive({});
  public modeData: any = 0;
  public isSaving: boolean = false;
  public showCredentialDialog: boolean = false;
  public disabledButton: boolean = false;
  public showDialog: boolean = false;
  public credentialElement: any = ref();
  reservationListElement: any = ref();
  reservationFormElement: any = ref();
  listDropdown: any = [];
  public searchDefault: any = {
    filter: ["0"],
  };
  detailCombine: boolean = false;
  bookingNumber: string;
  reservationNumber: string;
  BookingDate: string;
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
  showReservationForm: boolean = false;
  isUpdateResBV: boolean;
  formType: string;
  // GENERAL FUNCTION ================================================================
  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

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
        // disabled: this.disabledButton,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", this.$global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.cancel"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("cancel_icon24"),
        action: () => this.handleCancelForm($global.reservationStatus.cancel),
      },
      {
        name: this.$t("commons.contextMenu.noShow"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("no_show_icon24"),
        action: () => this.handleCancelForm($global.reservationStatus.noShow),
      },
      {
        name: this.$t("commons.contextMenu.void"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleCancelForm($global.reservationStatus.void),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        // action: () => this.handleTrackingData(this.$global.tableName.cfgInitCardBank, this.paramsData.id),
      },
    ];
    return result;
  }

  // onSaveReason() {

  // }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleRowRightClicked() {
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

  initialize(dataParent?: any) {
    this.showReservationForm = false;
    if (this.formType == $global.formType.banquetInProgress) {
      this.searchDefault.filter[0] = 1;
    }
    if (dataParent) {
      if (dataParent.BookingData) {
        // tambahan untuk banquet view
        if (dataParent.BookingData.status_code != "B") {
          this.disabledButton = true;
        }
      } else {
        this.disabledButton = false;
      }

      if (this.formType != $global.formType.banquetView) {
        this.BookingDate = dataParent.GuestDetailData.arrival;
      } else if (
        this.formType == $global.formType.banquetView &&
        this.isUpdateResBV
      )
        [(this.BookingDate = dataParent.start_date)];
      this.bookingNumber = this.isUpdateResBV
        ? dataParent.booking_number
        : dataParent.booking_number;
    }
    this.loadData();
  }

  refreshData() {
    this.searchDefault.filter[1] == 1
      ? (this.detailCombine = true)
      : (this.detailCombine = false);
    this.loadData();
  }

  async handleShowForm(params: any, mode: any) {
    await this.$nextTick(() => {
      this.reservationFormElement.initialize(this.BookingDate);
      this.loadDropdown();
      this.modeData = mode;
      if (mode == $global.modeData.insert) {
        this.showReservationForm = true;
      } else {
        let dataSelected = this.gridOptions.api.getSelectedRows();
        let number = dataSelected[0].number;
        this.editData(number);
      }
    });
  }

  async handleInsert() {
    this.handleShowForm("", $global.modeData.insert);
    // this.modeData = $global.modeData.insert
    // this.reservationFormElement.initialize()
    // this.showReservationForm = true
  }

  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    await this.$nextTick(() => {
      this.loadDropdown();
      this.editData(params.number);
    });
  }

  async handleDelete(params: any) {
    getToastError("Need API");
  }

  resetCDialogForm() {
    this.dialogForm = {
      reservation_number: 0,
      status_code: "",
      reason: "",
    };
  }

  async handleCancelForm(statusCode: any) {
    this.resetCDialogForm();
    this.dialogForm.status_code = statusCode;
    const selectedData = this.gridOptions.api.getSelectedRows();
    if (selectedData[0] == undefined || selectedData.length == 0) {
      getToastInfo(this.$t("message.selectOneData"));
      return;
    }
    this.dialogForm.reservation_number = selectedData[0].number;
    if (
      statusCode == $global.reservationStatus.cancel ||
      statusCode == $global.reservationStatus.noShow
    ) {
      this.showDialog = true;
    } else {
      // for voids
      // TODO: belum isi credential
      this.showDialog = true;
    }
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    let sendData = {
      booking_number: this.bookingNumber,
      theme_code: formData.theme_code,
      seating_plan_code: formData.seating_plan_code,
      is_inside: formData.is_inside,
      venue_code: formData.venue_code,
      notes: formData.notes,
      adult: formData.adult,
      child: formData.child,
      start_date: formatDateTimeUTC(formData.startDate),
      end_date: formatDateTimeUTC(formData.endDate),
    };

    if (this.modeData == $global.modeData.insert) {
      await this.insertData(sendData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(sendData);
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
        Option: search.filter[0],
        ShowDetailCombine: this.detailCombine,
      };
      const { data } = await banquetReservationAPI.getBookingReservationList(
        params,
        this.bookingNumber
      );
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async loadDropdown(param: string = "") {
    try {
      let params = ["Theme", "Venue", "SeatingPlan"];
      const { data } = await banquetReservationAPI.codeNameListArray(params);
      this.reservationFormElement.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await banquetReservationAPI.insertBookingReservation(
        formData
      );
      if (status2.status == 0) {
        this.showReservationForm = false;
        this.refreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async editData(code: any) {
    try {
      const { data } = await banquetReservationAPI.getBookingReservation(code);
      this.reservationNumber = data.number;
      this.showReservationForm = true;
      await this.reservationFormElement.onEdit(data);
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    formData.number = this.reservationNumber;
    try {
      const { status2 } = await banquetReservationAPI.updateBookingReservation(
        formData
      );
      if (status2.status == 0) {
        this.showReservationForm = false;
        this.refreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async cancelReservation(formData: any = this.dialogForm) {
    try {
      const { status2 } = await banquetReservationAPI.cancelBookingReservation(
        formData
      );
      if (status2.status == 0) {
        this.showDialog = false;
        this.refreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: this.formType == $global.formType.booking,
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
        resizable: false,
        filter: false,
        editable: false,
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        headerClass: "align-header-center-suppress-menu",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.number"),
        field: "number",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.venue"),
        field: "Venue",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.date"),
        field: "DateArrival",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.startTime"),
        field: "TimeArrival",
        width: 120,
        //  valueFormatter:  formatTimeValue,
        // filterParams: {
        //   valueFormatter: formatTimeValue,
        // },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.endTime"),
        field: "TimeDeparture",
        width: 120,
        //  valueFormatter:  formatTimeValue,
        // filterParams: {
        //   valueFormatter: formatTimeValue,
        // },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.theme"),
        field: "Theme",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.seatingPlan"),
        field: "SeatingPlan",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.adult"),
        field: "adult",
        width: 80,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.child"),
        field: "child",
        width: 80,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
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
      // iconLockRenderer: IconLockRenderer,
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
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showReservationForm;
  }
  // END GETTER AND SETTER ===========================================================
}
