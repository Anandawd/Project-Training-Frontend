import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import HolidayCalenderAPI from "@/services/api/payroll/holiday-calender/holiday-calender";
import { formatDate2, formatDateTime2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./holiday-calender-input-form/holiday-calender-input-form.vue";

interface Holiday {
  id: string | number;
  code: string;
  name: string;
  type: string;
  date: string | Date;
  remark: string;
  status: string;
  is_recuring: boolean;
}

const holidayCalenderAPI = new HolidayCalenderAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class HolidayCalender extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;

  // ui state
  public isSaving: boolean = false;
  public isLoading: boolean = false;

  // options data
  public holidayTypeOptions: any = [];

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
  mounted(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.name"), value: 0 },
      { text: this.$t("commons.filter.payroll.attendance.type"), value: 1 },
      { text: this.$t("commons.filter.remark"), value: 3 },
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
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.date"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "date",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate2,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.name"),
        field: "name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.type"),
        field: "type_name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_recurring",
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
        valueFormatter: formatDateTime2,
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
        valueFormatter: formatDateTime2,
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
        name: this.$t("commons.contextMenu.insert"),
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
        this.loadEditData(params);
      }
    });
    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t("messages.attendance.confirm.deleteHoliday");
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleToHolidayType() {
    this.$router.push({
      name: "HolidayType",
    });
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
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
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await holidayCalenderAPI.GetHolidayCalenderList(params);
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }

      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      const { data } = await holidayCalenderAPI.GetHolidayCalender(params.id);
      this.$nextTick(() => {
        this.inputFormElement.form = this.populateForm(data[0]);
      });
    } catch (error) {
      getError(error);
    }
  }

  loadMockData() {
    this.rowData = [
      {
        id: 1,
        code: "HOLIDAY1",
        name: "New Year's Day",
        type_code: "National",
        type_name: "National",
        date: "01/01/2025",
        remark: "",
        is_recuring: true,
        status: true,
      },
      {
        id: 2,
        code: "HOLIDAY2",
        name: "Chinese New Year",
        type_code: "National",
        type_name: "National",
        date: "21/01/2025",
        remark: "",
        is_recuring: true,
        status: true,
      },
      {
        id: 3,
        code: "HOLIDAY3",
        name: "Nyepi",
        type_code: "National",
        type_name: "National",
        date: "19/02/2025",
        remark: "",
        is_recuring: true,
        status: true,
      },
      {
        id: 4,
        code: "HOLIDAY4",
        name: "Good Friday",
        type_code: "National",
        type_name: "National",
        date: "29/03/2025",
        remark: "",
        is_recuring: true,
        status: false,
      },
      {
        id: 5,
        code: "HOLIDAY5",
        name: "Easter",
        type_code: "Company",
        type_name: "Company",
        date: "30/03/2025",
        remark: "",
        is_recuring: true,
        status: false,
      },
    ];

    // this.holidayTypeOptions = [
    //   {
    //     SubGroupName: "Type",
    //     code: "HT01",
    //     name: "National",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT02",
    //     name: "Regional",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT03",
    //     name: "Religious",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT04",
    //     name: "Company",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT05",
    //     name: "Collective Leave",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT06",
    //     name: "Local",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT07",
    //     name: "Observance",
    //   },
    //   {
    //     SubGroupName: "Type",
    //     code: "HT08",
    //     name: "Optional",
    //   },
    // ];
  }

  async loadDropdown() {
    try {
      const promises = [
        holidayCalenderAPI.GetHolidayTypeList({}).then((response) => {
          this.holidayTypeOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      this.isSaving = true;

      const { status2 } = await holidayCalenderAPI.InsertHolidayCalender(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.attendance.success.saveHoliday"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } = await holidayCalenderAPI.UpdateHolidayCalender(
        formData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.attendance.success.updateHoliday"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteData() {
    try {
      this.isSaving = true;
      const { status2 } = await holidayCalenderAPI.DeleteHolidayCalender(
        this.deleteParam
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.attendance.success.deleteHoliday"));
        this.showDialog = false;
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }
  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      code: params.code,
      name: params.name,
      date: params.date,
      type_code: params.type_code,
      status: parseInt(params.status),
      remark: params.remark,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      code: params.code,
      name: params.name,
      date: params.date,
      type_code: params.type_code,
      status: params.status,
      remark: params.remark,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
