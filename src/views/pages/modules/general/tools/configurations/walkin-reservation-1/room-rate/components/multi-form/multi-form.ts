import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import configStore from "@/stores/config";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { reactive, ref } from "vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import {
  formatDate3,
  formatDateDatabase,
  formatDateTimeZeroUTC,
} from "@/utils/format";
import { emits } from "v-calendar/dist/types/src/use/datePicker";

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
    CDatepicker,
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
    // defaultForm: {
    //   type: Object,
    //   require: false,
    // },
    isSaving: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["save", "close"],
})
export default class MultiForm extends Vue {
  config = configStore();
  multiFormElement: any = ref();
  breakdownElement: any = ref();
  businessSourceElement: any = ref();
  currencyElement: any = ref();
  modeData: any;
  focus: boolean;
  public defaultForm: any = {};
  public form: any = reactive({});
  // public isSaving: boolean = false;
  listDropdown: any = {};
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown");
  }

  async resetForm() {
    this.multiFormElement.resetForm();
    await this.$nextTick();
    this.form = {};
    // if (this.defaultForm) {
    //   this.form = this.defaultForm;
    // }
  }

  async initialize() {
    this.multiFormElement.resetForm();
    await this.$nextTick();
    this.form = {
      day1: 1,
      day2: 1,
      day3: 1,
      day4: 1,
      day5: 1,
      day6: 1,
      day7: 1,
      is_active: 1,
      charge_frequency_code: "1",
      weekday_rate1: 0,
      weekday_rate2: 0,
      weekday_rate3: 0,
      weekday_rate4: 0,
      weekend_rate1: 0,
      weekend_rate2: 0,
      weekend_rate3: 0,
      weekend_rate4: 0,
      weekday_rate_child1: 0,
      weekday_rate_child2: 0,
      weekday_rate_child3: 0,
      weekday_rate_child4: 0,
      weekend_rate_child1: 0,
      weekend_rate_child2: 0,
      weekend_rate_child3: 0,
      weekend_rate_child4: 0,
    };
    this.getEndDate();
    setInputFocus();
  }

  getEndDate() {
    const date = new Date();
    const to = new Date(
      date.getFullYear() + 1,
      date.getMonth(),
      date.getDate()
    );
    this.form.from_date = formatDateTimeZeroUTC(date);
    this.form.to_date = formatDateTimeZeroUTC(to);
  }

  onChangeCompliment() {
    if (this.form.is_compliment === 1) {
      this.onClearRate();
      this.onClearRateChild();
    }
  }

  onClearRate() {
    (this.form.weekday_rate1 = 0),
      (this.form.weekday_rate2 = 0),
      (this.form.weekday_rate3 = 0),
      (this.form.weekday_rate4 = 0),
      (this.form.weekend_rate1 = 0),
      (this.form.weekend_rate2 = 0),
      (this.form.weekend_rate3 = 0),
      (this.form.weekend_rate4 = 0);
  }

  onClearRateChild() {
    (this.form.weekday_rate_child1 = 0),
      (this.form.weekday_rate_child2 = 0),
      (this.form.weekday_rate_child3 = 0),
      (this.form.weekday_rate_child4 = 0),
      (this.form.weekend_rate_child1 = 0),
      (this.form.weekend_rate_child2 = 0),
      (this.form.weekend_rate_child3 = 0),
      (this.form.weekend_rate_child4 = 0);
  }

  onCalculateFlat() {
    this.form.weekday_rate2 = this.form.weekday_rate1;
    this.form.weekday_rate3 = this.form.weekday_rate1;
    this.form.weekday_rate4 = this.form.weekday_rate1;
    this.form.weekend_rate2 = this.form.weekend_rate1;
    this.form.weekend_rate3 = this.form.weekend_rate1;
    this.form.weekend_rate4 = this.form.weekend_rate1;
  }

  onCalculateFlatChild() {
    this.form.weekday_rate_child2 = this.form.weekday_rate_child1;
    this.form.weekday_rate_child3 = this.form.weekday_rate_child1;
    this.form.weekday_rate_child4 = this.form.weekday_rate_child1;
    this.form.weekend_rate_child2 = this.form.weekend_rate_child1;
    this.form.weekend_rate_child3 = this.form.weekend_rate_child1;
    this.form.weekend_rate_child4 = this.form.weekend_rate_child1;
  }

  onCalculateMultiply() {
    if (this.form.weekday_rate1 > 0) {
      this.form.weekday_rate2 = this.form.weekday_rate1 * 2;
      this.form.weekday_rate3 = this.form.weekday_rate1 * 3;
      this.form.weekday_rate4 = this.form.weekday_rate1 * 4;
      this.form.weekend_rate2 = this.form.weekend_rate1 * 2;
      this.form.weekend_rate3 = this.form.weekend_rate1 * 3;
      this.form.weekend_rate4 = this.form.weekend_rate1 * 4;
    }
  }

  onCalculateMultiplyChild() {
    if (this.form.weekday_rate_child1 > 0) {
      this.form.weekday_rate_child2 = this.form.weekday_rate_child1 * 2;
      this.form.weekday_rate_child3 = this.form.weekday_rate_child1 * 3;
      this.form.weekday_rate_child4 = this.form.weekday_rate_child1 * 4;
      this.form.weekend_rate_child2 = this.form.weekend_rate_child1 * 2;
      this.form.weekend_rate_child3 = this.form.weekend_rate_child1 * 3;
      this.form.weekend_rate_child4 = this.form.weekend_rate_child1 * 4;
    }
  }

  onEdit(data: any) {
    this.form = data;
    this.form.from_date = formatDateDatabase(this.form.from_date);
    this.form.to_date = formatDateDatabase(this.form.to_date);
    // this.breakdownElement.initialize(this.form.code);
    // this.businessSourceElement.initialize(this.form.code);
    // this.currencyElement.initialize(this.form.code);
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
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================

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

  get useRateChild() {
    return this.config.useRateChild;
  }
  // END GETTER AND SETTER ===========================================================
}
