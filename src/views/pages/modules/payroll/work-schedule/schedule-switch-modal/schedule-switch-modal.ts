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

interface ScheduleConflict {
  type:
    | "REST_TIME"
    | "CONSECUTIVE_DAYS"
    | "STAFF_LIMIT"
    | "SKILL_REQUIREMENT"
    | "OVERTIME_LIMIT";
  severity: "ERROR" | "WARNING" | "INFO";
  message: string;
  details?: any;
}

interface MutualSwapOption {
  employee_id: string;
  employee_name: string;
  department_name: string;
  current_shift: string;
  shift_date: string;
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
  emits: ["close", "switch-confirmed", "swap-confirmed"],
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

  public loading = false;
  public conflicts: ScheduleConflict[] = [];
  public mutualSwapOptions: MutualSwapOption[] = [];
  public departmentStaffing: any = {};
  public validationResult: any = null;

  private workScheduleAPI = new WorkScheduleAPI();

  form: any = reactive({
    switch_type: "PERSONAL_REQUEST",
    requested_shift_code: "",
    reason: "",
    target_employee_id: "",
    is_mutual_swap: false,
    emergency_override: false,
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

  workingDaysOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
  ];

  mounted(): void {
    if (this.visible && this.selectedEmployee) {
      this.checkDepartmentStaffing();
    }
  }

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = reactive({
      switch_type: "PERSONAL_REQUEST",
      requested_shift_code: "",
      reason: "",
      target_employee_id: "",
      is_mutual_swap: false,
      emergency_override: false,
    });

    this.conflicts = [];
    this.mutualSwapOptions = [];
    this.departmentStaffing = {};
    this.validationResult = null;
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

  // Watchers
  // @watch("form.requested_shift_code")
  onShiftChange() {
    if (this.form.requested_shift_code) {
      this.validateScheduleChange();
      this.loadMutualSwapOptions();
      this.checkDepartmentStaffing();
    }
  }

  // @watch("form.switch_type")
  onSwitchTypeChange() {
    if (this.form.switch_type === "MUTUAL_SWAP") {
      this.form.is_mutual_swap = true;
      this.loadMutualSwapOptions();
    } else {
      this.form.is_mutual_swap = false;
      this.form.target_employee_id = "";
    }
  }

  // Methods
  async validateScheduleChange() {
    if (!this.form.requested_shift_code || !this.selectedEmployee) return;

    this.loading = true;
    try {
      const { data } = await this.workScheduleAPI.CheckScheduleConflicts({
        employee_id: this.selectedEmployee.employee_id,
        schedule_date: this.selectedDate,
        current_shift_code: this.currentSchedule?.shift_code,
        requested_shift_code: this.form.requested_shift_code,
        check_type: "SWITCH_VALIDATION",
      });

      this.conflicts = data.conflicts || [];
      this.validationResult = data;

      // Auto-populate emergency override untuk critical conflicts
      if (
        this.criticalConflicts.length > 0 &&
        this.form.switch_type === "EMERGENCY"
      ) {
        this.form.emergency_override = true;
      }
    } catch (error) {
      getToastError("Gagal validasi perubahan jadwal");
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async loadMutualSwapOptions() {
    if (!this.form.is_mutual_swap || !this.selectedEmployee) return;

    try {
      // const { data } = await this.workScheduleAPI.GetMutualSwapOptions({
      //   employee_id: this.selectedEmployee.employee_id,
      //   schedule_date: this.selectedDate,
      //   requested_shift_code: this.form.requested_shift_code,
      //   department_code: this.selectedEmployee.department_code,
      // });
      // this.mutualSwapOptions = data || [];
    } catch (error) {
      console.error("Gagal load mutual swap options:", error);
    }
  }

  async checkDepartmentStaffing() {
    if (!this.selectedEmployee || !this.selectedDate) return;

    try {
      // const { data } = await this.workScheduleAPI.ValidateStaffCoverage({
      //   department_code: this.selectedEmployee.department_code,
      //   schedule_date: this.selectedDate,
      //   simulation_changes: [
      //     {
      //       employee_id: this.selectedEmployee.employee_id,
      //       from_shift: this.currentSchedule?.shift_code,
      //       to_shift: this.form.requested_shift_code,
      //     },
      //   ],
      // });
      // this.departmentStaffing = data;
    } catch (error) {
      console.error("Gagal check department staffing:", error);
    }
  }

  async submitSwitch() {
    if (!this.canProceed) return;

    this.loading = true;
    try {
      const switchData = {
        requester_employee_id: this.selectedEmployee.employee_id,
        target_employee_id: this.form.target_employee_id || null,
        schedule_date: this.selectedDate,
        current_shift_code: this.currentSchedule?.shift_code,
        requested_shift_code: this.form.requested_shift_code,
        switch_type: this.form.switch_type,
        reason: this.form.reason,
        emergency_override: this.form.emergency_override,
        conflicts_acknowledged: this.conflicts.map((c) => ({
          type: c.type,
          severity: c.severity,
          acknowledged: true,
        })),
      };

      const { data } = await this.workScheduleAPI.RequestScheduleSwitch(
        switchData
      );

      if (data.auto_approved) {
        getToastSuccess("Perubahan jadwal berhasil diterapkan");
        this.$emit("switch-confirmed", data);
      } else {
        getToastSuccess(
          "Permintaan perubahan jadwal telah disubmit untuk approval"
        );
        this.$emit("switch-confirmed", data);
      }

      this.closeModal();
    } catch (error: any) {
      if (error.response?.data?.message) {
        getToastError(error.response.data.message);
      } else {
        getToastError("Gagal submit perubahan jadwal");
      }
    } finally {
      this.loading = false;
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
      name: shift.shift_name,
      time: timeDisplay,
      color: shift.color_code || "#6c757d",
      category: shift.shift_category,
      working_hours: shift.working_hours || 0,
    };
  }

  getConflictIcon(conflictType: string) {
    const icons = {
      REST_TIME: "fa-bed",
      CONSECUTIVE_DAYS: "fa-calendar-times",
      STAFF_LIMIT: "fa-users",
      SKILL_REQUIREMENT: "fa-certificate",
      OVERTIME_LIMIT: "fa-clock",
    };
    return (
      icons[conflictType as keyof typeof icons] || "fa-exclamation-triangle"
    );
  }

  getConflictColor(severity: string) {
    const colors = {
      ERROR: "text-danger",
      WARNING: "text-warning",
      INFO: "text-info",
    };
    return colors[severity as keyof typeof colors] || "text-muted";
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

  get availableShifts() {
    if (!this.selectedEmployee) return this.shiftOptions;

    return this.shiftOptions.filter((shift: any) => {
      // filter berdasarkan department
      if (
        shift.applicable_departments &&
        shift.applicable_departments.length > 0
      ) {
        return shift.applicable_departments.includes(
          this.selectedEmployee.department_code
        );
      }

      // filter berdasarkan position
      if (shift.applicable_positions && shift.applicable_positions.length > 0) {
        return shift.applicable_positions.includes(
          this.selectedEmployee.position_code
        );
      }

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

  get criticalConflicts() {
    return this.conflicts.filter((c) => c.severity === "ERROR");
  }

  get warningConflicts() {
    return this.conflicts.filter((c) => c.severity === "WARNING");
  }

  get canProceed() {
    // Tidak bisa proceed jika ada critical conflicts dan bukan emergency override
    if (this.criticalConflicts.length > 0 && !this.form.emergency_override) {
      return false;
    }

    // Harus ada shift yang dipilih dan reason
    return this.form.requested_shift_code && this.form.reason.trim().length > 0;
  }

  get staffingImpact() {
    if (!this.departmentStaffing.current_shift_staffing) return null;

    const currentShiftStaff =
      this.departmentStaffing.current_shift_staffing[
        this.currentSchedule?.shift_code
      ] || 0;
    const newShiftStaff =
      this.departmentStaffing.current_shift_staffing[
        this.form.requested_shift_code
      ] || 0;

    return {
      current_shift_impact: currentShiftStaff - 1,
      new_shift_impact: newShiftStaff + 1,
      current_shift_minimum:
        this.departmentStaffing.minimum_staffing?.[
          this.currentSchedule?.shift_code
        ] || 0,
      new_shift_maximum:
        this.departmentStaffing.maximum_staffing?.[
          this.form.requested_shift_code
        ] || 999,
    };
  }
}
