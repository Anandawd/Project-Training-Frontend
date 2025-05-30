import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
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
import AttendanceImportExport from "./attendance-import-export/attendance-import-export.vue";
import CInputForm from "./attendance-input-form/attendance-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
    CDatepicker,
    AttendanceImportExport,
  },
})
export default class Attendance extends Vue {
  // data
  public rowData: any = [];
  public filteredData: any = [];
  public deleteParam: any;
  public currentDate: string = new Date().toISOString().split("T")[0];

  // options data
  public employeeOptions: any = [];
  public statusOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();
  public importExportElement: any = ref();

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  public currentDateFilter: string = new Date().toISOString().split("T")[0];
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
    currentDate: new Date().toISOString().split("T")[0],
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
    const today = new Date().toISOString().split("T")[0];
    this.currentDate = today;
    this.searchDefault.currentDate = today;
    this.loadData();
  }

  mounted(): void {
    this.$nextTick(() => {
      this.loadDataGrid(this.searchDefault);
    });
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
        width: 80,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.date"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "date",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeName"),
        field: "employee_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "department_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "position_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "placement_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.currentSchedule"),
        field: "current_schedule_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.checkIn"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "check_in",
        width: 80,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.checkOut"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "check_out",
        width: 80,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.workingHours"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "working_hours",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.overtime"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "overtime",
        width: 80,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 100,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "";
          let statusText = "";

          switch (status) {
            case "PRESENT":
              badgeClass = "bg-success";
              statusText = "Present";
              break;
            case "LATE":
              badgeClass = "bg-warning";
              statusText = "Late";
              break;
            case "ABSENT":
              badgeClass = "bg-danger";
              statusText = "Absent";
              break;
            case "LEAVE":
              badgeClass = "bg-info";
              statusText = "Leave";
              break;
          }
          return `<span class="badge ${badgeClass} py-1 px-3">${statusText}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
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

  handleShowModal(params: any, mode: any) {
    if (params === "EXPORT") {
      this.importExportElement.showExport();
      return;
    }
    if (params === "IMPORT") {
      this.importExportElement.showImport();
      return;
    }
  }

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

  async handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.attendance.confirm.deleteAttendance"
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    if (search.currentDate) {
      this.currentDate = search.currentDate;
      this.searchDefault.currentDate = search.currentDate;
    }
    this.loadDataGrid(search);
  }

  onDateFilterChange(search: any) {
    if (search.currentDate) {
      this.currentDate = search.currentDate;
      this.searchDefault.currentDate = search.currentDate;
      this.refreshData(search);
    }
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.loadMockData();
      this.loadDropdown();
      // this.loadDataGrid(this.searchDefault);
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(search: any = this.searchDefault) {
    try {
      /*
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
        Date: search.currentDate
      };
      const { data } = await attendanceAPI.GetAttendanceList(params);
      this.rowData = data;
      */

      const filterDate = search.currentDate || this.currentDate;

      let dateFilteredData = this.filterByDate(this.rowData, filterDate);

      let filteredData = [...dateFilteredData];

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
                return item.status === "PRESENT";
              case 2:
                return item.status === "LATE";
              case 3:
                return item.status === "ABSENT";
              case 4:
                return item.status === "LEAVE";
              default:
                return true;
            }
          });
        }
      }

      this.filteredData = filteredData;
      if (this.gridApi) {
        this.gridApi.setRowData(filteredData);
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowData = [
      // Hari ini
      {
        id: 1,
        date: new Date().toISOString().split("T")[0],
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_name: "IT",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "08:00",
        check_out: "16:00",
        working_hours: "8",
        overtime: "0",
        status: "PRESENT",
        remark: "",
      },
      {
        id: 2,
        date: new Date().toISOString().split("T")[0],
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_name: "Marketing",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "08:15",
        check_out: "16:00",
        working_hours: "7.75",
        overtime: "0",
        status: "LATE",
        remark: "Terlambat 15 menit",
      },
      {
        id: 3,
        date: new Date().toISOString().split("T")[0],
        employee_id: "EMP003",
        employee_name: "Robert Johnson",
        department_name: "Finance",
        position_name: "Manager",
        current_schedule_name: "Regular",
        check_in: "",
        check_out: "",
        working_hours: "0",
        overtime: "0",
        status: "LEAVE",
        remark: "Cuti tahunan",
      },
      {
        id: 4,
        date: new Date().toISOString().split("T")[0],
        employee_id: "EMP004",
        employee_name: "Emily Davis",
        department_name: "IT",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "",
        check_out: "",
        working_hours: "0",
        overtime: "0",
        status: "ABSENT",
        remark: "Sakit",
      },
      {
        id: 5,
        date: new Date().toISOString().split("T")[0],
        employee_id: "EMP005",
        employee_name: "Michael Wilson",
        department_name: "IT",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "07:45",
        check_out: "17:30",
        working_hours: "9.75",
        overtime: "1.75",
        status: "PRESENT",
        remark: "Lembur project",
      },
      // Kemarin
      {
        id: 6,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_name: "IT",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "08:00",
        check_out: "16:00",
        working_hours: "8",
        overtime: "0",
        status: "PRESENT",
        remark: "",
      },
      {
        id: 7,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_name: "Marketing",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "08:00",
        check_out: "16:00",
        working_hours: "8",
        overtime: "0",
        status: "PRESENT",
        remark: "",
      },
      // Besok (untuk testing)
      {
        id: 8,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_name: "IT",
        position_name: "Staff",
        current_schedule_name: "Regular",
        check_in: "08:00",
        check_out: "16:00",
        working_hours: "8",
        overtime: "0",
        status: "PRESENT",
        remark: "",
      },
    ];
  }

  async loadDropdown() {
    try {
      /*
          const promises = [
            attendanceAPI.GetEmployeeOptions().then(response => {
              this.employeeOptions = response.data;
            }),
            attendanceAPI.GetStatusOptions().then(response => {
              this.statusOptions = response.data;
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
          current_schedule_code: "R",
          current_schedule_name: "Regular Shift",
          default_working_hours: 8,
        },
        {
          employee_id: "EMP002",
          name: "Jane Smith",
          department_code: "HUMAN_RESOURCES",
          department_name: "Human Resources",
          position_code: "STAFF",
          position_name: "Staff",
          current_schedule_code: "M",
          current_schedule_name: "Morning Shift",
          default_working_hours: 8,
        },
        {
          employee_id: "EMP003",
          name: "Robert Johnson",
          department_code: "Finance",
          department_name: "Finance",
          position_code: "STAFF",
          position_name: "Staff",
          current_schedule_code: "E",
          current_schedule_name: "Evening Shift",
          default_working_hours: 8,
        },
        {
          employee_id: "EMP004",
          name: "Emily Davis",
          department_code: "INFORMATION_TECHNOLOGY",
          department_name: "Information Technology",
          position_code: "STAFF",
          position_name: "Staff",
          current_schedule_code: "M",
          current_schedule_name: "Morning Shift",
          default_working_hours: 8,
        },
        {
          employee_id: "EMP005",
          name: "Michael Wilson",
          department_code: "INFORMATION_TECHNOLOGY",
          department_name: "Information Technology",
          position_code: "STAFF",
          position_name: "Staff",
          current_schedule_code: "R",
          current_schedule_name: "Regular Shift",
          default_working_hours: 8,
        },
      ];

      this.statusOptions = [
        {
          code: "PRESENT",
          name: "Present",
        },
        {
          code: "LATE",
          name: "Late",
        },
        {
          code: "ABSENT",
          name: "Absent",
        },
        {
          code: "LEAVE",
          name: "Leave",
        },
      ];
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      /*
      const { data } = await attendanceAPI.GetAttendance(id);
      this.populateForm(data);
      */

      const attendance = this.rowData.find((item: any) => item.id === params);

      if (attendance) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(attendance);
        });
      } else {
        getToastError(this.$t("messages.employee.error.notFoundAttendance"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      /*
      const { status2 } = await attendanceAPI.InsertAttendance(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
      */

      console.log("insertData", formData);
      const newId = Math.max(...this.rowData.map((item: any) => item.id)) + 1;
      const newAttendance = {
        id: newId,
        employee_id: formData.employee_id,
        employee_name: formData.employee_name,
        department_code: formData.department_code,
        department_name: formData.department_name,
        position_code: formData.position_code,
        position_name: formData.position_name,
        current_schedule_code: formData.current_schedule_code,
        current_schedule_name: formData.current_schedule_name,
        date: formData.date,
        check_in: formData.check_in,
        check_out: formData.check_out,
        default_working_hours: formData.default_working_hours,
        working_hours: formData.working_hours,
        overtime: formData.overtime,
        status: formData.status,
        remark: formData.remark || "",
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };
      console.log("newAttendance", newAttendance);
      this.rowData.push(newAttendance);
      this.searchDefault.filter = [0];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.saveAttendance"));
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      /*
      const { status2 } = await attendanceAPI.UpdateAttendance(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
      */

      const index = this.rowData.findIndex(
        (item: any) => item.id === formData.id
      );
      if (index !== -1) {
        this.rowData[index] = {
          ...this.rowData[index],
          date: formData.date,
          check_in: formData.check_in,
          check_out: formData.check_out,
          working_hours: formData.working_hours,
          overtime: formData.overtime,
          status: formData.status,
          remark: formData.remark || "",
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      this.searchDefault.filter = [0];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.updateAttendance"));
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      /*
      const { status2 } = await attendanceAPI.DeleteAttendance(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
      */

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== this.deleteParam
      );

      this.searchDefault.filter = [1];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.deleteAttendance"));
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
      current_schedule_code: params.current_schedule_code,
      current_schedule_name: params.current_schedule_name,
      date: params.date,
      check_in: params.check_in,
      check_out: params.check_out,
      default_working_hours: params.default_working_hours,
      working_hours: params.working_hours,
      overtime: params.overtime,
      status: params.status,
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
      current_schedule_code: params.current_schedule_code,
      current_schedule_name: params.current_schedule_name,
      date: params.date,
      check_in: params.check_in,
      check_out: params.check_out,
      default_working_hours: params.default_working_hours,
      working_hours: params.working_hours,
      overtime: params.overtime,
      status: params.status,
      remark: params.remark,
    };
  }

  filterByDate(data: any[], targetDate: string) {
    if (!targetDate) return data;

    return data.filter((item: any) => {
      if (!item.date) return false;
      return item.date === targetDate;
    });
  }

  formatDisplayDate(dateString: string): string {
    if (!dateString) {
      return new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  navigateDate(direction: number) {
    const currentDateObj = new Date(this.currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + direction);
    const newDate = currentDateObj.toISOString().split("T")[0];

    this.currentDate = newDate;
    this.searchDefault.currentDate = newDate;

    this.$nextTick(() => {
      this.loadDataGrid(this.searchDefault);
    });
  }

  goToToday() {
    const today = new Date().toISOString().split("T")[0];
    this.currentDate = today;
    this.searchDefault.currentDate = today;
    this.loadDataGrid(this.searchDefault);
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  get summaryData() {
    const summary = {
      present: 0,
      late: 0,
      absent: 0,
      leave: 0,
    };

    this.filteredData.forEach((item: any) => {
      switch (item.status) {
        case "PRESENT":
          summary.present++;
          break;
        case "LATE":
          summary.late++;
          break;
        case "ABSENT":
          summary.absent++;
          break;
        case "LEAVE":
          summary.leave++;
          break;
      }
    });

    return summary;
  }
}
