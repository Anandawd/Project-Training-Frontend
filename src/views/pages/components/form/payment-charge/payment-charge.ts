import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";

//API
import TransactionAPI from "@/services/api/transaction";

import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import $global from "@/utils/global";
import * as Yup from "yup";
import ConfigStore from "@/stores/config";
import { getError } from "@/utils/general";
import { nextTick, ref } from "vue";
import { getToastError } from "@/utils/toast";
const configStore = ConfigStore();
const transactionAPI = new TransactionAPI();

@Options({
  name: "PaymentChargeForm",
  components: {
    CSelect,
    CInput,
  },
  props: {
    param: {
      type: Number,
      require: true,
    },
    modeEditorTransaction: {
      type: Number,
      require: true,
    },
    isSaving: Boolean,
    isBanquet: {
      type: Boolean,
      default: false
    }
  },
  emits: ["save"],
})
export default class PaymentChargeForm extends Vue {
  public modeEditorTransaction: number = 0;
  public param: number = 0;
  public balance: number = 0;
  public paymentChargeForm: any = ref();
  public form: any = {};
  isBanquet: boolean

  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
  };

  onChangeAmount() {
    this.getTotalAmount();
  }

  async onChangeCurrencyCode($event: any) {
    await this.getExchangeRateCurrency($event.target.value);
    this.getTotalAmount();
  }

  getTotalAmount() {
    this.form.amount = this.form.amount_foreign * this.form.exchange_rate;
  }

  async resetForm() {
    this.form = {};
    await nextTick(() => {
      this.paymentChargeForm.resetForm();
    });
    this.form = {
      currency_code: this.defaultCurrency,
      exchange_rate: 1,
      sub_department_code: this.sdFrontOffice,
      type_code:
        this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositCashPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioCashPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioOtherPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositOtherPayment
          ? "C"
          : "D",
      account_code:
        this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositCashPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioCashPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioCashRefund ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositCashRefund
          ? this.cashAccount
          : "",
      amount_foreign: 0,
      amount: 0,
      charge_amount: 0,
      total_amount: 0,
      remark:
        this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioCashRefund ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositCashRefund
          ? "Cash Refund"
          : "",
      document_number: "",
    };
    setInputFocus();
  }

  async initialize() {
    await this.resetForm();
    this.getComboList();
    if (
      this.modeEditorTransaction ===
      $global.modeEditorTransaction.folioCashRefund ||
      this.modeEditorTransaction ===
      $global.modeEditorTransaction.depositCashRefund
    ) {
      this.balance = await this.getBalanceDeposit(this.param);
      this.form.amount = this.balance;
      this.form.amount_foreign = this.balance;
    }
    await this.getAccountList(this.form.sub_department_code);
  }

  onSave() {
    this.paymentChargeForm.$el.requestSubmit();
  }

  onSubmit() {
    this.form.amount_foreign = parseFloat(this.form.amount_foreign);
    this.$emit("save", this.form, null);
  }

  onClose() {
    this.$emit("close");
  }

  async onInvalidSubmit() {
    if (
      this.modeEditorTransaction ===
      $global.modeEditorTransaction.folioCashRefund ||
      this.modeEditorTransaction ===
      $global.modeEditorTransaction.depositCashRefund
    ) {
      this.balance = await this.getBalanceDeposit(this.param);
      if (this.form.amount > this.balance) {
        getToastError(this.$t("messages.amountOverBalance"));
      }
    }
    focusOnInvalid();
  }

  // API
  async getComboList() {
    try {
      const { data } = await transactionAPI.getChargePaymentComboList();
      if (!data) return;
      this.options.currencies = data.Currency;
      this.options.subFolioGroups = data.SubFolioGroup;
      this.options.subDepartments = data.SubDepartment;
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

  async getBalanceDeposit(reservationNumber: number) {
    try {
      // const { data } = await transactionAPI.getBalanceDeposit(
      //   reservationNumber
      // );
      let param = {
        ReservationNumber: reservationNumber,
        SystemCode: this.isBanquet ? $global.systemCode.Banquet : ""
      }
      const { data } = await transactionAPI.getTotalDepositReservation(
        param
      );
      if (!data) return 0;
      return parseFloat(data);
    } catch (err) {
      getError(err);
      return 0;
    }
  }

  async getAccountList(subDepartmentCode: string) {
    try {
      const params = {
        ModeEditor: this.modeEditorTransaction,
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
      Currency: Yup.string().required(),
      "Exchange Rate": Yup.number().min(1).required(),
      "Sub Department": Yup.string().required(),
      Account: Yup.string().required(),
      "Amount Foreign": Yup.number()
        .required()
        .test((value) => {
          if (
            this.modeEditorTransaction ===
            $global.modeEditorTransaction.folioCashRefund ||
            this.modeEditorTransaction ===
            $global.modeEditorTransaction.depositCashRefund
          ) {
            return value <= this.balance && value > 0;
          }
          return value > 0;
        }),
      "Document Number":
        this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositCashPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioCashPayment ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.folioCashRefund ||
          this.modeEditorTransaction ===
          $global.modeEditorTransaction.depositCashRefund
          ? Yup.string().required()
          : null,
    });
  }
}
