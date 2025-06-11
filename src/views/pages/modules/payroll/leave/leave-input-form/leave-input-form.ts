import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { getToastError } from "@/utils/toast";
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
    leaveTypeOptions: {
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
  leaveTypeOptions!: any[];

  public form: any = reactive({});

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

  columnEmployeeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      label: "id",
      field: "employee_id",
      align: "right",
      width: "100",
    },
  ];

  mounted(): void {
    this.$watch(
      () => [this.form.start_date, this.form.end_date],
      ([newStartDate, newEndDate]) => {
        this.calculateTotalDays();
      }
    );
  }

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
      placement_code: "",
      placement_name: "",
      total_quota_leave: 0,
      total_remaining_leave: 0,
      leave_type_name: "",
      leave_type_code: "",
      reason: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      total_days: 0,
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
    this.$emit("save", this.form);
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
        this.form.placement_code = selectedEmployee.placement_code;
        this.form.placement_name = selectedEmployee.placement_name;
        this.form.total_quota_leave = selectedEmployee.total_quota_leave;
        this.form.total_remaining_leave =
          selectedEmployee.total_remaining_leave;
      }
    } else {
      this.form.employee_name = "";
      this.form.department_code = "";
      this.form.department_name = "";
      this.form.position_code = "";
      this.form.position_name = "";
      this.form.placement_code = "";
      this.form.placement_name = "";
      this.form.total_quota_leave = 0;
      this.form.total_remaining_leave = 0;
    }
  }

  onLeaveTypeChange() {
    if (this.form.leave_type_code) {
      const selectedLeaveType = this.leaveTypeOptions.find(
        (item: any) => item.code === this.form.leave_type_code
      );

      if (selectedLeaveType) {
        this.form.leave_type_name = selectedLeaveType.name;
      }
    } else {
      this.form.leave_type_name = "";
    }
  }

  onDateChange() {
    if (this.form.start_date || this.form.end_date) {
      // menghitung total_days
    }
  }

  calculateTotalDays() {
    if (this.form.start_date && this.form.end_date) {
      const startDate = new Date(this.form.start_date);
      const endDate = new Date(this.form.end_date);

      if (endDate < startDate) {
        this.form.end_date = this.form.start_date;
        this.form.total_days = 1;
        return;
      }

      const timeDifference = endDate.getTime() - startDate.getTime();
      const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;

      this.form.total_days = dayDifference;

      this.validateLeaveDays();
    } else {
      this.form.total_days = 0;
    }
  }

  validateLeaveDays() {
    if (
      this.form.total_days > this.form.total_remaining_leave &&
      this.form.total_remaining_leave > 0
    ) {
      getToastError(
        this.$t("messages.attendance.error.insufficientLeaveBalance", {
          requested: this.form.total_days,
          available: this.form.total_remaining_leave,
        })
      );
    }
  }

  // Helper untuk menghitung hari kerja (exclude weekend)
  calculateWorkingDays(): number {
    if (!this.form.start_date || !this.form.end_date) return 0;

    const startDate = new Date(this.form.start_date);
    const endDate = new Date(this.form.end_date);

    let workingDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return workingDays;
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

  get isWeekendIncluded(): boolean {
    // Untuk beberapa jenis cuti, weekend mungkin tidak dihitung
    return !["T02", "T03", "T04"].includes(this.form.leave_type_code); // Sick, Maternity, Paternity leave
  }

  get remainingLeaveAfterRequest(): number {
    return Math.max(0, this.form.total_remaining_leave - this.form.total_days);
  }
}
