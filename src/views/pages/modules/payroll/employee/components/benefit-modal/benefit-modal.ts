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
    typeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    earningComponentOptions: {
      type: Array,
      default: (): any[] => [],
    },
    deductionComponentOptions: {
      type: Array,
      default: (): any[] => [],
    },
    statutoryComponentOptions: {
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
  typeOptions!: any[];
  earningComponentOptions!: any[];
  deductionComponentOptions!: any[];
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
      payroll_component_code: "",
      component_type: "",
      category_code: "",
      amount: 0,
      quantity: 1,
      effective_date: "",
      end_date: "",
      remark: "",
      is_current: "1",
      is_fixed: "0",
      is_override: "0",
      is_taxable: "0",
      is_prorated: "0",
      is_included_in_bpjs_health: "0",
      is_included_in_bpjs_employee: "0",
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

  onSelectionTypeChange(event: any) {
    console.log("onSelectionTypeChange", event);
    this.form.selection_type = event.target.value;

    // Reset related fields when changing selection mode
    this.form.department_codes = "";
    this.form.position_codes = "";
    this.form.employee_ids = "";
  }

  onComponentTypeChange() {
    this.form.payroll_component_code = "";
    this.form.amount = 0;
    this.form.quantity = 1;
    this.form.is_override = false;
    this.form.category_code = false;
  }

  onComponentChange(event: any) {
    let selectedComponent: any;
    switch (this.form.component_type) {
      case "Earnings":
        selectedComponent = this.earningComponentOptions.find(
          (c: any) => c.code === event.target.value
        );
        break;
      case "Deductions":
        selectedComponent = this.deductionComponentOptions.find(
          (c: any) => c.code === event.target.value
        );
        break;
      case "Statutory":
        selectedComponent = this.statutoryComponentOptions.find(
          (c: any) => c.code === event.target.value
        );
        break;
    }
    console.log("selectedComponent", selectedComponent);
    if (selectedComponent) {
      this.form.payroll_component_code = selectedComponent.code;
      this.form.category_code = selectedComponent.category_code;
      this.form.amount = selectedComponent.default_amount || 0;
      this.form.quantity = selectedComponent.default_quantity || 1;
      this.form.is_override = false;
      this.form.is_taxable = selectedComponent.is_taxable;
      this.form.is_fixed = selectedComponent.is_fixed;
      this.form.is_prorated = selectedComponent.is_prorated;
      this.form.is_included_in_bpjs_health =
        selectedComponent.is_included_in_bpjs_health;
      this.form.is_included_in_bpjs_employee =
        selectedComponent.is_included_in_bpjs_employee;
      this.form.is_show_in_payslip = selectedComponent.is_show_in_payslip;
    } else {
      this.form.payroll_component_code = "";
      this.form.category_code = "";
      this.form.amount = 0;
      this.form.quantity = 1;
      this.form.is_override = false;
    }
  }

  onOverrideAmountChange() {
    if (!this.form.is_override) {
      let selectedComponent: any;
      switch (this.form.component_type) {
        case "Earnings":
          selectedComponent = this.earningComponentOptions.find(
            (c: any) => c.code === this.form.payroll_component_code
          );
          break;
        case "Deductions":
          selectedComponent = this.deductionComponentOptions.find(
            (c: any) => c.code === this.form.payroll_component_code
          );
          break;
        case "Statutory":
          selectedComponent = this.statutoryComponentOptions.find(
            (c: any) => c.code === this.form.payroll_component_code
          );
          break;
      }
      console.log(
        "onOverrideAmountChange selectedComponent",
        selectedComponent
      );
      if (selectedComponent) {
        this.form.amount = selectedComponent.default_amount || 0;
        this.form.quantity = selectedComponent.default_quantity || 1;
      }
    }
  }

  formatCurrency(value: any) {
    return formatCurrency(value);
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
      return `${this.$t("commons.insertBenefit")}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.updateBenefit")}`;
    }
  }

  get componentOptions() {
    switch (this.form.component_type) {
      case "Earnings":
        return this.earningComponentOptions;
      case "Deductions":
        return this.deductionComponentOptions;
      case "Statutory":
        return this.statutoryComponentOptions;
    }
    return [];
  }

  get isFixedComponent() {
    return this.form.is_fixed === 1;
  }
}
