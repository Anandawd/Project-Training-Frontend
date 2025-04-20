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
import $global from "@/utils/global";
import { Form } from "vee-validate";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
const resourceAPI = new ConfigurationResource("ItemCategoryOtherCOGS");

@Options({
  components: {
    Form,
    CSelect,
  },
})
export default class ItemCategoryOtherCOGS extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public code: string = null;
  public otherCogsElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public isUsed: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  listDropdown = {};
  public isSaving: boolean = false;
  // GENERAL FUNCTION ================================================================

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  resetForm() {
    this.otherCogsElement.resetForm();
    this.$nextTick();
    this.form = {
      category_code: this.code,
    };
  }

  onSubmit() {
    this.otherCogsElement.$el.requestSubmit();
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
    this.modeData = $global.modeData.edit;
    this.loadDropdown();
    await this.editData(params.id);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
  }

  async handleSave() {
    this.isSaving = true;
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(this.form);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(this.form);
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
    let loader = this.$loading.show();
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
    loader.hide();
  }

  async updateData(form: any) {
    try {
      const { status2 } = await resourceAPI.update(form);
      if (status2.status == 0) {
        this.$emit("save");
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(form: any) {
    try {
      const { status2 } = await resourceAPI.create(form);
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
      const params = ["SubDepartment", "JournalAccountCosting"];
      const { data } = await resourceAPI.codeNameListArray(params);
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
  get schema() {
    return Yup.object().shape({
      "Sub Department": Yup.string().required(),
      "COGS Account": Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.otherCogsAccount")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.otherCogsAccount")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.otherCogsAccount")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
