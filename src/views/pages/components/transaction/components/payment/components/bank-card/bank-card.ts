import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import configStore from "@/stores/config";

import { AgGridVue } from "ag-grid-vue3";
import TransactionAPI from "@/services/api/transaction";
import { getError } from "@/utils/general";
import CCheckbox from "@/components/checkbox/checkbox.vue";
const transactionAPI = new TransactionAPI();
@Options({
  name: "BankCardForm",
  components: {
    CSelect,
    CInput,
    CCheckbox,
    AgGridVue,
  },
  props: {
    transactionType: Number,
    folioNumber: {
      type: Number,
      require: true,
    },
  },
})
export default class BankCardForm extends Vue {
  public config: any = configStore();
  public transactionType: number = 0;
  public form: any = {};
  public options: any = {};
  public folioTransfer: any = 0;
  public folioNumber: any = 0;

  onChangeAmount() {
    this.getTotalAmount();
  }

  onChangeSubDepartment($event: any) {
    this.$emit("changeSubDepartment", $event);
  }

  onChangeChargePercent() {
    this.getTotalAmount();
  }

  async onChangeCurrency(event: any) {
    await this.getExchangeRate(event.target.value);
    this.getTotalAmount();
  }

  getTotalAmount() {
    const chargePercent =
      this.form.chargePercent >= 0 ? this.form.chargePercent : 0;
    this.form.amount = this.form.amountForeign * this.form.exchangeRate;
    this.form.chargeAmount = (this.form.amountForeign * chargePercent) / 100;
    this.form.totalAmount = this.form.chargeAmount + this.form.amountForeign;
  }
  // API REQUEST======================================================================
  async isFolioAutoTransferAccount(accountCode: string) {
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

  // END API REQUEST==================================================================

  get defaultCurrency() {
    return this.config.defaultCurrency;
  }
}
