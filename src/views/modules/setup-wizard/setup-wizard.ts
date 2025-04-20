import { Options, Vue } from "vue-class-component";
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import RoomType from "./components/room-type/room-type.vue";
import BedType from "./components/bed-type/bed-type.vue";
import Room from "./components/room/room.vue";
// import RoomView from "./components/room-view/room-view.vue";
import TaxAndService from "./components/tax-and-service/tax-and-service.vue";
import RoomRate from "./components/room-rate/room-rate.vue";
import FormatAndSetting from "./components/format-and-setting/format-and-setting.vue";
import WizardFinishSetupAPI from "@/services/api/wizard/finish";
import PropertyInformation from "./components/property-information/property-information.vue";
import { getError } from "@/utils/general";
import CDialog from "@/components/dialog/dialog.vue";
import { getToastError, getToastSuccess } from "@/utils/toast";
import configStore from "@/stores/config";
const wizardFinishSetupAPI = new WizardFinishSetupAPI();

@Options({
  components: {
    FormWizard,
    TabContent,
    CInput,
    CRadio,
    CModal,
    AgGridVue,
    BedType,
    RoomType,
    Room,
    CDialog,
    // RoomView,
    TaxAndService,
    RoomRate,
    PropertyInformation,
    FormatAndSetting,
  },
})
export default class SetupWizard extends Vue {
  config = configStore();
  form: any = {};
  formatSettingElement: any = null;
  propertyInformationElement: any = null;
  taxAndServiceElement: any = null;
  wizardEl: any = null;
  roomEl: any = null;
  roomRateEl: any = null;
  bedTypeEl: any = null;
  roomTypeEl: any = null;
  // roomViewEl: any = null;

  roomList: any[] = [];
  roomRateList: any[] = [];
  bedTypeList: any[] = [];
  roomTypeList: any[] = [];
  // roomViewList: any[] = [];
  taxAndServiceForm: any = null;
  activeTabIndex: number = 0;
  configOption: string = "2";
  showConfigWizard: boolean = false;
  showConfirm: boolean = false;
  showFinish: boolean = false;

  onNextFormatSetting() {
    this.formatSettingElement.handleSave();
    return true;
  }

  async onNextPropertyInformation(): Promise<Boolean> {
    const valid = await this.propertyInformationElement.handleSave();
    return valid;
  }

  onNextRoomType() {
    const valid = this.roomTypeEl.rowData.length > 0;
    if (!valid) {
      getToastError("Please insert room type");
    }
    return valid;
  }

  onNextBedType() {
    const valid = this.bedTypeEl.rowData.length > 0;
    if (!valid) {
      getToastError("Please insert bed type");
    }
    return valid;
  }

  // onNextRoomView() {
  //   const valid = this.roomViewEl.rowData.length > 0;
  //   if (!valid) {
  //     getToastError("Please insert room view");
  //   }
  //   return valid;
  // }

  onNextRoom() {
    const valid = this.roomEl.rowData.length > 0;
    if (!valid) {
      getToastError("Please insert room");
    }
    return valid;
  }

  async onNextTaxService() {
    await this.taxAndServiceElement.handleSave();
    const valid = this.taxAndServiceElement.form.code != "";
    if (!valid) {
      getToastError("Please insert tax & service");
    }
    return valid;
  }

  onNextRoomRate() {
    const valid = this.roomRateEl.rowData.length > 0;
    if (!valid) {
      getToastError("Please insert room rate");
    }
    return valid;
  }

  onNextConfiguration() {
    const options = localStorage.getItem("wizard_data_option");
    if (options && options == this.configOption) {
      return true;
    }
    localStorage.setItem("wizard_data_option", this.configOption);
    localStorage.setItem("wizard_step", "5");
    window.location.reload();
  }

  onValidate(validationResult: any, tab: any) {
    console.log(validationResult, tab);
  }

  onChange(prev: any, next: any) {
    this.activeTabIndex = next;
    localStorage.setItem("wizard_step", next);
    console.log("next", next);
  }

  onFinish() {
    this.showConfirm = true;
  }

  async onComplete() {
    if (this.showFinish) return;
    const loading = this.$loading.show();
    try {
      this.showConfirm = false;
      this.showFinish = true;
      await wizardFinishSetupAPI.Finish(this.configOption);
      await this.config.getConfigurations();
      getToastSuccess();

      localStorage.removeItem("wizard_step");
      location.reload();
    } catch (error) {
      getError(error);
    }
    loading.hide();
  }

  onChangeRoomType(value: any) {
    this.roomTypeList = value;
  }

  onChangeBedType(value: any) {
    this.bedTypeList = value;
  }

  // onChangeRoomView(value: any) {
  //   this.roomViewList = value;
  // }

  onChangeRoom(value: any) {
    this.roomList = value;
  }

  onChangeTaxAndService(value: any) {
    this.taxAndServiceForm = value;
  }

  onChangeRoomRate(value: any) {
    this.roomRateList = value;
  }

  beforeMount(): void {
    let step = localStorage.getItem("wizard_step") || "0";
    const wizData = localStorage.getItem("wizard_data_option");
    this.showConfigWizard = wizData == "1";
    if (wizData) {
      this.configOption = wizData;
    }
    this.activeTabIndex = parseInt(step);
  }

  mounted(): void {
    if (this.activeTabIndex > 0) {
      this.wizardEl.changeTab(0, this.activeTabIndex);
    }
  }
}
