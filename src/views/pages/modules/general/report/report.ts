import { Options, Vue } from "vue-class-component";
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import reportAPI from "@/services/api/report/report-module";
import {
  formatCurrency,
  formatDateDatabase,
  formatDateTimeUTC,
} from "@/utils/format";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import $global from "@/utils/global";
import { getToastSuccess, getToastError } from "@/utils/toast";
import {
  generateIconContextMenuAgGrid,
  getError,
  getUserAccessUtility,
} from "@/utils/general";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
// import SearchFilter from "../components/filter/filter.vue";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import "ag-grid-enterprise";
import ReportForm from "./report-input-form/report-form.vue";
import CreateDefaultFieldForm from "./create-default-field/create-default.vue";
import CustomizeReport from "./customize-report/customize-report.vue";
import authModule from "@/stores/auth";
import Vue3TreeVue from "vue3-tree-vue";
import "vue3-tree-vue/dist/style.css";
import Filter from "./filter/filter.vue";
import configStore from "@/stores/config";

const ReportAPI = new reportAPI();

@Options({
  name: "report_page",
  components: {
    Filter,
    AgGridVue,
    ReportForm,
    CustomizeReport,
    CDialog,
    // SearchFilter,
    CSelect,
    CRadio,
    CInput,
    Checkbox,
    CDatepicker,
    Vue3TreeVue,
    CModal,
    CreateDefaultFieldForm,
  },
})
export default class Report extends Vue {
  public items: any = [];
  public itemsAll: any = [];
  public config = configStore();
  public auth = authModule();
  public itemsRaw: any = [];
  public expandedIds: any = [];
  public selectedItem: any = [];
  public filtered: boolean = true;
  public is_expand: boolean = false;
  public rowData: any = [];
  public showForm: boolean = false;
  public showCreateDefaultFieldForm: boolean = false;
  public showCustomizeReport: boolean = false;
  public showFormHistory: boolean = false;
  public dateDisabled: boolean = false;
  public allDateDisabled: boolean = false;
  public yearDisabled: boolean = false;
  public dateRangeDisabled: boolean = false;
  public semesterDisabled: boolean = false;
  public monthDisabled: boolean = false;
  public modeData: any;
  public modeReport: any;
  public form: any = {};
  public dateRange: any = {};
  public inputFormElement: any = ref();
  public filterElement: any = ref();
  public customizeReportElement: any = ref();
  public inputFormElementHistory: any = ref();
  public createDefaultFieldElement: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  public templateId: any;
  public disabledCustomize: any = true;
  public disablePreview: any = true;
  public showDRR: boolean = false;
  public DRRTittle: any;
  public DRRResult: any;
  public isSaving: boolean = false;

  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
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
  public listDropdown: any = {
    weekList: [],
    yearList: [],
    monthList: [],
    quarterList: [
      { code: "I", name: "I" },
      { code: "II", name: "II" },
      { code: "III", name: "III" },
      { code: "IV", name: "IV" },
    ],
    semesterList: [
      { code: "I", name: "I" },
      { code: "II", name: "II" },
    ],
  };
  // Extra Variable for Insert Reconciliation
  public cellSelectedStatusActive: any;
  public cellSelectedStatusBlacklist: any;
  public cellSelected: any;
  public isCellSelected: boolean = false;
  public faCode: any;
  public searchReport: any;
  public reportCode: any = "";
  public reportId: any;
  public dateForm: any;
  public dateTo: any;

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
  agGridSetting: any = null;
  itemSelected: any = {};
  isCanCustomizeReport: boolean = false;
  isCanEditReport: boolean = false;
  user: any = {};
  // GENERAL FUNCTION ================================================================
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
  async handleEdit(params: any) {
    if (!this.isCanEditReport) return;
    this.modeData = $global.modeData.edit;
    console.log(this.userId);
    if (params.is_system == 1 && this.userId != "SYSTEM") {
      getToastError(this.$t("messages.cantEditSystem"));
    } else {
      await this.GetReport(params.report_code, params.id);
    }
  }
  async handleDuplicate(params: any) {
    if (!this.isCanEditReport) return;
    this.modeData = $global.modeData.duplicate;
    await this.GetReport(params.report_code, params.id);
  }
  handleDelete(params: any) {
    if (!this.isCanEditReport) return;
    if (params.is_system == 1) {
      getToastError(this.$t("messages.cantEditSystem"));
    } else {
      this.showDialog = true;
      this.deleteParam = params.id;
    }
  }
  refreshData(search: any) {
    this.loadDataGrid(search);
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
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () => this.handleDuplicate(this.paramsData),
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
        action: () => this.handleShowForm(this.paramsData, 2),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.setDefault"),
        disabled: !this.paramsData,
        action: () =>
          this.updateDefaultReport(this.paramsData.id, this.reportCode),
      },
    ];
    return result;
  }
  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  async handleSearchReport() {
    this.disablePreview = true;
    var searchStr = this.searchReport;
    this.filtered = false;
    if (searchStr == "") {
      this.items = this.itemsAll;
      this.expandedIds = [];
      await this.$nextTick();
      this.filtered = true;
    } else {
      const regexp = new RegExp(searchStr, "i");
      var res = this.itemsRaw.filter((x: any) => {
        return regexp.test(x.name);
      });
      console.log(res);

      if (res.length != 0) {
        this.items = this.reportListArrange(res, "search");
        this.expandedIds = this.items.map((i: any) => i.id);
        this.items.forEach((element: any) => {
          if (element.children.length != 0) {
            element.children.forEach((element1: any) => {
              if (element1.children.length != 0) {
                this.expandedIds.push(element1.id);
              }
            });
          }
        });
        await this.$nextTick();
        this.filtered = true;
      } else {
        this.items = this.itemsAll;
        this.expandedIds = [];
        await this.$nextTick();
        this.filtered = true;
      }
    }
  }

  async handleResetDateRange() {
    let date = formatDateTimeUTC(new Date());
    let date1 = date.split("T");
    var splitedDate = date1[0].split("-");
    let month = parseInt(splitedDate[1]);
    let year = parseInt(splitedDate[0]);
    var quarter = "I";
    var semester = "I";
    // Year List
    this.listDropdown.yearList = [];
    for (let index = year - 10; index <= year; index++) {
      this.listDropdown.yearList.push({ code: index, name: index });
    }
    for (let index = year + 1; index <= year + 10; index++) {
      this.listDropdown.yearList.push({ code: index, name: index });
    }
    // Week List
    this.listDropdown.weekList = [];
    for (let index = 1; index <= 53; index++) {
      this.listDropdown.weekList.push({ code: index, name: index });
    }
    // Month List
    this.listDropdown.monthList = [];
    for (let index = 1; index <= 12; index++) {
      this.listDropdown.monthList.push({ code: index, name: index });
    }
    if (parseInt(splitedDate[1]) >= 10) {
      quarter = "IV";
    } else if (parseInt(splitedDate[1]) >= 7) {
      quarter = "III";
    } else if (parseInt(splitedDate[1]) >= 4) {
      quarter = "II";
    }
    if (parseInt(splitedDate[1]) >= 7) {
      semester = "II";
    }
    function getWeekNumber(d: any) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      var yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      var weekNo: any = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return [d.getUTCFullYear(), weekNo];
    }
    var weekNumber = getWeekNumber(new Date());

    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);

    this.dateRange = {
      type: 0,
      dateFrom: formatDateTimeUTC(new Date()),
      dateTo: formatDateDatabase(toDate),
      date: formatDateTimeUTC(new Date()),
      yearOfWeek: year,
      yearOfMonth: year,
      yearOfQuarter: year,
      yearOfSemester: year,
      year: year,
      month: month,
      quarter: quarter,
      semester: semester,
      week: weekNumber[1],
    };
  }

  handleToDateChange() {
    if (this.dateRange.dateTo < this.dateRange.dateFrom) {
      const fromDate = new Date(this.dateRange.dateFrom);
      const toDate = new Date(this.dateRange.dateTo);
      fromDate.setDate(toDate.getDate());
      fromDate.setMonth(toDate.getMonth());
      fromDate.setFullYear(toDate.getFullYear());
      // getToastError("To date cannot be lower than From date");
      this.dateRange.dateFrom = formatDateTimeUTC(fromDate);
    }
  }

  handleFromDateChange() {
    if (this.dateRange.dateFrom > this.dateRange.dateTo) {
      const fromDate = new Date(this.dateRange.dateFrom);
      const toDate = new Date(this.dateRange.dateTo);
      toDate.setDate(fromDate.getDate());
      toDate.setMonth(fromDate.getMonth());
      toDate.setFullYear(fromDate.getFullYear());
      // getToastError("To date cannot be lower than From date")
      this.dateRange.dateTo = formatDateTimeUTC(toDate);
    }
  }

  handleChangeType(type: any, disabled: any) {
    if (type == 0 && disabled == false) {
      this.dateRange.type = 0;
    }
    if (type == 1 && disabled == false) {
      this.dateRange.type = 1;
    }
    if (type == 2 && disabled == false) {
      this.dateRange.type = 2;
    }
    if (type == 3 && disabled == false) {
      this.dateRange.type = 3;
    }
    if (type == 4 && disabled == false) {
      this.dateRange.type = 4;
    }
    if (type == 5 && disabled == false) {
      this.dateRange.type = 5;
    }
    if (type == 6 && disabled == false) {
      this.dateRange.type = 6;
    } else {
      return;
    }
  }

  resetDisabled() {
    this.dateDisabled = false;
    this.allDateDisabled = false;
    this.yearDisabled = false;
    this.dateRangeDisabled = false;
    this.semesterDisabled = false;
    this.monthDisabled = false;
    this.dateRange.type = 0;
  }

  checkDisabledFilter() {
    // Date only
    if (
      this.reportCode == this.reportCodeName.GuestInForecast ||
      this.reportCode == this.reportCodeName.DailyFolioTransaction ||
      this.reportCode == this.reportCodeName.DailyChargeList ||
      this.reportCode == this.reportCodeName.DailyPaymentList ||
      this.reportCode == this.reportCodeName.GuestLedger ||
      this.reportCode == this.reportCodeName.GuestDeposit ||
      this.reportCode == this.reportCodeName.GuestAccount ||
      this.reportCode == this.reportCodeName.DailySales ||
      this.reportCode == this.reportCodeName.DailyRevenueReport ||
      this.reportCode == this.reportCodeName.DailyRevenueReportSummary ||
      this.reportCode == this.reportCodeName.TodayRoomRevenueBreakdown ||
      this.reportCode == this.reportCodeName.RoomCountSheet ||
      this.reportCode ==
        this.reportCodeName.RoomCountSheetByBuildingFloorRoomType ||
      this.reportCode == this.reportCodeName.RoomCountSheetByRoomTypeBedType ||
      this.reportCode == this.reportCodeName.RoomStatistic ||
      this.reportCode == this.reportCodeName.DailyFlashReport ||
      this.reportCode == this.reportCodeName.FoodAndBeverageStatistic ||
      this.reportCode == this.reportCodeName.IncomeStatement ||
      this.reportCode == this.reportCodeName.ProfitAndLoss ||
      this.reportCode == this.reportCodeName.ProfitAndLossDetail ||
      this.reportCode == this.reportCodeName.ProfitAndLossByDepartment ||
      this.reportCode == this.reportCodeName.ProfitAndLossDetailByDepartment ||
      this.reportCode == this.reportCodeName.ProfitAndLossBySubDepartment ||
      this.reportCode ==
        this.reportCodeName.ProfitAndLossDetailBySubDepartment ||
      this.reportCode == this.reportCodeName.DailyInventoryReconciliation ||
      this.reportCode == this.reportCodeName.ActualDepartureGuestList
    ) {
      this.resetDisabled();
      this.allDateDisabled = true;
      this.yearDisabled = true;
      this.dateRangeDisabled = true;
      this.semesterDisabled = true;
      this.monthDisabled = true;
      this.dateRange.type = 0;
    }
    // Disable All
    else if (
      this.reportCode == this.reportCodeName.RepeaterGuest ||
      this.reportCode == this.reportCodeName.FolioOpenBalance ||
      this.reportCode == this.reportCodeName.RoomList ||
      this.reportCode == this.reportCodeName.RoomRate ||
      this.reportCode == this.reportCodeName.RoomRateBreakdown ||
      this.reportCode == this.reportCodeName.RoomRateStructure ||
      this.reportCode == this.reportCodeName.Package ||
      this.reportCode == this.reportCodeName.PackageBreakdown ||
      this.reportCode == this.reportCodeName.RoomStatus ||
      this.reportCode == this.reportCodeName.ProductCategory ||
      this.reportCode == this.reportCodeName.ProductList ||
      this.reportCode == this.reportCodeName.OperationalAccount ||
      this.reportCode == this.reportCodeName.ChartOfAccount ||
      this.reportCode == this.reportCodeName.Uom ||
      this.reportCode == this.reportCodeName.InventoryItem ||
      this.reportCode == this.reportCodeName.FixedAssetItem
    ) {
      this.resetDisabled();
      this.dateDisabled = true;
      this.allDateDisabled = true;
      this.yearDisabled = true;
      this.dateRangeDisabled = true;
      this.semesterDisabled = true;
      this.monthDisabled = true;
      this.dateRange.type = 10;
      this.dateForm = "";
      this.dateTo = "";
    }
    // Year only
    else if (
      this.reportCode == this.reportCodeName.YearlyFolioTransaction ||
      this.reportCode == this.reportCodeName.YearlyChargeList ||
      this.reportCode == this.reportCodeName.YearlyPaymentList ||
      this.reportCode == this.reportCodeName.GuestForecastReportYearly ||
      this.reportCode == this.reportCodeName.RealizationCostOfGoodSold ||
      this.reportCode == this.reportCodeName.BalanceMultiPeriod ||
      this.reportCode == this.reportCodeName.ProfitAndLossMultiPeriodDetail
    ) {
      this.resetDisabled();
      this.dateDisabled = true;
      this.allDateDisabled = true;
      this.dateRangeDisabled = true;
      this.semesterDisabled = true;
      this.monthDisabled = true;
      this.dateRange.type = 6;
    }
    // Month only
    else if (
      this.reportCode == this.reportCodeName.TrialBalance ||
      this.reportCode == this.reportCodeName.WorkSheet ||
      this.reportCode == this.reportCodeName.BalanceSheet ||
      this.reportCode == this.reportCodeName.MonthlyInventoryReconciliation ||
      this.reportCode == this.reportCodeName.BanquetCalender ||
      this.reportCode == this.reportCodeName.BanquetForecast
    ) {
      this.resetDisabled();
      this.dateDisabled = true;
      this.allDateDisabled = true;
      this.dateRangeDisabled = true;
      this.semesterDisabled = true;
      this.yearDisabled = true;
      this.dateRange.type = 3;
    }
    // Disable year and semester
    else if (this.reportCode == this.reportCodeName.GuestForecastComparison) {
      this.resetDisabled();
      this.semesterDisabled = true;
      this.yearDisabled = true;
      this.dateRange.type = 0;
    }
    // Disable date range
    else if (
      this.reportCode == this.reportCodeName.BusinessSourceProductivity
    ) {
      this.resetDisabled();
      this.dateRangeDisabled = true;
      this.dateRange.type = 0;
    } else {
      this.dateDisabled = false;
      this.allDateDisabled = false;
      this.yearDisabled = false;
      this.dateRangeDisabled = false;
      this.semesterDisabled = false;
      this.monthDisabled = false;
      if (this.dateRange.type == 10) {
        this.dateRange.type = 0;
      }
    }
  }

  getFilterDate() {
    if (this.dateRange.type == 0) {
      this.dateForm = formatDateDatabase(this.dateRange.date);
      this.dateTo = "";
    } else if (this.dateRange.type == 1) {
      this.dateForm = formatDateDatabase(this.dateRange.dateFrom);
      this.dateTo = formatDateDatabase(this.dateRange.dateTo);
    } else if (this.dateRange.type == 2) {
      this.dateForm = this.dateRange.week;
      this.dateTo = this.dateRange.yearOfWeek;
    } else if (this.dateRange.type == 3) {
      this.dateForm = this.dateRange.month;
      this.dateTo = this.dateRange.yearOfMonth;
    } else if (this.dateRange.type == 4) {
      this.dateForm = this.dateRange.quarter;
      this.dateTo = this.dateRange.yearOfQuarter;
    } else if (this.dateRange.type == 5) {
      this.dateForm = this.dateRange.semester;
      this.dateTo = this.dateRange.yearOfSemester;
    } else if (this.dateRange.type == 6) {
      this.dateForm = this.dateRange.year;
      this.dateTo = "";
    }
  }

  runReport(
    templateId: number,
    reportCode: number,
    filterIndex1: any,
    filterIndex2: any,
    filterIndex3: any,
    filterIndex4: any,
    filterIndex5: any,
    filterIndex6: any,
    filterIndex7: any,
    filterIndex8: any,
    filterText1: any,
    filterText2: any,
    filterText3: any,
    filterText4: any,
    filterText5: any,
    filterText6: any,
    filterText7: any,
    filterText8: any,
    filterDateIndex: any,
    filterDateText1: any,
    filterDateText2: any,
    filterBoolean1: any,
    filterBoolean2: any,
    filterBoolean3: any,
    filterBoolean4: any,
    filterBoolean5: any,
    filterBoolean6: any,
    filterBoolean7: any,
    filterBoolean8: any
  ) {
    const routeData = this.$router.resolve(
      `/report-view?report=${templateId}&reportCode=${reportCode}&filterDateText1=${
        filterDateText1 ?? ""
      }&filterDateText2=${filterDateText2 ?? ""}&filter_index1=${
        filterIndex1 ?? 0
      }&filter_index2=${filterIndex2 ?? 0}&filter_index3=${
        filterIndex3 ?? 0
      }&filter_index4=${filterIndex4 ?? 0}&filter_index5=${
        filterIndex5 ?? 0
      }&filter_index6=${filterIndex6 ?? 0}&filter_index7=${
        filterIndex7 ?? 0
      }&filter_index8=${filterIndex8 ?? 0}&filter_text1=${
        filterText1 ?? ""
      }&filter_text2=${filterText2 ?? ""}&filter_text3=${
        filterText3 ?? ""
      }&filter_text4=${filterText4 ?? ""}&filter_text5=${
        filterText5 ?? ""
      }&filter_text6=${filterText6 ?? ""}&filter_text7=${
        filterText7 ?? ""
      }&filter_text8=${filterText8 ?? ""}&filterDateIndex=${
        filterDateIndex ?? ""
      }&filter_bool1=${filterBoolean1 ?? ""}&filter_bool2=${
        filterBoolean2 ?? ""
      }&filter_bool3=${filterBoolean3 ?? ""}&filter_bool4=${
        filterBoolean4 ?? ""
      }&filter_bool5=${filterBoolean5 ?? ""}&filter_bool6=${
        filterBoolean6 ?? ""
      }&filter_bool7=${filterBoolean7 ?? ""}&filter_bool8=${
        filterBoolean8 ?? ""
      }`
    );
    window.open(routeData.href, "_blank");
  }

  previewReport() {
    this.getFilterDate();
    //Check if its static report or not
    if (this.templateId == 0) {
      if (this.reportCode == this.reportCodeName.MarketStatistic) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.marketStatistic,
          this.filterElement.form.marketStatisticSort,
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.market,
          this.filterElement.form.busiSour,
          this.filterElement.form.company,
          this.filterElement.form.roomType,
          this.filterElement.form.roomRate,
          this.filterElement.form.sales,
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.ascending,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.GuestInHouseListing) {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.room_type,
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showReservationBy,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.RoomProduction) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.reportType,
          this.filterElement.form.detailReport,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.Journal) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.ortJournal,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.department,
          this.filterElement.form.subDepartment,
          this.filterElement.form.journalType,
          this.filterElement.form.account,
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.WorkSheet ||
        this.reportCode == this.reportCodeName.BalanceSheet ||
        this.reportCode == this.reportCodeName.BalanceMultiPeriod ||
        this.reportCode == this.reportCodeName.ProfitAndLossDetail
      ) {
        this.runReport(
          0,
          this.reportCode,
          this.reportCode == this.reportCodeName.WorkSheet
            ? ""
            : this.filterElement.form.balanceSheetAndProfitLossOption,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.reportCode == this.reportCodeName.WorkSheet
            ? this.filterElement.form.calculateIncomeCostandExpense
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.ProfitAndLossBySubDepartment ||
        this.reportCode ==
          this.reportCodeName.ProfitAndLossDetailBySubDepartment ||
        this.reportCode == this.reportCodeName.ProfitAndLossByDepartment ||
        this.reportCode == this.reportCodeName.ProfitAndLossDetailByDepartment
      ) {
        if (
          this.reportCode == this.reportCodeName.ProfitAndLossBySubDepartment
        ) {
          this.modeReport = 1;
        } else if (
          this.reportCode ==
          this.reportCodeName.ProfitAndLossDetailBySubDepartment
        ) {
          this.modeReport = 2;
        } else if (
          this.reportCode == this.reportCodeName.ProfitAndLossByDepartment
        ) {
          this.modeReport = 3;
        } else if (
          this.reportCode == this.reportCodeName.ProfitAndLossDetailByDepartment
        ) {
          this.modeReport = 4;
        }

        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.pageOption,
          this.reportCode ==
            this.reportCodeName.ProfitAndLossDetailByDepartment ||
            this.reportCode ==
              this.reportCodeName.ProfitAndLossDetailBySubDepartment
            ? this.filterElement.form.balanceSheetAndProfitLossOption
            : "",
          this.modeReport,
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.department,
          this.filterElement.form.subDepartment,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.GeneralLedger) {
        if (
          this.filterElement.form.generalLedgerAccount == null ||
          this.filterElement.form.generalLedgerAccount == ""
        ) {
          getToastError("Insert Account");
        } else {
          this.runReport(
            0,
            this.reportCode,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            this.filterElement.form.company,
            this.filterElement.form.subDepartment,
            this.filterElement.form.journalType,
            this.filterElement.form.userId,
            this.filterElement.form.generalLedgerAccount,
            "",
            "",
            "",
            this.dateRange.type,
            this.dateForm,
            this.dateTo,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          );
        }
      } else if (
        this.reportCode == this.reportCodeName.BankBookAccount ||
        this.reportCode == this.reportCodeName.BankBookAccountGroup ||
        this.reportCode == this.reportCodeName.BankBookAccountSummary
      ) {
        if (
          this.filterElement.form.bankAccount == null ||
          this.filterElement.form.bankAccount == ""
        ) {
          getToastError("Insert Bank Account");
        } else {
          this.runReport(
            0,
            this.reportCode,
            this.reportCode == this.reportCodeName.BankBookAccount
              ? this.filterElement.form.templateBankBookOptions
              : "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            this.filterElement.form.bankAccount,
            this.filterElement.form.journalAccount,
            this.filterElement.form.company,
            "",
            "",
            "",
            "",
            "",
            this.dateRange.type,
            this.dateForm,
            this.dateTo,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          );
        }
      } else if (
        this.reportCode == this.reportCodeName.InventoryReconciliation ||
        this.reportCode == this.reportCodeName.DailyInventoryReconciliation ||
        this.reportCode == this.reportCodeName.MonthlyInventoryReconciliation
      ) {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.itemType,
          this.filterElement.form.itemGroupInventory,
          this.filterElement.form.unit,
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.ItemPurchasePriceGraphic
      ) {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.supplier,
          this.filterElement.form.store,
          "",
          this.filterElement.form.category,
          this.filterElement.form.item,
          this.filterElement.form.itemGroup,
          this.filterElement.form.itemType,
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.DailyHotelCompetitor) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.hotelCompetitorSortBy,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.hotelCompetitorAscending,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.TransactionReportByStaff ||
        this.reportCode == this.reportCodeName.TaxBreakdownDetailed
      ) {
        if (this.filterElement.form.userId == "") {
          getToastError("User ID is required");
          console.log("JALAN");
          return;
        } else {
          this.runReport(
            0,
            this.reportCode,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            this.reportCode == this.reportCodeName.TransactionReportByStaff
              ? this.filterElement.form.resvNumber +
                  "|" +
                  this.filterElement.form.folioNumber
              : "",
            this.reportCode == this.reportCodeName.CashierReportReprint
              ? ""
              : this.filterElement.form.busiSour,
            this.reportCode == this.reportCodeName.CashierReportReprint
              ? ""
              : this.filterElement.form.company,
            this.filterElement.form.userId,
            this.filterElement.form.shift,
            this.filterElement.form.subDepartment,
            this.filterElement.form.account,
            this.filterElement.form.subAccount,
            this.dateRange.type,
            this.dateForm,
            this.dateTo,
            this.filterElement.form.folioOpen,
            this.filterElement.form.folioClose,
            this.filterElement.form.showAccountPayable,
            this.filterElement.form.guestFolio,
            this.filterElement.form.masterFolio,
            this.filterElement.form.deskFolio,
            "",
            ""
          );
        }
      } else if (this.reportCode == this.reportCodeName.CashierReportReprint) {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.outlet,
          "",
          "",
          this.filterElement.form.userId,
          this.filterElement.form.shift,
          this.filterElement.form.subDepartment,
          this.filterElement.form.account,
          this.filterElement.form.subAccount,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.folioOpen,
          this.filterElement.form.folioClose,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.guestFolio,
          this.filterElement.form.masterFolio,
          this.filterElement.form.deskFolio,
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.RoomRateBreakdown ||
        this.reportCode == this.reportCodeName.PackageBreakdown
      ) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.statusRoom,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.RoomCountSheet) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.roomCountSheet,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.RoomSalesByRoomNumber) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.roomOption,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.RateCodeAnalysis) {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.roomRate,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.SalesContributionAnalysis
      ) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.optionSales,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.dontShowIfMarketingNA,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.SalesActivityDetail) {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.filterElement.form.sales,
          this.filterElement.form.segment,
          this.filterElement.form.source,
          this.filterElement.form.leadStatus,
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.includingVoidStatus,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.IncomeStatement) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.pageOption,
          this.filterElement.form.desciptionTextAlignment,
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.unit,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.includingVoidStatus,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.ActualDepartureGuestList
      ) {
        this.runReport(
          0,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.filterElement.form.group,
          this.filterElement.form.room_type,
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else {
        this.runReport(
          0,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }
    } else {
      //Reservation List
      if (this.reportCode == this.reportCodeName.ReservationList) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          this.filterElement.form.status,
          this.filterElement.form.company,
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.CancelledReservation ||
        this.reportCode == this.reportCodeName.NoShowReservation ||
        this.reportCode == this.reportCodeName.VoidedReservation ||
        this.reportCode == this.reportCodeName.SamedayReservation ||
        this.reportCode == this.reportCodeName.BalanceDeposit ||
        this.reportCode == this.reportCodeName.WaitListReservation
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.GroupReservation) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          this.filterElement.form.status,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.ExpectedArrival ||
        this.reportCode == this.reportCodeName.ExpectedDeparture
      ) {
        this.runReport(
          this.filterElement.form.showSummaryGuestInHouse == 1
            ? 0
            : this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          "",
          this.filterElement.form.company,
          "",
          "",
          "",
          this.filterElement.form.room_type,
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showSummaryGuestInHouse,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.DayUse) {
        this.runReport(
          this.filterElement.form.showSummaryGuestInHouse == 1
            ? 0
            : this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.room_type,
          this.filterElement.form.company,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showSummaryGuestInHouse,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.ArrivalList) {
        this.runReport(
          this.filterElement.form.showSummaryGuestInHouse == 1
            ? 0
            : this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          this.filterElement.form.arrivalListOption,
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          "",
          this.filterElement.form.company,
          this.filterElement.form.userId,
          "",
          "",
          this.filterElement.form.room_type,
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showSummaryGuestInHouse,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.AdvancedPaymentDeposit
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.userId,
          this.filterElement.form.shift,
          this.filterElement.form.subDepartment,
          this.filterElement.form.account,
          this.filterElement.form.subAccount,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          this.filterElement.form.showAccountPayable,
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Front Desk
      else if (
        this.reportCode == this.reportCodeName.CurrentInHouse ||
        this.reportCode == this.reportCodeName.GuestInHouseByGuestType ||
        this.reportCode == this.reportCodeName.GuestInHouseByCountry ||
        this.reportCode == this.reportCodeName.GuestInHouseByState ||
        this.reportCode == this.reportCodeName.GuestInHouseByCity
      ) {
        this.runReport(
          this.filterElement.form.showSummaryGuestInHouse == 1
            ? 0
            : this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          "",
          "",
          "",
          "",
          this.filterElement.form.room_type,
          "",
          this.filterElement.form.company,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.reportCode == this.reportCodeName.CurrentInHouse
            ? this.filterElement.form.showSummaryGuestInHouse
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.GuestInHouse ||
        this.reportCode == this.reportCodeName.GuestInHouseByBusinessSource ||
        this.reportCode == this.reportCodeName.GuestInHouseByMarket ||
        this.reportCode == this.reportCodeName.GuestInForecast ||
        this.reportCode == this.reportCodeName.EarlyCheckIn ||
        this.reportCode == this.reportCodeName.EarlyDeparture ||
        this.reportCode == this.reportCodeName.ExtendedDeparture ||
        this.reportCode == this.reportCodeName.DepartureList
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.guestType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.group,
          this.filterElement.form.busiSour,
          this.filterElement.form.company,
          this.filterElement.form.market,
          "",
          "",
          this.filterElement.form.room_type,
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showHouseUse,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.GuestInHouseByNationality ||
        this.reportCode == this.reportCodeName.GuestInHouseByBookingSource
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.nationality,
          this.filterElement.form.bookingSource,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.FolioList ||
        this.reportCode == this.reportCodeName.MasterFolio ||
        this.reportCode == this.reportCodeName.DeskFolio
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.folioOpen,
          this.filterElement.form.folioClose,
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.FolioTransaction ||
        this.reportCode == this.reportCodeName.DailyFolioTransaction ||
        this.reportCode == this.reportCodeName.MonthlyFolioTransaction ||
        this.reportCode == this.reportCodeName.YearlyFolioTransaction ||
        this.reportCode == this.reportCodeName.ChargeList ||
        this.reportCode == this.reportCodeName.DailyChargeList ||
        this.reportCode == this.reportCodeName.MonthlyChargeList ||
        this.reportCode == this.reportCodeName.YearlyChargeList ||
        this.reportCode == this.reportCodeName.CashSummaryReport ||
        this.reportCode == this.reportCodeName.PaymentList ||
        this.reportCode == this.reportCodeName.DailyPaymentList ||
        this.reportCode == this.reportCodeName.MonthlyPaymentList ||
        this.reportCode == this.reportCodeName.YearlyPaymentList ||
        this.reportCode == this.reportCodeName.DailySales ||
        this.reportCode == this.reportCodeName.VoidList ||
        this.reportCode == this.reportCodeName.TransactionReportByStaff
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.reportCode == this.reportCodeName.TransactionReportByStaff
            ? this.filterElement.form.resvNumber + ""
            : "",
          this.reportCode == this.reportCodeName.CashierReport ||
            this.reportCode == this.reportCodeName.CashierReportReprint
            ? ""
            : this.filterElement.form.busiSour,
          this.reportCode == this.reportCodeName.CashierReport ||
            this.reportCode == this.reportCodeName.CashierReportReprint
            ? ""
            : this.filterElement.form.company,
          this.filterElement.form.userId,
          this.filterElement.form.shift,
          this.filterElement.form.subDepartment,
          this.filterElement.form.account,
          this.filterElement.form.subAccount,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.folioOpen,
          this.filterElement.form.folioClose,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.guestFolio,
          this.filterElement.form.masterFolio,
          this.filterElement.form.deskFolio,
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.CashierReport) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.outlet,
          "",
          "",
          this.filterElement.form.userId,
          this.filterElement.form.shift,
          this.filterElement.form.subDepartment,
          this.filterElement.form.account,
          this.filterElement.form.subAccount,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.folioOpen,
          this.filterElement.form.folioClose,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.guestFolio,
          this.filterElement.form.masterFolio,
          this.filterElement.form.deskFolio,
          "",
          ""
        );
      }
      //Member, Voucher, Gift
      else if (this.reportCode == this.reportCodeName.Voucher) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.type,
          this.filterElement.form.status,
          this.filterElement.form.statusApprove,
          this.filterElement.form.statusSold,
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Room
      else if (
        this.reportCode == this.reportCodeName.RoomRate ||
        this.reportCode == this.reportCodeName.RoomRateBreakdown ||
        this.reportCode == this.reportCodeName.Package ||
        this.reportCode == this.reportCodeName.PackageBreakdown
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.statusRoom,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.RoomSalesByRoomNumber) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          this.filterElement.form.roomOption,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.RoomStatus) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.building,
          this.filterElement.form.floor,
          this.filterElement.form.roomStatus,
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Cakrasoft Point Of Sales
      else if (
        this.reportCode == this.reportCodeName.Sales ||
        this.reportCode == this.reportCodeName.SalesSummary
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.reportCode == this.reportCodeName.SalesSummary
            ? this.filterElement.form.category
            : "",
          this.reportCode == this.reportCodeName.SalesSummary
            ? this.filterElement.form.group
            : "",
          this.reportCode == this.reportCodeName.Sales
            ? this.filterElement.form.product
            : "",
          this.filterElement.form.userId,
          this.filterElement.form.shift,
          this.filterElement.form.subDepartment,
          this.filterElement.form.complimentType,
          this.filterElement.form.outlet,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.showComplimentOnly,
          this.reportCode == this.reportCodeName.Sales
            ? this.filterElement.form.hadCommission
            : "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.FrequentlySales) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.userId,
          this.filterElement.form.shift,
          this.filterElement.form.itemGroup,
          this.filterElement.form.outlet,
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.includeAllProduct,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.CaptainOrderList ||
        this.reportCode == this.reportCodeName.CancelledCaptainOrder ||
        this.reportCode == this.reportCodeName.CancelledCaptainOrderDetail ||
        this.reportCode == this.reportCodeName.VoidedCheckList
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.outlet,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.showComplimentOnly,
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Profile
      else if (this.reportCode == this.reportCodeName.PhoneBook) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.phoneBookType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.showComplimentOnly,
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.Company) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.companyType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.showComplimentOnly,
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Marketing Graphic & Analysis
      else if (this.reportCode == this.reportCodeName.Company) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.companyType,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showAccountPayable,
          this.filterElement.form.showComplimentOnly,
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Sales Activity
      else if (
        this.reportCode == this.reportCodeName.LeadList ||
        this.reportCode == this.reportCodeName.TaskList ||
        this.reportCode == this.reportCodeName.ProposalList ||
        this.reportCode == this.reportCodeName.ActivityLog ||
        this.reportCode == this.reportCodeName.SalesActivityDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.sales,
          this.filterElement.form.company,
          this.filterElement.form.segment,
          this.filterElement.form.source,
          this.filterElement.form.leadStatus,
          this.filterElement.form.taskStatus,
          this.filterElement.form.proposalStatus,
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.includingVoidStatus,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //City Ledger
      else if (this.reportCode == this.reportCodeName.CityLedgerList) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.paymentStatus,
          this.filterElement.form.filterDate,
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.directBill,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.CityLedgerAgingReport ||
        this.reportCode == this.reportCodeName.CityLedgerAgingReportDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          this.filterElement.form.filterDate,
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.directBill,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.showPercentage,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.CityLedgerInvoice ||
        this.reportCode == this.reportCodeName.CityLedgerInvoiceDetail ||
        this.reportCode == this.reportCodeName.CityLedgerInvoicePayment ||
        this.reportCode == this.reportCodeName.CityLedgerInvoiceMutation
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.CityLedgerInvoiceMutation
            ? ""
            : this.filterElement.form.paymentStatus,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.reportCode == this.reportCodeName.BankTransactionList
            ? ""
            : this.filterElement.form.directBill,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.BankTransactionList) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.statusOptionBank,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      //Ap Refund Deposit & Commission
      else if (
        this.reportCode == this.reportCodeName.ApCommissionAndOtherList ||
        this.reportCode ==
          this.reportCodeName.ApCommissionAndOtherAgingReport ||
        this.reportCode ==
          this.reportCodeName.ApCommissionAndOtherAgingReportDetail ||
        this.reportCode == this.reportCodeName.ApCommissionAndOtherPayment ||
        this.reportCode == this.reportCodeName.ApCommissionAndOtherMutation
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.ApCommissionAndOtherList
            ? this.filterElement.form.paymentStatus
            : "",
          this.reportCode == this.reportCodeName.ApCommissionAndOtherList ||
            this.reportCode ==
              this.reportCodeName.ApCommissionAndOtherAgingReport ||
            this.reportCode ==
              this.reportCodeName.ApCommissionAndOtherAgingReportDetail
            ? this.filterElement.form.filterDate
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.filterElement.form.filterAccount,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.ApRefundDepositList ||
        this.reportCode == this.reportCodeName.ApRefundDepositAgingReport ||
        this.reportCode == this.reportCodeName.ApRefundDepositAgingReportDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.ApRefundDepositList
            ? this.filterElement.form.paymentStatus
            : "",
          this.filterElement.form.filterDate,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.AccountPayableList ||
        this.reportCode == this.reportCodeName.AccountPayablePayment ||
        this.reportCode == this.reportCodeName.AccountPayableMutation
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.AccountReceivableList
            ? this.filterElement.form.statusOption
            : "",
          this.reportCode == this.reportCodeName.AccountReceivableList
            ? this.filterElement.form.filterDate
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.filterElement.form.account,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.AccountPayableAgingReport ||
        this.reportCode ==
          this.reportCodeName.AccountPayableAgingReportDetail ||
        this.reportCode == this.reportCodeName.AccountReceivableAgingReport ||
        this.reportCode ==
          this.reportCodeName.AccountReceivableAgingReportDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.filterDate,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.filterElement.form.account,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.filterElement.form.hide_outstanding,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }

      // Product and Product Sales
      else if (
        this.reportCode == this.reportCodeName.ProductList ||
        this.reportCode == this.reportCodeName.ProductCosting ||
        this.reportCode == this.reportCodeName.ProductCostingItem
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.reportCode == this.reportCodeName.ProductList
            ? ""
            : this.filterElement.form.userId,
          this.reportCode == this.reportCodeName.ProductList
            ? ""
            : this.filterElement.form.shift,
          this.reportCode == this.reportCodeName.ProductList
            ? ""
            : this.filterElement.form.product,
          this.filterElement.form.outlet,
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.reportCode == this.reportCodeName.ProductList
            ? this.filterElement.form.includeInactiveProduct
            : "",
          this.reportCode == this.reportCodeName.ProductList
            ? this.filterElement.form.soldStatusOnly
            : "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.AccountReceivableList ||
        this.reportCode == this.reportCodeName.AccountReceivablePayment ||
        this.reportCode == this.reportCodeName.AccountReceivableMutation
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.AccountReceivableList
            ? this.filterElement.form.statusOption
            : "",
          this.reportCode == this.reportCodeName.AccountReceivableList
            ? this.filterElement.form.filterDate
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company,
          this.filterElement.form.account,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.InventoryItem) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.category, // text
          this.filterElement.form.itemGroupInventory,
          this.filterElement.form.itemType,
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.InventoryPurchaseRequest
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.statusPurchase ?? 0,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "", // text
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.InventoryPurchaseOrder ||
        this.reportCode == this.reportCodeName.FixedAssetPurchaseOrder ||
        this.reportCode == this.reportCodeName.FixedAssetPurchaseOrderDetail ||
        this.reportCode == this.reportCodeName.FixedAssetReceive ||
        this.reportCode == this.reportCodeName.FixedAssetReceiveDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.InventoryPurchaseOrder
            ? this.filterElement.form.statusPurchaseOrder ?? 0
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.supplier, // text
          this.reportCode == this.reportCodeName.FixedAssetReceiveDetail
            ? this.filterElement.form.faItem
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.FixedAssetList) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.filterElement.form.condition,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.faItem, // text
          this.filterElement.form.faLocation,
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }
      //ASSET
      else if (
        this.reportCode == this.reportCodeName.InventoryPurchaseOrderDetail ||
        this.reportCode == this.reportCodeName.InventoryPurchaseRequestDetail ||
        this.reportCode == this.reportCodeName.ReceiveStockDetail ||
        this.reportCode == this.reportCodeName.AverageItemPricePurchase
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          this.reportCode == this.reportCodeName.InventoryPurchaseOrderDetail ||
            this.reportCode ==
              this.reportCodeName.InventoryPurchaseRequestDetail
            ? this.filterElement.statusPurchase
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.supplier,
          this.filterElement.form.store,
          "",
          this.filterElement.form.category,
          this.filterElement.form.item,
          this.filterElement.form.itemGroupInventory,
          this.filterElement.form.itemType,
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.reportCode == this.reportCodeName.ReceiveStockDetail
            ? this.filterElement.form.showDirectlyOutOnly
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.ReceiveStock ||
        this.reportCode == this.reportCodeName.StoreRequisition ||
        this.reportCode == this.reportCodeName.StoreRequisitionDetail ||
        this.reportCode == this.reportCodeName.StockTransferDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.reportCode == this.reportCodeName.ReceiveStock
            ? this.filterElement.form.supplier
            : "",
          this.reportCode == this.reportCodeName.StoreRequisition ||
            this.reportCode == this.reportCodeName.StockTransferDetail ||
            this.reportCode == this.reportCodeName.StoreRequisitionDetail
            ? this.filterElement.form.store
            : "",
          this.reportCode == this.reportCodeName.StoreRequisitionDetail ||
            this.reportCode == this.reportCodeName.StockTransferDetail
            ? this.filterElement.form.toStore
            : "",
          this.reportCode == this.reportCodeName.StockTransferDetail ||
            this.reportCode == this.reportCodeName.StoreRequisitionDetail
            ? this.filterElement.form.category
            : "",
          this.reportCode == this.reportCodeName.StockTransferDetail ||
            this.reportCode == this.reportCodeName.StoreRequisitionDetail
            ? this.filterElement.form.item
            : "",
          this.reportCode == this.reportCodeName.StockTransferDetail
            ? this.filterElement.form.itemGroupInventory
            : "",
          this.reportCode == this.reportCodeName.StockTransferDetail
            ? this.filterElement.form.itemType
            : "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.reportCode == this.reportCodeName.ReceiveStock
            ? this.filterElement.form.showDirectlyOutOnly
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.Costing ||
        this.reportCode == this.reportCodeName.CostingDetail ||
        this.reportCode == this.reportCodeName.StockOpnameDetail ||
        this.reportCode == this.reportCodeName.AllStoreStock ||
        this.reportCode == this.reportCodeName.AllStoreStockCard ||
        this.reportCode == this.reportCodeName.LowLevelAllStoreStock ||
        this.reportCode == this.reportCodeName.HighLevelAllStoreStock
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.reportCode == this.reportCodeName.CostingDetail ||
            this.reportCode == this.reportCodeName.Costing
            ? this.filterElement.form.subDepartment
            : "",
          this.reportCode == this.reportCodeName.StockOpnameDetail ||
            this.reportCode == this.reportCodeName.AllStoreStock ||
            this.reportCode == this.reportCodeName.AllStoreStockCard ||
            this.reportCode == this.reportCodeName.LowLevelAllStoreStock ||
            this.reportCode == this.reportCodeName.HighLevelAllStoreStock
            ? ""
            : this.filterElement.form.store,
          "",
          this.reportCode == this.reportCodeName.Costing ||
            this.reportCode == this.reportCodeName.StockOpnameDetail
            ? ""
            : this.filterElement.form.category,
          this.reportCode == this.reportCodeName.Costing ||
            this.reportCode == this.reportCodeName.StockOpnameDetail
            ? ""
            : this.filterElement.form.item,
          this.reportCode == this.reportCodeName.Costing ||
            this.reportCode == this.reportCodeName.StockOpnameDetail
            ? ""
            : this.filterElement.form.itemGroupInventory,
          this.reportCode == this.reportCodeName.Costing ||
            this.reportCode == this.reportCodeName.StockOpnameDetail
            ? ""
            : this.filterElement.form.itemType,
          this.reportCode == this.reportCodeName.Costing ||
            this.reportCode == this.reportCodeName.StoreStockCard ||
            this.reportCode == this.reportCodeName.LowLevelAllStoreStock ||
            this.reportCode == this.reportCodeName.HighLevelAllStoreStock ||
            this.reportCode == this.reportCodeName.HighLevelStoreStock ||
            this.reportCode == this.reportCodeName.LowLevelStoreStock ||
            this.reportCode == this.reportCodeName.AllStoreStockCard
            ? ""
            : this.filterElement.form.invAccount,
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.StoreStock ||
        this.reportCode == this.reportCodeName.StoreStockCard ||
        this.reportCode == this.reportCodeName.LowLevelStoreStock ||
        this.reportCode == this.reportCodeName.HighLevelStoreStock
      ) {
        if (
          this.filterElement.form.store == null ||
          this.filterElement.form.store == ""
        ) {
          getToastError("Insert Store");
        } else {
          this.runReport(
            this.templateId,
            this.reportCode,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            this.reportCode == this.reportCodeName.CostingDetail ||
              this.reportCode == this.reportCodeName.Costing
              ? this.filterElement.form.subDepartment
              : "",
            this.reportCode == this.reportCodeName.StockOpnameDetail ||
              this.reportCode == this.reportCodeName.AllStoreStock ||
              this.reportCode == this.reportCodeName.AllStoreStockCard ||
              this.reportCode == this.reportCodeName.LowLevelAllStoreStock ||
              this.reportCode == this.reportCodeName.HighLevelAllStoreStock
              ? ""
              : this.filterElement.form.store,
            "",
            this.reportCode == this.reportCodeName.Costing ||
              this.reportCode == this.reportCodeName.StockOpnameDetail
              ? ""
              : this.filterElement.form.category,
            this.reportCode == this.reportCodeName.Costing ||
              this.reportCode == this.reportCodeName.StockOpnameDetail
              ? ""
              : this.filterElement.form.item,
            this.reportCode == this.reportCodeName.Costing ||
              this.reportCode == this.reportCodeName.StockOpnameDetail
              ? ""
              : this.filterElement.form.itemGroupInventory,
            this.reportCode == this.reportCodeName.Costing ||
              this.reportCode == this.reportCodeName.StockOpnameDetail
              ? ""
              : this.filterElement.form.itemType,
            this.reportCode == this.reportCodeName.Costing ||
              this.reportCode == this.reportCodeName.StoreStockCard ||
              this.reportCode == this.reportCodeName.LowLevelAllStoreStock ||
              this.reportCode == this.reportCodeName.HighLevelAllStoreStock ||
              this.reportCode == this.reportCodeName.HighLevelStoreStock ||
              this.reportCode == this.reportCodeName.LowLevelStoreStock ||
              this.reportCode == this.reportCodeName.AllStoreStockCard
              ? ""
              : this.filterElement.form.invAccount,
            this.dateRange.type,
            this.dateForm,
            this.dateTo,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          );
        }
      }

      // LOG
      else if (
        this.reportCode == this.reportCodeName.LogUser ||
        this.reportCode == this.reportCodeName.LogShift ||
        this.reportCode == this.reportCodeName.LogMoveRoom ||
        this.reportCode == this.reportCodeName.LogTransferTransaction ||
        this.reportCode == this.reportCodeName.LogSpecialAccess ||
        this.reportCode == this.reportCodeName.KeylockHistory ||
        this.reportCode == this.reportCodeName.LogVoidTransaction ||
        this.reportCode == this.reportCodeName.LogHouseKeeping
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.userId, // text
          this.reportCode == this.reportCodeName.LogUser
            ? this.filterElement.form.action
            : "",
          this.reportCode == this.reportCodeName.KeylockHistory
            ? ""
            : this.filterElement.form.ipAddress,
          this.reportCode == this.reportCodeName.KeylockHistory
            ? ""
            : this.filterElement.form.computerName,
          this.reportCode == this.reportCodeName.LogSpecialAccess
            ? this.filterElement.form.accessType
            : "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }
      // BANQUET
      else if (
        this.reportCode == this.reportCodeName.BanquetBooking ||
        this.reportCode == this.reportCodeName.BanquetBookingDetail
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.company, // text
          this.filterElement.form.type,
          this.filterElement.form.sales,
          this.reportCode == this.reportCodeName.BanquetBookingDetail
            ? this.filterElement.form.status
            : "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (
        this.reportCode == this.reportCodeName.BanquetAdvancedDeposit ||
        this.reportCode == this.reportCodeName.BanquetChargeList
      ) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.userId, // text
          this.filterElement.form.shift,
          this.filterElement.form.subDepartment,
          this.filterElement.form.account,
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          this.reportCode == this.reportCodeName.BanquetChargeList
            ? this.filterElement.form.showAccountPayable
            : "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else if (this.reportCode == this.reportCodeName.BanquetDailySales) {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.filterElement.form.venue, // text
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      } else {
        this.runReport(
          this.templateId,
          this.reportCode,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.dateRange.type,
          this.dateForm,
          this.dateTo,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }
    }
  }
  previewReport2() {
    const routeData = this.$router.resolve({
      name: "Report View",
      params: { report: "Store" },
    });
    window.open(routeData.href, "_blank");
    // window.open("/report-view")
    // this.$router.push({ name: 'Report View', params: { report: "SubDepartment" } })
  }

  onSelectionChanged() {
    const data = this.gridApi.getSelectedRows();
    this.templateId = data[0].id;
  }

  onItemSelected(params: any) {
    // params.item.code
    this.reportCode = params.item.code;
    this.disablePreview = this.reportCode > 1000 ? false : true;

    this.itemSelected.clickCount++;
    this.itemSelected.id = params.item.code;
    if (
      this.itemSelected.id == params.item.code &&
      this.itemSelected.clickCount > 1
    ) {
      this.itemSelected.clickCount = 0;
      if (!this.disablePreview) {
        this.previewReport();
      }
    } else {
      this.checkDisabledFilter();
      this.GetReportTemplateList(this.reportCode);
      //Additional option for filter
      if (this.reportCode == this.reportCodeName.Voucher) {
        (this.filterElement.listDropdown.Status = [
          { code: 0, name: "Loading..." },
        ]),
          (this.filterElement.statusDropdown = "VoucherStatus");
      } else {
        this.filterElement.statusDropdown = "ReservationStatus";
      }
      //For dropdown account CHS and CAS
      console.log(params.item);
      let id = String(params.item.id);

      if (id.slice(0, 1) == "1") {
        if (id == "10058") {
          this.filterElement.accountDropdown = "AccountCharge";
        }
        (this.filterElement.listDropdown.Account = [
          { code: 0, name: "Loading..." },
        ]),
          (this.filterElement.accountDropdown = "Account");
      } else {
        this.filterElement.accountDropdown = "JournalAccount";
      }

      let selectedFilter: any = this.filterElement.form.guestType;
      //for default value guestType
      if (this.reportCode == this.reportCodeName.GroupReservation) {
        this.filterElement.form.guestType = 3;
      } else {
        this.filterElement.form.guestType = selectedFilter;
      }
    }
    setTimeout(() => {
      this.itemSelected.clickCount = 0;
      this.itemSelected.id = "";
    }, 500);
  }

  getReportDefault(rowData: any) {
    for (const i in rowData) {
      if (rowData[i].is_default == 1) {
        this.templateId = rowData[i].id;
      }
    }
  }

  reportListArrange(data: any, mode: any) {
    let arr: any = [];
    let inc: number = 6;
    let arrFinish: any[] = [
      {
        name: "Hotel",
        id: 1,
        type: "folder",
        children: [],
        code: "H",
        system_code: "H",
      },
      {
        name: "Point of Sales",
        id: 2,
        type: "folder",
        children: [],
        code: "P",
        system_code: "P",
      },
      {
        name: "Banquet",
        id: 3,
        type: "folder",
        children: [],
        code: "B",
        system_code: "B",
      },
      {
        name: "Accounting",
        id: 4,
        type: "folder",
        children: [],
        code: "A",
        system_code: "A",
      },
      {
        name: "Inventory",
        id: 5,
        type: "folder",
        children: [],
        code: "I",
        system_code: "I",
      },
    ];
    if (mode == "load") {
      // adding parrent folder as per Module
      data.forEach((element: any) => {
        if (element.parent_id == 0) {
          if (element.system_code != "") {
            if (element.system_code == "H") {
              arrFinish[0].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                system_code: "H",
                children: [],
              });
            }
            if (element.system_code == "P") {
              arrFinish[1].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                system_code: "P",
                children: [],
              });
            }
            if (element.system_code == "B") {
              arrFinish[2].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                system_code: "B",
                children: [],
              });
            }
            if (element.system_code == "A") {
              arrFinish[3].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                system_code: "A",
                children: [],
              });
            }
            if (element.system_code == "I") {
              arrFinish[4].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                system_code: "I",
                children: [],
              });
            }
          } else {
            arrFinish.push({
              name: element.name,
              id: element.id,
              code: element.code,
              type: "folder",
              system_code: "",
              children: [],
            });
          }
        }
      });
      // for(const i in arrFinish){
      //   if (arrFinish[i].system_code != "") {
      //     if (arrFinish[i].children.length <= 0) {
      //       arrFinish.splice(i,1)
      //     }
      //   }
      // }
      //adding for the rest of the report
      for (const key in arrFinish) {
        if (arrFinish[key].code != "") {
          for (const key1 in arrFinish[key].children) {
            data.forEach((element1: any) => {
              if (element1.parent_id == arrFinish[key].children[key1].code) {
                arrFinish[key].children[key1].children.push({
                  name: element1.name,
                  id: element1.id,
                  code: element1.code,
                  system_code: element1.system_code,
                  type: "report",
                });
              }
            });
          }
        }
        data.forEach((element1: any) => {
          if (element1.parent_id == arrFinish[key].code) {
            arrFinish[key].children.push({
              name: element1.name,
              id: element1.id,
              code: element1.code,
              system_code: element1.system_code,
              type: "report",
            });
          }
        });
      }
    } else if (mode == "search") {
      // Adding Top Parrent as per Module
      data.forEach((element: any) => {
        if (element.parent_id == 0) {
          if (element.system_code != "") {
            if (element.system_code == "H") {
              arrFinish[0].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                children: [],
              });
            }
            if (element.system_code == "P") {
              arrFinish[1].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                children: [],
              });
            }
            if (element.system_code == "B") {
              arrFinish[2].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                children: [],
              });
            }
            if (element.system_code == "A") {
              arrFinish[3].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                children: [],
              });
            }
            if (element.system_code == "I") {
              arrFinish[4].children.push({
                name: element.name,
                id: element.id,
                code: element.code,
                type: "folder",
                children: [],
              });
            }
          } else {
            arrFinish.push({
              name: element.name,
              id: element.id,
              code: element.code,
              type: "folder",
              children: [],
            });
          }
        }
      });
      // adding the unmatch folder
      arrFinish.forEach((element1: any, index1: any) => {
        data.forEach((element2: any) => {
          if (element2.parent_id != 0) {
            if (element2.system_code == element1.system_code) {
              let check = arrFinish[index1].children.find(
                (o: any) => o.code == element2.parent_id
              );
              if (check == undefined) {
                let Add = this.itemsRaw.find(
                  (o: any) => o.code == element2.parent_id
                );
                arrFinish[index1].children.push({
                  name: Add.name,
                  id: Add.id,
                  code: Add.code,
                  system_code: Add.system_code,
                  type: "folder",
                  children: [],
                });
              }
            }
          }
        });
      });
      //adding for the rest of the report
      for (const key in arrFinish) {
        if (arrFinish[key].code != "") {
          for (const key1 in arrFinish[key].children) {
            data.forEach((element1: any) => {
              if (element1.parent_id == arrFinish[key].children[key1].code) {
                arrFinish[key].children[key1].children.push({
                  name: element1.name,
                  id: element1.id,
                  code: element1.code,
                  type: "report",
                });
              }
            });
          }
        }
      }
    }
    let modifiedData = [];
    for (const i in arrFinish) {
      if (arrFinish[i].system_code != "") {
        if (arrFinish[i].children.length > 0) {
          modifiedData.push(arrFinish[i]);
        }
      } else {
        modifiedData.push(arrFinish[i]);
      }
    }
    return modifiedData;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async handleShowForm(params: any, mode: any) {
    if (!this.isCanCustomizeReport) return;
    await this.inputFormElement.initialize();
    if (this.reportCode) {
      this.GetReport(this.reportCode, "");
    }
    this.modeData = mode;
    this.showForm = true;
  }

  handleShowCreateDefaultField() {
    this.createDefaultFieldElement.initialize();
    this.createDefaultFieldElement.reportCode = this.reportCode;
    this.GetReportDefaultField();
    this.showCreateDefaultFieldForm = true;
  }

  handleShowCustomizeReport() {
    this.customizeReportElement.initialize();
    this.showCustomizeReport = true;
  }

  async handleShowFormHistory() {
    this.showFormHistory = true;
  }

  copyToClipboard(elementId: any) {
    const range = document.createRange();
    range.selectNode(document.getElementById(elementId));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    getToastSuccess(this.$t("Copied into Clipboard"));
  }

  async previewDRRText(mode: any) {
    const res: any = await this.GetDRRText();
    const formatDate = (inputDate: any) => {
      let dateObj = new Date(inputDate);
      let day = dateObj.getDate();
      let month = dateObj.getMonth() + 1;
      let year = dateObj.getFullYear();
      let formattedDay = ("0" + day).slice(-2);
      let formattedMonth = ("0" + month).slice(-2);
      let formattedYear = year.toString();
      let formattedDate =
        formattedDay + "/" + formattedMonth + "/" + formattedYear;
      return formattedDate;
    };
    let date = formatDate(this.dateRange.date);
    interface Row {
      cells: string[];
    }
    class TableBuilder {
      private rows: Row[] = [];
      private currentRow: Row | null = null;
      addRow(): this {
        const row: Row = { cells: [] };
        this.rows.push(row);
        this.currentRow = row;
        return this;
      }
      addCell(content: string): this {
        if (!this.currentRow) {
          throw new Error(
            "No active row. Please add a row first using addRow()."
          );
        }
        this.currentRow.cells.push(content);
        return this;
      }
      getTableHtml(): string {
        let html = "<table>";
        for (const row of this.rows) {
          html += "<tr>";
          for (const cellContent of row.cells) {
            html += "<td>" + cellContent + "</td>";
          }
          html += "</tr>";
        }
        html += "</table>";
        return html;
      }
    }
    let tittle: any = "DRR Text for: " + date + "<br><br>";
    const table: any = new TableBuilder();
    table
      .addRow()
      .addCell("Room Available")
      .addCell(":")
      .addCell(res.DRR[0].TDYTotalRoom ?? 0);
    table
      .addRow()
      .addCell("Room on Projection")
      .addCell(":")
      .addCell(res.DRR[0].TDYUnderConstruction ?? 0);
    let count: any =
      parseFloat(res.DRR[0].TDYOutOfOrder ?? 0) +
      parseFloat(res.DRR[0].TDYOfficeUse ?? 0);
    table
      .addRow()
      .addCell("Room Out of Order")
      .addCell(":")
      .addCell(count.toString());
    count =
      parseFloat(res.DRR[0].TDYRoomSold ?? 0) +
      parseFloat(res.DRR[0].TDYDayUse ?? 0);
    table
      .addRow()
      .addCell("Room Sold")
      .addCell(":")
      .addCell(count.toString() ?? 0);
    table
      .addRow()
      .addCell("Room House Use")
      .addCell(":")
      .addCell(res.DRR[0].TDYHouseUse ?? 0);
    table
      .addRow()
      .addCell("Room Complimentary")
      .addCell(":")
      .addCell(res.DRR[0].TDYCompliment ?? 0);
    let TotalOccupied: any =
      parseFloat(res.DRR[0].TDYRoomSold ?? 0) +
      parseFloat(res.DRR[0].TDYCompliment ?? 0) +
      parseFloat(res.DRR[0].TDYDayUse ?? 0);
    let RoomSaleable: any =
      parseFloat(res.DRR[0].TDYTotalRoom ?? 0) -
      parseFloat(res.DRR[0].TDYOutOfOrder ?? 0) -
      parseFloat(res.DRR[0].TDYOfficeUse ?? 0) -
      parseFloat(res.DRR[0].TDYUnderConstruction ?? 0) -
      parseFloat(res.DRR[0].TDYHouseUse ?? 0);
    table
      .addRow()
      .addCell("Room Saleable")
      .addCell(":")
      .addCell(RoomSaleable.toString() ?? 0);
    count = parseInt(RoomSaleable) - parseInt(TotalOccupied);
    table
      .addRow()
      .addCell("Total Vacant Room")
      .addCell(":")
      .addCell(count ?? 0);
    table
      .addRow()
      .addCell("Total Walk in")
      .addCell(":")
      .addCell(res.DRR[0].TDYWalkIn ?? 0);
    table
      .addRow()
      .addCell("Total Day Use")
      .addCell(":")
      .addCell(res.DRR[0].TDYDayUse ?? 0);
    count =
      parseInt(res.DRR[0].TDYAdult ?? 0) - parseInt(res.DRR[0].TDYChild ?? 0);
    table
      .addRow()
      .addCell("Total Guest In House")
      .addCell(":")
      .addCell(count ?? 0);
    if (RoomSaleable != 0) {
      let count: any =
        ((parseInt(res.DRR[0].TDYRoomSold ?? 0) +
          parseInt(res.DRR[0].TDYDayUse ?? 0) +
          parseInt(res.DRR[0].TDYCompliment ?? 0)) /
          RoomSaleable) *
        100;
      count = formatCurrency(count, 2);
      table
        .addRow()
        .addCell("Occupancy")
        .addCell(":")
        .addCell(count.toString() + "%");
    } else {
      table.addRow().addCell("Occupancy").addCell(":").addCell("0%");
    }
    if (res.DRR[0].TDYTotalRoom ?? 0 != 0) {
      let count: any =
        ((parseInt(res.DRR[0].TDYRoomSold ?? 0) +
          parseInt(res.DRR[0].TDYDayUse ?? 0) +
          parseInt(res.DRR[0].TDYCompliment ?? 0)) /
          parseInt(res.DRR[0].TDYTotalRoom ?? 0)) *
        100;
      count = formatCurrency(count, 2);
      table
        .addRow()
        .addCell("Occupancy R.A")
        .addCell(":")
        .addCell(count.toString() + "%");
    } else {
      table.addRow().addCell("Occupancy R.A").addCell(":").addCell("0%");
    }
    if (res.DRR[0].TDYRoomSold ?? 0 != 0) {
      let count: any =
        parseFloat(res.DRR[0].TDYRevenueNett ?? 0) /
        (parseFloat(res.DRR[0].TDYRoomSold ?? 0) +
          parseFloat(res.DRR[0].TDYDayUse ?? 0) +
          parseFloat(res.DRR[0].TDYCompliment ?? 0));
      table
        .addRow()
        .addCell("Average Room Rate")
        .addCell(":")
        .addCell(count.toLocaleString("en", { minimumFractionDigits: 2 }));
    } else {
      table.addRow().addCell("Average Room Rate").addCell(":").addCell("0");
    }
    let tableGross: any = parseFloat(res.DailySales[1].TDYRevenueGross ?? 0);
    table
      .addRow()
      .addCell("Total Room Revenue(Gross)")
      .addCell(":")
      .addCell(tableGross.toLocaleString("en", { minimumFractionDigits: 2 }));
    let tableNet: any = parseFloat(res.DailySales[1].TDYRevenueNett ?? 0);
    table
      .addRow()
      .addCell("Total Room Revenue(Net)")
      .addCell(":")
      .addCell(tableNet.toLocaleString("en", { minimumFractionDigits: 2 }));
    table.addRow().addCell("------");
    table.addRow().addCell("Month to Date").addCell("").addCell(date);
    ////// MTD
    table
      .addRow()
      .addCell("Room Available")
      .addCell(":")
      .addCell(res.DRR[0].MTDTotalRoom ?? 0);
    table
      .addRow()
      .addCell("Room on Projection")
      .addCell(":")
      .addCell(res.DRR[0].MTDUnderConstruction ?? 0);
    let count1: any =
      parseFloat(res.DRR[0].MTDOutOfOrder ?? 0) +
      parseFloat(res.DRR[0].MTDOfficeUse ?? 0);
    table
      .addRow()
      .addCell("Room Out of Order")
      .addCell(":")
      .addCell(count1.toString());
    count1 =
      parseFloat(res.DRR[0].MTDRoomSold ?? 0) +
      parseFloat(res.DRR[0].MTDDayUse ?? 0);
    table
      .addRow()
      .addCell("Room Sold")
      .addCell(":")
      .addCell(count1.toString() ?? 0);
    table
      .addRow()
      .addCell("Room House Use")
      .addCell(":")
      .addCell(res.DRR[0].MTDHouseUse ?? 0);
    table
      .addRow()
      .addCell("Room Complimentary")
      .addCell(":")
      .addCell(res.DRR[0].MTDCompliment ?? 0);
    let TotalOccupied1: any =
      parseFloat(res.DRR[0].MTDRoomSold ?? 0) +
      parseFloat(res.DRR[0].MTDCompliment ?? 0) +
      parseFloat(res.DRR[0].MTDDayUse ?? 0);
    let RoomSaleable1: any =
      parseFloat(res.DRR[0].MTDTotalRoom ?? 0) -
      parseFloat(res.DRR[0].MTDOutOfOrder ?? 0) -
      parseFloat(res.DRR[0].MTDOfficeUse ?? 0) -
      parseFloat(res.DRR[0].MTDUnderConstruction ?? 0) -
      parseFloat(res.DRR[0].MTDHouseUse ?? 0);
    table
      .addRow()
      .addCell("Room Saleable")
      .addCell(":")
      .addCell(RoomSaleable1.toString() ?? 0);
    count1 = parseInt(RoomSaleable1) - parseInt(TotalOccupied1);
    table
      .addRow()
      .addCell("Total Vacant Room")
      .addCell(":")
      .addCell(count1 ?? 0);
    table
      .addRow()
      .addCell("Total Walk in")
      .addCell(":")
      .addCell(res.DRR[0].MTDWalkIn ?? 0);
    table
      .addRow()
      .addCell("Total Day Use")
      .addCell(":")
      .addCell(res.DRR[0].MTDDayUse ?? 0);
    count1 =
      parseInt(res.DRR[0].MTDAdult ?? 0) - parseInt(res.DRR[0].MTDChild ?? 0);
    table
      .addRow()
      .addCell("Total Guest In House")
      .addCell(":")
      .addCell(count1 ?? 0);
    if (RoomSaleable1 != 0) {
      let count1: any =
        ((parseInt(res.DRR[0].MTDRoomSold ?? 0) +
          parseInt(res.DRR[0].MTDDayUse ?? 0) +
          parseInt(res.DRR[0].MTDCompliment ?? 0)) /
          RoomSaleable1) *
        100;
      count1 = formatCurrency(count, 2);
      table
        .addRow()
        .addCell("Occupancy")
        .addCell(":")
        .addCell(count1.toString() + "%");
    } else {
      table.addRow().addCell("Occupancy").addCell(":").addCell("0%");
    }
    if (res.DRR[0].MTDTotalRoom ?? 0 != 0) {
      let count1: any =
        ((parseInt(res.DRR[0].MTDRoomSold ?? 0) +
          parseInt(res.DRR[0].MTDDayUse ?? 0) +
          parseInt(res.DRR[0].MTDCompliment ?? 0)) /
          parseInt(res.DRR[0].MTDTotalRoom ?? 0)) *
        100;
      count1 = formatCurrency(count, 2);
      table
        .addRow()
        .addCell("Occupancy R.A")
        .addCell(":")
        .addCell(count1.toString() + "%");
    } else {
      table.addRow().addCell("Occupancy R.A").addCell(":").addCell("0%");
    }
    if (res.DRR[0].MTDRoomSold ?? 0 != 0) {
      let count1: any =
        parseFloat(res.DRR[0].MTDRevenueNett ?? 0) /
        (parseFloat(res.DRR[0].MTDRoomSold ?? 0) +
          parseFloat(res.DRR[0].MTDDayUse ?? 0) +
          parseFloat(res.DRR[0].MTDCompliment ?? 0));
      table
        .addRow()
        .addCell("Average Room Rate")
        .addCell(":")
        .addCell(count1.toLocaleString("en", { minimumFractionDigits: 2 }));
    } else {
      table.addRow().addCell("Average Room Rate").addCell(":").addCell("0");
    }
    let tableGross1: any = parseFloat(res.DailySales[1].MTDRevenueGross ?? 0);
    table
      .addRow()
      .addCell("Total Room Revenue(Gross)")
      .addCell(":")
      .addCell(tableGross1.toLocaleString("en", { minimumFractionDigits: 2 }));
    let tableNet1: any = parseFloat(res.DailySales[1].MTDRevenueNett ?? 0);
    table
      .addRow()
      .addCell("Total Room Revenue(Net)")
      .addCell(":")
      .addCell(tableNet1.toLocaleString("en", { minimumFractionDigits: 2 }));
    const tableHtml = table.getTableHtml();
    this.DRRResult = tittle + tableHtml;
    if (mode == 1) {
      this.showDRR = true;
    }
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        StatusIndex: parseInt(search.filter[0]),
      };
      const { data } = await ReportAPI.GetLinenManagementList(params);
      this.rowData = data;
    } catch (error) {}
  }
  async insertData(formData: any) {
    try {
      const { status2 } = await ReportAPI.InsertReport(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.inputFormElement.isSaving = false;
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      getError(error);
      this.inputFormElement.isSaving = false;
    }
  }
  async insertDataCustomReport(formData: any) {
    try {
      const { status2 } = await ReportAPI.InsertReportCustom(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showCustomizeReport = false;
        this.customizeReportElement.isSaving = false;
        this.GetReportList();
      }
    } catch (error) {
      getError(error);
    }
  }
  async GetReport(reportCode: any, templateId: any) {
    try {
      let parameters: any = {
        ReportCode: reportCode,
        TemplateId: templateId ?? "",
      };
      const { data } = await ReportAPI.GetReport(parameters);
      if (
        this.modeData == $global.modeData.edit ||
        this.modeData == $global.modeData.duplicate
      ) {
        this.inputFormElement.onEdit(data);
      } else {
        this.inputFormElement.onInsert(data);
      }
      this.reportId = data.ReportTemplate.id;

      this.showForm = true;
    } catch (error) {
      // getError(error);
    }
  }
  async GetReportDefaultField() {
    try {
      const { data } = await ReportAPI.GetReportDefaultField(this.reportCode);
      this.createDefaultFieldElement.form.query = data.QueryString;
      this.createDefaultFieldElement.rowData = data.DefaultField;
    } catch (error) {
      // getError(error);
    }
  }
  async updateData(formData: any) {
    formData.id = this.reportId;
    try {
      const { status2 } = await ReportAPI.UpdateReport(formData);
      if (status2.status == 0) {
        this.showForm = false;
        this.inputFormElement.isSaving = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      this.inputFormElement.isSaving = false;
      getError(error);
    }
  }
  async updateDefaultReport(templateId: any, reportCode: any) {
    try {
      let params: any = {
        ReportCode: reportCode,
        TemplateId: templateId,
      };
      const { status2 } = await ReportAPI.UpdateDefaultReport(params);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      getError(error);
    }
  }
  async GetReportList() {
    try {
      const { data } = await ReportAPI.GetReportList();
      let mergedArray: any = [...data.Report, ...data.ReportCustom];
      let arr: any = this.reportListArrange(mergedArray, "load");
      this.items = arr;
      this.itemsAll = arr;
      this.itemsRaw = mergedArray;
      this.expandedIds = ["1"];
    } catch (error) {
      getError(error);
    }
  }
  async deleteData() {
    this.isSaving = true;
    try {
      const { status2 } = await ReportAPI.DeleteReport(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid("");
        this.showDialog = false;
        this.isSaving = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      this.isSaving = false;
      getError(error);
    }
  }
  async GetReportTemplateList(params: any) {
    try {
      const { data } = await ReportAPI.GetReportTemplateList(params);
      this.rowData = data;
      //Check if report static or not
      if (this.rowData == null) {
        this.templateId = 0;
      } else {
        this.getReportDefault(this.rowData);
      }
    } catch (error) {
      getError(error);
    }
  }

  async GetDRRText() {
    try {
      let params: any = {
        Date: formatDateDatabase(this.dateRange.date),
      };
      const { data } = await ReportAPI.GetDRRText(params);
      return data;
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  async mounted() {
    await this.getUser();
    this.GetDRRText();
    // this.loadDataGrid(this.searchDefault)
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.GetReportList();
    setTimeout(() => {
      this.handleResetDateRange();
    }, 1500);
    this.canCustomizeReport();
    await this.canEditReport();
    this.gridOptions.actionGrid.edit = this.isCanEditReport;
    this.gridOptions.actionGrid.delete = this.isCanEditReport;
    this.gridOptions.actionGrid.duplicate = this.isCanEditReport;
  }

  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.barcode"), value: 1 },
      { text: this.$t("commons.filter.item"), value: 2 },
      { text: this.$t("commons.filter.detailName"), value: 3 },
      { text: this.$t("commons.filter.location"), value: 4 },
      { text: this.$t("commons.filter.receiveNumber"), value: 5 },
      { text: this.$t("commons.filter.depreciationType"), value: 6 },
      { text: this.$t("commons.filter.receiveId"), value: 7 },
      { text: this.$t("commons.filter.sortNumber"), value: 8 },
      { text: this.$t("commons.filter.serialNumber"), value: 9 },
      { text: this.$t("commons.filter.manufacture"), value: 10 },
      { text: this.$t("commons.filter.trademark"), value: 11 },
      { text: this.$t("commons.filter.refNumber"), value: 12 },
      { text: this.$t("commons.filter.remark"), value: 13 },
      { text: this.$t("commons.filter.createdBy"), value: 14 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      actionGrid: {
        edit: true,
        delete: true,
        duplicate: true,
      },
      onRowDoubleClicked: () => {
        this.previewReport();
      },
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
        width: 80,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "name",
        minWidth: 200,
        flex: 1,
        cellStyle: function (params: any) {
          if (params.data.is_default == 1) {
            if (params.data.is_system == 1) {
              return { color: "red", fontWeight: "bold" };
            } else {
              return { fontWeight: "bold" };
            }
          } else if (params.data.is_system == 1) {
            if (params.data.is_default == 1) {
              return { color: "red", fontWeight: "bold" };
            } else {
              return { color: "red" };
            }
          }
        },
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "report_code",
        width: 140,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "is_default",
        width: 140,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "is_system",
        width: 140,
        hide: true,
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
    };
    this.rowGroupPanelShow = "never";
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
    this.rowSelection = "multiple";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get disabledActionGrid() {
    return this.showForm;
  }

  // get auditDate() {
  //   return this.config.auditDate;
  // }

  async canCustomizeReport() {
    this.isCanCustomizeReport = getUserAccessUtility(
      this.userAccessPreviewReport,
      $global.reportAccessOrder.accessPreviewReport.customizeReport,
      this.userId
    );
  }

  async canEditReport() {
    this.isCanEditReport = getUserAccessUtility(
      this.userAccessPreviewReport,
      $global.reportAccessOrder.accessPreviewReport.editReport,
      this.userId
    );
  }

  get userAccessPreviewReport() {
    return this.auth.reportAccessUtility.previewReport ?? "";
  }

  async getUser() {
    this.user = await this.auth.user;

    if (!this.user) return this.auth.logout();
  }

  get userId() {
    return this.user.ID;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
