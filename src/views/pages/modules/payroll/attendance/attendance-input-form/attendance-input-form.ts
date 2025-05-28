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
    statusOptions: {
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
  statusOptions!: any[];

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
      field: "name",
      label: "name",
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
      current_schedule_code: "",
      current_schedule_name: "",
      date: new Date().toISOString().split("T")[0],
      check_in: "",
      check_out: "",
      default_working_hours: 0,
      working_hours: 0,
      overtime: 0,
      status: "",
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
    const { totalWorkingHours, totalOvertime } = this.calculateWorkingHours();

    let finalStatus = this.form.status;
    if (!finalStatus && this.form.check_in) {
      finalStatus = this.determineStatusByCheckIn();
    }
    const formData = {
      ...this.form,
      working_hours: totalWorkingHours ? totalWorkingHours : 0,
      overtime: totalOvertime,
      status: finalStatus,
    };
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
        this.form.current_schedule_code =
          selectedEmployee.current_schedule_code;
        this.form.current_schedule_name =
          selectedEmployee.current_schedule_name;
        this.form.default_working_hours =
          selectedEmployee.default_working_hours;
      }
    }
  }

  calculateWorkingHours() {
    if (!this.form.check_in || !this.form.check_out) {
      return { totalWorkingHours: 0, totalOvertime: 0 };
    }

    const checkInMinutes = this.timeStringToMinutes(this.form.check_in);
    const checkOutMinutes = this.timeStringToMinutes(this.form.check_out);

    let totalMinutes = checkOutMinutes - checkInMinutes;

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    // Konversi ke jam (desimal)
    const totalWorkingHours = Number((totalMinutes / 60).toFixed(2));

    // Hitung overtime
    let totalOvertime = 0;
    const defaultHours = this.form.default_working_hours || 8;

    if (totalWorkingHours > defaultHours) {
      totalOvertime = Number((totalWorkingHours - defaultHours).toFixed(2));
    }

    return { totalWorkingHours, totalOvertime };
  }

  timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  determineStatusByCheckIn(): string {
    if (!this.form.check_in) return "PRESENT";
    // Asumsi jam kerja normal dimulai 08:00

    const standardStartTime = "08:00";
    const checkInMinutes = this.timeStringToMinutes(this.form.check_in);
    const standardMinutes = this.timeStringToMinutes(standardStartTime);

    // Jika terlambat lebih dari 15 menit, status LATE
    if (checkInMinutes > standardMinutes + 15) {
      return "LATE";
    }

    return "PRESENT";
  }

  // validation
  get schema() {
    return Yup.object().shape({
      SelectEmployee: Yup.string().required(),
      Date: Yup.date().required(),
      CheckIn: Yup.string().required(),
      CheckOut: Yup.string().required(),
      Status: Yup.string().required(),
    });
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

  get calculatedWorkingHours() {
    return this.calculateWorkingHours().totalWorkingHours;
  }

  get calculatedOvertime() {
    return this.calculateWorkingHours().totalOvertime;
  }
}
