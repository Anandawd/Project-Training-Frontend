import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { GridApi } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EarningsInputForm from "../payroll-component/earnings-component-input-form/earnings-component-input-form.vue";
import DepartmentInputForm from "./department-input-form/department-input-form.vue";
import PlacementInputForm from "./placement-input-form/placement-input-form.vue";
import PositionInputForm from "./position-input-form/position-input-form.vue";

const organizationAPI = new OrganizationAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CDialog,
    PositionInputForm,
    DepartmentInputForm,
    PlacementInputForm,
    EarningsInputForm,
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
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  // public inputFormElement: any = ref();
  public currentFormType: string = "";

  public departmentFormElement: any = ref();
  public positionFormElement: any = ref();
  public placementFormElement: any = ref();

  public positionLevelOptions: any[];
  public departmentOptions: any[];
  public placementOptions: any[];
  public managerOptions: any[];
  public supervisorOptions: any[];
  public countryOptions: any[];
  public cityOptions: any = ref([]);

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
  created() {
    this.loadDropdown();
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
        headerClass: "align-header-center",
        cellClass: "text-center",
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "position_created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "department_updated_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "department_updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "department_created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "placement_updated_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "placement_updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "placement_created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
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
      case "position-tab-grid":
        this.positionTabGridApi = params.api;
        break;
      case "department-tab-grid":
        this.departmentTabGridApi = params.api;
        break;
      case "placement-tab-grid":
        this.placementTabGridApi = params.api;
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

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    console.log("modeData", this.modeData);
    console.log("mode", mode);
    if (typeof params === "string") {
      this.currentFormType = params;
    } else {
      this.currentFormType = this.getCurrentFormType(params);
    }

    this.showForm = true;

    this.$nextTick(() => {
      const formElement = this.getFormElementByType(this.currentFormType);
      if (formElement && typeof formElement.initialize === "function") {
        formElement.initialize();

        if (mode === $global.modeData.edit && typeof params !== "string") {
          this.populateForm(params);
        }
      }
    });
  }

  handleSave(formData: any) {
    // if(!this.validateFormData(formData)){
    //   return
    // }
    const formType = this.getCurrentFormType(formData);
    const formattedData = this.formatFormData(formData, formType);
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
    const formType = this.getCurrentFormType(formData);
    this.currentFormType = formType;
    this.handleShowForm(formData, $global.modeData.edit);
    // this.loadEditData(formData, formType);
  }

  handleDelete(params: any) {
    // this.showDialog = true;
    this.deleteParam = params;
    this.deleteData();
  }

  refreshData(search: any) {
    this.loadDataGrid();
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      await Promise.all([
        this.loadPositionData(),
        this.loadDepartmentData(),
        this.loadPlacementData(),
      ]);
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(formType: any = this.currentFormType) {
    let gridApi: GridApi;
    switch (formType) {
      case "position":
        gridApi = this.positionTabGridApi;
        break;
      case "department":
        gridApi = this.departmentTabGridApi;
        break;
      case "placement":
        gridApi = this.placementTabGridApi;
        break;
    }

    if (gridApi) {
      let rowData;
      switch (formType) {
        case "position":
          rowData = [...this.rowPositionData];
          break;
        case "department":
          rowData = [...this.rowDepartmentData];
          break;
        case "placement":
          rowData = [...this.rowPlacementData];
          break;
      }

      gridApi.setRowData(rowData);

      // setTimeout(() => {
      //   gridApi.refreshCells({ force: true });
      // }, 100);
    }
  }

  async loadEditData(params: any, type: any) {
    try {
      this.showForm = true;
      await this.$nextTick();

      // for real implementation
      // if (type === "position") {
      //   const { data } = await organizationAPI.GetPosition(params.id);
      //   await this.$nextTick();
      //   this.populateForm(data);
      // } else if (type === "department") {
      //   const { data } = await organizationAPI.GetDepartment(params.id);
      //   await this.$nextTick();
      //   this.populateForm(data);
      // } else if (type === "placement") {
      //   const { data } = await organizationAPI.GetPlacement(params.id);
      //   await this.$nextTick();
      //   this.populateForm(data);
      // }

      // for demo
      const formElement = this.getFormElementByType(type);
      if (!formElement) {
        console.error(`Form element for ${type} not found`);
        return;
      }

      this.populateForm(params);
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowDepartmentData = [
      {
        id: 1,
        department_code: "D001",
        department_name: "Executive",
        department_description: "Executive leadership team",
        department_placement: "Amora Ubud",
        department_manager: "John Smith",
        department_supervisor: "Jane Doe",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 2,
        department_code: "D002",
        department_name: "Human Resources",
        department_description:
          "Employee recruitment, management, and development",
        department_placement: "Amora Ubud",
        department_manager: "Sarah Johnson",
        department_supervisor: "Michael Brown",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 3,
        department_code: "D003",
        department_name: "Finance",
        department_description: "Financial management and accounting",
        department_placement: "Amora Ubud",
        department_manager: "Robert Chen",
        department_supervisor: "Emily Davis",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 4,
        department_code: "D004",
        department_name: "Information Technology",
        department_description: "IT infrastructure and support",
        department_placement: "Amora Ubud",
        department_manager: "David Wilson",
        department_supervisor: "Lisa Anderson",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 5,
        department_code: "D005",
        department_name: "Marketing",
        department_description: "Brand management and promotion",
        department_placement: "Amora Canggu",
        department_manager: "Jennifer Garcia",
        department_supervisor: "Kevin Martinez",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 6,
        department_code: "D006",
        department_name: "Sales",
        department_description: "Sales and business development",
        department_placement: "Amora Canggu",
        department_manager: "Thomas Wright",
        department_supervisor: "Patricia Hall",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 7,
        department_code: "D007",
        department_name: "Operations",
        department_description: "Hotel operations management",
        department_placement: "Amora Canggu",
        department_manager: "Charles Lopez",
        department_supervisor: "Nancy Young",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 8,
        department_code: "D008",
        department_name: "Front Office",
        department_description: "Reception, concierge, and guest services",
        department_placement: "Amora Ubud",
        department_manager: "Daniel Lee",
        department_supervisor: "Susan Clark",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 9,
        department_code: "D009",
        department_name: "Housekeeping",
        department_description: "Room and public area cleaning and maintenance",
        department_placement: "Amora Ubud",
        department_manager: "Jessica Walker",
        department_supervisor: "Brian Turner",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 10,
        department_code: "D010",
        department_name: "Food & Beverage",
        department_description: "Restaurant, bar, and catering operations",
        department_placement: "Amora Canggu",
        department_manager: "Richard Baker",
        department_supervisor: "Elizabeth Scott",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 11,
        department_code: "D011",
        department_name: "Engineering",
        department_description: "Facility maintenance and repairs",
        department_placement: "Amora Ubud",
        department_manager: "Andrew Miller",
        department_supervisor: "Laura Nelson",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 12,
        department_code: "D012",
        department_name: "Security",
        department_description: "Safety and security operations",
        department_placement: "Amora Canggu",
        department_manager: "James Carter",
        department_supervisor: "Maria Gonzalez",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 13,
        department_code: "D013",
        department_name: "Spa & Wellness",
        department_description: "Spa services and wellness programs",
        department_placement: "Amora Ubud",
        department_manager: "Michelle Adams",
        department_supervisor: "Samuel Green",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 14,
        department_code: "D014",
        department_name: "Events & Conferences",
        department_description: "Event planning and execution",
        department_placement: "Amora Canggu",
        department_manager: "Christopher Hill",
        department_supervisor: "Rebecca White",
        department_status: true,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-01-01 08:00:00",
        department_updated_by: "Admin System",
      },
      {
        id: 15,
        department_code: "D015",
        department_name: "Training & Development",
        department_description: "Staff training and career development",
        department_placement: "Amora Ubud",
        department_manager: "Jonathan Evans",
        department_supervisor: "Amanda Parker",
        department_status: false,
        department_created_at: "2023-01-01 08:00:00",
        department_created_by: "Admin System",
        department_updated_at: "2023-03-15 14:30:00",
        department_updated_by: "HR Director",
      },
    ];
    this.rowPositionData = [
      {
        id: 1,
        position_code: "P001",
        position_name: "Chief Executive Officer",
        position_description:
          "Overall company leadership and strategic direction",
        position_level: "1",
        position_department: "Executive",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 2,
        position_code: "P002",
        position_name: "Chief Operating Officer",
        position_description:
          "Oversees daily operations and execution of strategic plans",
        position_level: "1",
        position_department: "Executive",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 3,
        position_code: "P003",
        position_name: "Chief Financial Officer",
        position_description: "Financial planning, management, and reporting",
        position_level: "1",
        position_department: "Finance",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 4,
        position_code: "P004",
        position_name: "HR Director",
        position_description: "Oversees human resources functions and strategy",
        position_level: "2",
        position_department: "Human Resources",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 5,
        position_code: "P005",
        position_name: "IT Director",
        position_description: "Leads IT strategy and operations",
        position_level: "2",
        position_department: "Information Technology",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 6,
        position_code: "P006",
        position_name: "Marketing Director",
        position_description:
          "Responsible for marketing strategies and brand management",
        position_level: "2",
        position_department: "Marketing",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 7,
        position_code: "P007",
        position_name: "Operations Manager",
        position_description: "Manages daily hotel operations and staff",
        position_level: "3",
        position_department: "Operations",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 8,
        position_code: "P008",
        position_name: "Front Office Manager",
        position_description:
          "Supervises reception, concierge, and guest services",
        position_level: "3",
        position_department: "Front Office",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 9,
        position_code: "P009",
        position_name: "Housekeeping Manager",
        position_description:
          "Oversees cleaning and maintenance of rooms and public areas",
        position_level: "3",
        position_department: "Housekeeping",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 10,
        position_code: "P010",
        position_name: "Executive Chef",
        position_description: "Leads culinary team and menu development",
        position_level: "3",
        position_department: "Food & Beverage",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 11,
        position_code: "P011",
        position_name: "HR Manager",
        position_description:
          "Manages recruitment, training, and employee relations",
        position_level: "3",
        position_department: "Human Resources",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 12,
        position_code: "P012",
        position_name: "IT Manager",
        position_description: "Manages IT infrastructure and support",
        position_level: "3",
        position_department: "Information Technology",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 13,
        position_code: "P013",
        position_name: "Accounting Manager",
        position_description:
          "Oversees accounting functions and financial reporting",
        position_level: "3",
        position_department: "Finance",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 14,
        position_code: "P014",
        position_name: "Front Desk Supervisor",
        position_description: "Supervises front desk staff and operations",
        position_level: "4",
        position_department: "Front Office",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 15,
        position_code: "P015",
        position_name: "Restaurant Manager",
        position_description: "Manages restaurant operations and staff",
        position_level: "4",
        position_department: "Food & Beverage",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 16,
        position_code: "P016",
        position_name: "HR Specialist",
        position_description: "Handles recruitment and employee relations",
        position_level: "4",
        position_department: "Human Resources",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 17,
        position_code: "P017",
        position_name: "IT Support Specialist",
        position_description: "Provides technical support and troubleshooting",
        position_level: "4",
        position_department: "Information Technology",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 18,
        position_code: "P018",
        position_name: "Accountant",
        position_description: "Handles financial transactions and reporting",
        position_level: "4",
        position_department: "Finance",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 19,
        position_code: "P019",
        position_name: "Front Desk Agent",
        position_description: "Handles check-in/check-out and guest inquiries",
        position_level: "5",
        position_department: "Front Office",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 20,
        position_code: "P020",
        position_name: "Server",
        position_description: "Provides food and beverage service to guests",
        position_level: "5",
        position_department: "Food & Beverage",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 21,
        position_code: "P021",
        position_name: "Housekeeper",
        position_description: "Cleans and maintains guest rooms",
        position_level: "5",
        position_department: "Housekeeping",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 22,
        position_code: "P022",
        position_name: "Marketing Coordinator",
        position_description: "Implements marketing campaigns and social media",
        position_level: "4",
        position_department: "Marketing",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 23,
        position_code: "P023",
        position_name: "Sales Executive",
        position_description: "Handles client relationships and sales",
        position_level: "4",
        position_department: "Sales",
        position_placement: "Amora Canggu",
        position_status: false,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-05-15 10:30:00",
        position_updated_by: "HR Manager",
      },
      {
        id: 24,
        position_code: "P024",
        position_name: "Security Officer",
        position_description: "Ensures safety and security of premises",
        position_level: "5",
        position_department: "Security",
        position_placement: "Amora Ubud",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
      {
        id: 25,
        position_code: "P025",
        position_name: "Maintenance Technician",
        position_description: "Performs repairs and preventive maintenance",
        position_level: "5",
        position_department: "Engineering",
        position_placement: "Amora Canggu",
        position_status: true,
        position_created_at: "2023-01-01 08:00:00",
        position_created_by: "Admin System",
        position_updated_at: "2023-01-01 08:00:00",
        position_updated_by: "Admin System",
      },
    ];
    this.rowPlacementData = [
      {
        id: 1,
        placement_code: "PL001",
        placement_name: "Amora Ubud",
        placement_country: "Indonesia",
        placement_city: "Bali",
        placement_address: "Jl. Raya Ubud No. 88, Ubud, Gianyar, Bali 80571",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 2,
        placement_code: "PL002",
        placement_name: "Amora Canggu",
        placement_country: "Indonesia",
        placement_city: "Bali",
        placement_address:
          "Jl. Pantai Batu Bolong No. 99, Canggu, Kuta Utara, Badung, Bali 80361",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 3,
        placement_code: "PL003",
        placement_name: "Amora Seminyak",
        placement_country: "Indonesia",
        placement_city: "Bali",
        placement_address:
          "Jl. Kayu Aya No. 123, Seminyak, Kuta, Badung, Bali 80361",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 4,
        placement_code: "PL004",
        placement_name: "Amora Nusa Dua",
        placement_country: "Indonesia",
        placement_city: "Bali",
        placement_address: "Jl. Nusa Dua No. 45, BTDC, Nusa Dua, Bali 80363",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 5,
        placement_code: "PL005",
        placement_name: "Amora Jakarta",
        placement_country: "Indonesia",
        placement_city: "Jakarta",
        placement_address:
          "Jl. Jendral Sudirman Kav. 52-53, Jakarta Selatan 12190",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 6,
        placement_code: "PL006",
        placement_name: "Amora Yogyakarta",
        placement_country: "Indonesia",
        placement_city: "Yogyakarta",
        placement_address: "Jl. Malioboro No. 77, Yogyakarta 55271",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 7,
        placement_code: "PL007",
        placement_name: "Amora Bandung",
        placement_country: "Indonesia",
        placement_city: "Bandung",
        placement_address: "Jl. Asia Afrika No. 100, Bandung 40112",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 8,
        placement_code: "PL008",
        placement_name: "Amora Surabaya",
        placement_country: "Indonesia",
        placement_city: "Surabaya",
        placement_address: "Jl. Embong Malang No. 55, Surabaya 60261",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 9,
        placement_code: "PL009",
        placement_name: "Amora Makassar",
        placement_country: "Indonesia",
        placement_city: "Makassar",
        placement_address: "Jl. Penghibur No. 33, Makassar 90111",
        placement_status: false,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-04-15 09:30:00",
        placement_updated_by: "Operations Director",
      },
      {
        id: 10,
        placement_code: "PL010",
        placement_name: "Amora Singapore",
        placement_country: "Singapore",
        placement_city: "Singapore",
        placement_address: "88 Orchard Road, Singapore 238890",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 11,
        placement_code: "PL011",
        placement_name: "Amora Kuala Lumpur",
        placement_country: "Malaysia",
        placement_city: "Kuala Lumpur",
        placement_address: "123 Jalan Bukit Bintang, Kuala Lumpur 55100",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 12,
        placement_code: "PL012",
        placement_name: "Amora Bangkok",
        placement_country: "Thailand",
        placement_city: "Bangkok",
        placement_address: "789 Sukhumvit Road, Watthana, Bangkok 10110",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 13,
        placement_code: "PL013",
        placement_name: "Amora Phuket",
        placement_country: "Thailand",
        placement_city: "Phuket",
        placement_address: "45 Patong Beach Road, Patong, Phuket 83150",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 14,
        placement_code: "PL014",
        placement_name: "Amora Manila",
        placement_country: "Philippines",
        placement_city: "Manila",
        placement_address: "567 Makati Avenue, Makati City, Manila 1200",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 15,
        placement_code: "PL015",
        placement_name: "Amora Ho Chi Minh",
        placement_country: "Vietnam",
        placement_city: "Ho Chi Minh",
        placement_address:
          "321 Nguyen Hue Boulevard, District 1, Ho Chi Minh City",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 16,
        placement_code: "PL016",
        placement_name: "Amora Hong Kong",
        placement_country: "Hong Kong",
        placement_city: "Hong Kong",
        placement_address: "88 Nathan Road, Tsim Sha Tsui, Kowloon, Hong Kong",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 17,
        placement_code: "PL017",
        placement_name: "Amora Tokyo",
        placement_country: "Japan",
        placement_city: "Tokyo",
        placement_address: "1-1-1 Roppongi, Minato-ku, Tokyo 106-0032",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 18,
        placement_code: "PL018",
        placement_name: "Amora Sydney",
        placement_country: "Australia",
        placement_city: "Sydney",
        placement_address: "123 George Street, Sydney, NSW 2000",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 19,
        placement_code: "PL019",
        placement_name: "Amora Melbourne",
        placement_country: "Australia",
        placement_city: "Melbourne",
        placement_address: "456 Collins Street, Melbourne, VIC 3000",
        placement_status: true,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-01-01 08:00:00",
        placement_updated_by: "Admin System",
      },
      {
        id: 20,
        placement_code: "PL020",
        placement_name: "Amora Auckland",
        placement_country: "New Zealand",
        placement_city: "Auckland",
        placement_address: "789 Queen Street, Auckland 1010",
        placement_status: false,
        placement_created_at: "2023-01-01 08:00:00",
        placement_created_by: "Admin System",
        placement_updated_at: "2023-06-10 11:45:00",
        placement_updated_by: "Regional Manager",
      },
    ];
  }

  async loadDropdown() {
    try {
      // for real implementation
      // const { data: levelData } = await organizationAPI.GetPositionLevelOptions();
      // this.positionLevelOptions = levelData;

      // for demo
      this.positionLevelOptions = [
        { code: "LV1", name: "1", SubGroupName: "Level" },
        { code: "LV2", name: "2", SubGroupName: "Level" },
        { code: "LV3", name: "3", SubGroupName: "Level" },
        { code: "LV4", name: "4", SubGroupName: "Level" },
        { code: "LV5", name: "5", SubGroupName: "Level" },
      ];

      this.departmentOptions = [
        { code: "D001", name: "Executive", SubGroupName: "Department" },
        { code: "D002", name: "Human Resources", SubGroupName: "Department" },
        { code: "D003", name: "Finance", SubGroupName: "Department" },
        // Add more departments as needed
      ];

      this.placementOptions = [
        { code: "PL001", name: "Amora Ubud", SubGroupName: "Placement" },
        { code: "PL002", name: "Amora Canggu", SubGroupName: "Placement" },
        { code: "PL003", name: "Amora Kendari", SubGroupName: "Placement" },
        // Add more placements as needed
      ];

      this.managerOptions = [
        { code: "MGR001", name: "John Smith" },
        { code: "MGR002", name: "Sarah Johnson" },
        { code: "MGR003", name: "Robert Chen" },
        { code: "MGR004", name: "David Wilson" },
        { code: "MGR005", name: "Jennifer Garcia" },
        { code: "MGR006", name: "Thomas Wright" },
        { code: "MGR007", name: "Charles Lopez" },
        { code: "MGR008", name: "Daniel Lee" },
        { code: "MGR009", name: "Jessica Walker" },
        { code: "MGR010", name: "Richard Baker" },
        { code: "MGR011", name: "Andrew Miller" },
        { code: "MGR012", name: "James Carter" },
        { code: "MGR013", name: "Michelle Adams" },
        { code: "MGR014", name: "Christopher Hill" },
        { code: "MGR015", name: "Jonathan Evans" },
        // Add more managers as needed
      ];

      this.supervisorOptions = [
        { code: "SPV001", name: "Jane Doe" },
        { code: "SPV002", name: "Michael Brown" },
        { code: "SPV003", name: "Emily Davis" },
        { code: "SPV004", name: "Lisa Anderson" },
        { code: "SPV005", name: "Kevin Martinez" },
        { code: "SPV006", name: "Patricia Hall" },
        { code: "SPV007", name: "Nancy Young" },
        { code: "SPV008", name: "Susan Clark" },
        { code: "SPV009", name: "Brian Turner" },
        { code: "SPV010", name: "Elizabeth Scott" },
        { code: "SPV011", name: "Laura Nelson" },
        { code: "SPV012", name: "Maria Gonzalez" },
        { code: "SPV013", name: "Samuel Green" },
        { code: "SPV014", name: "Rebecca White" },
        { code: "SPV015", name: "Amanda Parker" },
        // Add more supervisors as needed
      ];

      this.countryOptions = [
        { code: "ID", name: "Indonesia" },
        { code: "SG", name: "Singapore" },
        { code: "MY", name: "Malaysia" },
        { code: "TH", name: "Thailand" },
        { code: "PH", name: "Philippines" },
        { code: "VN", name: "Vietnam" },
        { code: "HK", name: "Hong Kong" },
        { code: "JP", name: "Japan" },
        { code: "AU", name: "Australia" },
        { code: "NZ", name: "New Zealand" },
        // Add more countries as needed
      ];

      this.cityOptions = [
        { code: "BALI", name: "Bali" },
        { code: "JKT", name: "Jakarta" },
        { code: "BDG", name: "Bandung" },
        { code: "SBY", name: "Surabaya" },
        { code: "YOG", name: "Yogyakarta" },
        { code: "MKS", name: "Makassar" },
        { code: "KUL", name: "Kuala Lumpur" },
        { code: "BKK", name: "Bangkok" },
        { code: "PHU", name: "Phuket" },
        { code: "MNL", name: "Manila" },
        { code: "HCM", name: "Ho Chi Minh City" },
        { code: "HKG", name: "Hong Kong" },
        { code: "TYO", name: "Tokyo" },
        { code: "SYD", name: "Sydney" },
        { code: "MEL", name: "Melbourne" },
        { code: "AKL", name: "Auckland" },
      ];
    } catch (error) {
      getError(error);
    }
  }

  async loadPositionData() {
    try {
      const { data } = await organizationAPI.GetPositionList({
        Index: 0,
        Text: "",
        IndexCheckbox: 1,
      });
      if (data) {
        this.rowPositionData = data;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDepartmentData() {
    try {
      const { data } = await organizationAPI.GetDepartmentList({
        Index: 0,
        Text: "",
        IndexCheckBox: 1,
      });
      this.rowDepartmentData = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadPlacementData() {
    try {
      const { data } = await organizationAPI.GetPlacementList({
        Index: 0,
        Text: "",
        IndexCheckBox: 1,
      });
      this.rowPlacementData = data;
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const formType = this.getCurrentFormType(formData);

      formData.id = this.generateUniqueId(formType);

      // for real implementation
      // if (formType === "position") {
      //   const { status2 } = await organizationAPI.InsertPosition(formData);
      //   if (status2.status === 0) {
      //     await this.loadPositionData();
      //     getToastSuccess(
      //       this.$t("messages.insertSuccess") || "Data added successfully"
      //     );
      //     return { status: 0 };
      //   }
      // } else if (formType === "department") {
      //   const { status2 } = await organizationAPI.InsertDepartment(formData);
      //   if (status2.status === 0) {
      //     await this.loadDepartmentData();
      //     getToastSuccess(
      //       this.$t("messages.insertSuccess") || "Data added successfully"
      //     );
      //     return { status: 0 };
      //   }
      // } else if (formType === "placement") {
      //   const { status2 } = await organizationAPI.InsertPlacement(formData);
      //   if (status2.status === 0) {
      //     await this.loadPlacementData();
      //     getToastSuccess(
      //       this.$t("messages.insertSuccess") || "Data added successfully"
      //     );
      //     return { status: 0 };
      //   }
      // }

      // for demo
      if (formType === "position") {
        this.rowPositionData = [...this.rowPositionData, formData];
      } else if (formType === "department") {
        this.rowDepartmentData = [...this.rowDepartmentData, formData];
      } else if (formType === "placement") {
        this.rowPlacementData = [...this.rowPlacementData, formData];
      }

      await this.loadDataGrid(formType);
      getToastSuccess(
        this.$t("messages.insertSuccess") || "Data added successfully"
      );
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const formType = this.getCurrentFormType(formData);

      // for real implementation
      // if (formType === "position") {
      //   const { status2 } = await organizationAPI.UpdatePosition(formData);
      //   if (status2.status === 0) {
      //     await this.loadPositionData();
      //     getToastSuccess(
      //       this.$t("messages.updateSuccess") || "Data updated successfully"
      //     );
      //     return { status: 0 };
      //   }
      // } else if (formType === "department") {
      //   const { status2 } = await organizationAPI.UpdateDepartment(formData);
      //   if (status2.status === 0) {
      //     await this.loadDepartmentData();
      //     getToastSuccess(
      //       this.$t("messages.updateSuccess") || "Data updated successfully"
      //     );
      //     return { status: 0 };
      //   }
      // } else if (formType === "placement") {
      //   const { status2 } = await organizationAPI.UpdatePlacement(formData);
      //   if (status2.status === 0) {
      //     await this.loadPlacementData();
      //     getToastSuccess(
      //       this.$t("messages.updateSuccess") || "Data updated successfully"
      //     );
      //     return { status: 0 };
      //   }
      // }

      // for demo
      if (formType === "position") {
        const index = this.rowPositionData.findIndex(
          (item: any) => item.id === formData.id
        );
        console.log(
          "data yang akan diupdate",
          this.rowPositionData.find((item: any) => item.id === formData.id)
        );
        if (index !== -1) {
          this.rowPositionData = [
            ...this.rowPositionData.slice(0, index),
            { ...formData },
            ...this.rowPositionData.slice(index + 1),
          ];
        }
        console.log(
          "data setelah update",
          this.rowPositionData.find((item: any) => item.id === formData.id)
        );
      } else if (formType === "department") {
        const index = this.rowDepartmentData.findIndex(
          (item: any) => item.id === formData.id
        );
        if (index !== -1) {
          this.rowDepartmentData = [
            ...this.rowDepartmentData.slice(0, index),
            { ...formData },
            ...this.rowDepartmentData.slice(index + 1),
          ];
        }
      } else if (formType === "placement") {
        const index = this.rowPlacementData.findIndex(
          (item: any) => item.id === formData.id
        );
        if (index !== -1) {
          this.rowPlacementData = [
            ...this.rowPlacementData.slice(0, index),
            { ...formData },
            ...this.rowPlacementData.slice(index + 1),
          ];
        }
      }

      await this.loadDataGrid(formType);

      getToastSuccess(
        this.$t("messages.updateSuccess") || "Data updated successfully"
      );
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const params = this.deleteParam;
      const type = this.getCurrentFormType(params);
      // this.showDialog = false;
      // await this.$nextTick()

      // for real implementation
      // if (type === "position") {
      //   const { status2 } = await organizationAPI.DeletePosition(params.id);
      //   if (status2.status === 0) {
      //     await this.loadPositionData();
      //     getToastSuccess(`Position has been removed successfully`);
      //   }
      // } else if (type === "department") {
      //   const { status2 } = await organizationAPI.DeleteDepartment(params.id);
      //   if (status2.status === 0) {
      //     await this.loadDepartmentData();
      //     getToastSuccess(`Department has been removed successfully`);
      //   }
      // } else if (type === "placement") {
      //   const { status2 } = await organizationAPI.DeletePlacement(params.id);
      //   if (status2.status === 0) {
      //     await this.loadPlacementData();
      //     getToastSuccess(`Placement has been removed successfully`);
      //   }
      // }

      // for demo
      if (type === "position") {
        this.rowPositionData = this.rowPositionData.filter(
          (item: any) => item.id !== params.id
        );
        getToastSuccess(`Item ${type} has been removed successfully`);
      } else if (type === "department") {
        this.rowDepartmentData = this.rowDepartmentData.filter(
          (item: any) => item.id !== params.id
        );
        getToastSuccess(`Item ${type} has been removed successfully`);
      } else if (type === "placement") {
        this.rowPlacementData = this.rowPlacementData.filter(
          (item: any) => item.id !== params.id
        );
        getToastSuccess(`Item ${type} has been removed successfully`);
      } else {
        getToastError("Type not found");
        return;
      }

      await this.loadDataGrid(type);
    } catch (error) {
      getError(error);
    }
  }

  // HELPER FUNCTION =======================================================
  generateUniqueId(formType: string): number {
    let maxId = 0;
    if (formType === "position") {
      maxId = Math.max(
        ...this.rowPositionData.map((item: any) => item.id || 0)
      );
    } else if (formType === "department") {
      maxId = Math.max(
        ...this.rowDepartmentData.map((item: any) => item.id || 0)
      );
    } else if (formType === "placement") {
      maxId = Math.max(
        ...this.rowPlacementData.map((item: any) => item.id || 0)
      );
    }
    return maxId + 1;
  }

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

  formatFormData(params: any, formType: string): any {
    let formatted: any;
    switch (formType) {
      case "position":
        formatted = this.formatPositionData(params);
        break;
      case "department":
        formatted = this.formatDepartmentData(params);
        break;
      case "placement":
        formatted = this.formatPlacement(params);
        break;
      default:
        throw new Error("Unknown form type");
    }

    if (params.id) {
      formatted.id = params.id;
    }

    return formatted;
  }

  formatPositionData(params: any) {
    return {
      id: params.id,
      position_code: params.positionCode,
      position_name: params.positionName,
      position_description: params.positionDescription,
      position_level: params.positionLevel,
      position_department: params.positionDepartment,
      position_placement: params.positionPlacement,
      position_status: params.positionStatus === "A",
      position_created_at: params.id
        ? undefined
        : new Date().toISOString().split("T")[0] +
          " " +
          new Date().toTimeString().split(" ")[0],
      position_created_by: params.id ? undefined : "Current User",
      position_updated_at:
        new Date().toISOString().split("T")[0] +
        " " +
        new Date().toTimeString().split(" ")[0],
      position_updated_by: "Current User",
    };
  }

  formatDepartmentData(params: any) {
    return {
      id: params.id,
      department_code: params.departmentCode,
      department_name: params.departmentName,
      department_description: params.departmentDescription,
      department_placement: params.departmentPlacement,
      department_manager: params.departmentManager,
      department_supervisor: params.departmentSupervisor,
      department_status: params.departmentStatus === "A",
      department_created_at: params.id
        ? undefined
        : new Date().toISOString().split("T")[0] +
          " " +
          new Date().toTimeString().split(" ")[0],
      department_created_by: params.id ? undefined : "Current User",
      department_updated_at:
        new Date().toISOString().split("T")[0] +
        " " +
        new Date().toTimeString().split(" ")[0],
      department_updated_by: "Current User",
    };
  }

  formatPlacement(params: any) {
    return {
      id: params.id,
      placement_code: params.placementCode,
      placement_name: params.placementName,
      placement_country: params.placementCountry,
      placement_city: params.placementCity,
      placement_address: params.placementAddress,
      placement_status: params.placementStatus === "A",
      placement_created_at: params.id
        ? undefined
        : new Date().toISOString().split("T")[0] +
          " " +
          new Date().toTimeString().split(" ")[0],
      placement_created_by: params.id ? undefined : "Current User",
      placement_updated_at:
        new Date().toISOString().split("T")[0] +
        " " +
        new Date().toTimeString().split(" ")[0],
      placement_updated_by: "Current User",
    };
  }

  getCurrentFormType(params: any): string {
    if (typeof params === "string") return params;

    // for grid row data
    if (params.position_code !== undefined) return "position";
    if (params.department_code !== undefined) return "department";
    if (params.placement_code !== undefined) return "placement";

    // for form data
    if (params.positionCode !== undefined) return "position";
    if (params.departmentCode !== undefined) return "department";
    if (params.placementCode !== undefined) return "placement";

    return this.currentFormType;
  }

  getFormElementByType(type: string): any {
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

  getCurrentFormRef() {
    switch (this.currentFormType) {
      case "position":
        return "positionFormElement";
      case "department":
        return "departmentFormElement";
      case "placement":
        return "placementFormElement";
      default:
        console.info(`Unknown form ref`);
    }
  }
  // GETTER AND SETTER =======================================================
  // get pinnedBottomRowData() {
  //   return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  // }
}
