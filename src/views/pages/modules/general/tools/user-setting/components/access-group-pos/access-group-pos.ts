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
import UserSettingAPI from "@/services/api/general/user-setting";
import { onSelectContextMenu } from "@/utils/context-menu";
import { calculateDataForDisplay } from "@/utils/general";
import global from "@/utils/global";
const userSettingAPI = new UserSettingAPI();

@Options({
  name: "access_group_pos",
  components: {
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
export default class AccessGroupPOS extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_special: [],
    access_transaction_terminal: [],
    access_table_view: [],
  };
  public accessList = {
    access_form: [
      {
        code: global.pointOfSalesAccessOrder.accessForm.customer,
        hidden: true,
        name: "General - Customer",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.reservation,
        hidden: true,
        name: "General - Reservation",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.calendar,
        hidden: true,
        name: "General - Calendar",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.transactionTerminal,
        name: "General - Transaction Terminal",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.tableView,
        name: "General - Table View",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.spaRoomView,
        hidden: true,
        name: "General - SPA Room View",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.iptvMenuOrder,
        hidden: true,
        name: "General - IPTV Menu Order",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.closedTransaction,
        name: "General - Closed Transaction",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.breakfastControl,
        name: "General - Breakfast Control",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.foodAndBeverageBudget,
        hidden: true,
        name: "General - Food and Beverage Budget",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.dayendClose,
        hidden: true,
        name: "General - Dayend Close",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.deskFolio,
        hidden: true,
        name: "General - Desk Folio",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.folioHistory,
        hidden: true,
        name: "General - Folio History",
      },
      {
        code: global.pointOfSalesAccessOrder.accessForm.transaction,
        hidden: true,
        name: "Transaction",
      },
    ],
    access_special: [
      {
        name: "Discount",
        code: global.pointOfSalesAccessOrder.accessSpecial.discount,
      },
      {
        name: "Override Price",
        code: global.pointOfSalesAccessOrder.accessSpecial.overridePrice,
      },
      {
        name: "Modify Price",
        code: global.pointOfSalesAccessOrder.accessSpecial.modifyPrice,
      },
      {
        name: "Void Check",
        code: global.pointOfSalesAccessOrder.accessSpecial.voidCheck,
      },
      {
        name: "Remove Item",
        code: global.pointOfSalesAccessOrder.accessSpecial.removeItem,
      },
      {
        name: "Cancel C.O",
        code: global.pointOfSalesAccessOrder.accessSpecial.cancelCO,
      },
      {
        name: "Void Reservation",
        code: global.pointOfSalesAccessOrder.accessSpecial.voidReservation,
      },
      {
        name: "Transfer to Desk Folio",
        code: global.pointOfSalesAccessOrder.accessSpecial.transferToDeskFolio,
      },
      {
        name: "Transfer to Master Folio",
        code: global.pointOfSalesAccessOrder.accessSpecial
          .transferToMasterFolio,
      },
      {
        name: "Reduce Quantity",
        code: global.pointOfSalesAccessOrder.accessSpecial.reduceQuantity,
      },
      {
        name: "Special Item",
        code: global.pointOfSalesAccessOrder.accessSpecial.addSpecialItem,
      },
    ],
    access_transaction_terminal: [
      {
        name: "Change Quantity",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .changeQuantity,
      },
      {
        name: "Discount",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal.discount,
      },
      {
        name: "Override Price",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .overridePrice,
      },
      {
        name: "Payment",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal.payment,
      },
      {
        name: "Modify Price",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .modifyPrice,
      },
      {
        name: "Remove Item",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .removeItem,
      },
      {
        name: "Finish Sale",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .finishSale,
      },
      {
        name: "Cancel C.O",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal.cancelCO,
      },
      {
        name: "Add Special Item",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .addSpecialItem,
      },
      {
        name: "Show Other Outlet",
        code: global.pointOfSalesAccessOrder.accessTransactionTerminal
          .showOtherOutlet,
      },
    ],
    access_table_view: [
      {
        name: "Transfer",
        code: global.pointOfSalesAccessOrder.accessTableView.transfer,
      },
      {
        name: "Tile Table",
        code: global.pointOfSalesAccessOrder.accessTableView.tileTable,
      },
      {
        name: "Save Position",
        code: global.pointOfSalesAccessOrder.accessTableView.savePosition,
      },
      {
        name: "Admin Mode",
        code: global.pointOfSalesAccessOrder.accessTableView.adminMode,
      },
      {
        name: "Take Away Order",
        code: global.pointOfSalesAccessOrder.accessTableView.takeAwayOrder,
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

  // findModelIndex() {}

  getModelIndex(data: any, columnIndex: number, currentIndex: number) {
    const rowCount = Math.ceil(data.length / this.columnSize);
    return rowCount * columnIndex + currentIndex;
  }

  onContextMenu(e: MouseEvent, access: number[], list: any) {
    onSelectContextMenu(this, e, access, list);
  }

  // API CALL=============================================================================
  // END API CALL=========================================================================

  beforeMount(): void {}
  mounted(): void {
    let accessForm = this.accessList.access_form;
    for (const i in accessForm) {
      if (
        accessForm[i].code ==
          global.pointOfSalesAccessOrder.accessForm.dayendClose ||
        accessForm[i].code ==
          global.pointOfSalesAccessOrder.accessForm.deskFolio ||
        accessForm[i].code ==
          global.pointOfSalesAccessOrder.accessForm.folioHistory ||
        accessForm[i].code ==
          global.pointOfSalesAccessOrder.accessForm.transaction
      ) {
        accessForm[i].hidden = this.isSubscribedHotel;
      }
    }
  }

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

  get isSubscribedHotel() {
    return this.auth.isSubscribedHotel;
  }

  get isSubscribedPOS() {
    return this.auth.isSubscribedPOS;
  }
}
