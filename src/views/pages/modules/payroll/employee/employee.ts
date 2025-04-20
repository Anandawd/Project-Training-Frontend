import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
} from "@/utils/general";
import $global from "@/utils/global";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./employee-input-form/employee-input-form.vue";

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
      employee_id: "EMP001",
      employee_name: "Andi Pratama",
      department: "IT",
      position: "Frontend Developer",
      placement: "Jakarta",
      supervisor: "Budi Santoso",
      employee_type: "Full-Time",
    },
    {
      employee_id: "EMP002",
      employee_name: "Rina Kusuma",
      department: "Finance",
      position: "Accountant",
      placement: "Bandung",
      supervisor: "Sari Dewi",
      employee_type: "Contract",
    },
    {
      employee_id: "EMP003",
      employee_name: "Dewi Lestari",
      department: "HR",
      position: "HR Officer",
      placement: "Jakarta",
      supervisor: "Tono Rahmat",
      employee_type: "Full-Time",
    },
    {
      employee_id: "EMP004",
      employee_name: "Yoga Saputra",
      department: "IT",
      position: "Backend Developer",
      placement: "Surabaya",
      supervisor: "Budi Santoso",
      employee_type: "Part-Time",
    },
    {
      employee_id: "EMP005",
      employee_name: "Fajar Nugroho",
      department: "Marketing",
      position: "Marketing Specialist",
      placement: "Jakarta",
      supervisor: "Rina Kusuma",
      employee_type: "Full-Time",
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
  public modeData: any;
  public form: any = {};
  public inputFormElement: any = ref();
  public formType: any;

  // dialog
  public showDialog: boolean = false;

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
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
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

  handleShowForm(params: any, mode: any) {
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  // API FUNCTION

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.department"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.supervisor"), value: 3 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
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
        headerName: this.$t("commons.table.payroll.employee.employeeId"),
        headerClass: "align-header-center",
        field: "employee_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeName"),
        headerClass: "align-header-center",
        field: "employee_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        headerClass: "align-header-center",
        field: "department",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        headerClass: "align-header-center",
        field: "position",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        headerClass: "align-header-center",
        field: "placement",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.supervisor"),
        headerClass: "align-header-center",
        field: "supervisor",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeType"),
        headerClass: "align-header-center",
        field: "employee_type",
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
}
