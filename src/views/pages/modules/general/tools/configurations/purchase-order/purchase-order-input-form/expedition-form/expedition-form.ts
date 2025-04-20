import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";

import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";

@Options({
  name: "ExpeditionForm",
  components: {
    Form,
    CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  watch: {
    "form.expedition_code"(val) {
      this.$emit("getFormHeader", this.form);
    },
  },
  emits: ["save", "close"],
})
export default class ExpeditionForm extends Vue {
  headerFormElement: any = ref();
  modeData: any;
  public rowData: any = [];
  public sendData: any = reactive({});
  public defaultForm: any = {};
  public form: any = reactive({});
  listDropdown: any = {};
  public adjustment: boolean = false;

  async resetForm() {
    await this.$nextTick();
    this.form = {
      expedition_code: "",
    };
  }

  changeAdjustment() {
    this.form.adjustment = !this.adjustment;
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onDateChange() {
    this.$emit("dateChange", this.form.date);
  }

  async initialize(listDropdown: any) {
    this.listDropdown = listDropdown;
    await this.resetForm();
  }

  onSubmit() {
    this.headerFormElement.$el.requestSubmit();
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
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
