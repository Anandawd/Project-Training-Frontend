import { formatDateDatabase } from "@/utils/format";
import { getValueByName, getVariant } from "../utils/general";

export default {
  auditDate: (state: any): string => formatDateDatabase(state.auditDate),
  iconPrefix: (state: { iconPrefix: any }) => {
    return state.iconPrefix;
  },
  defaultCurrency: (state: { defaultCurrency: any }) => {
    return state.defaultCurrency;
  },
  //FORMAT SETTING
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
  cancelationFee: (state: { configurations: any }) => {
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
  //FOLIO
  allowZeroAmount: (state: { configurations: any }) => {
    return getVariant(
      getValueByName(state.configurations, "ALLOW_ZERO_AMOUNT")
    );
  },
};
