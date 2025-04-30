import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
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
  //table
  public rowData: Holiday[] = [];

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // form
  public showForm: boolean = false;
  public showDetail: boolean = false;
  public modeData: any;
  public modePayroll: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public formType: any;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string;
  public deleteParam: any;

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

  async loadMockData() {
    this.rowData = [
      {
        id: 1,
        code: "HOLIDAY1",
        name: "New Year's Day",
        type: "National",
        date: "01/01/2025",
        remark: "",
        is_recuring: true,
        status: "Active",
      },
      {
        id: 2,
        code: "HOLIDAY2",
        name: "Chinese New Year",
        type: "National",
        date: "21/01/2025",
        remark: "",
        is_recuring: true,
        status: "Active",
      },
      {
        id: 3,
        code: "HOLIDAY3",
        name: "Nyepi",
        type: "National",
        date: "19/02/2025",
        remark: "",
        is_recuring: true,
        status: "Active",
      },
      {
        id: 4,
        code: "HOLIDAY4",
        name: "Good Friday",
        type: "National",
        date: "29/03/2025",
        remark: "",
        is_recuring: true,
        status: "Active",
      },
      {
        id: 5,
        code: "HOLIDAY5",
        name: "Easter",
        type: "Company",
        date: "30/03/2025",
        remark: "",
        is_recuring: true,
        status: "Active",
      },
    ];
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

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
  }

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

  created(): void {
    this.loadMockData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.all"), value: 0 },
      { text: this.$t("commons.filter.payroll.attendace.type"), value: 0 },
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
        headerName: this.$t("commons.table.payroll.attendance.date"),
        headerClass: "align-header-center",
        field: "date",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.name"),
        headerClass: "align-header-center",
        field: "name",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.type"),
        headerClass: "align-header-center",
        field: "type",
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
}
