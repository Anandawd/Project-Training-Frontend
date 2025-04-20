import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CRadio from "@/components/radio/radio.vue";
import { reactive, ref } from "vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { formatDate, formatNumber } from "@/utils/format";

@Options({
  components: {
    Form,
    CRadio,
    CSelect,
    CInput,
    CDatepicker,
  },
  props: {
    modeData: {
      type: Number,
      required: true
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
    defaultForm: {
      type: Object,
      require: false,
    },
    columnOptions: {
      type: Array,
    },
  }
})
export default class InputForm extends Vue {
  public form: any = reactive({})
  listDropdown: any = {}
  modeData: number = 0
  isSaving: boolean
  inputFormValidation: any = ref()
  public defaultForm: any = {};
  // GENERAL FUNCTION ================================================================
  onClose() {
    this.$emit('close')
  }

  async initialize() {
    await this.resetForm()
  }

  async resetForm() {
    this.inputFormValidation.resetForm();
      if (this.defaultForm != 0) {
          this.form = this.defaultForm;
      }
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit()
  }

  onInvalidSubmit() {
    focusOnInvalid()
  }

  onSave() {
    this.$emit('save', this.form)
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async onChangePaymentWith(event: any) {
    const filteredItem = this.listDropdown.find((item: any) => item.id === event.target.value)
    await this.$nextTick(() => {
      this.form.payment_amount = filteredItem.amount,
      this.form.payment_date = filteredItem.audit_date,
      this.form.payment_remark = filteredItem.remark
    })
  }

  async onEdit(data: any){
    this.form = data
    const filteredItem = this.listDropdown.find((item: any) => item.id === data.guest_deposit_id)
    await this.$nextTick(() => {
      this.form.payment_amount = filteredItem.amount,
      this.form.payment_date = filteredItem.audit_date
    })
  }

  repeatLoadDropdown() {
    this.$emit("repeatLoadDropdown")
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================


  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get title() {
    let title = ''
    switch (this.modeData) {
      case $global.modeData.edit:
        title = `${this.$t("commons.update")} ${this.$t("title.schedulePayment")}`
        break;
      default:
        title = `${this.$t("commons.insert")} ${this.$t("title.schedulePayment")}`
        break;
    }
    return title
  }
  // VALIDATION ======================================================================
  get schema() {
    return Yup.object().shape({
      "name": Yup.string().required(),
      "date": Yup.string().required(),
      "amount": Yup.number().min(1).required(),
      "remark": Yup.string().required()
    })
  }
  // END GETTER AND SETTER ===========================================================
}
