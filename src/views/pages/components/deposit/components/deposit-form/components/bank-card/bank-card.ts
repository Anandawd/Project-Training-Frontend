import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import * as Yup from "yup";
import { AgGridVue } from "ag-grid-vue3";
import ConfigStore from "@/stores/config";
import { nextTick, reactive, ref } from "vue";

//API
import TransactionAPI from "@/services/api/transaction";
import { anyToFloat, getError } from "@/utils/general";
import global from "@/utils/global";
const configStore = ConfigStore();
const transactionAPI = new TransactionAPI();
@Options({
  name: "BankCardForm",
  components: {
    CSelect,
    CInput,
    AgGridVue,
  },
  props: {
    isSaving: Boolean,
  },
})
export default class BankCardForm extends Vue {
  public bankCardForm: any = ref();
  public form: any = {};
  public cardDetail: any = {};
  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    cardBanks: [],
    cardTypes: [],
  };
  type: number;

  async initialize(type: number) {
    this.type = type;
    await this.resetForm();
    this.getComboList();
    await this.getAccountList(this.form.sub_department_code);
  }

  async resetForm() {
    this.form = {};
    this.bankCardForm.resetForm();
    await nextTick();
    this.form = reactive({
      currency_code: this.defaultCurrency,
      exchange_rate: 1,
      sub_department_code: this.sdFrontOffice,
      type_code: "C",
    });
    this.cardDetail = {
      is_card: true,
    };
    setInputFocus();
  }

  onSave() {
    this.bankCardForm.$el.requestSubmit();
  }

  onClose() {
    this.$emit("close");
  }

  onSubmit() {
    this.form.amount_foreign = parseFloat(this.form.amount_foreign);
    this.$emit("save", this.form, this.cardDetail);
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeAmount() {
    this.getTotalAmount();
  }

  async onChangeCurrencyCode($event: any) {
    await this.getExchangeRateCurrency($event.target.value);
    this.getTotalAmount();
  }

  onChangeChargePercent() {
    this.getTotalAmount();
  }

  getTotalAmount() {
    this.form.amount =
      anyToFloat(this.form.amount_foreign) *
      anyToFloat(this.form.exchange_rate);
    this.cardDetail.charge_amount =
      (anyToFloat(this.form.amount_foreign) *
        anyToFloat(this.cardDetail.charge_percent)) /
      100;
    this.form.total_amount =
      anyToFloat(this.cardDetail.charge_amount) +
      anyToFloat(this.form.amount_foreign);
  }

  // API
  async getComboList() {
    try {
      const { data } = await transactionAPI.getPaymentCardComboList();
      if (!data) return;
      this.options.cardBanks = data.CardBank;
      this.options.cardTypes = data.CardType;
      this.options.currencies = data.Currency;
      this.options.subDepartments = data.SubDepartment;
      this.options.subFolioGroups = data.SubFolioGroup;
    } catch (err) {
      getError(err);
    }
  }

  public async getExchangeRateCurrency(currencyCode: any) {
    try {
      if (!currencyCode) return;
      const { data } = await transactionAPI.detailData(
        "Currency",
        currencyCode
      );
      if (data) {
        this.form.exchange_rate = parseFloat(data.exchange_rate);
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  async getAccountList(subDepartmentCode: string) {
    try {
      const params = {
        ModeEditor: global.modeEditorTransaction.depositCardPayment,
        CurrencyCode: this.form.currency_code,
        SubDepartmentCode: subDepartmentCode,
      };
      if (!subDepartmentCode) return;
      const { data } = await transactionAPI.getAccount(params);
      this.options.accounts = data ? data : [];
    } catch (err) {
      getError(err);
    }
  }

  get balance() {
    return 0;
  }
  get auditDate() {
    return configStore.auditDate;
  }
  get sdFrontOffice() {
    return configStore.sdFrontOffice;
  }
  get defaultCurrency() {
    return configStore.defaultCurrency;
  }
  get cashAccount() {
    return configStore.cash;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      Currency: Yup.string()
        .required()
        .test(() => this.options.currencies.length > 0),
      "Exchange Rate": Yup.number().required(),
      "Sub Department": Yup.string()
        .required()
        .test(() => this.options.subDepartments.length > 0),
      Account: Yup.string()
        .required()
        .test(() => this.options.accounts.length > 0),
      "Bank Card": Yup.string()
        .required()
        .test(() => this.options.cardBanks.length > 0),
      "Card Type": Yup.string()
        .required()
        .test(() => this.options.cardTypes.length > 0),
      "Foreign Amount": Yup.string()
        .required()
        .test((value) => parseFloat(value) > 0),
      "Document Number": Yup.string().required(),
    });
  }
}
