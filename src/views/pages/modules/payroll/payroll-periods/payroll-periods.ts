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
import CInputForm from "./payroll-period-input-form/payroll-period-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class Employee extends Vue {
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

  // dialog
  public showDialog: boolean = false;
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

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
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
}
