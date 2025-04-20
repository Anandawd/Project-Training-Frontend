import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import OtherCogs from "../other-cogs-table/other-cogs-table.vue";
import OtherCogs2 from "../other-cogs2-table/other-cogs2-table.vue";
import OtherExpense from "../other-expense-table/other-expense-table.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { getToastSuccess } from "@/utils/toast";
import { getError } from "@/utils/general";
const resourceAPI = new ConfigurationResource("ItemCategory");
const OtherCogsAPI = new ConfigurationResource("ItemCategoryOtherCOGS");
const OtherCogs2API = new ConfigurationResource("ItemCategoryOtherCOGS2");
const OtherExpenseAPI = new ConfigurationResource("ItemCategoryOtherExpense");

@Options({
  components: {
    OtherCogs,
    OtherCogs2,
    OtherExpense,
    CDialog,
  },
  props: ["params"],
})
export default class DetailCellRenderer extends Vue {
  public params: any;
  public otherCogsRowData: any = [];
  public otherCogs2RowData: any = [];
  public otherExpenseRowData: any = [];
  public otherCogsElement: any = ref();
  public otherCogs2Element: any = ref();
  public otherExpenseElement: any = ref();
  deleteCode: any = "";
  public code: any;
  public showDialogCogs: boolean = false;
  public showDialogCogs2: boolean = false;
  public showDialogExpense: boolean = false;

  onEditOtherCogs(params: any) {
    this.params.context.componentParent.handleEditOtherCogs(params);
  }
  onEditOtherCogs2(params: any) {
    this.params.context.componentParent.handleEditOtherCogs2(params);
  }
  onEditOtherExpense(params: any) {
    this.params.context.componentParent.handleEditOtherExpense(params);
  }

  onDeleteOtherCogs(params: any) {
    this.showDialogCogs = true;
    this.deleteCode = params.id;
  }
  onDeleteOtherCogs2(params: any) {
    this.showDialogCogs2 = true;
    this.deleteCode = params.id;
  }
  onDeleteOtherExpense(params: any) {
    this.showDialogExpense = true;
    this.deleteCode = params.id;
  }

 async mounted(){
    await this.loadDetailData(this.params.data.code);
  }

  async loadDetailData(code: string) {
    this.code = code;
    this.params.context.componentParent.gridApi.showLoadingOverlay()
    try {
      const { data } = await resourceAPI.detailDataList("ItemCategory", code);
      this.otherCogsRowData = data.ItemCategoryOtherCOGS;
      this.otherCogs2RowData = data.ItemCategoryOtherCOGS2;
      this.otherExpenseRowData = data.ItemCategoryOtherExpense;
    } catch (error) { 
      getError(error)
    }
    this.params.context.componentParent.gridApi.hideOverlay()
  }

  async deleteDataCogs() {
    try {
      const { status2 } = await OtherCogsAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadDetailData(this.code);
        this.showDialogCogs = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteDataCogs2() {
    try {
      const { status2 } = await OtherCogs2API.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadDetailData(this.code);
        this.showDialogCogs2 = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteDataExpense() {
    try {
      const { status2 } = await OtherExpenseAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadDetailData(this.code);
        this.showDialogExpense = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
}
