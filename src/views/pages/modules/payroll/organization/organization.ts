import CDialog from "@/components/dialog/dialog.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { formatDateTimeUTC } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EarningsInputForm from "../payroll-component/earnings-component-input-form/earnings-component-input-form.vue";
import DepartmentInputForm from "./department-input-form/department-input-form.vue";
import DepartmentTableComponent from "./department-table-component/department-table-component.vue";
import PlacementInputForm from "./placement-input-form/placement-input-form.vue";
import PlacementTableComponent from "./placement-table-component/placement-table-component.vue";
import PositionInputForm from "./position-input-form/position-input-form.vue";
import PositionTableComponent from "./position-table-component/position-table-component.vue";

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
    DepartmentTableComponent,
    PositionTableComponent,
    PlacementTableComponent,
  },
})
export default class Employee extends Vue {
  // data
  public rowDepartmentData: any = [];
  public rowPositionData: any = [];
  public rowPlacementData: any = [];

  // form
  public dataType: any;
  public showForm: boolean = false;
  public modeData: any;
  public currentForm: any = ref();
  public positionFormElement: any = ref();
  public departmentFormElement: any = ref();
  public placementFormElement: any = ref();

  // child components refs
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
  created() {
    this.loadData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.dataType = this.getDataType(params);
    this.currentForm = {};

    const formElement = this.getFormElementByType(this.dataType);
    console.log("handleShowForm", params);
    console.log("dataType", this.dataType);
    console.log("formElement", formElement);
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        formElement.initialize();
      } else if (mode === $global.modeData.edit && params) {
        console.log("masuk ke edit");
        this.loadEditData(params);
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
    this.dataType = this.getDataType(params);
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
        this.handleEdit(params.params);
        break;
      case "DELETE":
        this.handleDelete(params.params);
        break;
      default:
        this.handleShowForm(params.params, $global.modeData.insert);
    }
  }

  confirmAction() {
    this.showDialog = false;
    this.dataType = this.getDataType(this.deleteParam);
    this.deleteData();

    this.showDialog = false;
    this.dialogAction = "";
  }

  refreshData(search: any) {
    this.loadDataGrid();
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      // await Promise.all([
      //   this.loadPositionData(),
      //   this.loadDepartmentData(),
      //   this.loadPlacementData(),
      // ]);

      this.loadDropdown();
      this.loadMockData();
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
      switch (this.dataType) {
        case "POSITION":
          const position = this.rowPositionData.find(
            (item: any) => item.id === params.id
          );

          if (position) {
            this.$nextTick(() => {
              this.positionFormElement.form = this.populateForm(position);
            });
          }
          break;
        case "DEPARTMENT":
          const department = this.rowPositionData.find(
            (item: any) => item.id === params.id
          );

          if (department) {
            this.$nextTick(() => {
              this.departmentFormElement.form = this.populateForm(department);
            });
          }
          break;
        case "PLACEMENT":
          const placement = this.rowPositionData.find(
            (item: any) => item.id === params.id
          );

          if (placement) {
            this.$nextTick(() => {
              this.placementFormElement.form = this.populateForm(placement);
            });
          }
          break;
      }
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
        description: "Executive leadership team",
        placement_name: "Amora Ubud",
        manager_name: "John Smith",
        supervisor_name: "Jane Doe",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        department_code: "D002",
        department_name: "Human Resources",
        description: "Employee recruitment, management, and development",
        placement_name: "Amora Ubud",
        manager_name: "Sarah Johnson",
        supervisor_name: "Michael Brown",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        department_code: "D003",
        department_name: "Finance",
        description: "Financial management and accounting",
        placement_name: "Amora Ubud",
        manager_name: "Robert Chen",
        supervisor_name: "Emily Davis",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        department_code: "D004",
        department_name: "Information Technology",
        description: "IT infrastructure and support",
        placement_name: "Amora Ubud",
        manager_name: "David Wilson",
        supervisor_name: "Lisa Anderson",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        department_code: "D005",
        department_name: "Marketing",
        description: "Brand management and promotion",
        placement_name: "Amora Canggu",
        manager_name: "Jennifer Garcia",
        supervisor_name: "Kevin Martinez",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        department_code: "D006",
        department_name: "Sales",
        description: "Sales and business development",
        placement_name: "Amora Canggu",
        manager_name: "Thomas Wright",
        supervisor_name: "Patricia Hall",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 7,
        department_code: "D007",
        department_name: "Operations",
        description: "Hotel operations management",
        placement_name: "Amora Canggu",
        manager_name: "Charles Lopez",
        supervisor_name: "Nancy Young",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 8,
        department_code: "D008",
        department_name: "Front Office",
        description: "Reception, concierge, and guest services",
        placement_name: "Amora Ubud",
        manager_name: "Daniel Lee",
        supervisor_name: "Susan Clark",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 9,
        department_code: "D009",
        department_name: "Housekeeping",
        description: "Room and public area cleaning and maintenance",
        placement_name: "Amora Ubud",
        manager_name: "Jessica Walker",
        supervisor_name: "Brian Turner",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 10,
        department_code: "D010",
        department_name: "Food & Beverage",
        description: "Restaurant, bar, and catering operations",
        placement_name: "Amora Canggu",
        manager_name: "Richard Baker",
        supervisor_name: "Elizabeth Scott",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 11,
        department_code: "D011",
        department_name: "Engineering",
        description: "Facility maintenance and repairs",
        placement_name: "Amora Ubud",
        manager_name: "Andrew Miller",
        supervisor_name: "Laura Nelson",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 12,
        department_code: "D012",
        department_name: "Security",
        description: "Safety and security operations",
        placement_name: "Amora Canggu",
        manager_name: "James Carter",
        supervisor_name: "Maria Gonzalez",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 13,
        department_code: "D013",
        department_name: "Spa & Wellness",
        description: "Spa services and wellness programs",
        placement_name: "Amora Ubud",
        manager_name: "Michelle Adams",
        supervisor_name: "Samuel Green",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 14,
        department_code: "D014",
        department_name: "Events & Conferences",
        description: "Event planning and execution",
        placement_name: "Amora Canggu",
        manager_name: "Christopher Hill",
        supervisor_name: "Rebecca White",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 15,
        department_code: "D015",
        department_name: "Training & Development",
        description: "Staff training and career development",
        placement_name: "Amora Ubud",
        manager_name: "Jonathan Evans",
        supervisor_name: "Amanda Parker",
        status: false,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-03-15 14:30:00",
        updated_by: "HR Director",
      },
    ];
    this.rowPositionData = [
      {
        id: 1,
        position_code: "P001",
        position_name: "Chief Executive Officer",
        description: "Overall company leadership and strategic direction",
        level: "1",
        department_name: "Executive",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        position_code: "P002",
        position_name: "Chief Operating Officer",
        description:
          "Oversees daily operations and execution of strategic plans",
        level: "1",
        department_name: "Executive",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        position_code: "P003",
        position_name: "Chief Financial Officer",
        description: "Financial planning, management, and reporting",
        level: "1",
        department: "Finance",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        position_code: "P004",
        position_name: "HR Director",
        description: "Oversees human resources functions and strategy",
        level: "2",
        department_name: "Human Resources",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        position_code: "P005",
        position_name: "IT Director",
        description: "Leads IT strategy and operations",
        level: "2",
        department_name: "Information Technology",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        position_code: "P006",
        position_name: "Marketing Director",
        description:
          "Responsible for marketing strategies and brand management",
        level: "2",
        department_name: "Marketing",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 7,
        position_code: "P007",
        position_name: "Operations Manager",
        description: "Manages daily hotel operations and staff",
        level: "3",
        department_name: "Operations",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 8,
        position_code: "P008",
        position_name: "Front Office Manager",
        description: "Supervises reception, concierge, and guest services",
        level: "3",
        department_name: "Front Office",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 9,
        position_code: "P009",
        position_name: "Housekeeping Manager",
        description:
          "Oversees cleaning and maintenance of rooms and public areas",
        level: "3",
        department_name: "Housekeeping",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 10,
        position_code: "P010",
        position_name: "Executive Chef",
        description: "Leads culinary team and menu development",
        level: "3",
        department_name: "Food & Beverage",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 11,
        position_code: "P011",
        position_name: "HR Manager",
        description: "Manages recruitment, training, and employee relations",
        level: "3",
        department_name: "Human Resources",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 12,
        position_code: "P012",
        position_name: "IT Manager",
        description: "Manages IT infrastructure and support",
        level: "3",
        department_name: "Information Technology",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 13,
        position_code: "P013",
        position_name: "Accounting Manager",
        description: "Oversees accounting functions and financial reporting",
        level: "3",
        department_name: "Finance",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 14,
        position_code: "P014",
        position_name: "Front Desk Supervisor",
        description: "Supervises front desk staff and operations",
        level: "4",
        department_name: "Front Office",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 15,
        position_code: "P015",
        position_name: "Restaurant Manager",
        description: "Manages restaurant operations and staff",
        level: "4",
        department_name: "Food & Beverage",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 16,
        position_code: "P016",
        position_name: "HR Specialist",
        description: "Handles recruitment and employee relations",
        level: "4",
        department_name: "Human Resources",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 17,
        position_code: "P017",
        position_name: "IT Support Specialist",
        description: "Provides technical support and troubleshooting",
        level: "4",
        department_name: "Information Technology",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 18,
        position_code: "P018",
        position_name: "Accountant",
        description: "Handles financial transactions and reporting",
        level: "4",
        department_name: "Finance",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 19,
        position_code: "P019",
        position_name: "Front Desk Agent",
        description: "Handles check-in/check-out and guest inquiries",
        level: "5",
        department_name: "Front Office",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 20,
        position_code: "P020",
        position_name: "Server",
        description: "Provides food and beverage service to guests",
        level: "5",
        department_name: "Food & Beverage",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 21,
        position_code: "P021",
        position_name: "Housekeeper",
        description: "Cleans and maintains guest rooms",
        level: "5",
        department_name: "Housekeeping",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 22,
        position_code: "P022",
        position_name: "Marketing Coordinator",
        description: "Implements marketing campaigns and social media",
        level: "4",
        department_name: "Marketing",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 23,
        position_code: "P023",
        position_name: "Sales Executive",
        description: "Handles client relationships and sales",
        level: "4",
        department_name: "Sales",
        placement_name: "Amora Canggu",
        status: false,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-05-15 10:30:00",
        updated_by: "HR Manager",
      },
      {
        id: 24,
        position_code: "P024",
        position_name: "Security Officer",
        description: "Ensures safety and security of premises",
        level: "5",
        department_name: "Security",
        placement_name: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 25,
        position_code: "P025",
        position_name: "Maintenance Technician",
        description: "Performs repairs and preventive maintenance",
        level: "5",
        department_name: "Engineering",
        placement_name: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
    ];
    this.rowPlacementData = [
      {
        id: 1,
        placement_code: "PL001",
        placement_name: "Amora Ubud",
        country_name: "Indonesia",
        city_name: "Bali",
        address: "Jl. Raya Ubud No. 88, Ubud, Gianyar, Bali 80571",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        placement_code: "PL002",
        placement_name: "Amora Canggu",
        country_name: "Indonesia",
        city_name: "Bali",
        address:
          "Jl. Pantai Batu Bolong No. 99, Canggu, Kuta Utara, Badung, Bali 80361",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        placement_code: "PL003",
        placement_name: "Amora Seminyak",
        country_name: "Indonesia",
        city_name: "Bali",
        address: "Jl. Kayu Aya No. 123, Seminyak, Kuta, Badung, Bali 80361",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        placement_code: "PL004",
        placement_name: "Amora Nusa Dua",
        country_name: "Indonesia",
        city_name: "Bali",
        address: "Jl. Nusa Dua No. 45, BTDC, Nusa Dua, Bali 80363",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        placement_code: "PL005",
        placement_name: "Amora Jakarta",
        country_name: "Indonesia",
        city_name: "Jakarta",
        address: "Jl. Jendral Sudirman Kav. 52-53, Jakarta Selatan 12190",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        placement_code: "PL006",
        placement_name: "Amora Yogyakarta",
        country_name: "Indonesia",
        city_name: "Yogyakarta",
        address: "Jl. Malioboro No. 77, Yogyakarta 55271",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 7,
        placement_code: "PL007",
        placement_name: "Amora Bandung",
        country_name: "Indonesia",
        city_name: "Bandung",
        address: "Jl. Asia Afrika No. 100, Bandung 40112",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 8,
        placement_code: "PL008",
        placement_name: "Amora Surabaya",
        country_name: "Indonesia",
        city_name: "Surabaya",
        address: "Jl. Embong Malang No. 55, Surabaya 60261",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 9,
        placement_code: "PL009",
        placement_name: "Amora Makassar",
        country_name: "Indonesia",
        city_name: "Makassar",
        address: "Jl. Penghibur No. 33, Makassar 90111",
        status: false,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-04-15 09:30:00",
        updated_by: "Operations Director",
      },
      {
        id: 10,
        placement_code: "PL010",
        placement_name: "Amora Singapore",
        country_name: "Singapore",
        city_name: "Singapore",
        address: "88 Orchard Road, Singapore 238890",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 11,
        placement_code: "PL011",
        placement_name: "Amora Kuala Lumpur",
        country_name: "Malaysia",
        city_name: "Kuala Lumpur",
        address: "123 Jalan Bukit Bintang, Kuala Lumpur 55100",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 12,
        placement_code: "PL012",
        placement_name: "Amora Bangkok",
        country_name: "Thailand",
        city_name: "Bangkok",
        address: "789 Sukhumvit Road, Watthana, Bangkok 10110",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 13,
        placement_code: "PL013",
        placement_name: "Amora Phuket",
        country_name: "Thailand",
        city_name: "Phuket",
        address: "45 Patong Beach Road, Patong, Phuket 83150",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 14,
        placement_code: "PL014",
        placement_name: "Amora Manila",
        country_name: "Philippines",
        city_name: "Manila",
        address: "567 Makati Avenue, Makati City, Manila 1200",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 15,
        placement_code: "PL015",
        placement_name: "Amora Ho Chi Minh",
        country_name: "Vietnam",
        city_name: "Ho Chi Minh",
        address: "321 Nguyen Hue Boulevard, District 1, Ho Chi Minh City",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 16,
        placement_code: "PL016",
        placement_name: "Amora Hong Kong",
        country_name: "Hong Kong",
        city_name: "Hong Kong",
        address: "88 Nathan Road, Tsim Sha Tsui, Kowloon, Hong Kong",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 17,
        placement_code: "PL017",
        placement_name: "Amora Tokyo",
        country_name: "Japan",
        city_name: "Tokyo",
        address: "1-1-1 Roppongi, Minato-ku, Tokyo 106-0032",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 18,
        placement_code: "PL018",
        placement_name: "Amora Sydney",
        country_name: "Australia",
        city_name: "Sydney",
        address: "123 George Street, Sydney, NSW 2000",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 19,
        placement_code: "PL019",
        placement_name: "Amora Melbourne",
        country_name: "Australia",
        city_name: "Melbourne",
        address: "456 Collins Street, Melbourne, VIC 3000",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 20,
        placement_code: "PL020",
        placement_name: "Amora Auckland",
        country_name: "New Zealand",
        city_name: "Auckland",
        address: "789 Queen Street, Auckland 1010",
        status: false,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-06-10 11:45:00",
        updated_by: "Regional Manager",
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
      formData.id = this.generateUniqueId(this.dataType);

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
      switch (this.dataType) {
        case "POSITION":
          const newPosition = {
            id: formData.id,
            position_code: formData.position_code,
            position_name: formData.position_name,
            description: formData.description,
            level: formData.level,
            department: formData.department,
            placement: formData.placement,
            status: formData.status ? "A" : "I",
            created_at: formatDateTimeUTC(new Date()),
            created_by: "Current User",
            updated_at: formatDateTimeUTC(new Date()),
            updated_by: "Current User",
          };

          this.rowPositionData.push(newPosition);

          getToastSuccess(this.$t("messages.employee.success.savePosition"));
          break;
        case "DEPARTMENT":
          const newDepartment = {
            id: formData.id,
            department_code: formData.department_code,
            department_name: formData.department_name,
            description: formData.description,
            placement: formData.placement,
            manager_name: formData.manager_name,
            supervisor_name: formData.supervisor_name,
            status: formData.status ? "A" : "I",
            created_at: formatDateTimeUTC(new Date()),
            created_by: "Current User",
            updated_at: formatDateTimeUTC(new Date()),
            updated_by: "Current User",
          };
          this.rowDepartmentData.push(newDepartment);

          getToastSuccess(this.$t("messages.employee.success.saveDepartment"));
          break;
        case "PLACEMENT":
          const newPlacement = {
            id: formData.id,
            placement_code: formData.placement_code,
            placement_name: formData.placement_name,
            country_name: formData.country_name,
            city_name: formData.city_name,
            address: formData.address,
            status: formData.status ? "A" : "I",
            created_at: formatDateTimeUTC(new Date()),
            created_by: "Current User",
            updated_at: formatDateTimeUTC(new Date()),
            updated_by: "Current User",
          };
          this.rowPlacementData.push(newPlacement);

          getToastSuccess(this.$t("messages.employee.success.savePlacement"));
          break;
      }

      await this.$nextTick();
      await this.loadDataGrid();
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
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
      switch (this.dataType) {
        case "POSITION":
          const iPos = this.rowPositionData.findIndex(
            (item: any) => item.id === formData.id
          );
          if (iPos !== -1) {
            this.rowPositionData[iPos] = {
              ...this.rowPositionData[iPos],
              position_code: this.rowPositionData[iPos].position_code,
              position_name: this.rowPositionData[iPos].position_name,
              description: this.rowPositionData[iPos].description,
              level: this.rowPositionData[iPos].level,
              department: this.rowPositionData[iPos].department,
              placement: this.rowPositionData[iPos].placement,
              status: this.rowPositionData[iPos].status ? "A" : "I",
              updated_at: formatDateTimeUTC(new Date()),
              updated_by: "Current User",
            };
          }

          getToastSuccess(this.$t("messages.employee.success.updatePosition"));
          break;
        case "DEPARTMENT":
          const iDep = this.rowPositionData.findIndex(
            (item: any) => item.id === formData.id
          );
          if (iDep !== -1) {
            this.rowDepartmentData[iDep] = {
              ...this.rowDepartmentData[iDep],
              department_code: this.rowDepartmentData[iDep].department_code,
              department_name: this.rowDepartmentData[iDep].department_name,
              description: this.rowDepartmentData[iDep].description,
              placement: this.rowDepartmentData[iDep].placement,
              manager_name: this.rowDepartmentData[iDep].manager_name,
              supervisor_name: this.rowDepartmentData[iDep].supervisor_name,
              status: this.rowDepartmentData[iDep].status ? "A" : "I",
              updated_at: formatDateTimeUTC(new Date()),
              updated_by: "Current User",
            };
          }

          getToastSuccess(
            this.$t("messages.employee.success.updateDepartment")
          );
          break;
        case "PLACEMENT":
          const iPlc = this.rowPositionData.findIndex(
            (item: any) => item.id === formData.id
          );
          if (iDep !== -1) {
            this.rowPlacementData[iPlc] = {
              ...this.rowPlacementData[iPlc],
              placement_code: this.rowPlacementData[iPlc].placement_code,
              placement_name: this.rowPlacementData[iPlc].placement_name,
              country_name: this.rowPlacementData[iPlc].country_name,
              city_name: this.rowPlacementData[iPlc].city_name,
              address: this.rowPlacementData[iPlc].address,
              status: this.rowPlacementData[iPlc].status ? "A" : "I",
              updated_at: formatDateTimeUTC(new Date()),
              updated_by: "Current User",
            };
          }

          getToastSuccess(this.$t("messages.employee.success.updatePlacement"));
          break;
      }

      await this.$nextTick();
      this.loadDataGrid();
      this.showForm = false;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const params = this.deleteParam;
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
      switch (this.dataType) {
        case "POSITION":
          const updatedPosition = this.rowPositionData.filter(
            (position: any) => position.id !== this.deleteParam.id
          );

          this.rowPositionData = [...updatedPosition];

          getToastSuccess(this.$t("messages.employee.success.deletePosition"));
          break;
        case "DEPARTMENT":
          const updatedDepartment = this.rowDepartmentData.filter(
            (department: any) => department.id !== this.deleteParam.id
          );

          this.rowDepartmentData = [...updatedDepartment];
          getToastSuccess(
            this.$t("messages.employee.success.deleteDepartment")
          );
          break;
        case "PLACEMENT":
          const updatedPlacement = this.rowPlacementData.filter(
            (placement: any) => placement.id !== this.deleteParam.id
          );

          this.rowPlacementData = [...updatedPlacement];

          getToastSuccess(this.$t("messages.employee.success.deletePlacement"));
          break;
      }

      await this.$nextTick();
      this.deleteParam = null;
      this.loadDataGrid();
    } catch (error) {
      getError(error);
    }
  }

  // HELPER FUNCTION =======================================================
  generateUniqueId(formType: string): number {
    let maxId = 0;
    if (formType === "POSITION") {
      maxId =
        Math.max(...this.rowPositionData.map((item: any) => item.id || 0), 0) +
        1;
    } else if (formType === "DEPARTMENT") {
      maxId =
        Math.max(
          ...this.rowDepartmentData.map((item: any) => item.id || 0),
          0
        ) + 1;
    } else if (formType === "PLACEMENT") {
      maxId =
        Math.max(...this.rowPlacementData.map((item: any) => item.id || 0), 0) +
        1;
    }
    return maxId + 1;
  }

  populateForm(params: any) {
    switch (this.dataType) {
      case "POSITION":
        return {
          id: params.id,
          position_code: params.position_code,
          position_name: params.position_name,
          description: params.description,
          level: params.level,
          department_code: params.department_code,
          department_name: params.department_name,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          status: params.status ? "A" : "I",
        };
      case "DEPARTMENT":
        return {
          id: params.id,
          department_code: params.department_code,
          department_name: params.department_name,
          description: params.description,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          manager_id: params.manager_id,
          manager_name: params.manager_name,
          supervisor_id: params.supervisor_id,
          supervisor_name: params.supervisor_name,
          status: params.status ? "A" : "I",
        };
      case "PLACEMENT":
        return {
          id: params.id,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          country_code: params.country_code,
          country_name: params.country_name,
          city_code: params.city_code,
          city_name: params.city_name,
          address: params.address,
          status: params.status ? "A" : "I",
        };
    }
  }

  formatData(params: any): any {
    switch (this.dataType) {
      case "POSITION":
        return {
          id: params.id,
          position_code: params.position_code,
          position_name: params.position_name,
          description: params.description,
          level: params.level,
          department_code: params.department_code,
          department_name: params.department_name,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          status: params.status === "A",
          created_at: params.id
            ? undefined
            : new Date().toISOString().split("T")[0] +
              " " +
              new Date().toTimeString().split(" ")[0],
          created_by: params.id ? undefined : "Current User",
          updated_at:
            new Date().toISOString().split("T")[0] +
            " " +
            new Date().toTimeString().split(" ")[0],
          updated_by: "Current User",
        };
      case "DEPARTMENT":
        return {
          id: params.id,
          department_code: params.department_code,
          department_name: params.department_name,
          description: params.description,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          manager_id: params.manager_id,
          manager_name: params.manager_name,
          supervisor_id: params.supervisor_id,
          supervisor_name: params.supervisor_name,
          status: params.status === "A",
          created_at: params.id
            ? undefined
            : new Date().toISOString().split("T")[0] +
              " " +
              new Date().toTimeString().split(" ")[0],
          created_by: params.id ? undefined : "Current User",
          updated_at:
            new Date().toISOString().split("T")[0] +
            " " +
            new Date().toTimeString().split(" ")[0],
          updated_by: "Current User",
        };
      case "PLACEMENT":
        return {
          id: params.id,
          placement_code: params.placement_code,
          placement_name: params.placement_name,
          country_code: params.country_code,
          country_name: params.country_name,
          city_code: params.city_code,
          city_name: params.city_name,
          address: params.address,
          status: params.status === "A",
          created_at: params.id
            ? undefined
            : new Date().toISOString().split("T")[0] +
              " " +
              new Date().toTimeString().split(" ")[0],
          created_by: params.id ? undefined : "Current User",
          updated_at:
            new Date().toISOString().split("T")[0] +
            " " +
            new Date().toTimeString().split(" ")[0],
          updated_by: "Current User",
        };
      default:
        throw new Error("Unknown form type");
    }
  }

  getDataType(params: any): string {
    if (!params) {
      return this.getDataTypeFromActiveTab();
    }

    // for grid row data
    if (params.position_code !== undefined) return "POSITION";
    if (params.department_code !== undefined) return "DEPARTMENT";
    if (params.placement_code !== undefined) return "PLACEMENT";

    return this.dataType;
  }

  getDataTypeFromActiveTab(): string {
    const activeTabId = document.querySelector(".tab-pane.active")?.id;

    if (activeTabId?.includes("position")) return "POSITION";
    if (activeTabId?.includes("department")) return "DEPARTMENT";
    if (activeTabId?.includes("placement")) return "PLACEMENT";

    return "POSITION";
  }

  getFormElementByType(type: string): any {
    switch (type) {
      case "POSITION":
        return this.positionFormElement;
      case "DEPARTMENT":
        return this.departmentFormElement;
      case "PLACEMENT":
        return this.placementFormElement;
      default:
        console.info(`Unknown form type: ${type}`);
        return null;
    }
  }

  // GETTER AND SETTER =======================================================
}
