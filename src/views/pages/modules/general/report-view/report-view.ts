import { Options, Vue } from "vue-class-component";
import { Stimulsoft } from "stimulsoft-reports-js/Scripts/stimulsoft.blockly.editor";
// import "stimulsoft-reports-js/Css/stimulsoft.designer.office2013.whiteblue.css";
import "stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css";
import reportAPI from "@/services/api/report/report-module";
import {
  formatDate,
  formatDate2,
  formatDate3,
  formatDateTime,
  formatDateDatabase,
  formatDateTimeUTC,
  formatFullDate,
  formatNumber,
} from "@/utils/format";
import { string } from "yup";
import { h } from "vue";
import configStore from "@/stores/config";
import { parse } from "uuid";
import { anyToFloat } from "@/utils/general";
const ReportAPI = new reportAPI();

@Options({
  name: "stimulsoft",
  components: {
    Stimulsoft,
  },
  props: {},
  emits: ["params"],
})
export default class ReportView extends Vue {
  public datas: any;
  public reportName: any;
  public dataColumn: any = [];
  public groupFooter: any = [];
  public sortedHeader: any = [];
  public headerFix: any = [];
  public dataColor: any;
  config: any = configStore();
  public headerColor: any;
  public sumTotal: any = 0;
  public showDialog: boolean = false;
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
  async GetSubDepartment() {
    try {
      const { data } = await ReportAPI.GetSubDepartment();
      this.datas = data;
    } catch (error) {}
  }
  async GetStore() {
    try {
      const { data } = await ReportAPI.GetStore();
      this.datas = data;
    } catch (error) {}
  }

  get logoWidth() {
    return this.config.logoWidth;
  }

  get checkOutLimit() {
    return this.config.checkOutLimit;
  }

  cleanDateString(dateString: string) {
    // Replace all "/" characters with "-"
    return dateString.replace(/\//g, "-");
  }

  async GetReportQuery(templateId: any) {
    try {
      let parameters: any = {
        TemplateId: templateId,
        ReportCode: this.$route.query.reportCode,
        FilterDateIndex: this.$route.query.filterDateIndex ?? "",
        FilterDateText1: this.$route.query.filterDateText1 ?? "",
        FilterDateText2: this.$route.query.filterDateText2 ?? "",
        FilterIndex1: this.$route.query.filter_index1 ?? 0,
        FilterIndex2: this.$route.query.filter_index2 ?? 0,
        FilterIndex3: this.$route.query.filter_index3 ?? 0,
        FilterIndex4: this.$route.query.filter_index4 ?? 0,
        FilterIndex5: this.$route.query.filter_index5 ?? 0,
        FilterIndex6: this.$route.query.filter_index6 ?? 0,
        FilterIndex7: this.$route.query.filter_index7 ?? 0,
        FilterIndex8: this.$route.query.filter_index8 ?? 0,
        FilterText1: this.$route.query.filter_text1 ?? "",
        FilterText2: this.$route.query.filter_text2 ?? "",
        FilterText3: this.$route.query.filter_text3 ?? "",
        FilterText4: this.$route.query.filter_text4 ?? "",
        FilterText5: this.$route.query.filter_text5 ?? "",
        FilterText6: this.$route.query.filter_text6 ?? "",
        FilterText7: this.$route.query.filter_text7 ?? "",
        FilterText8: this.$route.query.filter_text8 ?? "",
        FilterBool1: this.$route.query.filter_bool1 ?? 0,
        FilterBool2: this.$route.query.filter_bool2 ?? 0,
        FilterBool3: this.$route.query.filter_bool3 ?? 0,
        FilterBool4: this.$route.query.filter_bool4 ?? 0,
        FilterBool5: this.$route.query.filter_bool5 ?? 0,
        FilterBool6: this.$route.query.filter_bool6 ?? 0,
        FilterBool7: this.$route.query.filter_bool7 ?? 0,
        FilterBool8: this.$route.query.filter_bool8 ?? 0,
      };

      const { data } = await ReportAPI.GetReportQuery(parameters);
      this.datas = data;
    } catch (error) {}
  }

  async GetReportStaticQuery(templateId: any) {
    try {
      let parameters: any = {
        TemplateId: templateId,
        ReportCode: this.$route.query.reportCode,
        FilterDateIndex: this.$route.query.filterDateIndex ?? "",
        FilterDateText1: this.$route.query.filterDateText1 ?? "",
        FilterDateText2: this.$route.query.filterDateText2 ?? "",
        FilterIndex1: this.$route.query.filter_index1 ?? 0,
        FilterIndex2: this.$route.query.filter_index2 ?? 0,
        FilterIndex3: this.$route.query.filter_index3 ?? 0,
        FilterIndex4: this.$route.query.filter_index4 ?? 0,
        FilterIndex5: this.$route.query.filter_index5 ?? 0,
        FilterIndex6: this.$route.query.filter_index6 ?? 0,
        FilterIndex7: this.$route.query.filter_index7 ?? 0,
        FilterIndex8: this.$route.query.filter_index8 ?? 0,
        FilterText1: this.$route.query.filter_text1 ?? "",
        FilterText2: this.$route.query.filter_text2 ?? "",
        FilterText3: this.$route.query.filter_text3 ?? "",
        FilterText4: this.$route.query.filter_text4 ?? "",
        FilterText5: this.$route.query.filter_text5 ?? "",
        FilterText6: this.$route.query.filter_text6 ?? "",
        FilterText7: this.$route.query.filter_text7 ?? "",
        FilterText8: this.$route.query.filter_text8 ?? "",
        FilterBool1: this.$route.query.filter_bool1 ?? 0,
        FilterBool2: this.$route.query.filter_bool2 ?? 0,
        FilterBool3: this.$route.query.filter_bool3 ?? 0,
        FilterBool4: this.$route.query.filter_bool4 ?? 0,
        FilterBool5: this.$route.query.filter_bool5 ?? 0,
        FilterBool6: this.$route.query.filter_bool6 ?? 0,
        FilterBool7: this.$route.query.filter_bool7 ?? 0,
        FilterBool8: this.$route.query.filter_bool8 ?? 0,
      };

      const { data } = await ReportAPI.GetReportStaticQuery(parameters);
      this.datas = data;
    } catch (error) {}
  }

  async getTemplateStaticFromConfig(report: any, defaultReport: string) {
    //Get report template from config
    // console.log(defaultReport)
    if (this.datas.report_info) {
      if (this.datas.report_info.report_template != "") {
        let module: any = this.datas.report_info.modul;
        let template: string = this.datas.report_info.report_template;
        if (template != "") {
          this.reportName = template;
          if (template.includes("https")) {
            await report.loadFile(template);
          } else {
            if (module == "") {
              await report.loadFile("/report/reports/" + template);
              return;
            } else {
              await report.loadFile(
                "/report/reports/" + module + "/" + template
              );
              return;
            }
          }
        } else {
          if (
            defaultReport != "" &&
            defaultReport != null &&
            defaultReport != undefined
          ) {
            await report.loadFile();
            return;
          }
        }
      } else {
        if (
          defaultReport != "" &&
          defaultReport != null &&
          defaultReport != undefined
        ) {
          await report.loadFile(defaultReport);
          return;
        }
      }
    } else {
      if (
        defaultReport != "" &&
        defaultReport != null &&
        defaultReport != undefined
      ) {
        await report.loadFile(defaultReport);
        return;
      }
    }
    alert("Report template not found");
    window.close();
  }

  getGroupFooter() {
    for (const i in this.datas.report_grouping) {
      let data = this.datas.report_grouping[i].FieldName;

      // Replace spaces, slashes, and greater-than signs with underscores
      if (data.includes(" ") || data.includes("/") || data.includes(">")) {
        data = data.replace(/\/+|\s+|>+/g, "_");
      }

      // If the data contains a dash, prepend 'n' and replace dashes with underscores
      if (data.includes("-")) {
        data = "n" + data.replace(/-+/g, "_");
      }

      // Push the modified data to the groupFooter array
      this.groupFooter.push(data);
    }
  }

  areAllValuesNull(obj: Record<string, any>): boolean {
    for (const key in obj) {
      if (obj[key] !== null) {
        return false;
      }
    }
    return true;
  }

  handleCloseDownloadConfirmation() {
    console.log("close");
    self.close();
  }

  async beforeMount() {
    await this.config.getConfigurations();
    const loader = this.$loading.show();
    if (this.$route.query.report == "0") {
      await this.GetReportStaticQuery(this.$route.query.report);
      if (this.datas.download) {
        await window.location.replace(this.datas.download);
        this.showDialog = true;
        loader.hide();
        return;
      }
      Stimulsoft.Base.StiLicense.key =
        "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHnPa5/5XoYd+qNFMUW374+2A15lkDEmsFbZidCcj4z6A0fW29" +
        "qY4qqFX38PjvyDKBhrkx+ul3oYnrgqg3XSk0mOzjR42PEALIa9fqUQ4iscOiXXv93u8TJrXsp5mYVhWJ/Umix2Bqwb" +
        "IhXflLD+hq7eMu0FY4xv2+l2cbnW4+2t6azb660R/N3uDD3NV0sOoOSUaBzEyWGX79ppoHXUYPHdga0wZ+egnmkR7Q" +
        "Jg/fZjmLC8IJQSU+HTZUaXuRlg4ny9HOfuy6AZa0pJbHtWl2sowps0cOqDX533NJCrw90zrF9q6ymMP1f96ZoI6RsY" +
        "WlS78TC9RsoO5M1wEDq+JW/k13F5jLIYMwZQlB/oPwb8PazJx8/Flek8RapGoBOgO8loyZtdRP4SA8qavbCjK7ZML5" +
        "b6OXG/trsgeZb0ikZ7W4hX9wldd6AzVxMkjkIrx+HjdVFYbL5R4M1yRicKpDMBVW1HmWLKbBcJORVu2pgbfRTfbQMb" +
        "vwE995r1kuazqHJdj1zNkqNs2h5FhkJpAKif";

      var report = new Stimulsoft.Report.StiReport();
      //Market Statistic
      if (this.$route.query.reportCode == this.reportCodeName.MarketStatistic) {
        if (this.datas.MarketStatistic.length < 1) {
          alert("No data Found");
          window.close();
        } else {
          if (this.$route.query.filter_index1 == "1") {
            report.loadFile("/report/reports/CHS/MarketStatistic.mrt");
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "2") {
            report.loadFile("/report/reports/CHS/MarketStatisticDetail.mrt");
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "3") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCategory.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "4") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCategoryDetail.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "5") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByBusinessSource.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "6") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByBusinessSourceDetail.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "7") {
            report.loadFile("/report/reports/CHS/MarketStatisticByCompany.mrt");
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "8") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCompanyDetail.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "9") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByRoomType.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "10") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByRoomTypeDetail.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "11") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByRoomRate.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "12") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByRoomRateDetail.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "13") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByMarketing.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "14") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByMarketingDetail.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "15") {
            report.loadFile("/report/reports/CHS/MarketStatisticByCountry.mrt");
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "16") {
            report.loadFile("/report/reports/CHS/MarketStatisticByState.mrt");
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "17") {
            report.loadFile("/report/reports/CHS/MarketStatisticByCity.mrt");
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "18") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByNationality.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "19") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCountryState.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "20") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCountryCity.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "21") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCountryStateCity.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "22") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByCountryNationality.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "23") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByBookingSource.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          } else if (this.$route.query.filter_index1 == "24") {
            report.loadFile(
              "/report/reports/CHS/MarketStatisticByPurposeOf.mrt"
            );
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          }
        }
      }
      //Room Statistic
      else if (
        this.$route.query.reportCode == this.reportCodeName.RoomStatistic
      ) {
        const reportDefault = "/report/reports/CHS/RoomStatistic01.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Guest Forecast
      else if (
        this.$route.query.reportCode == this.reportCodeName.GuestForecastReport
      ) {
        const reportDefault = "/report/reports/CHS/GuestForecastReport04.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Guest Forecast Comparison
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.GuestForecastComparison
      ) {
        const reportDefault = "/report/reports/CHS/GuestForecastComparison.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
      }
      //Guest Forecast Yearly
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.GuestForecastReportYearly
      ) {
        const reportDefault = "/report/reports/CHS/GuestForecastRoomYearly.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        // report.load(reportDefault)
        // Global
        var RoomsBefore: number = parseInt(
          this.datas.MonthlyGuestForecastPrevious[0].rooms
        );
        var PaxBefore: number =
          parseInt(this.datas.MonthlyGuestForecastPrevious[0].adult) +
          parseInt(this.datas.MonthlyGuestForecastPrevious[0].child);
        let RAJanuary: number = 0;
        let RAFebruary: number = 0;
        let RAMarch: number = 0;
        let RAApril: number = 0;
        let RAMay: number = 0;
        let RAJuni: number = 0;
        let RAJuly: number = 0;
        let RAAugust: number = 0;
        let RASeptember: number = 0;
        let RAOctober: number = 0;
        let RANovember: number = 0;
        let RADecember: number = 0;
        let TotalRoomsJanuary: number = 0,
          TotalRoomsFebruary: number = 0,
          TotalRoomsMarch: number = 0,
          TotalRoomsApril: number = 0,
          TotalRoomsMay: number = 0,
          TotalRoomsJuni: number = 0,
          TotalRoomsJuly: number = 0,
          TotalRoomsAugust: number = 0,
          TotalRoomsSeptember: number = 0,
          TotalRoomsOctober: number = 0,
          TotalRoomsNovember: number = 0,
          TotalRoomsDecember: number = 0;
        let TotalPaxJanuary: number = 0,
          TotalPaxFebruary: number = 0,
          TotalPaxMarch: number = 0,
          TotalPaxApril: number = 0,
          TotalPaxMay: number = 0,
          TotalPaxJuni: number = 0,
          TotalPaxJuly: number = 0,
          TotalPaxAugust: number = 0,
          TotalPaxSeptember: number = 0,
          TotalPaxOctober: number = 0,
          TotalPaxNovember: number = 0,
          TotalPaxDecember: number = 0;
        let TotalRevenueJanuary: number = 0,
          TotalRevenueFebruary: number = 0,
          TotalRevenueMarch: number = 0,
          TotalRevenueApril: number = 0,
          TotalRevenueMay: number = 0,
          TotalRevenueJuni: number = 0,
          TotalRevenueJuly: number = 0,
          TotalRevenueAugust: number = 0,
          TotalRevenueSeptember: number = 0,
          TotalRevenueOctober: number = 0,
          TotalRevenueNovember: number = 0,
          TotalRevenueDecember: number = 0;
        //Loop
        for (const forecast of this.datas.MonthlyGuestForecast) {
          // Splitter
          const dateParts = forecast.AuditDate.split("T");
          const dateComponents = dateParts[0].split("-");
          const month = dateComponents[1];
          const day = dateComponents[2];
          // Variable Assignment
          let XTemp: number =
            RoomsBefore +
            (parseInt(forecast.ArrivalRoomResv) +
              parseInt(forecast.ArrivalRoomWalkIn) -
              (parseInt(forecast.DepartureRoomResv) +
                parseInt(forecast.DepartureRoomWalkIn))) +
            parseInt(forecast.DayUseRoom);
          report.dictionary.variables.getByName("X" + month + day).valueObject =
            XTemp;
          report.dictionary.variables.getByName("R" + month + day).valueObject =
            parseFloat(forecast.revenue);
          RoomsBefore = XTemp - parseInt(forecast.DayUseRoom);
          let YTemp: number =
            PaxBefore +
            (parseInt(forecast.ArrivalRoomResv) +
              parseInt(forecast.ArrivalRoomWalkIn) -
              (parseInt(forecast.DepartureRoomResv) +
                parseInt(forecast.DepartureRoomWalkIn)) +
              parseInt(forecast.DayUseAdult)) +
            (parseInt(forecast.DayUseChild) +
              parseInt(forecast.ArrivalChildWalkIn) -
              (parseInt(forecast.DepartureChild) +
                parseInt(forecast.DepartureChildWalkIn)) +
              parseInt(forecast.DayUseChild));
          report.dictionary.variables.getByName("Y" + month + day).valueObject =
            YTemp;
          PaxBefore =
            YTemp -
            (parseInt(forecast.DayUseAdult) + parseInt(forecast.DayUseChild));
          if (month === "01") {
            RAJanuary += parseInt(forecast.RoomAvailaible);
            console.log(TotalRoomsJanuary, "january");
            console.log(XTemp, "xtemp");

            TotalRoomsJanuary = TotalRoomsJanuary + XTemp;
            TotalPaxJanuary = TotalPaxJanuary + YTemp;
            TotalRevenueJanuary += parseFloat(forecast.revenue);
          } else if (month === "02") {
            RAFebruary += parseInt(forecast.RoomAvailaible);
            TotalRoomsFebruary = TotalRoomsFebruary + XTemp;
            TotalPaxFebruary = TotalPaxFebruary + YTemp;
            TotalRevenueFebruary += parseFloat(forecast.revenue);
          } else if (month === "03") {
            RAMarch += parseInt(forecast.RoomAvailaible);
            TotalRoomsMarch = TotalRoomsMarch + XTemp;
            TotalPaxMarch = TotalPaxMarch + YTemp;
            TotalRevenueMarch += parseFloat(forecast.revenue);
          } else if (month === "04") {
            RAApril += parseInt(forecast.RoomAvailaible);
            TotalRoomsApril = TotalRoomsApril + XTemp;
            TotalPaxApril = TotalPaxApril + YTemp;
            TotalRevenueApril += parseFloat(forecast.revenue);
          } else if (month === "05") {
            RAMay += parseInt(forecast.RoomAvailaible);
            TotalRoomsMay = TotalRoomsMay + XTemp;
            TotalPaxMay = TotalPaxMay + YTemp;
            TotalRevenueMay += parseFloat(forecast.revenue);
          } else if (month === "06") {
            RAJuni += parseInt(forecast.RoomAvailaible);
            TotalRoomsJuni = TotalRoomsJuni + XTemp;
            TotalPaxJuni = TotalPaxJuni + YTemp;
            TotalRevenueJuni += parseFloat(forecast.revenue);
          } else if (month === "07") {
            RAJuly += parseInt(forecast.RoomAvailaible);
            TotalRoomsJuly = TotalRoomsJuly + XTemp;
            TotalPaxJuly = TotalPaxJuly + YTemp;
            TotalRevenueJuly += parseFloat(forecast.revenue);
          } else if (month === "08") {
            RAAugust += parseInt(forecast.RoomAvailaible);
            TotalRoomsAugust = TotalRoomsAugust + XTemp;
            TotalPaxAugust = TotalPaxAugust + YTemp;
            TotalRevenueAugust += parseFloat(forecast.revenue);
          } else if (month === "09") {
            RASeptember += parseInt(forecast.RoomAvailaible);
            TotalRoomsSeptember = TotalRoomsSeptember + XTemp;
            TotalPaxSeptember = TotalPaxSeptember + YTemp;
            TotalRevenueSeptember += parseFloat(forecast.revenue);
          } else if (month === "10") {
            RAOctober += parseInt(forecast.RoomAvailaible);
            TotalRoomsOctober = TotalRoomsOctober + XTemp;
            TotalPaxOctober = TotalPaxOctober + YTemp;
            TotalRevenueOctober += parseFloat(forecast.revenue);
          } else if (month === "11") {
            RANovember += parseInt(forecast.RoomAvailaible);
            TotalRoomsNovember = TotalRoomsNovember + XTemp;
            TotalPaxNovember = TotalPaxNovember + YTemp;
            TotalRevenueNovember += parseFloat(forecast.revenue);
          } else if (month === "12") {
            RADecember += parseInt(forecast.RoomAvailaible);
            TotalRoomsDecember = TotalRoomsDecember + XTemp;
            TotalPaxDecember = TotalPaxDecember + YTemp;
            TotalRevenueDecember += parseFloat(forecast.revenue);
          }
        }

        const updateReportVariables = function (
          monthName: string,
          RAValue: number,
          TotalRoomsValue: number,
          TotalPaxValue: number,
          TotalRevenueValue: number
        ) {
          console.log(TotalRoomsFebruary);
          report.dictionary.variables.getByName("RA" + monthName).valueObject =
            RAValue;
          report.dictionary.variables.getByName(
            "TotalRooms" + monthName
          ).valueObject = TotalRoomsValue;
          report.dictionary.variables.getByName(
            "TotalPax" + monthName
          ).valueObject = TotalPaxValue;
          report.dictionary.variables.getByName(
            "TotalRevenue" + monthName
          ).valueObject = TotalRevenueValue;
        };

        console.log(TotalRoomsJanuary);
        console.log(RAJanuary);

        updateReportVariables(
          "January",
          RAJanuary,
          TotalRoomsJanuary,
          TotalPaxJanuary,
          TotalRevenueJanuary
        );
        updateReportVariables(
          "February",
          RAFebruary,
          TotalRoomsFebruary,
          TotalPaxFebruary,
          TotalRevenueFebruary
        );
        updateReportVariables(
          "March",
          RAMarch,
          TotalRoomsMarch,
          TotalPaxMarch,
          TotalRevenueMarch
        );
        updateReportVariables(
          "April",
          RAApril,
          TotalRoomsApril,
          TotalPaxApril,
          TotalRevenueApril
        );
        updateReportVariables(
          "May",
          RAMay,
          TotalRoomsMay,
          TotalPaxMay,
          TotalRevenueMay
        );
        updateReportVariables(
          "Juni",
          RAJuni,
          TotalRoomsJuni,
          TotalPaxJuni,
          TotalRevenueJuni
        );
        updateReportVariables(
          "July",
          RAJuly,
          TotalRoomsJuly,
          TotalPaxJuly,
          TotalRevenueJuly
        );
        updateReportVariables(
          "August",
          RAAugust,
          TotalRoomsAugust,
          TotalPaxAugust,
          TotalRevenueAugust
        );
        updateReportVariables(
          "September",
          RASeptember,
          TotalRoomsSeptember,
          TotalPaxSeptember,
          TotalRevenueSeptember
        );
        updateReportVariables(
          "October",
          RAOctober,
          TotalRoomsOctober,
          TotalPaxOctober,
          TotalRevenueOctober
        );
        updateReportVariables(
          "November",
          RANovember,
          TotalRoomsNovember,
          TotalPaxNovember,
          TotalRevenueNovember
        );
        updateReportVariables(
          "December",
          RADecember,
          TotalRoomsDecember,
          TotalPaxDecember,
          TotalRevenueDecember
        );
      }
      //Revenue By Sub Department
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.RevenueBySubDepartment
      ) {
        if (this.datas.RevenueBySubDepartment == null) {
          alert("No data Found");
          window.close();
        } else {
          const reportDefault =
            "/report/reports/CHS/RevenueBySubDepartment01.mrt";
          this.getTemplateStaticFromConfig(report, reportDefault);
          if (report.dictionary.variables.getByName("Description")) {
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          }
        }
      }
      //FNB Rate Structure
      else if (
        this.$route.query.reportCode == this.reportCodeName.FAndBRateStructure
      ) {
        const reportDefault = "/report/reports/CPOS/FNBRateStructure03A.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        report.dictionary.variables.getByName("Outlet1").valueObject =
          this.datas.OutletList.FNBOutlet01;
        report.dictionary.variables.getByName("Outlet2").valueObject =
          this.datas.OutletList.FNBOutlet02;
        report.dictionary.variables.getByName("Outlet3").valueObject =
          this.datas.OutletList.FNBOutlet03;
      }
      //Room Production
      else if (
        this.$route.query.reportCode == this.reportCodeName.RoomProduction
      ) {
        if (this.datas.RoomProduction.length < 1) {
          alert("No data Found");
          window.close();
        }
        if (this.$route.query.filter_index1 == "2") {
          alert(
            "Report File Not Found, Please Contact Cakrasoft Supporting System"
          );
          window.close();
        } else if (
          this.$route.query.filter_index1 == "1" &&
          this.$route.query.filter_index2 == "1"
        ) {
          report.loadFile(
            "/report/reports/CHS/RoomProductionByMarketDetail.mrt"
          );
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        } else {
          report.loadFile("/report/reports/CHS/RoomProductionByMarket.mrt");
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Daily Revenue Report Summary
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.DailyRevenueReportSummary
      ) {
        const reportDefault =
          "/report/reports/CHS/DailyRevenueReportSummary001.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Guest In House Listing
      else if (
        this.$route.query.reportCode == this.reportCodeName.GuestInHouseListing
      ) {
        if (this.datas.InHouseGuestListing.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/GuestInHouseListing02.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Expected Arrival
      else if (
        this.$route.query.reportCode == this.reportCodeName.ExpectedArrival
      ) {
        if (this.datas.ExpectedArrivalSummary.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/ExpectedArrivalASN.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Expected Departure
      else if (
        this.$route.query.reportCode == this.reportCodeName.ExpectedDeparture
      ) {
        if (this.datas.ExpectedDepartureSummary.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/ExpectedDepartureASN.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Current In House Summary
      else if (
        this.$route.query.reportCode == this.reportCodeName.CurrentInHouse
      ) {
        if (this.datas.CurrentInHouseSummary.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/CurrentInHouseASN.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Day Use Summary
      else if (this.$route.query.reportCode == this.reportCodeName.DayUse) {
        if (this.datas.DayInUseSummary.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/DayUseASN.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Arrival List Summary
      else if (
        this.$route.query.reportCode == this.reportCodeName.ArrivalList
      ) {
        if (this.datas.ArrivalListSummary.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/ArrivalListASN.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Actual Departure Guest List
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ActualDepartureGuestList
      ) {
        if (this.datas.ActualDepartureGuestList.length < 1) {
          alert("No data Found");
          window.close();
        }

        const reportDefault =
          "/report/reports/CHS/ActualDepartureGuestList.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Daily Flash Report
      else if (
        this.$route.query.reportCode == this.reportCodeName.DailyFlashReport
      ) {
        const reportDefault = "/report/reports/CHS/DailyFlashReport01.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Daily Revenue Report
      else if (
        this.$route.query.reportCode == this.reportCodeName.DailyRevenueReport
      ) {
        if (
          [
            this.datas.DRRLiability,
            this.datas.DRRPaymentCash,
            this.datas.DRRPaymentCreditCard,
            this.datas.DRRPaymentOther,
            this.datas.DRRRevenueFB,
            this.datas.DRRRevenueNoRoomFB,
            this.datas.DRRRevenueRoom,
          ].every((arr: any[]) => arr.length < 1)
        ) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CHS/DailyRevenueReport04.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Daily Statistic Report
      else if (
        this.$route.query.reportCode == this.reportCodeName.DailyStatisticReport
      ) {
        if (this.areAllValuesNull(this.datas.DailyStatisticReport[0])) {
          alert("No data Found");
          window.close();
        }

        const reportDefault = "/report/reports/CHS/DailyStatisticReport.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Journal
      else if (this.$route.query.reportCode == this.reportCodeName.Journal) {
        if (this.datas.Journal.length < 1) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CAS/Journal.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Trial Balance
      else if (
        this.$route.query.reportCode == this.reportCodeName.TrialBalance
      ) {
        const reportDefault = "/report/reports/CAS/TrialBalance.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //General Ledger
      else if (
        this.$route.query.reportCode == this.reportCodeName.GeneralLedger
      ) {
        if (this.datas.GeneralLedger.length < 1) {
          alert("No data Found");
          window.close();
        } else {
          const reportDefault = "/report/reports/CAS/GeneralLedger01.mrt";
          this.getTemplateStaticFromConfig(report, reportDefault);
          if (report.dictionary.variables.getByName("Description")) {
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.ReportVariable.Description;
            report.dictionary.variables.getByName(
              "FinanceHeadName"
            ).valueObject = this.datas.ReportVariable.FinanceHeadName;
            report.dictionary.variables.getByName(
              "FinanceHeadPosition"
            ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
            report.dictionary.variables.getByName(
              "DirectorPosition"
            ).valueObject = this.datas.ReportVariable.DirectorPosition;
            report.dictionary.variables.getByName("DirectorName").valueObject =
              this.datas.ReportVariable.DirectorName;
            report.dictionary.variables.getByName(
              "HotelManagerName"
            ).valueObject = this.datas.ReportVariable.HotelManagerName;
            report.dictionary.variables.getByName(
              "HotelManagerPosition"
            ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
          }
        }
      }
      //Work Sheet
      else if (this.$route.query.reportCode == this.reportCodeName.WorkSheet) {
        if (this.datas.WorkSheet.length < 1) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CAS/WorkSheet.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Balance Sheet
      else if (
        this.$route.query.reportCode == this.reportCodeName.BalanceSheet
      ) {
        const reportDefault = "/report/reports/CAS/BalanceSheet.mrt";
        if (this.$route.query.filter_index1 == "2") {
          if (
            this.datas.AssetBalance.length < 1 &&
            this.datas.LiabilityEquityBalance.length < 1
          ) {
            alert("No data Found");
            window.close();
          }
          report.loadFile("/report/reports/CAS/BalanceSheetByCategory01.mrt");
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        } else if (this.$route.query.filter_index1 == "3") {
          if (
            this.datas.AssetBalance.length < 1 &&
            this.datas.LiabilityEquityBalance.length < 1
          ) {
            alert("No data Found");
            window.close();
          }
          report.loadFile(
            "report/reports/CAS/BalanceSheetByCategorySummary01.mrt"
          );
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        } else {
          if (this.datas.report_info.report_template == "BalanceSheet.mrt") {
            if (
              this.datas.AssetBalance.length < 1 &&
              this.datas.LiabilityEquityBalance.length < 1
            ) {
              alert("No data Found");
              window.close();
            }
          } else {
            if (this.datas.BalanceSheet.length) {
              alert("No data Found");
              window.close();
            }
          }
          this.getTemplateStaticFromConfig(report, reportDefault);
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Balance Multi Period
      else if (
        this.$route.query.reportCode == this.reportCodeName.BalanceMultiPeriod
      ) {
        if (
          this.datas.AssetBalanceYear.length < 1 &&
          this.datas.LiabilityEquityBalanceYear.length < 1
        ) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CAS/BalanceSheetYear.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Income Statement
      else if (
        this.$route.query.reportCode == this.reportCodeName.IncomeStatement
      ) {
        const reportDefault = "/report/reports/CAS/IncomeStatement06.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        // report.loadFile(reportDefault)
        report.dictionary.variables.getByName("DateDescription").valueObject =
          this.datas.hotel_information.Description;
        if (this.reportName == "IncomeStatement04.mrt") {
          if (this.$route.query.filter_index2 == "1") {
            for (let i = 0; i < 50; i++) {
              let descText = report.getComponentByName(
                "MemoDescription" + (i + 1)
              );
              descText.horAlignment = 0;
            }
          }
        }
      }
      //Bank Book
      else if (
        this.$route.query.reportCode == this.reportCodeName.BankBookAccount
      ) {
        if (this.$route.query.filter_index1 == "1") {
          if (this.datas.BankBook.length < 1) {
            alert("No data Found");
            window.close();
          }
          const reportDefault = "/report/reports/CAS/BankBook01.mrt";
          this.getTemplateStaticFromConfig(report, reportDefault);
          if (report.dictionary.variables.getByName("Description")) {
            report.dictionary.variables.getByName("Description").valueObject =
              this.datas.hotel_information.Description;
          }
        } else {
          if (this.datas.BankBook2.length < 1) {
            alert("No data Found");
            window.close();
          }
          const reportDefault =
            "/report/reports/CAS/BankBookGroupByReferenceNumber.mrt";
          // this.getTemplateStaticFromConfig(report, reportDefault);
          report.loadFile(reportDefault);
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Bank Book Group
      else if (
        this.$route.query.reportCode == this.reportCodeName.BankBookAccountGroup
      ) {
        if (this.datas.BankBook.length < 1) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CAS/BankBookGroup.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
      }
      //Bank Book Summary
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.BankBookAccountSummary
      ) {
        if (this.datas.BankBookSummary.length < 1) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CAS/BankBookSummary.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Cash Flow
      else if (this.$route.query.reportCode == this.reportCodeName.CashFlow) {
        if (
          [
            this.datas.CashFlowEndingBalance,
            this.datas.CashFlowInflow,
            this.datas.CashFlowOpeningBalance,
            this.datas.CashFlowOutflow,
          ].every((arr: any[]) => arr.length < 1)
        ) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CAS/CashFlow.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //FNBStructure
      else if (
        this.$route.query.reportCode == this.reportCodeName.FAndBRateStructure
      ) {
        const reportDefault = "/report/reports/CPOS/FNBRateStructure03A.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        let date = this.datas.hotel_information.Description;

        report.dictionary.variables.getByName("Outlet1").valueObject =
          this.datas.OutletList.FNBOutlet01;
        report.dictionary.variables.getByName("Outlet2").valueObject =
          this.datas.OutletList.FNBOutlet02;
        report.dictionary.variables.getByName("Outlet3").valueObject =
          this.datas.OutletList.FNBOutlet03;
        report.dictionary.variables.getByName("Tanggal").valueObject = date;
      }
      //Profit Loss
      else if (
        this.$route.query.reportCode == this.reportCodeName.ProfitAndLoss
      ) {
        const reportDefault = "/report/reports/CAS/ProfitLoss01.mrt";
        // report.loadFile(reportDefault)
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("CurrentMonthText").valueObject =
          this.datas.ReportVariable.CurrentMonthText;
        report.dictionary.variables.getByName("LastMonthText").valueObject =
          this.datas.ReportVariable.LastMonthText;
        report.dictionary.variables.getByName("YearToDateText").valueObject =
          this.datas.ReportVariable.YearToDateText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonth.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDateBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDateBudget.toString();
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDate"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDate.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpense"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpense;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
      }

      //Profit Loss Detail
      else if (
        this.$route.query.reportCode == this.reportCodeName.ProfitAndLossDetail
      ) {
        const reportDefault = "/report/reports/CAS/ProfitLossDetail01.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("CurrentMonthText").valueObject =
          this.datas.ReportVariable.CurrentMonthText;
        report.dictionary.variables.getByName("LastMonthText").valueObject =
          this.datas.ReportVariable.LastMonthText;
        report.dictionary.variables.getByName("YearToDateText").valueObject =
          this.datas.ReportVariable.YearToDateText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonth.toString();
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDate"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDate.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDateBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDateBudget.toString();
      }
      //Profit Loss By Department
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ProfitAndLossByDepartment
      ) {
        const reportDefault =
          "/report/reports/CAS/ProfitLossByDepartment02.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("CurrentMonthText").valueObject =
          this.datas.ReportVariable.CurrentMonthText;
        report.dictionary.variables.getByName("LastMonthText").valueObject =
          this.datas.ReportVariable.LastMonthText;
        report.dictionary.variables.getByName("YearToDateText").valueObject =
          this.datas.ReportVariable.YearToDateText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonth.toString();
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDate"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDate.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
        report.dictionary.variables.getByName(
          "OperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.OperatingIncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonthBudget.toString();
      }
      //Profit Loss  By Department Detail
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ProfitAndLossDetailByDepartment
      ) {
        const reportDefault =
          "/report/reports/CAS/ProfitLossDetailByDepartment02.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("CurrentMonthText").valueObject =
          this.datas.ReportVariable.CurrentMonthText;
        report.dictionary.variables.getByName("LastMonthText").valueObject =
          this.datas.ReportVariable.LastMonthText;
        report.dictionary.variables.getByName("YearToDateText").valueObject =
          this.datas.ReportVariable.YearToDateText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonth.toString();
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDate"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDate.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDateBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDateBudget.toString();
      }
      //Profit Loss  By Sub Department
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ProfitAndLossBySubDepartment
      ) {
        const reportDefault =
          "/report/reports/CAS/ProfitLossBySubDepartment02.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("CurrentMonthText").valueObject =
          this.datas.ReportVariable.CurrentMonthText;
        report.dictionary.variables.getByName("LastMonthText").valueObject =
          this.datas.ReportVariable.LastMonthText;
        report.dictionary.variables.getByName("YearToDateText").valueObject =
          this.datas.ReportVariable.YearToDateText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDate"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDate.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDateBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDateBudget.toString();
      }
      //Profit Loss Detail By Sub Department Detail
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ProfitAndLossDetailBySubDepartment
      ) {
        const reportDefault =
          "/report/reports/CAS/ProfitLossDetailBySubdepartment02.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        // report.loadFile(reportDefault)
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("CurrentMonthText").valueObject =
          this.datas.ReportVariable.CurrentMonthText;
        report.dictionary.variables.getByName("LastMonthText").valueObject =
          this.datas.ReportVariable.LastMonthText;
        report.dictionary.variables.getByName("YearToDateText").valueObject =
          this.datas.ReportVariable.YearToDateText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDate"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDate.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonth"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonth.toString();
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
        report.dictionary.variables.getByName(
          "TotalIncomeLastMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeLastMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeCurrentMonthBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeCurrentMonthBudget.toString();
        report.dictionary.variables.getByName(
          "TotalIncomeYearToDateBudget"
        ).valueObject =
          this.datas.ReportVariable.TotalIncomeYearToDateBudget.toString();
      }
      //Profit Loss Detail Multi Period Detail
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ProfitAndLossMultiPeriodDetail
      ) {
        const reportDefault =
          "/report/reports/CAS/ProfitLossMultiPeriodDetail02.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("DescriptionText").valueObject =
          this.datas.ReportVariable.DescriptionText;
        report.dictionary.variables.getByName("IncomeText").valueObject =
          this.datas.ReportVariable.IncomeText;
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName("DirectorName").valueObject =
          this.datas.ReportVariable.DirectorName;
        report.dictionary.variables.getByName("CostText").valueObject =
          this.datas.ReportVariable.CostText;
        report.dictionary.variables.getByName(
          "FinanceHeadPosition"
        ).valueObject = this.datas.ReportVariable.FinanceHeadPosition;
        report.dictionary.variables.getByName("HotelManagerName").valueObject =
          this.datas.ReportVariable.HotelManagerName;
        report.dictionary.variables.getByName(
          "HotelManagerPosition"
        ).valueObject = this.datas.ReportVariable.HotelManagerPosition;
        report.dictionary.variables.getByName("DirectorPosition").valueObject =
          this.datas.ReportVariable.DirectorPosition;
        report.dictionary.variables.getByName("FinanceHeadName").valueObject =
          this.datas.ReportVariable.FinanceHeadName;
        report.dictionary.variables.getByName(
          "NonOperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.NonOperatingExpenseText;
        report.dictionary.variables.getByName(
          "OperatingExpenseText"
        ).valueObject = this.datas.ReportVariable.OperatingExpenseText;
        report.dictionary.variables.getByName(
          "NonOperatingIncomeText"
        ).valueObject = this.datas.ReportVariable.NonOperatingIncomeText;
      }
      //Profit Loss Graphic
      else if (
        this.$route.query.reportCode == this.reportCodeName.ProfitAndLossGraphic
      ) {
        // if (this.datas.PLGraphic == null) {
        //   alert("No data Found");
        // window.close();
        // }else{
        const reportDefault = "/report/reports/CAS/ProfitLossGraphic.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        // }
      }
      //Inventory Reconciliation
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.InventoryReconciliation
      ) {
        const reportDefault =
          "/report/reports/CAMS/InventoryReconciliation.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Inventory Reconciliation Daily
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.DailyInventoryReconciliation
      ) {
        const reportDefault =
          "/report/reports/CAMS/InventoryReconciliationDaily01.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Inventory Reconciliation Monthly
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.MonthlyInventoryReconciliation
      ) {
        const reportDefault =
          "/report/reports/CAMS/InventoryReconciliationMonthly.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Item Purchase Graphic
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.ItemPurchasePriceGraphic
      ) {
        const reportDefault =
          "/report/reports/CAMS/ItemPurchasePriceGraphic.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Daily Hotel Competitor
      else if (
        this.$route.query.reportCode == this.reportCodeName.DailyHotelCompetitor
      ) {
        // const reportDefault = "/report/reports/CHS/DailyHotelCompetitor4.mrt"
        await this.getTemplateStaticFromConfig(
          report,
          "/report/reports/CHS/DailyHotelCompetitor4.mrt"
        );
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;

        let TotalAvailableRoom = 0,
          TotalRoomSold = 0,
          MTDTotalAvailableRoom = 0,
          MTDTotalRoomSold = 0,
          MTDTotalRoomRevenue = 0,
          YTDTotalAvailableRoom = 0,
          YTDTotalRoomSold = 0,
          YTDTotalRoomRevenue = 0,
          TotalRoomRevenue = 0,
          Total = 0;
        for (const i of this.datas.DailyHotelCompetitor) {
          console.log("data", i);
          TotalAvailableRoom += anyToFloat(i.TDYAvailableRoom);
          MTDTotalAvailableRoom += anyToFloat(i.MTDAvailableRoom);
          YTDTotalAvailableRoom += anyToFloat(i.YTDAvailableRoom);
          TotalRoomSold += anyToFloat(i.TDYRoomSold);
          MTDTotalRoomSold += anyToFloat(i.MTDRoomSold);
          YTDTotalRoomSold += anyToFloat(i.YTDRoomSold);
          TotalRoomRevenue +=
            anyToFloat(i.TDYRevenue / i.TDYRoomSold) *
            anyToFloat(i.TDYRoomSold);
          MTDTotalRoomRevenue +=
            anyToFloat(i.MTDRevenue / i.MTDRoomSold) *
            anyToFloat(i.MTDRoomSold);
          YTDTotalRoomRevenue +=
            anyToFloat(i.YTDRevenue / i.YTDRoomSold) *
            anyToFloat(i.YTDRoomSold);
          Total = 1;
        }

        report.dictionary.variables.getByName(
          "TotalAvailableRoom"
        ).valueObject = TotalAvailableRoom;
        report.dictionary.variables.getByName("TotalRoomSold").valueObject =
          TotalRoomSold;
        report.dictionary.variables.getByName("TotalRoomRevenue").valueObject =
          TotalRoomRevenue;
        report.dictionary.variables.getByName(
          "MTDTotalAvailableRoom"
        ).valueObject = MTDTotalAvailableRoom;
        report.dictionary.variables.getByName("MTDTotalRoomSold").valueObject =
          MTDTotalRoomSold;
        report.dictionary.variables.getByName(
          "MTDTotalRoomRevenue"
        ).valueObject = MTDTotalRoomRevenue;
        report.dictionary.variables.getByName(
          "YTDTotalAvailableRoom"
        ).valueObject = YTDTotalAvailableRoom;
        report.dictionary.variables.getByName("YTDTotalRoomSold").valueObject =
          YTDTotalRoomSold;
        report.dictionary.variables.getByName(
          "YTDTotalRoomRevenue"
        ).valueObject = YTDTotalRoomRevenue;
        report.dictionary.variables.getByName("Total").valueObject = Total;
      }
      //Cashier Report Reprint
      else if (
        this.$route.query.reportCode == this.reportCodeName.CashierReportReprint
      ) {
        if (
          [this.datas.CashierReport, this.datas.CashierReportSummary].every(
            (arr: any[]) => arr.length < 1
          )
        ) {
          alert("No data Found");
          window.close();
        }
        const reportDefault = "/report/reports/CashierReport01.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Cash Summary Report
      else if (
        this.$route.query.reportCode == this.reportCodeName.CashSummaryReport
      ) {
        const reportDefault = "/report/reports/CHS/CashSummaryReport.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Payment By Sub Department
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.PaymentBySubDepartment
      ) {
        const reportDefault = "/report/reports/CHS/PaymentBySubDepartment.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("SD01").valueObject =
          this.datas.ReportVariable.SD01;
        report.dictionary.variables.getByName("SD02").valueObject =
          this.datas.ReportVariable.SD02;
        report.dictionary.variables.getByName("SD03").valueObject =
          this.datas.ReportVariable.SD03;
        report.dictionary.variables.getByName("SD04").valueObject =
          this.datas.ReportVariable.SD04;
        report.dictionary.variables.getByName("SD05").valueObject =
          this.datas.ReportVariable.SD05;
        report.dictionary.variables.getByName("SD06").valueObject =
          this.datas.ReportVariable.SD06;
        report.dictionary.variables.getByName("SD07").valueObject =
          this.datas.ReportVariable.SD07;
      }
      //Payment By Account
      else if (
        this.$route.query.reportCode == this.reportCodeName.PaymentByAccount
      ) {
        const reportDefault = "/report/reports/CHS/PaymentByAccount.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("PYNAccount01").valueObject =
          this.datas.ReportVariable.PYAccount01;
        report.dictionary.variables.getByName("PYNAccount02").valueObject =
          this.datas.ReportVariable.PYAccount02;
        report.dictionary.variables.getByName("PYNAccount03").valueObject =
          this.datas.ReportVariable.PYAccount03;
        report.dictionary.variables.getByName("PYNAccount04").valueObject =
          this.datas.ReportVariable.PYAccount04;
        report.dictionary.variables.getByName("PYNAccount05").valueObject =
          this.datas.ReportVariable.PYAccount05;
        report.dictionary.variables.getByName("PYNAccount06").valueObject =
          this.datas.ReportVariable.PYAccount06;
        report.dictionary.variables.getByName("PYNAccount07").valueObject =
          this.datas.ReportVariable.PYAccount07;
        report.dictionary.variables.getByName("PYNAccount08").valueObject =
          this.datas.ReportVariable.PYAccount08;
        report.dictionary.variables.getByName("PYNAccount09").valueObject =
          this.datas.ReportVariable.PYAccount09;
        report.dictionary.variables.getByName("PYNAccount10").valueObject =
          this.datas.ReportVariable.PYAccount10;
        report.dictionary.variables.getByName("PYNAccount11").valueObject =
          this.datas.ReportVariable.PYAccount11;
        report.dictionary.variables.getByName("PYNAccount12").valueObject =
          this.datas.ReportVariable.PYAccount12;
      }
      //Transaction Report By Staff
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.TransactionReportByStaff
      ) {
        const reportDefault = "/report/reports/CHS/TransactionByStaff.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("UserIDSelect").valueObject =
          this.$route.query.filter_text4;
      }
      //Tax Breakdown Detailed
      else if (
        this.$route.query.reportCode == this.reportCodeName.TaxBreakdownDetailed
      ) {
        const reportDefault = "/report/reports/CHS/TaxBreakdownDetail.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Today Room Revenue Breakdown
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.TodayRoomRevenueBreakdown
      ) {
        const reportDefault =
          "/report/reports/CHS/TodayRoomRevenueBreakdown.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Room Rate Breakdown
      else if (
        this.$route.query.reportCode == this.reportCodeName.RoomRateBreakdown
      ) {
        const reportDefault = "/report/reports/CHS/RoomRateBreakdown.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.DateDescription;
      }
      //Package Breakdown
      else if (
        this.$route.query.reportCode == this.reportCodeName.PackageBreakdown
      ) {
        const reportDefault = "/report/reports/CHS/PackageBreakdown.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.DateDescription;
      }
      //Room Count Sheet
      else if (
        this.$route.query.reportCode == this.reportCodeName.RoomCountSheet
      ) {
        // const reportDefault = "/report/reports/CHS/RoomCountSheet.mrt"
        this.getTemplateStaticFromConfig(
          report,
          "/report/reports/CHS/RoomCountSheet.mrt"
        );
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
      }
      //Room Count Sheet by Building, Floor, Room Type
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.RoomCountSheetByBuildingFloorRoomType
      ) {
        const reportDefault =
          "/report/reports/CHS/RoomCountSheetByBuildingFloorRoomType.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Room Count Sheet by Room Type, Bed Type
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.RoomCountSheetByRoomTypeBedType
      ) {
        const reportDefault =
          "/report/reports/CHS/RoomCountSheetByRoomTypeBedType.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Occupied Graphic
      else if (
        this.$route.query.reportCode == this.reportCodeName.OccupiedGraphic ||
        this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByBusinessSourceGraphic ||
        this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByMarketGraphic ||
        this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByGuestTypeGraphic ||
        this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByCountryGraphic ||
        this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByStateGraphic ||
        this.$route.query.reportCode == this.reportCodeName.OccupancyGraphic
      ) {
        report.loadFile("/report/reports/CHS/OccupiedGraphic.mrt");
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
        report.dictionary.variables.getByName("YTitle").valueObject =
          this.datas.ReportVariable.YTitle;
        if (
          this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByBusinessSourceGraphic
        ) {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPIED BY BUSINESS SOURCE GRAPHIC";
        } else if (
          this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByMarketGraphic
        ) {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPIED BY MARKET GRAPHIC";
        } else if (
          this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByGuestTypeGraphic
        ) {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPIED BY GUEST TYPE GRAPHIC";
        } else if (
          this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByCountryGraphic
        ) {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPIED BY COUNTRY GRAPHIC";
        } else if (
          this.$route.query.reportCode ==
          this.reportCodeName.OccupiedByStateGraphic
        ) {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPIED BY STATE GRAPHIC";
        } else if (
          this.$route.query.reportCode == this.reportCodeName.OccupancyGraphic
        ) {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPANCY GRAPHIC";
        } else {
          report.dictionary.variables.getByName("ReportTitle").valueObject =
            "OCCUPIED GRAPHIC";
        }
      }
      //Room Sales By Room Number
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.RoomSalesByRoomNumber
      ) {
        if (this.$route.query.filter_index1 == "1") {
          report.loadFile("/report/reports/CHS/RoomSalesByRoomNumber.mrt");
        } else if (this.$route.query.filter_index1 == "2") {
          report.loadFile("/report/reports/CHS/RoomSalesByRoomType.mrt");
        } else {
          report.loadFile("/report/reports/CHS/RoomSalesByBedType.mrt");
        }

        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
      }
      //Room Sales
      else if (this.$route.query.reportCode == this.reportCodeName.RoomSales) {
        const reportDefault = "/report/reports/CHS/RoomSales01.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
        report.dictionary.variables.getByName("RoomType01").valueObject =
          this.datas.RoomName.RoomType01;
        report.dictionary.variables.getByName("RoomType02").valueObject =
          this.datas.RoomName.RoomType02;
        report.dictionary.variables.getByName("RoomType03").valueObject =
          this.datas.RoomName.RoomType03;
        report.dictionary.variables.getByName("RoomType04").valueObject =
          this.datas.RoomName.RoomType04;
        report.dictionary.variables.getByName("RoomType05").valueObject =
          this.datas.RoomName.RoomType05;
        report.dictionary.variables.getByName("RoomType06").valueObject =
          this.datas.RoomName.RoomType06;
        report.dictionary.variables.getByName("RoomType07").valueObject =
          this.datas.RoomName.RoomType07;
        report.dictionary.variables.getByName("RoomType08").valueObject =
          this.datas.RoomName.RoomType08;
        report.dictionary.variables.getByName("RoomType09").valueObject =
          this.datas.RoomName.RoomType09;
        report.dictionary.variables.getByName("RoomType10").valueObject =
          this.datas.RoomName.RoomType10;
      }
      //Revenue Graphic
      else if (
        this.$route.query.reportCode == this.reportCodeName.RevenueGraphic
      ) {
        report.loadFile("/report/reports/CHS/RevenueGraphic.mrt");
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
      }
      //OTA Productivity
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.BusinessSourceProductivity
      ) {
        report.loadFile("/report/reports/CHS/OTAProductivity.mrt");
        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
      }
      //FNB Statistic
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.FoodAndBeverageStatistic
      ) {
        const reportDefault = "/report/reports/CHS/FBStatistic.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Rate Code Analysis
      else if (
        this.$route.query.reportCode == this.reportCodeName.RateCodeAnalysis
      ) {
        const reportDefault = "/report/reports/CHS/RateCodeAnalisys.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
      }
      //Sales Contribution Analysis
      else if (
        this.$route.query.reportCode ==
        this.reportCodeName.SalesContributionAnalysis
      ) {
        if (this.datas.SalesContributionAnalisys.length == 0) {
          alert("No data Found");
          window.close();
        }

        if (this.$route.query.filter_index1 == "2") {
          report.loadFile(
            "/report/reports/CHS/SalesContributionAnalisysByCompany.mrt"
          );
        } else if (this.$route.query.filter_index1 == "3") {
          report.loadFile(
            "/report/reports/CHS/SalesContributionAnalisysByBusinessSource.mrt"
          );
        } else {
          report.loadFile("/report/reports/CHS/SalesContributionAnalisys.mrt");
        }

        report.dictionary.variables.getByName("Description").valueObject =
          this.datas.hotel_information.Description;
      }
      //Sales Activity Detail
      else if (
        this.$route.query.reportCode == this.reportCodeName.SalesActivityDetail
      ) {
        const reportDefault = "/report/reports/CHS/SalesActivity.mrt";
        this.getTemplateStaticFromConfig(report, reportDefault);
        if (report.dictionary.variables.getByName("Description")) {
          report.dictionary.variables.getByName("Description").valueObject =
            this.datas.hotel_information.Description;
        }
      }
      //Banquet Calendar
      else if (
        this.$route.query.reportCode == this.reportCodeName.BanquetCalender
      ) {
        report.loadFile("/report/reports/CBS/BanquetCalender.mrt");
        // report.dictionary.variables.getByName("Description").valueObject =
        //   this.datas.hotel_information.Description;
      }
      //Banquet Forecast
      else if (
        this.$route.query.reportCode == this.reportCodeName.BanquetForecast
      ) {
        report.loadFile("/report/reports/CBS/BanquetForecast.mrt");
        // report.dictionary.variables.getByName("Description").valueObject =
        //   this.datas.hotel_information.Description;
      } else {
        alert("No data Found");
        window.close();
      }
      report.dictionary.databases.clear();

      //Change all report static measurement to Hundred of inches
      var reports = report;
      reports.reportUnit = 1;

      //Insert logo to report
      console.log(this.logoWidth, "logo");

      var reportComponent = report.getComponentByName("Picture1");
      if (reportComponent != null) {
        reportComponent.width = this.logoWidth;
        reportComponent.imageURL = this.datas.hotel_information.foto;
        reportComponent.stretch = true;
      }

      if (this.$route.query.reportCode == this.reportCodeName.IncomeStatement) {
        var reportComponent = report.getComponentByName("Picture2");
        if (reportComponent != null) {
          reportComponent.width = this.logoWidth;
          reportComponent.imageURL = this.datas.hotel_information.foto;
          reportComponent.stretch = true;
        }
        var reportComponent1 = report.getComponentByName("Picture3");
        if (reportComponent1 != null) {
          reportComponent1.width = this.logoWidth;
          reportComponent1.imageURL = this.datas.hotel_information.foto;
          reportComponent1.stretch = true;
        }
      }

      // You need to create and copy the 'JSON2.json' file to the project, or change this path to the desired one.
      var dsJSON2 = new Stimulsoft.System.Data.DataSet();
      console.log("dataset atas ", dsJSON2);
      dsJSON2.readJson(this.datas);
      report.regData(dsJSON2.dataSetName, null, dsJSON2);
      console.log("dataset bawah ", dsJSON2);

      var options = new Stimulsoft.Viewer.StiViewerOptions();
      options.appearance.fullScreenMode = true;
      options.toolbar.displayMode =
        Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
      options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.Continuous;

      if (this.$route.query.reportCode == this.reportCodeName.IncomeStatement) {
        if (this.$route.query.filter_index1 == "2") {
          options.toolbar.viewMode =
            Stimulsoft.Viewer.StiWebViewMode.SinglePage;
        }
      }

      var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

      report.reportName =
        this.datas.hotel_information.code +
        "_" +
        this.datas.report_info.report_name +
        "_" +
        this.cleanDateString(this.datas.hotel_information.Description);

      viewer.report = report;
      viewer.renderHtml("viewerContent");
    } else {
      await this.GetReportQuery(this.$route.query.report);

      Stimulsoft.Base.StiLicense.key =
        "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHnPa5/5XoYd+qNFMUW374+2A15lkDEmsFbZidCcj4z6A0fW29" +
        "qY4qqFX38PjvyDKBhrkx+ul3oYnrgqg3XSk0mOzjR42PEALIa9fqUQ4iscOiXXv93u8TJrXsp5mYVhWJ/Umix2Bqwb" +
        "IhXflLD+hq7eMu0FY4xv2+l2cbnW4+2t6azb660R/N3uDD3NV0sOoOSUaBzEyWGX79ppoHXUYPHdga0wZ+egnmkR7Q" +
        "Jg/fZjmLC8IJQSU+HTZUaXuRlg4ny9HOfuy6AZa0pJbHtWl2sowps0cOqDX533NJCrw90zrF9q6ymMP1f96ZoI6RsY" +
        "WlS78TC9RsoO5M1wEDq+JW/k13F5jLIYMwZQlB/oPwb8PazJx8/Flek8RapGoBOgO8loyZtdRP4SA8qavbCjK7ZML5" +
        "b6OXG/trsgeZb0ikZ7W4hX9wldd6AzVxMkjkIrx+HjdVFYbL5R4M1yRicKpDMBVW1HmWLKbBcJORVu2pgbfRTfbQMb" +
        "vwE995r1kuazqHJdj1zNkqNs2h5FhkJpAKif";

      if (this.datas.report_data == null) {
        alert("No data Found");
        window.close();
      } else {
        if (this.datas.report_options.group_level == 0) {
          var report = new Stimulsoft.Report.StiReport();
          report.loadFile("/report/reports/ReportTemplate.mrt");
          report.dictionary.databases.clear();

          // You need to create and copy the 'JSON2.json' file to the project, or change this path to the desired one.
          var dsJSON2 = new Stimulsoft.System.Data.DataSet();
          dsJSON2.readJson(this.datas.report_data);
          report.regData("JSON2", null, dsJSON2);

          var options = new Stimulsoft.Viewer.StiViewerOptions();
          options.appearance.fullScreenMode = true;
          options.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          options.toolbar.viewMode =
            Stimulsoft.Viewer.StiWebViewMode.Continuous;

          //Page Config
          var reportComponent = report.getComponentByName("Page1");
          console.log(reportComponent);

          reportComponent.orientation =
            this.datas.report_options.is_portrait == 1 ? 0 : 1;
          var reportComponent = report.getComponentByName("PageNumber");
          reportComponent.enabled =
            this.datas.report_options.show_page_number == 1 ? true : false;
          if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 15;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 0
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 9;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 0 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 6;
            reportComponent.border.bits.size = 1;
            console.log(reportComponent);
          } else {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 0;
            reportComponent.border.bits.size = 1;
          }

          //ReportTitle
          var reportComponentPicture = report.getComponentByName("Picture1");
          reportComponentPicture.imageURL =
            this.datas.hotel_information.image_url;
          reportComponentPicture.stretch = true;
          reportComponentPicture.width = this.logoWidth;
          console.log(reportComponentPicture.width);
          console.log(reportComponentPicture, "foto");

          // reportComponent.text = this.datas.hotel_information.name
          var reportComponent = report.getComponentByName("CompanyName");
          reportComponent.text = this.datas.hotel_information.name;
          var reportComponent = report.getComponentByName("CompanyDetail");
          reportComponent.text =
            this.datas.hotel_information.street +
            "," +
            this.datas.hotel_information.city;
          var reportComponent = report.getComponentByName("CompanyCountry");
          reportComponent.text =
            this.datas.hotel_information.State +
            "," +
            this.datas.hotel_information.Country +
            "." +
            this.datas.hotel_information.postal_code;
          var reportComponent = report.getComponentByName("CompanyPhone");
          reportComponent.text =
            "Phone: " +
            this.datas.hotel_information.phone1 +
            ", Fax: " +
            this.datas.hotel_information.fax;
          var reportComponent = report.getComponentByName("ReportTitle");
          reportComponent.text = this.datas.report_options.name;
          var reportComponent = report.getComponentByName("Description");
          reportComponent.text = this.datas.hotel_information.Description;
          var reportComponent = report.getComponentByName("HeaderRemark");
          reportComponent.text = this.datas.report_options.header_remark;

          //If page layout landscape, adjust components
          if (this.datas.report_options.is_portrait != 1) {
            var reportComponent = report.getComponentByName("CompanyName");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyDetail");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyCountry");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyPhone");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive1"
            );
            reportComponent.width = 1088.03;
            var reportComponent = report.getComponentByName("ReportTitle");
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive2"
            );
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName("Description");
            reportComponent.left = 485.96;
          }

          //Header
          for (let i = 0; i < this.datas.report_data_style.length; i++) {
            this.sortedHeader.push(this.datas.report_data_style[i].FieldName);
          }

          console.log(this.sortedHeader);

          var datax = dsJSON2.tables.getByIndex(0);
          var datasource = new Stimulsoft.Report.Dictionary.StiDataTableSource(
            datax.tableName,
            datax.tableName,
            datax.tableName
          );

          //Rename column for insert data
          for (const i in this.sortedHeader) {
            let data = this.sortedHeader[i];
            if (
              data.includes(" ") ||
              data.includes("/") ||
              data.includes(">")
            ) {
              data = data.replace(/\/+|\s+|>+|>/g, "_");
            }
            if (data.includes("-")) {
              data = "n" + data.replace(/-+/g, "_");
            }
            this.dataColumn.push(data);
          }

          console.log(this.dataColumn);

          //Add data into datasource
          report.dictionary.dataSources.add(datasource);

          var tabComponent1 = report.getComponentByName("DataBand1");
          tabComponent1.dataSourceName = datasource.nameInSource;

          var footerTot = 0;
          var footerStat = 0;
          var footerPos = 0;
          var footerLoop = 0;
          //Insert data into table
          for (let i = 0; i < this.dataColumn.length; i++) {
            //Insert header
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.sortedHeader[i];
            //Insert data
            datasource.columns.add(
              new Stimulsoft.Report.Dictionary.StiDataColumn(
                this.sortedHeader[i],
                this.sortedHeader[i],
                this.sortedHeader[i]
              )
            );
            var reportComponent1 = report.getComponentByName("D" + (i + 1));
            if (this.dataColumn[i] == "(Number)") {
              reportComponent1.text = "{Line}";
            } else {
              reportComponent1.text =
                "{" + datax.tableName + "." + this.dataColumn[i] + "}";
            }

            //Give style to each columns
            //Header styling
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.datas.report_data_style[i].HeaderName;
            reportComponent.width = this.datas.report_data_style[i].Width;
            reportComponent.height =
              this.datas.report_options.header_row_height;
            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              reportComponent.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              reportComponent.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              reportComponent.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              reportComponent.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              reportComponent.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              reportComponent.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              reportComponent.font.fontFamily.name = "Lucida Console";
            }
            reportComponent.font.size =
              this.datas.report_data_style[i].HeaderFontSize;
            if (this.datas.report_data_style[i].HeaderFontColor == "0") {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].HeaderFontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end

            //Margin
            reportComponent.margins.left = 2;
            reportComponent.margins.right = 2;
            //Margin-End

            //Alignment
            if (this.datas.report_data_style[i].HeaderAlignment == "0") {
              reportComponent.horAlignment = parseInt(
                this.datas.report_data_style[i].HeaderAlignment
              );
            } else if (this.datas.report_data_style[i].HeaderAlignment == "1") {
              reportComponent.horAlignment = 2;
            } else {
              reportComponent.horAlignment = 1;
            }
            //Alignment-end
            //Border
            var header = report.getComponentByName("Header");
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 13;
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              header.border.bits.side = 9;
              header.border.bits.size = 1;
              header.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 15;
              console.log(reportComponent);
              console.log(header);
            } else {
              reportComponent.border.bits.side = 0;
              // header.border.bits.side = 9
              // header.border.bits.size = 1
            }
            //Border-end

            //Data styling
            var dataText = report.getComponentByName("D" + (i + 1));
            dataText.width = this.datas.report_data_style[i].Width;
            dataText.height = this.datas.report_options.row_height;

            //Margin
            dataText.margins.left = 2;
            dataText.margins.right = 2;
            //Margin-End

            //If show footer
            if (this.datas.report_options.show_footer == 1) {
              //Data Binding Footer
              if (this.datas.report_data_style[i].FooterType == 0) {
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                if (footerStat == 1) {
                  footerTextPos.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
                //Border
                var footer = report.getComponentByName("Footer");
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footer.border.bits.side = 9;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 2;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                } else {
                  footer.border.bits.side = 9;
                  footer.border.bits.size = 1;
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 1) {
                let footerText = report.getComponentByName("F" + (i + 1));
                if (footerStat == 0) {
                  footerText.text = "TOTAL";
                  footerText.width = this.datas.report_data_style[i].Width;
                  footerText.height = this.datas.report_options.row_height;
                  footerText.horAlignment = 1;
                  footerText.vertAlignment = 1;
                  footerPos = i + 1;
                  footerStat = 1;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                } else {
                  footerText.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
              } else if (this.datas.report_data_style[i].FooterType == 2) {
                // run sum
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  footerText.width = footerTot;
                  footerStat = 0;
                }

                let footerTextPos = report.getComponentByName("F" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 3) {
                // run Count
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  footerText.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text = "{Sum(" + 1 + ")}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 4) {
                // run Count if <> ""
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  footerText.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 5) {
                // run Count if <> 0
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  footerText.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              }
            }

            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              dataText.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              dataText.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              dataText.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              dataText.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              dataText.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              dataText.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              dataText.font.fontFamily.name = "Lucida Console";
            }
            dataText.font.size = this.datas.report_data_style[i].FontSize;
            if (this.datas.report_data_style[i].FontColor == "0") {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].FontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Border
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 3;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              dataText.border.bits.side = 9;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 2;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else {
              dataText.border.bits.side = 0;
            }
            //Border-end
            //Alignment
            if (this.datas.report_data_style[i].Alignment == "0") {
              dataText.horAlignment = parseInt(
                this.datas.report_data_style[i].Alignment
              );
            } else if (this.datas.report_data_style[i].Alignment == "1") {
              dataText.horAlignment = 2;
            } else {
              dataText.horAlignment = 1;
            }
            //Alignment-end
            //Format
            if (this.datas.report_data_style[i].FormatCode == 1) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n0"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 2) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n1"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 3) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n2"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 4) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n3"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 5) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 6) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 7) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 8) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 9) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 10) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 11) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 12) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 13) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "T"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 14) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "t"
                );
              dataText.textFormat = format;
            } else {
              dataText.textFormat = null;
            }
            //Format-end
          }

          //Footer
          var reportComponent1 = report.getComponentByName("SignSection1");
          reportComponent1.text = this.datas.report_options.sign_section1;
          var reportComponent1 = report.getComponentByName("SignName1");
          reportComponent1.text = this.datas.report_options.sign_name1;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign1");
            reportComponentLine.enabled = false;
          }
          var reportComponent1 = report.getComponentByName("SignPosition1");
          reportComponent1.text = this.datas.report_options.sign_position1;

          var reportComponent1 = report.getComponentByName("SignSection2");
          reportComponent1.text = this.datas.report_options.sign_section2;
          var reportComponent1 = report.getComponentByName("SignName2");
          reportComponent1.text = this.datas.report_options.sign_name2;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignPosition2");
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignSection2");
            reportComponent1.left = 308.98;
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.left = 308.98;
          }
          var reportComponent1 = report.getComponentByName("SignPosition2");
          reportComponent1.text = this.datas.report_options.sign_position2;

          var reportComponent1 = report.getComponentByName("SignSection3");
          reportComponent1.text = this.datas.report_options.sign_section3;
          var reportComponent1 = report.getComponentByName("SignName3");
          reportComponent1.text = this.datas.report_options.sign_name3;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignPosition3");
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignSection3");
            reportComponent1.left = 605.83;
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.left = 605.83;
          }
          var reportComponent1 = report.getComponentByName("SignPosition3");
          reportComponent1.text = this.datas.report_options.sign_position3;

          var reportComponent1 = report.getComponentByName("SignSection4");
          reportComponent1.text = this.datas.report_options.sign_section4;
          var reportComponent1 = report.getComponentByName("SignName4");
          reportComponent1.text = this.datas.report_options.sign_name4;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignPosition4");
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignSection4");
            reportComponent1.left = 914.8;
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.left = 914.8;
          }
          var reportComponent1 = report.getComponentByName("SignPosition4");
          reportComponent1.text = this.datas.report_options.sign_position4;

          var viewer = new Stimulsoft.Viewer.StiViewer(
            options,
            "StiViewer",
            false
          );

          report.reportName =
            this.datas.hotel_information.code +
            "_" +
            this.datas.report_options.name +
            "_" +
            this.cleanDateString(this.datas.hotel_information.Description);

          viewer.report = report;
          viewer.renderHtml("viewerContent");
        }
        // ============================================================================
        //Grouping = 1
        // ============================================================================
        else if (this.datas.report_options.group_level == 1) {
          var report = new Stimulsoft.Report.StiReport();
          report.loadFile("/report/reports/ReportGrouping1.mrt");
          report.dictionary.databases.clear();

          // You need to create and copy the 'JSON2.json' file to the project, or change this path to the desired one.
          var dsJSON2 = new Stimulsoft.System.Data.DataSet();
          dsJSON2.readJson(this.datas.report_data);
          report.regData("JSON2", null, dsJSON2);

          var options = new Stimulsoft.Viewer.StiViewerOptions();
          options.appearance.fullScreenMode = true;
          options.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          options.toolbar.viewMode =
            Stimulsoft.Viewer.StiWebViewMode.Continuous;

          //Page Config
          var reportComponent = report.getComponentByName("Page1");

          reportComponent.orientation =
            this.datas.report_options.is_portrait == 1 ? 0 : 1;
          var reportComponent = report.getComponentByName("PageNumber");
          reportComponent.enabled =
            this.datas.report_options.show_page_number == 1 ? true : false;
          if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 15;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 0
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 9;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 0 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 6;
            reportComponent.border.bits.size = 1;
            console.log(reportComponent);
          } else {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 0;
            reportComponent.border.bits.size = 1;
          }

          //ReportTitle
          var reportComponentPicture = report.getComponentByName("Picture1");
          reportComponentPicture.imageURL =
            this.datas.hotel_information.image_url;
          reportComponentPicture.stretch = true;
          reportComponentPicture.width = this.logoWidth;

          // reportComponent.text = this.datas.hotel_information.name
          var reportComponent = report.getComponentByName("CompanyName");
          reportComponent.text = this.datas.hotel_information.name;
          var reportComponent = report.getComponentByName("CompanyDetail");
          reportComponent.text =
            this.datas.hotel_information.street +
            "," +
            this.datas.hotel_information.city;
          var reportComponent = report.getComponentByName("CompanyCountry");
          reportComponent.text =
            this.datas.hotel_information.State +
            "," +
            this.datas.hotel_information.Country +
            "." +
            this.datas.hotel_information.postal_code;
          var reportComponent = report.getComponentByName("CompanyPhone");
          reportComponent.text =
            "Phone: " +
            this.datas.hotel_information.phone1 +
            ", Fax: " +
            this.datas.hotel_information.fax;
          var reportComponent = report.getComponentByName("ReportTitle");
          reportComponent.text = this.datas.report_options.name;
          var reportComponent = report.getComponentByName("Description");
          reportComponent.text = this.datas.hotel_information.Description;
          var reportComponent = report.getComponentByName("HeaderRemark");
          reportComponent.text = this.datas.report_options.header_remark;

          //If page layout landscape, adjust components
          if (this.datas.report_options.is_portrait != 1) {
            var reportComponent = report.getComponentByName("CompanyName");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyDetail");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyCountry");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyPhone");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive1"
            );
            reportComponent.width = 1088.03;
            var reportComponent = report.getComponentByName("ReportTitle");
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive2"
            );
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName("Description");
            reportComponent.left = 485.96;
          }

          //Header
          for (let i = 0; i < this.datas.report_data_style.length; i++) {
            this.sortedHeader.push(this.datas.report_data_style[i].FieldName);
          }

          console.log(this.sortedHeader);

          var datax = dsJSON2.tables.getByIndex(0);
          var datasource = new Stimulsoft.Report.Dictionary.StiDataTableSource(
            datax.tableName,
            datax.tableName,
            datax.tableName
          );

          //Grouping setter
          var reportComponentGroup =
            report.getComponentByName("GroupHeaderBand1");
          this.getGroupFooter();
          reportComponentGroup.condition =
            "{" + datax.tableName + "." + this.groupFooter[0] + "}";
          var reportComponentText = report.getComponentByName("TextGroup");
          reportComponentText.text =
            this.datas.report_grouping[0].FieldName +
            " : " +
            "{" +
            datax.tableName +
            "." +
            this.groupFooter[0] +
            "}";

          console.log(reportComponentText);

          //Rename column for insert data
          for (const i in this.sortedHeader) {
            let data = this.sortedHeader[i];
            if (
              data.includes(" ") ||
              data.includes("/") ||
              data.includes(">")
            ) {
              data = data.replace(/\/+|\s+|>+|>/g, "_");
            }
            if (data.includes("-")) {
              data = "n" + data.replace(/-+/g, "_");
            }
            this.dataColumn.push(data);
          }
          console.log(this.dataColumn);

          //Add data into datasource
          report.dictionary.dataSources.add(datasource);

          var tabComponent1 = report.getComponentByName("DataBand1");
          tabComponent1.dataSourceName = datasource.nameInSource;

          var footerTot = 0;
          var footerStat = 0;
          var footerPos = 0;
          var footerLoop = 0;
          //Insert data into table
          for (let i = 0; i < this.dataColumn.length; i++) {
            //Insert header
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.sortedHeader[i];
            //Insert data
            datasource.columns.add(
              new Stimulsoft.Report.Dictionary.StiDataColumn(
                this.sortedHeader[i],
                this.sortedHeader[i],
                this.sortedHeader[i]
              )
            );
            var reportComponent1 = report.getComponentByName("D" + (i + 1));
            if (this.dataColumn[i] == "(Number)") {
              reportComponent1.text = "{Line}";
            } else {
              reportComponent1.text =
                "{" + datax.tableName + "." + this.dataColumn[i] + "}";
            }

            //Give style to each columns
            //Header styling
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.datas.report_data_style[i].HeaderName;
            reportComponent.width = this.datas.report_data_style[i].Width;
            reportComponent.height =
              this.datas.report_options.header_row_height;

            if (this.datas.report_data_style[i].IsHidden == 1) {
              reportComponent.width = 0;
            }
            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              reportComponent.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              reportComponent.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              reportComponent.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              reportComponent.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              reportComponent.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              reportComponent.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              reportComponent.font.fontFamily.name = "Lucida Console";
            }
            reportComponent.font.size =
              this.datas.report_data_style[i].HeaderFontSize;
            if (this.datas.report_data_style[i].HeaderFontColor == "0") {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].HeaderFontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Margin
            reportComponent.margins.left = 2;
            reportComponent.margins.right = 2;
            //Margin-End
            //Alignment
            if (this.datas.report_data_style[i].HeaderAlignment == "0") {
              reportComponent.horAlignment = parseInt(
                this.datas.report_data_style[i].HeaderAlignment
              );
            } else if (this.datas.report_data_style[i].HeaderAlignment == "1") {
              reportComponent.horAlignment = 2;
            } else {
              reportComponent.horAlignment = 1;
            }
            //Alignment-end
            //Border
            var header = report.getComponentByName("GroupHeaderBand2");
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 13;
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              header.border.bits.side = 9;
              header.border.bits.size = 1;
              header.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 15;
              console.log(reportComponent);
              console.log(header);
            } else {
              reportComponent.border.bits.side = 0;
              // header.border.bits.side = 9
              // header.border.bits.size = 1
            }
            //Border-end

            //Data styling
            var dataText = report.getComponentByName("D" + (i + 1));
            dataText.width = this.datas.report_data_style[i].Width;
            dataText.height = this.datas.report_options.row_height;
            if (this.datas.report_data_style[i].IsHidden == 1) {
              dataText.width = 0;
            }

            //Margin
            dataText.margins.left = 2;
            dataText.margins.right = 2;
            //Margin-End

            //If show footer
            if (this.datas.report_options.show_footer == 1) {
              //Data Binding Footer
              if (this.datas.report_data_style[i].FooterType == 0) {
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                if (this.datas.report_data_style[i].IsHidden == 1) {
                  footerTextPos.width = 0;
                  footerTextPos2.width = 0;
                }
                if (footerStat == 1) {
                  footerTextPos.enabled = false;
                  footerTextPos2.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
                //Border
                var footer = report.getComponentByName("Footer");
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footer.border.bits.side = 9;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 2;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 2;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                } else {
                  // footer.border.bits.side = 9
                  // footer.border.bits.size = 1
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 1) {
                let footerText = report.getComponentByName("F" + (i + 1));
                let footerText2 = report.getComponentByName("FF" + (i + 1));
                if (footerStat == 0) {
                  this.getGroupFooter();
                  footerText.text =
                    "SUB TOTAL" +
                    " (" +
                    this.datas.report_grouping[0].FieldName +
                    " : {" +
                    datax.tableName +
                    "." +
                    this.groupFooter[0] +
                    "} )";
                  footerText2.text = "TOTAL";
                  console.log(footerText);

                  footerText.width = this.datas.report_data_style[i].Width;
                  footerText.height = this.datas.report_options.row_height;
                  footerText.horAlignment = 1;
                  footerText.vertAlignment = 1;
                  footerText2.width = this.datas.report_data_style[i].Width;
                  footerText2.height = this.datas.report_options.row_height;
                  footerText2.horAlignment = 1;
                  footerText2.vertAlignment = 1;
                  footerPos = i + 1;
                  footerStat = 1;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                  if (this.datas.report_data_style[i].IsHidden == 1) {
                    footerText.width = 0;
                    footerText2.width = 0;
                  }
                } else {
                  footerText.enabled = false;
                  footerText2.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
              } else if (this.datas.report_data_style[i].FooterType == 2) {
                // run sum
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerStat = 0;
                }

                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  let groupFooter =
                    report.getComponentByName("GroupFooterBand1");
                  groupFooter.border.bits.side = 15;
                  groupFooter.border.bits.size = 1;
                  groupFooter.border.bits.style = 0;
                  groupFooter.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  let groupFooter =
                    report.getComponentByName("GroupFooterBand1");
                  groupFooter.border.bits.side = 15;
                  groupFooter.border.bits.size = 1;
                  groupFooter.border.bits.style = 0;
                  groupFooter.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 3) {
                // run Count
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text = "{Sum(" + 1 + ")}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text = "{Sum(" + 1 + ")}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 4) {
                // run Count if <> ""
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 5) {
                // run Count if <> 0
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                }
                //Border-end
              }
            }
            //End footer data bind

            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              dataText.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              dataText.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              dataText.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              dataText.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              dataText.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              dataText.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              dataText.font.fontFamily.name = "Lucida Console";
            }
            dataText.font.size = this.datas.report_data_style[i].FontSize;
            if (this.datas.report_data_style[i].FontColor == "0") {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].FontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Border
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 3;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              dataText.border.bits.side = 9;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 2;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else {
              dataText.border.bits.side = 0;
            }
            //Border-end
            //Alignment
            if (this.datas.report_data_style[i].Alignment == "0") {
              dataText.horAlignment = parseInt(
                this.datas.report_data_style[i].Alignment
              );
            } else if (this.datas.report_data_style[i].Alignment == "1") {
              dataText.horAlignment = 2;
            } else {
              dataText.horAlignment = 1;
            }
            //Alignment-end
            //Format
            if (this.datas.report_data_style[i].FormatCode == 1) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n0"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 2) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n1"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 3) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n2"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 4) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n3"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 5) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 6) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 7) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 8) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 9) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 10) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 11) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 12) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 13) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "T"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 14) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "t"
                );
              dataText.textFormat = format;
            } else {
              dataText.textFormat = null;
            }
            //Format-end
          }

          //Footer
          var reportComponent1 = report.getComponentByName("SignSection1");
          reportComponent1.text = this.datas.report_options.sign_section1;
          var reportComponent1 = report.getComponentByName("SignName1");
          reportComponent1.text = this.datas.report_options.sign_name1;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign1");
            reportComponentLine.enabled = false;
          }
          var reportComponent1 = report.getComponentByName("SignPosition1");
          reportComponent1.text = this.datas.report_options.sign_position1;

          var reportComponent1 = report.getComponentByName("SignSection2");
          reportComponent1.text = this.datas.report_options.sign_section2;
          var reportComponent1 = report.getComponentByName("SignName2");
          reportComponent1.text = this.datas.report_options.sign_name2;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignPosition2");
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignSection2");
            reportComponent1.left = 308.98;
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.left = 308.98;
          }
          var reportComponent1 = report.getComponentByName("SignPosition2");
          reportComponent1.text = this.datas.report_options.sign_position2;

          var reportComponent1 = report.getComponentByName("SignSection3");
          reportComponent1.text = this.datas.report_options.sign_section3;
          var reportComponent1 = report.getComponentByName("SignName3");
          reportComponent1.text = this.datas.report_options.sign_name3;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignPosition3");
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignSection3");
            reportComponent1.left = 605.83;
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.left = 605.83;
          }
          var reportComponent1 = report.getComponentByName("SignPosition3");
          reportComponent1.text = this.datas.report_options.sign_position3;

          var reportComponent1 = report.getComponentByName("SignSection4");
          reportComponent1.text = this.datas.report_options.sign_section4;
          var reportComponent1 = report.getComponentByName("SignName4");
          reportComponent1.text = this.datas.report_options.sign_name4;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignPosition4");
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignSection4");
            reportComponent1.left = 914.8;
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.left = 914.8;
          }
          var reportComponent1 = report.getComponentByName("SignPosition4");
          reportComponent1.text = this.datas.report_options.sign_position4;

          var viewer = new Stimulsoft.Viewer.StiViewer(
            options,
            "StiViewer",
            false
          );
          report.reportName =
            this.datas.hotel_information.code +
            "_" +
            this.datas.report_options.name +
            "_" +
            this.cleanDateString(this.datas.hotel_information.Description);

          viewer.report = report;
          viewer.renderHtml("viewerContent");
        }
        // =============================================
        // Grouping = 2
        // =============================================
        else if (this.datas.report_options.group_level == 2) {
          var report = new Stimulsoft.Report.StiReport();
          report.loadFile("/report/reports/ReportGrouping2.mrt");
          report.dictionary.databases.clear();

          // You need to create and copy the 'JSON2.json' file to the project, or change this path to the desired one.
          var dsJSON2 = new Stimulsoft.System.Data.DataSet();
          dsJSON2.readJson(this.datas.report_data);
          report.regData("JSON2", null, dsJSON2);

          var options = new Stimulsoft.Viewer.StiViewerOptions();
          options.appearance.fullScreenMode = true;
          options.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          options.toolbar.viewMode =
            Stimulsoft.Viewer.StiWebViewMode.Continuous;

          //Page Config
          var reportComponent = report.getComponentByName("Page1");

          reportComponent.orientation =
            this.datas.report_options.is_portrait == 1 ? 0 : 1;
          var reportComponent = report.getComponentByName("PageNumber");
          reportComponent.enabled =
            this.datas.report_options.show_page_number == 1 ? true : false;
          if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 15;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 0
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 9;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 0 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 6;
            reportComponent.border.bits.size = 1;
            console.log(reportComponent);
          } else {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 0;
            reportComponent.border.bits.size = 1;
          }

          //ReportTitle
          var reportComponentPicture = report.getComponentByName("Picture1");
          reportComponentPicture.imageURL =
            this.datas.hotel_information.image_url;
          reportComponentPicture.stretch = true;
          reportComponentPicture.width = this.logoWidth;

          // reportComponent.text = this.datas.hotel_information.name
          var reportComponent = report.getComponentByName("CompanyName");
          reportComponent.text = this.datas.hotel_information.name;
          var reportComponent = report.getComponentByName("CompanyDetail");
          reportComponent.text =
            this.datas.hotel_information.street +
            "," +
            this.datas.hotel_information.city;
          var reportComponent = report.getComponentByName("CompanyCountry");
          reportComponent.text =
            this.datas.hotel_information.State +
            "," +
            this.datas.hotel_information.Country +
            "." +
            this.datas.hotel_information.postal_code;
          var reportComponent = report.getComponentByName("CompanyPhone");
          reportComponent.text =
            "Phone: " +
            this.datas.hotel_information.phone1 +
            ", Fax: " +
            this.datas.hotel_information.fax;
          var reportComponent = report.getComponentByName("ReportTitle");
          reportComponent.text = this.datas.report_options.name;
          var reportComponent = report.getComponentByName("Description");
          reportComponent.text = this.datas.hotel_information.Description;
          var reportComponent = report.getComponentByName("HeaderRemark");
          reportComponent.text = this.datas.report_options.header_remark;

          //If page layout landscape, adjust components
          if (this.datas.report_options.is_portrait != 1) {
            var reportComponent = report.getComponentByName("CompanyName");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyDetail");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyCountry");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyPhone");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive1"
            );
            reportComponent.width = 1088.03;
            var reportComponent = report.getComponentByName("ReportTitle");
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive2"
            );
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName("Description");
            reportComponent.left = 485.96;
          }

          //Header
          for (let i = 0; i < this.datas.report_data_style.length; i++) {
            this.sortedHeader.push(this.datas.report_data_style[i].FieldName);
          }

          console.log(this.sortedHeader);

          var datax = dsJSON2.tables.getByIndex(0);
          var datasource = new Stimulsoft.Report.Dictionary.StiDataTableSource(
            datax.tableName,
            datax.tableName,
            datax.tableName
          );

          //Grouping setter
          var reportComponentGroup =
            report.getComponentByName("GroupHeaderBand1");
          var reportComponentGroup2 =
            report.getComponentByName("GroupHeaderBand2");
          // var reportComponentFooterGroup = report.getComponentByName("GroupFooterBand1")
          var reportComponentFooterGroup2 =
            report.getComponentByName("GroupFooterBand2");
          this.getGroupFooter();
          reportComponentGroup.condition =
            "{" + datax.tableName + "." + this.groupFooter[0] + "}";
          reportComponentGroup2.condition =
            "{" + datax.tableName + "." + this.groupFooter[1] + "}";
          // reportComponentFooterGroup.condition = "{"+datax.tableName+"." + this.groupFooter[0]+"}"
          // reportComponentFooterGroup2.condition = "{"+datax.tableName+"." + this.groupFooter[1]+"}"
          // reportComponentGroup3.condition = "{"+datax.tableName+"." + this.groupFooter[1]+"}"
          var reportComponentText = report.getComponentByName("TextGroup");
          var reportComponentText2 = report.getComponentByName("TextGroup2");
          reportComponentText.text =
            this.datas.report_grouping[0].FieldName +
            " : " +
            "{" +
            datax.tableName +
            "." +
            this.groupFooter[0] +
            "}";
          reportComponentText2.text =
            this.datas.report_grouping[1].FieldName +
            " : " +
            "{" +
            datax.tableName +
            "." +
            this.groupFooter[1] +
            "}";
          console.log(this.groupFooter);
          console.log(reportComponentFooterGroup2);

          //Rename column for insert data
          for (const i in this.sortedHeader) {
            let data = this.sortedHeader[i];
            if (
              data.includes(" ") ||
              data.includes("/") ||
              data.includes(">")
            ) {
              data = data.replace(/\/+|\s+|>+|>/g, "_");
            }
            if (data.includes("-")) {
              data = "n" + data.replace(/-+/g, "_");
            }
            this.dataColumn.push(data);
          }
          console.log(this.dataColumn);

          //Add data into datasource
          report.dictionary.dataSources.add(datasource);

          var tabComponent1 = report.getComponentByName("DataBand1");
          tabComponent1.dataSourceName = datasource.nameInSource;

          var footerTot = 0;
          var footerStat = 0;
          var footerPos = 0;
          var footerLoop = 0;
          //Insert data into table
          for (let i = 0; i < this.dataColumn.length; i++) {
            //Insert header
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.sortedHeader[i];
            //Insert data
            datasource.columns.add(
              new Stimulsoft.Report.Dictionary.StiDataColumn(
                this.sortedHeader[i],
                this.sortedHeader[i],
                this.sortedHeader[i]
              )
            );
            var reportComponent1 = report.getComponentByName("D" + (i + 1));
            if (this.dataColumn[i] == "(Number)") {
              reportComponent1.text = "{Line}";
            } else {
              reportComponent1.text =
                "{" + datax.tableName + "." + this.dataColumn[i] + "}";
            }

            //Give style to each columns
            //Header styling
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.datas.report_data_style[i].HeaderName;
            reportComponent.width = this.datas.report_data_style[i].Width;
            reportComponent.height =
              this.datas.report_options.header_row_height;
            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              reportComponent.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              reportComponent.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              reportComponent.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              reportComponent.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              reportComponent.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              reportComponent.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              reportComponent.font.fontFamily.name = "Lucida Console";
            }
            reportComponent.font.size =
              this.datas.report_data_style[i].HeaderFontSize;
            if (this.datas.report_data_style[i].HeaderFontColor == "0") {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].HeaderFontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Alignment
            if (this.datas.report_data_style[i].HeaderAlignment == "0") {
              reportComponent.horAlignment = parseInt(
                this.datas.report_data_style[i].HeaderAlignment
              );
            } else if (this.datas.report_data_style[i].HeaderAlignment == "1") {
              reportComponent.horAlignment = 2;
            } else {
              reportComponent.horAlignment = 1;
            }
            //Alignment-end

            //Margin
            reportComponent.margins.left = 2;
            reportComponent.margins.right = 2;
            //Margin-End

            //Border
            var header = report.getComponentByName("GroupHeaderBand3");
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 13;
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              header.border.bits.side = 9;
              header.border.bits.size = 1;
              header.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 15;
              console.log(reportComponent);
              console.log(header);
            } else {
              reportComponent.border.bits.side = 0;
              // header.border.bits.side = 9
              // header.border.bits.size = 1
            }
            //Border-end

            //Data styling
            var dataText = report.getComponentByName("D" + (i + 1));
            dataText.width = this.datas.report_data_style[i].Width;
            dataText.height = this.datas.report_options.row_height;

            //Margin
            dataText.margins.left = 2;
            dataText.margins.right = 2;
            //Margin-End

            //If show footer
            if (this.datas.report_options.show_footer == 1) {
              //Data Binding Footer
              if (this.datas.report_data_style[i].FooterType == 0) {
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                if (this.datas.report_data_style[i].IsHidden == 1) {
                  footerTextPos.width = 0;
                  footerTextPos2.width = 0;
                  footerTextPos3.width = 0;
                }
                if (footerStat == 1) {
                  footerTextPos.enabled = false;
                  footerTextPos2.enabled = false;
                  footerTextPos3.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
                //Border
                var footer = report.getComponentByName("Footer");
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                  let groupFooter =
                    report.getComponentByName("GroupFooterBand1");
                  let groupFooter2 =
                    report.getComponentByName("GroupFooterBand2");
                  groupFooter.border.bits.side = 15;
                  groupFooter.border.bits.size = 1;
                  groupFooter.border.bits.style = 0;
                  groupFooter.border.bits.color.name = "Black";
                  groupFooter2.border.bits.side = 15;
                  groupFooter2.border.bits.size = 1;
                  groupFooter2.border.bits.style = 0;
                  groupFooter2.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footer.border.bits.side = 9;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 2;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 2;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 2;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                  let groupFooter =
                    report.getComponentByName("GroupFooterBand1");
                  let groupFooter2 =
                    report.getComponentByName("GroupFooterBand2");
                  groupFooter.border.bits.side = 15;
                  groupFooter.border.bits.size = 1;
                  groupFooter.border.bits.style = 0;
                  groupFooter.border.bits.color.name = "Black";
                  groupFooter2.border.bits.side = 15;
                  groupFooter2.border.bits.size = 1;
                  groupFooter2.border.bits.style = 0;
                  groupFooter2.border.bits.color.name = "Black";
                } else {
                  // footer.border.bits.side = 9
                  // footer.border.bits.size = 1
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 1) {
                let footerText = report.getComponentByName("F" + (i + 1));
                let footerText2 = report.getComponentByName("FF" + (i + 1));
                let footerText3 = report.getComponentByName("GF" + (i + 1));
                if (footerStat == 0) {
                  this.getGroupFooter();
                  footerText.text =
                    "SUB TOTAL" +
                    " (" +
                    this.datas.report_grouping[0].FieldName +
                    " : {" +
                    datax.tableName +
                    "." +
                    this.groupFooter[0] +
                    "} )";
                  footerText2.text = "TOTAL";
                  footerText3.text =
                    "SUB TOTAL" +
                    " (" +
                    this.datas.report_grouping[1].FieldName +
                    " : {" +
                    datax.tableName +
                    "." +
                    this.groupFooter[1] +
                    "} )";
                  console.log(footerText);

                  footerText.width = this.datas.report_data_style[i].Width;
                  footerText.height = this.datas.report_options.row_height;
                  footerText.horAlignment = 1;
                  footerText.vertAlignment = 1;
                  footerText2.width = this.datas.report_data_style[i].Width;
                  footerText2.height = this.datas.report_options.row_height;
                  footerText2.horAlignment = 1;
                  footerText2.vertAlignment = 1;
                  footerText3.width = this.datas.report_data_style[i].Width;
                  footerText3.height = this.datas.report_options.row_height;
                  footerText3.horAlignment = 1;
                  footerText3.vertAlignment = 1;
                  footerPos = i + 1;
                  footerStat = 1;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                } else {
                  footerText.enabled = false;
                  footerText2.enabled = false;
                  footerText3.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
              } else if (this.datas.report_data_style[i].FooterType == 2) {
                // run sum
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerStat = 0;
                }

                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 3) {
                // run Count
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text = "{Sum(" + 1 + ")}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text = "{Sum(" + 1 + ")}";
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text = "{Sum(" + 1 + ")}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 4) {
                // run Count if <> ""
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 5) {
                // run Count if <> 0
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                }
                //Border-end
              }
            }

            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              dataText.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              dataText.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              dataText.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              dataText.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              dataText.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              dataText.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              dataText.font.fontFamily.name = "Lucida Console";
            }
            dataText.font.size = this.datas.report_data_style[i].FontSize;
            if (this.datas.report_data_style[i].FontColor == "0") {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].FontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Border
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 3;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              dataText.border.bits.side = 9;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 2;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else {
              dataText.border.bits.side = 0;
            }
            //Border-end
            //Alignment
            if (this.datas.report_data_style[i].Alignment == "0") {
              dataText.horAlignment = parseInt(
                this.datas.report_data_style[i].Alignment
              );
            } else if (this.datas.report_data_style[i].Alignment == "1") {
              dataText.horAlignment = 2;
            } else {
              dataText.horAlignment = 1;
            }
            //Alignment-end
            //Format
            if (this.datas.report_data_style[i].FormatCode == 1) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n0"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 2) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n1"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 3) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n2"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 4) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n3"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 5) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 6) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 7) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 8) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 9) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 10) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 11) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 12) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 13) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "T"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 14) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "t"
                );
              dataText.textFormat = format;
            } else {
              dataText.textFormat = null;
            }
            //Format-end
          }

          //Footer
          var reportComponent1 = report.getComponentByName("SignSection1");
          reportComponent1.text = this.datas.report_options.sign_section1;
          var reportComponent1 = report.getComponentByName("SignName1");
          reportComponent1.text = this.datas.report_options.sign_name1;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign1");
            reportComponentLine.enabled = false;
          }
          var reportComponent1 = report.getComponentByName("SignPosition1");
          reportComponent1.text = this.datas.report_options.sign_position1;

          var reportComponent1 = report.getComponentByName("SignSection2");
          reportComponent1.text = this.datas.report_options.sign_section2;
          var reportComponent1 = report.getComponentByName("SignName2");
          reportComponent1.text = this.datas.report_options.sign_name2;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignPosition2");
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignSection2");
            reportComponent1.left = 308.98;
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.left = 308.98;
          }
          var reportComponent1 = report.getComponentByName("SignPosition2");
          reportComponent1.text = this.datas.report_options.sign_position2;

          var reportComponent1 = report.getComponentByName("SignSection3");
          reportComponent1.text = this.datas.report_options.sign_section3;
          var reportComponent1 = report.getComponentByName("SignName3");
          reportComponent1.text = this.datas.report_options.sign_name3;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignPosition3");
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignSection3");
            reportComponent1.left = 605.83;
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.left = 605.83;
          }
          var reportComponent1 = report.getComponentByName("SignPosition3");
          reportComponent1.text = this.datas.report_options.sign_position3;

          var reportComponent1 = report.getComponentByName("SignSection4");
          reportComponent1.text = this.datas.report_options.sign_section4;
          var reportComponent1 = report.getComponentByName("SignName4");
          reportComponent1.text = this.datas.report_options.sign_name4;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignPosition4");
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignSection4");
            reportComponent1.left = 914.8;
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.left = 914.8;
          }
          var reportComponent1 = report.getComponentByName("SignPosition4");
          reportComponent1.text = this.datas.report_options.sign_position4;

          var viewer = new Stimulsoft.Viewer.StiViewer(
            options,
            "StiViewer",
            false
          );

          report.reportName =
            this.datas.hotel_information.code +
            "_" +
            this.datas.report_options.name +
            "_" +
            this.cleanDateString(this.datas.hotel_information.Description);

          viewer.report = report;
          viewer.renderHtml("viewerContent");
        }
        // =======================================
        // Grouping = 3
        // =======================================
        else if (this.datas.report_options.group_level == 3) {
          var report = new Stimulsoft.Report.StiReport();
          report.loadFile("/report/reports/ReportGrouping3.mrt");
          report.dictionary.databases.clear();

          // You need to create and copy the 'JSON2.json' file to the project, or change this path to the desired one.
          var dsJSON2 = new Stimulsoft.System.Data.DataSet();
          dsJSON2.readJson(this.datas.report_data);
          report.regData("JSON2", null, dsJSON2);

          var options = new Stimulsoft.Viewer.StiViewerOptions();
          options.appearance.fullScreenMode = true;
          options.toolbar.displayMode =
            Stimulsoft.Viewer.StiToolbarDisplayMode.Separated;
          options.toolbar.viewMode =
            Stimulsoft.Viewer.StiWebViewMode.Continuous;
          //Page Config
          var reportComponent = report.getComponentByName("Page1");
          console.log("halo");

          reportComponent.orientation =
            this.datas.report_options.is_portrait == 1 ? 0 : 1;
          var reportComponent = report.getComponentByName("PageNumber");
          reportComponent.enabled =
            this.datas.report_options.show_page_number == 1 ? true : false;
          if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 15;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 1 &&
            this.datas.report_options.vertical_border == 0
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 9;
            reportComponent.border.bits.size = 1;
          } else if (
            this.datas.report_options.horizontal_border == 0 &&
            this.datas.report_options.vertical_border == 1
          ) {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 6;
            reportComponent.border.bits.size = 1;
            console.log(reportComponent);
          } else {
            var reportComponent = report.getComponentByName("DataBand1");
            reportComponent.border.bits.side = 0;
            reportComponent.border.bits.size = 1;
          }

          //ReportTitle
          var reportComponentPicture = report.getComponentByName("Picture1");
          reportComponentPicture.imageURL =
            this.datas.hotel_information.image_url;
          reportComponentPicture.stretch = true;
          reportComponentPicture.width = this.logoWidth;

          // reportComponent.text = this.datas.hotel_information.name
          var reportComponent = report.getComponentByName("CompanyName");
          reportComponent.text = this.datas.hotel_information.name;
          var reportComponent = report.getComponentByName("CompanyDetail");
          reportComponent.text =
            this.datas.hotel_information.street +
            "," +
            this.datas.hotel_information.city;
          var reportComponent = report.getComponentByName("CompanyCountry");
          reportComponent.text =
            this.datas.hotel_information.State +
            "," +
            this.datas.hotel_information.Country +
            "." +
            this.datas.hotel_information.postal_code;
          var reportComponent = report.getComponentByName("CompanyPhone");
          reportComponent.text =
            "Phone: " +
            this.datas.hotel_information.phone1 +
            ", Fax: " +
            this.datas.hotel_information.fax;
          var reportComponent = report.getComponentByName("ReportTitle");
          reportComponent.text = this.datas.report_options.name;
          var reportComponent = report.getComponentByName("Description");
          reportComponent.text = this.datas.hotel_information.Description;
          var reportComponent = report.getComponentByName("HeaderRemark");
          reportComponent.text = this.datas.report_options.header_remark;

          //If page layout landscape, adjust components
          if (this.datas.report_options.is_portrait != 1) {
            var reportComponent = report.getComponentByName("CompanyName");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyDetail");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyCountry");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName("CompanyPhone");
            reportComponent.horAlignment = 1;
            reportComponent.left = 206.38;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive1"
            );
            reportComponent.width = 1088.03;
            var reportComponent = report.getComponentByName("ReportTitle");
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName(
              "HorizontalLinePrimitive2"
            );
            reportComponent.left = 485.96;
            var reportComponent = report.getComponentByName("Description");
            reportComponent.left = 485.96;
          }

          //Header
          for (let i = 0; i < this.datas.report_data_style.length; i++) {
            this.sortedHeader.push(this.datas.report_data_style[i].FieldName);
          }

          console.log(this.sortedHeader);

          var datax = dsJSON2.tables.getByIndex(0);
          var datasource = new Stimulsoft.Report.Dictionary.StiDataTableSource(
            datax.tableName,
            datax.tableName,
            datax.tableName
          );

          //Grouping setter
          var reportComponentGroup =
            report.getComponentByName("GroupHeaderBand1");
          var reportComponentGroup2 =
            report.getComponentByName("GroupHeaderBand2");
          var reportComponentGroup3 =
            report.getComponentByName("GroupHeaderBand3");
          this.getGroupFooter();
          reportComponentGroup.condition =
            "{" + datax.tableName + "." + this.groupFooter[0] + "}";
          reportComponentGroup2.condition =
            "{" + datax.tableName + "." + this.groupFooter[1] + "}";
          reportComponentGroup3.condition =
            "{" + datax.tableName + "." + this.groupFooter[2] + "}";
          // reportComponentGroup3.condition = "{"+datax.tableName+"." + this.groupFooter[1]+"}"
          var reportComponentText = report.getComponentByName("TextGroup");
          var reportComponentText2 = report.getComponentByName("TextGroup2");
          var reportComponentText3 = report.getComponentByName("TextGroup3");
          reportComponentText.text =
            this.datas.report_grouping[0].FieldName +
            " : " +
            "{" +
            datax.tableName +
            "." +
            this.groupFooter[0] +
            "}";
          reportComponentText2.text =
            this.datas.report_grouping[1].FieldName +
            " : " +
            "{" +
            datax.tableName +
            "." +
            this.groupFooter[1] +
            "}";
          reportComponentText3.text =
            this.datas.report_grouping[2].FieldName +
            " : " +
            "{" +
            datax.tableName +
            "." +
            this.groupFooter[2] +
            "}";
          console.log(reportComponentGroup);
          console.log(reportComponentText);

          //Rename column for insert data
          for (const i in this.sortedHeader) {
            let data = this.sortedHeader[i];
            if (
              data.includes(" ") ||
              data.includes("/") ||
              data.includes(">")
            ) {
              data = data.replace(/\/+|\s+|>+|>/g, "_");
            }
            if (data.includes("-")) {
              data = "n" + data.replace(/-+/g, "_");
            }
            this.dataColumn.push(data);
          }
          console.log(this.dataColumn);

          //Add data into datasource
          report.dictionary.dataSources.add(datasource);

          var tabComponent1 = report.getComponentByName("DataBand1");
          tabComponent1.dataSourceName = datasource.nameInSource;

          var footerTot = 0;
          var footerStat = 0;
          var footerPos = 0;
          var footerLoop = 0;
          //Insert data into table
          for (let i = 0; i < this.dataColumn.length; i++) {
            //Insert header
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.sortedHeader[i];
            //Insert data
            datasource.columns.add(
              new Stimulsoft.Report.Dictionary.StiDataColumn(
                this.sortedHeader[i],
                this.sortedHeader[i],
                this.sortedHeader[i]
              )
            );
            var reportComponent1 = report.getComponentByName("D" + (i + 1));
            if (this.dataColumn[i] == "(Number)") {
              reportComponent1.text = "{Line}";
            } else {
              reportComponent1.text =
                "{" + datax.tableName + "." + this.dataColumn[i] + "}";
            }

            //Give style to each columns
            //Header styling
            var reportComponent = report.getComponentByName("H" + (i + 1));
            reportComponent.text = this.datas.report_data_style[i].HeaderName;
            reportComponent.width = this.datas.report_data_style[i].Width;
            reportComponent.height =
              this.datas.report_options.header_row_height;
            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              reportComponent.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              reportComponent.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              reportComponent.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              reportComponent.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              reportComponent.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              reportComponent.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              reportComponent.font.fontFamily.name = "Lucida Console";
            }
            reportComponent.font.size =
              this.datas.report_data_style[i].HeaderFontSize;
            if (this.datas.report_data_style[i].HeaderFontColor == "0") {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              reportComponent.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].HeaderFontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Margin
            reportComponent.margins.left = 2;
            reportComponent.margins.right = 2;
            //Margin-End
            //Alignment
            if (this.datas.report_data_style[i].HeaderAlignment == "0") {
              reportComponent.horAlignment = parseInt(
                this.datas.report_data_style[i].HeaderAlignment
              );
            } else if (this.datas.report_data_style[i].HeaderAlignment == "1") {
              reportComponent.horAlignment = 2;
            } else {
              reportComponent.horAlignment = 1;
            }
            //Alignment-end
            //Border
            var header = report.getComponentByName("GroupHeaderBand4");
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 13;
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              header.border.bits.side = 9;
              header.border.bits.size = 1;
              header.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              reportComponent.border.bits.side = 3;
              reportComponent.border.bits.size = 1;
              reportComponent.border.bits.color.name = "Black";
              header.border.bits.side = 15;
              console.log(reportComponent);
              console.log(header);
            } else {
              reportComponent.border.bits.side = 0;
              // header.border.bits.side = 9
              // header.border.bits.size = 1
            }
            //Border-end

            //Data styling
            var dataText = report.getComponentByName("D" + (i + 1));
            dataText.width = this.datas.report_data_style[i].Width;
            dataText.height = this.datas.report_options.row_height;

            //Margin
            dataText.margins.left = 2;
            dataText.margins.right = 2;
            //Margin-End

            //If show footer
            if (this.datas.report_options.show_footer == 1) {
              //Data Binding Footer
              if (this.datas.report_data_style[i].FooterType == 0) {
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                let footerTextPos4 = report.getComponentByName("GFF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos4.width = this.datas.report_data_style[i].Width;
                footerTextPos4.height = this.datas.report_options.row_height;
                if (this.datas.report_data_style[i].IsHidden == 1) {
                  footerTextPos.width = 0;
                  footerTextPos2.width = 0;
                  footerTextPos3.width = 0;
                  footerTextPos4.width = 0;
                }
                if (footerStat == 1) {
                  footerTextPos.enabled = false;
                  footerTextPos2.enabled = false;
                  footerTextPos3.enabled = false;
                  footerTextPos4.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
                //Border
                var footer = report.getComponentByName("Footer");
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 3;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                  let groupFooter =
                    report.getComponentByName("GroupFooterBand1");
                  let groupFooter2 =
                    report.getComponentByName("GroupFooterBand2");
                  let groupFooter3 =
                    report.getComponentByName("GroupFooterBand3");
                  groupFooter.border.bits.side = 15;
                  groupFooter.border.bits.size = 1;
                  groupFooter.border.bits.style = 0;
                  groupFooter.border.bits.color.name = "Black";
                  groupFooter2.border.bits.side = 15;
                  groupFooter2.border.bits.size = 1;
                  groupFooter2.border.bits.style = 0;
                  groupFooter2.border.bits.color.name = "Black";
                  groupFooter3.border.bits.side = 15;
                  groupFooter3.border.bits.size = 1;
                  groupFooter3.border.bits.style = 0;
                  groupFooter3.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 9;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  footer.border.bits.side = 9;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 2;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 2;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 2;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 2;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  footer.border.bits.side = 15;
                  footer.border.bits.size = 1;
                  footer.border.bits.color.name = "Black";
                  let groupFooter =
                    report.getComponentByName("GroupFooterBand1");
                  let groupFooter2 =
                    report.getComponentByName("GroupFooterBand2");
                  let groupFooter3 =
                    report.getComponentByName("GroupFooterBand3");
                  groupFooter.border.bits.side = 15;
                  groupFooter.border.bits.size = 1;
                  groupFooter.border.bits.style = 0;
                  groupFooter.border.bits.color.name = "Black";
                  groupFooter2.border.bits.side = 15;
                  groupFooter2.border.bits.size = 1;
                  groupFooter2.border.bits.style = 0;
                  groupFooter2.border.bits.color.name = "Black";
                  groupFooter3.border.bits.side = 15;
                  groupFooter3.border.bits.size = 1;
                  groupFooter3.border.bits.style = 0;
                  groupFooter3.border.bits.color.name = "Black";
                } else {
                  // footer.border.bits.side = 9
                  // footer.border.bits.size = 1
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 1) {
                let footerText = report.getComponentByName("F" + (i + 1));
                let footerText2 = report.getComponentByName("FF" + (i + 1));
                let footerText3 = report.getComponentByName("GF" + (i + 1));
                let footerText4 = report.getComponentByName("GFF" + (i + 1));
                if (footerStat == 0) {
                  this.getGroupFooter();
                  footerText.text =
                    "SUB TOTAL" +
                    " (" +
                    this.datas.report_grouping[0].FieldName +
                    " : {" +
                    datax.tableName +
                    "." +
                    this.groupFooter[0] +
                    "} )";
                  footerText2.text = "TOTAL";
                  footerText3.text =
                    "SUB TOTAL" +
                    " (" +
                    this.datas.report_grouping[1].FieldName +
                    " : {" +
                    datax.tableName +
                    "." +
                    this.groupFooter[1] +
                    "} )";
                  footerText4.text =
                    "SUB TOTAL" +
                    " (" +
                    this.datas.report_grouping[2].FieldName +
                    " : {" +
                    datax.tableName +
                    "." +
                    this.groupFooter[2] +
                    "} )";
                  console.log(footerText);

                  footerText.width = this.datas.report_data_style[i].Width;
                  footerText.height = this.datas.report_options.row_height;
                  footerText.horAlignment = 1;
                  footerText.vertAlignment = 1;
                  footerText2.width = this.datas.report_data_style[i].Width;
                  footerText2.height = this.datas.report_options.row_height;
                  footerText2.horAlignment = 1;
                  footerText2.vertAlignment = 1;
                  footerText3.width = this.datas.report_data_style[i].Width;
                  footerText3.height = this.datas.report_options.row_height;
                  footerText3.horAlignment = 1;
                  footerText3.vertAlignment = 1;
                  footerText4.width = this.datas.report_data_style[i].Width;
                  footerText4.height = this.datas.report_options.row_height;
                  footerText4.horAlignment = 1;
                  footerText4.vertAlignment = 1;
                  footerPos = i + 1;
                  footerStat = 1;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                } else {
                  footerText.enabled = false;
                  footerText2.enabled = false;
                  footerText3.enabled = false;
                  footerText4.enabled = false;
                  footerTot = footerTot + this.datas.report_data_style[i].Width;
                }
              } else if (this.datas.report_data_style[i].FooterType == 2) {
                // run sum
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  let footerText4 = report.getComponentByName(
                    "GFF" + footerPos
                  );
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerText4.width = footerTot;
                  footerStat = 0;
                }

                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                let footerTextPos4 = report.getComponentByName("GFF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                footerTextPos4.width = this.datas.report_data_style[i].Width;
                footerTextPos4.height = this.datas.report_options.row_height;
                footerTextPos4.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos4.vertAlignment = 1;
                footerTextPos4.text =
                  "{Sum(" + datax.tableName + "." + this.dataColumn[i] + ")}";
                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos4.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                  footerTextPos4.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                  footerTextPos4.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 3;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 9;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 6;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 3) {
                // run Count
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  let footerText4 = report.getComponentByName(
                    "GFF" + footerPos
                  );
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerText4.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                let footerTextPos4 = report.getComponentByName("GFF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text = "{Sum(" + 1 + ")}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text = "{Sum(" + 1 + ")}";
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text = "{Sum(" + 1 + ")}";
                footerTextPos4.width = this.datas.report_data_style[i].Width;
                footerTextPos4.height = this.datas.report_options.row_height;
                footerTextPos4.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos4.vertAlignment = 1;
                footerTextPos4.text = "{Sum(" + 1 + ")}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos4.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                  footerTextPos4.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                  footerTextPos4.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 3;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 9;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 6;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 4) {
                // run Count if <> ""
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  let footerText4 = report.getComponentByName(
                    "GFF" + footerPos
                  );
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerText4.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                let footerTextPos4 = report.getComponentByName("GFF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos4.height = this.datas.report_options.row_height;
                footerTextPos4.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos4.vertAlignment = 1;
                footerTextPos4.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos4.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                  footerTextPos4.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                  footerTextPos4.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 3;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 9;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 6;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                }
                //Border-end
              } else if (this.datas.report_data_style[i].FooterType == 5) {
                // run Count if <> 0
                if (footerStat == 1) {
                  let footerText = report.getComponentByName("F" + footerPos);
                  let footerText2 = report.getComponentByName("FF" + footerPos);
                  let footerText3 = report.getComponentByName("GF" + footerPos);
                  let footerText4 = report.getComponentByName(
                    "GFF" + footerPos
                  );
                  footerText.width = footerTot;
                  footerText2.width = footerTot;
                  footerText3.width = footerTot;
                  footerText4.width = footerTot;
                  footerStat = 0;
                }
                let footerTextPos = report.getComponentByName("F" + (i + 1));
                let footerTextPos2 = report.getComponentByName("FF" + (i + 1));
                let footerTextPos3 = report.getComponentByName("GF" + (i + 1));
                let footerTextPos4 = report.getComponentByName("GFF" + (i + 1));
                footerTextPos.width = this.datas.report_data_style[i].Width;
                footerTextPos.height = this.datas.report_options.row_height;
                footerTextPos.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos.vertAlignment = 1;
                footerTextPos.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos2.width = this.datas.report_data_style[i].Width;
                footerTextPos2.height = this.datas.report_options.row_height;
                footerTextPos2.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos2.vertAlignment = 1;
                footerTextPos2.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos3.width = this.datas.report_data_style[i].Width;
                footerTextPos3.height = this.datas.report_options.row_height;
                footerTextPos3.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos3.vertAlignment = 1;
                footerTextPos3.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                footerTextPos4.width = this.datas.report_data_style[i].Width;
                footerTextPos4.height = this.datas.report_options.row_height;
                footerTextPos4.horAlignment =
                  this.datas.report_data_style[i].Alignment;
                footerTextPos4.vertAlignment = 1;
                footerTextPos4.text =
                  "{CountIf(" +
                  datax.tableName +
                  "." +
                  this.dataColumn[i] +
                  " != 0)}";
                console.log(footerTextPos);

                //Alignment
                if (this.datas.report_data_style[i].Alignment == "0") {
                  footerTextPos.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos2.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos3.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                  footerTextPos4.horAlignment = parseInt(
                    this.datas.report_data_style[i].Alignment
                  );
                } else if (this.datas.report_data_style[i].Alignment == "1") {
                  footerTextPos.horAlignment = 2;
                  footerTextPos2.horAlignment = 2;
                  footerTextPos3.horAlignment = 2;
                  footerTextPos4.horAlignment = 2;
                } else {
                  footerTextPos.horAlignment = 1;
                  footerTextPos2.horAlignment = 1;
                  footerTextPos3.horAlignment = 1;
                  footerTextPos4.horAlignment = 1;
                }
                //Alignment-end
                if (this.datas.report_data_style[i].FormatCode == 1) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n0"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 2) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n1"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 3) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n2"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                } else if (this.datas.report_data_style[i].FormatCode == 4) {
                  var format =
                    new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                      "n3"
                    );
                  footerTextPos.textFormat = format;
                  footerTextPos2.textFormat = format;
                  footerTextPos3.textFormat = format;
                  footerTextPos4.textFormat = format;
                }

                //Border
                if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 3;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 3;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 3;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 3;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                  console.log(footerTextPos);
                } else if (
                  this.datas.report_options.horizontal_border == 1 &&
                  this.datas.report_options.vertical_border == 0
                ) {
                  footerTextPos.border.bits.side = 9;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 9;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 9;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 9;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                } else if (
                  this.datas.report_options.horizontal_border == 0 &&
                  this.datas.report_options.vertical_border == 1
                ) {
                  footerTextPos.border.bits.side = 6;
                  footerTextPos.border.bits.size = 1;
                  footerTextPos.border.bits.style = 0;
                  footerTextPos.border.bits.color.name = "Black";
                  footerTextPos2.border.bits.side = 6;
                  footerTextPos2.border.bits.size = 1;
                  footerTextPos2.border.bits.style = 0;
                  footerTextPos2.border.bits.color.name = "Black";
                  footerTextPos3.border.bits.side = 6;
                  footerTextPos3.border.bits.size = 1;
                  footerTextPos3.border.bits.style = 0;
                  footerTextPos3.border.bits.color.name = "Black";
                  footerTextPos4.border.bits.side = 6;
                  footerTextPos4.border.bits.size = 1;
                  footerTextPos4.border.bits.style = 0;
                  footerTextPos4.border.bits.color.name = "Black";
                }
                //Border-end
              }
            }

            //Font
            if (this.datas.report_data_style[i].Font == 0) {
              dataText.font.fontFamily.name = "Arial";
            } else if (this.datas.report_data_style[i].Font == 1) {
              dataText.font.fontFamily.name = "Tahoma";
            } else if (this.datas.report_data_style[i].Font == 2) {
              dataText.font.fontFamily.name = "Verdana";
            } else if (this.datas.report_data_style[i].Font == 3) {
              dataText.font.fontFamily.name = "Microsoft Sans Serif";
            } else if (this.datas.report_data_style[i].Font == 4) {
              dataText.font.fontFamily.name = "Times New Roman";
            } else if (this.datas.report_data_style[i].Font == 5) {
              dataText.font.fontFamily.name = "Comic Sans MS";
            } else if (this.datas.report_data_style[i].Font == 6) {
              dataText.font.fontFamily.name = "Lucida Console";
            }
            dataText.font.size = this.datas.report_data_style[i].FontSize;
            if (this.datas.report_data_style[i].FontColor == "0") {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  'SolidBrushValue("#00000")'
                )
              );
            } else {
              dataText.expressions.add(
                new Stimulsoft.Base.StiAppExpression(
                  "textBrush",
                  "SolidBrushValue(" +
                    '"' +
                    this.datas.report_data_style[i].FontColor +
                    '"' +
                    ")"
                )
              );
            }
            //Font-end
            //Border
            if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 3;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 1 &&
              this.datas.report_options.vertical_border == 0
            ) {
              dataText.border.bits.side = 9;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else if (
              this.datas.report_options.horizontal_border == 0 &&
              this.datas.report_options.vertical_border == 1
            ) {
              dataText.border.bits.side = 2;
              dataText.border.bits.size = 1;
              dataText.border.bits.color.name = "Black";
            } else {
              dataText.border.bits.side = 0;
            }
            //Border-end
            //Alignment
            if (this.datas.report_data_style[i].Alignment == "0") {
              dataText.horAlignment = parseInt(
                this.datas.report_data_style[i].Alignment
              );
            } else if (this.datas.report_data_style[i].Alignment == "1") {
              dataText.horAlignment = 2;
            } else {
              dataText.horAlignment = 1;
            }
            //Alignment-end
            //Format
            if (this.datas.report_data_style[i].FormatCode == 1) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n0"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 2) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n1"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 3) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n2"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 4) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiCustomFormatService(
                  "n3"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 5) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 6) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 7) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yyyy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 8) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd-MM-yy",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 9) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 10) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm:ss",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 11) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yyyy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 12) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiDateFormatService(
                  "dd/MM/yy hh:mm",
                  " "
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 13) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "T"
                );
              dataText.textFormat = format;
            } else if (this.datas.report_data_style[i].FormatCode == 14) {
              var format =
                new Stimulsoft.Report.Components.TextFormats.StiTimeFormatService(
                  "t"
                );
              dataText.textFormat = format;
            } else {
              dataText.textFormat = null;
            }
            //Format-end
          }

          //Footer
          var reportComponent1 = report.getComponentByName("SignSection1");
          reportComponent1.text = this.datas.report_options.sign_section1;
          var reportComponent1 = report.getComponentByName("SignName1");
          reportComponent1.text = this.datas.report_options.sign_name1;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign1");
            reportComponentLine.enabled = false;
          }
          var reportComponent1 = report.getComponentByName("SignPosition1");
          reportComponent1.text = this.datas.report_options.sign_position1;

          var reportComponent1 = report.getComponentByName("SignSection2");
          reportComponent1.text = this.datas.report_options.sign_section2;
          var reportComponent1 = report.getComponentByName("SignName2");
          reportComponent1.text = this.datas.report_options.sign_name2;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignPosition2");
            reportComponent1.left = 308.98;
            var reportComponent1 = report.getComponentByName("SignSection2");
            reportComponent1.left = 308.98;
            var reportComponentLine = report.getComponentByName("LineSign2");
            reportComponentLine.left = 308.98;
          }
          var reportComponent1 = report.getComponentByName("SignPosition2");
          reportComponent1.text = this.datas.report_options.sign_position2;

          var reportComponent1 = report.getComponentByName("SignSection3");
          reportComponent1.text = this.datas.report_options.sign_section3;
          var reportComponent1 = report.getComponentByName("SignName3");
          reportComponent1.text = this.datas.report_options.sign_name3;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignPosition3");
            reportComponent1.left = 605.83;
            var reportComponent1 = report.getComponentByName("SignSection3");
            reportComponent1.left = 605.83;
            var reportComponentLine = report.getComponentByName("LineSign3");
            reportComponentLine.left = 605.83;
          }
          var reportComponent1 = report.getComponentByName("SignPosition3");
          reportComponent1.text = this.datas.report_options.sign_position3;

          var reportComponent1 = report.getComponentByName("SignSection4");
          reportComponent1.text = this.datas.report_options.sign_section4;
          var reportComponent1 = report.getComponentByName("SignName4");
          reportComponent1.text = this.datas.report_options.sign_name4;
          if (reportComponent1.text == "" || reportComponent1.text == null) {
            reportComponent1.text = "";
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.enabled = false;
          }
          if (this.datas.report_options.is_portrait != 1) {
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignPosition4");
            reportComponent1.left = 914.8;
            var reportComponent1 = report.getComponentByName("SignSection4");
            reportComponent1.left = 914.8;
            var reportComponentLine = report.getComponentByName("LineSign4");
            reportComponentLine.left = 914.8;
          }
          var reportComponent1 = report.getComponentByName("SignPosition4");
          reportComponent1.text = this.datas.report_options.sign_position4;

          var viewer = new Stimulsoft.Viewer.StiViewer(
            options,
            "StiViewer",
            false
          );

          report.reportName =
            this.datas.hotel_information.code +
            "_" +
            this.datas.report_options.name +
            "_" +
            this.cleanDateString(this.datas.hotel_information.Description);

          viewer.report = report;
          viewer.renderHtml("viewerContent");
        }
      }
    }
    loader.hide();
  }
}
