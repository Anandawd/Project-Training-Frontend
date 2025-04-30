import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { getError } from "@/utils/general";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref, watch } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "ComponentInputForm ",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    employeeId: {
      type: [String, Number],
      require: true,
    },
    periodId: {
      type: [String, Number],
      require: true,
    },
    existingComponents: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["save", "close"],
})
export default class ComponentInputForm extends Vue {
  inputFormValidation: any = ref();
  modeData!: any;
  periodId!: number | string | null;
  employeeId!: number | string | null;
  existingComponents!: Array<any>;

  public isSave: boolean = false;
  public isLoading: boolean = false;

  public defaultForm: any = {};
  public form: any = reactive({
    type: "",
    component: "",
    amount: 0,
    quantity: 1,
    unit: "",
    is_taxable: false,
    is_included_in_bpjs_health: false,
    is_included_in_bpjs_employee: false,
    is_fixed: true,
    apply_prorata: false,
    remark: "",
  });

  public availableComponents: any = reactive([]);

  public typeOptions: any = [
    {
      SubGroupName: "Type",
      code: "earnings",
      name: "Earnings",
    },
    {
      SubGroupName: "Type",
      code: "deductions",
      name: "Deductions",
    },
    {
      SubGroupName: "Type",
      code: "statutory",
      name: "Statutory",
    },
  ];
  public componentOptions: any = reactive([]);

  public earningsComponentOptions: any = [
    {
      SubGroupName: "Basic",
      code: "EC001",
      name: "Base Salary",
      category: "Basic",
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Fixed Allowance",
      code: "EC002",
      name: "Transport Allowance",
      category: "Fixed Allowance",
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Fixed Allowance",
      code: "EC003",
      name: "Meal Allowance",
      category: "Fixed Allowance",
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Fixed Allowance",
      code: "EC004",
      name: "Position Allowance",
      category: "Fixed Allowance",
      is_taxable: true,
      is_included_in_bpjs_health: true,
      is_included_in_bpjs_employee: true,
      is_fixed: true,
      apply_prorata: true,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Variable Allowance",
      code: "EC005",
      name: "Overtime",
      category: "Variable Allowance",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 0,
      unit: "Hours",
    },
    {
      SubGroupName: "Incentive",
      code: "EC006",
      name: "Performance Bonus",
      category: "Incentive",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Incentive",
      code: "EC007",
      name: "Religious Holiday Allowance (THR)",
      category: "Religious Holiday Allowance",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: true,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Reimbursement",
      code: "EC008",
      name: "Reimbursement",
      category: "Reimbursement",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
  ];

  public deductionsComponentOptions: any = [
    {
      SubGroupName: "Statutory",
      code: "DC001",
      name: "BPJS Health Employee",
      category: "Statutory",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Statutory",
      code: "DC002",
      name: "BPJS JHT Employee",
      category: "Statutory",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Statutory",
      code: "DC003",
      name: "BPJS JP Employee",
      category: "Statutory",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Fixed Deduction",
      code: "DC004",
      name: "Position Deduction",
      category: "Fixed Deduction",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: true,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Loan",
      code: "DC005",
      name: "Loan Installment",
      category: "Loan",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
    {
      SubGroupName: "Variable Deduction",
      code: "DC006",
      name: "Unpaid Leave",
      category: "Variable Deduction",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 0,
      unit: "Days",
    },
    {
      SubGroupName: "Variable Deduction",
      code: "DC007",
      name: "Late Arrival",
      category: "Variable Deduction",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 0,
      unit: "Hours",
    },
    {
      SubGroupName: "Tax",
      code: "DC008",
      name: "PPh 21",
      category: "Tax",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: false,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "",
    },
  ];

  public statutoryComponentOptions: any = [
    {
      SubGroupName: "Company Contribution",
      code: "SC001",
      name: "BPJS Health Company",
      category: "Company Contribution",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Company Contribution",
      code: "SC002",
      name: "BPJS JKK",
      category: "Company Contribution",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Company Contribution",
      code: "SC003",
      name: "BPJS JKM",
      category: "Company Contribution",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Company Contribution",
      code: "SC004",
      name: "BPJS JHT Company",
      category: "Company Contribution",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
    {
      SubGroupName: "Company Contribution",
      code: "SC005",
      name: "BPJS JP Company",
      category: "Company Contribution",
      is_taxable: true,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      default_amount: 0,
      default_quantity: 1,
      unit: "%",
    },
  ];

  public taxableOptions: any = [
    {
      SubGroupName: "Options",
      code: "OP02",
      name: "Yes",
    },
    {
      SubGroupName: "Options",
      code: "OP02",
      name: "No",
    },
  ];

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
    {
      field: "category",
      label: "category",
      align: "left",
      width: "150",
    },
  ];
  // columnOptions = [
  //   {
  //     label: "name",
  //     field: "name",
  //     align: "left",
  //     width: "200",
  //   },
  //   {
  //     field: "code",
  //     label: "code",
  //     align: "right",
  //     width: "100",
  //   },
  // ];

  // actions
  async resetForm() {
    if (this.inputFormValidation) {
      this.inputFormValidation.resetForm();
    }
    await this.$nextTick();
    this.form = {
      type: "",
      component: "",
      amount: 0,
      quantity: 1,
      unit: "",
      is_taxable: false,
      is_included_in_bpjs_health: false,
      is_included_in_bpjs_employee: false,
      is_fixed: true,
      apply_prorata: false,
      remark: "",
    };
    this.componentOptions = [];
  }

  initialize() {
    this.resetForm();
    this.loadComponents();
  }

  async loadComponents() {
    try {
      this.isLoading = true;

      // In a real implementation, you would make API calls here to get the components
      // const { data } = await payrollAPI.GetPayrollComponents(this.periodId);
      // this.earningsComponentOptions = data.earnings;
      // this.deductionsComponentOptions = data.deductions;
      // this.statutoryComponentOptions = data.statutory;

      // For now, we're using the static data defined above

      // Filter out components that are already added to the employee's payroll
      this.filterExistingComponents();
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = false;
    }
  }

  filterExistingComponents() {
    const existingCodes = this.existingComponents.map(
      (component: any) => component.component_id
    );

    this.earningsComponentOptions = this.earningsComponentOptions.filter(
      (component: any) => !existingCodes.includes(component.code)
    );

    this.deductionsComponentOptions = this.deductionsComponentOptions.filter(
      (component: any) => !existingCodes.includes(component.code)
    );

    this.statutoryComponentOptions = this.statutoryComponentOptions.filter(
      (component: any) => !existingCodes.includes(component.code)
    );
  }

  onSubmit() {
    if (this.inputFormValidation && this.inputFormValidation.$el) {
      this.inputFormValidation.$el.requestSubmit();
    } else {
      this.onSave();
    }
  }

  onSave() {
    try {
      this.isSave = true;

      const selectedComponent = this.getSelectedComponent();

      if (!selectedComponent) {
        throw new Error("Component not found");
      }

      const componentData = {
        // id: null,
        component_id: selectedComponent.code,
        name: selectedComponent.name,
        type: this.form.type,
        category: selectedComponent.category,
        amount: this.form.amount,
        original_amount: this.form.amount,
        prorata_amount: this.form.amount,
        quantity: this.form.quantity,
        unit: this.form.unit || selectedComponent.unit,
        is_taxable: this.form.is_taxable,
        is_included_in_bpjs_health: this.form.is_included_in_bpjs_health,
        is_included_in_bpjs_employee: this.form.is_included_in_bpjs_employee,
        is_fixed: this.form.is_fixed,
        apply_prorata: this.form.apply_prorata,
        remark: this.form.remark,
      };

      // In a real implementation, you would make an API call here
      // const { status2 } = await payrollAPI.AddPayrollComponent({
      //   employeeId: this.employeeId,
      //   periodId: this.periodId,
      //   component: componentData
      // });

      // if (status2.status === 0) {
      //   getToastSuccess(this.$t("messages.saveSuccess"));
      //   this.$emit("save", componentData);
      // }

      // For now, we'll just emit the data to the parent component

      this.$emit("save", componentData);
    } catch (error) {
      getError(error);
    } finally {
      this.isSave = false;
    }
  }

  getSelectedComponent() {
    let options;

    switch (this.form.type) {
      case "earnings":
        options = this.earningsComponentOptions;
        break;
      case "deductions":
        options = this.deductionsComponentOptions;
        break;
      case "statutory":
        options = this.statutoryComponentOptions;
        break;
      default:
        options = [];
    }

    return options.find((option: any) => option.code === this.form.component);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onTypeChange() {
    this.form.component = "";

    switch (this.form.type) {
      case "earnings":
        this.componentOptions = this.earningsComponentOptions;
        break;
      case "deductions":
        this.componentOptions = this.deductionsComponentOptions;
        break;
      case "statutory":
        this.componentOptions = this.statutoryComponentOptions;
        break;
      default:
        this.componentOptions = [];
    }
  }

  onComponentChange() {
    const selectedComponent = this.getSelectedComponent();

    if (selectedComponent) {
      this.form.amount = selectedComponent.default_amount;
      this.form.quantity = selectedComponent.default_quantity;
      this.form.unit = selectedComponent.unit;
      this.form.is_taxable = selectedComponent.is_taxable;
      this.form.is_included_in_bpjs_health =
        selectedComponent.is_included_in_bpjs_health;
      this.form.is_included_in_bpjs_employee =
        selectedComponent.is_included_in_bpjs_employee;
      this.form.is_fixed = selectedComponent.is_fixed;
      this.form.apply_prorata = selectedComponent.apply_prorata;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({
      type: Yup.string().required("Component type is required"),
      component: Yup.string().required("Component is required"),
      amount: Yup.number()
        .min(0, "Amount cannot be negative")
        .required("Amount is required"),
      quantity: Yup.number()
        .min(0, "Quantity cannot be negative")
        .required("Quantity is required"),
    });
  }

  created(): void {
    watch(
      () => this.form.type,
      () => {
        this.onTypeChange();
      }
    );

    watch(
      () => this.form.component,
      () => {
        this.onComponentChange;
      }
    );
  }
}
