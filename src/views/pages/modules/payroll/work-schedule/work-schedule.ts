import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import { formatDate, formatDateTimeUTC } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import ScheduleSwitchModal from "./components/schedule-switch-modal/schedule-switch-modal.vue";
import CInputForm from "./components/work-schedule-input-form/work-schedule-input-form.vue";

interface Day {
  name: string;
  date: string;
  full_date: Date;
  day_index: number;
}

interface ShiftSchedule {
  employee_id: string;
  day_index: number;
  shift_code: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  working_hours: number;
  is_overtime: boolean;
  reason?: string;
  updated_by?: string;
  updated_at?: string;
}

interface ScheduleConflict {
  type: "overlap" | "rest_time" | "consecutive_days" | "department_limit";
  message: string;
  severity: "warning" | "error";
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
})
export default class WorkSchedule extends Vue {
  // data
  public rowData: any = [];
  public currentWeekData: any = [];
  public deleteParam: any;
  public currentWeekStart: Date = new Date();
  public weekDays: Day[] = [];
  public scheduleChanges: ShiftSchedule[] = [];

  // options data
  public employeeOptions: any = [];
  public workScheduleOptions: any = [];
  public workScheduleTypeOptions: any = [];
  public shiftOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // modal
  public modalForm: any = {};
  public modalParam: any;
  public showModal: boolean = false;
  public selectedEmployee: any = null;
  public selectedDay: Day | null = null;
  public selectedDayIndex: number = -1;

  public showScheduleSwitchModal: boolean = false;
  public selectedEmployeeForSwitch: any = null;
  public selectedDateForSwitch: string = "";
  public selectedDayIndexForSwitch: number = -1;
  public currentScheduleForSwitch: any = null;
  public switchRequests: any[] = [];

  // Schedule management
  public scheduleConflicts: ScheduleConflict[] = [];
  public bulkEditMode: boolean = false;
  public selectedCells: any[] = [];

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

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

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;

  // RECYCLE LIFE FUNCTION =======================================================
  created(): void {
    this.initializeWeek();
    this.loadData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.name"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 3 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 4 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.id"),
        field: "employee_id",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeName"),
        field: "employee_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "department_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "position_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "placement_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.currentSchedule"),
        field: "work_schedule_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.workingDays"),
        field: "working_days_text",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.workingTime"),
        field: "working_time_text",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.effectiveDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "effective_start_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_current",
        width: 100,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const isCurrent = params.value;
          return isCurrent
            ? `<span class="badge bg-success">Current</span>`
            : `<span class="badge bg-secondary">Inactive</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 100,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
  }

  // GENERAL FUNCTION =======================================================
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: "Quick Switch Today",
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.quickSwitchToday(this.paramsData),
      },
      {
        name: "Manage Switch Requests",
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.showSwitchRequestsModal(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowDetail(),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else {
        this.loadEditData(params.id);
      }
    });
    this.showForm = true;
  }

  async handleShowModal(params: any, mode: any) {
    this.showModal = false;
    await this.$nextTick();

    this.modeData = mode;
    this.showModal = true;
  }

  handleShowDetail() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData).then(() => {
        this.showForm = false;
      });
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formattedData).then(() => {
        this.showForm = false;
      });
    }
  }

  handleSaveModal() {
    if (!this.modalForm.new_shift_code) {
      getToastError("Silakan pilih shift yang baru");
      return;
    }
    this.switchSchedule();
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.attendance.confirm.deleteWorkSchedule",
      {
        employeeName: params.employee_name,
        scbheduleName: params.work_schedule_name,
      }
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleMenu() {}

  confirmAction() {
    switch (this.dialogAction) {
      case "delete":
        this.deleteData();
        break;
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.searchOptions = { ...search };
    this.loadDataGrid(search);
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
  }

  handleToScheduleTemplate() {
    this.$router.push({
      name: "ScheduleTemplate",
    });
  }

  onEmployeeChange() {
    if (this.modalForm.employee_id) {
      const selectedEmployee = this.employeeOptions.find(
        (emp: any) => emp.employee_id === this.modalForm.employee_id
      );

      if (selectedEmployee) {
        this.modalForm.employee_name = selectedEmployee.name;
        this.modalForm.department_code = selectedEmployee.department_code;
        this.modalForm.department_name = selectedEmployee.department_name;
        this.modalForm.position_code = selectedEmployee.position_code;
        this.modalForm.position_name = selectedEmployee.position_name;
        this.modalForm.placement_code = selectedEmployee.placement_code;
        this.modalForm.placement_name = selectedEmployee.placement_name;
      }
    } else {
      this.modalForm.employee_name = "";
      this.modalForm.department_code = "";
      this.modalForm.department_name = "";
      this.modalForm.position_code = "";
      this.modalForm.position_name = "";
      this.modalForm.placement_code = "";
      this.modalForm.placement_name = "";
    }
  }

  openScheduleModal(employee: any, day: Day, dayIndex: number) {
    this.selectedEmployeeForSwitch = employee;
    this.selectedDateForSwitch = day.date;
    this.selectedDayIndexForSwitch = day.day_index;

    // Get current schedule for this employee and day
    this.currentScheduleForSwitch = this.getSchedule(
      employee.employee_id,
      day.day_index
    );

    this.showScheduleSwitchModal = true;
  }

  quickSwitchToday(employee: any) {
    const today = new Date().toISOString().split("T")[0];
    const todayDay = this.weekDays.find((day) => day.date === today);

    if (todayDay) {
      this.openScheduleModal(employee, todayDay, todayDay.day_index);
    } else {
      getToastInfo("Today's schedule is not in the current week view");
    }
  }

  showSwitchRequestsModal(employee: any) {
    // Implementation for showing employee's switch requests
    console.log("Show switch requests for:", employee.employee_name);
    // This could open another modal showing all pending/approved/rejected requests
  }

  async handleSwitchConfirmed(switchData: any) {
    try {
      console.log("Switch confirmed:", switchData);

      // Update local schedule data immediately if auto-approved
      if (switchData.auto_approved) {
        this.updateLocalScheduleData(switchData);
      }

      // Reload switch requests to show pending items
      await this.loadPendingSwitchRequests();

      // Refresh current week data
      // await this.loadCurrentWeekData();

      // Close modal
      this.showScheduleSwitchModal = false;

      getToastSuccess("Schedule switch processed successfully");
    } catch (error) {
      console.error("Error handling switch confirmation:", error);
      getToastError("Failed to process schedule switch");
    }
  }

  handleSwitchModalClose() {
    this.showScheduleSwitchModal = false;
    this.selectedEmployeeForSwitch = null;
    this.selectedDateForSwitch = "";
    this.selectedDayIndexForSwitch = -1;
    this.currentScheduleForSwitch = null;
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

  async loadDataGrid(search: any = this.searchDefault) {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await workScheduleAPI.GetEmployeeWorkScheduleList(params);
      this.rowData = data;
      */

      let filteredData = [...this.rowData];

      if (search.text && search.text.trim()) {
        let searchText = search.text.toLowerCase().trim();
        let searchIndex = search.index;

        filteredData = filteredData.filter((item: any) => {
          switch (searchIndex) {
            case 0:
              return item.employee_id.toLowerCase().includes(searchText);
            case 1:
              return item.employee_name.toLowerCase().includes(searchText);
            case 2:
              return item.department_name.toLowerCase().includes(searchText);
            case 3:
              return item.position_name.toLowerCase().includes(searchText);
            case 4:
              return item.placement_name.toLowerCase().includes(searchText);
            default:
              return true;
          }
        });
      }

      if (this.gridApi) {
        this.gridApi.setRowData(filteredData);
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(id: any) {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      const { data } = await workScheduleAPI.GetEmployeeWorkSchedule(id);
      this.inputFormElement.form = this.populateForm(data);
      */

      const schedule = this.rowData.find((item: any) => item.id === id);

      if (schedule) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(schedule);
        });
      } else {
        getToastError(this.$t("messages.attendance.error.notFoundSchedule"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEditDataModal(id: any) {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      const { data } = await workScheduleAPI.GetEmployeeWorkSchedule(id);
      this.inputFormElement.form = this.populateForm(data);
      */

      const schedule = this.rowData.find((item: any) => item.id === id);

      if (schedule) {
        this.$nextTick(() => {
          this.modalForm = this.populateFormModal(schedule);
        });
      } else {
        getToastError(this.$t("messages.attendance.error.notFoundSchedule"));
      }
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.rowData = [
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
        work_schedule_code: "FO-ROT",
        work_schedule_name: "Front Office Rotation",
        work_schedule_type_code: "ROTATION",
        work_schedule_type_name: "Rotation",
        working_days: [1, 2, 3, 4, 5],
        working_days_text: "Mon-Fri",
        start_time: "07:00",
        end_time: "15:00",
        working_time_text: "07:00-15:00",
        break_duration: 60,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Rotation schedule for front office",
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
        work_schedule_code: "HK-FIX",
        work_schedule_name: "Housekeeping Fixed",
        work_schedule_type_code: "FIXED",
        work_schedule_type_name: "Fixed",
        working_days: [1, 2, 3, 4, 5, 6],
        working_days_text: "Mon-Sat",
        start_time: "08:00",
        end_time: "16:00",
        working_time_text: "08:00-16:00",
        break_duration: 60,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Fixed schedule for housekeeping supervisor",
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
    ];

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
        daily_schedules: [
          {
            day_index: 0,
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
          },
          {
            day_index: 1,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
          },
          {
            day_index: 2,
            shift_code: "FO-M",
            shift_name: "Front Office Morning",
            start_time: "07:00",
            end_time: "15:00",
            working_hours: 8,
          },
          {
            day_index: 3,
            shift_code: "FO-E",
            shift_name: "Front Office Evening",
            start_time: "15:00",
            end_time: "23:00",
            working_hours: 8,
          },
          {
            day_index: 4,
            shift_code: "FO-E",
            shift_name: "Front Office Evening",
            start_time: "15:00",
            end_time: "23:00",
            working_hours: 8,
          },
          {
            day_index: 5,
            shift_code: "FO-N",
            shift_name: "Front Office Night",
            start_time: "23:00",
            end_time: "07:00",
            working_hours: 8,
          },
          {
            day_index: 6,
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
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
        daily_schedules: [
          {
            day_index: 0,
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
          },
          {
            day_index: 1,
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
          },
          {
            day_index: 2,
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
          },
          {
            day_index: 3,
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
          },
          {
            day_index: 4,
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
          },
          {
            day_index: 5,
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
          },
          {
            day_index: 6,
            shift_code: "HK-M",
            shift_name: "Housekeeping Morning",
            start_time: "08:00",
            end_time: "16:00",
            working_hours: 8,
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
        daily_schedules: [
          {
            day_index: 0,
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
          },
          {
            day_index: 1,
            shift_code: "FB-B",
            shift_name: "F&B Breakfast",
            start_time: "05:00",
            end_time: "13:00",
            working_hours: 8,
          },
          {
            day_index: 2,
            shift_code: "FB-L",
            shift_name: "F&B Lunch",
            start_time: "10:00",
            end_time: "18:00",
            working_hours: 8,
          },
          {
            day_index: 3,
            shift_code: "FB-D",
            shift_name: "F&B Dinner",
            start_time: "16:00",
            end_time: "00:00",
            working_hours: 8,
          },
          {
            day_index: 4,
            shift_code: "FB-SP1",
            shift_name: "F&B Split Breakfast/Dinner",
            start_time: "06:00",
            end_time: "10:00",
            working_hours: 8,
          },
          {
            day_index: 5,
            shift_code: "FB-L",
            shift_name: "F&B Lunch",
            start_time: "10:00",
            end_time: "18:00",
            working_hours: 8,
          },
          {
            day_index: 6,
            shift_code: "OFF",
            shift_name: "Day Off",
            start_time: "",
            end_time: "",
            working_hours: 0,
          },
        ],
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

      this.workScheduleOptions = [
        {
          code: "FO-ROT",
          name: "Front Office Rotation",
          work_schedule_type_code: "ROTATION",
          work_schedule_type_name: "Rotation",
          working_days: [1, 2, 3, 4, 5],
          default_start_time: "07:00",
          default_end_time: "15:00",
          default_break_duration: 60,
        },
        {
          code: "HK-FIX",
          name: "Housekeeping Fixed",
          work_schedule_type_code: "FIXED",
          work_schedule_type_name: "Fixed",
          working_days: [1, 2, 3, 4, 5, 6],
          default_start_time: "08:00",
          default_end_time: "16:00",
          default_break_duration: 60,
        },
        {
          code: "FB-ROT",
          name: "F&B Rotation",
          work_schedule_type_code: "ROTATION",
          work_schedule_type_name: "Rotation",
          working_days: [1, 2, 3, 4, 5, 6],
          default_start_time: "06:00",
          default_end_time: "14:00",
          default_break_duration: 30,
        },
      ];
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      const { status2 } = await workScheduleAPI.InsertEmployeeWorkSchedule(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.workSchedule.success.saveSchedule"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
      */

      const newId = Math.max(...this.rowData.map((item: any) => item.id)) + 1;

      const newSchedule = {
        id: newId,
        employee_id: formData.employee_id,
        employee_name: formData.employee_name,
        department_code: formData.department_code,
        department_name: formData.department_name,
        position_code: formData.position_code,
        position_name: formData.position_name,
        placement_code: formData.placement_code,
        placement_name: formData.placement_name,
        work_schedule_code: formData.work_schedule_code,
        work_schedule_name: formData.work_schedule_name,
        work_schedule_type_code: formData.work_schedule_type_code,
        work_schedule_type_name: formData.work_schedule_type_name,
        working_days: formData.working_days,
        working_days_text: this.formatWorkingDaysText(formData.working_days),
        start_time: formData.start_time,
        end_time: formData.end_time,
        working_time_text: `${formData.start_time}-${formData.end_time}`,
        break_duration: formData.break_duration,
        working_hours: formData.working_hours,
        effective_start_date: formData.effective_start_date,
        effective_end_date: formData.effective_end_date,
        is_current: formData.is_current,
        remark: formData.remark,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowData.push(newSchedule);

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.saveSchedule"));
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      const { status2 } = await workScheduleAPI.UpdateEmployeeWorkSchedule(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.workSchedule.success.updateSchedule"));
      }
      */

      const index = this.rowData.findIndex(
        (item: any) => item.id === formData.id
      );
      if (index !== -1) {
        this.rowData[index] = {
          ...this.rowData[index],
          work_schedule_code: formData.work_schedule_code,
          work_schedule_name: formData.work_schedule_name,
          work_schedule_type_code: formData.work_schedule_type_code,
          work_schedule_type_name: formData.work_schedule_type_name,
          working_days: formData.working_days,
          working_days_text: this.formatWorkingDaysText(formData.working_days),
          start_time: formData.start_time,
          end_time: formData.end_time,
          working_time_text: `${formData.start_time}-${formData.end_time}`,
          break_duration: formData.break_duration,
          working_hours: formData.working_hours,
          effective_start_date: formData.effective_start_date,
          effective_end_date: formData.effective_end_date,
          is_current: formData.is_current,
          remark: formData.remark,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.updateSchedule"));
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      /*
      const workScheduleAPI = new WorkScheduleAPI();
      const { status2 } = await workScheduleAPI.DeleteEmployeeWorkSchedule(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.workSchedule.success.deleteSchedule"));
      }
      */

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== this.deleteParam
      );

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.deleteSchedule"));
    } catch (error) {
      getError(error);
    }
  }

  async switchSchedule() {
    try {
      const conflicts = this.checkScheduleConflicts(
        this.modalForm.employee_id,
        this.modalForm.day_index,
        this.modalForm.new_shift_code
      );
      if (conflicts.some((c) => c.severity === "error")) {
        getToastError(
          "Tidak dapat mengubah shift karena ada konflik yang harus diselesaikan"
        );
        return;
      }

      if (conflicts.some((c) => c.severity === "warning")) {
        getToastInfo(
          "Ada peringatan pada perubahan shift ini, silakan periksa kembali"
        );
      }

      const selectedShift = this.shiftOptions.find(
        (shift: any) => shift.code === this.modalForm.new_shift_code
      );

      if (!selectedShift) {
        getToastError("Shift tidak ditemukan");
        return;
      }

      // Update schedule in currentWeekData
      const employeeIndex = this.currentWeekData.findIndex(
        (emp: any) => emp.employee_id === this.modalForm.employee_id
      );

      if (employeeIndex === -1) return;

      const scheduleIndex = this.currentWeekData[
        employeeIndex
      ].daily_schedules.findIndex(
        (schedule: any) => schedule.day_index === this.modalForm.day_index
      );

      if (scheduleIndex !== -1) {
        this.currentWeekData[employeeIndex].daily_schedules[scheduleIndex] = {
          day_index: this.modalForm.day_index,
          shift_code: this.modalForm.new_shift_code,
          shift_name: selectedShift.name,
          start_time: selectedShift.start_time,
          end_time: selectedShift.end_time,
          working_hours: selectedShift.working_hours,
          is_overtime: selectedShift.is_overtime || false,
          reason: this.modalForm.reason,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };

        // Track changes
        this.scheduleChanges.push({
          employee_id: this.modalForm.employee_id,
          day_index: this.modalForm.day_index,
          shift_code: this.modalForm.new_shift_code,
          shift_name: selectedShift.name,
          start_time: selectedShift.start_time,
          end_time: selectedShift.end_time,
          working_hours: selectedShift.working_hours,
          is_overtime: selectedShift.is_overtime || false,
          reason: this.modalForm.reason,
          updated_by: "Current User",
          updated_at: formatDateTimeUTC(new Date()),
        });

        getToastSuccess(this.$t("messages.attendance.success.switchSchedule"));
      }

      this.showModal = false;
      this.validateScheduleConflicts();
    } catch (error) {
      getError(error);
    }
  }

  updateLocalScheduleData(switchData: any) {
    const employeeIndex = this.currentWeekData.findIndex(
      (emp: any) => emp.employee_id === switchData.employee_id
    );

    if (employeeIndex !== -1) {
      const scheduleIndex = this.currentWeekData[
        employeeIndex
      ].daily_schedules.findIndex(
        (schedule: any) => schedule.day_index === this.selectedDayIndexForSwitch
      );

      if (scheduleIndex !== -1) {
        // Find shift details
        const newShift = this.shiftOptions.find(
          (shift: any) => shift.code === switchData.new_shift_code
        );

        if (newShift) {
          this.currentWeekData[employeeIndex].daily_schedules[scheduleIndex] = {
            ...this.currentWeekData[employeeIndex].daily_schedules[
              scheduleIndex
            ],
            shift_code: switchData.new_shift_code,
            shift_name: newShift.shift_name,
            start_time: newShift.start_time,
            end_time: newShift.end_time,
            working_hours: newShift.working_hours,
            is_overtime: newShift.is_overtime || false,
            switch_reason: switchData.reason,
            updated_at: new Date().toISOString(),
            updated_by: "Current User",
          };
        }
      }
    }
  }

  async loadPendingSwitchRequests() {
    try {
      const { data } = await workScheduleAPI.GetPendingSwitchRequests();
      this.switchRequests = data || [];
    } catch (error) {
      console.error("Failed to load pending switch requests:", error);
    }
  }

  async approveSwitchRequest(switchId: number, approverNotes?: string) {
    try {
      const { data } = await workScheduleAPI.ApproveScheduleSwitch(
        switchId,
        approverNotes
      );

      // Update local data
      this.updateLocalScheduleData(data);

      // Reload requests
      await this.loadPendingSwitchRequests();
      // await this.loadCurrentWeekData();

      getToastSuccess("Switch request approved successfully");
    } catch (error) {
      console.error("Failed to approve switch request:", error);
      getToastError("Failed to approve switch request");
    }
  }

  async rejectSwitchRequest(switchId: number, rejectionReason: string) {
    try {
      await workScheduleAPI.RejectScheduleSwitch(switchId, rejectionReason);

      // Reload requests
      await this.loadPendingSwitchRequests();

      getToastSuccess("Switch request rejected");
    } catch (error) {
      console.error("Failed to reject switch request:", error);
      getToastError("Failed to reject switch request");
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      work_schedule_code: params.work_schedule_code,
      work_schedule_name: params.work_schedule_name,
      work_schedule_type_code: params.work_schedule_type_code,
      work_schedule_type_name: params.work_schedule_type_name,
      working_days: params.working_days,
      start_time: params.start_time,
      end_time: params.end_time,
      break_duration: params.break_duration,
      working_hours: params.working_hours,
      effective_start_date: params.effective_start_date,
      effective_end_date: params.effective_end_date,
      is_current: params.is_current,
      remark: params.remark,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      work_schedule_code: params.work_schedule_code,
      work_schedule_name: params.work_schedule_name,
      work_schedule_type_code: params.work_schedule_type_code,
      work_schedule_type_name: params.work_schedule_type_name,
      working_days: params.working_days || [],
      start_time: params.start_time,
      end_time: params.end_time,
      break_duration: params.break_duration,
      working_hours: params.working_hours,
      effective_start_date: params.effective_start_date,
      effective_end_date: params.effective_end_date,
      is_current: params.is_current,
      remark: params.remark,
    };
  }

  populateFormModal(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      work_schedule_code: params.work_schedule_code,
      work_schedule_name: params.work_schedule_name,
      work_schedule_type_code: params.work_schedule_type_code,
      work_schedule_type_name: params.work_schedule_type_name,
      working_days: params.working_days || [],
      start_time: params.start_time,
      end_time: params.end_time,
      break_duration: params.break_duration,
      working_hours: params.working_hours,
      effective_start_date: params.effective_start_date,
      effective_end_date: params.effective_end_date,
      is_current: params.is_current,
      remark: params.remark,
    };
  }

  initializeWeek() {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    this.currentWeekStart = new Date(currentDate.setDate(diff));

    this.generateWeekDays();
  }

  generateWeekDays() {
    this.weekDays = [];
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);

      this.weekDays.push({
        name: dayNames[i],
        date: formatDate({ value: date }),
        full_date: date,
        day_index: i + 1 === 7 ? 0 : i + 1,
      });
    }
  }

  navigateWeek(direction: number) {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() + direction * 7);
    this.currentWeekStart = newDate;
    this.generateWeekDays();
  }

  goToCurrentWeek() {
    this.initializeWeek();
  }

  timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  formatWorkingDaysText(workingDays: number[]): string {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return workingDays.map((day) => dayNames[day]).join(", ");
  }

  getSchedule(employeeId: string, dayIndex: number) {
    const employee = this.currentWeekData.find(
      (emp: any) => emp.employee_id === employeeId
    );

    if (!employee || !employee.daily_schedules) return undefined;

    return employee.daily_schedules.find(
      (schedule: any) => schedule.day_index === dayIndex
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

    // Handle split shifts
    const shift = this.shiftOptions.find(
      (s: any) => s.code === schedule.shift_code
    );
    if (shift?.is_split && shift.split_times) {
      return shift.split_times
        .map((time: any) => `${time.start}-${time.end}`)
        .join(", ");
    }

    return `${schedule.start_time} - ${schedule.end_time}`;
  }

  getShiftColor(shiftCode: string): string {
    const shift = this.shiftOptions.find((s: any) => s.code === shiftCode);
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

  selectedSchedule(employee: any, dayIndex: number) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    this.modalForm = {
      employee_id: employee.employee_id,
      employee_name: employee.employee_name,
      day_index: dayIndex,
      day_name: dayNames[dayIndex],
      current_schedule: this.getScheduleCode(employee.employee_id, dayIndex),
    };
    this.showModal = false;
  }

  checkScheduleConflicts(
    employeeId: string,
    dayIndex: number,
    newShiftCode: string
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    const employee = this.currentWeekData.find(
      (emp: any) => emp.employee_id === employeeId
    );

    if (!employee) return conflicts;

    const newShift = this.shiftOptions.find(
      (shift: any) => shift.code === newShiftCode
    );
    if (!newShift) return conflicts;

    // Check consecutive working days
    const consecutiveDays = this.getConsecutiveWorkingDays(
      employee,
      dayIndex,
      newShiftCode
    );
    if (consecutiveDays > 6) {
      conflicts.push({
        type: "consecutive_days",
        message: `Karyawan akan bekerja ${consecutiveDays} hari berturut-turut`,
        severity: "warning",
      });
    }

    // Check rest time between shifts
    const previousDay = dayIndex - 1;
    const nextDay = dayIndex + 1;

    if (previousDay >= 0) {
      const prevSchedule = this.getSchedule(employeeId, previousDay);
      if (prevSchedule && prevSchedule.shift_code !== "OFF") {
        const restHours = this.calculateRestHours(
          prevSchedule.end_time,
          newShift.start_time
        );
        if (restHours < 8) {
          conflicts.push({
            type: "rest_time",
            message: `Waktu istirahat hanya ${restHours} jam (minimum 8 jam)`,
            severity: "error",
          });
        }
      }
    }

    if (nextDay < 7) {
      const nextSchedule = this.getSchedule(employeeId, nextDay);
      if (nextSchedule && nextSchedule.shift_code !== "OFF") {
        const restHours = this.calculateRestHours(
          newShift.end_time,
          nextSchedule.start_time
        );
        if (restHours < 8) {
          conflicts.push({
            type: "rest_time",
            message: `Waktu istirahat ke hari berikutnya hanya ${restHours} jam`,
            severity: "error",
          });
        }
      }
    }

    // Check department limits
    const departmentSchedules = this.getDepartmentSchedulesForDay(
      employee.department_code,
      dayIndex
    );
    const shiftCount = departmentSchedules.filter(
      (s) => s.shift_code === newShiftCode
    ).length;

    // Example: Max 5 people per shift per department
    if (shiftCount >= 5) {
      conflicts.push({
        type: "department_limit",
        message: `Departemen sudah memiliki ${shiftCount} orang pada shift ini`,
        severity: "warning",
      });
    }

    return conflicts;
  }

  getConsecutiveWorkingDays(
    employee: any,
    changeDayIndex: number,
    newShiftCode: string
  ): number {
    let consecutive = 0;
    const schedules = [...employee.daily_schedules];

    // Simulate the change
    const changeIndex = schedules.findIndex(
      (s) => s.day_index === changeDayIndex
    );
    if (changeIndex !== -1) {
      schedules[changeIndex] = {
        ...schedules[changeIndex],
        shift_code: newShiftCode,
      };
    }

    // Count consecutive working days
    for (let i = 0; i < schedules.length; i++) {
      if (schedules[i].shift_code !== "OFF") {
        consecutive++;
      } else {
        consecutive = 0;
      }
    }

    return consecutive;
  }

  calculateRestHours(endTime: string, startTime: string): number {
    if (!endTime || !startTime) return 24;

    const [endHour, endMin] = endTime.split(":").map(Number);
    const [startHour, startMin] = startTime.split(":").map(Number);

    let endMinutes = endHour * 60 + endMin;
    let startMinutes = startHour * 60 + startMin;

    // Handle next day scenario
    if (startMinutes < endMinutes) {
      startMinutes += 24 * 60;
    }

    const restMinutes = startMinutes - endMinutes;
    return Math.round((restMinutes / 60) * 10) / 10;
  }

  getDepartmentSchedulesForDay(
    departmentCode: string,
    dayIndex: number
  ): any[] {
    const departmentEmployees = this.currentWeekData.filter(
      (emp: any) => emp.department_code === departmentCode
    );

    return departmentEmployees.map((emp: any) => {
      const schedule = emp.daily_schedules.find(
        (s: any) => s.day_index === dayIndex
      );
      return {
        employee_id: emp.employee_id,
        shift_code: schedule?.shift_code || "OFF",
      };
    });
  }

  validateScheduleConflicts() {
    this.scheduleConflicts = [];

    this.currentWeekData.forEach((employee: any) => {
      employee.daily_schedules.forEach((schedule: any, index: number) => {
        if (schedule.shift_code !== "OFF") {
          const conflicts = this.checkScheduleConflicts(
            employee.employee_id,
            schedule.day_index,
            schedule.shift_code
          );
          this.scheduleConflicts.push(...conflicts);
        }
      });
    });
  }

  toggleBulkMode() {
    this.bulkEditMode = !this.bulkEditMode;
    this.selectedCells = [];
    if (this.bulkEditMode) {
      getToastSuccess(
        "Bulk edit mode enabled. Click cells to select multiple schedules."
      );
    } else {
      getToastSuccess("Bulk edit mode disabled.");
    }
  }

  handleShowTemplates() {
    getToastSuccess("Schedule templates feature coming soon!");
  }

  checkCellConflict(employeeId: string, dayIndex: number): boolean {
    return this.scheduleConflicts.some(
      (conflict) => conflict.message.includes(employeeId) // Simple check, can be made more sophisticated
    );
  }

  getModalConflicts(): ScheduleConflict[] {
    if (!this.modalForm.new_shift_code || !this.modalForm.employee_id)
      return [];

    return this.checkScheduleConflicts(
      this.modalForm.employee_id,
      this.modalForm.day_index,
      this.modalForm.new_shift_code
    );
  }

  getShiftName(shiftCode: string): string {
    const shift = this.shiftOptions.find((s: any) => s.code === shiftCode);
    return shift?.name || "Unknown Shift";
  }

  getShiftTime(shiftCode: string): string {
    const shift = this.shiftOptions.find((s: any) => s.code === shiftCode);
    if (!shift || shiftCode === "OFF") return "";

    if (shift.is_split && shift.split_times) {
      return shift.split_times
        .map((time: any) => `${time.start}-${time.end}`)
        .join(", ");
    }

    return `${shift.start_time} - ${shift.end_time}`;
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get currentWeekRange(): string {
    if (!this.weekDays.length) return "";

    const firstDay = this.weekDays[0].date;
    const lastDay = this.weekDays[this.weekDays.length - 1].date;

    return `${firstDay} - ${lastDay}`;
  }

  get availableShiftForEmployee(): any[] {
    if (!this.selectedEmployee) return this.shiftOptions;

    return this.shiftOptions.filter((shift: any) => {
      if (shift.code === "OFF") return true;

      return (
        shift.departments.length === 0 ||
        shift.departments.includes(this.selectedEmployee.department_code)
      );
    });
  }

  get hasScheduleChanges(): boolean {
    return this.scheduleChanges.length > 0;
  }

  get criticalConflicts(): ScheduleConflict[] {
    return this.scheduleConflicts.filter((c) => c.severity === "error");
  }

  get warningConflicts(): ScheduleConflict[] {
    return this.scheduleConflicts.filter((c) => c.severity === "warning");
  }

  get pendingSwitchCount(): number {
    return this.switchRequests.filter((req) => req.status === "PENDING").length;
  }

  get todaysSwitchRequests(): any[] {
    const today = new Date().toISOString().split("T")[0];
    return this.switchRequests.filter((req) => req.schedule_date === today);
  }
}
