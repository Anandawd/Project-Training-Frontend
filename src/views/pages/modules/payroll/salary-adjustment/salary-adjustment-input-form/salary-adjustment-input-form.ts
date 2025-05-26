import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "InputForm",
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
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    adjustmentReasonOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  employeeOptions!: any[];
  adjustmentReasonOptions!: any[];

  public defaultForm: any = {};
  public form: any = reactive({});

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "employee_id",
      label: "id",
      align: "right",
      width: "100",
    },
  ];

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: null,
      employee_id: "",
      employee_name: "",
      department_code: "",
      department_name: "",
      position_code: "",
      position_name: "",
      adjustment_reason_code: "",
      adjustment_reason_name: "",
      effective_date: new Date().toISOString().split("T")[0],
      current_salary: 0,
      new_salary: 0,
      remark: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    const formData = {
      ...this.form,
      difference_amount: this.form.new_salary - this.form.current_salary,
      percentage_change:
        this.form.current_salary > 0
          ? ((this.form.new_salary - this.form.current_salary) /
              this.form.current_salary) *
            100
          : 0,
    };
    console.log("onSave formData", formData);
    this.$emit("save", formData);
  }

  checkForm() {
    console.log(this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onEmployeeChange() {
    if (this.form.employee_id) {
      const selectedEmployee = this.employeeOptions.find(
        (emp: any) => emp.employee_id === this.form.employee_id
      );

      if (selectedEmployee) {
        this.form.employee_name = selectedEmployee.name;
        this.form.department_code = selectedEmployee.department_code;
        this.form.department_name = selectedEmployee.department_name;
        this.form.position_code = selectedEmployee.position_code;
        this.form.position_name = selectedEmployee.position_name;
        this.form.current_salary = selectedEmployee.current_salary;
      }
    } else {
      this.form.employee_name = "";
      this.form.department_code = "";
      this.form.department_name = "";
      this.form.position_code = "";
      this.form.position_name = "";
      this.form.current_salary = 0;
    }
  }

  onCurrentSalaryChange() {
    // Auto-calculate percentage if new salary is already set
    if (this.form.current_salary > 0 && this.form.new_salary > 0) {
      this.calculatePercentage();
    }
  }

  onNewSalaryChange() {
    // Auto-calculate percentage when new salary changes
    if (this.form.current_salary > 0 && this.form.new_salary > 0) {
      this.calculatePercentage();
    }
  }

  calculatePercentage() {
    if (this.form.current_salary > 0) {
      const difference = this.form.new_salary - this.form.current_salary;
      const percentage = (difference / this.form.current_salary) * 100;
      // Store calculated values for display (optional)
      this.form.calculated_difference = difference;
      this.form.calculated_percentage = percentage;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({});
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }

  get salaryDifference() {
    if (this.form.current_salary && this.form.new_salary) {
      return this.form.new_salary - this.form.current_salary;
    }
    return 0;
  }

  get percentageChange() {
    if (
      this.form.current_salary &&
      this.form.new_salary &&
      this.form.current_salary > 0
    ) {
      return (
        ((this.form.new_salary - this.form.current_salary) /
          this.form.current_salary) *
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
}
