import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import { formatDate, formatDateTimeUTC } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./work-schedule-input-form/work-schedule-input-form.vue";

interface Day {
  name: string;
  date: string;
  full_date: Date;
}

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
    CSelect,
    CInput,
  },
})
export default class WorkSchedule extends Vue {
  // data
  public rowData: any = [];
  public currentWeekData: any = [];
  public deleteParam: any;
  public currentWeekStart: Date = new Date();
  public weekDays: Day[] = [];

  // options data
  public employeeOptions: any = [];
  public workScheduleOptions: any = [];
  public workScheduleTypeOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // modal
  public modalForm: any = {};
  public modalParam: any;
  public showModal: boolean = false;
  newScheduleCode: string = "";
  scheduleReason: string = "";

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
        name: this.$t("commons.contextMenu.switchSchedule"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowModal(
            this.paramsData,
            $global.modePayroll.switchSchedule
          ),
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
    this.$nextTick(() => {
      if (mode === $global.modePayroll.switchSchedule) {
        this.modalForm = {};
      } else {
        this.loadEditDataModal(params.id);
      }
    });
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
    } else if (this.modeData === $global.modePayroll.switchSchedule) {
      this.switchSchedule(this.modalForm);
    }
  }

  handleSaveModal() {
    const formData = {
      ...this.modalForm,
      new_schedule: this.newScheduleCode,
      start_time: this.getScheduleStartTime(),
      end_time: this.getScheduleEndTime(),
      reason: this.scheduleReason,
    };

    this.switchSchedule(formData);
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
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        work_schedule_code: "REG001",
        work_schedule_name: "Regular Shift",
        work_schedule_type_code: "FIXED",
        work_schedule_type_name: "Fixed",
        working_days: [1, 2, 3, 4, 5],
        working_days_text: "Mon-Fri",
        start_time: "08:00",
        end_time: "17:00",
        working_time_text: "08:00-17:00",
        break_duration: 60,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Standard working hours",
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
      {
        id: 2,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_code: "HR",
        department_name: "Human Resources",
        position_code: "MANAGER",
        position_name: "Manager",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        work_schedule_code: "FLEX001",
        work_schedule_name: "Flexible Hours",
        work_schedule_type_code: "FLEXIBLE",
        work_schedule_type_name: "Flexible",
        working_days: [1, 2, 3, 4, 5],
        working_days_text: "Mon-Fri",
        start_time: "09:00",
        end_time: "18:00",
        working_time_text: "09:00-18:00",
        break_duration: 60,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Flexible working hours",
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
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        work_schedule_code: "REG001",
        work_schedule_name: "Regular Shift",
        work_schedule_type_code: "FIXED",
        work_schedule_type_name: "Fixed",
        working_days: [1, 2, 3, 4, 5],
        working_days_text: "Mon-Fri",
        start_time: "08:00",
        end_time: "17:00",
        working_time_text: "08:00-17:00",
        break_duration: 60,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Standard working hours",
        daily_schedules: [
          {
            day_index: 0,
            schedule: { code: "OFF", name: "Day Off" },
            start_time: "",
            end_time: "",
          }, // Sunday
          {
            day_index: 1,
            schedule: { code: "R", name: "Regular" },
            start_time: "08:00",
            end_time: "17:00",
          }, // Monday
          {
            day_index: 2,
            schedule: { code: "R", name: "Regular" },
            start_time: "08:00",
            end_time: "17:00",
          }, // Tuesday
          {
            day_index: 3,
            schedule: { code: "R", name: "Regular" },
            start_time: "08:00",
            end_time: "17:00",
          }, // Wednesday
          {
            day_index: 4,
            schedule: { code: "R", name: "Regular" },
            start_time: "08:00",
            end_time: "17:00",
          }, // Thursday
          {
            day_index: 5,
            schedule: { code: "R", name: "Regular" },
            start_time: "08:00",
            end_time: "17:00",
          }, // Friday
          {
            day_index: 6,
            schedule: { code: "OFF", name: "Day Off" },
            start_time: "",
            end_time: "",
          }, // Saturday
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
        department_code: "HR",
        department_name: "Human Resources",
        position_code: "MANAGER",
        position_name: "Manager",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        work_schedule_code: "FLEX001",
        work_schedule_name: "Flexible Hours",
        work_schedule_type_code: "FLEXIBLE",
        work_schedule_type_name: "Flexible",
        working_days: [1, 2, 3, 4, 5],
        working_days_text: "Mon-Fri",
        start_time: "09:00",
        end_time: "18:00",
        working_time_text: "09:00-18:00",
        break_duration: 60,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Flexible working hours",
        daily_schedules: [
          {
            day_index: 0,
            schedule: { code: "OFF", name: "Day Off" },
            start_time: "",
            end_time: "",
          }, // Sunday
          {
            day_index: 1,
            schedule: { code: "F", name: "Flexible" },
            start_time: "09:00",
            end_time: "18:00",
          }, // Monday
          {
            day_index: 2,
            schedule: { code: "F", name: "Flexible" },
            start_time: "09:00",
            end_time: "18:00",
          }, // Tuesday
          {
            day_index: 3,
            schedule: { code: "F", name: "Flexible" },
            start_time: "09:00",
            end_time: "18:00",
          }, // Wednesday
          {
            day_index: 4,
            schedule: { code: "F", name: "Flexible" },
            start_time: "09:00",
            end_time: "18:00",
          }, // Thursday
          {
            day_index: 5,
            schedule: { code: "F", name: "Flexible" },
            start_time: "09:00",
            end_time: "18:00",
          }, // Friday
          {
            day_index: 6,
            schedule: { code: "OFF", name: "Day Off" },
            start_time: "",
            end_time: "",
          }, // Saturday
        ],
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "Robert Johnson",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        work_schedule_code: "NIGHT001",
        work_schedule_name: "Night Shift",
        work_schedule_type_code: "FIXED",
        work_schedule_type_name: "Fixed",
        working_days: [1, 2, 3, 4, 5],
        working_days_text: "Mon-Fri",
        start_time: "23:00",
        end_time: "07:00",
        working_time_text: "23:00-07:00",
        break_duration: 30,
        working_hours: 8,
        effective_start_date: "2025-01-01",
        effective_end_date: "",
        is_current: true,
        remark: "Night shift hours",
        // Tambahkan daily_schedules untuk 7 hari
        daily_schedules: [
          {
            day_index: 0,
            schedule: { code: "OFF", name: "Day Off" },
            start_time: "",
            end_time: "",
          }, // Sunday
          {
            day_index: 1,
            schedule: { code: "N", name: "Night" },
            start_time: "23:00",
            end_time: "07:00",
          }, // Monday
          {
            day_index: 2,
            schedule: { code: "N", name: "Night" },
            start_time: "23:00",
            end_time: "07:00",
          }, // Tuesday
          {
            day_index: 3,
            schedule: { code: "N", name: "Night" },
            start_time: "23:00",
            end_time: "07:00",
          }, // Wednesday
          {
            day_index: 4,
            schedule: { code: "N", name: "Night" },
            start_time: "23:00",
            end_time: "07:00",
          }, // Thursday
          {
            day_index: 5,
            schedule: { code: "N", name: "Night" },
            start_time: "23:00",
            end_time: "07:00",
          }, // Friday
          {
            day_index: 6,
            schedule: { code: "OFF", name: "Day Off" },
            start_time: "",
            end_time: "",
          }, // Saturday
        ],
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
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
          department_code: "OPERATIONS",
          department_name: "Operations",
          position_code: "MANAGER",
          position_name: "Manager",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
        {
          employee_id: "EMP002",
          name: "Jane Smith",
          department_code: "HUMAN_RESOURCES",
          department_name: "Human Resources",
          position_code: "STAFF",
          position_name: "Staff",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
        {
          employee_id: "EMP003",
          name: "Robert Johnson",
          department_code: "Finance",
          department_name: "Finance",
          position_code: "STAFF",
          position_name: "Staff",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
        {
          employee_id: "EMP004",
          name: "Emily Davis",
          department_code: "INFORMATION_TECHNOLOGY",
          department_name: "Information Technology",
          position_code: "STAFF",
          position_name: "Staff",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
        {
          employee_id: "EMP005",
          name: "Michael Wilson",
          department_code: "INFORMATION_TECHNOLOGY",
          department_name: "Information Technology",
          position_code: "STAFF",
          position_name: "Staff",
          placement_code: "AMORA_UBUD",
          placement_name: "Amora Ubud",
        },
      ];

      this.workScheduleOptions = [
        {
          code: "R",
          name: "Regular Shift (8:00-17:00)",
          work_schedule_type_code: "FIXED",
          work_schedule_type_name: "Fixed",
          working_days: [1, 2, 3, 4, 5],
          default_start_time: "08:00",
          default_end_time: "17:00",
          default_break_duration: 60,
        },
        {
          code: "F",
          name: "Flexible Hours (9:00-18:00)",
          work_schedule_type_code: "FLEXIBLE",
          work_schedule_type_name: "Flexible",
          working_days: [1, 2, 3, 4, 5],
          default_start_time: "09:00",
          default_end_time: "18:00",
          default_break_duration: 60,
        },
        {
          code: "N",
          name: "Night Shift (23:00-07:00)",
          work_schedule_type_code: "FIXED",
          work_schedule_type_name: "Fixed",
          working_days: [1, 2, 3, 4, 5],
          default_start_time: "23:00",
          default_end_time: "07:00",
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

  async switchSchedule(formData: any) {
    try {
      const employeeIndex = this.currentWeekData.findIndex(
        (emp: any) => emp.employee_id === formData.employee_id
      );

      if (employeeIndex === -1) return;

      const scheduleIndex = this.currentWeekData[
        employeeIndex
      ].daily_schedules.findIndex(
        (schedule: any) => schedule.day_index === formData!.day_index
      );

      if (scheduleIndex !== -1) {
        const newSchedule = this.workScheduleOptions.find(
          (item: any) => item.code === formData.newSchedule
        );

        this.currentWeekData[employeeIndex].daily_schedules[scheduleIndex] = {
          day_index: formData.day_index,
          schedule: {
            code: formData.new_schedule,
            name: newSchedule?.name || "Day Off",
          },
          start_time: formData.start_time || "",
          end_time: formData.end_time || "",
          reason: formData.reason || "",
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };

        getToastSuccess(this.$t("messages.attendance.success.switchSchedule"));
      }

      this.showModal = false;
    } catch (error) {
      getError(error);
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
      dayIndex: params.day_index,
      dayName: params.day_name,
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
    return schedule?.schedule?.code || "OFF";
  }

  getScheduleName(employeeId: string, dayIndex: number): string {
    const schedule = this.getSchedule(employeeId, dayIndex);
    return schedule?.schedule?.name || "Day Off";
  }

  getScheduleTime(employeeId: string, dayIndex: number): string {
    const schedule = this.getSchedule(employeeId, dayIndex);
    if (!schedule || !schedule.start_time || !schedule.end_time) return "";
    return `${schedule.start_time} - ${schedule.end_time}`;
  }

  getSelectedScheduleName(): string {
    const shift = this.workScheduleOptions.find(
      (item: any) => item.code === this.newScheduleCode
    );
    return shift?.name || "";
  }

  getScheduleStartTime(): string {
    const scheduleMap: { [key: string]: string } = {
      R: "08:00",
      F: "09:00",
      N: "23:00",
      M: "06:00",
      E: "14:00",
      OFF: "",
    };
    return scheduleMap[this.newScheduleCode] || "";
  }

  getScheduleEndTime(): string {
    const scheduleMap: { [key: string]: string } = {
      R: "17:00",
      F: "18:00",
      N: "07:00",
      M: "15:00",
      E: "23:00",
      OFF: "",
    };
    return scheduleMap[this.newScheduleCode] || "";
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

  // getShift(employeeId: number | string, dayIndex: number): Shift | undefined {
  //   return this.shifts.find(
  //     (shift) => shift.employee_id == employeeId && shift.day_index == dayIndex
  //   );
  // }

  // getShiftCode(employeeId: number | string, dayIndex: number): string {
  //   const shift = this.getShift(employeeId, dayIndex);
  //   return shift ? shift.shift_type : "OFF";
  // }

  // getShiftName(employeeId: number | string, dayIndex: number): string {
  //   const shift = this.getShift(employeeId, dayIndex);
  //   if (!shift) return "Day Off";
  //   return;
  // }
}
