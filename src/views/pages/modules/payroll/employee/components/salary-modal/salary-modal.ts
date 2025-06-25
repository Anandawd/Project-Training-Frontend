import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
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
    modeData: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },

    adjustmentReasonOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["close", "save"],
})
export default class GenerateModal extends Vue {
  // props
  modeData!: number;
  isSaving!: boolean;
  adjustmentReasonOptions!: any[];

  inputFormValidation: any = ref();

  // Form data
  form: any = reactive({});

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
      filter: true,
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: null,
      base_salary: 0,
      effective_date: "",
      adjustment_reason_code: "",
      remark: "",

      // modified
      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
    };
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    console.log("onSave", this.form);
    this.$emit("save", this.form);
  }

  initialize() {
    this.resetForm();
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onSelectionTypeChange(event: any) {
    console.log("onSelectionTypeChange", event);
    this.form.selection_type = event.target.value;

    // Reset related fields when changing selection mode
    this.form.department_codes = "";
    this.form.position_codes = "";
    this.form.employee_ids = "";
  }

  // validation
  get schema() {
    return Yup.object().shape({
      //  ComponentType: Yup.string().required(),
      //   ComponentCode: Yup.string().required(),
      //   Amount: Yup.number().min(1).max(999999999),
      //   Qty: Yup.number().required().min(1).max(1000),
      //   EffectiveDate: Yup.date().required(),
      //   EndDate: Yup.date().nullable(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insertSalaryAdjustment")}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.updateSalaryAdjustment")}`;
    }
  }
}
