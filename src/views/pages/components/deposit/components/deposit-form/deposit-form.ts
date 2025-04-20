import { Options, Vue } from "vue-class-component";
import TransferForm from "./components/transfer/transfer.vue";
import BankCardForm from "./components/bank-card/bank-card.vue";
import PaymentChargeForm from "@/views/pages/components/form/payment-charge/payment-charge.vue";
import $global from "@/utils/global";
import { nextTick, ref } from "vue";
import DepositAPI from "@/services/api/hotel/reservation/deposit";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
const depositAPI = new DepositAPI();
@Options({
  components: {
    TransferForm,
    PaymentChargeForm,
    BankCardForm,
  },
  props: {
    reservationNumber: {
      type: Number,
      require: true,
    },
    isBanquet: {
      type: Boolean,
      default: false
    }
  },
  emits: ["refresh"],
})
export default class DepositForm extends Vue {
  public isSaving: boolean = false;
  public modeEditorTransaction: Number = null;
  public formType: number = 0;
  public showDepositForm: boolean = false;
  public activeForm: any = ref();
  public paymentChargeForm: any = ref();
  public transferForm: any = ref();
  public bankCardForm: any = ref();
  public formData: any = {};
  reservationNumber: any;
  isBanquet: boolean

  async initialize(type: number) {
    this.formType = type;
    await nextTick(() => {
      this.getInitialForm(type);
    });
    this.activeForm.initialize(type);
    this.showDepositForm = true;
  }

  onClickSave() {
    this.activeForm.$el.requestSubmit();
  }

  getInitialForm(type: any) {
    if (type === $global.modeDeposit.transfer) {
      this.activeForm = this.transferForm;
    } else if (type === $global.modeDeposit.card) {
      this.activeForm = this.bankCardForm;
    } else {
      if (type == $global.modeDeposit.cash) {
        this.modeEditorTransaction =
          $global.modeEditorTransaction.depositCashPayment;
      } else if (type == $global.modeDeposit.refund) {
        this.modeEditorTransaction =
          $global.modeEditorTransaction.depositCashRefund;
      } else if (type == $global.modeDeposit.other) {
        this.modeEditorTransaction =
          $global.modeEditorTransaction.depositOtherPayment;
      }
      this.activeForm = this.paymentChargeForm;
    }
  }

  async onSaveDeposit(formData: any, formDetail: any) {
    if (this.isBanquet) {
      if (!formDetail) {
        formDetail = {}
      }
      formDetail.system_code = $global.systemCode.Banquet
    }

    let form;
    this.isSaving = true;
    form = {
      ...formDetail,
      guest_deposit: formData,
    };

    await this.insertGuestDeposit(form);
    this.isSaving = false;
    this.$emit("refresh");
  }

  async onSaveTransfer(formData: string) {
    this.isSaving = true;
    await this.transferDeposit(formData);
    this.isSaving = false;
    this.$emit("refresh");
  }

  //API
  async insertGuestDeposit(formData: any) {
    try {
      formData.guest_deposit.reservation_number = this.reservationNumber;
      await depositAPI.insertGuestDeposit(formData);
      this.showDepositForm = false;
      getToastSuccess();
    } catch (err) {
      getError(err);
    }
  }

  async transferDeposit(formData: any) {
    try {
      formData.reservation_number = this.reservationNumber;
      await depositAPI.transferDeposit(formData);
      this.showDepositForm = false;
      getToastSuccess();
    } catch (err) {
      getError(err);
    }
  }
  get title() {
    switch (this.formType) {
      case $global.modeDeposit.cash:
        return this.$t("transaction.cash");
      case $global.modeDeposit.card:
        return this.$t("transaction.card");
      case $global.modeDeposit.other:
        return this.$t("transaction.other");
      case $global.modeDeposit.refund:
        return this.$t("transaction.refund");
      case $global.modeDeposit.transfer:
        return this.$t("transaction.transfer");
      default:
        break;
    }
  }
}
