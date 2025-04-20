import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";

import configStore from "@/stores/config";
import $global from "@/utils/global";
import { AgGridVue } from "ag-grid-vue3";
import TADAMemberAPI from "@/services/api/hotel/member/tada_member";
import TransactionAPI from "@/services/api/transaction";
import { reactive, ref } from "vue";
import { anyToFloat, getError } from "@/utils/general";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import * as Yup from "yup";

// Banquet
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { formatDateDatabase } from "@/utils/format";
import { getToastError } from "@/utils/toast";
const transactionAPI = new TransactionAPI();
const tadaMemberAPI = new TADAMemberAPI();

@Options({
  components: {
    CSelect,
    CInput,
    AgGridVue,
    CCheckbox,
    // banquet
    CDatepicker,
  },
  props: {
    transactionType: [String, Number],
    folioNumber: {
      require: true,
      type: Number,
    },
    rateAmount: {
      require: true,
      type: Number,
    },
    formType: {
      type: String,
      require: false,
    },
  },
  emits: ["close", "save"],
})
export default class VoucherForm extends Vue {
  public config = configStore();
  public form: any = {};
  public folioNumber: number;
  public options: any = reactive({
    providers: [
      { code: "CAKRA", name: "Default" },
      { code: "TADA", name: "TADA" },
    ],
    subFolioGroup: [
      { code: "A", name: "Sub Folio A" },
      { code: "B", name: "Sub Folio B" },
      { code: "C", name: "Sub Folio C" },
      { code: "D", name: "Sub Folio D" },
    ],
  });
  public isChecking: boolean = false;
  isSaving: boolean = false;
  formElement: any = ref(null);
  voucherDetail: any = {};
  voucherStatus: any = "";
  rateAmount: number;
  formX: any; // GENERAL FUNCTION ================================================================
  async resetForm() {
    this.isChecking = false;
    this.isSaving = false;
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      folio_number: this.folioNumber,
      sub_folio_group_code: "A",
      voucher_number: "",
      number: "",
      provider_code: "CAKRA",
      voucher_type: "",
      amount: "",
      remark: "",
    };

    setInputFocus();
  }

  async initialize() {
    await this.resetForm();
  }

  async handleCheckVoucher() {
    this.isChecking = true;
    this.voucherDetail = {};
    if (this.form.provider_code == "CAKRA") {
    } else if (this.form.provider_code == "TADA") {
      await this.checkVoucher();
    }
    this.isChecking = false;
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onSave() {
    let amount = 0;
    const rateAmount = anyToFloat(this.rateAmount);
    if (this.rateAmount <= 0) {
      getToastError(this.$t("messages.cannotApplyVoucherToZeroRateAmount"));
      return;
    }
    if (this.voucherStatus != "activated") {
      // getToastError(this.$t("messages.voucherIs"));
      return;
    }
    if (this.voucherDetail.egiftType == "percentageDiscount") {
      if (rateAmount > 0) {
        amount = (rateAmount * this.voucherDetail.amount) / 100;
      }
    }
    if (this.voucherDetail.egiftType == "value") {
      amount = this.voucherDetail.amount;
    }
    if (this.voucherDetail.egiftType == "freeItem") {
      amount = rateAmount;
    }
    let remark = "";
    if (this.form.provider_code == "TADA") {
      remark =
        "TADA Voucher: " +
        this.voucherDetail.egiftName +
        " " +
        this.form.remark;
    } else {
      remark = this.form.remark;
    }
    this.isSaving = true;
    this.formX = {
      modeEditor: 11,
      documentNumber: this.form.voucher_number,
      remark: remark,
      accountCode: this.tadaAccountCode,
      companyCode: this.tadaCompanyCode,
      amountForeign: amount,
      subFolioGroupCode: this.form.sub_folio_group_code,
      folioNumber: this.folioNumber,
      subDepartmentCode: this.sdFrontOffice,
      currencyCode: this.defaultCurrency,
    };
    console.log(this.formX);
    this.$emit("save", this.formX);
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  async checkVoucher() {
    if (!this.form.voucher_number) return;
    try {
      const { data } = await tadaMemberAPI.getTADAVoucherDetail(
        this.form.voucher_number
      );
      this.voucherDetail = data.egift_master;
      this.form.amount = this.voucherDetail.amount;
      this.form.voucher_type = this.voucherDetail.egiftType;
      this.voucherStatus = data.status;
    } catch (err: any) {
      const response = err.response;
      const status2 = response.status2;
      const message1 = status2.message;
      const message2 = message1.message_stack;
      this.voucherDetail.egiftName = message2;

      this.voucherStatus = "invalid";
      // getError(err);
    }
  }
  // END API REQUEST==================================================================
  mounted(): void {
    this.initialize();
  }

  get schema() {
    // if (this.form.provider_code == "TADA") {
    return Yup.object().shape({
      subFolioGroup: Yup.string().required(),
      provider: Yup.string().required(),
      voucherNumber: Yup.string().required(),
      voucherType: Yup.string().required(),
      amount: Yup.number()
        .required()
        .positive()
        .test((val) => val > 0),
    });
    // }
  }

  get tadaAccountCode() {
    return this.config.tadaAccountCode;
  }

  get tadaCompanyCode() {
    return this.config.tadaCompanyCode;
  }

  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }

  get defaultCurrency() {
    return this.config.defaultCurrency;
  }
}
