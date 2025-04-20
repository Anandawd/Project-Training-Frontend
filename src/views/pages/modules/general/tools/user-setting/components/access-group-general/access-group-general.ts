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
  name: "access_group_general",
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
export default class AccessGroupGeneral extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_report: [],
    access_pos_report: [],
    access_ban_report: [],
    access_acc_report: [],
    access_ast_report: [],
    access_preview_report: [],
    access_module: [],
    access_configuration: [],
    access_company: [],
  };
  public accessList: any = {
    access_module: [
      { id: 0, sort: 0, code: "H", name: "Hotel System" },
      { id: 1, sort: 2, code: "P", name: "Point of Sales System" },
      { id: 2, sort: 3, code: "B", name: "Banquet System" },
      { id: 3, sort: 4, code: "A", name: "Accounting System" },
      { id: 4, sort: 5, code: "I", name: "Assets System" },
      { id: 5, sort: 6, code: "R", name: "Report" },
      { id: 6, sort: 7, code: "T", name: "Tools" },
      { id: 7, sort: 1, code: "C", name: "Customer Relationship Management" },
    ],
  };

  public reports: any = [];
  editData: any;

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
