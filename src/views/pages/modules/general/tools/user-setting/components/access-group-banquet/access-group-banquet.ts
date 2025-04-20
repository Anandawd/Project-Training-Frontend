import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import authModule from "@/stores/auth";
import { onSelectContextMenu } from "@/utils/context-menu";
import global from "@/utils/global";
import { calculateDataForDisplay } from "@/utils/general";

@Options({
  name: "access_group_banquet",
  components: {
    // TransferForm,
    // {Form,
    BCardText,
    BCard,
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
    CDatepicker,
    AgGridVue,
  },
  props: { editData: Object },
  emits: ["save", "close"],
})
export default class AccessGroupBanquet extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_special: [],
    access_reservation: [],
    access_deposit: [],
    access_in_house: [],
    access_folio: [],
    access_folio_history: [],
  };
  accessList = {
    access_form: [
      {
        name: "Booking",
        code: global.banquetAccessOrder.accessForm.booking,
      },
      {
        name: "Banquet In Progress",
        code: global.banquetAccessOrder.accessForm.banquetInProgress,
      },
      {
        name: "Banquet View",
        code: global.banquetAccessOrder.accessForm.banquetView,
      },
      {
        name: "Desk Folio",
        code: global.banquetAccessOrder.accessForm.deskFolio,
      },
      {
        name: "Folio History",
        code: global.banquetAccessOrder.accessForm.folioHistory,
      },
    ],
    // access_report: [
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.venue,
    //     hidden: true,
    //     name: "User Report - Venue",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.theme,
    //     hidden: true,
    //     name: "User Report - Theme",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.seatingPlan,
    //     hidden: true,
    //     name: "User Report - Seating Plan",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.product,
    //     hidden: true,
    //     name: "User Report - Product",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.package,
    //     hidden: true,
    //     name: "User Report - Package",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder
    //       .banquetBookingDetail,
    //     hidden: true,
    //     name: "User Report - Banquet Booking Detail",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.banquetCalender,
    //     hidden: true,
    //     name: "User Report - Banquet Calender",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.banquetForecast,
    //     hidden: true,
    //     name: "User Report - Banquet Forecast",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder
    //       .banquetAdvancedDeposit,
    //     hidden: true,
    //     name: "User Report - Banquet Advanced Deposit",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder
    //       .banquetBalanceDeposit,
    //     hidden: true,
    //     name: "User Report - Banquet Balance Deposit",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.banquetChargeList,
    //     hidden: true,
    //     name: "User Report - Banquet Charge List",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.banquetDailySales,
    //     hidden: true,
    //     name: "User Report - Banquet Daily Sales",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder
    //       .cancelBanquetReservation,
    //     hidden: true,
    //     name: "User Report - Cancel Banquet Reservation",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder
    //       .voidBanquetReservation,
    //     hidden: true,
    //     name: "User Report - Void Banquet Reservation",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.cashierReport,
    //     hidden: true,
    //     name: "User Report - Cashier Report",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder
    //       .cashierReportReprint,
    //     hidden: true,
    //     name: "User Report - Cashier Report Reprint",
    //   },
    //   {
    //     code: global.banquetAccessOrder.userReportAccessOrder.banquetBooking,
    //     hidden: true,
    //     name: "User Report - Banquet Booking",
    //   },
    // ],
    access_special: [
      {
        name: "Void Reservation",
        code: global.banquetAccessOrder.userSpecialAccessOrder.voidReservation,
      },
      {
        name: "Void Reservation Charge",
        code: global.banquetAccessOrder.userSpecialAccessOrder
          .voidReservationCharge,
      },
      {
        name: "Void Deposit",
        code: global.banquetAccessOrder.userSpecialAccessOrder.voidDeposit,
      },
      {
        name: "Correct Deposit",
        code: global.banquetAccessOrder.userSpecialAccessOrder.correctDeposit,
      },
      {
        name: "Void Sub Folio",
        code: global.banquetAccessOrder.userSpecialAccessOrder.voidSubFolio,
      },
      {
        name: "Correct Sub Folio",
        code: global.banquetAccessOrder.userSpecialAccessOrder.correctSubFolio,
      },
      {
        name: "Cancel Check-In",
        code: global.banquetAccessOrder.userSpecialAccessOrder.cancelCheckIn,
      },
      {
        name: "Cancel Check-Out",
        code: global.banquetAccessOrder.userSpecialAccessOrder.cancelCheckOut,
      },
      {
        name: "Create Master Folio",
        code: global.banquetAccessOrder.userSpecialAccessOrder
          .createMasterFolio,
      },
      {
        name: "Transfer to Desk Folio",
        code: global.banquetAccessOrder.userSpecialAccessOrder
          .transferToDeskFolio,
      },
      {
        name: "Transfer to Master Folio",
        code: global.banquetAccessOrder.userSpecialAccessOrder
          .transferToMasterFolio,
      },
    ],
    access_reservation: [
      {
        name: "Insert",
        code: global.banquetAccessOrder.userBookingAccessOrder.insert,
      },
      {
        name: "Update",
        code: global.banquetAccessOrder.userBookingAccessOrder.update,
      },
      {
        name: "Duplicate",
        code: global.banquetAccessOrder.userBookingAccessOrder.duplicate,
      },
      {
        name: "Deposit",
        code: global.banquetAccessOrder.userBookingAccessOrder.deposit,
      },
      {
        name: "Cancel",
        code: global.banquetAccessOrder.userBookingAccessOrder.cancel,
      },
      {
        name: "Void",
        code: global.banquetAccessOrder.userBookingAccessOrder.void,
      },
      {
        name: "No Show",
        code: global.banquetAccessOrder.userBookingAccessOrder.noShow,
      },
      {
        name: "Check-In",
        code: global.banquetAccessOrder.userBookingAccessOrder.checkIn,
      },
    ],
    access_deposit: [
      {
        name: "Insert",
        code: global.banquetAccessOrder.userDepositAccessOrder.insert,
      },
      {
        name: "Cash",
        code: global.banquetAccessOrder.userDepositAccessOrder.cash,
      },
      {
        name: "Card",
        code: global.banquetAccessOrder.userDepositAccessOrder.card,
      },
      {
        name: "Refund",
        code: global.banquetAccessOrder.userDepositAccessOrder.refund,
      },
      {
        name: "Void",
        code: global.banquetAccessOrder.userDepositAccessOrder.void,
      },
      {
        name: "Correction",
        code: global.banquetAccessOrder.userDepositAccessOrder.correction,
      },
      {
        name: "Transfer",
        code: global.banquetAccessOrder.userDepositAccessOrder.transfer,
      },
      {
        name: "Update Sub Department",
        code: global.banquetAccessOrder.userDepositAccessOrder
          .updateSubDepartment,
      },
      {
        name: "Update Remark",
        code: global.banquetAccessOrder.userDepositAccessOrder.updateRemark,
      },
      {
        name: "Update Document Number",
        code: global.banquetAccessOrder.userDepositAccessOrder
          .updateDocumentNumber,
      },
    ],
    access_in_house: [
      {
        name: "Transaction",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder
          .transaction,
      },
      {
        name: "Insert",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder.insert,
      },
      {
        name: "Update",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder.update,
      },
      {
        name: "Duplicate",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder
          .duplicate,
      },
      {
        name: "Lock Folio",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder
          .lockFolio,
      },
      {
        name: "Cancel Check-In",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder
          .cancelCheckIn,
      },
      {
        name: "Check-Out",
        code: global.banquetAccessOrder.userBanquetInProgressAccessOrder
          .checkOut,
      },
    ],
    access_folio: [
      {
        name: "Charge",
        code: global.banquetAccessOrder.userTransactionAccessOrder.charge,
      },
      {
        name: "Cash",
        code: global.banquetAccessOrder.userTransactionAccessOrder.cash,
      },
      {
        name: "Card",
        code: global.banquetAccessOrder.userTransactionAccessOrder.card,
      },
      {
        name: "Direct Bill",
        code: global.banquetAccessOrder.userTransactionAccessOrder.directBill,
      },
      {
        name: "Update Direct Bill",
        code: global.banquetAccessOrder.userTransactionAccessOrder
          .updateDirectBill,
      },
      {
        name: "Cash Refund",
        code: global.banquetAccessOrder.userTransactionAccessOrder.cashRefund,
      },
      {
        name: "Other Payment",
        code: global.banquetAccessOrder.userTransactionAccessOrder.otherPayment,
      },
      {
        name: "Void",
        code: global.banquetAccessOrder.userTransactionAccessOrder.void,
      },
      {
        name: "Correction",
        code: global.banquetAccessOrder.userTransactionAccessOrder.correction,
      },
      {
        name: "Transfer",
        code: global.banquetAccessOrder.userTransactionAccessOrder.transfer,
      },
      {
        name: "Update Sub Department",
        code: global.banquetAccessOrder.userTransactionAccessOrder
          .updateSubDepartment,
      },
      {
        name: "Update Remark",
        code: global.banquetAccessOrder.userTransactionAccessOrder.updateRemark,
      },
      {
        name: "Update Document Number",
        code: global.banquetAccessOrder.userTransactionAccessOrder
          .updateDocumentNumber,
      },
      {
        name: "Check-Out",
        code: global.banquetAccessOrder.userTransactionAccessOrder.checkOut,
      },
      {
        name: "Print Folio",
        code: global.banquetAccessOrder.userTransactionAccessOrder.printFolio,
      },
    ],
    access_folio_history: [
      {
        name: "Transaction",
        code: global.banquetAccessOrder.userFolioHistoryAccessOrder.transaction,
      },
      {
        name: "Print Folio",
        code: global.banquetAccessOrder.userFolioHistoryAccessOrder.printFolio,
      },
      {
        name: "Cancel Check-Out",
        code: global.banquetAccessOrder.userFolioHistoryAccessOrder
          .cancelCheckOut,
      },
    ],
  };

  handleSave() {}

  calculateDataForDisplay(data: any[]) {
    return calculateDataForDisplay(data, this.columnSize);
  }

  async getAccessForm(access: any) {
    if (!access) return;
    for (const i in access) {
      for (let x = 0; x < access[i].length; x++) {
        if (this.access.hasOwnProperty(i)) {
          this.access[i][x] = parseInt(access[i][x]);
        }
      }
    }
  }

  getModelIndex(data: any, columnIndex: number, currentIndex: number) {
    const rowCount = Math.ceil(data.length / this.columnSize);
    return rowCount * columnIndex + currentIndex;
  }

  onContextMenu(e: MouseEvent, access: number[], list: object[]) {
    onSelectContextMenu(this, e, access, list);
  }

  // API CALL=============================================================================

  // END API CALL=========================================================================

  beforeMount(): void {}
  mounted(): void {}

  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }

  get columnSize() {
    if (this.screenSize == "lg") {
      return 4;
    }
    if (this.screenSize == "md") {
      return 2;
    }
    if (this.screenSize == "sm") {
      return 2;
    }
    if (this.screenSize == "xs") {
      return 1;
    }
    return 1;
  }
}
