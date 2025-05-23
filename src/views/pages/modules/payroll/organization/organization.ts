import CDialog from "@/components/dialog/dialog.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { formatDateTimeUTC } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
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
  public currentForm: any = reactive({});
  public inputFormElement: any = ref();
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
    this.loadDropdown();
    this.loadMockData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowForm(params: any, mode: any, type: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.dataType = type;
    this.currentForm = {};

    const formElement = this.getFormElementByType(this.dataType);
    console.log("handleShowForm", params);
    console.log("formElement", formElement);
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        formElement.initialize();
      } else if (mode === $global.modeData.edit && params) {
        console.log("masuk ke edit");
        formElement.form = this.populateForm(params);
      }
    });

    this.showForm = true;
  }

  handleSave(formData: any) {
    const formattedData = this.formatFormData(formData, this.dataType);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleEdit(formData: any) {
    console.log("handleEdit", formData);
    this.dataType = this.getDataType(formData);
    this.handleShowForm(formData, $global.modeData.edit, this.dataType);
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
        this.handleShowForm(
          params.params,
          $global.modeData.insert,
          params.type
        );
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
      await Promise.all([
        this.loadPositionData(),
        this.loadDepartmentData(),
        this.loadPlacementData(),
      ]);
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

  async loadEditData(params: any, type: any) {
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
      const formElement = this.getFormElementByType(type);
      if (!formElement) {
        console.error(`Form element for ${type} not found`);
        return;
      }

      // this.populateForm(params);
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowDepartmentData = [
      {
        id: 1,
        department_code: "D001",
        name: "Executive",
        description: "Executive leadership team",
        placement: "Amora Ubud",
        manager: "John Smith",
        supervisor: "Jane Doe",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        department_code: "D002",
        name: "Human Resources",
        description: "Employee recruitment, management, and development",
        placement: "Amora Ubud",
        manager: "Sarah Johnson",
        supervisor: "Michael Brown",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        department_code: "D003",
        name: "Finance",
        description: "Financial management and accounting",
        placement: "Amora Ubud",
        manager: "Robert Chen",
        supervisor: "Emily Davis",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        department_code: "D004",
        name: "Information Technology",
        description: "IT infrastructure and support",
        placement: "Amora Ubud",
        manager: "David Wilson",
        supervisor: "Lisa Anderson",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        department_code: "D005",
        name: "Marketing",
        description: "Brand management and promotion",
        placement: "Amora Canggu",
        manager: "Jennifer Garcia",
        supervisor: "Kevin Martinez",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        department_code: "D006",
        name: "Sales",
        description: "Sales and business development",
        placement: "Amora Canggu",
        manager: "Thomas Wright",
        supervisor: "Patricia Hall",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 7,
        department_code: "D007",
        name: "Operations",
        description: "Hotel operations management",
        placement: "Amora Canggu",
        manager: "Charles Lopez",
        supervisor: "Nancy Young",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 8,
        department_code: "D008",
        name: "Front Office",
        description: "Reception, concierge, and guest services",
        placement: "Amora Ubud",
        manager: "Daniel Lee",
        supervisor: "Susan Clark",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 9,
        department_code: "D009",
        name: "Housekeeping",
        description: "Room and public area cleaning and maintenance",
        placement: "Amora Ubud",
        manager: "Jessica Walker",
        supervisor: "Brian Turner",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 10,
        department_code: "D010",
        name: "Food & Beverage",
        description: "Restaurant, bar, and catering operations",
        placement: "Amora Canggu",
        manager: "Richard Baker",
        supervisor: "Elizabeth Scott",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 11,
        department_code: "D011",
        name: "Engineering",
        description: "Facility maintenance and repairs",
        placement: "Amora Ubud",
        manager: "Andrew Miller",
        supervisor: "Laura Nelson",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 12,
        department_code: "D012",
        name: "Security",
        description: "Safety and security operations",
        placement: "Amora Canggu",
        manager: "James Carter",
        supervisor: "Maria Gonzalez",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 13,
        department_code: "D013",
        name: "Spa & Wellness",
        description: "Spa services and wellness programs",
        placement: "Amora Ubud",
        manager: "Michelle Adams",
        supervisor: "Samuel Green",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 14,
        department_code: "D014",
        name: "Events & Conferences",
        description: "Event planning and execution",
        placement: "Amora Canggu",
        manager: "Christopher Hill",
        supervisor: "Rebecca White",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 15,
        department_code: "D015",
        name: "Training & Development",
        description: "Staff training and career development",
        placement: "Amora Ubud",
        manager: "Jonathan Evans",
        supervisor: "Amanda Parker",
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
        name: "Chief Executive Officer",
        description: "Overall company leadership and strategic direction",
        level: "1",
        department: "Executive",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        position_code: "P002",
        name: "Chief Operating Officer",
        description:
          "Oversees daily operations and execution of strategic plans",
        level: "1",
        department: "Executive",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        position_code: "P003",
        name: "Chief Financial Officer",
        description: "Financial planning, management, and reporting",
        level: "1",
        department: "Finance",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        position_code: "P004",
        name: "HR Director",
        description: "Oversees human resources functions and strategy",
        level: "2",
        department: "Human Resources",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        position_code: "P005",
        name: "IT Director",
        description: "Leads IT strategy and operations",
        level: "2",
        department: "Information Technology",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        position_code: "P006",
        name: "Marketing Director",
        description:
          "Responsible for marketing strategies and brand management",
        level: "2",
        department: "Marketing",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 7,
        position_code: "P007",
        name: "Operations Manager",
        description: "Manages daily hotel operations and staff",
        level: "3",
        department: "Operations",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 8,
        position_code: "P008",
        name: "Front Office Manager",
        description: "Supervises reception, concierge, and guest services",
        level: "3",
        department: "Front Office",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 9,
        position_code: "P009",
        name: "Housekeeping Manager",
        description:
          "Oversees cleaning and maintenance of rooms and public areas",
        level: "3",
        department: "Housekeeping",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 10,
        position_code: "P010",
        name: "Executive Chef",
        description: "Leads culinary team and menu development",
        level: "3",
        department: "Food & Beverage",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 11,
        position_code: "P011",
        name: "HR Manager",
        description: "Manages recruitment, training, and employee relations",
        level: "3",
        department: "Human Resources",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 12,
        position_code: "P012",
        name: "IT Manager",
        description: "Manages IT infrastructure and support",
        level: "3",
        department: "Information Technology",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 13,
        position_code: "P013",
        name: "Accounting Manager",
        description: "Oversees accounting functions and financial reporting",
        level: "3",
        department: "Finance",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 14,
        position_code: "P014",
        name: "Front Desk Supervisor",
        description: "Supervises front desk staff and operations",
        level: "4",
        department: "Front Office",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 15,
        position_code: "P015",
        name: "Restaurant Manager",
        description: "Manages restaurant operations and staff",
        level: "4",
        department: "Food & Beverage",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 16,
        position_code: "P016",
        name: "HR Specialist",
        description: "Handles recruitment and employee relations",
        level: "4",
        department: "Human Resources",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 17,
        position_code: "P017",
        name: "IT Support Specialist",
        description: "Provides technical support and troubleshooting",
        level: "4",
        department: "Information Technology",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 18,
        position_code: "P018",
        name: "Accountant",
        description: "Handles financial transactions and reporting",
        level: "4",
        department: "Finance",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 19,
        position_code: "P019",
        name: "Front Desk Agent",
        description: "Handles check-in/check-out and guest inquiries",
        level: "5",
        department: "Front Office",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 20,
        position_code: "P020",
        name: "Server",
        description: "Provides food and beverage service to guests",
        level: "5",
        department: "Food & Beverage",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 21,
        position_code: "P021",
        name: "Housekeeper",
        description: "Cleans and maintains guest rooms",
        level: "5",
        department: "Housekeeping",
        placement: "Amora Canggu",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 22,
        position_code: "P022",
        name: "Marketing Coordinator",
        description: "Implements marketing campaigns and social media",
        level: "4",
        department: "Marketing",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 23,
        position_code: "P023",
        name: "Sales Executive",
        description: "Handles client relationships and sales",
        level: "4",
        department: "Sales",
        placement: "Amora Canggu",
        status: false,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-05-15 10:30:00",
        updated_by: "HR Manager",
      },
      {
        id: 24,
        position_code: "P024",
        name: "Security Officer",
        description: "Ensures safety and security of premises",
        level: "5",
        department: "Security",
        placement: "Amora Ubud",
        status: true,
        created_at: "2023-01-01 08:00:00",
        created_by: "Admin System",
        updated_at: "2023-01-01 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 25,
        position_code: "P025",
        name: "Maintenance Technician",
        description: "Performs repairs and preventive maintenance",
        level: "5",
        department: "Engineering",
        placement: "Amora Canggu",
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
        name: "Amora Ubud",
        country: "Indonesia",
        city: "Bali",
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
        name: "Amora Canggu",
        country: "Indonesia",
        city: "Bali",
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
        name: "Amora Seminyak",
        country: "Indonesia",
        city: "Bali",
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
        name: "Amora Nusa Dua",
        country: "Indonesia",
        city: "Bali",
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
        name: "Amora Jakarta",
        country: "Indonesia",
        city: "Jakarta",
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
        name: "Amora Yogyakarta",
        country: "Indonesia",
        city: "Yogyakarta",
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
        name: "Amora Bandung",
        country: "Indonesia",
        city: "Bandung",
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
        name: "Amora Surabaya",
        country: "Indonesia",
        city: "Surabaya",
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
        name: "Amora Makassar",
        country: "Indonesia",
        city: "Makassar",
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
        name: "Amora Singapore",
        country: "Singapore",
        city: "Singapore",
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
        name: "Amora Kuala Lumpur",
        country: "Malaysia",
        city: "Kuala Lumpur",
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
        name: "Amora Bangkok",
        country: "Thailand",
        city: "Bangkok",
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
        name: "Amora Phuket",
        country: "Thailand",
        city: "Phuket",
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
        name: "Amora Manila",
        country: "Philippines",
        city: "Manila",
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
        name: "Amora Ho Chi Minh",
        country: "Vietnam",
        city: "Ho Chi Minh",
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
        name: "Amora Hong Kong",
        country: "Hong Kong",
        city: "Hong Kong",
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
        name: "Amora Tokyo",
        country: "Japan",
        city: "Tokyo",
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
        name: "Amora Sydney",
        country: "Australia",
        city: "Sydney",
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
        name: "Amora Melbourne",
        country: "Australia",
        city: "Melbourne",
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
        name: "Amora Auckland",
        country: "New Zealand",
        city: "Auckland",
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
            name: formData.name,
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
            name: formData.name,
            description: formData.description,
            placement: formData.placement,
            manager: formData.manager,
            supervisor: formData.supervisor,
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
            name: formData.name,
            country: formData.country,
            city: formData.city,
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
      this.loadDataGrid();
      this.showForm = false;
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
              name: this.rowPositionData[iPos].name,
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
              name: this.rowDepartmentData[iDep].name,
              description: this.rowDepartmentData[iDep].description,
              placement: this.rowDepartmentData[iDep].placement,
              manager: this.rowDepartmentData[iDep].manager,
              supervisor: this.rowDepartmentData[iDep].supervisor,
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
              name: this.rowPlacementData[iPlc].name,
              country: this.rowPlacementData[iPlc].country,
              city: this.rowPlacementData[iPlc].city,
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
    this.$nextTick(() => {
      switch (this.dataType) {
        case "POSITION":
          this.$refs.positionFormElement = {
            id: params.id,
            position_code: params.position_code,
            name: params.name,
            description: params.description,
            level: params.level,
            department: params.department,
            placement: params.placement,
            status: params.status ? "A" : "I",
          };
          break;
        case "DEPARTMENT":
          this.$refs.departmentFormElement = {
            id: params.id,
            department_code: params.department_code,
            name: params.name,
            description: params.description,
            placement: params.placement,
            manager: params.manager,
            supervisor: params.supervisor,
            status: params.status ? "A" : "I",
          };
          break;
        case "PLACEMENT":
          this.$refs.placementFormElement = {
            id: params.id,
            placement_code: params.placement_code,
            name: params.name,
            country: params.country,
            city: params.city,
            address: params.address,
            status: params.status ? "A" : "I",
          };
          break;
      }
    });
  }

  formatFormData(params: any, type: string): any {
    let formatted: any;
    switch (type) {
      case "POSITION":
        formatted = this.formatPositionData(params);
        break;
      case "DEPARTMENT":
        formatted = this.formatDepartmentData(params);
        break;
      case "PLACEMENT":
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
      position_code: params.posiditon_code,
      name: params.name,
      description: params.description,
      level: params.level,
      department: params.department,
      placement: params.placement,
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
  }

  formatDepartmentData(params: any) {
    return {
      id: params.id,
      department_code: params.department_code,
      name: params.name,
      description: params.description,
      placement: params.placement,
      manager: params.manager,
      supervisor: params.supervisor,
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
  }

  formatPlacement(params: any) {
    return {
      id: params.id,
      placement_code: params.placement_code,
      name: params.name,
      country: params.country,
      city: params.city,
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
        return this.$refs.positionFormElement;
      case "DEPARTMENT":
        return this.$refs.departmentFormElement;
      case "PLACEMENT":
        return this.$refs.placementFormElement;
      default:
        console.info(`Unknown form type: ${type}`);
        return null;
    }
  }

  // GETTER AND SETTER =======================================================
}
