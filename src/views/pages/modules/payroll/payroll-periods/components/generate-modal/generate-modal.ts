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
    showGenerateModal: {
      type: Boolean,
      default: false,
    },
    periodData: {
      type: Object,
      default: (): any => {},
    },
    positionsOptions: {
      type: Array,
      default: (): any[] => [],
    },
    departmentsOptions: {
      type: Array,
      default: (): any[] => [],
    },
    employeesOptions: {
      type: Array,
      default: (): any[] => [],
    },
    taxIncomeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    taxMethodOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["close", "save"],
})
export default class GenerateModal extends Vue {
  // props
  isGenerating: boolean;
  showGenerateModal!: any;
  periodData: any = {};
  positionsOptions: any[] = [];
  departmentsOptions: any[] = [];
  employeesOptions: any[] = [];
  taxIncomeOptions: any[] = [];
  taxMethodOptions: any[] = [];

  // selector options
  public selectionTypeOptions: any = [
    { code: "ALL", name: "All Employees" },
    { code: "POSITION", name: "By Position" },
    { code: "DEPARTMENT", name: "By Department" },
    { code: "INDIVIDUAL", name: "Select Specific Employees" },
  ];

  inputFormValidation: any = ref();

  // Form data
  form: any = reactive({
    selection_type: "",
    departments: "",
    positions: "",
    employees: "",
    tax_income_type: "",
    tax_method: "",
  });

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
      selection_type: "",
      departments: "",
      positions: "",
      employees: "",
      tax_income_type: "",
      tax_method: "",
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

  onSelectionTypeChange(option: string) {
    this.form.selection_type = option;

    // Reset related fields when changing selection mode
    this.form.departments = "";
    this.form.positions = "";
    this.form.employees = "";
  }

  // validation
  get schema() {
    return Yup.object().shape({
      SelectionType: Yup.string().required(),
      TaxIncome: Yup.string().required(),
      TaxMethod: Yup.string().required(),
    });
  }

  get isFormValid(): boolean {
    if (!this.form.tax_income_type || !this.form.tax_method) {
      return false;
    }

    switch (this.form.selection_type) {
      case "DEPARTMENT":
        return this.form.departments.length > 0;
      case "POSITION":
        return this.form.positions.length > 0;
      case "INDIVIDUAL":
        return this.form.employees.length > 0;
      default:
        return true;
    }
  }
}
