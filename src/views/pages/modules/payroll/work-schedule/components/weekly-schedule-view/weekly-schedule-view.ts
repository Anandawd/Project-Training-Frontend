import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import { getError } from "@/utils/general";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";
import SwitchShiftModal from "../schedule-switch-modal/schedule-switch-modal.vue";

interface Day {
  name: string;
  date: string;
  full_date: Date;
  day_index: number;
}

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
  updated_at?: string;
  updated_by?: string;
  created_at?: string;
  created_by?: string;
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
  reason?: string;
  updated_by?: string;
  updated_at?: string;
}

const workScheduleAPI = new WorkScheduleAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CSelect,
    CInput,
    SwitchShiftModal,
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
    shiftOptions: {
      type: Array,
      required: true,
    },
    employeeOptions: {
      type: Array,
      required: true,
    },
    departmentOptions: {
      type: Array,
      required: true,
    },
  },
  emits: ["schedule-updated", "week-changed"],
})
export default class WeeklyScheduleView extends Vue {
  // Props
  currentWeekStart!: Date;
  weekDays!: any[];
  shiftOptions!: any[];
  employeeOptions!: any[];
  departmentOptions!: any[];

  // Data
  public currentWeekData: EmployeeSchedule[] = [];
  public selectedCells: Set<string> = new Set();
  public isLoading = false;
  public modeData: any;

  // Schedule Switch Modal
  public showScheduleSwitchModal = false;
  public selectedEmployeeForSwitch: any = null;
  public selectedDateForSwitch = "";
  public selectedDayIndexForSwitch = -1;
  public currentScheduleForSwitch: any = null;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Filters
  public filters = reactive({
    department: "",
    position: "",
    show_conflicts_only: false,
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
  }

  // GENERAL FUNCTION =======================================================
  openScheduleModal(employee: any, day: Day, dayIndex: number) {
    this.selectedEmployeeForSwitch = employee;
    this.selectedDateForSwitch = day.date;
    this.selectedDayIndexForSwitch = dayIndex;

    // Get current schedule for this employee and day
    this.currentScheduleForSwitch = this.getSchedule(
      employee.employee_id,
      dayIndex
    );
    this.showScheduleSwitchModal = true;
  }

  async handleSwitchConfirmed(switchData: any) {
    try {
      // Update local schedule data
      this.updateScheduleData(switchData);

      // Emit event to parent component
      this.$emit("schedule-updated", switchData);

      // Close modal
      this.showScheduleSwitchModal = false;

      getToastSuccess("Pergantian jadwal berhasil");
    } catch (error) {
      console.error("Error handling switch confirmation:", error);
      getToastError("Gagal memproses pergantian jadwal");
    }
  }

  handleSwitchModalClose() {
    this.showScheduleSwitchModal = false;
    this.selectedEmployeeForSwitch = null;
    this.selectedDateForSwitch = "";
    this.selectedDayIndexForSwitch = -1;
    this.currentScheduleForSwitch = null;
  }

  updateScheduleData(switchData: any) {
    const employeeIndex = this.currentWeekData.findIndex(
      (emp) => emp.employee_id === switchData.employee_id
    );

    if (employeeIndex !== -1) {
      const scheduleIndex = this.currentWeekData[
        employeeIndex
      ].daily_schedules.findIndex(
        (schedule) => schedule.day_index === this.selectedDayIndexForSwitch
      );

      if (scheduleIndex !== -1) {
        // Find shift details
        const newShift = this.shiftOptions.find(
          (shift) => shift.code === switchData.requested_shift_code
        );

        if (newShift) {
          // Update the schedule
          this.currentWeekData[employeeIndex].daily_schedules[scheduleIndex] = {
            ...this.currentWeekData[employeeIndex].daily_schedules[
              scheduleIndex
            ],
            shift_code: switchData.requested_shift_code,
            shift_name: newShift.name,
            start_time: newShift.start_time || "",
            end_time: newShift.end_time || "",
            working_hours: newShift.working_hours || 0,
            is_overtime: newShift.is_overtime || false,
            status: "MODIFIED",
            reason: switchData.reason,
            updated_at: new Date().toISOString(),
            updated_by: "Current User",
          };

          // Recalculate weekly hours
          this.recalculateEmployeeHours(this.currentWeekData[employeeIndex]);
        }
      }
    }
  }

  showSwitchRequestsModal(employee: any) {
    // Implementation for showing employee's switch requests
    console.log("Show switch requests for:", employee.employee_name);
  }

  navigateWeek(direction: number) {
    this.$emit("week-changed", direction);
  }

  goToToday() {
    this.$emit("week-changed", 0); // 0 indicates go to current week
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.isLoading = true;
      this.loadMockData();
      this.loadDropdown();
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = false;
    }
  }

  loadMockData() {
    this.currentWeekData = [
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
        overtime_hours: 0,
        daily_schedules: [
          {
            day_index: 1, // Monday
            date: this.weekDays[0]?.date || "",
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "CONFIRMED",
          },
          {
            day_index: 2, // Tuesday
            date: this.weekDays[1]?.date || "",
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 3, // Wednesday
            date: this.weekDays[2]?.date || "",
            shift_code: "FO-E",
            shift_name: "Front Office Evening",
            start_time: "15:00",
            end_time: "23:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 4, // Thursday
            date: this.weekDays[3]?.date || "",
            shift_code: "FO-E",
            shift_name: "Front Office Evening",
            start_time: "15:00",
            end_time: "23:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 5, // Friday
            date: this.weekDays[4]?.date || "",
            shift_code: "FO-N",
            shift_name: "Front Office Night",
            start_time: "23:00",
            end_time: "07:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 6, // Saturday
            date: this.weekDays[5]?.date || "",
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 0, // Sunday
            date: this.weekDays[6]?.date || "",
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
            is_overtime: false,
            status: "SCHEDULED",
          },
        ],
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
        weekly_hours: 48,
        overtime_hours: 8,
        daily_schedules: [
          {
            day_index: 1,
            date: this.weekDays[0]?.date || "",
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
            is_overtime: false,
            status: "CONFIRMED",
          },
          {
            day_index: 2,
            date: this.weekDays[1]?.date || "",
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 3,
            date: this.weekDays[2]?.date || "",
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 4,
            date: this.weekDays[3]?.date || "",
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 5,
            date: this.weekDays[4]?.date || "",
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 6,
            date: this.weekDays[5]?.date || "",
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 0,
            date: this.weekDays[6]?.date || "",
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
            is_overtime: false,
            status: "SCHEDULED",
          },
        ],
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "Robert Johnson",
        department_code: "RESTAURANT",
        department_name: "Restaurant",
        position_code: "CHEF",
        position_name: "Chef",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        weekly_hours: 40,
        overtime_hours: 0,
        daily_schedules: [
          {
            day_index: 1,
            date: this.weekDays[0]?.date || "",
            shift_code: "FB-B",
            shift_name: "F&B Breakfast",
            start_time: "05:00",
            end_time: "13:00",
            working_hours: 8,
            is_overtime: false,
            status: "CONFIRMED",
          },
          {
            day_index: 2,
            date: this.weekDays[1]?.date || "",
            shift_code: "FB-L",
            shift_name: "F&B Lunch",
            start_time: "10:00",
            end_time: "18:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 3,
            date: this.weekDays[2]?.date || "",
            shift_code: "FB-D",
            shift_name: "F&B Dinner",
            start_time: "16:00",
            end_time: "00:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 4,
            date: this.weekDays[3]?.date || "",
            shift_code: "FB-B",
            shift_name: "F&B Breakfast",
            start_time: "05:00",
            end_time: "13:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 5,
            date: this.weekDays[4]?.date || "",
            shift_code: "FB-L",
            shift_name: "F&B Lunch",
            start_time: "10:00",
            end_time: "18:00",
            working_hours: 8,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 6,
            date: this.weekDays[5]?.date || "",
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
            is_overtime: false,
            status: "SCHEDULED",
          },
          {
            day_index: 0,
            date: this.weekDays[6]?.date || "",
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
            is_overtime: false,
            status: "SCHEDULED",
          },
        ],
      },
    ];
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

  // HELPER =======================================================
  recalculateEmployeeHours(employee: EmployeeSchedule) {
    employee.weekly_hours = employee.daily_schedules.reduce(
      (sum, schedule) => sum + schedule.working_hours,
      0
    );
    employee.overtime_hours = Math.max(0, employee.weekly_hours - 40);
  }

  getSchedule(employeeId: string, dayIndex: number): DailySchedule | undefined {
    const employee = this.currentWeekData.find(
      (emp) => emp.employee_id === employeeId
    );

    if (!employee || !employee.daily_schedules) return undefined;

    return employee.daily_schedules.find(
      (schedule) => schedule.day_index === dayIndex
    );
  }

  getScheduleCode(employeeId: string, dayIndex: number): string {
    const schedule = this.getSchedule(employeeId, dayIndex);
    return schedule?.shift_code || "OFF";
  }

  getScheduleName(employeeId: string, dayIndex: number): string {
    const schedule = this.getSchedule(employeeId, dayIndex);
    return schedule?.shift_name || "Day Off";
  }

  getScheduleTime(employeeId: string, dayIndex: number): string {
    const schedule = this.getSchedule(employeeId, dayIndex);
    if (!schedule || !schedule.start_time || !schedule.end_time) return "";

    // Handle split shifts if needed
    const shift = this.shiftOptions.find((s) => s.code === schedule.shift_code);
    if (shift?.is_split && shift.split_times) {
      return shift.split_times
        .map((time: any) => `${time.start}-${time.end}`)
        .join(", ");
    }

    return `${schedule.start_time} - ${schedule.end_time}`;
  }

  getShiftColor(shiftCode: string): string {
    const shift = this.shiftOptions.find((s) => s.code === shiftCode);
    return shift?.color || "#6c757d";
  }

  getShiftBadgeClass(shiftCode: string): string {
    const colorMap: { [key: string]: string } = {
      "#28a745": "morning",
      "#ffc107": "evening",
      "#343a40": "night",
      "#17a2b8": "regular",
      "#fd7e14": "flexible",
      "#6c757d": "off",
      "#e83e8c": "split",
      "#dc3545": "security",
    };

    const color = this.getShiftColor(shiftCode);
    return colorMap[color] || "off";
  }

  quickSwitchToday(employee: any) {
    const today = new Date().toISOString().split("T")[0];
    const todayDay = this.weekDays.find((day) => day.date === today);

    if (todayDay) {
      this.openScheduleModal(employee, todayDay, todayDay.day_index);
    } else {
      getToastError("Hari ini tidak dalam tampilan minggu saat ini");
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
    return this.currentWeekData.filter((emp) => {
      if (
        this.filters.department &&
        emp.department_code !== this.filters.department
      )
        return false;
      if (this.filters.position && emp.position_code !== this.filters.position)
        return false;

      return true;
    });
  }

  get summaryData() {
    const summary = {
      total_employees: this.currentWeekData.length,
      total_working_hours: this.currentWeekData.reduce(
        (sum, emp) => sum + emp.weekly_hours,
        0
      ),
      total_overtime_hours: this.currentWeekData.reduce(
        (sum, emp) => sum + emp.overtime_hours,
        0
      ),
      avg_hours_per_employee: 0,
    };

    if (summary.total_employees > 0) {
      summary.avg_hours_per_employee =
        Math.round(
          (summary.total_working_hours / summary.total_employees) * 10
        ) / 10;
    }

    return summary;
  }
}
