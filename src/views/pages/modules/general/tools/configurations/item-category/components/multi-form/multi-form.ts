import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";

import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";

@Options({
  name: "MultiForm",
  components: {
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
      default: false,
    },
  },
  emits: ["save", "close"],
})
export default class MultiForm extends Vue {
  multiFormElement: any = ref();
  modeData: any;
  public defaultForm: any = {};
  public form: any = reactive({});
  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      label: "code",
      field: "code",
      align: "left",
      width: "100",
    },
  ];

  listDropdown: any = {};

  async resetForm() {
    this.multiFormElement.resetForm();
    this.$nextTick();
    this.form = {};
    if (this.defaultForm) {
      this.form = this.defaultForm;
    }
  }

  initialize() {
    this.resetForm();
  }

 async onEdit(data: any) {
  await this.$nextTick(()=>{
    this.form = data;
  })
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

  onInvalidSubmit() {
    focusOnInvalid();
  }

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown");
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
