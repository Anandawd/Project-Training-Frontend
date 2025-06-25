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
  },
  props: {
    isGenerating: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "save"],
})
export default class ProrateModal extends Vue {
  // props
  isGenerating: boolean;

  inputFormValidation: any = ref();

  // Form data
  form: any = reactive({});

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      total_workdays: 26,
      actual_workdays: 26,
      prorate_factor: 1,
    };
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

  onWorkDaysChange() {
    this.form.prorate_factor = this.calculateProrate;
  }

  // validation
  get schema() {
    return Yup.object().shape({
      WorkDays: Yup.number().min(1).required(),
      ActualWorkDays: Yup.string().min(1).required(),
    });
  }

  get calculateProrate() {
    if (this.form.total_workdays > 0 && this.form.actual_workdays > 0) {
      return Math.min(
        1,
        this.form.actual_workdays / this.form.total_workdays
      ).toFixed(3);
    }
    return 1;
  }
}
