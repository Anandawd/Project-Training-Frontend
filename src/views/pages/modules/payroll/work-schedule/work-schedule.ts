import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
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

// interface Employee {
//   id: number | string;
//   employee_id: string;
//   employee_name: string;
//   department: string;
//   position: string;
// }

// interface Shift {
//   employee_id: number | string;
//   day_index: number;
//   shift_type: string;
//   start_time: string;
//   end_time: string;
//   break_duration: number;
//   location: string;
//   notes: string;
// }

// interface SelectedShift {
//   employee_id: number | string;
//   employee_name: string;
//   dayIndex: number;
// }

interface EmployeeWorkSchedule {
  id: number;
  employee_id: string;
  shift_id: string;
  effective_date: Date;
  end_date: Date;
  working_days: string;
  start_time: string;
  end_time: string;
  break_duration: string;
  is_current: boolean;
  remark: string;
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
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
  // data
  public rowData: any = [];
  public deleteParam: any;
  public currentWeekStart: Date = new Date();
  public weekDays: Day[] = [];

  // options data
  public employeeOptions: any = [];
  public shiftOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

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
    this.loadData();
  }
  mounted(): void {
    console.log("weekDays", this.weekDays);
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
      "separator",
      {
        name: this.$t("commons.contextMenu.switchShift"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowModal(this.paramsData),
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

  handleShowModal(params: any) {}

  handleShowDetail() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData).then(() => {
        this.showForm = false;
      });
    } else {
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
        leaveType: params.leave_type_name,
        dates: `${params.start_date} - ${params.end_date}`,
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
      const leaveAPI = new LeaveAPI();
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await leaveAPI.GetLeaveRequestList(params);
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

      if (search.filter && search.filter.length > 0) {
        const statusFilter = parseInt(search.filter[0]);
        if (statusFilter !== 0) {
          filteredData = filteredData.filter((item: any) => {
            switch (statusFilter) {
              case 1:
                return item.status === "PENDING";
              case 2:
                return item.status === "APPROVED";
              case 3:
                return item.status === "REJECTED";
              default:
                return true;
            }
          });
        }
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
      const leaveAPI = new LeaveAPI();
      const { data } = await leaveAPI.GetLeaveRequest(id);
      this.inputFormElement.form = this.populateForm(data);
      */

      const leave = this.rowData.find((item: any) => item.id === id);

      if (leave) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(leave);
        });
      } else {
        getToastError(this.$t("messages.attendance.error.notFoundLeave"));
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
        status: "PENDING",
        total_quota_leave: 12,
        total_remaining_leave: 10,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        reason: "Family vacation",
        start_date: "2025-02-15",
        end_date: "2025-02-17",
        total_days: 3,
        remark: "Already booked flights",
        created_at: "2025-01-15",
        created_by: "John Doe",
        updated_at: "2025-01-15",
        updated_by: "John Doe",
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
        status: "APPROVED",
        total_quota_leave: 12,
        total_remaining_leave: 8,
        leave_type_code: "T02",
        leave_type_name: "Sick Leave",
        reason: "Medical checkup",
        start_date: "2025-01-20",
        end_date: "2025-01-20",
        total_days: 1,
        remark: "Doctor appointment",
        created_at: "2025-01-18",
        created_by: "Jane Smith",
        updated_at: "2025-01-19",
        updated_by: "HR Manager",
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "Mike Johnson",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        status: "REJECTED",
        total_quota_leave: 12,
        total_remaining_leave: 12,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        reason: "Personal matters",
        start_date: "2025-02-01",
        end_date: "2025-02-05",
        total_days: 5,
        remark: "Insufficient notice period",
        created_at: "2025-01-30",
        created_by: "Mike Johnson",
        updated_at: "2025-01-31",
        updated_by: "HR Manager",
      },
      {
        id: 4,
        employee_id: "EMP003",
        employee_name: "Mike Johnson",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        status: "APPROVED",
        total_quota_leave: 12,
        total_remaining_leave: 10,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        start_date: "2025-01-15",
        end_date: "2025-01-15",
        total_days: 1,
        remark: "",
        created_at: "2025-01-15",
        created_by: "HR Manager",
        updated_at: "2025-01-15",
        updated_by: "HR Manager",
      },
      {
        id: 5,
        employee_id: "EMP005",
        employee_name: "Alex Brown",
        department_code: "MARKETING",
        department_name: "Marketing",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        status: "PENDING",
        total_quota_leave: 12,
        total_remaining_leave: 10,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        start_date: "2025-01-15",
        end_date: "2025-01-15",
        total_days: 1,
        remark: "",
        created_at: "2025-01-15",
        created_by: "HR Manager",
        updated_at: "2025-01-15",
        updated_by: "HR Manager",
      },
      {
        id: 6,
        employee_id: "EMP006",
        employee_name: "Lisa Anderson",
        department_code: "HR",
        department_name: "Human Resources",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        status: "PENDING",
        total_quota_leave: 12,
        total_remaining_leave: 10,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        start_date: "2025-01-15",
        end_date: "2025-01-15",
        total_days: 1,
        remark: "",
        created_at: "2025-01-15",
        created_by: "HR Manager",
        updated_at: "2025-01-15",
        updated_by: "HR Manager",
      },
      {
        id: 7,
        employee_id: "EMP007",
        employee_name: "David Chen",
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        status: "PENDING",
        total_quota_leave: 12,
        total_remaining_leave: 10,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        start_date: "2025-01-15",
        end_date: "2025-01-15",
        total_days: 1,
        remark: "",
        created_at: "2025-01-15",
        created_by: "HR Manager",
        updated_at: "2025-01-15",
        updated_by: "HR Manager",
      },
      {
        id: 8,
        employee_id: "EMP008",
        employee_name: "Emily Davis",
        department_code: "FINANCE",
        department_name: "Finance",
        position_code: "STAFF",
        position_name: "Staff",
        placement_code: "AMORA_UBUD",
        placement_name: "Amora Ubud",
        status: "REJECTED",
        total_quota_leave: 12,
        total_remaining_leave: 10,
        leave_type_code: "T01",
        leave_type_name: "Annual Leave",
        start_date: "2025-01-15",
        end_date: "2025-01-15",
        total_days: 1,
        remark: "",
        created_at: "2025-01-15",
        created_by: "HR Manager",
        updated_at: "2025-01-15",
        updated_by: "HR Manager",
      },
    ];
  }

  async loadDropdown() {
    try {
      /*
      const leaveAPI = new LeaveAPI();
      const promises = [
        leaveAPI.GetEmployeeOptionsForLeave().then(response => {
          this.employeeOptions = response.data;
        }),
        leaveAPI.GetLeaveTypeOptions().then(response => {
          this.leaveTypeOptions = response.data;
        }),
      ];

      await Promise.all(promises);
      */

      //    this.shifts = [
      //   {
      //     employee_id: 1,
      //     day_index: 0,
      //     shift_type: "M",
      //     start_time: "07:00",
      //     end_time: "15:00",
      //     break_duration: 30,
      //     location: "FD",
      //     notes: "Cover for Sarah",
      //   },
      //   {
      //     employee_id: 1,
      //     day_index: 1,
      //     shift_type: "M",
      //     start_time: "07:00",
      //     end_time: "15:00",
      //     break_duration: 30,
      //     location: "FD",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 1,
      //     day_index: 2,
      //     shift_type: "OFF",
      //     start_time: "",
      //     end_time: "",
      //     break_duration: 0,
      //     location: "",
      //     notes: "Requested day off",
      //   },
      //   {
      //     employee_id: 1,
      //     day_index: 3,
      //     shift_type: "M",
      //     start_time: "07:00",
      //     end_time: "15:00",
      //     break_duration: 30,
      //     location: "FD",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 1,
      //     day_index: 4,
      //     shift_type: "M",
      //     start_time: "07:00",
      //     end_time: "15:00",
      //     break_duration: 30,
      //     location: "FD",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 1,
      //     day_index: 5,
      //     shift_type: "E",
      //     start_time: "15:00",
      //     end_time: "23:00",
      //     break_duration: 30,
      //     location: "FD",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 1,
      //     day_index: 6,
      //     shift_type: "E",
      //     start_time: "15:00",
      //     end_time: "23:00",
      //     break_duration: 30,
      //     location: "FD",
      //     notes: "",
      //   },

      //   {
      //     employee_id: 2,
      //     day_index: 0,
      //     shift_type: "E",
      //     start_time: "15:00",
      //     end_time: "23:00",
      //     break_duration: 30,
      //     location: "BO",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 2,
      //     day_index: 1,
      //     shift_type: "E",
      //     start_time: "15:00",
      //     end_time: "23:00",
      //     break_duration: 30,
      //     location: "BO",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 2,
      //     day_index: 2,
      //     shift_type: "E",
      //     start_time: "15:00",
      //     end_time: "23:00",
      //     break_duration: 30,
      //     location: "BO",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 2,
      //     day_index: 3,
      //     shift_type: "OFF",
      //     start_time: "",
      //     end_time: "",
      //     break_duration: 0,
      //     location: "",
      //     notes: "Personal time",
      //   },
      //   {
      //     employee_id: 2,
      //     day_index: 4,
      //     shift_type: "OFF",
      //     start_time: "",
      //     end_time: "",
      //     break_duration: 0,
      //     location: "",
      //     notes: "Personal time",
      //   },
      //   {
      //     employee_id: 2,
      //     day_index: 5,
      //     shift_type: "M",
      //     start_time: "07:00",
      //     end_time: "15:00",
      //     break_duration: 30,
      //     location: "BO",
      //     notes: "",
      //   },
      //   {
      //     employee_id: 2,
      //     day_index: 6,
      //     shift_type: "M",
      //     start_time: "07:00",
      //     end_time: "15:00",
      //     break_duration: 30,
      //     location: "BO",
      //     notes: "",
      //   },
      // ];

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
          total_quota_leave: 12,
          total_remaining_leave: 0,
          SubGroupName: "Employee",
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
          total_quota_leave: 12,
          total_remaining_leave: 10,
          SubGroupName: "Employee",
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
          total_quota_leave: 12,
          total_remaining_leave: 10,
          SubGroupName: "Employee",
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
          total_quota_leave: 12,
          total_remaining_leave: 10,
          SubGroupName: "Employee",
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
          total_quota_leave: 12,
          total_remaining_leave: 10,
          SubGroupName: "Employee",
        },
      ];

      this.shiftOptions = [
        { code: "M", name: "Morning (07:00-15:00)" },
        { code: "E", name: "Evening (15:00-23:00)" },
        { code: "N", name: "Night (23:00-07:00)" },
        { code: "OFF", name: "Day Off" },
        { code: "SP", name: "Split Shift" },
      ];
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      /*
      const leaveAPI = new LeaveAPI();
      const { status2 } = await leaveAPI.InsertLeaveRequest(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.attendance.success.saveLeave"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
      */

      const newId = Math.max(...this.rowData.map((item: any) => item.id)) + 1;

      const newLeave = {
        id: newId,
        employee_id: formData.employee_id,
        employee_name: formData.employee_name,
        department_code: formData.department_code,
        department_name: formData.department_name,
        position_code: formData.position_code,
        position_name: formData.position_name,
        placement_code: formData.placement_code,
        placement_name: formData.placement_name,
        status: "PENDING",
        total_quota_leave: formData.total_quota_leave,
        total_remaining_leave: formData.total_remaining_leave,
        leave_type_code: formData.leave_type_code,
        leave_type_name: formData.leave_type_name,
        reason: formData.reason,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_days: formData.total_days,
        remark: formData.remark,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowData.push(newLeave);

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.saveLeave"));
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      /*
      const leaveAPI = new LeaveAPI();
      const { status2 } = await leaveAPI.UpdateLeaveRequest(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.attendance.success.updateLeave"));
      }
      */

      const index = this.rowData.findIndex(
        (item: any) => item.id === formData.id
      );
      if (index !== -1) {
        this.rowData[index] = {
          ...this.rowData[index],
          leave_type_code: formData.leave_type_code,
          leave_type_name: formData.leave_type_name,
          reason: formData.reason,
          start_date: formData.start_date,
          end_date: formData.end_date,
          total_days: formData.total_days,
          remark: formData.remark,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.updateLeave"));
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      /*
      const leaveAPI = new LeaveAPI();
      const { status2 } = await leaveAPI.DeleteLeaveRequest(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.attendance.success.deleteLeave"));
      }
      */

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== this.deleteParam
      );

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.deleteLeave"));
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      status: params.status,
      total_quota_leave: params.total_quota_leave,
      total_remaining_leave: params.total_remaining_leave,
      leave_type_code: params.leave_type_code,
      leave_type_name: params.leave_type_name,
      reason: params.reason,
      start_date: params.start_date,
      end_date: params.end_date,
      total_days: params.total_days,
      remark: params.remark,
    };
  }

  populateForm(params: any) {
    return {
      id: params,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      department_code: params.department_code,
      department_name: params.department_name,
      position_code: params.position_code,
      position_name: params.position_name,
      placement_code: params.placement_code,
      placement_name: params.placement_name,
      status: params.status,
      total_quota_leave: params.total_quota_leave,
      total_remaining_leave: params.total_remaining_leave,
      leave_type_code: params.leave_type_code,
      leave_type_name: params.leave_type_name,
      reason: params.reason,
      start_date: params.start_date,
      end_date: params.end_date,
      total_days: params.total_days,
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
