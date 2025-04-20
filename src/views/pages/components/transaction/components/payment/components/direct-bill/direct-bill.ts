import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";

import { AgGridVue } from "ag-grid-vue3";
import configStore from "@/stores/config";
import TransactionAPI from "@/services/api/transaction";
import { getError } from "@/utils/general";
import CCheckbox from "@/components/checkbox/checkbox.vue";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CCheckbox,
    CSelect,
    CInput,
    AgGridVue,
  },
  props: {
    transactionType: String,
  },
  emits: ["changeSubDepartment", "changeAccount"],
})
export default class DirectBillForm extends Vue {
  public transactionType: string = "";
  public config = configStore();
  public form: any = {};
  public options: any = {};
  public folioTransfer: any = 0;
  public folioNumber: number = 0;

  onChangeAmount() {
    this.getTotalAmount();
  }

  onChangeChargePercent() {
    this.getTotalAmount();
  }

  onChangeDirectBill(event: any) {
    const directBillCode = event.target.value;
    this.getDirectBillAROutstanding(directBillCode);
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

  async getDirectBill(accountCode: string) {
    try {
      const { data } = await transactionAPI.getDirectBill(accountCode);
      this.options.directBills = data;
    } catch (err) {
      getError(err);
    }
  }
  async getDirectBillAROutstanding(companyCode: string) {
    try {
      const { data } = await transactionAPI.getDirectBillAROutstanding(
        companyCode
      );
      this.form.outstanding = data.outstanding;
      this.form.arLimit = data.ar_limit;
    } catch (err) {
      getError(err);
    }
  }
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

  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  get defaultCurrency() {
    return this.config.defaultCurrency;
  }
  get subFolioGroup() {
    return "A";
  }
}
