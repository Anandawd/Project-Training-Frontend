import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatDate } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./work-schedule-input-form/work-schedule-input-form.vue";

interface Day {
  name: string;
  date: string;
  full_date: Date;
}

interface Employee {
  id: number | string;
  employee_id: string;
  employee_name: string;
  department: string;
  position: string;
}

interface Shift {
  employee_id: number | string;
  day_index: number;
  shift_type: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  location: string;
  notes: string;
}

interface SelectedShift {
  employee_id: number | string;
  employee_name: string;
  dayIndex: number;
}

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class WorkSchedule extends Vue {
  //table
  public rowData: any = [
    {
      id: 1,
      period_name: "January 2025",
      period_date: "01/01/2025 - 31/01/2025",
      payment_date: "01/02/2025",
      remark: "-",
      status: "Completed",
    },
    {
      id: 2,
      period_name: "February 2025",
      period_date: "01/02/2025 - 30/02/2025",
      payment_date: "01/03/2025",
      remark: "-",
      status: "Completed",
    },
    {
      id: 3,
      period_name: "March 2025",
      period_date: "01/03/2025 - 31/03/2025",
      payment_date: "01/04/2025",
      remark: "-",
      status: "Completed",
    },
    {
      id: 4,
      period_name: "April 2025",
      period_date: "01/04/2025 - 30/04/2025",
      payment_date: "01/05/2025",
      remark: "-",
      status: "Draft",
    },
  ];
  public currentWeekStart: Date = new Date();
  public weekDays: Day[] = [];
  public scheduleData: Employee[] = [];
  public shifts: Shift[] = [];
  public selectedShift: SelectedShift | null = null;

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [1],
  };

  // form
  public showForm: boolean = false;
  public showDetail: boolean = false;
  public modeData: any;
  public modePayroll: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public formType: any;
  public editShiftForm = reactive({
    shiftType: "",
    startTime: "",
    endTime: "",
    breakDuration: 30,
    location: "",
    notes: "",
  });
  public templateForm = reactive({
    id: "",
    name: "",
    description: "",
  });

  // modal
  public showEditShiftModal: boolean = false;
  public showSaveTemplateModal: boolean = false;
  public showLoadTemplateModal: boolean = false;
  public showDialog: boolean = false;
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // options
  public departmentOptions: any = [
    { id: 1, name: "IT" },
    { id: 2, name: "Finance" },
    { id: 3, name: "Marketing" },
    { id: 4, name: "HR" },
    { id: 5, name: "Operations" },
  ];

  public positionOptions: any = [
    { id: 1, name: "Manager" },
    { id: 2, name: "Staff" },
    { id: 3, name: "Supervisor" },
    { id: 4, name: "Assistant" },
  ];

  public employeeOptions: any = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
    { id: 4, name: "Maria Garcia" },
    { id: 5, name: "Ahmed Ali" },
  ];

  // Shift options
  public shiftTypeOptions: any = [
    { code: "M", name: "Morning (07:00-15:00)" },
    { code: "E", name: "Evening (15:00-23:00)" },
    { code: "N", name: "Night (23:00-07:00)" },
    { code: "OFF", name: "Day Off" },
    { code: "SP", name: "Split Shift" },
  ];

  public locationOptions: any = [
    { code: "FD", name: "Front Desk" },
    { code: "BO", name: "Back Office" },
    { code: "KIT", name: "Kitchen" },
    { code: "RES", name: "Restaurant" },
    { code: "HK", name: "Housekeeping" },
  ];

  public breakDurationOptions: any = [
    { value: 0, name: "No Break" },
    { value: 15, name: "15 minutes" },
    { value: 30, name: "30 minutes" },
    { value: 45, name: "45 minutes" },
    { value: 60, name: "1 hour" },
  ];

  // Template options
  public templateOptions: any = [
    { id: 1, name: "Standard Week" },
    { id: 2, name: "Weekend Coverage" },
    { id: 3, name: "Night Shift Week" },
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

  // GENERAL FUNCTION
  handleSave(formData: any) {
    formData.periodName = parseInt(formData.periodName);
    formData.startDate = parseInt(formData.startDate);
    formData.endDate = parseInt(formData.endDate);
    formData.paymentDate = parseInt(formData.paymentDate);
    formData.remark = parseInt(formData.remark);

    if (this.modeData == $global.modeData.insert) {
      this.insertData(formData);
    } else {
      this.updateData(formData);
    }
  }

  async handleEdit(params: any) {
    this.showForm = true;
    this.modeData = $global.modeData.edit;
    await this.loadEditData(params.id);
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // UI FUNCTION
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowDetail("", $global.modePayroll.detail),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  // handleShowForm(params: any, mode: any) {
  //   this.inputFormElement.initialize();
  //   this.modeData = mode;
  //   this.showForm = true;
  // }

  handleShowForm(params: any, mode: any) {
    if (mode === $global.modePayroll.detail) {
      this.$router.push({
        name: "PeriodDetail",
        params: { id: params.id || "new" },
      });
    } else {
      this.inputFormElement.initialize();
      this.modeData = mode;
      this.showForm = true;
    }
  }

  handleShowDetail(params: any, mode: any) {
    this.$router.push({
      name: "PeriodDetail",
      params: { id: params.id },
    });
  }

  handleMenu() {}

  // API FUNCTION
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      // const {data} = await payrollAPI.getPayrollPeriod(params)
      // this.rowData = data
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      // const {status2} = await payrollAPI.InsertPayrollPeriod(formData)
      // if(status2.status ==0){
      //   getToastSuccess(this.$t('messages.saveSuccess'))
      //   this.showForm = false
      //   this.loadDataGrid()
      // }
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      // const {data} = await payrollAPI.GetPayrollPeriod(params)
      // this.inputFormElement.form = data
      // this.showForm = true
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      // const { status2 } = await trainingAPI.UpdateLostAndFound(formData);
      // if (status2.status == 0) {
      //   this.loadDataGrid("");
      //   this.showForm = false;
      //   getToastSuccess(this.$t("messages.saveSuccess"));
      // }
    } catch (error) {
      getError(error);
    }
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.payroll.periodName"), value: 0 },
      { text: this.$t("commons.filter.payroll.payroll.status"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 2 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        edit: true,
        menu: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "Code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.periodName"),
        headerClass: "align-header-center",
        field: "period_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.periodDate"),
        headerClass: "align-header-center",
        field: "period_date",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.paymentDate"),
        headerClass: "align-header-center",
        field: "payment_date",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        headerClass: "align-header-center",
        field: "remark",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        field: "status",
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

    params.api.sizeColumnsToFit();
  }

  // GETTER AND SETTER
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get isRunPayrollDisabled(): boolean {
    return !this.rowData.some((item: any) => item.status === "Draft");
  }

  get currentWeekRange(): string {
    if (!this.weekDays.length) return "";

    const firstDay = this.weekDays[0].date;
    const lastDay = this.weekDays[this.weekDays.length - 1].date;

    return `${firstDay} - ${lastDay}`;
  }

  mounted(): void {
    this.initializeWeek();
    this.loadMockData();
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
      });
    }
  }

  loadMockData() {
    this.scheduleData = [
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "John Doe",
        department: "IT",
        position: "Staff",
      },
      {
        id: 2,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department: "Finance",
        position: "Manager",
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "Robert Johnson",
        department: "HR",
        position: "Supervisor",
      },
    ];

    this.shifts = [
      {
        employee_id: 1,
        day_index: 0,
        shift_type: "M",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 30,
        location: "FD",
        notes: "Cover for Sarah",
      },
      {
        employee_id: 1,
        day_index: 1,
        shift_type: "M",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 30,
        location: "FD",
        notes: "",
      },
      {
        employee_id: 1,
        day_index: 2,
        shift_type: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        location: "",
        notes: "Requested day off",
      },
      {
        employee_id: 1,
        day_index: 3,
        shift_type: "M",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 30,
        location: "FD",
        notes: "",
      },
      {
        employee_id: 1,
        day_index: 4,
        shift_type: "M",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 30,
        location: "FD",
        notes: "",
      },
      {
        employee_id: 1,
        day_index: 5,
        shift_type: "E",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 30,
        location: "FD",
        notes: "",
      },
      {
        employee_id: 1,
        day_index: 6,
        shift_type: "E",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 30,
        location: "FD",
        notes: "",
      },

      {
        employee_id: 2,
        day_index: 0,
        shift_type: "E",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 30,
        location: "BO",
        notes: "",
      },
      {
        employee_id: 2,
        day_index: 1,
        shift_type: "E",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 30,
        location: "BO",
        notes: "",
      },
      {
        employee_id: 2,
        day_index: 2,
        shift_type: "E",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 30,
        location: "BO",
        notes: "",
      },
      {
        employee_id: 2,
        day_index: 3,
        shift_type: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        location: "",
        notes: "Personal time",
      },
      {
        employee_id: 2,
        day_index: 4,
        shift_type: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        location: "",
        notes: "Personal time",
      },
      {
        employee_id: 2,
        day_index: 5,
        shift_type: "M",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 30,
        location: "BO",
        notes: "",
      },
      {
        employee_id: 2,
        day_index: 6,
        shift_type: "M",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 30,
        location: "BO",
        notes: "",
      },

      {
        employee_id: 3,
        day_index: 0,
        shift_type: "N",
        start_time: "23:00",
        end_time: "07:00",
        break_duration: 30,
        location: "HK",
        notes: "",
      },
      {
        employee_id: 3,
        day_index: 1,
        shift_type: "N",
        start_time: "23:00",
        end_time: "07:00",
        break_duration: 30,
        location: "HK",
        notes: "",
      },
      {
        employee_id: 3,
        day_index: 2,
        shift_type: "N",
        start_time: "23:00",
        end_time: "07:00",
        break_duration: 30,
        location: "HK",
        notes: "",
      },
      {
        employee_id: 3,
        day_index: 3,
        shift_type: "N",
        start_time: "23:00",
        end_time: "07:00",
        break_duration: 30,
        location: "HK",
        notes: "",
      },
      {
        employee_id: 3,
        day_index: 4,
        shift_type: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        location: "",
        notes: "",
      },
      {
        employee_id: 3,
        day_index: 5,
        shift_type: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        location: "",
        notes: "",
      },
      {
        employee_id: 3,
        day_index: 6,
        shift_type: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        location: "",
        notes: "",
      },
    ];
  }

  getShift(employeeId: number | string, dayIndex: number): Shift | undefined {
    return this.shifts.find(
      (shift) => shift.employee_id == employeeId && shift.day_index == dayIndex
    );
  }

  getShiftCode(employeeId: number | string, dayIndex: number): string {
    const shift = this.getShift(employeeId, dayIndex);
    return shift ? shift.shift_type : "OFF";
  }

  getShiftName(employeeId: number | string, dayIndex: number): string {
    const shift = this.getShift(employeeId, dayIndex);
    if (!shift) return "Day Off";
    return;
  }
}
