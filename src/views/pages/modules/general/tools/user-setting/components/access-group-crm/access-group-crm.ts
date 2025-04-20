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
export default class AccessGroupCRM extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_special: [],
  };
  public accessList = {
    access_form: [
      {
        code: global.crmAccessOrder.accessForm.salesActivityDashboard,
        hidden: false,
        name: "General - Sales Activity Dashboard",
      },
      {
        code: global.crmAccessOrder.accessForm.salesActivity,
        hidden: false,
        name: "General - Sales Activity",
      },
      {
        code: global.crmAccessOrder.accessForm.proposalAndTaskCalendar,
        hidden: false,
        name: "General - Proposal and Task Calender",
      },
      {
        code: global.crmAccessOrder.accessForm.eventList,
        hidden: false,
        name: "General - Event List",
      },
      {
        code: global.crmAccessOrder.accessForm.activityLog,
        hidden: false,
        name: "General - Activity Log",
      },
      {
        code: global.crmAccessOrder.accessForm.phoneBook,
        hidden: false,
        name: "General - Phone Book",
      },
      {
        code: global.crmAccessOrder.accessForm.gift,
        hidden: true,
        name: "General - Gift",
      },
      {
        code: global.crmAccessOrder.accessForm.voucher,
        hidden: false,
        name: "General - Voucher",
      },
      {
        code: global.crmAccessOrder.accessForm.member,
        hidden: false,
        name: "General - Member",
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

  get isSubscribedHotel() {
    return this.auth.isSubscribedHotel;
  }

  get isSubscribedPOS() {
    return this.auth.isSubscribedPOS;
  }
}
