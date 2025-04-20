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
const userSettingAPI = new UserSettingAPI();

@Options({
  name: "access_group_tools",
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
export default class AccessGroupTools extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_configuration: [],
    access_company: [],
  };
  public accessList = {
    access_form: [
      { code: 11, name: "Configuration" },
      { code: 12, name: "Setting" },
      { code: 13, name: "User Setting" },
      { code: 14, name: "User Activity Log" },
    ],
    access_company: [
      {
        code: 0,

        name: "Insert",
      },
      {
        code: 0,

        name: "Update",
      },
      {
        code: 0,

        name: "Delete",
      },
      {
        code: 0,

        name: "AR Limit",
      },
      {
        code: 0,

        name: "AP Limit",
      },
      {
        code: 0,

        name: "Direct Bill",
      },
      {
        code: 0,

        name: "Business Source",
      },
    ],
    access_configuration: [
      {
        code: 0,

        name: "Department",
      },
      {
        code: 0,

        name: "Journal Account",
      },
      {
        code: 0,

        name: "Bank Account",
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
}
