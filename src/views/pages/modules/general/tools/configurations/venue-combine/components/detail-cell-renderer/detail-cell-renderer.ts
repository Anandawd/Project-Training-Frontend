import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import VenueDetail from "../venue-detail-table/venue-detail-table.vue";
import { getError } from "@/utils/general";
const resourceAPI = new ConfigurationResource("VenueCombine");

@Options({
  components: {
    VenueDetail
  },
  props: ['params']
})

export default class DetailCellRenderer extends Vue {
  public params: any;
  public venueDetailRowData: any = [];
  public venueDetailElement: any = ref();
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDetailData(code: string) {
    this.params.context.componentParent.gridApi.showLoadingOverlay()
    try {
      const { data } = await resourceAPI.detailDataList('VenueCombine', code);
      this.venueDetailRowData = data.VenueCombineDetail;
    } catch (error) {
      getError(error);
    }
    this.params.context.componentParent.gridApi.hideOverlay()
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.loadDetailData(this.params.data.code);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  // END GETTER AND SETTER ===========================================================



}