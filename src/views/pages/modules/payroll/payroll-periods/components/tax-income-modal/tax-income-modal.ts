import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import { focusOnInvalid } from "@/utils/validation";
import "ag-grid-enterprise";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  components: {
    CSelect,
    CModal,
    CForm,
    CInput,
  },
  props: {
    isSaving: {
      type: Boolean,
      default: false,
    },
    payroll: {
      type: Array,
      required: true,
      default: (): any => ({}),
    },
    taxIncomeTypeOptions: {
      type: Array,
      required: true,
      default: (): any[] => [],
    },
    taxMethodOptions: {
      type: Array,
      required: true,
      default: (): any[] => [],
    },
  },
  emits: ["close", "save"],
})
export default class ProrateModal extends Vue {
  // props
  isSaving: boolean;
  taxIncomeTypeOptions!: any;
  taxMethodOptions!: any;
  payroll: any = reactive({});

  inputFormValidation: any = ref();

  // Form data
  form: any = reactive({});

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    if (this.payroll) {
      this.form = {
        ...this.payroll,
      };
    } else {
      this.form = {
        tax_income_type: "",
        tax_method: "",
      };
    }
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    console.log("onSave", this.form);
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  initialize() {
    this.resetForm();
  }

  // validation
  get schema() {
    return Yup.object().shape({
      TaxIncomeType: Yup.string().required(),
      TaxMethod: Yup.string().required(),
    });
  }
}
