import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { generateIconContextMenuAgGrid } from "@/utils/general";
import $global from "@/utils/global";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./organization-input-form/organization-input-form.vue";

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
  public rowDepartmentData: any = [
    {
      department_code: "D001",
      department_name: "Marketing",
      department_description: "-",
      department_manager: "Satria Data",
      department_supervisor: "Budi Santoso",
    },
  ];
  public rowPositionData: any = [
    {
      position_code: "P001",
      position_name: "Staff",
      position_description: "-",
      position_level: "1",
    },
  ];
  public rowPlacementData: any = [
    {
      placement_code: "P001",
      placement_name: "Amora Ubud",
      placement_address: "Jl. Ubud, Desa Ubud, Ubud, Gianyar, Bali",
    },
    {
      placement_code: "P001",
      placement_name: "Amora Canggu",
      placement_address: "Jl. Canggu, Desa Canggu, Kuta Selatan, Badung, Bali",
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
  public deleteParam: any;

  // dialog
  public showDialog: boolean = false;

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDepartmentDefs: any;
  columnPositionDefs: any;
  columnPlacementDefs: any;
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
  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
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
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };

    this.columnDepartmentDefs = [
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
        headerClass: "align-header-center",
        field: "department_code",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.departmentName"),
        headerClass: "align-header-center",
        field: "department_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        headerClass: "align-header-center",
        field: "department_description",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.manager"),
        headerClass: "align-header-center",
        field: "department_manager",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.supervisor"),
        headerClass: "align-header-center",
        field: "department_supervisor",
        width: 100,
        enableRowGroup: true,
      },
    ];
    this.columnPositionDefs = [
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
        headerClass: "align-header-center",
        field: "position_code",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.positionName"),
        headerClass: "align-header-center",
        field: "position_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        headerClass: "align-header-center",
        field: "position_description",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.level"),
        headerClass: "align-header-center",
        field: "position_level",
        width: 100,
        enableRowGroup: true,
      },
    ];
    this.columnPlacementDefs = [
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
        headerClass: "align-header-center",
        field: "placement_code",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placementName"),
        headerClass: "align-header-center",
        field: "placement_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.address"),
        headerClass: "align-header-center",
        field: "placement_address",
        width: 300,
        enableRowGroup: true,
      },
    ];

    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
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
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
