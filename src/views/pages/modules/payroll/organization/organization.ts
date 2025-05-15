import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { generateIconContextMenuAgGrid } from "@/utils/general";
import $global from "@/utils/global";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import DepartmentInputForm from "./department-input-form/department-input-form.vue";
import PlacementInputForm from "./placement-input-form/placement-input-form.vue";
import PositionInputForm from "./position-input-form/position-input-form.vue";

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    PositionInputForm,
    DepartmentInputForm,
    PlacementInputForm,
  },
})
export default class Employee extends Vue {
  // data
  public rowDepartmentData: any = [];
  public rowPositionData: any = [];
  public rowPlacementData: any = [];
  public deleteParam: any;

  // form
  public showForm: boolean = false;
  public modeData: any;
  public form: any = {};
  // public inputFormElement: any = ref();
  // public activeTab: string = "";
  public currentFormType: string = "";

  public departmentFormElement: any = ref();
  public positionFormElement: any = ref();
  public placementFormElement: any = ref();

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

  departmentTabGridApi: any;
  positionTabGridApi: any;
  placementTabGridApi: any;

  // RECYCLE LIFE FUNCTION =======================================================
  created(): void {
    this.loadMockData();
  }

  beforeMount(): void {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
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
        field: "position_code",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.positionName"),
        field: "position_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        field: "position_description",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.level"),
        field: "position_level",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "position_department",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "position_placement",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "position_status",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "position_updated_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "position_updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "position_created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "position_created_by",
        width: 120,
        enableRowGroup: true,
      },
    ];
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
        field: "department_code",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.departmentName"),
        field: "department_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.description"),
        field: "department_description",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "department_placement",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.manager"),
        field: "department_manager",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.supervisor"),
        field: "department_supervisor",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "department_status",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "department_updated_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "department_updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "department_created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "department_created_by",
        width: 120,
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
        field: "placement_code",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placementName"),
        field: "placement_name",
        width: 200,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.country"),
        field: "placement_country",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.city"),
        field: "placement_city",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.address"),
        field: "placement_address",
        width: 300,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "placement_status",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "placement_updated_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "placement_updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "placement_created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "placement_created_by",
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

  onGridReady(params: any, gridId?: string) {
    const id = gridId || params.api.gridOptionsWrapper.gridOptions.id;
    switch (id) {
      case "department-tab-grid":
        this.departmentTabGridApi;
        break;
      case "position-tab-grid":
        this.positionTabGridApi;
        break;
      case "placement-tab-grid":
        this.placementTabGridApi;
        break;
    }
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

  handleShowForm(params: any, mode: any) {
    console.info("handleShowForm clicked", params);
    this.modeData = mode;

    if (typeof params === "string") {
      this.currentFormType = params;
      console.info("if string", this.currentFormType);
    } else {
      this.currentFormType = this.getCurrentFormType(params);
      console.info("else", this.currentFormType);
    }

    this.showForm = true;
    console.info("showForm", this.showForm);

    this.$nextTick(() => {
      const formElement = this.getFormElementByType(this.currentFormType);
      console.info("formElement", formElement);
      if (formElement && typeof formElement.initialize === "function") {
        formElement.initialize();

        if (mode === $global.modeData.edit) {
          this.populateForm(params);
        }
      }
    });
  }

  handleSave(formData: any) {
    if (this.modeData === $global.modeData.insert) {
      this.insertData(formData);
    } else {
      this.updateData(formData);
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteParam = params.id;
  }

  refreshData(search: any) {
    this.loadDataGrid();
  }

  // API REQUEST =======================================================
  async loadData() {}

  async loadDataGrid() {}

  async loadEditData(params: any, type: any) {}

  async loadMockData() {
    this.rowDepartmentData = [
      {
        department_code: "D001",
        department_name: "Marketing",
        department_description: "-",
        department_manager: "Satria Data",
        department_supervisor: "Budi Santoso",
      },
    ];
    this.rowPositionData = [
      {
        position_code: "P001",
        position_name: "Staff",
        position_description: "-",
        position_level: "1",
      },
    ];
    this.rowPlacementData = [
      {
        placement_code: "P001",
        placement_name: "Amora Ubud",
        placement_address: "Jl. Ubud, Desa Ubud, Ubud, Gianyar, Bali",
      },
      {
        placement_code: "P001",
        placement_name: "Amora Canggu",
        placement_address:
          "Jl. Canggu, Desa Canggu, Kuta Selatan, Badung, Bali",
      },
    ];
  }

  async insertData(formData: any) {
    if (formData.position_code) {
      // await this.insertPosition(formData);
    } else if (formData.department_code) {
      // await this.insertDepartment(formData);
    } else if (formData.placement_code) {
      // await this.insertPlacement(formData);
    }

    this.showForm = false;
    this.loadDataGrid();
  }

  async updateData(formData: any) {
    if (formData.position_code) {
      // await this.insertPosition(formData);
    } else if (formData.department_code) {
      // await this.insertDepartment(formData);
    } else if (formData.placement_code) {
      // await this.insertPlacement(formData);
    }

    this.showForm = false;
    this.loadDataGrid();
  }

  async deleteData() {
    this.showDialog = false;
  }

  // HELPER FUNCTION =======================================================
  populateForm(params: any) {
    if (!params) {
      console.info("Invalid data for form population:", params);
      return;
    }

    const formType = this.getCurrentFormType(params);
    const formElement = this.getFormElementByType(formType);

    if (!formElement) {
      console.info(`Form element for ${formType} not found during population`);
      return;
    }

    this.$nextTick(() => {
      switch (formType) {
        case "position":
          formElement.form = {
            positionCode: params.position_code || "",
            positionName: params.position_name || "",
            positionDescription: params.position_description || "",
            positionLevel: params.position_level || "",
            positionDepartment: params.position_department || "",
            positionPlacement: params.position_placement || "",
            positionStatus: params.position_status ? "A" : "I",
            id: params.id,
          };
          break;
        case "department":
          formElement.form = {
            departmentCode: params.department_code || "",
            departmentName: params.department_name || "",
            departmentDescription: params.department_description || "",
            departmentPlacement: params.department_placement || "",
            departmentManager: params.department_manager || "",
            departmentSupervisor: params.department_supervisor || "",
            departmentStatus: params.department_status ? "A" : "I",
            id: params.id,
          };
          break;
        case "placement":
          formElement.form = {
            placementCode: params.placement_code || "",
            placementName: params.placement_name || "",
            placementCountry: params.placement_country || "",
            placementCity: params.placement_city || "",
            placementAddress: params.placement_address || "",
            placementStatus: params.placement_status ? "A" : "I",
            id: params.id,
          };
          break;
      }

      if (formElement.form) {
        formElement.form.id = params.id;
      }
    });
  }

  getCurrentFormType(params: any): string {
    if (params.position_code !== undefined) return "position";
    if (params.department_code !== undefined) return "department";
    if (params.placement_code !== undefined) return "placement";
    return this.currentFormType;
  }

  getFormElementByType(type: string): any {
    console.info("getFormElementByType called");
    switch (type) {
      case "position":
        return this.$refs.positionFormElement;
      case "department":
        return this.$refs.departmentFormElement;
      case "placement":
        return this.$refs.placementFormElement;
      default:
        console.info(`Unknown form type: ${type}`);
        return null;
    }
  }
  // GETTER AND SETTER =======================================================
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
