import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import WorkScheduleAPI from "@/services/api/payroll/work-schedule/work-schedule";
import { formatDate, formatDateTime, formatDateTimeUTC } from "@/utils/format";
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
import CInputForm from "./schedule-input-form/schedule-input-form.vue";

interface DepartmentAdjustment {
  code: string;
  name: string;
  staff_multiplier: number;
  additional_shifts: string[];
  overtime_allowance: number;
  special_rates: { [key: string]: number };
}

interface ShiftAdjustment {
  code: string;
  name: string;
  extended_hours: number;
  additional_staff: number;
  special_rate_multiplier: number;
}

interface SeasonalAdjustment {
  id?: number;
  placement_code: string;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  department_adjustments: DepartmentAdjustment[];
  shift_adjustments: ShiftAdjustment[];
  staff_multiplier: number;
  is_active: boolean;
  remark: string;
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
export default class Seasonal extends Vue {
  // Data
  public rowData: SeasonalAdjustment[] = [];
  public deleteParam: any;

  // Options
  public shiftOptions: any[] = [];
  public departmentOptions: any[] = [];
  public seasonOptions: any[] = [];

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
        cellRenderer: (params: any) => {
          const colorMap = {
            HIGH_SEASON: "bg-danger",
            LOW_SEASON: "bg-info",
            PEAK_SEASON: "bg-warning",
            NORMAL_SEASON: "bg-success",
            SPECIAL_EVENT: "bg-purple",
          };

          return `<span class="badge ${
            colorMap[params.value as keyof typeof colorMap] || "bg-secondary"
          }">${params.value}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.description"),
        field: "description",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.type"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "type",
        width: 120,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const type = params.value;
          const colorMap = {
            ROTATION: "bg-primary",
            FIXED: "bg-success",
            FLEXIBLE: "bg-warning",
            SEASONAL: "bg-info",
          };
          return `<span class="badge ${
            colorMap[type as keyof typeof colorMap]
          }">${type}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.startDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "start_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.endDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "end_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.staffMultiplier"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "staff_multiplier",
        width: 120,
        enableRowGroup: false,
        cellRenderer: (params: any) => {
          const value = params.value;
          const colorClass =
            value > 1
              ? "text-success"
              : value < 1
              ? "text-danger"
              : "text-muted";
          return `<span class="${colorClass}"><strong>${value}x</strong></span>`;
        },
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.departments"),
        field: "department_adjustments",
        width: 150,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const depts = params.value || [];
          return `<span class="badge bg-info">${depts.length} departments</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.shiftAffected"),
        field: "shift_adjustments",
        width: 150,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const shifts = params.value || [];
          return `<span class="badge bg-warning">${shifts.length} shifts</span>`;
        },
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
    this.dialogMessage = this.$t("messages.attendance.deleteSeasonal");
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
        getToastError(this.$t("messages.attendance.error.notFoundSeasonal"));
      }
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.rowData = [
      {
        id: 1,
        placement_code: "AMORA_UBUD",
        code: "HIGH_SEASON",
        name: "High Season",
        start_date: "2025-07-01",
        end_date: "2025-08-31",
        staff_multiplier: 1.3,
        is_active: true,
        remark: "High season: Need more staff for increased occupancy",
        department_adjustments: [
          {
            code: "FRONT_OFFICE",
            name: "Front Office",
            staff_multiplier: 1.5,
            additional_shifts: ["FO-E2"],
            overtime_allowance: 1.5,
            special_rates: { weekend: 2.0 },
          },
          {
            code: "HOUSEKEEPING",
            name: "Housekeeping",
            staff_multiplier: 1.4,
            additional_shifts: ["HK-E"],
            overtime_allowance: 1.3,
            special_rates: { weekend: 1.8 },
          },
        ],
        shift_adjustments: [
          {
            code: "FO-M",
            name: "Front Office Morning",
            extended_hours: 1,
            additional_staff: 2,
            special_rate_multiplier: 1.2,
          },
        ],
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
      {
        id: 2,
        placement_code: "AMORA_UBUD",
        code: "LOW_SEASON",
        name: "Low Season",
        start_date: "2025-01-15",
        end_date: "2025-03-15",
        staff_multiplier: 0.8,
        is_active: true,
        remark: "Low season: Reduced staff needed",
        department_adjustments: [],
        shift_adjustments: [],
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
      this.seasonOptions = [
        { code: "HIGH_SEASON", name: "High Season" },
        { code: "LOW_SEASON", name: "Low Season" },
        { code: "PEAK_SEASON", name: "Peak Season" },
        { code: "NORMAL_SEASON", name: "Normal Season" },
        { code: "SPECIAL_EVENT", name: "Special Event" },
      ];

      this.shiftOptions = [
        {
          code: "FO-M",
          name: "Front Office Morning (07:00-15:00)",
          department: "FRONT_OFFICE",
        },
        {
          code: "FO-E",
          name: "Front Office Evening (15:00-23:00)",
          department: "FRONT_OFFICE",
        },
        {
          code: "FO-N",
          name: "Front Office Night (23:00-07:00)",
          department: "FRONT_OFFICE",
        },
        {
          code: "HK-M",
          name: "Housekeeping Morning (08:00-16:00)",
          department: "HOUSEKEEPING",
        },
        {
          code: "HK-E",
          name: "Housekeeping Evening (14:00-22:00)",
          department: "HOUSEKEEPING",
        },
        {
          code: "FB-B",
          name: "F&B Breakfast (05:00-13:00)",
          department: "RESTAURANT",
        },
        {
          code: "FB-L",
          name: "F&B Lunch (10:00-18:00)",
          department: "RESTAURANT",
        },
        {
          code: "FB-D",
          name: "F&B Dinner (16:00-00:00)",
          department: "RESTAURANT",
        },
        {
          code: "SEC-D",
          name: "Security Day (06:00-18:00)",
          department: "SECURITY",
        },
        {
          code: "SEC-N",
          name: "Security Night (18:00-06:00)",
          department: "SECURITY",
        },
        { code: "OFF", name: "Day Off", department: "ALL" },
      ];

      this.departmentOptions = [
        { code: "FRONT_OFFICE", name: "Front Office" },
        { code: "HOUSEKEEPING", name: "Housekeeping" },
        { code: "RESTAURANT", name: "Restaurant" },
        { code: "SECURITY", name: "Security" },
        { code: "ENGINEERING", name: "Engineering" },
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
        start_date: formData.start_date,
        end_date: formData.end_date,
        department_adjustments: formData.department_adjustments,
        shift_adjustments: formData.shift_adjustments,
        staff_multiplier: formData.staff_multiplier,
        is_active: formData.is_active,
        remark: formData.remark,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowData.push(newData);

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.saveSeasonal"));
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
          start_date: formData.start_date,
          end_date: formData.end_date,
          department_adjustments: formData.department_adjustments,
          shift_adjustments: formData.shift_adjustments,
          staff_multiplier: formData.staff_multiplier,
          is_active: formData.is_active,
          remark: formData.remark,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.updateSeasonal"));
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
      getToastSuccess(this.$t("messages.attendance.success.deleteSeasonal"));
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
      start_date: params.start_date,
      end_date: params.end_date,
      department_adjustments: params.department_adjustments,
      shift_adjustments: params.shift_adjustments,
      staff_multiplier: params.staff_multiplier,
      is_active: params.is_active,
      remark: params.remark,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      placement_code: params.placement_code,
      code: params.code,
      name: params.name,
      start_date: params.start_date,
      end_date: params.end_date,
      department_adjustments: params.department_adjustments,
      shift_adjustments: params.shift_adjustments,
      staff_multiplier: params.staff_multiplier,
      is_active: params.is_active,
      remark: params.remark,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
