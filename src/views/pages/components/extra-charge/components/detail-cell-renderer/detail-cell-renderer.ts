import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import BreakdownTable from "../breakdown-table/breakdown-table.vue";
import { getError } from "@/utils/general";
import CDialog from "@/components/dialog/dialog.vue";
import ExtraChargeAPI from "@/services/api/hotel/reservation/extra-charge";
import { getToastSuccess } from "@/utils/toast";
const extraChargeAPI = new ExtraChargeAPI();

@Options({
  components: {
    BreakdownTable,
    CDialog,
  },
  props: ["params"],
})
export default class DetailCellRenderer extends Vue {
  public params: any;
  public breakdownRowData: any = [];
  public breakdownElement: any = ref();
  public showDialogBreakdown: boolean = false;
  public isReservation : boolean
  public code: any;
  deleteCode: any = "";
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onEditBreakdown(params: any) {
    this.params.context.componentParent.handleEditBreakdown(params);
  }

  onDuplicateBreakdown(params: any) {
    this.params.context.componentParent.handleDuplicateBreakdown(params);
  }

  onDeleteBreakdown(params: any) {
    this.showDialogBreakdown = true;
    this.deleteCode = params.id;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDetailData(code: string) {
    this.breakdownElement.gridApi.showLoadingOverlay()
    this.code = code;
    try {
      const { data } = this.isReservation ? await extraChargeAPI.GetExtraChargeBreakdownReservationList(code) : await extraChargeAPI.GetExtraChargeBreakdownInHouseList(code)
      this.breakdownRowData = data;
    } catch (error) {
      getError(error)
    }
    this.breakdownElement.gridApi.hideOverlay()
  }

  async deleteDataBreakdown() {
    try {
      const { status2 } = this.isReservation ? await extraChargeAPI.DeleteExtraChargeBreakdownReservation(this.deleteCode) : await extraChargeAPI.DeleteExtraChargeBreakdownInHouse(this.deleteCode)
      if (status2.status == 0) {
        this.loadDetailData(this.code);
        this.showDialogBreakdown = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  mounted() {
    this.isReservation = this.params.context.componentParent.isReservation
    this.loadDetailData(this.params.data.id);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  // END GETTER AND SETTER ===========================================================
}
