import CCheckbox from "@/components/checkbox/checkbox.vue";
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
    CCheckbox,
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
    workScheduleOptions: {
      type: Array,
      default: (): any[] => [],
    },
    workScheduleTypeOptions: {
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
  workScheduleOptions!: any[];
  workScheduleTypeOptions!: any[];

  public form: any = reactive({});

  columnEmployeeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
      filter: true,
    },
    {
      field: "employee_id",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

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

  // Working days options (0 = Sunday, 1 = Monday, etc.)
  // workingDaysOptions = [
  //   { value: 1, label: this.$t("labels.payroll.attendance.monday") },
  //   { value: 2, label: this.$t("labels.payroll.attendance.tuesday") },
  //   { value: 3, label: this.$t("labels.payroll.attendance.wednesday") },
  //   { value: 4, label: this.$t("labels.payroll.attendance.thursday") },
  //   { value: 5, label: this.$t("labels.payroll.attendance.friday") },
  //   { value: 6, label: this.$t("labels.payroll.attendance.saturday") },
  //   { value: 0, label: this.$t("labels.payroll.attendance.sunday") },
  // ];

  workingDaysOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
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
      placement_code: "",
      placement_name: "",
      work_schedule_code: "",
      work_schedule_name: "",
      work_schedule_type_code: "",
      work_schedule_type_name: "",
      working_days: [1, 2, 3, 4, 5], // Default: Monday to Friday
      start_time: "08:00",
      end_time: "17:00",
      break_duration: 60, // minutes
      effective_start_date: new Date().toISOString().split("T")[0],
      effective_end_date: "",
      is_current: true,
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
      }
    } else {
      this.form.employee_name = "";
      this.form.department_code = "";
      this.form.department_name = "";
      this.form.position_code = "";
      this.form.position_name = "";
      this.form.placement_code = "";
      this.form.placement_name = "";
    }
  }

  onWorkScheduleChange() {
    if (this.form.work_schedule_code) {
      const selectedSchedule = this.workScheduleOptions.find(
        (schedule: any) => schedule.code === this.form.work_schedule_code
      );

      if (selectedSchedule) {
        this.form.work_schedule_name = selectedSchedule.name;
        this.form.work_schedule_type_code =
          selectedSchedule.work_schedule_type_code;
        this.form.work_schedule_type_name =
          selectedSchedule.work_schedule_type_name;
        this.form.working_days = selectedSchedule.working_days || [
          1, 2, 3, 4, 5,
        ];
        this.form.start_time = selectedSchedule.default_start_time || "08:00";
        this.form.end_time = selectedSchedule.default_end_time || "17:00";
        this.form.break_duration =
          selectedSchedule.default_break_duration || 60;
      } else {
        this.form.work_schedule_name = "";
        this.form.work_schedule_type_code = "";
        this.form.work_schedule_type_name = "";
      }
    }
  }

  onWorkingDayToggle(dayValue: number) {
    const index = this.form.working_days.indexOf(dayValue);
    if (index > -1) {
      this.form.working_days.splice(index, 1);
    } else {
      this.form.working_days.push(dayValue);
    }
    this.form.working_days.sort((a: number, b: number) => a - b);
  }

  calculateWorkingHours(): number {
    if (!this.form.start_time || !this.form.end_time) return 0;

    const startMinutes = this.timeStringToMinutes(this.form.start_time);
    const endMinutes = this.timeStringToMinutes(this.form.end_time);

    let totalMinutes = endMinutes - startMinutes;
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts

    // Subtract break duration
    totalMinutes -= this.form.break_duration || 0;

    return Number((totalMinutes / 60).toFixed(2));
  }

  timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
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

  get workingDaysText(): string {
    const dayNames = {
      0: this.$t("labels.payroll.workSchedule.sunday"),
      1: this.$t("labels.payroll.workSchedule.monday"),
      2: this.$t("labels.payroll.workSchedule.tuesday"),
      3: this.$t("labels.payroll.workSchedule.wednesday"),
      4: this.$t("labels.payroll.workSchedule.thursday"),
      5: this.$t("labels.payroll.workSchedule.friday"),
      6: this.$t("labels.payroll.workSchedule.saturday"),
    };
    return this.form.working_days
      .map((day: number) => dayNames[day as keyof typeof dayNames])
      .join(", ");
  }

  get calculatedWorkingHours(): number {
    return this.calculateWorkingHours();
  }
}
