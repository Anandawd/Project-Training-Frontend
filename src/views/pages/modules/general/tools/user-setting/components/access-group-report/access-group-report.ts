import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import global from "@/utils/global";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import authModule from "@/stores/auth";
import UserSettingAPI from "@/services/api/general/user-setting";
import { onSelectContextMenu } from "@/utils/context-menu";
import { calculateDataForDisplay } from "@/utils/general";
const userSettingAPI = new UserSettingAPI();

@Options({
  name: "access_group_report",
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
export default class AccessGroupReport extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_fo_report: [],
    access_pos_report: [],
    access_ban_report: [],
    access_acc_report: [],
    access_ast_report: [],
    access_preview_report: [],
  };
  public accessList: any = {
    access_preview_report: [
      {
        code: global.reportAccessOrder.accessPreviewReport.editReport,
        name: "Edit Report",
      },
      {
        code: global.reportAccessOrder.accessPreviewReport.exportReport,
        name: "Export Report",
      },
      {
        code: global.reportAccessOrder.accessPreviewReport.customizeReport,
        name: "Customize Report",
      },
    ],
    access_form: [
      {
        code: global.reportAccessOrder.accessForm.cashierReport,
        name: "Cashier Report",
      },
      {
        code: global.reportAccessOrder.accessForm.frontDeskReport,
        name: "Report - Front Desk",
      },
      {
        code: global.reportAccessOrder.accessForm.pointOfSalesReport,
        name: "Report - Point of Sales",
      },
      {
        code: global.reportAccessOrder.accessForm.banquetReport,
        name: "Report - Banquet",
      },
      {
        code: global.reportAccessOrder.accessForm.accountingReport,
        name: "Report - Accounting",
      },
      {
        code: global.reportAccessOrder.accessForm.inventoryAssetReport,
        name: "Report - Inventory & Asset",
      },
    ],
  };
  public reports: any = [];

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

  async getAccessReportList() {
    try {
      const { data } = await userSettingAPI.getAccessReportList();
      this.accessList.access_fo_report = data.hotel;
      this.accessList.access_pos_report = data.point_of_sales;
      this.accessList.access_ban_report = data.banquet;
      this.accessList.access_acc_report = data.accounting;
      this.accessList.access_ast_report = data.asset;
      this.reports = data;
    } catch (err) {}
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

  beforeMount(): void {
    this.getAccessReportList();
  }
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
