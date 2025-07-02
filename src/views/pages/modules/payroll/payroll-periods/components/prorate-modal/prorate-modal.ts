import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import { getToastInfo } from "@/utils/toast";
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
  },
  emits: ["close", "save"],
})
export default class ProrateModal extends Vue {
  // props
  isSaving: boolean;
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
        total_workdays: 1,
        actual_workdays: 1,
        prorata_factor: 1,
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

  onWorkDaysChange() {
    console.log("totalWorkdays", this.form.total_workdays);
    console.log("actualWorkDays", this.form.actual_workdays);
    console.log("prorateFactor", this.form.prorata_factor);
    console.log("form", this.form);
  }

  onActualWorkDaysChange() {
    if (this.form.actual_workdays > this.form.total_workdays) {
      this.form.actual_workdays = this.form.total_workdays;
      getToastInfo(
        this.$t(
          "messages.payroll.info.actualWorkDaysCannotMoreThanTotalWorkDays"
        )
      );
    }
    if (this.form.actual_workdays < 1) {
      this.form.actual_workdays = 1;
      getToastInfo(this.$t("messages.payroll.info.actualWorkDaysCannotZero"));
    }
    this.form.prorata_factor = this.calculateProrate;
  }

  onTotalWorkDaysChange() {
    if (this.form.actual_workdays > this.form.total_workdays) {
      this.form.actual_workdays = this.form.total_workdays;
    }
    if (this.form.total_workdays < 1) {
      this.form.total_workdays = 1;
      this.form.actual_workdays = this.form.total_workdays;
      getToastInfo(this.$t("messages.payroll.info.totalWorkDaysCannotZero"));
    }
    this.form.prorata_factor = this.calculateProrate;
  }

  // validation
  get schema() {
    return Yup.object().shape({
      WorkDays: Yup.number().min(1).required(),
      ActualWorkDays: Yup.number().min(1).required(),
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
