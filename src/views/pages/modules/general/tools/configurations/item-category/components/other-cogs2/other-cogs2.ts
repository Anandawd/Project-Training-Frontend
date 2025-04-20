import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
const resourceAPI = new ConfigurationResource("ItemCategoryOtherCOGS2");

@Options({
  components: {
    Form,
    CSelect,
  },
})
export default class ItemCategoryOtherCOGS2 extends Vue {
  public form: any = reactive({});
  public code: string;
  public otherCogs2Element: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public isSaving: boolean = false;
  public isUsed: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  Account: any = [];
  deleteCode: any = "";
  searchDefault: {
    index: number;
    text: string;
  } = null;
  listDropdown = {};
  searchOptions: any = [];

  columnOptionsAccount = [
    {
      label: "code",
      field: "code",
      align: "left",
      width: "100",
    },
    {
      label: "name",
      field: "name",
      align: "left",
      width: "120",
    },
  ];
  // GENERAL FUNCTION ================================================================

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  resetForm() {
    this.otherCogs2Element.resetForm();
    this.$nextTick();
    this.form = {
      category_code: this.code,
    };
  }

  onSubmit() {
    this.otherCogs2Element.$el.requestSubmit();
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
    await this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
  }

  async handleDuplicate(params: any) {
    await this.loadDropdown();
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

  async updateData(formData: any) {
    try {
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.$emit("save");
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
        "SubDepartment",
        "JournalAccountCosting",
      ]);
      this.listDropdown = data;
      this.Account = data.Account;
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {}

  mounted() {}
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
        `${this.$t("title.otherCogs2Account")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.otherCogs2Account")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.otherCogs2Account")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
