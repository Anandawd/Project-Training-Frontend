import { Options, Vue, prop } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CSelect from "@/components/select/select.vue";
import Credential from "../credential/credential.vue";
import CDropdown from "@/components/dropdown/dropdown.vue";
import ConfigStore from "../../../../stores/config";
import CorrectionForm from "../correction-from/correction-from.vue";
import ChangeCorrectionDateForm from "../transaction/components/change-correction_date/change-correction_date.vue";
//API
import DepositAPI from "../../../../services/api/hotel/reservation/deposit";

//component ag-grid
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import DepositForm from "./components/deposit-form/deposit-form.vue";
import ChecklistIcon from "@/components/ag_grid-framework/checklist.vue";
import TransactionAPI from "@/services/api/transaction";

//helper
import {
  generateIconContextMenuAgGrid,
  generatePinnedBottomDataTotal,
  generateTotalFooterAgGrid,
  getError,
  getUserAccessUtility,
  printPreview,
} from "@/utils/general";
import { AgGridVue } from "ag-grid-vue3";
import $global from "@/utils/global";
import {
  formatDateTime,
  formatNumber,
  formatDate,
  formatNumberValue,
  formatDateDatabase,
} from "@/utils/format";
import { ref } from "vue";
import { getToastInfo, getToastSuccess } from "@/utils/toast";
import trackingDataModule from "@/stores/tracking-data";
import authModule from "@/stores/auth";
const configStore = ConfigStore();
const depositAPI = new DepositAPI();
const transactionAPI = new TransactionAPI();
@Options({
  components: {
    CDropdown,
    DepositForm,
    Credential,
    CorrectionForm,
    CSelect,
    CDatepicker,
    CInput,
    ChangeCorrectionDateForm,
    AgGridVue,
  },
  props: {
    titleForm: String,
    table: Boolean,
    dataLookUp: Array,
    total: Array,
    showVoid: Boolean,
    showCorrection: Boolean,
    userAccess: Object,
    reservationNumber: Number,
    reservationData: Object,
    isBanquet: Boolean,
    bnqFormType: {
      type: String,
      default: "",
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    "depositForm.showDepositForm"(val) {
      this.showForm = val;
    },
  },
})
export default class Deposit extends Vue {
  public rowData: any[] = null;
  public idData: any = {};
  public reservationNumber: number;
  public showCredential: boolean = false;
  public isShowCorrection: boolean = false;
  public isShowVoid: boolean = false;
  public auth = authModule();
  public form: any = {
    userId: "",
    password: "",
  };
  public getUserAccessUtility = getUserAccessUtility;
  public formType: number = 0;
  bnqFormType: string;
  public balance: number | string = 0;
  public depositForm: any = ref();
  public showForm: boolean = false;
  public credentialForm: any = {};
  public credential: any;
  public credentialElement: any = ref();
  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    subFolioGroup: [],
    cardType: [],
    transferType: [
      { Code: "F", Name: "Folio" },
      { Code: "R", Name: "Reservation" },
    ],
  };
  isBanquet: boolean;
  public dropdownRef: any = ref();
  // AG GRID Variable
  public rowTotal: any;
  gridOptions: any;
  rowClassRules: any;
  columnDefs: any[];
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  paginationPageSize: number;
  rowSelection: string;
  rowModelType: string;
  bottomRowTotal: any;
  total: any;
  gridApi: any;
  paramsData: any = {};
  userAccess: any;
  global: any;
  credentialTitle: any;
  gridColumnApi: any;
  depositId: any;
  outstanding: number;
  showCorrectionForm: boolean = false;
  public statusBar: any = {};
  subDepartmentCode: any = "";
  remark: any = "";
  documentNumber: any = "";
  showDialogUpdateSubDepartment: boolean = false;
  showDialogUpdateRemark: boolean = false;
  showDialogUpdateDocumentNumber: boolean = false;
  isSaving: boolean;
  showChangeCorrectionForm: boolean = false;
  reservationData: any;
  userID: any;
  rowDataFiltered: any = [];

  async beforeMount() {
    this.rowClassRules = {
      correction: "data !== undefined && data.is_correction",
      void: "data !== undefined && data.void",
    };
    // ------------------need setting manual for column table-----------------//

    this.gridOptions = {
      actionGrid: {
        menu: true,
        void: true,
        correction: true,
      },
      ...$global.agGrid.defaultGridOptions,
      // }
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
        width: 100,
      },
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 100,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("transaction.table.account"),
        field: "AccountName",
        width: 250,
      },
      {
        headerName: this.$t("transaction.table.debit"),
        field: "Debit",
        width: 100,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
        headerClass: "align-header-right",
        pinnedRowCellRendererParams: { style: { fontWeight: "bold" } },
      },
      {
        headerName: this.$t("transaction.table.credit"),
        field: "Credit",
        width: 100,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("transaction.table.remark"),
        field: "remark",
        width: 250,
      },
      {
        headerName: this.$t("transaction.table.currency"),
        field: "default_currency_code",
        width: 100,
      },
      {
        headerName: this.$t("transaction.table.debitForeign"),
        field: "DebitForeign",
        width: 122,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("transaction.table.creditForeign"),
        field: "CreditForeign",
        width: 122,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("transaction.table.currencyForeign"),
        field: "currency_code",
        width: 105,
      },
      {
        headerName: this.$t("transaction.table.exchangeRate"),
        field: "exchange_rate",
        width: 105,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("transaction.table.type"),
        field: "type",
        width: 90,
      },
      {
        headerName: this.$t("transaction.table.documentNumber"),
        field: "document_number",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.subDepartment"),
        field: "SubDepartmentName",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.void"),
        field: "void",
        width: 90,
        cellStyle: { textAlign: "center" },
        pinnedRowCellRendererParams: { style: { display: "none" } },
        cellRenderer: "checklistRenderer",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("transaction.table.correction"),
        field: "is_correction",
        width: 105,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
        headerClass: "align-header-center",
        pinnedRowCellRendererParams: { style: { display: "none" } },
      },
      {
        headerName: this.$t("transaction.table.refNumber"),
        field: "ref_number",
        width: 130,
      },
      {
        headerName: this.$t("transaction.table.insertBy"),
        field: "created_by",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.voidDate"),
        field: "void_date",
        width: 150,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
      },
      {
        headerName: this.$t("transaction.table.voidBy"),
        field: "void_by",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.voidReason"),
        field: "void_reason",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.lastUpdate"),
        field: "updated_by",
        width: 150,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklistRenderer: ChecklistIcon,
    };
    this.paginationPageSize = $global.agGrid.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.statusBar = $global.agGrid.statusBar;
  }

  async mounted() {
    const auth: any = authModule();
    const user = await auth.user;
    this.userID = user.ID;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFilterChanged() {
    this.rowDataFiltered = [];
    this.gridApi.forEachNodeAfterFilter((val: any) => {
      this.rowDataFiltered.push(val.data);
    });
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  onPageSizeChanged(newPageSize: number) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  getRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { "font-weight": "bold" };
    }
  }

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    //TODO add user access
    const result: any =
      this.bnqFormType == $global.formType.booking
        ? [
            {
              name: this.$t("commons.contextMenu.cashPayment"),
              icon: generateIconContextMenuAgGrid("cash_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.cash,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.cash),
            },
            {
              name: this.$t("commons.contextMenu.cashRefund"),
              icon: generateIconContextMenuAgGrid("cash_refund_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.refund,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.refund),
            },
            {
              name: this.$t("commons.contextMenu.creditOrDebitCardPayment"),
              icon: generateIconContextMenuAgGrid("card_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.card,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.card),
            },
            {
              name: this.$t("commons.contextMenu.otherPayment"),
              icon: generateIconContextMenuAgGrid("other_payment_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.insert,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.other),
            },
            {
              name: this.$t("commons.contextMenu.transfer"),
              icon: generateIconContextMenuAgGrid("transfer_icon24"),
              disabled:
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit.transfer,
                  this.userID
                ) || this.bnqFormType == $global.formType.booking,
              action: () => this.onClickPayment($global.modeDeposit.transfer),
            },
            {
              name: this.$t("commons.contextMenu.void"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit.void,
                  this.userID
                ),
              icon: generateIconContextMenuAgGrid("delete_icon24"),
              action: () => this.handleCorrectionVoid(this.paramsData, false),
            },
            {
              name: this.$t("commons.contextMenu.correction"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit.correction,
                  this.userID
                ),
              icon: generateIconContextMenuAgGrid("correction_icon24"),
              action: () => this.handleCorrectionVoid(this.paramsData, true),
            },
            {
              name: this.$t("commons.contextMenu.schedulePayment"),
              disabled: !this.paramsData,
              // icon: generateIconContextMenuAgGrid("print_icon24"),
              // action: () => this.handlePrintReceipt(this.paramsData),
            },
            {
              name: this.$t("commons.contextMenu.printSchedulePayment"),
              disabled: !this.paramsData,
              icon: generateIconContextMenuAgGrid("print_icon24"),
              // action: () => this.handlePrintReceipt(this.paramsData),
            },
            {
              name: this.$t("commons.contextMenu.printDepositReceipt"),
              disabled: !this.paramsData,
              icon: generateIconContextMenuAgGrid("print_icon24"),
              // action: () => this.handlePrintReceipt(this.paramsData),
            },
            "separator",
            {
              name: this.$t("commons.contextMenu.trackingData"),
              icon: generateIconContextMenuAgGrid("tracking_icon24"),
              disabled: !this.paramsData,
              action: () =>
                this.handleTrackingData(
                  this.$global.tableName.guestDeposit,
                  this.paramsData.id
                ),
            },
          ]
        : [
            {
              name: this.$t("commons.contextMenu.cashPayment"),
              icon: generateIconContextMenuAgGrid("cash_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.cash,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.cash),
            },
            {
              name: this.$t("commons.contextMenu.cashRefund"),
              icon: generateIconContextMenuAgGrid("cash_refund_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.refund,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.refund),
            },
            {
              name: this.$t("commons.contextMenu.creditOrDebitCardPayment"),
              icon: generateIconContextMenuAgGrid("card_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.card,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.card),
            },
            {
              name: this.$t("commons.contextMenu.otherPayment"),
              icon: generateIconContextMenuAgGrid("other_payment_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.insert,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.other),
            },
            {
              name: this.$t("commons.contextMenu.transfer"),
              icon: generateIconContextMenuAgGrid("transfer_icon24"),
              disabled: !getUserAccessUtility(
                this.userAccessDeposit,
                $global.frontDeskAccessOrder.accessDeposit.transfer,
                this.userID
              ),
              action: () => this.onClickPayment($global.modeDeposit.transfer),
            },
            {
              name: this.$t("commons.contextMenu.printDepositReceipt"),
              disabled: !this.paramsData,
              icon: generateIconContextMenuAgGrid("print_icon24"),
              action: () => this.handlePrintReceipt(this.paramsData),
            },
            "separator",
            {
              name: this.$t("commons.contextMenu.void"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit.void,
                  this.userID
                ),
              icon: generateIconContextMenuAgGrid("delete_icon24"),
              action: () => this.handleCorrectionVoid(this.paramsData, false),
            },
            {
              name: this.$t("commons.contextMenu.correction"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit.correction,
                  this.userID
                ),
              icon: generateIconContextMenuAgGrid("correction_icon24"),
              action: () => this.handleCorrectionVoid(this.paramsData, true),
            },
            {
              name: this.$t("commons.contextMenu.changeCorrectionDate"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit
                    .changeCorrectionDate,
                  this.userID
                ) ||
                !(
                  this.reservationData.ReservationData.status_code ==
                    $global.reservationStatus.checkOut ||
                  this.reservationData.ReservationData.status_code ==
                    $global.reservationStatus.cancel ||
                  this.reservationData.ReservationData.status_code ==
                    $global.reservationStatus.noShow
                ), // || !this.userAccess.correction,
              icon: generateIconContextMenuAgGrid("correction_icon24"),
              action: () => this.handleChangeCorrectionDate(this.paramsData),
            },
            "separator",
            {
              name: this.$t("commons.contextMenu.updateSubDepartment"),
              icon: generateIconContextMenuAgGrid("edit_icon24"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit
                    .updateSubDepartment,
                  this.userID
                ),
              action: () => this.handleUpdateSubDepartment(this.paramsData),
            },
            {
              name: this.$t("commons.contextMenu.updateRemark"),
              icon: generateIconContextMenuAgGrid("edit_icon24"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit.updateRemark,
                  this.userID
                ),
              action: () => this.handleUpdateRemark(this.paramsData),
            },
            {
              name: this.$t("commons.contextMenu.updateDocumentNumber"),
              icon: generateIconContextMenuAgGrid("edit_icon24"),
              disabled:
                !this.paramsData ||
                !getUserAccessUtility(
                  this.userAccessDeposit,
                  $global.frontDeskAccessOrder.accessDeposit
                    .updateDocumentNumber,
                  this.userID
                ),
              action: () => this.handleUpdateDocumentNumber(this.paramsData),
            },
            {
              name: this.$t("commons.contextMenu.trackingData"),
              icon: generateIconContextMenuAgGrid("tracking_icon24"),
              disabled: !this.paramsData,
              action: () =>
                this.handleTrackingData(
                  this.$global.tableName.guestDeposit,
                  this.paramsData.id
                ),
            },
          ];
    return result;
  }

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
  }

  handlePrintReceipt(paramsData: any) {
    // throw new Error("Method not implemented.");
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.DepositReceipt}&param=${paramsData.id}&template=${$global.stimulsoftReportFileDirectory.depositReceipt}`
    );
    printPreview(newTabReport.href);
  }

  handleUpdateType(paramsData: any, arg1: number) {
    if (
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.updateRemark,
        this.userID
      )
    )
      return;
    throw new Error("Method not implemented.");
  }

  async onSaveCredential(form: any) {
    this.credentialForm = form;
    if (
      form.access_mode ==
      $global.frontDeskAccessOrder.accessSpecial.correctDeposit
    ) {
      return (this.showCorrectionForm = true);
    }
    if (this.isShowCorrection) {
      await this.voidDeposit(form.userId, form.reason);
    } else {
      await this.voidDepositByCorrectionId(form.userId, form.reason);
    }
    this.onRefreshData();
    this.showCredential = false;
  }

  handleMenu(params: any) {
    this.paramsData = params;
  }

  async handleCorrectionVoid(paramsData: any, isCorrection: boolean) {
    if (paramsData.void) {
      return getToastInfo("This transaction is already voided!");
    }
    if (!(await this.isCanVoidOrCorrect(paramsData))) {
      return;
    }
    if (
      formatDateDatabase(this.auditDate) ==
      formatDateDatabase(paramsData.audit_date)
    ) {
      if (isCorrection) {
        if (
          !getUserAccessUtility(
            this.userAccessDeposit,
            $global.frontDeskAccessOrder.accessDeposit.correction,
            this.userID
          )
        )
          return;
        //TODO add transalate to this
        return getToastInfo("Cannot correction this transaction.");
      } else {
        if (
          !getUserAccessUtility(
            this.userAccessDeposit,
            $global.frontDeskAccessOrder.accessDeposit.void,
            this.userID
          )
        )
          return;
      }
    } else {
      if (!isCorrection) return getToastInfo("Cannot void this transaction.");
    }
    this.paramsData = paramsData;
    this.credentialElement.showCredential({
      show: true,
      showReason: true,
      title:
        (isCorrection
          ? this.$t("credential.title.correction")
          : this.$t("credential.title.void")) + paramsData.id,
      accessType: $global.userAccessType.special,
      accessMode: isCorrection
        ? $global.frontDeskAccessOrder.accessSpecial.correctDeposit
        : $global.frontDeskAccessOrder.accessSpecial.voidDeposit,
      onVerified: (form: any) => {
        this.onSaveCredential(form);
      },
    });
  }

  handleChangeCorrectionDate(paramData: any) {
    if (
      !(
        this.reservationData.ReservationData.status_code ==
          $global.reservationStatus.checkOut ||
        this.reservationData.ReservationData.status_code ==
          $global.reservationStatus.cancel ||
        this.reservationData.ReservationData.status_code ==
          $global.reservationStatus.noShow
      )
    )
      return;

    if (
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.changeCorrectionDate,
        this.userID
      )
    )
      return;
    this.showChangeCorrectionForm = true;
  }

  async handleUpdateSubDepartment(paramsData: any) {
    this.subDepartmentCode = paramsData.sub_department_code;
    await this.loadSubDepartment(true);
  }

  async handleUpdateRemark(paramsData: any) {
    this.remark = paramsData.remark;
    this.showDialogUpdateRemark = true;
  }

  async handleUpdateDocumentNumber(paramsData: any) {
    this.documentNumber = paramsData.document_number;
    this.showDialogUpdateDocumentNumber = true;
  }

  async onClickPayment(type: number) {
    if (
      type == $global.modeDeposit.cash &&
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.cash,
        this.userID
      )
    )
      return;
    if (
      type == $global.modeDeposit.card &&
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.card,
        this.userID
      )
    )
      return;
    if (
      type == $global.modeDeposit.transfer &&
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.transfer,
        this.userID
      )
    )
      return;
    if (
      type == $global.modeDeposit.refund &&
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.refund,
        this.userID
      )
    )
      return;
    if (
      type == $global.modeDeposit.other &&
      !getUserAccessUtility(
        this.userAccessDeposit,
        $global.frontDeskAccessOrder.accessDeposit.insert,
        this.userID
      )
    )
      return;
    this.formType = type;
    this.depositForm.initialize(type);
    this.dropdownRef.isOpen = false;
  }

  onClickSave() {
    this.depositForm.$el.requestSubmit();
  }

  async onRefreshData(reservationNumber?: number) {
    const number =
      reservationNumber > 0 ? reservationNumber : this.reservationNumber;
    await this.getDepositList(number);
    if (reservationNumber > 0 && reservationNumber !== this.reservationNumber)
      this.reservationNumber = reservationNumber;

    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
    this.balance = this.getBalance();

    if (this.isBanquet) {
      this.$emit("refresh");
    }
  }

  onSaveCorrection() {
    this.showCorrectionForm = false;
    this.onRefreshData();
  }

  // API REQUEST
  async getDepositList(reservationNumber: number) {
    this.gridApi.showLoadingOverlay();
    try {
      const params = {
        ReservationNumber: reservationNumber,
        SystemCode: this.isBanquet
          ? $global.systemCode.Banquet
          : $global.defaultSystemCode,
        Void: this.isShowVoid,
        ShowCorrection: this.isShowCorrection,
      };
      const { data } = await depositAPI.getDepositReservationList(params);
      this.rowData = data ? data : [];
      this.$emit("getDepositList", this.rowData);
    } catch (err) {
      getError(err);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
    this.gridApi.hideOverlay();
  }

  async voidDeposit(userId: string, reason: string) {
    try {
      const params = {
        GuestDepositId: this.paramsData.id,
        VoidBy: userId,
        VoidReason: reason,
      };
      const { data } = await depositAPI.voidDeposit(params);
      if (data == 0) getToastSuccess(`ID: ${this.depositId} has been voided`);
    } catch (err) {
      getError(err);
    }
  }

  async loadSubDepartment(showDialog: boolean) {
    try {
      const { data } = await depositAPI.codeNameList("SubDepartment");
      this.options.subDepartments = data;
      if (showDialog) this.showDialogUpdateSubDepartment = true;
    } catch (err) {
      getError(err);
    }
  }

  async voidDepositByCorrectionId(userId: string, reason: string) {
    try {
      const params = {
        CorrectionBreakdown: this.paramsData.correction_breakdown,
        VoidBy: userId,
        VoidReason: reason,
      };
      const { data } = await depositAPI.voidDepositByCorrectionId(params);
      if (data == 0) getToastSuccess(`ID: ${this.depositId} has been voided`);
    } catch (err) {
      getError(err);
    }
  }

  async isCanVoidOrCorrect(paramsData: any) {
    let result = false;
    this.isSaving = true;
    try {
      const params = {
        AccountCode: paramsData.account_code,
        TransactionID: paramsData.id,
        IsDeposit: true,
      };
      const { data, status2 } = await transactionAPI.isCanVoidOrCorrect(params);
      result = data;
      if (
        status2.message != "" &&
        status2.message != undefined &&
        status2.message != null
      ) {
        getToastInfo(status2.message);
      }
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
    return result;
  }

  async updateSubDepartment() {
    if (
      this.isSaving ||
      this.subDepartmentCode == "" ||
      this.paramsData.id <= 0
    )
      return;
    this.isSaving = true;
    try {
      const params = {
        code: this.subDepartmentCode,
        id: this.paramsData.id,
      };
      await depositAPI.updateSubDepartment(params);
      getToastSuccess();
      this.onRefreshData();
      this.showDialogUpdateSubDepartment = false;
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
  }

  async updateRemark() {
    if (this.isSaving || this.paramsData.id <= 0) return;
    this.isSaving = true;
    try {
      const params = {
        remark: this.remark,
        id: this.paramsData.id,
      };
      await depositAPI.updateRemark(params);
      getToastSuccess();
      this.onRefreshData();
      this.showDialogUpdateRemark = false;
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
  }

  async updateDocumentNumber() {
    if (this.isSaving || this.paramsData.id <= 0) return;
    this.isSaving = true;
    try {
      const params = {
        document_number: this.documentNumber,
        id: this.paramsData.id,
      };
      await depositAPI.updateDocumentNumber(params);
      getToastSuccess();
      this.onRefreshData();
      this.showDialogUpdateDocumentNumber = false;
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
  }

  // API END

  getBalance() {
    let total = 0;
    if (this.rowTotal)
      total =
        parseFloat(this.rowTotal.Credit) - parseFloat(this.rowTotal.Debit);
    if (isNaN(total)) total = 0;
    return formatNumberValue(total);
  }

  get auditDate() {
    return configStore.auditDate;
  }

  get userAccessDeposit() {
    return this.auth.frontDeskAccessUtility.depositTools ?? "";
  }

  get pinnedBottomRowData() {
    const data =
      this.rowDataFiltered.length > 0 ? this.rowDataFiltered : this.rowData;
    return generateTotalFooterAgGrid(data, this.columnDefs);
  }
}
