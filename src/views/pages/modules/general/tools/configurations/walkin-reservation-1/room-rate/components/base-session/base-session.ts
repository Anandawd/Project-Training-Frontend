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
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import BaseSessionAPI from "@/services/api/configuration/base-session";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import configStore from "@/stores/config";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { formatDateTimeUTC, formatDateTimeZeroUTC } from "@/utils/format";

const baseSessionAPI = new BaseSessionAPI;

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class BaseSessionAndSession extends Vue {
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
  defaultRate: any
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
  onChangeStartDate() {
    let from = formatDateTimeZeroUTC(this.form.start_date);
    let to = formatDateTimeZeroUTC(this.form.end_date);
    let startDate = new Date(from);
    let endDate = new Date(to);
    if (startDate > endDate) {
      this.form.end_date = this.form.start_date;
    }
  }
  onChangeEndDate() {
    let from = formatDateTimeZeroUTC(this.form.start_date);
    let to = formatDateTimeZeroUTC(this.form.end_date);
    let startDate = new Date(from);
    let endDate = new Date(to);
    if (endDate < startDate) {
      this.form.start_date = this.form.end_date;
    }
  }
  onChangeIsDefault(){
    this.form.amount = this.form.is_default == 1 ? this.defaultRate : 0;
    this.disableForm = this.form.is_default == 1 ? true : false;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    let date = new Date();
    const y = date.getFullYear(), m = date.getMonth();
    const to = new Date(y, m + 1, 0);
    this.form = {
      start_date: formatDateTimeZeroUTC(date),
      end_date: formatDateTimeZeroUTC(to),
      amount: 0,
      is_default: 0
    };
    setInputFocus()
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  handleShowForm(typeCode: any, params: any, mode: any) {
    this.defaultRate = params.weekday_rate1
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
    const formData = {
      amount: parseFloat(this.form.amount),
      start_date : formatDateTimeUTC(this.form.start_date),
      end_date : formatDateTimeUTC(this.form.end_date),
      code : this.roomRateCode,
    }
    if (this.modeData == $global.modeData.insert || this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    }
    this.isSaving = false;
  }

  onClose() {
    this.showForm = false;
    this.$emit("close");
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async editData(id: any) {
    try {
      let { data } = await baseSessionAPI.GetRoomRateBaseSession(id);
      if (data) {
        data = data;
      } else {
        return;
      }
      this.form = data;
      this.form.start_date = formatDateTimeZeroUTC(this.form.from_date)
      this.form.end_date = formatDateTimeZeroUTC(this.form.to_date)
      this.roomRateCode = data.room_rate_code
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }


  async updateData(form: any) {
    try {
      const { status2 } = await baseSessionAPI.UpdateRoomRateBaseSession(form);
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
      const { status2 } = await baseSessionAPI.InsertRoomRateBaseSession(form);
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
      Amount: Yup.number().required().min(1),
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
