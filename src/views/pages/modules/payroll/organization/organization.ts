import CDialog from "@/components/dialog/dialog.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import DepartmentInputForm from "./components/department/department-input-form/department-input-form.vue";
import DepartmentTableComponent from "./components/department/department-table-component.vue";
import PlacementInputForm from "./components/placement/placement-input-form/placement-input-form.vue";
import PlacementTableComponent from "./components/placement/placement-table-component.vue";
import PositionInputForm from "./components/position/position-input-form/position-input-form.vue";
import PositionTableComponent from "./components/position/position-table-component.vue";

const organizationAPI = new OrganizationAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CDialog,
    PositionInputForm,
    DepartmentInputForm,
    PlacementInputForm,
    DepartmentTableComponent,
    PositionTableComponent,
    PlacementTableComponent,
  },
})
export default class Organizaation extends Vue {
  // data
  public rowDepartmentData: any = [];
  public rowPositionData: any = [];
  public rowPlacementData: any = [];

  // form
  public dataType: any = "";
  public showForm: boolean = false;
  public modeData: any;
  positionFormElement: any = ref();
  departmentFormElement: any = ref();
  placementFormElement: any = ref();

  // table refs
  positionTableRef: any = ref();
  departmentTableRef: any = ref();
  placementTableRef: any = ref();

  // options
  public positionLevelOptions: any[];
  public departmentOptions: any[];
  public placementOptions: any[];
  public managerOptions: any[];
  public supervisorOptions: any[];
  public countryOptions: any[];
  public cityOptions: any = ref([]);

  // modal
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public deleteParam: any = null;

  // RECYCLE LIFE FUNCTION =======================================================
  mounted() {
    this.loadData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    if (typeof params === "string") {
      this.dataType = params;
    }

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        switch (this.dataType) {
          case "POSITION":
            this.positionFormElement.initialize();
            break;
          case "DEPARTMENT":
            this.departmentFormElement.initialize();
            break;
          case "PLACEMENT":
            this.placementFormElement.initialize();
            break;
        }
      } else if (mode === $global.modeData.edit && params) {
        console.log("edit", params);
        this.loadEditData(params);
      }
    });

    this.showForm = true;
  }

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
      // switch (this.dataType) {
      //   case "PLACEMENT":
      //     this.insertPlacement(formattedData);
      //     break;
      //   case "DEPARTMENT":
      //     this.insertDepartment(formattedData);
      //     break;
      //   case "POSITION":
      //     this.insertPosition(formattedData);
      //     break;
      // }
    } else {
      this.updateData(formattedData);
      // switch (this.dataType) {
      //   case "PLACEMENT":
      //     this.updatePlacement(formattedData);
      //     break;
      //   case "DEPARTMENT":
      //     this.updateDepartment(formattedData);
      //     break;
      //   case "POSITION":
      //     this.updatePosition(formattedData);
      //     break;
      // }
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = { ...params };
    this.dialogAction = "delete";
    switch (this.dataType) {
      case "POSITION":
        this.dialogMessage = this.$t(
          "messages.employee.confirm.deletePosition"
        );
        break;
      case "DEPARTMENT":
        this.dialogMessage = this.$t(
          "messages.employee.confirm.deleteDepartment"
        );
        break;
      case "PLACEMENT":
        this.dialogMessage = this.$t(
          "messages.employee.confirm.deletePlacement"
        );
        break;
    }
    this.showDialog = true;
  }

  handleTableAction(params: any) {
    switch (params.event) {
      case "EDIT":
        this.dataType = params.type;
        this.handleEdit(params.params);
        break;
      case "DELETE":
        this.dataType = params.type;
        this.handleDelete(params.params);
        break;
      default:
        this.dataType = "";
        this.showForm = false;
        this.handleShowForm(params.type, $global.modeData.insert);
        break;
    }
  }

  confirmAction() {
    this.deleteData();

    this.dataType = "";
    this.dialogAction = "";
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      await Promise.all([
        this.loadPositionData(),
        this.loadDepartmentData(),
        this.loadPlacementData(),
      ]);

      this.loadDropdown();
      // this.loadMockData();
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(type: any = this.dataType) {
    switch (type) {
      case "POSITION":
        if (this.positionTableRef) {
          this.positionTableRef.refreshGrid();
        }
        break;
      case "DEPARTMENT":
        if (this.departmentTableRef) {
          this.departmentTableRef.refreshGrid();
        }
        break;
      case "PLACEMENT":
        if (this.placementTableRef) {
          this.placementTableRef.refreshGrid();
        }
        break;
    }
  }

  async loadEditData(params: any) {
    try {
      switch (this.dataType) {
        case "POSITION":
          const { data: position } = await organizationAPI.GetPosition(
            params.id
          );

          this.$nextTick(() => {
            this.positionFormElement.form = this.populateForm(position);
          });
          break;
        case "DEPARTMENT":
          const { data: department } = await organizationAPI.GetDepartment(
            params.id
          );
          this.$nextTick(() => {
            this.departmentFormElement.form = this.populateForm(department);
          });
          break;
        case "PLACEMENT":
          const { data: placement } = await organizationAPI.GetPlacement(
            params.id
          );
          this.$nextTick(() => {
            this.placementFormElement.form = this.populateForm(placement);
          });
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const { data: placementActive } =
        await organizationAPI.GetPlacementActiveList({
          Index: 0,
          Text: "",
          IndexCheckbox: 1,
        });

      const { data: departmentActive } =
        await organizationAPI.GetDepartmentActiveList({
          Index: 0,
          Text: "",
          IndexCheckbox: 1,
        });

      this.placementOptions = placementActive;
      this.departmentOptions = departmentActive;

      // for demo
      this.positionLevelOptions = [
        { code: "1", name: "1" },
        { code: "2", name: "2" },
        { code: "3", name: "3" },
        { code: "4", name: "4" },
        { code: "5", name: "5" },
        { code: "6", name: "6" },
        { code: "7", name: "7" },
      ];

      this.managerOptions = [
        { employee_id: "MGR001", name: "John Smith" },
        { employee_id: "MGR002", name: "Sarah Johnson" },
        { employee_id: "MGR003", name: "Robert Chen" },
        { employee_id: "MGR004", name: "David Wilson" },
        { employee_id: "MGR005", name: "Jennifer Garcia" },
        { employee_id: "MGR006", name: "Thomas Wright" },
        { employee_id: "MGR007", name: "Charles Lopez" },
        { employee_id: "MGR008", name: "Daniel Lee" },
        { employee_id: "MGR009", name: "Jessica Walker" },
        { employee_id: "MGR010", name: "Richard Baker" },
        { employee_id: "MGR011", name: "Andrew Miller" },
        { employee_id: "MGR012", name: "James Carter" },
        { employee_id: "MGR013", name: "Michelle Adams" },
        { employee_id: "MGR014", name: "Christopher Hill" },
        { employee_id: "MGR015", name: "Jonathan Evans" },
        // Add more managers as needed
      ];

      this.supervisorOptions = [
        { employee_id: "SPV001", name: "Jane Doe" },
        { employee_id: "SPV002", name: "Michael Brown" },
        { employee_id: "SPV003", name: "Emily Davis" },
        { employee_id: "SPV004", name: "Lisa Anderson" },
        { employee_id: "SPV005", name: "Kevin Martinez" },
        { employee_id: "SPV006", name: "Patricia Hall" },
        { employee_id: "SPV007", name: "Nancy Young" },
        { employee_id: "SPV008", name: "Susan Clark" },
        { employee_id: "SPV009", name: "Brian Turner" },
        { employee_id: "SPV010", name: "Elizabeth Scott" },
        { employee_id: "SPV011", name: "Laura Nelson" },
        { employee_id: "SPV012", name: "Maria Gonzalez" },
        { employee_id: "SPV013", name: "Samuel Green" },
        { employee_id: "SPV014", name: "Rebecca White" },
        { employee_id: "SPV015", name: "Amanda Parker" },
        // Add more supervisors as needed
      ];

      this.countryOptions = [
        { code: "Indonesia", name: "Indonesia" },
        { code: "Singapore", name: "Singapore" },
        { code: "Malaysia", name: "Malaysia" },
        { code: "Thailand", name: "Thailand" },
        { code: "Philippines", name: "Philippines" },
        { code: "Vietnam", name: "Vietnam" },
        { code: "Hong Kong", name: "Hong Kong" },
        { code: "Japan", name: "Japan" },
        { code: "Australia", name: "Australia" },
        { code: "New Zealand", name: "New Zealand" },
      ];

      this.cityOptions = [
        { code: "Bali", name: "Bali" },
        { code: "Jakarta", name: "Jakarta" },
        { code: "Bandung", name: "Bandung" },
        { code: "Surabaya", name: "Surabaya" },
        { code: "Yogyakarta", name: "Yogyakarta" },
        { code: "Makassar", name: "Makassar" },
        { code: "Kuala Lumpur", name: "Kuala Lumpur" },
        { code: "Bangkok", name: "Bangkok" },
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
      } else {
        this.rowPositionData = [];
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
      if (data) {
        this.rowDepartmentData = data;
      } else {
        this.rowDepartmentData = [];
      }
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
      if (data) {
        this.rowPlacementData = data;
      } else {
        this.rowPlacementData = [];
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      switch (this.dataType) {
        case "POSITION":
          const { status2: position } = await organizationAPI.InsertPosition(
            formData
          );
          if (position.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.savePosition"));
            this.$nextTick();
            this.loadPositionData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "DEPARTMENT":
          const { status2: department } =
            await organizationAPI.InsertDepartment(formData);
          if (department.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.saveDepartment")
            );
            this.$nextTick();
            this.loadDepartmentData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "PLACEMENT":
          const { status2: placement } = await organizationAPI.InsertPlacement(
            formData
          );
          if (placement.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.savePlacement"));
            this.$nextTick();
            this.loadPlacementData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      switch (this.dataType) {
        case "POSITION":
          const { status2: position } = await organizationAPI.UpdatePosition(
            formData
          );
          if (position.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.updatePosition")
            );
            this.$nextTick();
            this.loadPositionData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "DEPARTMENT":
          const { status2: department } =
            await organizationAPI.UpdateDepartment(formData);
          if (department.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.updateDepartment")
            );
            this.$nextTick();
            this.loadDepartmentData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "PLACEMENT":
          const { status2: placement } = await organizationAPI.UpdatePlacement(
            formData
          );
          if (placement.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.updatePlacement")
            );
            this.$nextTick();
            this.loadPlacementData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      switch (this.dataType) {
        case "POSITION":
          const { status2: position } = await organizationAPI.DeletePosition(
            this.deleteParam.id
          );
          if (position.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.deletePosition")
            );
            this.$nextTick();
            this.loadPositionData();
            this.loadDropdown();
            this.deleteParam = null;
          }
          break;
        case "DEPARTMENT":
          const { status2: department } =
            await organizationAPI.DeleteDepartment(this.deleteParam.id);
          if (department.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.deleteDepartment")
            );
            this.$nextTick();
            this.loadDepartmentData();
            this.loadDropdown();
            this.deleteParam = null;
          }
          break;
        case "PLACEMENT":
          const { status2: placement } = await organizationAPI.DeletePlacement(
            this.deleteParam.id
          );
          if (placement.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.deletePlacement")
            );
            this.$nextTick();
            this.loadPlacementData();
            this.loadDropdown();
            this.deleteParam = null;
          }
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  // HELPER FUNCTION =======================================================
  populateForm(params: any) {
    switch (this.dataType) {
      case "POSITION":
        return {
          id: params.id,
          position_code: params.code,
          position_name: params.name,
          description: params.description,
          level: params.level,
          department_code: params.department_code,
          department_name: params.department_name,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          status: params.status === 1 ? "1" : "0",
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "DEPARTMENT":
        return {
          id: params.id,
          department_code: params.code,
          department_name: params.name,
          description: params.description,
          placement_code: params.placement_code,
          employee_manager_id: params.employee_manager_id,
          employee_supervisor_id: params.employee_supervisor_id,
          status: params.status === 1 ? "1" : "0",
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "PLACEMENT":
        return {
          id: params.id,
          placement_code: params.code,
          placement_name: params.name,
          country: params.country,
          city: params.city,
          address: params.address,
          status: params.status === 1 ? "1" : "0",
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
    }
  }

  formatData(params: any): any {
    switch (this.dataType) {
      case "POSITION":
        return {
          id: params.id,
          code: params.position_code,
          name: params.position_name,
          description: params.description,
          level: parseInt(params.level),
          department_code: params.department_code,
          placement_code: params.placement_code,
          status: parseInt(params.status),
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "DEPARTMENT":
        return {
          id: params.id,
          code: params.department_code,
          name: params.department_name,
          description: params.description,
          placement_code: params.placement_code,
          manager_id: params.manager_id,
          supervisor_id: params.supervisor_id,
          status: parseInt(params.status),
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "PLACEMENT":
        return {
          id: params.id,
          code: params.placement_code,
          name: params.placement_name,
          country: params.country,
          city: params.city,
          address: params.address,
          status: parseInt(params.status),
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      default:
        throw new Error("Unknown form type");
    }
  }

  // getDataType(params: any): string {
  //   if (!params) {
  //     return this.getDataTypeFromActiveTab();
  //   }

  //   // for grid row data
  //   if (params.position_code !== undefined) return "POSITION";
  //   if (params.department_code !== undefined) return "DEPARTMENT";
  //   if (params.placement_code !== undefined) return "PLACEMENT";

  //   return this.dataType;
  // }

  // getDataTypeFromActiveTab(): string {
  //   const activeTabId = document.querySelector(".tab-pane.active")?.id;

  //   if (activeTabId?.includes("position")) return "POSITION";
  //   if (activeTabId?.includes("department")) return "DEPARTMENT";
  //   if (activeTabId?.includes("placement")) return "PLACEMENT";

  //   return "POSITION";
  // }
  // GETTER AND SETTER =======================================================
}
