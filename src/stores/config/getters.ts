import { formatDateDatabase } from "@/utils/format";
import { getValueByName, getVariant } from "@/utils/general";
import EncryptionHelper from "@/utils/crypto";
// const encryptionHelper = new EncryptionHelper();

export default {
  configuration: async (state: any) => {
    // const config = await encryptionHelper.decrypt(
    //   state.encryptedConfigurations
    // );
    return state.configurations; //config;
  },
  //GENERAL
  useRateChild: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "USE_RATE_CHILD", "GENERAL")
    );
  },
  autoGenerateCompanyCode: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(
        state.configurations,
        "AUTO_GENERATE_COMPANY_CODE",
        "RESERVATION"
      )
    );
  },
  companyCodeDigit: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "COMPANY_CODE_DIGIT",
      "RESERVATION"
    );
  },
  sidebarLogo: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "SIDEBAR_LOGO", "SIDEBAR");
  },
  dashboardShowOccupancyByRoomType: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(
        state.configurations,
        "DASHBOARD_SHOW_OCCUPANCY_BY_ROOM_TYPE",
        "DASHBOARD_FRONTDESK"
      )
    );
  },
  limitGrid: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "LIMIT_GRID", "GRID");
  },
  wizardComplete: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "WIZARD_COMPLETED", "GENERAL")
    );
  },
  logoWidth: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "LOGO_WIDTH", "REPORT");
  },
  auditDate: (state: any): string => formatDateDatabase(state.audit),
  //FORMAT SETTING
  timezone: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TIMEZONE");
  },
  shortDateFormat: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "SHORT_DATE_FORMAT");
  },
  currencyFormat: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "CURRENCY_FORMAT");
  },
  //RESERVATION FIELD REQUIRED
  checkOutLimit: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "CHECK_OUT_LIMIT");
  }, //{ return '12:00:00' },
  isTitleRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_TITLE_REQUIRED")
    );
  },
  isTAVoucherRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_TA_VOUCHER_REQUIRED")
    );
  },
  isStateRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_STATE_REQUIRED")
    );
  },
  isRoomNumberRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_ROOM_NUMBER_REQUIRED")
    );
  },
  isPhone1Required: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_PHONE1_REQUIRED")
    );
  },
  isNationalityRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_NATIONALITY_REQUIRED")
    );
  },
  isMarketRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_MARKET_REQUIRED")
    );
  },
  isHKNoteRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_HK_NOTE_REQUIRED")
    );
  },
  isEmailRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_EMAIL_REQUIRED")
    );
  },
  isCompanyRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_COMPANY_REQUIRED")
    );
  },
  isCityRequired: (state: { configurations: any }) => {
    return getVariant(getValueByName(state.configurations, "IS_CITY_REQUIRED"));
  },
  isBusinessSourceRequired: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "IS_BUSINESS_SOURCE_REQUIRED")
    );
  },
  //FOLIO

  showRate: (state: { configurations: any }) => {
    return getVariant(getValueByName(state.configurations, "SHOW_RATE"));
  },
  //DEFAULT VARIABLE
  dvRoomType: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_ROOM_TYPE");
  },
  dvRoomRate: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_ROOM_RATE");
  },
  dvSubDepartment: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_SUB_DEPARTMENT");
  },
  dvPaymentType: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_PAYMENT_TYPE");
  },
  dvComplimentRate: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_COMPLIMENT_RATE");
  },
  dvHouseUseRate: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_HOUSE_USE_RATE");
  },
  dvMarket: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_MARKET");
  },
  dvIndividualMarket: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DV_INDIVIDUAL_MARKET");
  },
  //GLOBAL ACCOUNT
  roomCharge: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_ROOM_CHARGE");
  },
  extraBed: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_EXTRA_BED");
  },
  water: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_WATER");
  },
  electricity: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_ELECTRICITY");
  },
  cancellationFee: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_CANCELETION_FEE");
  },
  breakfast: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_BREAKFAST");
  },
  telephone: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_TELEPHONE");
  },
  apRefundDeposit: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_AP_REFUND_DEPOSIT");
  },
  aPCommission: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_AP_COMMISSION");
  },
  cCAdmin: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_CC_ADM");
  },
  cash: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_CASH");
  },
  cityLedger: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_CITY_LEDGER");
  },
  voucher: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_VOUCHER");
  },
  voucherCompliment: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_VOUCHER_COMPLIMENT");
  },
  tax: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_TAX");
  },
  service: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_SERVICE");
  },
  transferDepositReservation: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "ACCOUNT_TRANSFER_DEPOSIT_RESERVATION"
    );
  },
  transferDepositReservationToFolio: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "ACCOUNT_TRANSFER_DEPOSIT_RESERVATION_TO_FOLIO"
    );
  },
  transferCharge: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_TRANSFER_CHARGE");
  },
  transferPayment: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_TRANSFER_PAYMENT");
  },
  noShow: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ACCOUNT_NO_SHOW");
  },
  //GLOBAL DEPARTMENT
  dFoodBeverage: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DEPARTMENT_FOOD_BEVERAGE");
  },
  //GLOBAL SUB DEPARTMENT
  sdFrontOffice: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "SUB_DEPARTMENT_FRONT_OFFICE");
  },
  sdHouseKeeping: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "SUB_DEPARTMENT_HOUSE_KEEPING");
  },
  sdBanquet: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "SUB_DEPARTMENT_BANQUET");
  },
  sdAccounting: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "SUB_DEPARTMENT_ACCOUNTING");
  },
  // GLOBAL OTHER
  goPaymentType: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "PAYMENT_TYPE");
  },
  // GLOBAL JOURNAL ACCOUNT
  jaOverShortAsIncome: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "OVER_SHORT_AS_INCOME");
  },
  jaOverShortAsExpense: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "OVER_SHORT_AS_EXPENSE");
  },
  jaAPSupplier: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "AP_SUPPLIER");
  },
  jaPurchasingDiscount: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "PURCHASING_DISCOUNT");
  },
  jaPurchasingTax: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "PURCHASING_TAX");
  },
  jaPurchasingShipping: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "PURCHASING_SHIPPING");
  },
  jaIncomeReturnStock: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "INCOME_RETURN_STOCK");
  },
  jaExpenseReturnStock: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "EXPENSE_RETURN_STOCK");
  },
  //FOLIO
  allowZeroAmount: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "ALLOW_ZERO_AMOUNT")
    );
  },
  //ROOM STATUS COLOR
  occupiedColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "OCCUPIED");
  },
  reservedColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "RESERVED");
  },
  houseUseColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "HOUSE_USE");
  },
  complimentColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "COMPLIMENT");
  },
  outOfOrderColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "OUT_OF_ORDER");
  },
  officeUseColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "OFFICE_USE");
  },
  underConstructionColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "UNDER_CONSTRUCTION");
  },
  availableColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "AVAILABLE");
  },
  allotmentColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ALLOTMENT");
  },
  //CAMS
  defaultShippingAddress: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "DEFAULT_SHIPPING_ADDRESS");
  },
  defaultStore: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "DEFAULT_STORE",
      "ROOM_COSTING"
    );
  },

  // FLOORPLAN
  minWidthRoom: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "MIN_ROOM_WIDTH", "FLOOR_PLAN");
  },
  minHeightRoom: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "MIN_ROOM_HEIGHT",
      "FLOOR_PLAN"
    );
  },
  tileColumnRoom: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TILE_COLUMN", "FLOOR_PLAN");
  },
  tileDistanceRoom: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TILE_DISTANCE", "FLOOR_PLAN");
  },
  leftMarginRoom: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "LEFT_MARGIN", "FLOOR_PLAN");
  },
  topMarginRoom: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TOP_MARGIN", "FLOOR_PLAN");
  },
  //POS
  // tableView
  minTableWidth: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "MIN_ROOM_WIDTH", "TABLE_VIEW");
  },
  minTableHeight: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "MIN_ROOM_HEIGHT",
      "TABLE_VIEW"
    );
  },
  tileColumnTable: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TILE_COLUMN", "TABLE_VIEW");
  },
  tileDistanceTable: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TILE_DISTANCE", "TABLE_VIEW");
  },
  leftMarginTable: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "LEFT_MARGIN", "TABLE_VIEW");
  },
  topMarginTable: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TOP_MARGIN", "TABLE_VIEW");
  },
  captainOrderColor1: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "CAPTAIN_ORDER COLOR_1",
      "TABLE_VIEW"
    );
  },
  captainOrderColor2: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "CAPTAIN_ORDER COLOR_2",
      "TABLE_VIEW"
    );
  },
  captainOrderColor3: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "CAPTAIN_ORDER COLOR_3",
      "TABLE_VIEW"
    );
  },
  captainOrderColor4: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "CAPTAIN_ORDER COLOR_4",
      "TABLE_VIEW"
    );
  },
  captainOrderColor5: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "CAPTAIN_ORDER COLOR_5",
      "TABLE_VIEW"
    );
  },
  tableColor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "TABLE_COLOR", "TABLE_VIEW");
  },
  defaultOutlet: () => localStorage.getItem("default_outlet") ?? "",
  //TADAMEMBER
  tadaAccountCode: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "TADA_ACCOUNT_CODE",
      "TADA_MEMBER_SERVICE"
    );
  },
  tadaCompanyCode: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "TADA_COMPANY_CODE",
      "TADA_MEMBER_SERVICE"
    );
  },
  tadaEnable: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "TADA_ENABLE", "TADA_MEMBER_SERVICE")
    );
  },
  numberOfGuestProfile: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "NUMBER_OF_GUEST_PROFILE",
      "RESERVATION"
    );
  },
  // tadaAccountCode: (state: { configurations: any }) => {
  //   return getValueByName(state.configurations, "TABLE_COLOR", "TABLE_VIEW");
  // },
  // tadaAccountCode: (state: { configurations: any }) => {
  //   return getValueByName(state.configurations, "TABLE_COLOR", "TABLE_VIEW");
  // },
  // tadaAccountCode: (state: { configurations: any }) => {
  //   return getValueByName(state.configurations, "TABLE_COLOR", "TABLE_VIEW");
  // },

  //Keylock Service
  keylockVendor: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "KEYLOCK_VENDOR", "KEYLOCK");
  },
  pmsServiceAddress: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "PMS_SERVICE_ADDRESS",
      "KEYLOCK"
    );
  },
  pmsServicePort: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "PMS_SERVICE_PORT", "KEYLOCK");
  },
  pmsServiceID: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "PMS_SERVICE_ID", "KEYLOCK");
  },
  onityDBType: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "ONITY_DATABASE_TYPE",
      "KEYLOCK"
    );
  },
  onityServerName: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ONITY_SERVER_NAME", "KEYLOCK");
  },
  onitySoftwareType: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "ONITY_SOFTWARE_TYPE",
      "KEYLOCK"
    );
  },
  onityPort: (state: { configurations: any }) => {
    return getValueByName(state.configurations, "ONITY_PORT", "KEYLOCK");
  },
  // Asset
  isCompanyPRApplyPriceMoreThanOne: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(
        state.configurations,
        "IS_COMPANY_PR_APLLY_PRICE_MORE_THAN_ONE",
        "PURCHASE_REQUEST_APP"
      )
    );
  },
  receiveStockAPTwoDigitDecimal: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(
        state.configurations,
        "RECEIVE_STOCK_AP_TWO_DIGIT_DECIMAL",
        "INVENTORY"
      )
    );
  },
  // Asset

  // Printer Service
  printerServiceAddress: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "PRINTER_SERVICE_ADDRESS",
      "PRINTER_SERVICE"
    );
  },
  printerServicePort: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "PRINTER_SERVICE_PORT",
      "PRINTER_SERVICE"
    );
  },

  // Banquet Colors
  bnqReservationColor: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "RESERVATION_COLOR",
      "BANQUET_VIEW"
    );
  },
  bnqInHouseColor: (state: { configurations: any }) => {
    return getValueByName(
      state.configurations,
      "IN_HOUSE_COLOR",
      "BANQUET_VIEW"
    );
  },
};
