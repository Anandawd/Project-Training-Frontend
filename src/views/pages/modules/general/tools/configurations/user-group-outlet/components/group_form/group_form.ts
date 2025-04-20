import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";

// import * as Yup from "yup";

@Options({
  name: "GroupForm",
  components: {
    Form,
    CSelect,
    CInput,
  },
  props: {
    formType: {
      type: String,
      default: "",
      require: true,
    },
    modeData: {
      type: Number,
      require: true,
    },
    schema: {
      type: Object,
      require: true,
    },
    defaultForm: {
      type: Object,
      require: false,
    },
    isSaving: {
      type: Boolean,
    },
  },
  emits: ["save", "close"],
})
export default class GroupForm extends Vue {
  groupFormElement: any = ref();
  modeData: any;
  public defaultForm: any = {};
  public form: any = reactive({});
  listDropdown: any = {};
  isSaving: boolean;
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async resetForm() {
    this.groupFormElement.resetForm();
    this.$nextTick();
    this.form = {};
    if (this.defaultForm != 0) {
      this.form = this.defaultForm;
    }
  }

  initialize() {
    this.resetForm();
  }

  onEdit(data: any) {
    this.form = data;
  }

  onSubmit() {
    this.groupFormElement.$el.requestSubmit();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  repeatLoadDropdownList(){
    this.$emit("repeatLoadDropdown")
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  // //Validation
  // get schema() {
  //   return Yup.object().shape({
  //     "User Group": Yup.string().required(),
  //   });
  // }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
