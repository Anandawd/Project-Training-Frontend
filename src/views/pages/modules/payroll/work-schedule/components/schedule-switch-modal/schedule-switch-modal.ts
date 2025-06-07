import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import $global from "@/utils/global";
import { getToastError } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

interface BasicValidation {
  type: "WARNING" | "INFO";
  message: string;
}

@Options({
  name: "ScheduleSwitchModal",
  components: {
    CForm,
    CModal,
    CSelect,
    CInput,
    CDatepicker,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    selectedEmployee: {
      type: Object,
      default: null,
    },
    selectedDate: {
      type: String,
      default: "",
    },
    selectedDayIndex: {
      type: Number,
      default: -1,
    },
    shiftOptions: {
      type: Array,
      default: (): any[] => [],
    },
    currentSchedule: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "switch-confirmed"],
})
export default class ScheduleSwitchModal extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  visible!: boolean;
  selectedEmployee!: any;
  selectedDate!: string;
  selectedDayIndex!: number;
  shiftOptions!: any[];
  currentSchedule!: any;

  public isLoading = false;
  public validations: BasicValidation[] = [];

  private workScheduleAPI = new WorkScheduleAPI();

  form: any = reactive({
    switch_type: "PERSONAL_REQUEST",
    requested_shift_code: "",
    reason: "",
  });

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

  mounted(): void {
    if (this.visible && this.selectedEmployee) {
      this.initializeForm();
    }
  }

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = reactive({
      switch_type: "PERSONAL_REQUEST",
      requested_shift_code: "",
      reason: "",
    });

    this.validations = [];
  }

  closeModal() {
    this.resetForm();
    this.$emit("close");
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

  initializeForm() {
    this.resetForm();

    // Set default values if needed
    if (this.currentSchedule) {
      this.form.current_shift = this.currentSchedule.shift_code;
    }
  }

  onShiftChange() {
    if (this.form.requested_shift_code) {
      this.validateBasicSwitch();
    } else {
      this.validations = [];
    }
  }

  validateBasicSwitch() {
    this.validations = [];

    if (!this.form.requested_shift_code || !this.selectedEmployee) return;

    // Basic validations without complex rules
    const currentShift = this.currentSchedule?.shift_code || "OFF";
    const requestedShift = this.form.requested_shift_code;

    // Same shift validation
    if (currentShift === requestedShift) {
      this.validations.push({
        type: "WARNING",
        message: "Shift yang dipilih sama dengan shift saat ini",
      });
      return;
    }

    // Off to work validation
    if (currentShift === "OFF" && requestedShift !== "OFF") {
      this.validations.push({
        type: "INFO",
        message: "Mengubah hari libur menjadi hari kerja",
      });
    }

    // Work to off validation
    if (currentShift !== "OFF" && requestedShift === "OFF") {
      this.validations.push({
        type: "INFO",
        message: "Mengubah hari kerja menjadi hari libur",
      });
    }

    // Department compatibility (basic check)
    const newShift = this.availableShifts.find(
      (s) => s.code === requestedShift
    );
    if (newShift && newShift.departments && newShift.departments.length > 0) {
      if (
        !newShift.departments.includes(this.selectedEmployee.department_code)
      ) {
        this.validations.push({
          type: "WARNING",
          message: `Shift ${newShift.name} biasanya untuk departemen lain`,
        });
      }
    }
  }

  async submitSwitch() {
    if (!this.canProceed) return;

    this.isLoading = true;
    try {
      const switchData = {
        employee_id: this.selectedEmployee.employee_id,
        employee_name: this.selectedEmployee.employee_name,
        schedule_date: this.selectedDate,
        day_index: this.selectedDayIndex,
        current_shift_code: this.currentSchedule?.shift_code || "OFF",
        requested_shift_code: this.form.requested_shift_code,
        switch_type: this.form.switch_type,
        reason: this.form.reason,
        validations_acknowledged: this.validations.map((v) => v.message),
        auto_approved: true, // Basic implementation auto-approves
      };

      // Emit the switch confirmation
      this.$emit("switch-confirmed", switchData);

      this.closeModal();
    } catch (error: any) {
      getToastError("Gagal memproses pergantian jadwal");
      console.error("Switch error:", error);
    } finally {
      this.isLoading = false;
    }
  }

  getShiftDisplayInfo(shiftCode: string) {
    const shift = this.availableShifts.find((s) => s.code === shiftCode);
    if (!shift) return { name: "Unknown", time: "", color: "#6c757d" };

    let timeDisplay = "";
    if (shift.split_times && shift.split_times.length > 0) {
      timeDisplay = shift.split_times
        .map((t: any) => `${t.start}-${t.end}`)
        .join(", ");
    } else if (shift.start_time && shift.end_time) {
      timeDisplay = `${shift.start_time}-${shift.end_time}`;
    } else {
      timeDisplay = "Day Off";
    }

    return {
      name: shift.name,
      time: timeDisplay,
      color: shift.color || "#6c757d",
      working_hours: shift.working_hours || 0,
    };
  }

  // validation
  get schema() {
    return Yup.object().shape({
      // RequestedShift: Yup.string().required("Pilih shift yang diinginkan"),
      // Reason: Yup.string()
      //   .required("Alasan wajib diisi")
      //   .min(10, "Alasan minimal 10 karakter"),
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

  get availableShifts() {
    if (!this.selectedEmployee) return this.shiftOptions;

    // Filter shifts based on employee's department (basic filtering)
    return this.shiftOptions.filter((shift: any) => {
      // Always allow OFF shift
      if (shift.code === "OFF") return true;

      // If shift has department restrictions, check them
      if (shift.departments && shift.departments.length > 0) {
        return shift.departments.includes(
          this.selectedEmployee.department_code
        );
      }

      // If no department restrictions, allow all shifts
      return true;
    });
  }

  get switchTypeOptions() {
    return [
      { code: "PERSONAL_REQUEST", name: "Personal Request" },
      { code: "MANAGEMENT_DECISION", name: "Management Decision" },
      { code: "EMERGENCY", name: "Emergency Adjustment" },
      { code: "MUTUAL_SWAP", name: "Mutual Swap with Colleague" },
    ];
  }

  get selectedShiftDetails() {
    if (!this.form.requested_shift_code) return null;
    return this.availableShifts.find(
      (shift) => shift.code === this.form.requested_shift_code
    );
  }

  get canProceed() {
    // Basic validation: must have shift and reason
    return (
      this.form.requested_shift_code &&
      this.form.reason &&
      this.form.reason.trim().length >= 10
    );
  }

  get currentShiftInfo() {
    if (!this.currentSchedule) return this.getShiftDisplayInfo("OFF");
    return this.getShiftDisplayInfo(this.currentSchedule.shift_code);
  }

  get newShiftInfo() {
    if (!this.form.requested_shift_code) return null;
    return this.getShiftDisplayInfo(this.form.requested_shift_code);
  }

  get hoursDifference() {
    if (!this.newShiftInfo) return 0;
    const currentHours = this.currentShiftInfo.working_hours;
    const newHours = this.newShiftInfo.working_hours;
    return newHours - currentHours;
  }

  get dayName() {
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const date = new Date(this.selectedDate);
    return dayNames[date.getDay()];
  }

  get formattedDate() {
    if (!this.selectedDate) return "";
    const date = new Date(this.selectedDate);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
