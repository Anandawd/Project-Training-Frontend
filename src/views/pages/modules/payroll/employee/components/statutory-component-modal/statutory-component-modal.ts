import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { formatCurrency } from "@/utils/format";
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
    CInput,
    CDatepicker,
    CCheckbox,
    CRadio,
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
    statutoryComponentOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["close", "save"],
})
export default class PayrollComponentModal extends Vue {
  // props
  modeData!: number;
  isSaving!: boolean;
  statutoryComponentOptions!: any[];

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
      statutory_component_code: "",
      amount: 0,
      percentage: 0,
      min_amount: 0,
      max_amount: 0,
      quantity: 1,
      effective_date: "",
      end_date: "",
      remark: "",
      is_current: "1",
      is_fixed: "0",
      is_override: "0",
      is_taxable: "0",
      is_show_in_payslip: "1",

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

  onComponentChange(event: any) {
    let selectedComponent: any;
    selectedComponent = this.statutoryComponentOptions.find(
      (c: any) => c.code === event.target.value
    );
    if (selectedComponent) {
      this.form.statutory_component_code = selectedComponent.code;
      this.form.unit = selectedComponent.unit;
      this.form.amount = selectedComponent.default_amount
        ? selectedComponent.default_amount
        : 0;
      this.form.percentage = selectedComponent.default_percentage
        ? selectedComponent.default_percentage
        : 0;
      (this.form.min_amount = selectedComponent.min_amount),
        (this.form.max_amount = selectedComponent.max_amount);
      this.form.quantity = selectedComponent.default_quantity
        ? selectedComponent.default_quantity
        : 1;
      this.form.type = selectedComponent.type;
      this.form.remark = `${selectedComponent.type} - ${selectedComponent.description}`;
      this.form.is_override = false;
      this.form.is_taxable = selectedComponent.is_taxable;
      this.form.is_fixed = selectedComponent.is_fixed;
      this.form.is_show_in_payslip = selectedComponent.is_show_in_payslip;
    }
    console.log("selectedComponent", selectedComponent);
  }

  onOverrideAmountChange() {
    if (!this.form.is_override) {
      let selectedComponent: any;
      selectedComponent = this.statutoryComponentOptions.find(
        (c: any) => c.code === this.form.statutory_component_code
      );
      if (selectedComponent) {
        this.form.amount = selectedComponent.default_amount
          ? selectedComponent.default_amount
          : 0;
        this.form.percentage = selectedComponent.default_percentage
          ? selectedComponent.default_percentage
          : 0;
        this.form.quantity = selectedComponent.default_quantity
          ? selectedComponent.default_quantity
          : 1;
      }
    }
  }

  formatCurrency(value: any) {
    return formatCurrency(value);
  }

  // validation
  get schema() {
    return Yup.object().shape({
      ComponentType: Yup.string().required(),
      ComponentCode: Yup.string().required(),
      //   Amount: Yup.number().min(1).max(999999999),
      //   Qty: Yup.number().required().min(1).max(1000),
      EffectiveDate: Yup.date().required(),
      //   EndDate: Yup.date().nullable(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insertBenefit")}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.updateBenefit")}`;
    }
  }

  get isFixedComponent() {
    return this.form.is_fixed === 1;
  }

  get isUnitPercentage() {
    return this.form.unit === "Percentage";
  }

  get isShowUnit() {
    return this.form.unit;
  }
}
