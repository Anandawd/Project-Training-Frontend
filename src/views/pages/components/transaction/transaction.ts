import { Options, Vue, prop } from "vue-class-component";
// import { onActivated, onDeactivated } from "vue";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CDropdown from "@/components/dropdown/dropdown.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import StatusBarTotal from "./components/StatusBarTotal.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import GuestInHouseForm from "../../modules/hotel/guest-in-house/components/guestinhouse-form/guestinhouse-form.vue";
import FolioForm from "../folio-form/folio-form.vue";
import ChargeForm from "./components/charge/charge.vue";
import UtilityForm from "./components/utility/utility.vue";
import PaymentForm from "./components/payment/payment.vue";
import ChecklistRenderer from "@/components/ag_grid-framework/checklist.vue";
import PackageForm from "./components/package/package.vue";
import TransferForm from "./components/transfer/transfer.vue";
import VoucherForm from "./components/payment/components/voucher/voucher.vue";
import Credential from "../credential/credential.vue";
import CorrectionForm from "../correction-from/correction-from.vue";
import AdvancedCorrectionForm from "../advanced-correction-from/advanced-correction-from.vue";
import ChangeCorrectionDateForm from "./components/change-correction_date/change-correction_date.vue";
import CConfirmation from "../confirmation/confirmation.vue";
import { BDropdown, BDropdownItem, BDropdownDivider } from "bootstrap-vue-3";
import PrintFolioOption from "../print-folio-option/print-folio-option.vue";
import configStore from "@/stores/config";
import authModule from "@/stores/auth";
import Properties1 from "./components/properties1/properties1.vue";
//component ag-grid
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";

// banquet
import BookingApi from "@/services/api/banquet/booking";
import BanquetInProgressApi from "@/services/api/banquet/banquet-in-progress";

//helper
import {
  anyToFloat,
  cloneObject,
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
  getUserAccessUtility,
  handleRowRightClickedAgGrid,
  printPreview,
} from "@/utils/general";

import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import $global from "@/utils/global";
import {
  formatDateTime,
  formatNumber,
  formatNumberValue,
  formatDate,
  formatDateTime2,
  formatDateTimeUTC,
  formatDateDatabase,
  formatCurrency,
  countDecimalPlaces,
} from "@/utils/format";
import { reactive, ref } from "vue";
import TransactionAPI from "@/services/api/transaction";
import {
  IGetTransactions,
  IInsertTransactionPackage,
  IInsertTransactions,
} from "@/services/api/transaction/interfaces";
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";
import trackingDataModule from "@/stores/tracking-data";
const transactionAPI = new TransactionAPI();
// banquet
const bookingApi = new BookingApi();
const banquetInProgressApi = new BanquetInProgressApi();

@Options({
  name: "transaction",
  components: {
    UtilityForm,
    BDropdown,
    FolioForm,
    BDropdownItem,
    BDropdownDivider,
    TransferForm,
    CorrectionForm,
    AdvancedCorrectionForm,
    ChangeCorrectionDateForm,
    Credential,
    CConfirmation,
    GuestInHouseForm,
    CDropdown,
    CCheckbox,
    PackageForm,
    VoucherForm,
    PaymentForm,
    ChargeForm,
    CSelect,
    CDatepicker,
    Properties1,
    CInput,
    AgGridVue,
    Checkbox,
    PrintFolioOption,
  },
  props: {
    titleForm: String,
    table: Boolean,
    dataLookUp: Array,
    total: Array,
    showVoid: Boolean,
    showCorrection: Boolean,
    // userAccess: Object,
    reservationNumber: [String, Number],
    idData: Object,
    folioType: String,
  },
  emits: ["search"],
  watch: {
    transactionType(val) {
      if (val > 0) {
        this.showCorrectionForm = false;
      } else {
        this.isCheckingOut = false;
      }
    },
    showCorrectionForm(val) {
      if (val) {
        this.transactionType = 0;
        this.isCheckingOut = false;
      }
    },
  },

  async beforeRouteLeave(to, from, next) {
    await this.getFolioBalance();
    if (this.folioStatus == this.$global.folioStatus.closed) {
      if (this.balance > 0 || this.balance < 0) {
        this.showDialogFolioBalance = true;
        next(false);
      } else {
        next();
      }
    } else {
      next();
    }
  },
})
export default class Transaction extends Vue {
  public config = configStore();
  public auth = authModule();
  public folioNumber: number;
  public rowData: any[] = null;
  public idData: any = {};
  public showPaymentMenu: boolean = false;
  public mode: string | number = 0;
  public isPayment: boolean = false;
  public formPackage: any = {};
  public folioForm: any = null;
  public getUserAccessUtility = getUserAccessUtility;
  public formTransfer: any = {
    type: "F",
    number: 0,
    subFolio: "A",
    amount: 0,
    remark: "",
  };
  public headerData: any = reactive({});
  public footerData: any = reactive({
    Debit: 0,
    Credit: 0,
    Balance: 0,
  });
  public folioStatus: string;

  public currencies: any[] = [{ Code: "IDR", Name: "Rupiah" }];
  public transactionType: any = ref();
  public chargeType: any = ref();
  public credentialElement: any = ref();
  public paymentFormElement: any = ref();
  public chargeFormElement: any = ref();
  public confirmationElement: any = ref();
  public activeForm: any = ref();
  public showCorrectionForm: any = false;
  public showDialog: any = false;
  public dialogTitle: string = "";
  public credentialForm: any = {};
  public showPrintFolioOption: boolean = false;
  public showGuestInHouseForm: boolean = false;
  public showAdvancedCorrection: boolean = false;
  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    cardType: [],
    transferType: [
      { code: "F", name: "Folio" },
      { code: "R", name: "Reservation" },
    ],
    subFolioGroup: [
      { code: "All", name: "All Sub Folio" },
      { code: "A", name: "Sub Folio A" },
      { code: "B", name: "Sub Folio B" },
      { code: "C", name: "Sub Folio C" },
      { code: "D", name: "Sub Folio D" },
    ],
  };
  public search = {
    index: 1,
    showVoid: 0,
    showCorrection: 0,
    showPossession: 0,
    showTransferred: 0,
    text: "",
    subFolioGroupCode: "All",
  };
  isCheckingOut: boolean;

  //Access
  public userAccess: any = {};

  // banquet
  formType: string;
  bookingNumber: number = 0;
  // AG GRID Variable
  gridOptions: any;
  rowClassRules: any;
  columnDefs: any[];
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: number;
  rowSelection: string;
  rowModelType: string;
  bottomRowTotal: any;
  total: any;
  gridApi: any;
  paramsData: any;
  global: any;
  roomNumber: string;
  balance: any;
  searchOptions: any = reactive({});
  showDialogFolioBalance: boolean = false;
  showProperties: boolean = false;
  breakdown1: number = 0;
  showDialogUpdateSubDepartment: boolean = false;
  subDepartmentCode: string = "";
  isSaving: boolean = false;
  documentNumber: string = "";
  remark: string = "";
  showDialogUpdateRemark: boolean = false;
  showDialogUpdateDocumentNumber: boolean = false;
  voucherFormElement: any = null;
  rate: any = {};
  guestInHouseForm: any = null;
  isAdvancedCorrection: boolean;
  isLoading: boolean;
  printUtilityPeriod: any = null;
  printUtilityPeriods: any = [];
  showPrintUtilityPeriod: boolean = false;
  rowDataFiltered: any[] = [];
  userID: string = "";

  async beforeMount() {
    this.userAccess = {
      otherPayment: false,
      cash: false,
      card: false,
      cashRefund: false,
      void: false,
      correction: false,
      transfer: false,
      updateSubDepartment: false,
      updateRemark: false,
      updateDocumentNumber: false,
    };
    this.searchOptions = [
      { text: this.$t("commons.filter.id"), value: 0 },
      { text: this.$t("commons.filter.roomNumber"), value: 1 },
      { text: this.$t("commons.filter.account"), value: 2 },
      { text: this.$t("commons.filter.company"), value: 3 },
      { text: this.$t("commons.filter.remark"), value: 4 },
      { text: this.$t("commons.filter.documentNumber"), value: 5 },
      { text: this.$t("commons.filter.voucherNumber"), value: 6 },
      { text: this.$t("commons.filter.name"), value: 7 },
      { text: this.$t("commons.filter.refNumber"), value: 8 },
      { text: this.$t("commons.filter.createdBy"), value: 9 },
      { text: this.$t("commons.filter.voidBy"), value: 10 },
      { text: this.$t("commons.filter.voidReason"), value: 11 },
      { text: this.$t("commons.filter.updatedBy"), value: 12 },
    ];

    this.rowClassRules = {
      correction: "data.is_correction === true",
      void: "data.void === true",
    };
    this.gridOptions = {
      actionGrid: {
        menu: true,
        void: true,
        correction: true,
      },
      suppressCopyRowsToClipboard: true,
      ...$global.agGrid.defaultGridOptions,
    };
    // ------------------need setting manual for column table-----------------//
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "id",
        enableRowGroup: false,
        resizable: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        pinnedRowCellRendererParams: { style: { display: "none" } },
      },
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        cellStyle: { textAlign: "right" },
        width: 80,
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 100,
        cellStyle: { textAlign: "center" },
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
      {
        headerName: this.$t("transaction.table.transferStatus"),
        field: "TransferStatus",
        width: 180,
      },
      {
        headerName: this.$t("transaction.table.roomNumber"),
        field: "room_number",
        width: 65,
      },
      {
        headerName: this.$t("transaction.table.account"),
        field: "Account",
        width: 250,
      },
      {
        headerName: this.$t("transaction.table.debit"),
        field: "Debit",
        width: 100,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.credit"),
        field: "Credit",
        width: 100,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
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
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.creditForeign"),
        field: "CreditForeign",
        width: 122,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.currencyForeign"),
        field: "currency_code",
        width: 100,
      },
      {
        headerName: this.$t("transaction.table.exchangeRate"),
        field: "exchange_rate",
        width: 100,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.company"),
        field: "CompanyName",
        width: 120,
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
        field: "SubDepartment",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.void"),
        field: "void",
        width: 90,
        cellRenderer: "checklistRenderer",
        cellStyle: { textAlign: "center" },
        pinnedRowCellRendererParams: { style: { display: "none" } },
      },
      {
        headerName: this.$t("transaction.table.correction"),
        field: "is_correction",
        width: 90,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
        pinnedRowCellRendererParams: { style: { display: "none" } },
      },
      {
        headerName: this.$t("transaction.table.refNumber"),
        field: "ref_number",
        width: 130,
      },
      {
        headerName: this.$t("transaction.table.createdBy"),
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
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 150,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      statusBarTotal: StatusBarTotal,
      actionGrid: ActionGrid,
      checklistRenderer: ChecklistRenderer,
    };
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "left" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = $global.agGrid.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
  }

  onGridReady() {
    this.bottomRowTotal = this.total;
  }

  onPageSizeChanged(newPageSize: number) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result: any = [
      this.headerData.type_code == $global.folioType.guestFolio &&
      this.headerData.status_code == $global.folioStatus.open
        ? {
            name: this.$t("commons.contextMenu.autoPostRoomCharge"),
            disabled: !this.canUserAccess(
              $global.frontDeskAccessOrder.accessFolio.charge
            ),
            icon: generateIconContextMenuAgGrid("autopost_icon24"),
            action: () => this.handleAutoPostingRoomCharge(),
          }
        : null,
      this.headerData.type_code == $global.folioType.guestFolio &&
      this.headerData.status_code == $global.folioStatus.open
        ? "separator"
        : null,
      {
        name: this.$t("commons.contextMenu.charge"),
        icon: generateIconContextMenuAgGrid("charge_icon24"),
        disabled: !this.canUserAccess(
          $global.frontDeskAccessOrder.accessFolio.charge
        ),
        action: () => this.setTransactionType($global.modeTransaction.charge),
      },
      {
        name: this.$t("commons.contextMenu.package"),
        icon: generateIconContextMenuAgGrid("package_icon24"),
        disabled: !this.canUserAccess(
          $global.frontDeskAccessOrder.accessFolio.charge
        ),
        action: () => this.setTransactionType($global.modeTransaction.package),
      },
      {
        name: this.$t("commons.contextMenu.apTransaction"),
        icon: generateIconContextMenuAgGrid("ap_transaction_icon24"),
        disabled: !this.canUserAccess(
          $global.frontDeskAccessOrder.accessFolio.charge
        ),
        action: () =>
          this.setTransactionType($global.modeTransaction.apTransaction),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.payment"),
        subMenu: [
          {
            name: this.$t("commons.contextMenu.cashPayment"),
            icon: generateIconContextMenuAgGrid("cash_icon24"),
            disabled: !this.canUserAccess(
              $global.frontDeskAccessOrder.accessFolio.cash
            ),
            action: () => this.setTransactionType($global.modeTransaction.cash),
          },
          this.isOpen
            ? {
                name: this.$t("commons.contextMenu.cashRefund"),
                icon: generateIconContextMenuAgGrid("cash_refund_icon24"),
                disabled: !this.canUserAccess(
                  $global.frontDeskAccessOrder.accessFolio.cashRefund
                ),
                action: () =>
                  this.setTransactionType($global.modeTransaction.refund),
              }
            : null,
          {
            name: this.$t("commons.contextMenu.creditOrDebitCardPayment"),
            icon: generateIconContextMenuAgGrid("card_icon24"),
            disabled: !this.canUserAccess(
              $global.frontDeskAccessOrder.accessFolio.card
            ),
            action: () => this.setTransactionType($global.modeTransaction.card),
          },
          this.isSubscribedHotel
            ? {
                name: this.$t("commons.contextMenu.voucher"),
                icon: generateIconContextMenuAgGrid("color_voucher_icon24"),
                action: () =>
                  this.setTransactionType($global.modeTransaction.voucher),
              }
            : null,
          {
            name: this.$t("commons.contextMenu.otherPayment"),
            icon: generateIconContextMenuAgGrid("other_payment_icon24"),
            disabled: !this.canUserAccess(
              $global.frontDeskAccessOrder.accessFolio.otherPayment
            ),
            action: () =>
              this.setTransactionType($global.modeTransaction.other),
          },
          {
            name: this.$t("commons.contextMenu.transfer"),
            icon: generateIconContextMenuAgGrid("transfer_icon24"),
            disabled: !this.canUserAccess(
              $global.frontDeskAccessOrder.accessFolio.transfer
            ),
            action: () =>
              this.setTransactionType($global.modeTransaction.transfer),
          },
        ],
      },

      {
        name: this.$t("commons.contextMenu.move"),
        disabled: !this.paramsData,
        subMenu: this.paramsData
          ? [
              {
                name: "Sub Folio A",
                disabled: this.paramsData.group_code == "A",
                action: () => {
                  this.moveSubFolio("A");
                },
              },
              {
                name: "Sub Folio B",
                disabled: this.paramsData.group_code == "B",
                action: () => {
                  this.moveSubFolio("B");
                },
              },
              {
                name: "Sub Folio C",
                disabled: this.paramsData.group_code == "C",
                action: () => {
                  this.moveSubFolio("C");
                },
              },
              {
                name: "Sub Folio D",
                disabled: this.paramsData.group_code == "D",
                action: () => {
                  this.moveSubFolio("D");
                },
              },
            ]
          : [],
      },
      {
        name: this.$t("commons.contextMenu.printReceipt"),
        disabled:
          !this.paramsData ||
          !(
            this.paramsData.sub_group_code ==
              $global.accountSubGroup.cashPayment ||
            this.paramsData.sub_group_code ==
              $global.accountSubGroup.creditDebitCard ||
            this.paramsData.sub_group_code ==
              $global.accountSubGroup.bankTransfer
          ),
        icon: generateIconContextMenuAgGrid("print_icon24"),
        action: () => this.handlePrintReceipt(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.printMiscellaneous"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("print_icon24"),
        action: () => this.handlePrintMiscellaneous(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.printUtilityCharge"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("print_icon24"),
        action: () => this.handlePrintUtility(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.printCheck"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("print_icon24"),
        action: () => this.handlePrintCheck(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.void"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.void), // || !this.userAccess.void,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleCorrectionVoid(this.paramsData, false, false),
      },
      {
        name: this.$t("commons.contextMenu.correction"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess(
            $global.frontDeskAccessOrder.accessFolio.correction
          ), // || !this.userAccess.correction,
        icon: generateIconContextMenuAgGrid("correction_icon24"),
        action: () => this.handleCorrectionVoid(this.paramsData, true, false),
      },
      {
        name: this.$t("commons.contextMenu.advancedCorrection"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess(
            $global.frontDeskAccessOrder.accessFolio.correction
          ) ||
          this.paramsData.AccountGroupCode != $global.groupAccount.charge, // || !this.userAccess.correction,
        icon: generateIconContextMenuAgGrid("correction_icon24"),
        action: () => this.handleCorrectionVoid(this.paramsData, true, true),
      },
      {
        name: this.$t("commons.contextMenu.changeCorrectionDate"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess(
            $global.frontDeskAccessOrder.accessFolio.changeCorrectionDate
          ) ||
          this.headerData.status_code == $global.folioStatus.open, // || !this.userAccess.correction,
        icon: generateIconContextMenuAgGrid("correction_icon24"),
        action: () => this.handleChangeCorrectionDate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.properties"),
        icon: generateIconContextMenuAgGrid("properties_icon24"),
        disabled: !this.paramsData, // || !this.userAccess.updateSubDepartment,
        action: () => this.handleProperties(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.updateSubDepartment"),
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess(
            $global.frontDeskAccessOrder.accessFolio.updateSubDepartment
          ), // || !this.userAccess.updateSubDepartment,
        action: () => this.handleUpdateSubDepartment(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.updateRemark"),
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess(
            $global.frontDeskAccessOrder.accessFolio.updateRemark
          ), // || !this.userAccess.updateRemark,
        action: () => this.handleUpdateRemark(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.updateDocumentNumber"),
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        disabled:
          !this.paramsData ||
          !this.canUserAccess(
            $global.frontDeskAccessOrder.accessFolio.updateDocumentNumber
          ), // || !this.userAccess.updateDocumentNumber,
        action: () => this.handleUpdateDocumentNumber(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        disabled: !this.paramsData,
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.subFolio,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }

  // samsam muekk
  async initialize() {
    let params: any;
    if (!this.$route.params.folioNumber) {
      params = this.$route.query;
    }
    // route to dashboard when direct access transaction
    if (!params.folioNumber) {
      return this.$router.push("/");
    }
    this.gridApi = this.gridOptions.api;
    let folioNumber;
    if (params.folioNumber.constructor !== Array) {
      folioNumber = params.folioNumber;
    }
    this.folioNumber = parseInt(folioNumber.toString());
    this.onRefreshData();
    // banquet
    if (params.formType == $global.formType.banquetInProgress) {
      this.bookingNumber = params.bookingNumber;
      this.formType = params.formType;
    }
    if (params.isProcessCheckOut != "0") {
      this.onClickCheckOut();
    }

    const auth: any = authModule();
    const user = await auth.user;
    this.userID = user.ID;
  }

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
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

  async handleGuestInHouse() {
    if (
      this.transactionType ||
      this.showProperties ||
      this.showGuestInHouseForm
    )
      return;
    await this.$nextTick(() => {
      this.showGuestInHouseForm = true;
    });
    if (this.headerData.type_code == $global.folioType.guestFolio) {
      this.guestInHouseForm.onEdit(this.folioNumber);
    } else {
      this.folioForm.onEdit(this.folioNumber);
    }
  }

  handlePrintReceipt(paramsData: any) {
    const isPayment =
      paramsData.sub_group_code == $global.accountSubGroup.cashPayment ||
      paramsData.sub_group_code == $global.accountSubGroup.creditDebitCard ||
      paramsData.sub_group_code == $global.accountSubGroup.bankTransfer;
    if (!isPayment) return;
    const isRefund =
      paramsData.account_code == this.accountCash && paramsData.Debit > 0;
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.folioReceipt}&param=${
        paramsData.id
      }&param2=${isRefund}&template=${
        isRefund
          ? $global.stimulsoftReportFileDirectory.receiptFolioRefund
          : $global.stimulsoftReportFileDirectory.receiptFolio
      }`
    );
    printPreview(newTabReport.href);
  }

  handlePrintMiscellaneous(paramsData: any) {
    const isPayment =
      paramsData.sub_group_code == $global.accountSubGroup.cashPayment ||
      paramsData.sub_group_code == $global.accountSubGroup.creditDebitCard;
    if (isPayment) return;
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.miscellaneousCharge}&param=${paramsData.id}&template=${$global.stimulsoftReportFileDirectory.miscellaneousCharge}`
    );
    printPreview(newTabReport.href);
  }

  handlePrintUtility(paramsData: any) {
    this.paramsData = paramsData;
    this.getPrintUtilityPeriod();
  }

  printUtility() {
    if (this.printUtilityPeriod) {
      this.showPrintUtilityPeriod = false;
      const newTabReport = this.$router.resolve(
        `/report/preview?reportId=${$global.reportID.utilityCharge}&param=${this.printUtilityPeriod}&param2=${this.folioNumber}&template=${$global.stimulsoftReportFileDirectory.miscellaneousCharge}`
      );
      printPreview(newTabReport.href);
    }
  }

  handlePrintCheck(paramsData: any) {
    if (paramsData.account_code == this.accountTransferCharge) {
      if (paramsData.CheckNumber && paramsData.OutletCode) {
        const newTabReport = this.$router.resolve(
          `/report/preview?reportId=${$global.reportID.checkBill}&param=${
            paramsData.CheckNumber
          }&param2=${false}&template=${
            $global.stimulsoftReportFileDirectory.checkBill
          }`
        );
        printPreview(newTabReport.href);
      }
    }
  }

  handlePrintFolio() {
    this.showPrintFolioOption = true;
  }

  handleAutoPostingRoomCharge() {
    if (!this.canUserAccess($global.frontDeskAccessOrder.accessFolio.charge))
      return;
    this.confirmationElement.showConfirmation({
      show: true,
      onConfirm: this.getCountAutoPostingRoomCharge,
    });
  }

  handleProperties(paramsData: any) {
    this.breakdown1 = paramsData.breakdown1;
    this.showProperties = true;
  }

  //correctionVoid
  async handleCorrectionVoid(
    paramsData: any,
    isCorrection: boolean,
    isAdvancedCorrection: boolean
  ) {
    if (paramsData.void) {
      return getToastInfo("This transaction is already voided!");
    }
    if (
      formatDateDatabase(this.config.auditDate) ==
      formatDateDatabase(paramsData.audit_date)
    ) {
      if (isCorrection)
        //TODO add transalate to this
        return getToastInfo("Cannot correction this transaction.");
    } else {
      if (!isCorrection) return getToastInfo("Cannot void this transaction.");
    }
    if (!(await this.isCanVoidOrCorrect(paramsData))) {
      return;
    }

    if (isCorrection) {
      if (paramsData.transfer_pair_id > 0) {
        const remark: string = paramsData.remark;
        if (remark.includes("From")) {
          return getToastInfo(
            "Please make corrections for this transaction on the source Folio!"
          );
        }
      }
    }

    this.isAdvancedCorrection = isAdvancedCorrection;
    if (
      isAdvancedCorrection &&
      this.paramsData.AccountGroupCode != $global.groupAccount.charge
    )
      return;
    if (
      isCorrection &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.correction)
    )
      return;
    if (
      !isCorrection &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.void)
    )
      return;
    this.paramsData = paramsData;
    this.credentialForm = {};
    this.credentialElement.showCredential({
      show: true,
      showReason: true,
      title:
        (isCorrection
          ? this.$t("credential.title.correction")
          : this.$t("credential.title.void")) + paramsData.id,
      accessMode: isCorrection
        ? $global.frontDeskAccessOrder.accessSpecial.correctSubFolio
        : $global.frontDeskAccessOrder.accessSpecial.voidSubFolio,
      accessType: $global.userAccessType.special,
      onVerified: this.onSaveCredential,
    });
  }

  handleChangeCorrectionDate(paramData: any) {
    if (this.headerData.status_code == $global.folioStatus.open) return;
    if (
      !this.canUserAccess(
        $global.frontDeskAccessOrder.accessFolio.changeCorrectionDate
      )
    )
      return;
    this.transactionType = $global.modeTransaction.changeCorrectionDate;
  }

  handleRowRightClicked() {
    handleRowRightClickedAgGrid(this.paramsData, this, "id");
  }

  handlePrintVoucher(voucherNumber?: string) {
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.Voucher}&param=${voucherNumber}&param2=0&param3=${$global.reportID.Voucher}&template=${$global.stimulsoftReportFileDirectory.voucher}`
    );
    printPreview(newTabReport.href);
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  onFormClosed() {
    this.onRefreshData();
    this.transactionType = 0;
  }

  onClickBackButton() {
    this.$router.go(-1);
  }

  onClickPayment() {
    this.showPaymentMenu = true;
  }

  onClickCheckOut() {
    this.showDialog = true;
  }

  async checkOut() {
    this.isCheckingOut = true;
    this.showDialog = false;
    await this.getFolioBalance();
    if (this.balance > 0) {
      return this.setTransactionType($global.modeTransaction.cash);
    }
    if (this.balance < 0) {
      return this.setTransactionType($global.modeTransaction.refund);
    }

    this.checkOutFolio();

    this.isCheckingOut = false;
  }

  async onRefreshData() {
    this.$nextTick(async () => {
      if (this.isLoading) return;
      this.isLoading = true;
      const loading = this.$loading.show();
      await this.transactionList(this.search);
      this.transactionDetail();
      this.isLoading = false;
      loading.hide();
    });
  }

  async onSaveCredential(form: any) {
    this.credentialForm = form;
    if (
      form.access_mode ==
      $global.frontDeskAccessOrder.accessSpecial.correctSubFolio
    ) {
      return this.isAdvancedCorrection
        ? (this.showAdvancedCorrection = true)
        : (this.showCorrectionForm = true);
    }

    if (
      form.access_mode ==
      $global.frontDeskAccessOrder.accessSpecial.voidSubFolio
    ) {
      if (form.additional == "voidAutoPostingRoomCharge") {
        return this.autoPostingRoomCharge();
      }
      return this.voidTransaction();
    }
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

  onSaveCorrection() {
    this.onRefreshData();
    this.showCorrectionForm = false;
    this.showAdvancedCorrection = false;
  }

  async setTransactionType(type: any) {
    if (
      this.transactionType === $global.modeTransaction.cash &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.cash)
    )
      return;
    if (
      this.transactionType === $global.modeTransaction.card &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.card)
    )
      return;
    if (
      this.transactionType === $global.modeTransaction.refund &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.cashRefund)
    )
      return;
    if (
      this.transactionType === $global.modeTransaction.directBill &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.directBill)
    )
      return;
    if (
      this.transactionType === $global.modeTransaction.other &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.otherPayment)
    )
      return;
    if (
      this.transactionType === $global.modeTransaction.transfer &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.transfer)
    )
      return;
    if (
      (this.transactionType === $global.modeTransaction.charge ||
        this.transactionType === $global.modeTransaction.utility ||
        this.transactionType === $global.modeTransaction.apTransaction ||
        this.transactionType === $global.modeTransaction.package) &&
      !this.canUserAccess($global.frontDeskAccessOrder.accessFolio.charge)
    )
      return;
    this.transactionType = type;
    if (
      this.transactionType === $global.modeTransaction.cash ||
      this.transactionType === $global.modeTransaction.refund ||
      this.transactionType === $global.modeTransaction.other ||
      this.transactionType === $global.modeTransaction.directBill ||
      this.transactionType === $global.modeTransaction.card ||
      this.transactionType === $global.modeTransaction.voucher
    ) {
      this.isPayment = true;
      await this.$nextTick();
      this.activeForm = this.paymentFormElement;
      if (this.transactionType == $global.modeTransaction.voucher) {
        this.activeForm = this.voucherFormElement;
      }
    } else {
      this.isPayment = false;
      await this.$nextTick();
      this.activeForm = this.chargeFormElement;
    }
    this.activeForm.initialize();
  }

  async credentialVoidRoomCharge() {
    this.credentialForm = {};
    this.credentialElement.showCredential({
      show: true,
      title: this.$t("credential.title.voidRoomCharge"),
      accessMode: $global.frontDeskAccessOrder.accessSpecial.voidSubFolio,
      accessType: $global.userAccessType.folio,
      additionalData: "voidAutoPostingRoomCharge",
      onVerified: this.onSaveCredential,
    });
  }

  // GENERAL FUNCTION ================================================================
  formatData() {
    const weekdayRateDiscount = this.headerData.discount_percent
      ? (anyToFloat(this.headerData.weekday_rate) *
          anyToFloat(this.headerData.discount)) /
        100
      : anyToFloat(this.headerData.discount);
    const weekendRateDiscount = this.headerData.discount_percent
      ? (anyToFloat(this.headerData.weekend_rate) *
          anyToFloat(this.headerData.discount)) /
        100
      : anyToFloat(this.headerData.discount);
    this.headerData.room_charge_weekday = formatNumberValue(
      anyToFloat(this.headerData.weekday_rate) - anyToFloat(weekdayRateDiscount)
    );
    this.headerData.room_charge_weekend = formatNumberValue(
      anyToFloat(this.headerData.weekday_rate) - anyToFloat(weekendRateDiscount)
    );
    this.headerData.room_charge_will_post = formatNumberValue(
      anyToFloat(this.headerData.room_charge_will_post)
    );
    this.headerData.weekday_rate = formatNumberValue(
      this.headerData.weekday_rate
    );
    this.headerData.weekend_rate = formatNumberValue(
      this.headerData.weekend_rate
    );
    this.headerData.discount = formatNumberValue(this.headerData.discount);
    this.headerData.arrival = formatDateTime2(this.headerData.arrival);
    this.headerData.departure = formatDateTime2(this.headerData.departure);

    const decimalCountBalance = countDecimalPlaces(this.footerData.Balance);
    this.footerData.Debit = formatCurrency(
      this.footerData.Debit,
      decimalCountBalance
    );
    this.footerData.Credit = formatCurrency(
      this.footerData.Credit,
      decimalCountBalance
    );
    this.footerData.Balance = formatCurrency(
      this.footerData.Balance,
      decimalCountBalance
    );
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async onSave(formData: any) {
    if (
      this.formType == $global.formType.banquetInProgress &&
      this.transactionType === $global.modeTransaction.package
    ) {
      formData.account_code = formData.accountCode;
      formData.commission_value = formData.commissionValue;
      formData.commission_type_code = formData.commissionTypeCode;
      formData.business_source_code = formData.businessSourceCode;
      formData.amount = formData.totalAmount;
    }

    let savedData = cloneObject(formData);
    if (this.formType == $global.formType.banquetInProgress) {
      if (
        this.transactionType !== $global.modeTransaction.package &&
        !this.isPayment
      ) {
        savedData.start_time = formatDateTimeUTC(
          this.convertTimeToDateFormat(
            savedData.served_date,
            savedData.start_time
          )
        );
        savedData.end_time = formatDateTimeUTC(
          this.convertTimeToDateFormat(
            savedData.served_date,
            savedData.end_time
          )
        );
        savedData.mode_editor = 3;
        savedData.discount = savedData.discount_percent
          ? (savedData.discount * savedData.sub_total) / 100
          : savedData.discount;
        savedData.served_date = formatDateTimeUTC(savedData.served_date);
        savedData.booking_number = anyToFloat(this.bookingNumber);
      }
      savedData.folio_number = this.folioNumber;
      // savedData.booking_number = anyToFloat(savedData.booking_number)
    }

    if (
      (this.transactionType === $global.modeTransaction.package ||
        this.transactionType === $global.modeTransaction.utility) &&
      !this.isPayment
    ) {
      if (this.formType == $global.formType.banquetInProgress) {
        this.insertDataPackageBanInProgress(savedData);
      } else {
        formData.isUtility = false;
        if (this.transactionType === $global.modeTransaction.utility) {
          formData.isUtility = true;
        }
        console.log("formData", formData);
        await this.insertTransactionPackage(formData);
      }
    } else {
      if (
        this.formType == $global.formType.banquetInProgress &&
        !this.isPayment
      ) {
        this.insertDataProduct(savedData);
      } else {
        await this.insertTransactions(formData);
      }
    }

    this.activeForm.isSaving = false;
  }

  convertTimeToDateFormat(date: string, time: string) {
    const [timePart] = time.split("+");
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  }

  canUserAccess(accessOrder: number) {
    let accessUtility = this.userAccessTransactionFrontDesk;
    if (this.headerData.system_code == $global.systemCode.Banquet) {
      accessUtility = this.userAccessTransactionBanquet;
    }
    return getUserAccessUtility(accessUtility, accessOrder, this.userID);
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async transactionList(search: any) {
    try {
      const params: IGetTransactions = {
        Index: search.index,
        IsSearchLast: 0,
        ShowVoid: search.showVoid,
        ShowCorrection: search.showCorrection,
        PossessionOnly: search.showPossession,
        ShowTransferred: search.showTransferred,
        DataPosition: 0,
        DataLimit: 100,
        FolioNumber: this.folioNumber,
        Text: search.text,
        SubFolioGroupCode: search.subFolioGroupCode,
      };
      const { data } = await transactionAPI.getTransactions(params);
      this.rowDataFiltered = [];
      this.rowData = data ? data : [];
    } catch (err) {
      getError(err);
    }
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  async loadSubDepartment(showDialog: boolean) {
    try {
      const { data } = await transactionAPI.codeNameList("SubDepartment");
      this.options.subDepartments = data;
      if (showDialog) this.showDialogUpdateSubDepartment = true;
    } catch (err) {
      getError(err);
    }
  }

  async voidTransaction() {
    try {
      const params = {
        show_correction: this.search.showCorrection > 0,
        void_by: this.credentialForm.userId,
        void_reason: this.credentialForm.reason,
        belongs_to: this.paramsData.belongs_to,
        id: this.paramsData.breakdown1,
      };
      const { data } = await transactionAPI.voidTransaction(params);
      getToastSuccess();
      this.onRefreshData();
    } catch (err) {
      getError(err);
    }
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
      await transactionAPI.updateSubDepartment(params);
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
      await transactionAPI.updateRemark(params);
      getToastSuccess();
      this.onRefreshData();
      this.showDialogUpdateRemark = false;
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
  }

  async isCanVoidOrCorrect(paramsData: any) {
    let result = false;
    this.isSaving = true;
    try {
      const params = {
        AccountCode: paramsData.account_code,
        TransactionID: paramsData.id,
        IsDeposit: false,
      };
      const { data, status2 } = await transactionAPI.isCanVoidOrCorrect(params);
      result = data;
      if (status2.message) {
        getToastInfo(status2.message);
      }
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
    return result;
  }

  async updateDocumentNumber() {
    if (this.isSaving || this.paramsData.id <= 0) return;
    this.isSaving = true;
    try {
      const params = {
        document_number: this.documentNumber,
        id: this.paramsData.id,
      };
      await transactionAPI.updateDocumentNumber(params);
      getToastSuccess();
      this.onRefreshData();
      this.showDialogUpdateDocumentNumber = false;
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
  }

  async moveSubFolio(groupCode: string) {
    if (this.isSaving || this.paramsData.correction_breakdown <= 0) return;
    this.gridApi.showLoadingOverlay();
    try {
      const params = {
        sub_folio_group_code: groupCode,
        folio_number: this.paramsData.folio_number,
        correction_breakdown: this.paramsData.correction_breakdown,
      };
      await transactionAPI.MoveSubFolio(params);
      getToastSuccess();
      await this.onRefreshData();
    } catch (err) {
      getError(err);
    }
    this.isSaving = false;
    this.gridApi.hideOverlay();
  }

  async transactionDetail() {
    try {
      const { data } = await transactionAPI.getTransactionDetail(
        this.folioNumber
      );
      this.rate = {
        weekday_rate: data.stay_information.weekday_rate,
        weekend_rate: data.stay_information.weekend_rate,
      };
      this.headerData = data.stay_information;
      this.footerData = data.total;
      this.balance = data.total.Balance;
      this.roomNumber = this.headerData.room_number;
      this.formatData();
    } catch (err) {
      getError(err);
    }
  }

  async insertTransactions(dataX: any) {
    try {
      const params: IInsertTransactions = {
        FolioReservationNumber: this.folioNumber,
        RoomNumber: this.roomNumber,
        SubFolioGroupCode: dataX.subFolioGroupCode,
        Amount: dataX.amountForeign,
        ModeEditor: dataX.modeEditor,
        AutomaticTransfer: dataX.automaticTransfer,
        PostingBreakdown: dataX.postingBreakdown,
        ReservationStatusCode: dataX.reservationStatusCode,
        DocumentNumber: dataX.documentNumber,
        AccountCode: dataX.accountCode,
        SubDepartmentCode: dataX.subDepartmentCode,
        CurrencyCode: dataX.currencyCode,
        DirectBillCode: dataX.directBillCode,
        Remark: dataX.remark,
        CompanyCode: dataX.companyCode,
        ChargeAmount: dataX.chargeAmount,
        CardBankCode: dataX.cardBankCode,
        CardTypeCode: dataX.cardTypeCode,
        CardHolder: dataX.cardHolder,
        CardNumber: dataX.cardNumber,
        IsDeposit: false,
        ValidMonth: dataX.validMonth,
        ValidYear: dataX.validYear,
      };
      if (this.transactionType === $global.modeTransaction.card) {
        await transactionAPI.insertTransactionPaymentCard(params);
      } else if (this.transactionType === $global.modeTransaction.directBill) {
        await transactionAPI.insertTransactionPaymentDirectBill(params);
      } else {
        await transactionAPI.insertTransactions(params);
      }
      this.transactionType = null;
      this.onRefreshData();
      getToastSuccess();
      if (this.isCheckingOut) {
        this.checkOut();
      }
    } catch (err) {
      getError(err);
    }
  }

  printFolioCheckOut() {
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.folio}&param=${this.folioNumber}&template=${$global.stimulsoftReportFileDirectory.folio}`
    );

    printPreview(newTabReport.href);
  }

  async insertTransactionPackage(dataX: any) {
    try {
      const params = {
        FolioReservationNumber: this.folioNumber,
        RoomNumber: this.roomNumber,
        SubFolioGroupCode:
          this.search.subFolioGroupCode === "All"
            ? "A"
            : this.search.subFolioGroupCode,
        BusinessSourceCode: dataX.businessSourceCode,
        CommissionTypeCode: dataX.commissionTypeCode,
        CommissionValue: dataX.commissionValue,
        PackageCode: dataX.packageCode,
        AccountCode: dataX.accountCode,
        Adult: anyToFloat(dataX.adult),
        Child: anyToFloat(dataX.child),
        Quantity: anyToFloat(dataX.quantity),
        IsUtility: dataX.isUtility,
        StartMeter: anyToFloat(dataX.startMeter),
        EndMeter: anyToFloat(dataX.endMeter),
      };

      // Create a FormData object
      const formData = new FormData();
      formData.append("Image", dataX.image);
      formData.append("Data", JSON.stringify(params));
      // // Append each field in `params` to the formData
      // for (const key in params) {
      //   if (key === "Image" && params[key]) {
      //     // Append the image file if it exists
      //     formData.append(key, params[key]);
      //   } else {
      //     // Append other fields as strings
      //     formData.append(key, params[key]);
      //   }
      // }

      // Send the formData using Axios
      const { data, status2 } = await transactionAPI.insertTransactionPackage(
        formData
      );
      if (status2.message == 255) {
        return getToastInfo(this.$t("transaction.popup.postingFailed"));
      } else if (status2.message == 1) {
        return getToastInfo(this.$t("transaction.popup.breakdownTooLarge"));
      }
      this.transactionType = null;
      this.onRefreshData();
      getToastSuccess();
    } catch (err) {
      getError(err);
    }
  }

  async getFolioBalance() {
    try {
      const { data } = await transactionAPI.getFolioBalance(this.folioNumber);
      this.balance = data.balance;
      this.folioStatus = data.status_code;
    } catch (error) {
      getError(error);
    }
  }

  async checkOutFolio() {
    try {
      const { data } = await transactionAPI.checkOutFolio(this.folioNumber);
      if (data) {
        if (data.invoice_number) {
          // voucher.handlePrintVoucher(data.vo);
        }
        if (data.voucher_number) {
          this.handlePrintVoucher(data.voucher_number);
        }
      }
      this.printFolioCheckOut();
      this.$router.go(-1);
    } catch (error) {
      getError(error);
    }
  }

  async autoPostingRoomCharge() {
    try {
      const params = {
        folio_number: this.folioNumber,
        void_by: this.credentialForm.userId,
      };
      const { status2 } = await transactionAPI.autoPostingRoomCharge(params);
      if (status2.status == 10) {
        getToastInfo(status2.message);
      }
      this.onRefreshData();
    } catch (error) {
      getError(error);
    }
  }

  async getCountAutoPostingRoomCharge() {
    try {
      const { data } = await transactionAPI.getCountAutoPostingRoomCharge(
        this.folioNumber
      );
      if (data > 0) {
        return this.credentialVoidRoomCharge();
      }
      this.autoPostingRoomCharge();
    } catch (error) {
      getError(error);
    }
  }

  async getPrintUtilityPeriod() {
    try {
      const { data } = await transactionAPI.getPrintUtilityPeriod(
        this.folioNumber
      );
      if (data) {
        this.printUtilityPeriods = data;
      }
      this.showPrintUtilityPeriod = true;
    } catch (error) {
      getError(error);
    }
  }

  // banquet
  async insertDataProduct(formData: any) {
    try {
      const { status2 } = await bookingApi.insertBanquetProduct(formData);
      if (status2.status == 0) {
        this.transactionType = null;
        this.onRefreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertDataPackageBanInProgress(formData: any) {
    try {
      const { status2 } =
        await banquetInProgressApi.insertBanquetTransactionPackage(formData);
      if (status2.status == 0) {
        this.transactionType = null;
        this.onRefreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================

  // RECYCLE LIFE FUNCTION ===========================================================
  async mounted() {
    this.initialize();
  }

  // END RECYCLE LIFE FUNCTION =======================================================
  get title() {
    switch (this.transactionType) {
      case $global.modeTransaction.cash:
        return this.$t("transaction.cash");
      case $global.modeTransaction.card:
        return this.$t("transaction.card");
      case $global.modeTransaction.directBill:
        return this.$t("transaction.directBill");
      case $global.modeTransaction.voucher:
        return this.$t("transaction.voucher");
      case $global.modeTransaction.other:
        return this.$t("transaction.other");
      case $global.modeTransaction.refund:
        return this.$t("transaction.refund");
      case $global.modeTransaction.transfer:
        return this.$t("transaction.transfer");
      case $global.modeTransaction.charge:
        return this.$t("transaction.charge");
      case $global.modeTransaction.package:
        return this.$t("transaction.package");
      case $global.modeTransaction.utility:
        return this.$t("transaction.utility");
      case $global.modeTransaction.changeCorrectionDate:
        return this.$t("transaction.changeCorrectionDate");
      case $global.modeTransaction.apTransaction:
        return `${this.$t("transaction.apTransaction")}: ${
          this.folioNumber
        }, ${this.$t("transaction.room")}: ${this.roomNumber}`;
      default:
        break;
    }
  }

  get pinnedBottomRowData() {
    const data =
      this.rowDataFiltered.length > 0 ? this.rowDataFiltered : this.rowData;
    return generateTotalFooterAgGrid(data, this.columnDefs);
  }

  get subFolioGroup() {
    return "A";
  }

  get form() {
    return this.$route.params.form;
  }

  get userAccessTransactionFrontDesk() {
    return this.auth.frontDeskAccessUtility.folioTransaction ?? "";
  }

  get userAccessTransactionBanquet() {
    return this.auth.banquetAccessUtility.transaction ?? "";
  }

  get accountCash() {
    return this.config.cash;
  }

  get accountTransferCharge() {
    return this.config.transferCharge;
  }

  get isOpen() {
    return this.headerData.status_code == "O";
  }

  get isSubscribedHotel() {
    return this.auth.isSubscribedHotel;
  }

  get isSubscribedPOS() {
    return this.auth.isSubscribedPOS;
  }
}
