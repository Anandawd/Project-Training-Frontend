import { Options, Vue } from "vue-class-component";
import "ag-grid-enterprise";
import { getError } from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
const resourceAPI = new ConfigurationResource("RoomRateBusinessSource");

@Options({
  components: {
    Form,
    CSelect,
    CInput,
  },
})
export default class BusinessSource extends Vue {
  public form: any = reactive({});
  public code: string;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  focus : boolean = false
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  listDropdown = {};
  searchOptions: any = [];
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  onClose() {
    this.showForm = false;
    this.$emit("close");
  }
  
  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      commission_type_code: "",
      commission_value: 0,
      company_code: "",
      room_rate_code: this.code,
    };
    setInputFocus()
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  handleShowForm(params: any, mode: any) {
    this.resetForm();
    this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  async handleEdit(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
  }

  async handleSave() {
    this.isSaving = true;
    this.form.commission_value = parseFloat(this.form.commission_value);
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(this.form);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(this.form);
    }
    this.isSaving = false;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.$emit("update");
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.$emit("save");
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const { data } = await resourceAPI.codeNameListArray([
        "BusinessSource",
        "CommissionType",
      ]);
      this.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================

  //Validation
  get schemaBusiness() {
    return Yup.object().shape({
      "Business Source": Yup.string().required(),
      "Commission Type": Yup.string().required(),
      "Commission Value": Yup.number().required(),
    });
  }
  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.businessSourceAndAP")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.businessSourceAndAP")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.businessSourceAndAP")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
