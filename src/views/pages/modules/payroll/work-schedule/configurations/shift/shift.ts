import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import { formatDateTime, formatDateTimeUTC } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./shift-input-form/shift-input-form.vue";

interface Shift {
  id?: number;
  placement_code: string;
  code: string;
  name: string;
  category: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  working_hours: number;
  overtime_multiplier: number;
  split_times: any[];
  departments: any[];
  positions: any[];
  color: string;
  is_split_shift: boolean;
  is_night_shift: boolean;
  is_active: boolean;
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
}

const workScheduleAPI = new WorkScheduleAPI();

@Options({
  components: {
    AgGridVue,
    SearchFilter,
    CModal,
    CDialog,
    CSelect,
    CInput,
    CInputForm,
  },
})
export default class ShiftConfigurations extends Vue {
  // Data
  public rowData: Shift[] = [];
  public deleteParam: any;

  // Options
  public placementOptions: any[] = [];
  public departmentOptions: any[] = [];
  public positionOptions: any[] = [];
  public categoryOptions: any[] = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // Dialog
  public showDialog = false;
  public dialogMessage = "";
  public dialogAction = "";

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
  detailCellRenderer: any;

  // RECYCLE LIFE FUNCTION ===================================================
  created(): void {
    this.loadData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.updatedBy"), value: 2 },
      {
        text: this.$t("commons.filter.createdBy"),
        value: 3,
      },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
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
        cellClass: "action-grid-buttons",
        field: "id",
        width: 100,
        enableRowGroup: false,
        resizeable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
      },
      {
        headerName: this.$t("commons.table.payroll.employee.code"),
        field: "code",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.name"),
        field: "name",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.category"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "category",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.startTime"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "start_time",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.endTime"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "end_time",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.breakDuration"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "break_duration",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.workingHours"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "working_hours",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.splitTimes"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "split_times",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.departments"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "departments",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.positions"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "positions",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t(
          "commons.table.payroll.attendance.overtimeMultiplier"
        ),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "overtime_multiplier",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.color"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "color",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.splitShift"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_split_shift",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.nightShift"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_night_shift",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_active",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklistRenderer: Checklist,
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

  // GENERAL FUNCTION ========================================================
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
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
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

  handleMenu() {}

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
    this.dialogMessage = this.$t("messages.attendance.confirm.deleteShift");
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
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustmentList(params);
      this.rowData = data;
      */

      let filteredData = [...this.rowData];

      if (search.text && search.text.trim()) {
        let searchText = search.text.toLowerCase().trim();
        let searchIndex = search.index;

        filteredData = filteredData.filter((item: any) => {
          switch (searchIndex) {
            case 0:
              return item.code.toLowerCase().includes(searchText);
            case 1:
              return item.name.toLowerCase().includes(searchText);
            case 2:
              return item.updated_by.toLowerCase().includes(searchText);
            case 3:
              return item.created_by.includes(searchText);
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
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustment(id);
      this.populateForm(data);
      */

      const data = this.rowData.find((d: any) => d.id === id);

      if (data) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(data);
        });
      } else {
        getToastError(this.$t("messages.attendance.error.notFoundShift"));
      }
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.rowData = [
      // ========== FRONT OFFICE SHIFTS ==========
      {
        id: 1,
        placement_code: "AMORA_UBUD",
        code: "FO-M",
        name: "Front Office Morning",
        category: "MORNING",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["FRONT_OFFICE", "GUEST_RELATIONS", "CONCIERGE"],
        positions: ["STAFF", "SUPERVISOR", "MANAGER"],
        color: "#28a745",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 2,
        placement_code: "AMORA_UBUD",
        code: "FO-E",
        name: "Front Office Evening",
        category: "EVENING",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["FRONT_OFFICE", "GUEST_RELATIONS"],
        positions: ["STAFF", "SUPERVISOR", "MANAGER"],
        color: "#ffc107",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 3,
        placement_code: "AMORA_UBUD",
        code: "FO-N",
        name: "Front Office Night",
        category: "NIGHT",
        start_time: "23:00",
        end_time: "07:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 2.0,
        split_times: [],
        departments: ["FRONT_OFFICE"],
        positions: ["STAFF", "SUPERVISOR"],
        color: "#343a40",
        is_split_shift: false,
        is_night_shift: true,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== HOUSEKEEPING SHIFTS ==========
      {
        id: 4,
        placement_code: "AMORA_UBUD",
        code: "HK-M",
        name: "Housekeeping Morning",
        category: "MORNING",
        start_time: "08:00",
        end_time: "16:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["HOUSEKEEPING", "LAUNDRY"],
        positions: ["STAFF", "SUPERVISOR", "MANAGER"],
        color: "#17a2b8",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 5,
        placement_code: "AMORA_UBUD",
        code: "HK-E",
        name: "Housekeeping Evening",
        category: "EVENING",
        start_time: "14:00",
        end_time: "22:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["HOUSEKEEPING"],
        positions: ["STAFF", "SUPERVISOR"],
        color: "#fd7e14",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 6,
        placement_code: "AMORA_UBUD",
        code: "HK-N",
        name: "Housekeeping Night Maintenance",
        category: "NIGHT",
        start_time: "22:00",
        end_time: "06:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 2.0,
        split_times: [],
        departments: ["HOUSEKEEPING"],
        positions: ["STAFF"],
        color: "#6c757d",
        is_split_shift: false,
        is_night_shift: true,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== F&B RESTAURANT SHIFTS ==========
      {
        id: 7,
        placement_code: "AMORA_UBUD",
        code: "FB-B",
        name: "F&B Breakfast Service",
        category: "MORNING",
        start_time: "05:00",
        end_time: "13:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["RESTAURANT", "KITCHEN", "BAR"],
        positions: ["STAFF", "SUPERVISOR", "CHEF", "WAITER", "BARISTA"],
        color: "#e83e8c",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 8,
        placement_code: "AMORA_UBUD",
        code: "FB-L",
        name: "F&B Lunch Service",
        category: "AFTERNOON",
        start_time: "10:00",
        end_time: "18:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["RESTAURANT", "KITCHEN", "BAR"],
        positions: ["STAFF", "SUPERVISOR", "CHEF", "WAITER"],
        color: "#6610f2",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 9,
        placement_code: "AMORA_UBUD",
        code: "FB-D",
        name: "F&B Dinner Service",
        category: "EVENING",
        start_time: "16:00",
        end_time: "00:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["RESTAURANT", "KITCHEN", "BAR"],
        positions: ["STAFF", "SUPERVISOR", "CHEF", "WAITER", "BARTENDER"],
        color: "#6f42c1",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== SPLIT SHIFTS ==========
      {
        id: 10,
        placement_code: "AMORA_UBUD",
        code: "FB-SP1",
        name: "F&B Split Breakfast/Dinner",
        category: "SPLIT",
        start_time: "06:00",
        end_time: "21:00",
        break_duration: 120,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [
          { start: "06:00", end: "10:00", description: "Breakfast Service" },
          { start: "17:00", end: "21:00", description: "Dinner Service" },
        ],
        departments: ["RESTAURANT", "KITCHEN"],
        positions: ["STAFF", "CHEF", "WAITER"],
        color: "#20c997",
        is_split_shift: true,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 11,
        placement_code: "AMORA_UBUD",
        code: "FB-SP2",
        name: "F&B Split Lunch/Late Night",
        category: "SPLIT",
        start_time: "11:00",
        end_time: "01:00",
        break_duration: 180,
        working_hours: 8,
        overtime_multiplier: 1.8,
        split_times: [
          { start: "11:00", end: "15:00", description: "Lunch Service" },
          { start: "21:00", end: "01:00", description: "Late Night Service" },
        ],
        departments: ["RESTAURANT", "BAR"],
        positions: ["STAFF", "WAITER", "BARTENDER"],
        color: "#adb5bd",
        is_split_shift: true,
        is_night_shift: true,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== SECURITY SHIFTS ==========
      {
        id: 12,
        placement_code: "AMORA_UBUD",
        code: "SEC-D",
        name: "Security Day Shift",
        category: "MORNING",
        start_time: "06:00",
        end_time: "18:00",
        break_duration: 120,
        working_hours: 12,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["SECURITY"],
        positions: ["STAFF", "SUPERVISOR"],
        color: "#dc3545",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 13,
        placement_code: "AMORA_UBUD",
        code: "SEC-N",
        name: "Security Night Shift",
        category: "NIGHT",
        start_time: "18:00",
        end_time: "06:00",
        break_duration: 120,
        working_hours: 12,
        overtime_multiplier: 2.0,
        split_times: [],
        departments: ["SECURITY"],
        positions: ["STAFF", "SUPERVISOR"],
        color: "#721c24",
        is_split_shift: false,
        is_night_shift: true,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== ENGINEERING & MAINTENANCE ==========
      {
        id: 14,
        placement_code: "AMORA_UBUD",
        code: "ENG-M",
        name: "Engineering Morning",
        category: "MORNING",
        start_time: "07:00",
        end_time: "15:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["ENGINEERING", "MAINTENANCE"],
        positions: ["STAFF", "SUPERVISOR", "TECHNICIAN"],
        color: "#198754",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 15,
        placement_code: "AMORA_UBUD",
        code: "ENG-E",
        name: "Engineering Evening",
        category: "EVENING",
        start_time: "15:00",
        end_time: "23:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["ENGINEERING", "MAINTENANCE"],
        positions: ["STAFF", "TECHNICIAN"],
        color: "#20c997",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 16,
        placement_code: "AMORA_UBUD",
        code: "ENG-EM",
        name: "Engineering Emergency On-Call",
        category: "NIGHT",
        start_time: "23:00",
        end_time: "07:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 2.5,
        split_times: [],
        departments: ["ENGINEERING", "MAINTENANCE"],
        positions: ["TECHNICIAN", "SUPERVISOR"],
        color: "#fd7e14",
        is_split_shift: false,
        is_night_shift: true,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== SPA & WELLNESS ==========
      {
        id: 17,
        placement_code: "AMORA_UBUD",
        code: "SPA-M",
        name: "Spa Morning Service",
        category: "MORNING",
        start_time: "09:00",
        end_time: "17:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["SPA", "WELLNESS"],
        positions: ["STAFF", "THERAPIST", "SUPERVISOR"],
        color: "#b197fc",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 18,
        placement_code: "AMORA_UBUD",
        code: "SPA-E",
        name: "Spa Evening Service",
        category: "EVENING",
        start_time: "13:00",
        end_time: "21:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["SPA", "WELLNESS"],
        positions: ["STAFF", "THERAPIST"],
        color: "#d63384",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== SALES & MARKETING ==========
      {
        id: 19,
        placement_code: "AMORA_UBUD",
        code: "SM-R",
        name: "Sales & Marketing Regular",
        category: "MORNING",
        start_time: "08:00",
        end_time: "17:00",
        break_duration: 60,
        working_hours: 9,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["SALES", "MARKETING"],
        positions: ["STAFF", "SUPERVISOR", "MANAGER", "COORDINATOR"],
        color: "#0d6efd",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== FITNESS & RECREATION ==========
      {
        id: 20,
        placement_code: "AMORA_UBUD",
        code: "FIT-M",
        name: "Fitness Center Morning",
        category: "MORNING",
        start_time: "06:00",
        end_time: "14:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["FITNESS", "RECREATION"],
        positions: ["STAFF", "TRAINER", "SUPERVISOR"],
        color: "#ff6b35",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 21,
        placement_code: "AMORA_UBUD",
        code: "FIT-E",
        name: "Fitness Center Evening",
        category: "EVENING",
        start_time: "14:00",
        end_time: "22:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["FITNESS", "RECREATION"],
        positions: ["STAFF", "TRAINER"],
        color: "#ff8500",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== TRANSPORTATION ==========
      {
        id: 22,
        placement_code: "AMORA_UBUD",
        code: "TRANS-D",
        name: "Transportation Day Service",
        category: "MORNING",
        start_time: "07:00",
        end_time: "19:00",
        break_duration: 120,
        working_hours: 12,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["TRANSPORTATION"],
        positions: ["DRIVER", "SUPERVISOR"],
        color: "#495057",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
      {
        id: 23,
        placement_code: "AMORA_UBUD",
        code: "TRANS-N",
        name: "Transportation Night Service",
        category: "NIGHT",
        start_time: "19:00",
        end_time: "07:00",
        break_duration: 120,
        working_hours: 12,
        overtime_multiplier: 2.0,
        split_times: [],
        departments: ["TRANSPORTATION"],
        positions: ["DRIVER"],
        color: "#212529",
        is_split_shift: false,
        is_night_shift: true,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== GARDENING & LANDSCAPING ==========
      {
        id: 24,
        placement_code: "AMORA_UBUD",
        code: "GARD-M",
        name: "Gardening Morning",
        category: "MORNING",
        start_time: "06:00",
        end_time: "14:00",
        break_duration: 60,
        working_hours: 8,
        overtime_multiplier: 1.5,
        split_times: [],
        departments: ["GARDENING", "LANDSCAPING"],
        positions: ["STAFF", "SUPERVISOR"],
        color: "#52b788",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== EVENTS & BANQUET ==========
      {
        id: 25,
        placement_code: "AMORA_UBUD",
        code: "EVT-FX",
        name: "Events & Banquet Flexible",
        category: "SPLIT",
        start_time: "08:00",
        end_time: "23:00",
        break_duration: 180,
        working_hours: 8,
        overtime_multiplier: 1.8,
        split_times: [
          { start: "08:00", end: "12:00", description: "Setup & Preparation" },
          { start: "17:00", end: "23:00", description: "Event Service" },
        ],
        departments: ["EVENTS", "BANQUET"],
        positions: ["STAFF", "COORDINATOR", "SUPERVISOR"],
        color: "#f72585",
        is_split_shift: true,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },

      // ========== DAY OFF ==========
      {
        id: 26,
        placement_code: "AMORA_UBUD",
        code: "OFF",
        name: "Day Off",
        category: "OFF",
        start_time: "",
        end_time: "",
        break_duration: 0,
        working_hours: 0,
        overtime_multiplier: 0,
        split_times: [],
        departments: [], // Berlaku untuk semua departemen
        positions: [], // Berlaku untuk semua posisi
        color: "#6c757d",
        is_split_shift: false,
        is_night_shift: false,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        created_by: "Admin",
        updated_at: "2025-01-01T00:00:00Z",
        updated_by: "Admin",
      },
    ];
  }

  async loadDropdown() {
    try {
      /*
      const promises = [
        salaryAdjustmentAPI.GetEmployeeOptions().then(response => {
          this.employeeOptions = response.data;
        }),
        salaryAdjustmentAPI.GetAdjustmentReasonOptions().then(response => {
          this.adjustmentReasonOptions = response.data;
        }),
      ];

      await Promise.all(promises);
      */

      this.placementOptions = [
        {
          code: "AMORA_UBUD",
          name: "Amora Ubud",
        },
        {
          code: "AMORA_CANGGU",
          name: "Amora Canggu",
        },
      ];
      this.departmentOptions = [
        // Front of House Departments
        { code: "FRONT_OFFICE", name: "Front Office" },
        { code: "GUEST_RELATIONS", name: "Guest Relations" },
        { code: "CONCIERGE", name: "Concierge" },
        { code: "BELL_SERVICE", name: "Bell Service" },
        { code: "VALET_PARKING", name: "Valet Parking" },

        // Food & Beverage Departments
        { code: "RESTAURANT", name: "Restaurant" },
        { code: "KITCHEN", name: "Kitchen" },
        { code: "BAR", name: "Bar & Lounge" },
        { code: "ROOM_SERVICE", name: "Room Service" },
        { code: "BANQUET", name: "Banquet & Events" },
        { code: "CATERING", name: "Catering" },

        // Back of House Departments
        { code: "HOUSEKEEPING", name: "Housekeeping" },
        { code: "LAUNDRY", name: "Laundry" },
        { code: "MAINTENANCE", name: "Maintenance" },
        { code: "ENGINEERING", name: "Engineering" },
        { code: "SECURITY", name: "Security" },
        { code: "STORES", name: "Stores & Purchasing" },

        // Recreation & Wellness
        { code: "SPA", name: "Spa" },
        { code: "WELLNESS", name: "Wellness Center" },
        { code: "FITNESS", name: "Fitness Center" },
        { code: "RECREATION", name: "Recreation" },
        { code: "POOL", name: "Pool & Beach" },
        { code: "ACTIVITIES", name: "Activities & Entertainment" },

        // Support Departments
        { code: "SALES", name: "Sales" },
        { code: "MARKETING", name: "Marketing" },
        { code: "REVENUE", name: "Revenue Management" },
        { code: "RESERVATIONS", name: "Reservations" },
        { code: "ACCOUNTING", name: "Accounting" },
        { code: "HR", name: "Human Resources" },
        { code: "IT", name: "Information Technology" },
        { code: "ADMIN", name: "Administration" },

        // Transportation & Logistics
        { code: "TRANSPORTATION", name: "Transportation" },
        { code: "LOGISTICS", name: "Logistics" },
        { code: "GARDENING", name: "Gardening & Landscaping" },

        // Management
        { code: "GENERAL_MANAGEMENT", name: "General Management" },
        { code: "OPERATIONS", name: "Operations" },
        { code: "QUALITY", name: "Quality Assurance" },
      ];

      this.positionOptions = [
        // ========== MANAGEMENT POSITIONS ==========
        { code: "GM", name: "General Manager" },
        { code: "AGM", name: "Assistant General Manager" },
        { code: "DOS", name: "Director of Sales" },
        { code: "DOM", name: "Director of Marketing" },
        { code: "DOF", name: "Director of Finance" },
        { code: "DORM", name: "Director of Rooms" },
        { code: "DOFB", name: "Director of Food & Beverage" },
        { code: "DOE", name: "Director of Engineering" },
        { code: "DOHR", name: "Director of Human Resources" },

        // ========== DEPARTMENT MANAGERS ==========
        { code: "FOM", name: "Front Office Manager" },
        { code: "HKM", name: "Housekeeping Manager" },
        { code: "FBM", name: "Food & Beverage Manager" },
        { code: "RM", name: "Restaurant Manager" },
        { code: "BM", name: "Bar Manager" },
        { code: "KM", name: "Kitchen Manager" },
        { code: "EXC", name: "Executive Chef" },
        { code: "SEC_MGR", name: "Security Manager" },
        { code: "ENG_MGR", name: "Engineering Manager" },
        { code: "SPA_MGR", name: "Spa Manager" },
        { code: "SM", name: "Sales Manager" },
        { code: "MM", name: "Marketing Manager" },
        { code: "RVM", name: "Revenue Manager" },
        { code: "AM", name: "Accounting Manager" },
        { code: "HRM", name: "HR Manager" },
        { code: "ITM", name: "IT Manager" },

        // ========== SUPERVISORS ==========
        { code: "FO_SUP", name: "Front Office Supervisor" },
        { code: "HK_SUP", name: "Housekeeping Supervisor" },
        { code: "FB_SUP", name: "F&B Supervisor" },
        { code: "REST_SUP", name: "Restaurant Supervisor" },
        { code: "BAR_SUP", name: "Bar Supervisor" },
        { code: "KIT_SUP", name: "Kitchen Supervisor" },
        { code: "SEC_SUP", name: "Security Supervisor" },
        { code: "ENG_SUP", name: "Engineering Supervisor" },
        { code: "SPA_SUP", name: "Spa Supervisor" },
        { code: "MAINT_SUP", name: "Maintenance Supervisor" },
        { code: "LAUN_SUP", name: "Laundry Supervisor" },

        // ========== COORDINATORS & SPECIALISTS ==========
        { code: "COORD", name: "Coordinator" },
        { code: "EVT_COORD", name: "Events Coordinator" },
        { code: "BANQ_COORD", name: "Banquet Coordinator" },
        { code: "SALES_COORD", name: "Sales Coordinator" },
        { code: "MKTG_COORD", name: "Marketing Coordinator" },
        { code: "GR_COORD", name: "Guest Relations Coordinator" },
        { code: "ACT_COORD", name: "Activities Coordinator" },
        { code: "SPECIALIST", name: "Specialist" },
        { code: "SR_SPECIALIST", name: "Senior Specialist" },

        // ========== FRONT OFFICE POSITIONS ==========
        { code: "FO_STAFF", name: "Front Office Staff" },
        { code: "GSA", name: "Guest Service Agent" },
        { code: "RECEPTIONIST", name: "Receptionist" },
        { code: "NIGHT_AUDITOR", name: "Night Auditor" },
        { code: "BELL_CAPTAIN", name: "Bell Captain" },
        { code: "BELLBOY", name: "Bellboy" },
        { code: "CONCIERGE_STAFF", name: "Concierge Staff" },
        { code: "DOOR_PERSON", name: "Door Person" },
        { code: "VALET", name: "Valet" },

        // ========== HOUSEKEEPING POSITIONS ==========
        { code: "HK_STAFF", name: "Housekeeping Staff" },
        { code: "ROOM_ATTENDANT", name: "Room Attendant" },
        { code: "PUBLIC_AREA", name: "Public Area Attendant" },
        { code: "LAUNDRY_STAFF", name: "Laundry Staff" },
        { code: "LAUNDRY_ATT", name: "Laundry Attendant" },
        { code: "FLOOR_SUP", name: "Floor Supervisor" },
        { code: "INSPECTOR", name: "Room Inspector" },

        // ========== KITCHEN POSITIONS ==========
        { code: "CHEF", name: "Chef" },
        { code: "SOUS_CHEF", name: "Sous Chef" },
        { code: "CHEF_DE_PARTIE", name: "Chef de Partie" },
        { code: "COMMIS_CHEF", name: "Commis Chef" },
        { code: "KITCHEN_STAFF", name: "Kitchen Staff" },
        { code: "COOK", name: "Cook" },
        { code: "PREP_COOK", name: "Prep Cook" },
        { code: "PASTRY_CHEF", name: "Pastry Chef" },
        { code: "BAKER", name: "Baker" },
        { code: "STEWARD", name: "Kitchen Steward" },

        // ========== RESTAURANT & BAR POSITIONS ==========
        { code: "REST_STAFF", name: "Restaurant Staff" },
        { code: "WAITER", name: "Waiter" },
        { code: "WAITRESS", name: "Waitress" },
        { code: "SR_WAITER", name: "Senior Waiter" },
        { code: "CAPTAIN", name: "Captain Waiter" },
        { code: "HOSTESS", name: "Hostess" },
        { code: "BARTENDER", name: "Bartender" },
        { code: "BARISTA", name: "Barista" },
        { code: "BAR_STAFF", name: "Bar Staff" },
        { code: "SOMMELIER", name: "Sommelier" },

        // ========== BANQUET & EVENTS POSITIONS ==========
        { code: "BANQ_STAFF", name: "Banquet Staff" },
        { code: "BANQ_WAITER", name: "Banquet Waiter" },
        { code: "BANQ_CAPTAIN", name: "Banquet Captain" },
        { code: "SETUP_CREW", name: "Setup Crew" },
        { code: "AV_TECH", name: "Audio Visual Technician" },

        // ========== SPA & WELLNESS POSITIONS ==========
        { code: "SPA_STAFF", name: "Spa Staff" },
        { code: "THERAPIST", name: "Therapist" },
        { code: "MASSAGE_THERAPIST", name: "Massage Therapist" },
        { code: "SPA_ATTENDANT", name: "Spa Attendant" },
        { code: "FITNESS_INSTRUCTOR", name: "Fitness Instructor" },
        { code: "PERSONAL_TRAINER", name: "Personal Trainer" },
        { code: "LIFEGUARD", name: "Lifeguard" },

        // ========== ENGINEERING & MAINTENANCE POSITIONS ==========
        { code: "ENG_STAFF", name: "Engineering Staff" },
        { code: "TECHNICIAN", name: "Technician" },
        { code: "ELECTRICIAN", name: "Electrician" },
        { code: "PLUMBER", name: "Plumber" },
        { code: "AC_TECH", name: "AC Technician" },
        { code: "MAINT_STAFF", name: "Maintenance Staff" },
        { code: "HANDYMAN", name: "Handyman" },
        { code: "GARDENER", name: "Gardener" },
        { code: "PAINTER", name: "Painter" },

        // ========== SECURITY POSITIONS ==========
        { code: "SEC_STAFF", name: "Security Staff" },
        { code: "SEC_GUARD", name: "Security Guard" },
        { code: "SEC_OFFICER", name: "Security Officer" },
        { code: "NIGHT_SEC", name: "Night Security" },

        // ========== SALES & MARKETING POSITIONS ==========
        { code: "SALES_STAFF", name: "Sales Staff" },
        { code: "SALES_EXEC", name: "Sales Executive" },
        { code: "SR_SALES_EXEC", name: "Senior Sales Executive" },
        { code: "SALES_ADMIN", name: "Sales Admin" },
        { code: "MKTG_STAFF", name: "Marketing Staff" },
        { code: "MKTG_EXEC", name: "Marketing Executive" },
        { code: "MKTG_ADMIN", name: "Marketing Admin" },
        { code: "PR_OFFICER", name: "PR Officer" },
        { code: "DIGITAL_MKTG", name: "Digital Marketing Specialist" },

        // ========== RESERVATIONS & REVENUE POSITIONS ==========
        { code: "RES_STAFF", name: "Reservations Staff" },
        { code: "RES_AGENT", name: "Reservations Agent" },
        { code: "RES_SUP", name: "Reservations Supervisor" },
        { code: "REV_ANALYST", name: "Revenue Analyst" },
        { code: "REV_COORD", name: "Revenue Coordinator" },

        // ========== ACCOUNTING & FINANCE POSITIONS ==========
        { code: "ACC_STAFF", name: "Accounting Staff" },
        { code: "ACCOUNTANT", name: "Accountant" },
        { code: "SR_ACCOUNTANT", name: "Senior Accountant" },
        { code: "ACC_SUP", name: "Accounting Supervisor" },
        { code: "CASHIER", name: "Cashier" },
        { code: "AP_CLERK", name: "Accounts Payable Clerk" },
        { code: "AR_CLERK", name: "Accounts Receivable Clerk" },
        { code: "COST_CONTROLLER", name: "Cost Controller" },
        { code: "PURCHASING", name: "Purchasing Staff" },
        { code: "STORES_KEEPER", name: "Stores Keeper" },

        // ========== HUMAN RESOURCES POSITIONS ==========
        { code: "HR_STAFF", name: "HR Staff" },
        { code: "HR_OFFICER", name: "HR Officer" },
        { code: "HR_SPECIALIST", name: "HR Specialist" },
        { code: "RECRUITER", name: "Recruiter" },
        { code: "TRAINING_COORD", name: "Training Coordinator" },
        { code: "PAYROLL_STAFF", name: "Payroll Staff" },

        // ========== IT POSITIONS ==========
        { code: "IT_STAFF", name: "IT Staff" },
        { code: "IT_OFFICER", name: "IT Officer" },
        { code: "IT_SPECIALIST", name: "IT Specialist" },
        { code: "SYSTEM_ADMIN", name: "System Administrator" },
        { code: "NETWORK_ADMIN", name: "Network Administrator" },
        { code: "IT_SUPPORT", name: "IT Support" },

        // ========== ADMINISTRATION POSITIONS ==========
        { code: "ADMIN_STAFF", name: "Admin Staff" },
        { code: "ADMIN_OFFICER", name: "Admin Officer" },
        { code: "SECRETARY", name: "Secretary" },
        { code: "RECEPTIONIST_ADMIN", name: "Receptionist" },
        { code: "DATA_ENTRY", name: "Data Entry" },
        { code: "CLERK", name: "Clerk" },

        // ========== TRANSPORTATION POSITIONS ==========
        { code: "DRIVER", name: "Driver" },
        { code: "CHAUFFEUR", name: "Chauffeur" },
        { code: "TRANSPORT_COORD", name: "Transportation Coordinator" },

        // ========== GENERAL POSITIONS ==========
        { code: "STAFF", name: "Staff" },
        { code: "TRAINEE", name: "Trainee" },
        { code: "INTERN", name: "Intern" },
        { code: "ASSISTANT", name: "Assistant" },
        { code: "OFFICER", name: "Officer" },
        { code: "EXECUTIVE", name: "Executive" },
        { code: "SENIOR_STAFF", name: "Senior Staff" },
        { code: "TEAM_LEADER", name: "Team Leader" },
        { code: "SUPERVISOR", name: "Supervisor" },
        { code: "MANAGER", name: "Manager" },
        { code: "SENIOR_MANAGER", name: "Senior Manager" },
        { code: "DIRECTOR", name: "Director" },
      ];

      this.categoryOptions = [
        {
          code: "MORNING",
          name: "Morning",
        },
        {
          code: "MIDDLE",
          name: "Middle",
        },
        {
          code: "AFTERNOON",
          name: "Afternoon",
        },
        {
          code: "EVENING",
          name: "Evening",
        },
        {
          code: "NIGHT",
          name: "Night",
        },
        {
          code: "SPLIT",
          name: "Split",
        },
        {
          code: "OFF",
          name: "Off",
        },
      ];
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.InsertSalaryAdjustment(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
      */

      const newId = Math.max(...this.rowData.map((d: any) => d.id)) + 1;

      const newData = {
        id: newId,
        placement_code: formData.placement_code,
        code: formData.code,
        name: formData.name,
        category: formData.category,
        start_time: formData.start_time,
        end_time: formData.end_time,
        break_duration: formData.break_duration,
        working_hours: formData.working_hours,
        overtime_multiplier: formData.overtime_multiplier,
        split_times: formData.split_times,
        departments: formData.departments,
        positions: formData.positions,
        color: formData.color,
        is_split_shift: formData.is_split_shift,
        is_night_shift: formData.is_night_shift,
        is_active: formData.is_active,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      console.log("new Data", newData);

      this.rowData.push(newData);

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.saveShift"));
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.UpdateSalaryAdjustment(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
      */

      const index = this.rowData.findIndex((d: any) => d.id === formData.id);
      if (index !== -1) {
        this.rowData[index] = {
          ...this.rowData[index],
          code: formData.code,
          name: formData.name,
          category: formData.category,
          start_time: formData.start_time,
          end_time: formData.end_time,
          break_duration: formData.break_duration,
          working_hours: formData.working_hours,
          overtime_multiplier: formData.overtime_multiplier,
          split_times: formData.split_times,
          departments: formData.departments,
          positions: formData.positions,
          color: formData.color,
          is_split_shift: formData.is_split_shift,
          is_night_shift: formData.is_night_shift,
          is_active: formData.is_active,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.updateShift"));
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.DeleteSalaryAdjustment(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
      */

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== this.deleteParam
      );

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.attendance.success.deleteShift"));
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      placement_code: params.placement_code,
      code: params.code,
      name: params.name,
      category: params.category,
      start_time: params.start_time,
      end_time: params.end_time,
      break_duration: params.break_duration,
      working_hours: params.working_hours,
      overtime_multiplier: params.overtime_multiplier,
      split_times: params.split_times,
      departments: params.departments,
      positions: params.positions,
      color: params.color,
      is_split_shift: params.is_split_shift,
      is_night_shift: params.is_night_shift,
      is_active: params.is_active,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      placement_code: params.placement_code,
      code: params.code,
      name: params.name,
      category: params.category,
      start_time: params.start_time,
      end_time: params.end_time,
      break_duration: params.break_duration,
      working_hours: params.working_hours,
      overtime_multiplier: params.overtime_multiplier,
      split_times: params.split_times,
      departments: params.departments,
      positions: params.positions,
      color: params.color,
      is_split_shift: params.is_split_shift,
      is_night_shift: params.is_night_shift,
      is_active: params.is_active,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
