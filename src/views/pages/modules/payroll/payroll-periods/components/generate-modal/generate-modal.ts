import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import "ag-grid-enterprise";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    CSelect,
    CModal,
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
  emits: ["close", "generate"],
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
  public selectEmployeeOptions: any = [
    { code: "all", name: "All Employees" },
    { code: "position", name: "By Position" },
    { code: "department", name: "By Department" },
    { code: "specific", name: "Select Specific Employees" },
  ];

  // Form data
  form: any = reactive({
    select_employee: "",
    departments: "",
    positions: "",
    selectedEmployees: "",
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

  // methods
  async handleGenerate() {
    this.$emit("generate", {
      selectionMode: this.form.select_employee,
      departments: this.form.departments,
      positions: this.form.positions,
      selectedEmployees: this.form.selectedEmployees,
      taxIncomeType: this.form.tax_income_type,
      taxMethod: this.form.tax_method,
    });
  }

  handleClose() {
    this.$emit("close");
  }

  selectEmployeeOption(option: string) {
    this.form.select_employee = option;

    // Reset related fields when changing selection mode
    this.form.departments = [];
    this.form.positions = [];
    this.form.selectedEmployees = [];
  }

  get isFormValid(): boolean {
    if (!this.form.tax_income_type || !this.form.tax_method) {
      return false;
    }

    switch (this.form.select_employee) {
      case "department":
        return this.form.departments.length > 0;
      case "position":
        return this.form.positions.length > 0;
      case "specific":
        return this.form.selectedEmployees.length > 0;
      default:
        return true;
    }
  }
}
