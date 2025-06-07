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
import SwitchShiftModal from "./components/schedule-switch-modal/schedule-switch-modal.vue";
import WeeklyScheduleView from "./components/weekly-schedule-view/weekly-schedule-view.vue";
import CInputForm from "./components/work-schedule-input-form/work-schedule-input-form.vue";

interface Day {
  name: string;
  date: string;
  full_date: Date;
  day_index: number;
}

interface SwitchRequest {
  id: number;
  employee_id: string;
  employee_name: string;
  schedule_date: string;
  current_shift_code: string;
  requested_shift_code: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
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
    SwitchShiftModal,
    WeeklyScheduleView,
  },
})
export default class WorkSchedule extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;
  public currentWeekStart: Date = new Date();
  public weekDays: Day[] = [];
  public switchRequests: SwitchRequest[] = [];

  // Options data
  public employeeOptions: any = [];
  public scheduleOptions: any = [];
  public workScheduleTypeOptions: any = [];
  public shiftOptions: any = [];
  public departmentOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // Weekly Schedule View
  public weeklyScheduleViewRef: any = ref();
  public showWeeklyView: boolean = true;

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

  handleToSwitchShift() {
    this.$router.push({
      name: "SwitchShift",
    });
  }
  handleToSchedule() {
    this.$router.push({
      name: "ScheduleTemplate",
    });
  }
  handleToShift() {
    this.$router.push({
      name: "Shift",
    });
  }
  handleToShiftCategory() {
    this.$router.push({
      name: "ShiftCategory",
    });
  }

  quickSwitchToday(employee: any) {
    const today = new Date().toISOString().split("T")[0];
    const todayDay = this.weekDays.find((day) => day.date === today);

    if (todayDay) {
      // Delegate to weekly schedule view component
      if (this.weeklyScheduleViewRef) {
        this.weeklyScheduleViewRef.openScheduleModal(
          employee,
          todayDay,
          todayDay.day_index
        );
      }
    } else {
      getToastInfo("Jadwal hari ini tidak dalam tampilan minggu saat ini");
    }
  }

  showSwitchRequestsModal(employee: any) {
    // Implementation for showing employee's switch requests
    console.log("Show switch requests for:", employee.employee_name);
    // This could open another modal showing all pending/approved/rejected requests
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

    // this.currentWeekData = [
    //   {
    //     id: 1,
    //     employee_id: "EMP001",
    //     employee_name: "John Doe",
    //     department_code: "FRONT_OFFICE",
    //     department_name: "Front Office",
    //     position_code: "STAFF",
    //     position_name: "Staff",
    //     placement_code: "AMORA_UBUD",
    //     placement_name: "Amora Ubud",
    //     daily_schedules: [
    //       {
    //         day_index: 0,
    //         shift_code: "OFF",
    //         shift_name: "Day Off",
    //         start_time: "",
    //         end_time: "",
    //         working_hours: 0,
    //       },
    //       {
    //         day_index: 1,
    //         shift_code: "FO-M",
    //         shift_name: "Front Office Morning",
    //         start_time: "07:00",
    //         end_time: "15:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 2,
    //         shift_code: "FO-M",
    //         shift_name: "Front Office Morning",
    //         start_time: "07:00",
    //         end_time: "15:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 3,
    //         shift_code: "FO-E",
    //         shift_name: "Front Office Evening",
    //         start_time: "15:00",
    //         end_time: "23:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 4,
    //         shift_code: "FO-E",
    //         shift_name: "Front Office Evening",
    //         start_time: "15:00",
    //         end_time: "23:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 5,
    //         shift_code: "FO-N",
    //         shift_name: "Front Office Night",
    //         start_time: "23:00",
    //         end_time: "07:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 6,
    //         shift_code: "OFF",
    //         shift_name: "Day Off",
    //         start_time: "",
    //         end_time: "",
    //         working_hours: 0,
    //       },
    //     ],
    //   },
    //   {
    //     id: 2,
    //     employee_id: "EMP002",
    //     employee_name: "Jane Smith",
    //     department_code: "HOUSEKEEPING",
    //     department_name: "Housekeeping",
    //     position_code: "SUPERVISOR",
    //     position_name: "Supervisor",
    //     placement_code: "AMORA_UBUD",
    //     placement_name: "Amora Ubud",
    //     daily_schedules: [
    //       {
    //         day_index: 0,
    //         shift_code: "OFF",
    //         shift_name: "Day Off",
    //         start_time: "",
    //         end_time: "",
    //         working_hours: 0,
    //       },
    //       {
    //         day_index: 1,
    //         shift_code: "HK-M",
    //         shift_name: "Housekeeping Morning",
    //         start_time: "08:00",
    //         end_time: "16:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 2,
    //         shift_code: "HK-M",
    //         shift_name: "Housekeeping Morning",
    //         start_time: "08:00",
    //         end_time: "16:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 3,
    //         shift_code: "HK-M",
    //         shift_name: "Housekeeping Morning",
    //         start_time: "08:00",
    //         end_time: "16:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 4,
    //         shift_code: "HK-M",
    //         shift_name: "Housekeeping Morning",
    //         start_time: "08:00",
    //         end_time: "16:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 5,
    //         shift_code: "HK-M",
    //         shift_name: "Housekeeping Morning",
    //         start_time: "08:00",
    //         end_time: "16:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 6,
    //         shift_code: "HK-M",
    //         shift_name: "Housekeeping Morning",
    //         start_time: "08:00",
    //         end_time: "16:00",
    //         working_hours: 8,
    //       },
    //     ],
    //   },
    //   {
    //     id: 3,
    //     employee_id: "EMP003",
    //     employee_name: "Robert Johnson",
    //     department_code: "RESTAURANT",
    //     department_name: "Restaurant",
    //     position_code: "CHEF",
    //     position_name: "Chef",
    //     placement_code: "AMORA_UBUD",
    //     placement_name: "Amora Ubud",
    //     daily_schedules: [
    //       {
    //         day_index: 0,
    //         shift_code: "OFF",
    //         shift_name: "Day Off",
    //         start_time: "",
    //         end_time: "",
    //         working_hours: 0,
    //       },
    //       {
    //         day_index: 1,
    //         shift_code: "FB-B",
    //         shift_name: "F&B Breakfast",
    //         start_time: "05:00",
    //         end_time: "13:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 2,
    //         shift_code: "FB-L",
    //         shift_name: "F&B Lunch",
    //         start_time: "10:00",
    //         end_time: "18:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 3,
    //         shift_code: "FB-D",
    //         shift_name: "F&B Dinner",
    //         start_time: "16:00",
    //         end_time: "00:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 4,
    //         shift_code: "FB-SP1",
    //         shift_name: "F&B Split Breakfast/Dinner",
    //         start_time: "06:00",
    //         end_time: "10:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 5,
    //         shift_code: "FB-L",
    //         shift_name: "F&B Lunch",
    //         start_time: "10:00",
    //         end_time: "18:00",
    //         working_hours: 8,
    //       },
    //       {
    //         day_index: 6,
    //         shift_code: "OFF",
    //         shift_name: "Day Off",
    //         start_time: "",
    //         end_time: "",
    //         working_hours: 0,
    //       },
    //     ],
    //   },
    // ];
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
          this.scheduleOptions = response.data;
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

      this.departmentOptions = [
        { code: "FRONT_OFFICE", name: "Front Office" },
        { code: "HOUSEKEEPING", name: "Housekeeping" },
        { code: "RESTAURANT", name: "Restaurant" },
        { code: "KITCHEN", name: "Kitchen" },
        { code: "SPA", name: "Spa" },
        { code: "SECURITY", name: "Security" },
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

      this.scheduleOptions = [
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

  async switchShift(formData: any) {
    try {
      const newSwitchRequest: SwitchRequest = {
        id: this.switchRequests.length + 1,
        employee_id: formData.employee_id,
        employee_name: formData.employee_name || "",
        schedule_date: formData.schedule_date,
        current_shift_code: formData.current_shift_code,
        requested_shift_code: formData.requested_shift_code,
        reason: formData.reason,
        status: "APPROVED", // Auto approve for basic implementation
        requested_at: new Date().toISOString(),
        approved_by: "System",
        approved_at: new Date().toISOString(),
      };

      this.switchRequests.push(newSwitchRequest);

      // Update local schedule data if auto-approved
      this.updateLocalScheduleData(formData);

      getToastSuccess("Pergantian jadwal berhasil disetujui");

      return {
        success: true,
        auto_approved: true,
        data: newSwitchRequest,
      };
    } catch (error) {
      console.error("Error handling schedule switch:", error);
      getToastError("Gagal memproses pergantian jadwal");
      throw error;
    }
  }

  updateLocalScheduleData(switchData: any) {
    // Update the weekly schedule view component
    if (this.weeklyScheduleViewRef) {
      this.weeklyScheduleViewRef.updateScheduleData(switchData);
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
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
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

    this.$emit("week-changed", {
      weekStart: this.currentWeekStart,
      weekDays: this.weekDays,
    });
  }

  goToCurrentWeek() {
    this.initializeWeek();
    this.$emit("week-changed", {
      weekStart: this.currentWeekStart,
      weekDays: this.weekDays,
    });
  }

  timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  formatWorkingDaysText(workingDays: number[]): string {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return workingDays.map((day) => dayNames[day]).join(", ");
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

  get pendingSwitchCount(): number {
    return this.switchRequests.filter((req) => req.status === "PENDING").length;
  }

  get todaysSwitchRequests(): SwitchRequest[] {
    const today = new Date().toISOString().split("T")[0];
    return this.switchRequests.filter((req) => req.schedule_date === today);
  }
}
