import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";

import { ref } from "vue";

@Options({
  name: "BarcodeForm",
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
  emits: ["enter", "close"],
})
export default class BarcodeForm extends Vue {
  barcodeFormElement: any = ref();
  modeData: any;
  listDropdown: any = {};
  public defaultForm: any = {};
  public form: any = {};
  isSaving: boolean;
  async resetForm() {
    this.barcodeFormElement.resetForm();
    await this.$nextTick();
    if (this.defaultForm != 0) {
      this.form = this.defaultForm;
    }
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.barcodeFormElement.$el.requestSubmit();
  }

  onClose() {
    this.$emit("close");
  }

  onEnter() {
    this.$emit("enter", this.form);
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }
}
