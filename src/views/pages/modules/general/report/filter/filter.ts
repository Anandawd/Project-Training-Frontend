import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import { getToastSuccess, getToastInfo } from "@/utils/toast";
import { BTabs, BTab } from "bootstrap-vue-3";
import {
  generateTotalFooterAgGrid,
  generateIconContextMenuAgGrid,
  getError,
} from "@/utils/general";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import { AgGridVue } from "ag-grid-vue3";
import configStore from "@/stores/config";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import checklistRenderer from "../component/checklist-renderer.vue";
import OrderDropdownRenderer from "../component/order-dropdown-renderer.vue";
import reportAPI from "@/services/api/report/report-module";
import FAItem from "../../tools/configurations/fa-item/fa-item";

const ReportAPI = new reportAPI();

@Options({
  name: "Filter",
  components: {
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    reportCode: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class Filter extends Vue {
  inputFormValidation: any = ref();
  inputFormValidationGrid: any = ref();
  modeData: any;
  public config = configStore();
  public defaultForm: any = {};
  public form: any = reactive({});
  public isOther: boolean = true;
  public rowData: any = [];
  public isSave: boolean = false;
  public idGrid: any = 0;
  public statusDropdown: any = "";
  public accountDropdown: any;
  public idGridEdit: any = 0;
  public account_code: any;
  public totalAmount: any = 0;
  public dataMode: any;
  public reportCode: number = 0;
  public dataEdited: any;
  public formData: any = reactive({});
  public qtyConvertion: any;
  public totalFooter: any = [];
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];
  // Dropdown Options
  listDropdown: any = {
    Location: [],
    Group: [{ code: 0, name: "Loading..." }],
    Status: [{ code: 0, name: "Loading..." }],
    ReservationStatus: [
      { code: "N", name: "New" },
      { code: "W", name: "WaitList" },
      { code: "I", name: "InHouse" },
      { code: "C", name: "Canceled" },
      { code: "S", name: "NoShow" },
      { code: "V", name: "Void" },
      { code: "O", name: "CheckOut" },
    ],
    Company: [{ code: 0, name: "Loading..." }],
    UserId: [{ code: 0, name: "Loading..." }],
    Shift: [{ code: 0, name: "Loading..." }],
    SubDepartment: [{ code: 0, name: "Loading..." }],
    Account: [{ code: 0, name: "Loading..." }],
    SubAccount: [{ code: 0, name: "Loading..." }],
    Nationality: [{ code: 0, name: "Loading..." }],
    BusinessSource: [{ code: 0, name: "Loading..." }],
    Market: [{ code: 0, name: "Loading..." }],
    BookingSource: [{ code: 0, name: "Loading..." }],
    VoucherType: [{ code: 0, name: "Loading..." }],
    VoucherStatus: [{ code: 0, name: "Loading..." }],
    StatusApprove: [{ code: 0, name: "Loading..." }],
    StatusSold: [{ code: 0, name: "Loading..." }],
    Building: [{ code: 0, name: "Loading..." }],
    Floor: [{ code: 0, name: "Loading..." }],
    RoomStatus: [{ code: 0, name: "Loading..." }],
    Outlet: [{ code: 0, name: "Loading..." }],
    ComplimentType: [{ code: 0, name: "Loading..." }],
    CompanyType: [{ code: 0, name: "Loading..." }],
    PhoneBookType: [{ code: 0, name: "Loading..." }],
    Sales: [{ code: 0, name: "Loading..." }],
    Source: [{ code: 0, name: "Loading..." }],
    Segment: [{ code: 0, name: "Loading..." }],
    LeadStatus: [{ code: 0, name: "Loading..." }],
    TaskStatus: [{ code: 0, name: "Loading..." }],
    ProposalStatus: [{ code: 0, name: "Loading..." }],
    DirectBill: [{ code: 0, name: "Loading..." }],
    JournalAccount: [{ code: 0, name: "Loading..." }],
    Product: [{ code: 0, name: "Loading..." }],
    ProductCategory: [{ code: 0, name: "Loading..." }],
    ProductGroup: [{ code: 0, name: "Loading..." }],
    ItemGroup: [{ code: 0, name: "Loading..." }],
    Action: [{ code: 0, name: "Loading..." }],
    Department: [{ code: 0, name: "Loading..." }],
    IpAddress: [{ code: 0, name: "Loading..." }],
    ComputerName: [{ code: 0, name: "Loading..." }],
    AccessName: [{ code: 0, name: "Loading..." }],
    Venue: [{ code: 0, name: "Loading..." }],
    RoomType: [{ code: 0, name: "Loading..." }],
    RoomRate: [{ code: 0, name: "Loading..." }],
    BankAccount: [{ code: 0, name: "Loading..." }],
    JournalAccountBank: [{ code: 0, name: "Loading..." }],
    JournalAccountUsed: [{ code: 0, name: "Loading..." }],
    InventoryAccount: [{ code: 0, name: "Loading..." }],
    ItemGroupInventory: [
      { code: "FOOD", name: "Food" },
      { code: "BVRG", name: "Beverage" },
    ],
    ItemType: [
      { code: "F", name: "Food" },
      { code: "B", name: "Beverage" },
    ],
    Item: [{ code: "", name: "Loading..." }],
    Store: [{ code: "", name: "Loading..." }],
    JournalType: [
      { code: 0, name: "All" },
      { code: 1, name: "General" },
      { code: 2, name: "Disbursement" },
      { code: 3, name: "Receive" },
      { code: 4, name: "Sales" },
      { code: 5, name: "Inventory" },
      { code: 6, name: "Fixed Asset" },
      { code: 7, name: "Adjusment" },
    ],
    AllBuilding: [{ code: "", name: "Loading..." }],
    FAItem: [{ code: "", name: "Loading..." }],
    FALocation: [{ code: "", name: "Loading..." }],
  };

  public reportCodeName: any = {
    Reservation: 110,
    FrontDesk: 115,
    MemberVoucherAndGift: 117,
    Room: 120,
    CakrasoftPointOfSales: 125,
    Profile: 130,
    MarketingGraphicAndAnalisis: 135,
    SalesActivity: 136,
    CityLedger: 140,
    ApRefundDepositAndCommission: 150,
    Log: 160,
    DailyReport: 181,
    MonthlyReport: 182,
    YearlyReport: 183,
    FavoriteReport: 190,
    ReservationList: 11001,
    CancelledReservation: 11002,
    NoShowReservation: 11003,
    VoidedReservation: 11004,
    GroupReservation: 11005,
    ExpectedArrival: 11006,
    ArrivalList: 11007,
    SamedayReservation: 11008,
    AdvancedPaymentDeposit: 11009,
    BalanceDeposit: 11010,
    WaitListReservation: 11011,
    CurrentInHouse: 11501,
    GuestInHouse: 11502,
    GuestInHouseByBusinessSource: 11503,
    GuestInHouseByMarket: 11504,
    GuestInHouseByGuestType: 11505,
    GuestInHouseByCountry: 11506,
    GuestInHouseByState: 11507,
    GuestInHouseListing: 11508,
    GuestInHouseByCity: 11509,
    GuestInHouseByBookingSource: 11510,
    MasterFolio: 11511,
    DeskFolio: 11512,
    GuestInForecast: 11513,
    RepeaterGuest: 11514,
    FolioList: 11515,
    GuestInHouseByNationality: 11516,
    GuestList: 11517,
    GuestInHouseBreakfast: 11518,
    IncognitoGuest: 11520,
    ComplimentGuest: 11521,
    HouseUseGuest: 11522,
    EarlyCheckIn: 11523,
    DayUse: 11524,
    EarlyDeparture: 11525,
    ExpectedDeparture: 11526,
    ExtendedDeparture: 11527,
    DepartureList: 11528,
    ActualDepartureGuestList: 11529,
    FolioTransaction: 11540,
    DailyFolioTransaction: 11541,
    MonthlyFolioTransaction: 11542,
    YearlyFolioTransaction: 11543,
    ChargeList: 11544,
    DailyChargeList: 11545,
    MonthlyChargeList: 11546,
    YearlyChargeList: 11547,
    CashierReport: 11548,
    PaymentList: 11549,
    DailyPaymentList: 11550,
    MonthlyPaymentList: 11551,
    YearlyPaymentList: 11552,
    ExportCsvByDepartureDate: 11560,
    GuestLedger: 11561,
    GuestDeposit: 11562,
    GuestAccount: 11563,
    DailySales: 11564,
    DailyRevenueReport: 11565,
    DailyRevenueReportSummary: 11566,
    PaymentBySubDepartment: 11567,
    PaymentByAccount: 11568,
    RevenueBySubDepartment: 11569,
    FolioOpenBalance: 11580,
    Correction: 11581,
    VoidList: 11582,
    CancelCheckIn: 11583,
    LostAndFound: 11584,
    CashierReportReprint: 11585,
    PackageSales: 11586,
    CashSummaryReport: 11587,
    TransactionReportByStaff: 11588,
    TaxBreakdownDetailed: 11589,
    TodayRoomRevenueBreakdown: 11590,
    CancelCheckOut: 11591,
    Member: 11701,
    Voucher: 11702,
    VoucherSoldRedemeedAndComplimented: 11703,
    RoomList: 12001,
    RoomType: 12002,
    RoomRate: 12003,
    RoomCountSheet: 12004,
    RoomUnavailable: 12005,
    RoomSales: 12006,
    RoomHistory: 12007,
    RoomTypeAvailability: 12008,
    RoomTypeAvailabilityDetail: 12009,
    RoomStatus: 12010,
    RoomCountSheetByBuildingFloorRoomType: 12011,
    RoomCountSheetByRoomTypeBedType: 12012,
    RoomSalesByRoomNumber: 12013,
    RoomRateBreakdown: 12021,
    Package: 12022,
    PackageBreakdown: 12023,
    RoomRateStructure: 12024,
    RoomRevenue: 12025,
    Sales: 12501,
    SalesSummary: 12502,
    FrequentlySales: 12503,
    CaptainOrderList: 12504,
    CancelledCaptainOrder: 12505,
    VoidedCheckList: 12506,
    CancelledCaptainOrderDetail: 12507,
    BreakfastControl: 12508,
    GuestProfile: 13001,
    FrequentlyGuest: 13002,
    Company: 13003,
    PhoneBook: 13004,
    ContractRate: 13501,
    EventList: 13502,
    ReservationChart: 13503,
    ReservationGraphic: 13504,
    OccupiedGraphic: 13505,
    OccupiedByBusinessSourceGraphic: 13506,
    OccupiedByMarketGraphic: 13507,
    OccupiedByGuestTypeGraphic: 13508,
    OccupiedByCountryGraphic: 13509,
    OccupiedByStateGraphic: 13510,
    OccupancyGraphic: 13511,
    RoomAvailabilityGraphic: 13531,
    RoomUnvailabilityGraphic: 13532,
    RevenueGraphic: 13533,
    PaymentGraphic: 13534,
    RoomStatistic: 13535,
    GuestForecastReport: 13536,
    CityLedgerContributionAnalysis: 13537,
    FoodAndBeverageStatistic: 13538,
    RoomProduction: 13539,
    BusinessSourceProductivity: 13540,
    GuestForecastReportYearly: 13541,
    MarketStatistic: 13542,
    GuestForecastComparison: 13543,
    DailyFlashReport: 13544,
    DailyHotelCompetitor: 13545,
    DailyStatisticReport: 13546,
    RateCodeAnalysis: 13547,
    SalesContributionAnalysis: 13548,
    LeadList: 13601,
    TaskList: 13602,
    ProposalList: 13603,
    ActivityLog: 13604,
    SalesActivityDetail: 13605,
    CityLedgerList: 14001,
    CityLedgerAgingReport: 14002,
    CityLedgerAgingReportDetail: 14003,
    CityLedgerInvoice: 14004,
    CityLedgerInvoiceDetail: 14005,
    CityLedgerInvoicePayment: 14006,
    CityLedgerInvoiceMutation: 14007,
    BankReconciliation: 14008,
    BankTransactionList: 14009,
    BankTransactionAgingReport: 14010,
    BankTransactionAgingReportDetail: 14011,
    BankTransactionMutation: 14012,
    ApRefundDepositList: 15001,
    ApRefundDepositAgingReport: 15002,
    ApRefundDepositAgingReportDetail: 15003,
    ApRefundDepositPayment: 15004,
    ApRefundDepositMutation: 15005,
    ApCommissionAndOtherList: 15006,
    ApCommissionAndOtherAgingReport: 15007,
    ApCommissionAndOtherAgingReportDetail: 15008,
    ApCommissionAndOtherPayment: 15009,
    ApCommissionAndOtherMutation: 15010,
    LogUser: 16501,
    LogMoveRoom: 16502,
    LogTransferTransaction: 16503,
    LogSpecialAccess: 16504,
    KeylockHistory: 16505,
    LogVoidTransaction: 16506,
    LogHouseKeeping: 16507,
    LogPabx: 16508,
    LogShift: 16509,
    Product: 201,
    ProductSales: 202,
    DayendCloseReprint: 203,
    ProductCategory: 21001,
    ProductList: 21002,
    ProductCosting: 22007,
    ProductCostingItem: 22008,
    FAndBRateStructure: 22010,
    RemovedProductCaptainOrder: 22011,
    RealizationCostOfGoodSold: 22012,
    MasterData: 301,
    GeneralAndSales: 302,
    Venue: 31001,
    Theme: 31002,
    SeatingPlan: 31003,
    BanquetBookingDetail: 32001,
    BanquetCalender: 32002,
    BanquetForecast: 32003,
    BanquetAdvancedDeposit: 32004,
    BanquetBalanceDeposit: 32005,
    BanquetChargeList: 32006,
    BanquetDailySales: 32007,
    CancelBanquetReservation: 32008,
    VoidBanquetReservation: 32009,
    BanquetBooking: 32010,
    AccountReceivable: 401,
    AccountPayable: 402,
    GeneralLedgerAndBank: 403,
    AccountReceivableList: 41011,
    AccountReceivableAgingReport: 41012,
    AccountReceivableAgingReportDetail: 41013,
    AccountReceivablePayment: 41014,
    AccountReceivableMutation: 41015,
    AccountPayableList: 42011,
    AccountPayableAgingReport: 42012,
    AccountPayableAgingReportDetail: 42013,
    AccountPayablePayment: 42014,
    AccountPayableMutation: 42015,
    OperationalAccount: 43001,
    ChartOfAccount: 43002,
    Journal: 43003,
    GeneralLedger: 43004,
    TrialBalance: 43005,
    WorkSheet: 43006,
    BalanceSheet: 43007,
    IncomeStatement: 43008,
    ProfitAndLoss: 43009,
    ProfitAndLossDetail: 43010,
    ProfitAndLossByDepartment: 43011,
    ProfitAndLossDetailByDepartment: 43012,
    BankBookAccount: 43013,
    CurrentAssetAccount: 43014,
    CashOnHandAccount: 43015,
    FixedAssetAccount: 43016,
    OtherAssetAccount: 43017,
    ARLedgerAccount: 43018,
    CurrentLiabilityAccount: 43019,
    APLedgerAccount: 43020,
    LongTermLiabilityAccount: 43021,
    OtherLiabilityAccount: 43022,
    BankBookAccountGroup: 43023,
    BankBookAccountSummary: 43024,
    ProfitAndLossBySubDepartment: 43025,
    ProfitAndLossDetailBySubDepartment: 43026,
    ExportedJournal: 43027,
    BalanceMultiPeriod: 43028,
    CashFlow: 43029,
    ProfitAndLossMultiPeriodDetail: 43030,
    ProfitAndLossGraphic: 43031,
    Inventory: 502,
    FixedAsset: 503,
    Uom: 51001,
    InventoryItem: 51002,
    FixedAssetItem: 51003,
    InventoryPurchaseOrder: 52001,
    InventoryPurchaseOrderDetail: 52002,
    ReceiveStock: 52003,
    ReceiveStockDetail: 52004,
    StockTransfer: 52005,
    StockTransferDetail: 52006,
    Costing: 52007,
    CostingDetail: 52008,
    StockOpname: 52009,
    StockOpnameDetail: 52010,
    StoreStock: 52011,
    StoreStockCard: 52012,
    LowLevelStoreStock: 52013,
    HighLevelStoreStock: 52014,
    AllStoreStock: 52015,
    AllStoreStockCard: 52016,
    LowLevelAllStoreStock: 52017,
    HighLevelAllStoreStock: 52018,
    Production: 52019,
    ProductionDetail: 52020,
    CostRecipe: 52021,
    ReturnStock: 52022,
    ReturnStockDetail: 52023,
    DailyInventoryReconciliation: 52024,
    MonthlyInventoryReconciliation: 52025,
    InventoryReconciliation: 52026,
    AverageItemPricePurchase: 52027,
    ItemPurchasePriceGraphic: 52028,
    InventoryPurchaseRequest: 52029,
    InventoryPurchaseRequestDetail: 52030,
    StoreRequisition: 52031,
    StoreRequisitionDetail: 52032,
    RecapitulationFoodAndBeverage: 52033,
    RealizationCostOfGoodsSold: 52034,
    ComparisonCostSalesFbGraphic: 52035,
    FixedAssetPurchaseOrder: 53001,
    FixedAssetPurchaseOrderDetail: 53002,
    FixedAssetReceive: 53003,
    FixedAssetReceiveDetail: 53004,
    FixedAssetList: 53005,
    FixedAssetDepreciation: 53006,
  };
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
  // GENERAL FUNCTION ================================================================
  async filterDefaultValue() {
    this.form = {
      guestType: 1,
      folioOpen: 1,
      folioClose: 1,
      arrivalListOption: 1,
      guestFolio: 1,
      masterFolio: 1,
      deskFolio: 1,
      statusRoom: 2,
      roomCountSheet: 1,
      roomOption: 1,
      reportType: 1,
      detailReport: 1,
      marketStatisticSort: 1,
      marketStatistic: 1,
      hotelCompetitorSortBy: 1,
      optionSales: 1,
      paymentStatus: 1,
      filterDate: 1,
      statusOption: 1,
      statusPurchase: 1,
      journalType: 0,
      sortJournal: 1,
      balanceSheetAndProfitLossOption: 1,
      pageOption: 1,
      desciptionTextAlignment: 1,
      templateBankBookOptions: 1,
      statusPurchaseOrder: 1,
      condition: 1,
      hotelCompetitorAscending: 1,
      folioNumber: 0,
      resvNumber: 0,
      hide_outstanding: 1,
      userId: "",
      showSummaryGuestInHouse: 0,
      statusOptionBank: 2,
      store: this.activeStore
    };
    console.log(this.activeStore,"woy");
    
  }

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      portrait_landscape: 0,
      show_footer: 1,
      show_page_number: 1,
      horizontal_border: 1,
      vertical_border: 1,
    };
    this.rowData = [];
  }
  async resetForm2() {
    this.inputFormValidationGrid.resetForm();
    this.formData = {};
    this.qtyConvertion = 0;
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSubmitGrid() {
    this.inputFormValidationGrid.$el.requestSubmit();
  }

  onSave() {
    let array: any = [];
    this.rowData.forEach((element: any) => {
      if (element.selected) {
        array.push({
          fa_code: element.fa_code,
          location_code: element.location_code,
        });
      }
    });
    this.form.details = array;
    if (array.length != 0) {
      this.$emit("save", this.form);
      this.rowData = [];
    } else {
      getToastInfo(this.$t("messages.insertItem"));
    }
  }
  onClose() {
    this.$emit("close");
    this.rowData = [];
  }

  handleDoubleClick() {
    this.form.amount = this.totalAmount;
  }

  onInvalidSubmitForm() {
    focusOnInvalid();
  }

  onInvalidSubmitGrid() {
    focusOnInvalid();
  }
  loadStatelist() {}
  getRowNodeId(params: any) {
    return params.id;
  }

  gridFormCancel() {
    this.resetForm2();
    this.isSave = false;
    this.idGridEdit = 0;
  }

  handleEdit(params: any) {
    this.idGridEdit = params.idGrid;
    this.formData.item_data = params.item_code;
    this.formData.quantity = params.quantity;
    this.formData.uom = params.uom_code;
    this.formData.remark = params.remark;
    this.qtyConvertion = params.convertion;
    this.isSave = true;
  }

  testChange() {
    console.log(this.form.generalLedgerAccount);
  }

  async onClickGetInvAccount() {
    const { data: data1 } = await ReportAPI.GetFilter("JournalAccountExpense");
    const { data: data2 } = await ReportAPI.GetFilter("JournalAccountCosting");
    this.listDropdown.InventoryAccount = data1.concat(data2);
    console.log(this.listDropdown.InventoryAccount);
    
  }

  async onClickFilter(param: any) {
    await this.loadFilter(param);
  }

  getRowData() {
    let id_sort: number = 1;
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      rowData.push(node.data);
    });
    for (const i in rowData) {
      rowData[i].id_sort = id_sort++;
    }
    return rowData;
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadFilter(param: any) {
    try {
      const { data } = await ReportAPI.GetFilter(param);
      if (param == "GuestGroup") {
        this.form.guestType = 3;
        this.listDropdown.Group = data;
      } else if (param == "ReservationStatus") {
        this.listDropdown.Status = data;
      } else if (param == "Company") {
        this.listDropdown.Company = data;
      } else if (param == "User") {
        this.listDropdown.UserId = data;
      } else if (param == "Shift") {
        this.listDropdown.Shift = data;
      } else if (param == "SubDepartment") {
        this.listDropdown.SubDepartment = data;
      } else if (param == "Account") {
        this.listDropdown.Account = data;
      } else if (param == "CfgInitSubAccount") {
        this.listDropdown.SubAccount = data;
      } else if (param == "Nationality") {
        this.listDropdown.Nationality = data;
      } else if (param == "BusinessSource") {
        this.listDropdown.BusinessSource = data;
      } else if (param == "Market") {
        this.listDropdown.Market = data;
      } else if (param == "BookingSource") {
        this.listDropdown.BookingSource = data;
      } else if (param == "VoucherType") {
        this.listDropdown.VoucherType = data;
      } else if (param == "VoucherStatus") {
        this.listDropdown.Status = data;
      } else if (param == "VoucherStatusApprove") {
        this.listDropdown.StatusApprove = data;
      } else if (param == "VoucherStatusSold") {
        this.listDropdown.StatusSold = data;
      } else if (param == "RoomBuilding") {
        this.listDropdown.Building = data;
      } else if (param == "RoomFloor") {
        this.listDropdown.Floor = data;
      } else if (param == "RoomStatus") {
        this.listDropdown.RoomStatus = data;
      } else if (param == "Outlet") {
        this.listDropdown.Outlet = data;
      } else if (param == "ComplimentType") {
        this.listDropdown.ComplimentType = data;
      } else if (param == "CompanyType") {
        this.listDropdown.CompanyType = data;
      } else if (param == "PhoneBookType") {
        this.listDropdown.PhoneBookType = data;
      } else if (param == "Sales") {
        this.listDropdown.Sales = data;
      } else if (param == "SalesSegment") {
        this.listDropdown.Segment = data;
      } else if (param == "SalesSource") {
        this.listDropdown.Source = data;
      } else if (param == "SalesStatus") {
        this.listDropdown.LeadStatus = data;
      } else if (param == "SalesTaskStatus") {
        this.listDropdown.TaskStatus = data;
      } else if (param == "SalesProposalStatus") {
        this.listDropdown.ProposalStatus = data;
      } else if (param == "DirectBill") {
        this.listDropdown.DirectBill = data;
      } else if (param == "Product") {
        this.listDropdown.Product = data;
      } else if (param == "ProductCategory") {
        this.listDropdown.ProductCategory = data;
      } else if (param == "ProductGroup") {
        this.listDropdown.ProductGroup = data;
      } else if (param == "ItemGroup") {
        this.listDropdown.ItemGroup = data;
      } else if (param == "Item") {
        this.listDropdown.Item = data;
      } else if (param == "Store") {
        this.listDropdown.Store = data;
      } else if (param == "JournalAccount") {
        this.listDropdown.Account = data;
      } else if (param == "JournalAccountUsed") {
        this.listDropdown.JournalAccountUsed = data;
      } else if (param == "Action") {
        this.listDropdown.Action = data;
      } else if (param == "IpAddress") {
        this.listDropdown.IpAddress = data;
      } else if (param == "ComputerName") {
        this.listDropdown.ComputerName = data;
      } else if (param == "AccessName") {
        this.listDropdown.AccessName = data;
      } else if (param == "Department") {
        this.listDropdown.Department = data;
      } else if (param == "BankAccount") {
        this.listDropdown.BankAccount = data;
      } else if (param == "JournalAccountBank") {
        this.listDropdown.JournalAccountBank = data;
      } else if (param == "Venue") {
        this.listDropdown.Venue = data;
      } else if (param == "AccountCharge") {
        this.listDropdown.Account = data;
      } else if (param == "RoomType") {
        this.listDropdown.RoomType = data;
      } else if (param == "RoomRate") {
        this.listDropdown.RoomRate = data;
      } else if (param == "AllBuilding") {
        this.listDropdown.AllBuilding = data;
      }else if (param == "FAItem") {
        this.listDropdown.FAItem = data;
      }else if (param == "FALocation") {
        this.listDropdown.FALocation = data;
      }
    } catch (error) {}
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: 0,
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
    };
    this.columnDefs = [
      {
        headerName: this.$t(""),
        field: "field_name",
        rowDrag: true,
        width: 90,
      },
      { headerName: this.$t(""), field: "id_sort", width: 160, hide: true },
      {
        headerName: this.$t(""),
        field: "is_ascending",
        width: 60,
        cellEditor: "OrderDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 1) {
            return "ASC";
          } else {
            return "DESC";
          }
        },
      },
      { headerName: this.$t(""), field: "template_id", width: 160, hide: true },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      statusBarTotalRenderer: StatusBarTotalRenderer,
      checklistRenderer: checklistRenderer,
      OrderDropdownRenderer: OrderDropdownRenderer,
    };
    this.rowGroupPanelShow = "never";
    // this.statusBar = {
    //   statusPanels: [
    //     { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
    //     { statusPanel: "agTotalRowCountComponent", align: "center" },
    //     { statusPanel: "agFilteredRowCountComponent" },
    //     { statusPanel: "agSelectedRowCountComponent" },
    //     { statusPanel: "agAggregationComponent" },
    //   ],
    // };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "clientSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }
  async mounted() {
    this.gridApi = this.gridOptions.api;
    await this.onClickFilter("Store")
    this.filterDefaultValue();
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get schema() {
    return Yup.object().shape({
      location: Yup.string().required(),
    });
  }
  get disabledActionGrid() {
    return this.isSave;
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.totalFooter, this.columnDefs);
  }

  get activeStore() {
    return this.config.activeStore;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
