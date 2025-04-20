import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import BaseSessionAPI from "@/services/api/configuration/base-session";
import BaseOccupancyAPI from "@/services/api/configuration/base-occupancy";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import Breakdown from "../breakdown-table/breakdown-table.vue";
import BusinessSource from "../business-source-table/business-source-table.vue";
import BaseOccupancy from "../base-occupancy-table/base-occupancy-table.vue";
import BaseSession from "../base-session-table/base-session-table.vue";
import Currency from "../currency-table/currency-table.vue";
import { getToastSuccess } from "@/utils/toast";
import { getError } from "@/utils/general";
import CDialog from "@/components/dialog/dialog.vue";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("RoomRate");
const APIRoomRateBreakdown = new ConfigurationResource("RoomRateBreakdown");
const APIRoomRateBusiness = new ConfigurationResource("RoomRateBusinessSource");
const APIRoomRateCurrency = new ConfigurationResource("RoomRateCurrency");
const APIBaseOccupancy = new BaseOccupancyAPI
const APIBaseSession = new BaseSessionAPI

@Options({
  components: {
    Breakdown,
    BusinessSource,
    Currency,
    CDialog,
    BaseOccupancy,
    BaseSession
  },
  props: ["params"],
})
export default class DetailCellRenderer extends Vue {
  public params: any;
  public breakdownRowData: any = [];
  public businessSourceRowData: any = [];
  public currencyRowData: any = [];
  public baseOccupancyRowData: any = []
  public baseSessionRowData: any = []

  public businessSourceElement: any = ref();
  public breakdownElement: any = ref();
  public currencyElement: any = ref();
  public baseOccupancyElement: any = ref();
  public baseSessionElement: any = ref();

  public showDialogBreakdown: boolean = false;
  public showDialogBusiness: boolean = false;
  public showDialogCurrency: boolean = false;
  public showDialogBaseOccupancy: boolean = false;
  public showDialogBaseSession: boolean = false;

  public showTableOcc: boolean = false
  public showTableSess: boolean = false
  public code: any;
  deleteCode: any = "";
  activeTabMenu: any

  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onSelectedData(params: any) {
    console.log(params, "paramssss");
  }

  onInsertBreakdown() {
    this.params.context.componentParent.handleInsertDetail1(this.params.data);
  }

  onInsertBusinessSource() {
    this.params.context.componentParent.handleInsertDetail2(this.params.data);
  }

  onInsertCurrency() {
    this.params.context.componentParent.handleInsertDetail3(this.params.data);
  }

  onInsertBaseOccupancy() {
    this.params.context.componentParent.handleInsertDetailGroup("O", this.params.data);
  }

  onInsertBaseSession() {
    this.params.context.componentParent.handleInsertDetailGroup("S", this.params.data);
  }

  onEditBreakdown(params: any) {
    this.params.context.componentParent.handleEditBreakdown(params);
  }

  onEditBusiness(params: any) {
    this.params.context.componentParent.handleEditBusinessSource(params);
  }

  onEditCurrency(params: any) {
    this.params.context.componentParent.handleEditCurrency(params);
  }

  onEditBaseOccupancy(params: any) {
    this.params.context.componentParent.handleEditBaseOccupancy(params);
  }

  onEditBaseSession(params: any) {
    this.params.context.componentParent.handleEditBaseSession(params);
  }

  onDuplicateBreakdown(params: any) {
    this.params.context.componentParent.handleDuplicateBreakdown(params);
  }

  onDuplicateBusiness(params: any) {
    this.params.context.componentParent.handleDuplicateBusinessSource(params);
  }

  onDuplicateCurrency(params: any) {
    this.params.context.componentParent.handleDuplicateCurrency(params);
  }

  onDuplicateBaseOccupancy(params: any) {
    this.params.context.componentParent.handleDuplicateBaseOccupancy(params);
  }

  onDuplicateBaseSession(params: any) {
    this.params.context.componentParent.handleDuplicateBaseSession(params);
  }

  onDeleteBreakdown(params: any) {
    this.showDialogBreakdown = true;
    this.deleteCode = params.id;
  }
  onDeleteBusiness(params: any) {
    this.showDialogBusiness = true;
    this.deleteCode = params.id;
  }
  onDeleteCurrency(params: any) {
    this.showDialogCurrency = true;
    this.deleteCode = params.id;
  }
  onDeleteBaseOccupancy(params: any) {
    this.showDialogBaseOccupancy = true;
    this.deleteCode = params.id;
  }
  onDeleteBaseSession(params: any) {
    this.showDialogBaseSession = true;
    this.deleteCode = params.id;
  }
  handleTrackingData(params: any) {
    const trackingData = trackingDataModule();
    trackingData.show(params.tableName, params.id);
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDetailData(code: string) {
    this.params.context.componentParent.gridApi.showLoadingOverlay()
    this.code = code;
    try {
      const { data } = await resourceAPI.detailDataList("RoomRate", code);
      this.breakdownRowData = data.RoomRateBreakdown;
      this.businessSourceRowData = data.RoomRateBusinessSource;
      this.currencyRowData = data.RoomRateCurrency;
    } catch (error) {
      getError(error)
    }
    this.params.context.componentParent.gridApi.hideOverlay()
  }

  async loadBaseOccupancyList(code: string) {
    this.params.context.componentParent.gridApi.showLoadingOverlay()
    this.code = code;
    try {
      const { data } = await APIBaseOccupancy.GetRoomRateBaseOccupancyList(code);
      this.baseOccupancyRowData = data;
    } catch (error) {
      getError(error)
    }
    this.params.context.componentParent.gridApi.hideOverlay()
  }

  async loadBaseSessionList(code: string) {
    this.params.context.componentParent.gridApi.showLoadingOverlay()
    this.code = code;
    try {
      const { data } = await APIBaseSession.GetRoomRateBaseSessionList(code);
      this.baseSessionRowData = data;
    } catch (error) {
      getError(error)
    }
    this.params.context.componentParent.gridApi.hideOverlay()
  }

  async deleteDataBreakdown() {
    try {
      const { status2 } = await APIRoomRateBreakdown.delete(this.deleteCode);
      if (status2.status == 0) {
        await this.loadDetailData(this.code);
        this.showDialogBreakdown = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  async deleteDataBusiness() {
    try {
      const { status2 } = await APIRoomRateBusiness.delete(this.deleteCode);
      if (status2.status == 0) {
        await this.loadDetailData(this.code);
        this.showDialogBusiness = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteDataCurrency() {
    try {
      const { status2 } = await APIRoomRateCurrency.delete(this.deleteCode);
      if (status2.status == 0) {
        await this.loadDetailData(this.code);
        this.showDialogCurrency = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteDataBaseOccupancy() {
    try {
      const { status2 } = await APIBaseOccupancy.DeleteRoomRateBaseOccupancy(this.deleteCode);
      if (status2.status == 0) {
        await this.loadBaseOccupancyList(this.code);
        this.showDialogBaseOccupancy = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteDataBaseSession() {
    try {
      const { status2 } = await APIBaseSession.DeleteRoomRateBaseSession(this.deleteCode);
      if (status2.status == 0) {
        await this.loadBaseSessionList(this.code);
        this.showDialogBaseSession = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.loadDetailData(this.params.data.code);
  }

  async mounted() {
    await this.$nextTick(()=>{
      const DataMenu = this.params.data.dynamic_rate_type_code
      if (DataMenu.includes('S') && DataMenu.includes('O')) {
        this.loadBaseOccupancyList(this.params.data.code)
        this.loadBaseSessionList(this.params.data.code)
        this.showTableOcc = true
        this.showTableSess = true
      }else if (DataMenu.includes('S')){
        this.loadBaseSessionList(this.params.data.code)
        this.showTableOcc = false
        this.showTableSess = true
      }else if (DataMenu.includes('O')){
        this.loadBaseOccupancyList(this.params.data.code)
        this.showTableOcc = true
        this.showTableSess = false
      }else {
        this.showTableOcc = false
        this.showTableSess = false
      }
    })
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  // END GETTER AND SETTER ===========================================================
}
