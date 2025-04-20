import mutations from './mutations';
import actions from './actions';
import getters from './getters'; 

function getValueByName(json: any, name:string){
    if(json){
        return json.filter(function(result: any){return result.name == name;})[0].value;
    }
}
function getVariant(val: any){
    return val === 'true' || val === 'True' || val === true
}

const configModule = {
    namespaced: true,
    state: { 
      auditDate: "2020-12-11",
      serverDate: '2020-12-11',
      serverDateTime: '2020-12-11 00:00:00',
      iconPrefix        : localStorage.getItem('icon_color'),
      configurations    : localStorage.getItem('configurations') != 'undefined' ? JSON.parse(localStorage.getItem('configurations')) : '',
//       defaultCurrency     : localStorage.getItem('configurations') || 'IDR',
//   //Format Setting
//       shortDateFormat     : getValueByName(configurations, 'SHORT_DATE_FORMAT'),
//       currencyFormat     : getValueByName(configurations, 'CURRENCY_FORMAT'),
//   //Room Status Color
//       roomStatusColor: {
//           reserved : getValueByName(configurations, 'RESERVED'),
//           occupied : getValueByName(configurations, 'OCCUPIED'),
//           houseUse : getValueByName(configurations, 'HOUSE_USE'),
//           compliment : getValueByName(configurations, 'COMPLIMENT'),
//           outOfOrder : getValueByName(configurations, 'OUT_OF_ORDER'),
//           officeUse : getValueByName(configurations, 'OFFICE_USE'),
//           underConstruction : getValueByName(configurations, 'UNDER_CONSTRUCTION'),
//           available : getValueByName(configurations, 'AVAILABLE'),
//       },
//   //Global Account
//       globalAccount: {
//           roomCharge: getValueByName(configurations, 'ACCOUNT_ROOM_CHARGE'),
//           extraBed: getValueByName(configurations, 'ACCOUNT_EXTRA_BED'),
//           cancelationFee: getValueByName(configurations, 'ACCOUNT_CANCELETION_FEE'),
//           breakfast: getValueByName(configurations, 'ACCOUNT_BREAKFAST'),
//           telephone: getValueByName(configurations, 'ACCOUNT_TELEPHONE'),
//           apRefundDeposit: getValueByName(configurations, 'ACCOUNT_AP_REFUND_DEPOSIT'),
//           aPCommission: getValueByName(configurations, 'ACCOUNT_AP_COMMISSION'),
//           cCAdmin: getValueByName(configurations, 'ACCOUNT_CC_ADM'),
//           cash: getValueByName(configurations, 'ACCOUNT_CASH'),
//           cityLedger: getValueByName(configurations, 'ACCOUNT_CITY_LEDGER'),
//           voucher: getValueByName(configurations, 'ACCOUNT_VOUCHER'),
//           voucherCompliment: getValueByName(configurations, 'ACCOUNT_VOUCHER_COMPLIMENT'),
//           tax: getValueByName(configurations, 'ACCOUNT_TAX'),
//           service: getValueByName(configurations, 'ACCOUNT_SERVICE'),
//           transferDepositReservation: getValueByName(configurations, 'ACCOUNT_TRANSFER_DEPOSIT_RESERVATION'),
//           transferDepositReservationToFolio: getValueByName(configurations, 'ACCOUNT_TRANSFER_DEPOSIT_RESERVATION_TO_FOLIO'),
//           transferCharge: getValueByName(configurations, 'ACCOUNT_TRANSFER_CHARGE'),
//           transferPayment: getValueByName(configurations, 'ACCOUNT_TRANSFER_PAYMENT'),
//           noShow: getValueByName(configurations, 'ACCOUNT_NO_SHOW'),
//       },
//       requiredFields: {
//         checkOutLimit: getValueByName(configurations, 'CHECK_OUT_LIMIT'),
//         isTitleRequired: true,//getVariant(getValueByName(configurations, 'IS_TITLE_REQUIRED')),
//         isTAVoucherRequired: getVariant(getValueByName(configurations, 'IS_TA_VOUCHER_REQUIRED')),
//         isStateRequired: getVariant(getValueByName(configurations, 'IS_STATE_REQUIRED')),
//         isRoomNumberRequired: getVariant(getValueByName(configurations, 'IS_ROOM_NUMBER_REQUIRED')),
//         isPhone1Required: getVariant(getValueByName(configurations, 'IS_PHONE1_REQUIRED')),
//         isNationalityRequired: getVariant(getValueByName(configurations, 'IS_NATIONALITY_REQUIRED')),
//         isMarketRequired: getVariant(getValueByName(configurations, 'IS_MARKET_REQUIRED')),
//         isHKNoteRequired: getVariant(getValueByName(configurations, 'IS_HK_NOTE_REQUIRED')),
//         isEmailRequired: getVariant(getValueByName(configurations, 'IS_EMAIL_REQUIRED')),
//         isCompanyRequired: getVariant(getValueByName(configurations, 'IS_COMPANY_REQUIRED')),
//         isCityRequired: getVariant(getValueByName(configurations, 'IS_CITY_REQUIRED')),
//         isBusinessSourceRequired: getVariant(getValueByName(configurations, 'IS_BUSINESS_SOURCE_REQUIRED'))
//       }
    },
    mutations,
    actions,
    getters
};

export default configModule;
