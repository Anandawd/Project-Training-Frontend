import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import { getError } from "@/utils/general";
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";
import ScheduleSwitchModal from "./components/schedule-switch-modal/schedule-switch-modal.vue";
import CInputForm from "./components/work-schedule-input-form/work-schedule-input-form.vue";

interface EmployeeSchedule {
  id?: number | string;
  employee_id: string;
  employee_name: string;
  department_code: string;
  department_name: string;
  position_code: string;
  position_name: string;
  placement_code: string;
  placement_name: string;
  daily_schedules: DailySchedule[];
  weekly_hours: number;
  overtime_hours: number;
  conflicts: ScheduleConflict[];
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
}

interface DailySchedule {
  day_index: number;
  date: string;
  shift_code: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  working_hours: number;
  is_overtime: boolean;
  status: "SCHEDULED" | "CONFIRMED" | "MODIFIED" | "ABSENT" | "COMPLETED";
  conflicts: string[];
  switch_requests: any[];
}

interface ScheduleConflict {
  type:
    | "REST_TIME"
    | "CONSECUTIVE_DAYS"
    | "STAFF_LIMIT"
    | "SKILL_REQUIREMENT"
    | "OVERTIME_LIMIT";
  severity: "ERROR" | "WARNING" | "INFO";
  message: string;
  day_index?: number;
}

interface WeeklyStats {
  total_employees: number;
  total_working_hours: number;
  total_overtime_hours: number;
  department_coverage: { [key: string]: number };
  shift_coverage: { [key: string]: number };
  conflicts_count: number;
  pending_switches: number;
}

interface BulkOperation {
  type: "ASSIGN_SHIFT" | "COPY_PATTERN" | "APPLY_TEMPLATE" | "MASS_SWITCH";
  target_employees: string[];
  target_days: number[];
  parameters: any;
}

const workScheduleAPI = new WorkScheduleAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
    CSelect,
    CInput,
    ScheduleSwitchModal,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    currentWeekStart: {
      type: Date,
      required: true,
    },
    weekDays: {
      type: Array,
      required: true,
    },
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    shiftOptions: {
      type: Array,
      default: (): any[] => [],
    },
    departmentOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["week-changed", "schedule-updated", "conflict-detected"],
})
export default class WorkSchedule extends Vue {
  // Props
  currentWeekStart!: Date;
  weekDays!: any[];
  employeeOptions!: any[];
  shiftOptions!: any[];
  departmentOptions!: any[];

  // Data
  public employeeSchedules: EmployeeSchedule[] = [];
  public weeklyStats: WeeklyStats = this.getEmptyStats();
  public selectedCells: Set<string> = new Set();
  public draggedShift: string | null = null;
  public isLoading = false;
  public modeData: any;

  // modal
  public availableTemplates: any[] = [];
  public showTemplateModal = false;
  public selectedTemplate: any = null;

  // Bulk Operations
  public bulkMode = false;
  public bulkOperation: BulkOperation | null = null;
  public showBulkModal = false;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Filters & Settings
  public filters = reactive({
    department: "",
    position: "",
    shift: "",
    status: "",
    show_conflicts_only: false,
    show_overtime_only: false,
  });

  public viewSettings = reactive({
    group_by_department: false,
    show_employee_photos: true,
    show_shift_colors: true,
    show_working_hours: true,
    show_conflicts: true,
    auto_refresh: false,
    compact_view: false,
  });

  // Conflict Management
  public realTimeValidation = true;
  public conflictSummary: { [key: string]: number } = {};

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
      width: "150",
      filter: true,
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  // RECYCLE LIFE FUNCTION =======================================================
  created(): void {
    this.loadData();
    this.setupRealTimeValidation();
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.loadMockData();
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.employeeSchedules = [
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_code: "FRONT_OFFICE",
        department_name: "Front Office",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        weekly_hours: 40,
        overtime_hours: 8,
        conflicts: [
          {
            type: "CONSECUTIVE_DAYS",
            severity: "WARNING",
            message: "Working 6 consecutive days",
            day_index: 6,
          },
        ],
        daily_schedules: [
          {
            day_index: 1,
            date: this.weekDays[0]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "CONFIRMED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 2,
            date: this.weekDays[1]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 3,
            date: this.weekDays[2]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 4,
            date: this.weekDays[3]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 5,
            date: this.weekDays[4]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 6,
            date: this.weekDays[5]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
        ],
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
      {
        id: 2,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_code: "HOUSEKEEPING",
        department_name: "Housekeeping",
        position_code: "SUPERVISOR",
        position_name: "Supervisor",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        weekly_hours: 40,
        overtime_hours: 8,
        conflicts: [
          {
            type: "CONSECUTIVE_DAYS",
            severity: "WARNING",
            message: "Working 6 consecutive days",
            day_index: 6,
          },
        ],
        daily_schedules: [
          {
            day_index: 1,
            date: this.weekDays[0]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "CONFIRMED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 2,
            date: this.weekDays[1]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 3,
            date: this.weekDays[2]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 4,
            date: this.weekDays[3]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 5,
            date: this.weekDays[4]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
          {
            day_index: 6,
            date: this.weekDays[5]?.date,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
            conflicts: [],
            switch_requests: [],
          },
        ],
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
    ];

    this.validateAllSchedules();
  }

  async loadDropdown() {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      const promises = [
        workScheduleAPI.GetEmployeeOptionsForSchedule().then(response => {
          this.employeeOptions = response.data;
        }),
        workScheduleAPI.GetSchedulePatternOptions().then(response => {
          this.workScheduleOptions = response.data;
        }),
        workScheduleAPI.GetWorkScheduleTypeOptions().then(response => {
          this.workScheduleTypeOptions = response.data;
        }),
        workScheduleAPI.GetShiftOptions().then(response => {
          this.shiftOptions = response.data;
        }),
      ];

      await Promise.all(promises);
      */

      this.employeeOptions = [
        {
          employee_id: "EMP001",
          name: "John Doe",
          department_code: "FRONT_OFFICE",
          department_name: "Front Office",
          position_code: "STAFF",
          position_name: "Staff",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
        {
          employee_id: "EMP002",
          name: "Jane Smith",
          department_code: "HOUSEKEEPING",
          department_name: "Housekeeping",
          position_code: "SUPERVISOR",
          position_name: "Supervisor",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
        {
          employee_id: "EMP003",
          name: "Robert Johnson",
          department_code: "RESTAURANT",
          department_name: "Restaurant",
          position_code: "CHEF",
          position_name: "Chef",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
      ];

      this.shiftOptions = [
        // Day shifts
        {
          code: "FO-M",
          name: "Front Office Morning",
          start_time: "07:00",
          end_time: "15:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["FRONT_OFFICE", "GUEST_RELATIONS"],
          color: "#28a745",
        },
        {
          code: "FO-E",
          name: "Front Office Evening",
          start_time: "15:00",
          end_time: "23:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["FRONT_OFFICE", "GUEST_RELATIONS"],
          color: "#ffc107",
        },
        {
          code: "FO-N",
          name: "Front Office Night",
          start_time: "23:00",
          end_time: "07:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["FRONT_OFFICE"],
          color: "#343a40",
        },

        // Housekeeping shifts
        {
          code: "HK-M",
          name: "Housekeeping Morning",
          start_time: "08:00",
          end_time: "16:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["HOUSEKEEPING", "LAUNDRY"],
          color: "#17a2b8",
        },
        {
          code: "HK-E",
          name: "Housekeeping Evening",
          start_time: "14:00",
          end_time: "22:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["HOUSEKEEPING"],
          color: "#fd7e14",
        },

        // F&B shifts
        {
          code: "FB-B",
          name: "F&B Breakfast",
          start_time: "05:00",
          end_time: "13:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["RESTAURANT", "KITCHEN", "BAR"],
          color: "#e83e8c",
        },
        {
          code: "FB-L",
          name: "F&B Lunch",
          start_time: "10:00",
          end_time: "18:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["RESTAURANT", "KITCHEN", "BAR"],
          color: "#6610f2",
        },
        {
          code: "FB-D",
          name: "F&B Dinner",
          start_time: "16:00",
          end_time: "00:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["RESTAURANT", "KITCHEN", "BAR"],
          color: "#6f42c1",
        },

        // Security & Engineering
        {
          code: "SEC-D",
          name: "Security Day",
          start_time: "06:00",
          end_time: "18:00",
          working_hours: 12,
          is_overtime: true,
          departments: ["SECURITY"],
          color: "#dc3545",
        },
        {
          code: "SEC-N",
          name: "Security Night",
          start_time: "18:00",
          end_time: "06:00",
          working_hours: 12,
          is_overtime: true,
          departments: ["SECURITY"],
          color: "#721c24",
        },
        {
          code: "ENG-M",
          name: "Engineering Morning",
          start_time: "07:00",
          end_time: "15:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["ENGINEERING", "MAINTENANCE"],
          color: "#20c997",
        },

        // Split shifts
        {
          code: "FB-SP1",
          name: "F&B Split Breakfast/Dinner",
          start_time: "06:00",
          end_time: "10:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["RESTAURANT", "KITCHEN"],
          color: "#6c757d",
          is_split: true,
          split_times: [
            { start: "06:00", end: "10:00" },
            { start: "17:00", end: "21:00" },
          ],
        },
        {
          code: "FB-SP2",
          name: "F&B Split Lunch/Dinner",
          start_time: "11:00",
          end_time: "15:00",
          working_hours: 8,
          is_overtime: false,
          departments: ["RESTAURANT", "KITCHEN"],
          color: "#adb5bd",
          is_split: true,
          split_times: [
            { start: "11:00", end: "15:00" },
            { start: "18:00", end: "22:00" },
          ],
        },

        // Day off
        {
          code: "OFF",
          name: "Day Off",
          start_time: "",
          end_time: "",
          working_hours: 0,
          is_overtime: false,
          departments: [],
          color: "#6c757d",
        },
      ];
    } catch (error) {
      getError(error);
    }
  }

  async loadWeeklyStats() {
    this.weeklyStats = {
      total_employees: this.employeeSchedules.length,
      total_working_hours: this.employeeSchedules.reduce(
        (sum, emp) => sum + emp.weekly_hours,
        0
      ),
      total_overtime_hours: this.employeeSchedules.reduce(
        (sum, emp) => sum + emp.overtime_hours,
        0
      ),
      department_coverage: this.calculateDepartmentCoverage(),
      shift_coverage: this.calculateShiftCoverage(),
      conflicts_count: this.getTotalConflicts(),
      pending_switches: this.getPendingSwitches(),
    };
  }

  async loadAvailableTemplates() {
    try {
      // const { data } = await this.workScheduleAPI.GetScheduleTemplates({ is_active: true });
      // this.availableTemplates = data;

      this.availableTemplates = [
        {
          id: 1,
          template_name: "Front Office 7-Day Rotation",
          template_code: "FO-ROT-7D",
        },
        { id: 2, template_name: "Housekeeping Fixed", template_code: "HK-FIX" },
        { id: 3, template_name: "F&B Split Shifts", template_code: "FB-SPLIT" },
      ];
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  }

  // Schedule Operations
  async updateEmployeeSchedule(
    employeeId: string,
    dayIndex: number,
    shiftCode: string,
    reason?: string
  ) {
    try {
      const employee = this.employeeSchedules.find(
        (emp) => emp.employee_id === employeeId
      );
      if (!employee) return;

      const daySchedule = employee.daily_schedules.find(
        (ds) => ds.day_index === dayIndex
      );
      if (!daySchedule) return;

      // Validate the change
      const conflicts = this.validateScheduleChange(
        employee,
        dayIndex,
        shiftCode
      );

      if (conflicts.some((c) => c.severity === "ERROR")) {
        getToastError(
          "Cannot update schedule: " +
            conflicts.find((c) => c.severity === "ERROR")?.message
        );
        return;
      }

      if (conflicts.some((c) => c.severity === "WARNING")) {
        getToastError(
          "Schedule updated with warnings: " +
            conflicts.find((c) => c.severity === "WARNING")?.message
        );
      }

      // Update the schedule
      const shift = this.shiftOptions.find((s) => s.code === shiftCode);
      if (shift) {
        daySchedule.shift_code = shiftCode;
        daySchedule.shift_name = shift.name;
        daySchedule.start_time = shift.start_time || "";
        daySchedule.end_time = shift.end_time || "";
        daySchedule.working_hours = shift.working_hours || 0;
        daySchedule.status = "MODIFIED";
      }

      // Recalculate employee stats
      this.recalculateEmployeeStats(employee);

      // Revalidate
      this.validateAllSchedules();

      this.$emit("schedule-updated", {
        employeeId,
        dayIndex,
        shiftCode,
        reason,
      });
    } catch (error) {
      throw error;
    }
  }

  validateScheduleChange(
    employee: EmployeeSchedule,
    dayIndex: number,
    newShiftCode: string
  ): ScheduleConflict[] {
    // Create a copy of the schedule for validation
    const tempEmployee = JSON.parse(JSON.stringify(employee));
    const daySchedule = tempEmployee.daily_schedules.find(
      (ds: any) => ds.day_index === dayIndex
    );

    if (daySchedule) {
      daySchedule.shift_code = newShiftCode;
      const shift = this.shiftOptions.find((s) => s.code === newShiftCode);
      if (shift) {
        daySchedule.working_hours = shift.working_hours || 0;
      }
    }

    return this.validateEmployeeSchedule(tempEmployee);
  }

  recalculateEmployeeStats(employee: EmployeeSchedule) {
    employee.weekly_hours = employee.daily_schedules.reduce(
      (sum, ds) => sum + ds.working_hours,
      0
    );
    employee.overtime_hours = Math.max(0, employee.weekly_hours - 40);
  }

  // Bulk Operations
  toggleBulkMode() {
    this.bulkMode = !this.bulkMode;
    if (!this.bulkMode) {
      this.clearSelection();
    }

    getToastInfo(this.bulkMode ? "Bulk mode enabled" : "Bulk mode disabled");
  }

  updateBulkOperation() {
    if (this.selectedCells.size === 0) {
      this.bulkOperation = null;
      return;
    }

    const employees = new Set<string>();
    const days = new Set<number>();

    this.selectedCells.forEach((cellId) => {
      const [employeeId, dayIndex] = cellId.split("-");
      employees.add(employeeId);
      days.add(parseInt(dayIndex));
    });

    this.bulkOperation = {
      type: "ASSIGN_SHIFT",
      target_employees: Array.from(employees),
      target_days: Array.from(days),
      parameters: {},
    };
  }

  async executeBulkOperation(operation: BulkOperation) {
    try {
      const promises: Promise<any>[] = [];

      operation.target_employees.forEach((employeeId) => {
        operation.target_days.forEach((dayIndex) => {
          if (
            operation.type === "ASSIGN_SHIFT" &&
            operation.parameters.shift_code
          ) {
            promises.push(
              this.updateEmployeeSchedule(
                employeeId,
                dayIndex,
                operation.parameters.shift_code,
                operation.parameters.reason
              )
            );
          }
        });
      });

      await Promise.all(promises);

      this.clearSelection();
      this.bulkMode = false;

      getToastSuccess(
        `Bulk operation completed for ${promises.length} schedule changes`
      );
    } catch (error) {
      getToastError("Bulk operation failed");
    }
  }

  // Template Operations
  async applyTemplateToEmployee(employeeId: string, templateId: number) {
    try {
      // const { data } = await this.workScheduleAPI.GetTemplateDetails(templateId);
      // Apply template logic here

      getToastSuccess("Template applied successfully");
      await this.loadData();
    } catch (error) {
      getToastError("Failed to apply template");
    }
  }

  // Utility Methods
  getEmptyStats(): WeeklyStats {
    return {
      total_employees: 0,
      total_working_hours: 0,
      total_overtime_hours: 0,
      department_coverage: {},
      shift_coverage: {},
      conflicts_count: 0,
      pending_switches: 0,
    };
  }

  calculateDepartmentCoverage(): { [key: string]: number } {
    const coverage: { [key: string]: number } = {};

    this.employeeSchedules.forEach((emp) => {
      if (!coverage[emp.department_code]) {
        coverage[emp.department_code] = 0;
      }
      coverage[emp.department_code] += emp.weekly_hours;
    });

    return coverage;
  }

  calculateShiftCoverage(): { [key: string]: number } {
    const coverage: { [key: string]: number } = {};

    this.employeeSchedules.forEach((emp) => {
      emp.daily_schedules.forEach((ds) => {
        if (!coverage[ds.shift_code]) {
          coverage[ds.shift_code] = 0;
        }
        coverage[ds.shift_code] += 1;
      });
    });

    return coverage;
  }

  getTotalConflicts(): number {
    return this.employeeSchedules.reduce(
      (sum, emp) => sum + emp.conflicts.length,
      0
    );
  }

  getPendingSwitches(): number {
    return this.employeeSchedules.reduce(
      (sum, emp) =>
        sum +
        emp.daily_schedules.reduce(
          (dsSum, ds) => dsSum + ds.switch_requests.length,
          0
        ),
      0
    );
  }

  updateConflictSummary() {
    this.conflictSummary = {};

    this.employeeSchedules.forEach((emp) => {
      emp.conflicts.forEach((conflict) => {
        if (!this.conflictSummary[conflict.type]) {
          this.conflictSummary[conflict.type] = 0;
        }
        this.conflictSummary[conflict.type]++;
      });
    });
  }

  // HELPER =======================================================

  calculateRestHours(endTime: string, startTime: string): number {
    const [endHour, endMin] = endTime.split(":").map(Number);
    const [startHour, startMin] = startTime.split(":").map(Number);

    let endMinutes = endHour * 60 + endMin;
    let startMinutes = startHour * 60 + startMin;

    if (startMinutes < endMinutes) {
      startMinutes += 24 * 60; // Next day
    }

    return Math.round(((startMinutes - endMinutes) / 60) * 10) / 10;
  }

  setupRealTimeValidation() {
    if (this.realTimeValidation) {
      // Setup watchers or intervals for real-time validation
      setInterval(() => {
        this.validateAllSchedules();
      }, 30000); // Validate every 30 seconds
    }
  }

  validateAllSchedules() {
    this.employeeSchedules.forEach((employee) => {
      employee.conflicts = this.validateEmployeeSchedule(employee);
    });

    this.updateConflictSummary();
    this.$emit("conflict-detected", this.conflictSummary);
  }

  validateEmployeeSchedule(employee: EmployeeSchedule): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    // Check consecutive working days
    let consecutiveDays = 0;
    let maxConsecutive = 0;

    employee.daily_schedules.forEach((schedule) => {
      if (schedule.shift_code !== "OFF") {
        consecutiveDays++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
      } else {
        consecutiveDays = 0;
      }
    });

    if (maxConsecutive > 6) {
      conflicts.push({
        type: "CONSECUTIVE_DAYS",
        severity: "ERROR",
        message: `Working ${maxConsecutive} consecutive days exceeds limit`,
      });
    } else if (maxConsecutive > 5) {
      conflicts.push({
        type: "CONSECUTIVE_DAYS",
        severity: "WARNING",
        message: `Working ${maxConsecutive} consecutive days`,
      });
    }

    // Check overtime limits
    if (employee.overtime_hours > 20) {
      conflicts.push({
        type: "OVERTIME_LIMIT",
        severity: "ERROR",
        message: `Overtime hours (${employee.overtime_hours}h) exceed weekly limit`,
      });
    }

    // Check rest time between shifts
    for (let i = 0; i < employee.daily_schedules.length - 1; i++) {
      const today = employee.daily_schedules[i];
      const tomorrow = employee.daily_schedules[i + 1];

      if (today.shift_code !== "OFF" && tomorrow.shift_code !== "OFF") {
        const restHours = this.calculateRestHours(
          today.end_time,
          tomorrow.start_time
        );
        if (restHours < 8) {
          conflicts.push({
            type: "REST_TIME",
            severity: "ERROR",
            message: `Insufficient rest time (${restHours}h) between shifts`,
            day_index: i + 1,
          });
        }
      }
    }

    return conflicts;
  }

  toggleCellSelection(employeeId: string, dayIndex: number) {
    const cellId = `${employeeId}-${dayIndex}`;

    if (this.selectedCells.has(cellId)) {
      this.selectedCells.delete(cellId);
    } else {
      this.selectedCells.add(cellId);
    }

    if (this.bulkMode && this.selectedCells.size > 0) {
      this.updateBulkOperation();
    }
  }

  selectAllEmployeesForDay(dayIndex: number) {
    this.employeeSchedules.forEach((emp) => {
      this.selectedCells.add(`${emp.employee_id}-${dayIndex}`);
    });
  }

  selectAllDaysForEmployee(employeeId: string) {
    for (let i = 1; i <= 7; i++) {
      this.selectedCells.add(`${employeeId}-${i}`);
    }
  }

  clearSelection() {
    this.selectedCells.clear();
    this.bulkOperation = null;
  }

  // Drag & Drop Operations
  onShiftDragStart(shiftCode: string, event: DragEvent) {
    this.draggedShift = shiftCode;
    event.dataTransfer!.effectAllowed = "copy";
    event.dataTransfer!.setData("text/plain", shiftCode);
  }

  onCellDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "copy";
  }

  async onCellDrop(employeeId: string, dayIndex: number, event: DragEvent) {
    event.preventDefault();

    if (!this.draggedShift) return;

    try {
      await this.updateEmployeeSchedule(
        employeeId,
        dayIndex,
        this.draggedShift
      );
      getToastSuccess("Schedule updated successfully");
    } catch (error) {
      getToastError("Failed to update schedule");
    } finally {
      this.draggedShift = null;
    }
  }

  // GETTER AND SETTER =======================================================
  get currentWeekRange(): string {
    if (!this.weekDays.length) return "";

    const firstDay = this.weekDays[0].date;
    const lastDay = this.weekDays[this.weekDays.length - 1].date;

    return `${firstDay} - ${lastDay}`;
  }

  get filteredEmployees(): EmployeeSchedule[] {
    return this.employeeSchedules.filter((emp) => {
      if (
        this.filters.department &&
        emp.department_code !== this.filters.department
      )
        return false;
      if (this.filters.show_conflicts_only && emp.conflicts.length === 0)
        return false;
      if (this.filters.show_overtime_only && emp.overtime_hours === 0)
        return false;

      return true;
    });
  }

  get selectedCellsArray(): string[] {
    return Array.from(this.selectedCells);
  }

  get hasCriticalConflicts(): boolean {
    return this.employeeSchedules.some((emp) =>
      emp.conflicts.some((conflict) => conflict.severity === "ERROR")
    );
  }

  get weeklyStatsDisplay() {
    return {
      ...this.weeklyStats,
      avg_hours_per_employee:
        this.weeklyStats.total_employees > 0
          ? (
              this.weeklyStats.total_working_hours /
              this.weeklyStats.total_employees
            ).toFixed(1)
          : "0",
      overtime_percentage:
        this.weeklyStats.total_working_hours > 0
          ? (
              (this.weeklyStats.total_overtime_hours /
                this.weeklyStats.total_working_hours) *
              100
            ).toFixed(1)
          : "0",
    };
  }
}
