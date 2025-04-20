import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import BaseOccupancyAPI from "@/services/api/configuration/base-occupancy";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import configStore from "@/stores/config";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
const baseOccupancyAPI = new BaseOccupancyAPI;

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    CSelect,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
    CRadio,
  },
})
export default class BaseOccupancyAndSession extends Vue {
  private config = configStore();
  public rowData: any = [];
  public form: any = reactive({});
  public code: string = null;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public disableForm: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  labelAmount: any
  firstLabelAmount: any
  secondLabelAmount: any
  dynamicRateTypeCode: any
  roomRateCode: any
  focus: boolean = false
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  listDropdown = {};
  searchOptions: any = [];
  detailRowAutoHeight: boolean = true;

  folioNumber: any;
  global: any;
  selectedCode: any = {};
  subGroupCode: any = "";
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.firstLabelAmount = `${this.$t("labels.increase")}`
    this.secondLabelAmount = `${this.$t("labels.amount")}`
    this.labelAmount = this.firstLabelAmount + " " + this.secondLabelAmount
    this.form = {
      is_percent: 0,
      is_increase: 1,
    };
    setInputFocus()
  }

  async onChangeIncrease() {
    await this.$nextTick(() => {
      if (this.form.is_increase == 1) {
        this.firstLabelAmount = `${this.$t("labels.increase")}`
      } else {
        this.firstLabelAmount = `${this.$t("labels.decrease")}`
      }
      this.labelAmount = this.firstLabelAmount + " " + this.secondLabelAmount

    })
  }
  async onChangePercent() {
    await this.$nextTick(() => {
      if (this.form.is_percent == 1) {
        this.secondLabelAmount = `${this.$t("labels.percent")}`
      } else {
        this.secondLabelAmount = `${this.$t("labels.amount")}`
      }
      this.labelAmount = this.firstLabelAmount + " " + this.secondLabelAmount
    })
  }


  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  handleShowForm(typeCode: any, params: any, mode: any) {
    this.dynamicRateTypeCode = typeCode
    this.roomRateCode = params.code
    this.resetForm();

    this.modeData = mode;
    this.showForm = true;
  }

  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
  }

  async handleDuplicate(params: any) {
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
  }

  async handleSave() {
    this.isSaving = true;
    this.form.amount = parseFloat(this.form.amount);
    this.form.occ_from = parseInt(this.form.occ_from);
    this.form.occ_to = parseInt(this.form.occ_to);
    this.form.is_percent = parseInt(this.form.is_percent);
    this.form.is_increase = parseInt(this.form.is_increase);
    this.form.room_rate_code = this.roomRateCode
    if (this.modeData == $global.modeData.insert || this.modeData == $global.modeData.duplicate) {
      await this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(this.form);
    }
    this.isSaving = false;
  }

  onClose() {
    this.showForm = false;
    this.$emit("close");
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async editData(code: any) {
    try {
      let { data } = await baseOccupancyAPI.GetRoomRateBaseOccupancy(code);
      if (data) {
        data = data;
      } else {
        return;
      }
      await this.$nextTick(()=>{
        this.firstLabelAmount = data.is_increase == 1 ? `${this.$t("labels.increase")}` : `${this.$t("labels.decrease")}`
        this.secondLabelAmount = data.is_percent == 1 ? `${this.$t("labels.percent")}` : `${this.$t("labels.amount")}`
        this.labelAmount = this.firstLabelAmount + " " + this.secondLabelAmount
        this.roomRateCode = data.room_rate_code
      })
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }


  async updateData(form: any) {
    try {
      const { status2 } = await baseOccupancyAPI.UpdateRoomRateBaseOccupancy(form);
      if (status2.status == 0) {
        this.showForm = false;
        this.$emit("update");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(form: any) {
    try {
      const { status2 } = await baseOccupancyAPI.InsertRoomRateBaseOccupancy(form);
      if (status2.status == 0) {
        this.showForm = false;
        this.$emit("save");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required(),
      Amount: Yup.number().required().min(1),
      "Occupancy From": Yup.number().required().min(1),
      "Occupancy To": Yup.number().required().min(1),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.dynamicRateDetailInformation")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.dynamicRateDetailInformation")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.dynamicRateDetailInformation")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
