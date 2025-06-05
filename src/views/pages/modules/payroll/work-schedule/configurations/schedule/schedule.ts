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
import CInputForm from "./schedule-input-form/schedule-input-form.vue";

interface ScheduleTemplateDetail {
  day_order: number;
  shift_code: string;
  shift_name: string;
  is_working_day: boolean;
  working_hours: number;
  remark?: string;
}

interface ScheduleTemplate {
  id?: number;
  code: string;
  name: string;
  description: string;
  type: "ROTATION" | "FIXED" | "FLEXIBLE" | "SEASONAL";
  rotation_pattern?: any;
  rotation_cycle_days?: number;
  is_default: boolean;
  is_active: boolean;
  details: ScheduleTemplateDetail[];
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
export default class Schedule extends Vue {
  // Data
  public rowData: ScheduleTemplate[] = [];
  public deleteParam: any;

  // Options
  public shiftOptions: any[] = [];
  public departmentOptions: any[] = [];
  public typeOptions: any[] = [];

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
        headerName: this.$t("commons.table.payroll.attendance.cycleDays"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "rotation_cycle_days",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.default"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_default",
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
    this.dialogMessage = this.$t("messages.attendance.deleteScheduleTemplate");
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
        code: "FO-ROT-7D",
        name: "Front Office 7-Day Rotation",
        description:
          "7-day rotation for front office with morning, evening, night shifts",
        type: "ROTATION",
        rotation_cycle_days: 7,
        is_default: true,
        is_active: true,
        details: [
          {
            day_order: 1,
            shift_code: "FO-M",
            shift_name: "FO Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 2,
            shift_code: "FO-M",
            shift_name: "FO Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 3,
            shift_code: "FO-E",
            shift_name: "FO Evening",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 4,
            shift_code: "FO-E",
            shift_name: "FO Evening",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 5,
            shift_code: "FO-N",
            shift_name: "FO Night",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 6,
            shift_code: "OFF",
            shift_name: "Day Off",
            is_working_day: false,
            working_hours: 0,
          },
          {
            day_order: 7,
            shift_code: "OFF",
            shift_name: "Day Off",
            is_working_day: false,
            working_hours: 0,
          },
        ],
        created_at: "2025-01-01",
        created_by: "Admin",
        updated_at: "2025-01-01",
        updated_by: "Admin",
      },
      {
        id: 2,
        code: "HK-FIX",
        name: "Housekeeping Fixed",
        description: "Fixed morning schedule for housekeeping",
        type: "FIXED",
        rotation_cycle_days: 7,
        is_default: false,
        is_active: true,
        details: [
          {
            day_order: 1,
            shift_code: "HK-M",
            shift_name: "HK Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 2,
            shift_code: "HK-M",
            shift_name: "HK Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 3,
            shift_code: "HK-M",
            shift_name: "HK Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 4,
            shift_code: "HK-M",
            shift_name: "HK Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 5,
            shift_code: "HK-M",
            shift_name: "HK Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 6,
            shift_code: "HK-M",
            shift_name: "HK Morning",
            is_working_day: true,
            working_hours: 8,
          },
          {
            day_order: 7,
            shift_code: "OFF",
            shift_name: "Day Off",
            is_working_day: false,
            working_hours: 0,
          },
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
      this.typeOptions = [
        { code: "ROTATION", name: "Rotation Schedule" },
        { code: "FIXED", name: "Fixed Schedule" },
        { code: "FLEXIBLE", name: "Flexible Schedule" },
        { code: "SEASONAL", name: "Seasonal Schedule" },
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
        code: formData.code,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        rotation_pattern: formData.rotation_pattern,
        rotation_cycle_days: formData.rotation_cycle_days,
        is_default: formData.is_default,
        is_active: formData.is_active,
        details: formData.details,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowData.push(newData);

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(
        this.$t("messages.attendance.success.saveScheduleTemplate")
      );
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
          description: formData.description,
          type: formData.type,
          rotation_pattern: formData.rotation_pattern,
          rotation_cycle_days: formData.rotation_cycle_days,
          is_default: formData.is_default,
          is_active: formData.is_active,
          details: formData.details,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      this.searchDefault.filter = [1];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(
        this.$t("messages.attendance.success.updateScheduleTemplate")
      );
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

      this.searchDefault.filter = [1];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(
        this.$t("messages.attendance.success.deleteScheduleTemplate")
      );
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
      adjustment_reason_code: params.adjustment_reason_code,
      adjustment_reason_name: params.adjustment_reason_name,
      effective_date: params.effective_date,
      current_salary: parseFloat(params.current_salary),
      new_salary: parseFloat(params.new_salary),
      difference_amount: params.difference_amount,
      percentage_change: params.percentage_change,
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
      adjustment_reason_code: params.adjustment_reason_code,
      adjustment_reason_name: params.adjustment_reason_name,
      effective_date: params.effective_date,
      current_salary: params.current_salary,
      new_salary: params.new_salary,
      remark: params.remark,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
