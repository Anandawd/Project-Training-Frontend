import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
// import CRad
import * as Yup from "yup";
import { Form } from "vee-validate";
import TransactionAPI from "@/services/api/transaction";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import { formatDate3 } from "@/utils/format";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
const transactionAPI = new TransactionAPI();

interface ICredential {
  userId: string;
  reason: string;
}

@Options({
  components: {
    CInput,
    Form,
  },
  props: {
    isDeposit: {
      type: Boolean,
      default: false,
    },
    ID: {
      type: Number,
      require: true,
    },
    titleID: {
      type: Number,
      require: true,
    },
    reason: {
      type: String,
      require: true,
    },
    credential: {
      type: Object as () => ICredential,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class CorrectionForm extends Vue {
  public ID: number;
  public titleID: number;
  public credential: any;
  public inputForm: any = null;
  public isDeposit: boolean;
  amountBefore: number = 0;
  quantityBefore: number = 0;
  public form: any = {
    amount_before: 0,
    quantity_before: 0,
    transaction_date: "",
    sub_department_code: "",
    account: "",
    type: "",
    amount: 0,
    by_amount: true,
    quantity: 1,
  };
  isSaving: boolean = false;

  onSave() {
    this.inputForm.$el.requestSubmit();
  }

  async onSubmit() {
    this.isSaving = true;
    await this.insertCorrection();
    this.isSaving = false;
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async getCorrectionData() {
    try {
      if (!this.ID) return;
      const { data } = await transactionAPI.getCorrection(
        this.ID,
        this.isDeposit
      );

      this.form = data;
      this.form.amount_before =
        data.amount_before < 0 ? -data.amount_before : data.amount_before;
      this.form.audit_date = formatDate3(data.audit_date);
      this.form.amount =
        data.amount_before < 0 ? -data.amount_before : data.amount_before;
      this.form.quantity_before =
        data.quantity_before < 0 ? -data.quantity_before : data.quantity_before;
      this.form.quantity =
        data.quantity_before < 0 ? -data.quantity_before : data.quantity_before;
      this.form.is_quantity = 0;
      this.form.by_amount = true;
      this.amountBefore =
        data.amount_before < 0 ? -data.amount_before : data.amount_before;
      this.quantityBefore =
        data.quantity_before < 0 ? -data.quantity_before : data.quantity_before;
    } catch (error) {
      getError(error);
    }
  }

  async insertCorrection() {
    try {
      if (!this.ID) return;
      const params = {
        id: this.ID,
        is_deposit: this.isDeposit,
        reason: this.credential.reason,
        correction_by: this.credential.userId,
        amount_before: this.amountBefore,
        amount: this.form.amount,
        quantity_before: this.quantityBefore,
        quantity: this.form.quantity,
        by_amount: this.form.by_amount,
      };
      const { data } = await transactionAPI.correctionTransaction(params);
      getToastSuccess();

      this.$emit("save");
    } catch (error) {
      getError(error);
    }
  }

  async created() {
    const loader = this.$loading.show();
    await this.getCorrectionData();
    loader.hide();
    await this.$nextTick(() => {});
    setInputFocus();
  }

  async mounted() {}

  get title() {
    return `${this.$t("title.correctionForId")}: ${this.titleID}`;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      amount: this.form.by_amount
        ? Yup.number()
            .min(0)
            .required()
            .test((val) => {
              return (
                val > this.form.amount_before || val < this.form.amount_before
              );
            })
        : null,
      quantity: !this.form.by_amount
        ? Yup.number()
            .min(0)
            .required()
            .test((val) => {
              return (
                val > this.form.quantity_before ||
                val < this.form.quantity_before
              );
            })
        : null,
    });
  }
}
