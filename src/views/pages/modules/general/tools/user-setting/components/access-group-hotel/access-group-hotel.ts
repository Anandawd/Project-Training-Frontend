import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import {
  BCard,
  BButton,
  BCardBody,
  BCardHeader,
  BTabs,
  BTab,
  BCardText,
  BCollapse,
} from "bootstrap-vue-3";
import EncryptionHelper from "@/utils/crypto";
import authModule from "@/stores/auth";
import UserSetting from "@/services/api/general/user-setting";
import { onSelectContextMenu } from "@/utils/context-menu";
import { calculateDataForDisplay } from "@/utils/general";
import $global from "@/utils/global";
const userSetting = new UserSetting();
const encryptionHelper = new EncryptionHelper();

@Options({
  name: "access_group_hotel",
  components: {
    // TransferForm,
    // {Form,
    BCardText,
    BCard,
    BTabs,
    BTab,
    BButton,
    BCollapse,
    BCardHeader,
    BCardBody,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
    CDatepicker,
    AgGridVue,
  },
  props: {},
  emits: ["save", "close"],
})
export default class AccessGroupHotel extends Vue {
  public auth = authModule();
  public access: any = {
    is_active: false,
    access_form: [],
    access_report: [],
    access_special: [],
    access_keylock: [],
    access_reservation: [],
    access_deposit: [],
    access_in_house: [],
    access_walk_in: [],
    access_folio: [],
    access_folio_history: [],
    access_floor_plan: [],
    access_company: [],
    access_invoice: [],
    access_member_voucher_gift: [],
    access_preview_report: [],
    access_payment_by_ap_ar: [],
    sa_max_discount_percent: 0,
    sa_max_discount_amount: 0,
  };
  public accessList = {
    access_form: [
      {
        code: $global.frontDeskAccessOrder.accessForm.dashboard,
        name: "Dashboard",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.floorPlan,
        name: "General - Floor Plan",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.roomAvailability,
        name: "General - Room Availability",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.roomTypeAvailability,
        name: "General - Room Type Availability",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.roomAllotment,
        name: "General - Room Allotment",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.guestProfile,
        name: "Reservation - Guest Profile",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.guestGroup,
        name: "Reservation - Guest Group",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.reservation,
        name: "Reservation - Reservation",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.guestInHouse,
        name: "Folio - Guest In House",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.masterFolio,
        name: "Folio - Master Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.deskFolio,
        name: "Folio - Desk Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.folioHistory,
        name: "Folio - Folio History",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.transaction,
        name: "Folio - Transaction",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.houseKeeping,
        name: "House Keeping - House Keeping",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.roomCosting,
        name: "House Keeping - Room Costing",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.guestLoanItem,
        name: "House Keeping - Guest Loan Item",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.lostAndFound,
        name: "House Keeping - Lost and Found",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.competitorData,
        name: "Night Audit - Competitor Data",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.globalPostTransaction,
        name: "Night Audit - Global Post Transaction",
        disabled: true,
        hidden: true,
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.autoPostTransaction,
        name: "Night Audit - Auto Post Transaction",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.dayendClose,
        name: "Night Audit - Dayend Close",
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.company,
        name: "Marketing - Company",
        disabled: true,
        hidden: true,
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.package,
        name: "Marketing - Package",
        disabled: true,
        hidden: true,
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.roomRate,
        name: "Marketing - Room Rate",
        // disabled: true,
        // hidden: true,
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.dynamicRate,
        name: "Marketing - Dynamic Rate",
        // disabled: true,
        // hidden: true,
      },
      {
        code: $global.frontDeskAccessOrder.accessForm.roomRateLastDeal,
        name: "Marketing - Room Rate Last Deal",
        // disabled: true,
        // hidden: true,
      },
      // {
      //   code: $global.frontDeskAccessOrder.accessForm.roomRateLastDeal,
      //   name: "Marketing - Sales Activity",
      //   // disabled: true,
      //   // hidden: true,
      // },
      // {
      //   code: $global.frontDeskAccessOrder.accessForm.eventList,
      //   name: "Marketing - Event List",
      //   disabled: true,
      //   hidden: true,
      // },
      // {
      //   code: $global.frontDeskAccessOrder.accessForm.phoneBook,
      //   name: "Marketing - Phone Book",
      //   disabled: true,
      //   hidden: true,
      // },
      // {
      //   code: $global.frontDeskAccessOrder.accessForm.member,
      //   name: "Marketing - Member",
      //   disabled: true,
      //   hidden: true,
      // },
      // {
      //   code: $global.frontDeskAccessOrder.accessForm.voucher,
      //   name: "Marketing - Voucher",
      //   disabled: true,
      //   hidden: true,
      // },
      // {
      //   code: $global.frontDeskAccessOrder.accessForm.gift,
      //   name: "Marketing - Gift",
      //   disabled: true,
      //   hidden: true,
      // },
    ],
    access_reservation: [
      {
        code: $global.frontDeskAccessOrder.accessReservation.insert,

        name: "Insert",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.update,

        name: "Update",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.void,

        name: "Void",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.duplicate,

        name: "Duplicate",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.checkin,

        name: "Check In",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.cancel,

        name: "Cancel",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.noshow,

        name: "No Show",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.deposit,

        name: "Deposit",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.autoassign,

        name: "Auto Assign",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.lock,

        name: "Lock",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.allotment,
        name: "Allotment",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation.keylock,

        name: "Keylock",
      },
      {
        code: $global.frontDeskAccessOrder.accessReservation
          .showAccessCheckInWithoutDeposit,

        name: "Show Access Check In Without Deposit",
      },
    ],
    access_deposit: [
      {
        code: $global.frontDeskAccessOrder.accessDeposit.void,

        name: "Void",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.refund,

        name: "Refund",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.transfer,

        name: "Transfer",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.insert,

        name: "Insert",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.cash,

        name: "Cash",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.card,

        name: "Card",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.correction,

        name: "Correction",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.updateDocumentNumber,

        name: "Update Doc. #",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.updateRemark,

        name: "Update Remark",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.updateSubDepartment,

        name: "Update Sub Dept.",
      },
      {
        code: $global.frontDeskAccessOrder.accessDeposit.changeCorrectionDate,

        name: "Change Correction Date",
      },
    ],
    access_floor_plan: [
      {
        code: $global.frontDeskAccessOrder.accessFloorPlan.reception,

        name: "Reception",
      },
      {
        code: $global.frontDeskAccessOrder.accessFloorPlan.housekeeping,

        name: "House Keeping",
      },
      {
        code: $global.frontDeskAccessOrder.accessFloorPlan.modifyFloorPlan,

        name: "Modify Floor Plan",
      },
    ],
    access_keylock: [
      {
        code: $global.frontDeskAccessOrder.accessKeylock.canCheckInWithoutCard,

        name: "Can Check In Without Card",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock.canCheckOutWithoutCard,

        name: "Can Check Out Without Card",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock
          .canIssuedCardMoreThanTwice,

        name: "Can Issued Card More Than Twice",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock.canModifyArrivalDate,

        name: "Can Modify Arrival Date",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock.canModifyDepartureDate,

        name: "Can Modify Departure Date",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock.canModifyDepartureTime,

        name: "Can Modify Departure Time",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock.departureDate1Night,

        name: "Departure Date 1 Night",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock
          .showAccessIssuedCardMoreThanOne,

        name: "Show Access Issued Card More Than One",
      },
      {
        code: $global.frontDeskAccessOrder.accessKeylock
          .canIssuedCardMoreThanOne,

        name: "Can Issued Card More Than One",
      },
    ],
    access_in_house: [
      {
        code: $global.frontDeskAccessOrder.accessInHouse.keylock,

        name: "Keylock",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.transaction,

        name: "Transaction",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.update,

        name: "Update",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.moveRoom,

        name: "Move Room",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.switchRoom,

        name: "Switch Room",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.cancelCheckIn,

        name: "Cancel Check In",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.message,

        name: "Message",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.toDo,

        name: "To Do",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.lockFolio,

        name: "Lock Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.checkOut,

        name: "Check Out",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.compliment,

        name: "Compliment",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.houseUse,

        name: "House Use",
      },
      {
        code: $global.frontDeskAccessOrder.accessInHouse.walkIn,

        name: "Walk In",
      },
    ],
    access_folio: [
      {
        code: $global.frontDeskAccessOrder.accessFolio.void,

        name: "Void",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.correction,

        name: "Correction",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.cashRefund,

        name: "Cash Refund",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.transfer,

        name: "Transfer",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.checkOut,

        name: "Check Out",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.charge,

        name: "Charge",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.cash,

        name: "Cash",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.card,

        name: "Card",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.directBill,

        name: "Direct Bill",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.updateDirectBill,

        name: "Update Direct Bill",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.otherPayment,

        name: "Other Payment",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.updateRemark,

        name: "Update Remark",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.updateDocumentNumber,

        name: "Update Doc. #",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.updateSubDepartment,

        name: "Update Sub Dept.",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.printFolio,

        name: "Print Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolio.changeCorrectionDate,

        name: "Change Correction Date",
      },
    ],
    access_folio_history: [
      {
        code: $global.frontDeskAccessOrder.accessFolioHistory.transaction,

        name: "Transaction",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolioHistory.printFolio,

        name: "Print Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessFolioHistory.cancelCheckOut,

        name: "Cancel Check Out",
      },
    ],
    access_walk_in: [
      {
        code: $global.frontDeskAccessOrder.accessWalkIn.breakdown,
        disabled: true,
        name: "Breakdown",
      },
      {
        code: $global.frontDeskAccessOrder.accessWalkIn.extraCharge,
        // disabled: true,
        name: "Extra Charge",
      },
      {
        code: $global.frontDeskAccessOrder.accessWalkIn.scheduledRate,

        name: "Scheduled Rate",
      },
    ],
    access_member_voucher_gift: [
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift.redeemPoint,
        disabled: true,
        name: "Redeem Point",
      },
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift
          .approveNotApproveVoucher,
        disabled: true,
        name: "Approve / Not Approve Voucher",
      },
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift
          .insertVoucher,
        disabled: true,
        name: "Insert Voucher",
      },
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift.soldVoucher,
        disabled: true,
        name: "Sold Voucher",
      },
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift
          .redeemVoucher,
        disabled: true,
        name: "Redeem Voucher",
      },
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift
          .complimentVoucher,
        disabled: true,
        name: "Compliment Voucher",
      },
      {
        code: $global.frontDeskAccessOrder.accessMemberVoucherGift
          .deleteVoucher,
        disabled: true,
        name: "Delete Voucher",
      },
    ],
    access_special: [
      {
        code: $global.frontDeskAccessOrder.accessSpecial.voidReservation,

        name: "Void Reservation",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.voidDeposit,

        name: "Void Deposit",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.correctDeposit,

        name: "Correct Deposit",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.overrideRateOrDiscount,

        name: "Override Rate/Discount",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.maxPercent,

        name: "Max Percent (%)",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.maxAmount,

        name: "Max Amount",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.modifyScheduleRate,

        name: "Modify Schedule Rate",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.modifyBreakdown,

        name: "Modify Breakdown",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.cancelCheckIn,

        name: "Cancel Check In",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.moveRoom,

        name: "Move Room",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.voidSubFolio,

        name: "Void Sub Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.correctSubFolio,

        name: "Correct Sub Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.cancelCheckOut,

        name: "Cancel Check Out",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.modifyExtraCharge,

        name: "Modify Extra Charge",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.unlockReservation,

        name: "Unlock Reservation",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.createMasterFolio,

        name: "Create Master Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.modifyClosedJournal,

        name: "Modify Closed Journal",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.complimentGuest,

        name: "Compliment Guest",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.houseUseGuest,

        name: "House Use Guest",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.transferToDeskFolio,

        name: "Transfer to Desk Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.transferToMasterFolio,

        name: "Transfer to Master Folio",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.businessSource,

        name: "Business Source",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.decreaseStay,

        name: "Decrease Stay",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial.updateInHouseGuestName,

        name: "Update In House Guest Name",
      },
      {
        code: $global.frontDeskAccessOrder.accessSpecial
          .checkInWithoutDepositReservation,

        name: "Check In Without Deposit Reservation",
      },
    ],
  };
  editData: any;

  handleSave() {}

  calculateDataForDisplay(data: any[]) {
    return calculateDataForDisplay(data, this.columnSize);
  }

  async getAccessForm(access: any) {
    if (!access) return;
    for (const i in access) {
      if (this.access.hasOwnProperty(i)) {
        if (
          i === "sa_max_discount_percent" ||
          i === "sa_max_discount_amount" ||
          i === "print_invoice_count" ||
          i === "code" ||
          i === "created_at" ||
          i === "created_by" ||
          i === "updated_at" ||
          i === "updated_by" ||
          i === "id"
        ) {
          this.access[i] = access[i];
          continue;
        }
        for (let x = 0; x < access[i].length; x++) {
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
