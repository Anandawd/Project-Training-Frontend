import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { computed, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import Breakdown from "../breakdown-table/breakdown-table.vue";
import BusinessSource from "../business-source-table/business-source-table.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { getToastSuccess } from "@/utils/toast";
import { getError } from "@/utils/general";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Package");
const APIPackageBusiness = new ConfigurationResource("PackageBusinessSource");

@Options({
  components: {
    Breakdown,
    BusinessSource,
    CDialog,
  },
  props: ["params"],
})
export default class DetailCellRenderer extends Vue {
  public isSave: boolean;
  public params: any;
  public breakdownRowData: any = [];
  public businessSourceRowData: any = [];
  public businessSourceElement: any = ref();
  public breakdownElement: any = ref();
  deleteCode: any = "";
  public code: any;
  public showDialog: boolean = false;

  mounted() {
    // this.loadDetailData()
    this.breakdownElement.code = this.params.data.code;
    this.breakdownElement.loadData(this.params.data.code);
    this.businessSourceElement.code = this.params.data.code;
    this.businessSourceElement.loadData(this.params.data.code);
  }

  onInsertBreakdown(){
    this.params.context.componentParent.handleInsertDetail1(this.params.data);
  }

  onInsertBusinessSource(){
    this.params.context.componentParent.handleInsertDetail2(this.params.data);
  }

  onEditBusinessSource(params: any) {
    this.params.context.componentParent.handleEditBusiness(params);
  }

  onEditBreakdown(params: any) {
    this.params.context.componentParent.handleEditBreakdown(params);
  }

  onDuplicateBusinessSource(params: any) {
    this.params.context.componentParent.handleDuplicateBusiness(params);
  }

  onDuplicateBreakdown(params: any) {
    this.params.context.componentParent.handleDuplicateBreakdown(params);
  }

  onDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  onDeleteBreakdown(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  handleTrackingData(params: any){
    const trackingData = trackingDataModule();
    trackingData.show(params.tableName, params.id);
  }

  async deleteData() {
    try {
      const { status2 } = await APIPackageBusiness.delete(this.deleteCode);
      if (status2.status == 0) {
        // await this.loadDetailData(this.code);
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
}
