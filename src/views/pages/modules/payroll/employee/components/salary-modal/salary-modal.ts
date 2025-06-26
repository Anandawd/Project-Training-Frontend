import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { getToastError } from "@/utils/toast";
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
    CDatepicker,
    CInput,
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
    employeeData: {
      type: Object,
      default: (): any => {},
    },
    adjustmentReasonOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["close", "save"],
})
export default class SalaryModal extends Vue {
  // props
  modeData!: number;
  isSaving!: boolean;
  employeeData!: any;
  adjustmentReasonOptions: any[] = reactive([]);

  inputFormValidation: any = ref();

  form: any = reactive({});

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
  ];

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      employee_id: "",
      employee_name: "",
      Position: "",
      Department: "",
      Placement: "",
      adjustment_reason_code: "",
      effective_date: "",
      end_date: "",
      base_salary: 0,
      new_salary: 0,
      status: "PENDING",
      is_current: 0,
      difference_amount: 0,
      percentage_change: 0,
      remark: "",
      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
    };

    if (this.employeeData) {
      this.form.employee_name = this.employeeData.FullName;
      this.form.employee_id = this.employeeData.EmployeeId;
      this.form.Position = this.employeeData.PositionName;
      this.form.Department = this.employeeData.DepartmentName;
      this.form.Placement = this.employeeData.PlacementName;
      this.form.adjustment_reason_code = "";
      if (this.employeeData.NewSalary > 0) {
        this.form.base_salary = this.employeeData.NewSalary;
      } else {
        this.form.base_salary = this.employeeData.BaseSalary;
      }
      this.form.new_salary = 0;
      this.form.is_current = this.employeeData.IsCurrent
        ? this.employeeData.IsCurrent
        : 0;
      this.form.status = this.employeeData.SalaryStatus
        ? this.employeeData.SalaryStatus
        : "PENDING";
    }
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    const formData = {
      ...this.form,
      status: "PENDING",
      difference_amount: this.salaryDifference,
      percentage_change: this.percentageChange,
    };

    console.log("form", this.form);
    this.$emit("save", formData);
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

  onAdjustmentReasonChange() {
    if (
      this.form.base_salary > 0 &&
      this.form.adjustment_reason_code === "INITIAL"
    ) {
      this.form.adjustment_reason_code = "";
      getToastError(
        this.$t("messages.employee.error.cannotSelectInitialWithExistingSalary")
      );
      return;
    }

    if (this.form.adjustment_reason_code === "INITIAL") {
      this.form.new_salary = this.form.base_salary;
    } else {
      this.form.new_salary = 0;
    }
  }

  onBaseSalaryChange() {
    // Auto-calculate percentage if new salary is already set
    if (this.form.base_salary > 0 && this.form.new_salary > 0) {
      this.calculatePercentage();
    }
  }

  onNewSalaryChange() {
    // Auto-calculate percentage when new salary changes
    if (this.form.base_salary > 0 && this.form.new_salary > 0) {
      this.calculatePercentage();
    }
  }

  calculatePercentage() {
    if (this.form.base_salary > 0) {
      const difference = this.form.new_salary - this.form.base_salary;
      const percentage = (difference / this.form.base_salary) * 100;
      // Store calculated values for display (optional)
      this.form.calculated_difference = difference;
      this.form.calculated_percentage = percentage;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({
      AdjustmentReason: Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insertSalaryAdjustment")}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.updateSalaryAdjustment")}`;
    }
  }

  get salaryDifference() {
    if (this.form.adjustment_reason_code === "INITIAL") {
      return 0;
    }
    if (this.form.base_salary > 0 && this.form.new_salary > 0) {
      return this.form.new_salary - this.form.base_salary;
    }
    return 0;
  }

  get percentageChange() {
    if (this.form.adjustment_reason_code === "INITIAL") {
      return 0;
    }
    if (this.form.base_salary > 0 && this.form.new_salary > 0) {
      return (
        ((this.form.new_salary - this.form.base_salary) /
          this.form.base_salary) *
        100
      );
    }
    return 0;
  }

  get isIncreaseDecrease() {
    const difference = this.salaryDifference;
    if (difference > 0) return "increase";
    if (difference < 0) return "decrease";
    return "same";
  }

  get disabledBaseSalary() {
    return (
      !this.form.employee_id ||
      !this.form.adjustment_reason_code ||
      this.form.adjustment_reason_code !== "INITIAL" ||
      this.modeData === $global.modeData.edit
    );
  }

  get disabledNewSalary() {
    return (
      !this.form.employee_id ||
      !this.form.adjustment_reason_code ||
      this.form.adjustment_reason_code === "INITIAL"
    );
  }

  get disabledAdjustmentReason() {
    return !this.form.employee_id;
  }

  get filteredAdjustmentReasonOptions() {
    if (!this.form.employee_id) {
      return [];
    }

    const baseSalary = parseFloat(this.form.base_salary) || 0;

    if (
      !this.form.is_current ||
      (this.form.is_current === 0 && this.form.status === "PENDING")
    ) {
      return this.adjustmentReasonOptions.filter(
        (option: any) => option.code === "INITIAL"
      );
    } else {
      return this.adjustmentReasonOptions.filter(
        (option: any) => option.code !== "INITIAL"
      );
    }
  }
}
