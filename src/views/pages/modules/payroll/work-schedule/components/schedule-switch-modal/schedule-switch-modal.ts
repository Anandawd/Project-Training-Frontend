import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

interface SwitchValidation {
  type: "ERROR" | "WARNING" | "INFO";
  category: string;
  message: string;
  details?: string;
}

interface MutualSwapOption {
  employee_id: string;
  employee_name: string;
  department_name: string;
  position_name: string;
  current_shift: string;
  compatibility_score: number;
}

const workScheduleAPI = new WorkScheduleAPI();

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
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
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
  employeeOptions!: any[];

  public isLoading = false;
  public validations: SwitchValidation[] = [];
  public mutualSwapOptions: MutualSwapOption[] = [];

  form: any = reactive({
    switch_type: "PERSONAL_REQUEST",
    requested_shift_code: "",
    target_employee_id: "",
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

  watch: any = {
    visible(newVal: boolean) {
      if (newVal && this.selectedEmployee) {
        this.initializeForm();
      }
    },
    "form.switch_type"(newVal: string) {
      this.onSwitchTypeChange(newVal);
    },
    "form.requested_shift_code"(newVal: string) {
      if (newVal) {
        this.validateSwitch();
      }
    },
  };

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = reactive({
      switch_type: "PERSONAL_REQUEST",
      requested_shift_code: "",
      target_employee_id: "",
      reason: "",
    });

    this.validations = [];
    this.mutualSwapOptions = [];
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

  async initializeForm() {
    this.resetForm();

    // Set default values if needed
    if (this.currentSchedule) {
      this.form.current_shift = this.currentSchedule.shift_code;
    }

    // Load mutual swap options if needed
    await this.loadMutualSwapOptions();
  }

  async onSwitchTypeChange(switchType: string) {
    this.validations = [];

    if (switchType === "MUTUAL_SWAP") {
      this.isLoading = true;
      try {
        await this.loadMutualSwapOptions();
      } catch (error) {
        console.error("Error loading mutual swap options:", error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.mutualSwapOptions = [];
      this.form.target_employee_id = "";
    }
  }

  validateSwitch() {
    this.validations = [];

    if (!this.form.requested_shift_code || !this.selectedEmployee) return;

    const currentShift = this.currentSchedule?.shift_code || "OFF";
    const requestedShift = this.form.requested_shift_code;

    // Same shift validation
    if (currentShift === requestedShift) {
      this.validations.push({
        type: "WARNING",
        category: "SAME_SHIFT",
        message: "Shift yang dipilih sama dengan shift saat ini",
      });
      return;
    }

    // Off to work validation
    if (currentShift === "OFF" && requestedShift !== "OFF") {
      this.validations.push({
        type: "INFO",
        category: "OFF_TO_WORK",
        message: "Mengubah hari libur menjadi hari kerja",
        details: "Akan menambah jam kerja mingguan",
      });
    }

    // Work to off validation
    if (currentShift !== "OFF" && requestedShift === "OFF") {
      this.validations.push({
        type: "INFO",
        category: "WORK_TO_OFF",
        message: "Mengubah hari kerja menjadi hari libur",
        details: "Akan mengurangi jam kerja mingguan",
      });
    }

    // Department compatibility check
    const newShift = this.availableShifts.find(
      (s) => s.code === requestedShift
    );
    if (newShift && newShift.departments && newShift.departments.length > 0) {
      if (
        !newShift.departments.includes(this.selectedEmployee.department_code)
      ) {
        this.validations.push({
          type: "WARNING",
          category: "DEPARTMENT_MISMATCH",
          message: `Shift ${newShift.name} biasanya untuk departemen lain`,
          details: `Direkomendasikan untuk: ${newShift.departments.join(", ")}`,
        });
      }
    }

    // Night shift validation
    if (newShift && newShift.is_night_shift) {
      this.validations.push({
        type: "INFO",
        category: "NIGHT_SHIFT",
        message: "Shift malam dipilih",
        details: "Pastikan karyawan siap untuk shift malam",
      });
    }

    // Overtime shift validation
    if (newShift && newShift.working_hours > 8) {
      this.validations.push({
        type: "WARNING",
        category: "OVERTIME_SHIFT",
        message: "Shift dengan jam kerja lebih dari 8 jam",
        details: `Total jam kerja: ${newShift.working_hours} jam`,
      });
    }
  }

  async submitSwitch() {
    if (!this.canProceed) return;

    this.isLoading = true;
    try {
      const switchData = {
        employee_id: this.selectedEmployee.employee_id,
        employee_name: this.selectedEmployee.employee_name,
        department_code: this.selectedEmployee.department_code,
        schedule_date: this.selectedDate,
        day_index: this.selectedDayIndex,
        current_shift_code: this.currentSchedule?.shift_code || "OFF",
        requested_shift_code: this.form.requested_shift_code,
        switch_type: this.form.switch_type,
        target_employee_id: this.form.target_employee_id,
        reason: this.form.reason,
        validations: this.validations,
        auto_approved: this.isAutoApproved,
        submitted_at: new Date().toISOString(),
      };

      // Emit the switch confirmation
      this.$emit("switch-confirmed", switchData);

      getToastSuccess("Permintaan pergantian jadwal berhasil diajukan");
      this.closeModal();
    } catch (error: any) {
      getToastError("Gagal memproses pergantian jadwal");
    } finally {
      this.isLoading = false;
    }
  }

  getShiftDisplayInfo(shiftCode: string) {
    if (!shiftCode || shiftCode === "OFF") {
      return {
        name: "Day Off",
        time: "Libur",
        color: "#6c757d",
        working_hours: 0,
      };
    }

    const shift = this.shiftOptions.find((s) => s.code === shiftCode);
    if (!shift) {
      return {
        name: "Unknown Shift",
        time: "",
        color: "#6c757d",
        working_hours: 0,
      };
    }

    let timeDisplay = "";
    if (shift.is_split && shift.split_times && shift.split_times.length > 0) {
      timeDisplay = shift.split_times
        .map((t: any) => `${t.start}-${t.end}`)
        .join(", ");
    } else if (shift.start_time && shift.end_time) {
      timeDisplay = `${shift.start_time}-${shift.end_time}`;
    } else {
      timeDisplay = "Flexibel";
    }

    return {
      name: shift.name,
      time: timeDisplay,
      color: shift.color || "#6c757d",
      working_hours: shift.working_hours || 0,
    };
  }

  getConflictIcon(conflictType: string): string {
    const iconMap: { [key: string]: string } = {
      SAME_SHIFT: "fa fa-exclamation-triangle",
      OFF_TO_WORK: "fa fa-arrow-up",
      WORK_TO_OFF: "fa fa-arrow-down",
      DEPARTMENT_MISMATCH: "fa fa-building",
      NIGHT_SHIFT: "fa fa-moon",
      OVERTIME_SHIFT: "fa fa-clock",
      ERROR: "fa fa-times-circle",
      WARNING: "fa fa-exclamation-triangle",
      INFO: "fa fa-info-circle",
    };

    return iconMap[conflictType] || "fa fa-question-circle";
  }

  async loadMutualSwapOptions() {
    if (!this.selectedEmployee || !this.selectedDate) return;

    try {
      // Filter employees for mutual swap
      this.mutualSwapOptions = this.employeeOptions
        .filter(
          (emp: any) => emp.employee_id !== this.selectedEmployee.employee_id
        )
        .map((emp: any) => ({
          employee_id: emp.employee_id,
          employee_name: emp.name,
          department_name: emp.department_name,
          position_name: emp.position_name,
          current_shift: "FO-M", // This should come from current schedule
          compatibility_score: this.calculateCompatibilityScore(emp),
        }))
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, 10); // Limit to top 10 matches
    } catch (error) {
      console.error("Error loading mutual swap options:", error);
      this.mutualSwapOptions = [];
    }
  }

  calculateCompatibilityScore(employee: any): number {
    let score = 0;

    // Same department gets higher score
    if (employee.department_code === this.selectedEmployee.department_code) {
      score += 30;
    }

    // Same position level gets moderate score
    if (employee.position_code === this.selectedEmployee.position_code) {
      score += 20;
    }

    // Add random factor for demonstration
    score += Math.random() * 50;

    return Math.round(score);
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

  get canProceed() {
    const hasRequiredFields =
      this.form.requested_shift_code &&
      this.form.reason &&
      this.form.reason.trim().length >= 10;

    const hasMutualSwapTarget =
      this.form.switch_type !== "MUTUAL_SWAP" || this.form.target_employee_id;

    const noBlockingErrors = !this.validations.some((v) => v.type === "ERROR");

    return hasRequiredFields && hasMutualSwapTarget && noBlockingErrors;
  }

  get isAutoApproved(): boolean {
    // Auto approve for basic implementation
    // In real scenario, this could be based on user permissions, shift type, etc.
    const emergencyTypes = ["EMERGENCY", "MANAGEMENT_DECISION"];
    return emergencyTypes.includes(this.form.switch_type);
  }

  get conflicts() {
    return this.validations.filter((v) => v.type === "ERROR");
  }

  get warningConflicts() {
    return this.validations.filter((v) => v.type === "WARNING");
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

  get hoursDifference() {
    if (!this.form.requested_shift_code) return 0;

    const currentHours = this.getShiftDisplayInfo(
      this.currentSchedule?.shift_code
    ).working_hours;
    const newHours = this.getShiftDisplayInfo(
      this.form.requested_shift_code
    ).working_hours;

    return newHours - currentHours;
  }
}
