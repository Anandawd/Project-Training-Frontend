import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatDateTimeUTC } from "@/utils/format";
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
  created(): void {
    this.loadData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.name"), value: 0 },
      { text: this.$t("commons.filter.payroll.attendace.type"), value: 1 },
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
        field: "date",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.name"),
        field: "name",
        width: 150,
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
        field: "status",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
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
    this.dialogMessage = this.$t("messages.attendance.confirm.deleteHoliday");
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
              return item.name.toLowerCase().includes(searchText);
            case 1:
              return item.type.toLowerCase().includes(searchText);
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
                return item.status === true;
              case 2:
                return item.status === false;
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
        const { data } = await salaryAdjustmentAPI.GetSalaryAdjustment(id);
        this.populateForm(data);
        */

      const data = this.rowData.find((data: any) => data.id === id);

      if (data) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(data);
        });
      } else {
        getToastError(this.$t("messages.attendace.error.notHolidayFound"));
      }
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

      this.holidayTypeOptions = [
        {
          SubGroupName: "Type",
          code: "HT01",
          name: "National",
        },
        {
          SubGroupName: "Type",
          code: "HT02",
          name: "Regional",
        },
        {
          SubGroupName: "Type",
          code: "HT03",
          name: "Religious",
        },
        {
          SubGroupName: "Type",
          code: "HT04",
          name: "Company",
        },
        {
          SubGroupName: "Type",
          code: "HT05",
          name: "Collective Leave",
        },
        {
          SubGroupName: "Type",
          code: "HT06",
          name: "Local",
        },
        {
          SubGroupName: "Type",
          code: "HT07",
          name: "Observance",
        },
        {
          SubGroupName: "Type",
          code: "HT08",
          name: "Optional",
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

      const newId = Math.max(...this.rowData.map((data: any) => data.id)) + 1;

      const newHoliday = {
        id: newId,
        code: formData.code,
        name: formData.name,
        date: formData.date,
        type_code: formData.type_code,
        type_name: formData.type_name,
        status: formData.status === "A",
        remark: formData.remark,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowData.push(newHoliday);

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.saveHoliday"));
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

      const index = this.rowData.findIndex(
        (data: any) => data.id === formData.id
      );

      if (index !== -1) {
        this.rowData[index] = {
          ...this.rowData[index],
          code: formData.code,
          name: formData.name,
          date: formData.date,
          type_code: formData.type_code,
          type_name: formData.type_name,
          status: formData.status === "A",
          remark: formData.remark,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.attendance.success.updateHoliday"));
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
      getToastSuccess(this.$t("messages.attendance.success.deleteHoliday"));
    } catch (error) {
      getError(error);
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
      type_name: params.type_name,
      status: params.status,
      remark: params.remark,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      code: params.code,
      name: params.name,
      date: params.date,
      type_code: params.type_code,
      type_name: params.type_name,
      status: params.status ? "A" : "I",
      remark: params.remark,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
