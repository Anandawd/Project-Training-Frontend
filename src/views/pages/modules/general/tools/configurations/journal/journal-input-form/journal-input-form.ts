import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import FormTemplate from "./form-template/form-template.vue";
import FormHeaderTemplate from "./form-header-template/form-header-template.vue";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import * as Yup from "yup";
import configStore from "@/stores/config";

@Options({
  name: "MultiForm",
  components: {
    FormHeaderTemplate,
    FormTemplate,
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

    defaultForm: {
      type: Object,
      require: false,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormElement: any = ref();
  headerFormElement: any = ref();
  debitFormElement: any = ref();
  creditFormElement: any = ref();
  modeData: any;
  config: any = configStore();
  public form: any = reactive({});
  public sendDate: any = null;
  public dataFormDebit: any = null;
  public dataFormCredit: any = null;
  public dataFormHeader: any = null;
  public sendData: any = {};
  listDropdown: any = {};

  async resetForm() {
    this.inputFormElement.resetForm();
    this.$nextTick();
    this.form = this.headerFormElement.form;
  }

  initialize() {
    this.resetForm();
    this.headerFormElement.initialize(this.listDropdown);
    this.debitFormElement.initialize(this.listDropdown);
    this.creditFormElement.initialize(this.listDropdown);
  }

  onSubmit() {
    this.sendData.transaction_detail_debit = this.debitFormElement.getRowData();
    this.sendData.transaction_detail_credit =
      this.creditFormElement.getRowData();
    if (
      this.sendData.transaction_detail_debit.length > 0 &&
      this.sendData.transaction_detail_credit.length > 0
    ) {
      this.inputFormElement.$el.requestSubmit();
    } else {
      getToastError(this.$t("messages.insertCreditDetail"));
    }
  }

  getDebitCreditData(data: any, isDebit: boolean) {
    let Data: any = [];
    for (const i in data) {
      if (isDebit && data[i].type_code === "D") {
        Data.push(data[i]);
      } else if (!isDebit && data[i].type_code === "C") {
        Data.push(data[i]);
      }
    }
    console.log(Data);

    return Data;
  }

  onEdit(data: any) {
    this.headerFormElement.form = data.Data;
    this.debitFormElement.getData(this.getDebitCreditData(data.Detail, true));
    this.creditFormElement.getData(this.getDebitCreditData(data.Detail, false));
    console.log(this.debitFormElement.rowData);
  }

  onSave() {
    this.$emit("save", this.sendData);
  }

  onClose() {
    this.$emit("close");
  }

  onGetFormListHeader(val: any) {
    this.sendData.company_code = val.company_code;
    this.sendData.memo = val.memo;
    this.sendData.date = val.date;
    this.sendData.is_adjustment = val.adjustment;
  }
  onGetFormListDebit(rowData: any) {
    this.dataFormDebit = rowData;
  }
  onGetFormListCredit(rowData: any) {
    this.dataFormCredit = rowData;
  }

  getDate(value: any) {
    this.sendDate = value;
    // console.log(this.sendDate);
    // console.log(value);
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

  get auditDate() {
    return this.config.auditDate;
  }

  // Validation
  get schema() {
    return Yup.object().shape({
      date: Yup.string().required(),
      Company: Yup.string().required(),
      Memo: Yup.string().required(),
    });
  }
}
