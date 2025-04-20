import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";

import { AgGridVue } from "ag-grid-vue3";
import $global from "@/utils/global";
import configStore from "@/stores/config";
import TransactionAPI from "@/services/api/transaction";
import * as Yup from "yup";

// component
import DirectBillForm from "./components/direct-bill/direct-bill.vue";
import BankCardForm from "./components/bank-card/bank-card.vue";
import { ref } from "vue";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { getError } from "@/utils/general";

const transactionAPI = new TransactionAPI();
@Options({
  components: {
    DirectBillForm,
    BankCardForm,
    CSelect,
    CInput,
    AgGridVue,
  },
  props: {
    transactionType: Number,
    folioNumber: {
      type: Number,
      require: true,
    },
    balance: {
      type: Number,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class PaymentForm extends Vue {
  config: any = configStore();
  public formElement: any = ref(null);
  public cardElement: any = ref(null);
  public directBillElement: any = ref(null);
  public transactionType: number = 0;
  public form: any = {};
  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    cardType: [],
    subFolioGroup: [
      { Code: "A", Name: "Sub Folio A" },
      { Code: "B", Name: "Sub Folio B" },
      { Code: "C", Name: "Sub Folio C" },
      { Code: "D", Name: "Sub Folio D" },
    ],
  };
  btnSaveDisabled: boolean;
  folioNumber: number;
  public folioTransfer: any = 0;
  public isSaving: boolean = false;
  balance: any;

  // GENERAL FUNCTION ================================================================
  async resetForm() {
    this.btnSaveDisabled = false;
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      currencyCode: this.defaultCurrency,
      exchangeRate: 1,
      subFolioGroupCode: "A",
      subDepartmentCode: this.sdFrontOffice,
      accountCode:
        this.transactionType === $global.modeTransaction.cash ||
        this.transactionType === $global.modeTransaction.refund
          ? this.cashAccount
          : "",
      amountForeign:
        this.balance > 0 &&
        this.transactionType != $global.modeTransaction.refund
          ? this.balance
          : 0,
      amount: 0,
      chargePercent: 0,
      chargeAmount: 0,
      totalAmount: 0,
      remark: "",
      documentNumber: "",
      isRefund: false,
      modeEditor: this.modeEditor,
    };
    if (this.transactionType == $global.modeTransaction.refund) {
      if (this.balance < 0) {
        this.form.amountForeign = -this.balance;
      }
    }
    this.getTotalAmount();

    if (this.transactionType === $global.modeTransaction.card) {
      this.cardElement.form = this.form;
    } else if (this.transactionType === $global.modeTransaction.directBill) {
      this.directBillElement.form = this.form;
    }

    if (
      this.options.subDepartments.find(
        (val: any) => val.code == this.sdFrontOffice
      )
    ) {
      this.form.subDepartmentCode = this.sdFrontOffice;
    }
    setInputFocus();
  }

  async initialize() {
    await this.getDropdowns();
    await this.resetForm();
    this.getAccounts(this.form.subDepartmentCode);
  }

  getTotalAmount() {
    const chargePercent =
      this.form.chargePercent >= 0 ? this.form.chargePercent : 0;
    this.form.amount = this.form.amountForeign * this.form.exchangeRate;
    this.form.chargeAmount = (this.form.amountForeign * chargePercent) / 100;
    this.form.totalAmount = this.form.chargeAmount + this.form.amountForeign;
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onSave() {
    this.isSaving = true;
    this.btnSaveDisabled = true;
    this.$emit("save", this.form);
  }

  onSubmit() {
    if (this.isSaving) return;
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeAmount() {
    this.getTotalAmount();
  }

  onChangeChargePercent() {
    this.getTotalAmount();
  }

  onChangeAccount(event: any) {
    const accountCode = event.target.value;
    this.isFolioAutoTransferAccount(accountCode);
    if (this.transactionType === $global.modeTransaction.directBill) {
      this.getDirectBills(accountCode);
    }
  }

  async onChangeCurrency(event: any) {
    await this.getExchangeRate(event.target.value);
    this.getAccounts(this.form.subDepartmentCode);
    this.getTotalAmount();
  }

  onChangeSubDepartment(event: any) {
    const subDepartmentCode = event.target.value;
    this.getAccounts(subDepartmentCode);
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getDropdowns() {
    try {
      const params = ["SubDepartment", "Currency", "CardBank", "CardType"];
      const { data } = await transactionAPI.codeNameListArray(params);
      this.options.subDepartments = data.SubDepartment;
      this.options.currencies = data.Currency;
      this.options.cardBanks = data.CardBank;
      this.options.cardTypes = data.CardType;
      // pass object data to card payment form
      if (this.transactionType == $global.modeTransaction.card) {
        this.cardElement.options = this.options;
      } else if (this.transactionType == $global.modeTransaction.directBill) {
        this.directBillElement.options = this.options;
      }
    } catch (err) {
      getError(err);
    }
  }

  async getExchangeRate(currencyCode: string) {
    try {
      const { data } = await transactionAPI.detailData(
        "Currency",
        currencyCode
      );
      if (data) {
        this.form.exchangeRate = data.data.exchange_rate;
      }
    } catch (err) {
      getError(err);
    }
  }

  async getDirectBills(accountCode: string) {
    try {
      const { data } = await transactionAPI.getDirectBill(accountCode);
      this.options.directBills = data;
      this.directBillElement.options = this.options;
    } catch (err) {
      getError(err);
    }
  }

  async getAccounts(subDepartmentCode: string) {
    try {
      const params = {
        ModeEditor: this.modeEditor,
        CurrencyCode: this.form.currencyCode,
        SubDepartmentCode: subDepartmentCode,
      };
      const { data } = await transactionAPI.getAccount(params);
      this.options.accounts = data;
    } catch (err) {
      getError(err);
    }
  }

  async isFolioAutoTransferAccount(accountCode: string) {
    this.folioTransfer = false;
    if (!accountCode) {
      return;
    }
    try {
      const { data } = await transactionAPI.isFolioAutoTransferAccount(
        this.folioNumber,
        accountCode
      );
      this.folioTransfer = data.folio_transfer;
    } catch (err) {
      getError(err);
    }
  }

  // END API REQUEST==================================================================
  mounted(): void {
    this.initialize();
  }
  get modeEditor() {
    if (this.transactionType === $global.modeTransaction.cash) {
      return 2;
    } else if (this.transactionType === $global.modeTransaction.card) {
      return 3;
    } else if (this.transactionType === $global.modeTransaction.directBill) {
      return 5;
    } else if (this.transactionType === $global.modeTransaction.refund) {
      return 4;
    } else if (this.transactionType === $global.modeTransaction.other) {
      return 1;
    }
    return 0;
  }

  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  get cashAccount() {
    return this.config.cash;
  }
  get defaultCurrency() {
    return this.config.defaultCurrency;
  }
  get subFolioGroup() {
    return "A";
  }
  get schema() {
    return Yup.object().shape({
      subFolioGroup: Yup.string().required(),
      currency: Yup.string().required(),
      excRate: Yup.string().required(),
      subDepartment: Yup.string().required(),
      account: Yup.string().required(),
      documentNumber:
        this.transactionType !== $global.modeTransaction.directBill
          ? Yup.string().required()
          : null,
      directBill:
        this.transactionType == $global.modeTransaction.directBill
          ? Yup.string().required()
          : null,
      cardBankCode:
        this.transactionType == $global.modeTransaction.card
          ? Yup.string().required()
          : null,
      cardTypeCode:
        this.transactionType == $global.modeTransaction.card
          ? Yup.string().required()
          : null,
      amountForeign: Yup.number()
        .required()
        .positive()
        .test((val) => val > 0),
    });
  }
}
