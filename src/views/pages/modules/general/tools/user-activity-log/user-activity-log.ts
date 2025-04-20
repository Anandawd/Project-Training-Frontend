import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import { ref } from "vue";
import { BTabs, BTab } from "bootstrap-vue-3";
import { getError } from "@/utils/general";
import UserLogGrid from "./components/user-log/user-log.vue";
import SpecialAccessLogGrid from "./components/special-access-log/special-access-log.vue";
import KeylockLogGrid from "./components/keylock-log/keylock-log.vue";
import TableLogGrid from "./components/table-log/table-log.vue";
import UserActivityLogAPI from "@/services/api/general/user-activity-log";
const userActivityLogAPI = new UserActivityLogAPI();

@Options({
  name: "user-activity-log",
  components: {
    AgGridVue,
    BTabs,
    BTab,
    SpecialAccessLogGrid,
    KeylockLogGrid,
    TableLogGrid,
    UserLogGrid,
  },
})
export default class UserActivityLog extends Vue {
  userLogElement: any = ref({});
  specialAccessLogElement: any = ref({});
  keylockLogElement: any = ref({});
  tableLogElement: any = ref({});
  public tabIndex: any = 0;
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDropdown() {
    try {
      const { data } = await userActivityLogAPI.getLogComboList();
      this.userLogElement.filterComboList = data;
      this.specialAccessLogElement.filterComboList = data;
      this.keylockLogElement.filterComboList = data;
      this.tableLogElement.filterComboList = data;
    } catch (error: any) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.loadDropdown();
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  // VALIDATION ======================================================================
  // END GETTER AND SETTER ===========================================================
}
