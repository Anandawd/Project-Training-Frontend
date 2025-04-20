import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import MultiUom from "../multi-uom-table/multi-uom-table.vue";
import { getToastSuccess } from "@/utils/toast";
import { getError } from "@/utils/general";
import CDialog from "@/components/dialog/dialog.vue";
const resourceAPI = new ConfigurationResource("Item");
const APIItem = new ConfigurationResource("ItemUom");

@Options({
  components: {
    MultiUom,
    CDialog,
  },
  props: ["params"],
})
export default class DetailCellRenderer extends Vue {
  public params: any;
  public multiUomRowData: any = [];
  public multiUomElement: any = ref();
  public showDialog: boolean = false;
  public code: any;
  deleteCode: any = "";

  beforeMount() {
    this.loadDetailData(this.params.data.code);
  }

  onEditUom(params: any) {
    this.params.context.componentParent.handleEditUom(params);
  }

  onInsertUom() {
    this.params.context.componentParent.handleInsertDetail1(this.params.data);
  }

  onDeleteUom(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  async loadDetailData(code: string) {
    this.params.context.componentParent.gridApi.showLoadingOverlay()
    try {
      const { data } = await resourceAPI.detailDataList("Item", code);
      this.multiUomRowData = data.ItemUOM;
    } catch (error) {
      getError(error)
     }
    this.params.context.componentParent.gridApi.hideOverlay()
  }

  async deleteData() {
    try {
      const { status2 } = await APIItem.delete(this.deleteCode);
      if (status2.status == 0) {
        await this.loadDetailData(this.code);
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
}
