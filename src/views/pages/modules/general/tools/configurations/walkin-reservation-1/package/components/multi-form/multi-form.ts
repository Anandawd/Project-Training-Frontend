import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import configStore from "@/stores/config";

import { reactive, ref } from "vue";

@Options({
  name: "MultiForm",
  components: {
    // BusinessSource,
    // Breakdown,
    BCardText,
    BCard,
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
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
export default class MultiForm extends Vue {
  private config = configStore();
  multiFormElement: any = ref();
  breakdownElement: any = ref();
  businessSourceElement: any = ref();
  modeData: any;
  disableForm: boolean = false;
  focus: boolean = false
  public defaultForm: any = {};
  public form: any = reactive({});
  isSaving: boolean;

  listDropdown: any = {};

  async resetForm() {
    this.multiFormElement.resetForm();
    await this.$nextTick();
    this.form = {
      quantity: 1,
      is_active: 1,
      show_in_transaction: 1,
      max_pax: 1,
      charge_frequency_code: "1",
      sub_department_code: this.sdFrontOffice,
    };
    setInputFocus()
  }
  
  initialize() {
    this.resetForm();
  }

  onEdit(data: any) {
    this.form = data;
  }

  onSubmit() {
    this.multiFormElement.$el.requestSubmit();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onChangePerPax() {
    this.form.max_pax = 1;
    if (this.form.per_pax) {
      this.form.max_pax = 1000;
      this.form.quantity = 1;
    } else {
      this.form.include_child = 0;
    }
  }

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }
  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
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
}
