import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import { formatDateTimeUTC } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EmployeeInputForm from "../employee-input-form/employee-input-form.vue";
import BenefitTableComponent from "./benefit-table-component/benefit-table-component.vue";
import DocumentTableComponent from "./document-table-component/document-table-component.vue";
import SalaryTableComponent from "./salary-table-component/salary-table-component.vue";

interface EmployeeRequest {
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  gender_code: string;
  birth_date: string;
  marital_status: string;
  phone: string;
  email: string;
  address: string;
  hire_date: string;
  end_date: string | null;
  status_code: string; // A = Active, I = Inactive
  employee_type_code: string;
  department_code: string;
  position_code: string;
  placement_code: string;
  supervisor_id: string | null;
  base_salary: number;
  payment_frequency_code: string;
  payment_method_code: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  tax_number: string;
  social_insurance_number: string;
  health_insurance_number: string;
}

interface EmployeeResponse {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  birth_date: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  hire_date: string;
  end_date: string | null;
  status: string; // A = Active, I = Inactive
  employee_type: string;
  department_code: string;
  department_name: string;
  department_manager_name: string;
  position_code: string;
  position_name: string;
  placement_code: string;
  placement_name: string;
  supervisor_id: string | null;
  supervisor_name: string | null;
  base_salary: number;
  payment_frequency_code: string;
  payment_frequency_name: string;
  payment_method_code: string;
  payment_method_name: string;
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  leave_quota: number;
  leave_remaining: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

interface DocumentRequest {
  id?: number;
  employee_id: string;
  document_type_code: string;
  file?: File;
  issue_date: string;
  expiry_date?: string | null;
  remark?: string;
}

interface BenefitRequest {
  id?: number;
  employee_id: string;
  payroll_component_code: string;
  amount: number;
  quantity: number;
  effective_date: string;
  end_date?: string | null;
  is_override: boolean;
  remark?: string;
}

const employeeAPI = new EmployeeAPI();

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
    CSelect,
    CDatepicker,
    CInput,
    EmployeeInputForm,
    DocumentTableComponent,
    BenefitTableComponent,
    SalaryTableComponent,
    CCheckbox,
  },
})
export default class EmployeeDetail extends Vue {
  // data
  employeeId: any;
  employeeData: any = [];
  rowDocumentData: any = [];
  rowSalaryData: any = [];
  rowBenefitData: any = [];

  // for mock
  employeeListData: any = [];
  salaryListData: any = [];
  documentsListData: any = [];
  benefitsListData: any = [];

  // options
  public documentTypeOptions: any[] = [];
  public adjustmentReasonOptions: any[] = [];
  public componentTypeOptions: any[] = [];
  public earningsComponentOptions: any[] = [];
  public deductionsComponentOptions: any[] = [];
  public benefitOptions: any[] = [];

  // employee options
  public employeeTypeOptions: any[] = [];
  public genderOptions: any[] = [];
  public paymentFrequencyOptions: any[] = [];
  public maritalStatusOptions: any[] = [];
  public paymentMethodOptions: any[] = [];
  public bankOptions: any[] = [];
  public departmentOptions: any[] = [];
  public positionOptions: any[] = [];
  public placementOptions: any[] = [];

  // child components refs
  documentTableRef: any = ref();
  salaryTableRef: any = ref();
  benefitTableRef: any = ref();

  /// modal state
  public dataType: any;
  public modalMode: any;
  public currentForm: any = reactive({});
  public showModal: boolean = false;
  public isSaving: boolean = false;

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public deleteParam: any = null;

  // form
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();
  public employeeForm: any = reactive({});

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  // RECYCLE LIFE FUNCTION =======================================================
  created() {
    this.employeeId = this.$route.params.id;
    this.loadMockData();
    this.loadDropdown();
    this.loadEmployeeData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        if (
          this.inputFormElement &&
          typeof this.inputFormElement.initialize === "function"
        ) {
          this.inputFormElement.initialize();
        }
      } else if (mode === $global.modeData.edit) {
        this.loadEditData(params.id);
      }
    });

    this.showForm = true;
  }

  async handleShowModal(params: any, mode: any, type: any) {
    this.showModal = false;
    await this.$nextTick();

    this.modalMode = mode;
    this.dataType = type;

    console.log("dataype modal", this.dataType);

    this.currentForm = {};

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.setDefaultFormValues(type);
      } else if (mode === $global.modeData.edit && params) {
        this.populateModalForm(params, type);
      }
      this.showModal = true;
    });
  }

  handleSaveModal() {
    const formattedData = this.formatModalData(this.currentForm, this.dataType);

    if (this.modalMode === $global.modeData.insert) {
      this.insertModalData(formattedData);
      // switch (this.dataType) {
      //   case "DOCUMENT":
      //     this.insertDocument(formattedData);
      //     break;
      //   case "SALARY":
      //     this.insertSalary(formattedData);
      //     break;
      //   case "BENEFIT":
      //     this.insertBenefit(formattedData);
      //     break;
      // }
    } else if (this.modalMode === $global.modeData.edit) {
      this.updateModalData(formattedData);
      // switch (this.dataType) {
      //   case "DOCUMENT":
      //     this.updateDocument(formattedData);
      //     break;
      //   case "SALARY":
      //     this.updateSalary(formattedData);
      //     break;
      //   case "BENEFIT":
      //     this.updateBenefit(formattedData);
      //     break;
      // }
    }
  }

  handleTableAction(params: any) {
    switch (params.type) {
      case "DOCUMENT":
        if (params.params) {
          switch (params.event) {
            case "EDIT":
              this.handleEdit(params.params);
              break;
            case "DELETE":
              this.handleDelete(params.params);
              break;
            case "PRINT":
              break;
            case "DOWNLOAD":
              break;
          }
        } else {
          this.handleInsert({ type: "DOCUMENT" });
        }
        break;
      case "SALARY":
        if (params.params) {
          this.handleEdit(params.params);
        } else {
          this.handleInsert({ type: "SALARY" });
        }
        break;
      case "BENEFIT":
        if (params.params) {
          switch (params.event) {
            case "EDIT":
              this.handleEdit(params.params);
              break;
            case "DELETE":
              this.handleDelete(params.params);
              break;
          }
        } else {
          this.handleInsert({ type: "BENEFIT" });
        }
        break;
    }
  }

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      // this.insertData(formattedData).then(() => {
      //   this.showForm = false;
      // });
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formattedData).then(() => {
        this.showForm = false;
      });
    }
  }

  handleInsert(params: any) {
    let dataType = "";
    if (typeof params === "object" && params.type) {
      dataType = params.type;
    } else {
      dataType = this.getDataTypeFromActiveTab();
    }

    this.dataType = dataType;

    this.handleShowModal({}, $global.modeData.insert, dataType);
  }

  handleEdit(params: any) {
    this.dataType = this.getDataType(params);

    this.handleShowModal(params, $global.modeData.edit, this.dataType);
  }

  handleDelete(params: any) {
    this.dataType = this.getDataType(params);
    this.deleteParam = { ...params };
    this.dialogAction = "delete";

    switch (this.dataType) {
      case "DOCUMENT":
        this.dialogMessage = this.$t(
          "messages.employee.confirm.documentDelete"
        );
        break;
      case "SALARY":
        this.dialogMessage = this.$t("messages.employee.confirm.salaryDelete");
        break;
      case "BENEFIT":
        this.dialogMessage = this.$t("messages.employee.confirm.benefitDelete");
        break;
    }

    this.showDialog = true;
  }

  confirmAction() {
    this.showDialog = false;
    this.$nextTick(() => {
      switch (this.dataType) {
        case "DOCUMENT":
          this.deleteDocument();
          break;
        case "SALARY":
          break;
        case "BENEFIT":
          this.deleteBenefit();
          break;
        default:
          console.error("Unknown data type for delete:", this.dataType);
      }
    });

    this.showDialog = false;
    this.dialogAction = "";
  }

  handleBack() {
    this.$router.push({
      name: "Employee",
    });
  }

  handleFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.currentForm.file = file;
      if (this.modalMode === $global.modeData.insert) {
        this.currentForm.file_name = file.name;
      }
    }
  }

  onComponentTypeChange() {
    this.currentForm.component = "";
    this.currentForm.payroll_component_id = null;
    this.currentForm.amount = 0;
    this.currentForm.qty = 1;
    this.currentForm.is_override = false;

    this.$forceUpdate();
  }

  onComponentChange() {
    const selectedComponent = this.selectedComponentData;

    if (selectedComponent) {
      this.currentForm.payroll_component_id = selectedComponent.id;
      this.currentForm.amount = selectedComponent.default_amount || 0;
      this.currentForm.qty = 1;
      this.currentForm.is_override = false;
    } else {
      this.currentForm.payroll_component_id = null;
      this.currentForm.amount = 0;
      this.currentForm.qty = 1;
      this.currentForm.is_override = false;
    }
  }

  onOverrideAmountChange() {
    if (!this.currentForm.is_override) {
      if (this.selectedComponentData) {
        this.currentForm.amount =
          this.selectedComponentData.default_amount || 0;
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.isSaving = false;
    this.currentForm = {};
  }

  refreshData(search: any) {
    // this.loadDataGrid();
  }

  // API REQUEST =======================================================
  async loadData() {
    // if (!this.employeeId) {
    //   this.$router.push({ name: "Employee" });
    //   return;
    // }

    try {
      await Promise.all([
        // this.loadPositionData(),
        // this.loadDepartmentData(),
        // this.loadPlacementData(),
      ]);
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.employeeListData = [
      {
        id: 1,
        employee_id: "EMP001",
        first_name: "John",
        last_name: "Doe",
        full_name: "John Doe",
        gender: "M",
        birth_date: "1985-05-15",
        address: "Jl. Raya Ubud No. 123, Ubud, Bali",
        phone: "+62812345678",
        email: "john.doe@amorahotel.com",
        hire_date: "2020-01-10",
        end_date: null,
        position: "P007",
        department: "D007",
        placement: "PL002",
        supervisor: "EMP005",
        employee_type: "Permanent",
        payment_frequency: "Monthly",
        daily_rate: 300000,
        base_salary: 9000000,
        status: true,
        tax_number: "123456789012345",
        identity_number: "1234567890",
        marital_status: "K2",
        health_insurance_number: "HI12345678",
        social_security_number: "SS12345678",
        bank_name: "BCA",
        bank_account_number: "1234567890",
        bank_account_name: "John Doe",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp001.jpg",
        created_at: formatDateTimeUTC(new Date(2020, 0, 10, 8, 0, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 6, 15, 14, 30, 0)),
        updated_by: "HR Manager",
      },
      {
        id: 2,
        employee_id: "EMP002",
        first_name: "Jane",
        last_name: "Smith",
        full_name: "Jane Smith",
        gender: "F",
        birth_date: "1990-08-22",
        address: "Jl. Sunset Road No. 45, Kuta, Bali",
        phone: "+62823456789",
        email: "jane.smith@amorahotel.com",
        hire_date: "2021-03-15",
        end_date: null,
        position: "P004",
        department: "D002",
        placement: "PL001",
        supervisor: "EMP003",
        employee_type: "Permanent",
        payment_frequency: "Monthly",
        daily_rate: 450000,
        base_salary: 13500000,
        status: true,
        tax_number: "234567890123456",
        identity_number: "2345678901",
        marital_status: "TK0",
        health_insurance_number: "HI23456789",
        social_security_number: "SS23456789",
        bank_name: "BNI",
        bank_account_number: "2345678901",
        bank_account_name: "Jane Smith",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp002.jpg",
        created_at: formatDateTimeUTC(new Date(2021, 2, 15, 9, 0, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 5, 22, 11, 45, 0)),
        updated_by: "HR Manager",
      },
      {
        id: 3,
        employee_id: "EMP003",
        first_name: "Robert",
        last_name: "Johnson",
        full_name: "Robert Johnson",
        gender: "M",
        birth_date: "1982-12-10",
        address: "Jl. Raya Kuta No. 78, Kuta, Bali",
        phone: "+62834567890",
        email: "robert.johnson@amorahotel.com",
        hire_date: "2019-06-20",
        end_date: null,
        position: "P003",
        department: "D003",
        placement: "PL001",
        supervisor: null,
        employee_type: "Permanent",
        payment_frequency: "Monthly",
        daily_rate: 600000,
        base_salary: 18000000,
        status: true,
        tax_number: "345678901234567",
        identity_number: "3456789012",
        marital_status: "K1",
        health_insurance_number: "HI34567890",
        social_security_number: "SS34567890",
        bank_name: "Mandiri",
        bank_account_number: "3456789012",
        bank_account_name: "Robert Johnson",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp003.jpg",
        created_at: formatDateTimeUTC(new Date(2019, 5, 20, 10, 0, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 4, 5, 9, 15, 0)),
        updated_by: "Operations Director",
      },
      {
        id: 4,
        employee_id: "EMP004",
        first_name: "Emily",
        last_name: "Davis",
        full_name: "Emily Davis",
        gender: "F",
        birth_date: "1988-04-30",
        address: "Jl. Legian No. 56, Kuta, Bali",
        phone: "+62845678901",
        email: "emily.davis@amorahotel.com",
        hire_date: "2022-01-05",
        end_date: null,
        position: "P017",
        department: "D004",
        placement: "PL002",
        supervisor: "EMP012",
        employee_type: "Contract",
        payment_frequency: "Monthly",
        daily_rate: 250000,
        base_salary: 7500000,
        status: true,
        tax_number: "456789012345678",
        identity_number: "4567890123",
        marital_status: "TK0",
        health_insurance_number: "HI45678901",
        social_security_number: "SS45678901",
        bank_name: "BRI",
        bank_account_number: "4567890123",
        bank_account_name: "Emily Davis",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp004.jpg",
        created_at: formatDateTimeUTC(new Date(2022, 0, 5, 8, 30, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 3, 12, 14, 0, 0)),
        updated_by: "HR Manager",
      },
      {
        id: 5,
        employee_id: "EMP005",
        first_name: "Michael",
        last_name: "Wilson",
        full_name: "Michael Wilson",
        gender: "M",
        birth_date: "1980-11-18",
        address: "Jl. Pantai Kuta No. 34, Kuta, Bali",
        phone: "+62856789012",
        email: "michael.wilson@amorahotel.com",
        hire_date: "2018-08-12",
        end_date: null,
        position: "P005",
        department: "D004",
        placement: "PL001",
        supervisor: null,
        employee_type: "Permanent",
        payment_frequency: "Monthly",
        daily_rate: 500000,
        base_salary: 15000000,
        status: true,
        tax_number: "567890123456789",
        identity_number: "5678901234",
        marital_status: "K3",
        health_insurance_number: "HI56789012",
        social_security_number: "SS56789012",
        bank_name: "CIMB Niaga",
        bank_account_number: "5678901234",
        bank_account_name: "Michael Wilson",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp005.jpg",
        created_at: formatDateTimeUTC(new Date(2018, 7, 12, 9, 0, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 2, 8, 10, 30, 0)),
        updated_by: "Operations Director",
      },
      {
        id: 6,
        employee_id: "EMP006",
        first_name: "Sarah",
        last_name: "Johnson",
        full_name: "Sarah Johnson",
        gender: "F",
        birth_date: "1992-07-25",
        address: "Jl. Raya Seminyak No. 67, Seminyak, Bali",
        phone: "+62867890123",
        email: "sarah.johnson@amorahotel.com",
        hire_date: "2020-10-03",
        end_date: null,
        position: "P011",
        department: "D002",
        placement: "PL002",
        supervisor: "EMP002",
        employee_type: "Permanent",
        payment_frequency: "Monthly",
        daily_rate: 350000,
        base_salary: 10500000,
        status: true,
        tax_number: "678901234567890",
        identity_number: "6789012345",
        marital_status: "K0",
        health_insurance_number: "HI67890123",
        social_security_number: "SS67890123",
        bank_name: "BCA",
        bank_account_number: "6789012345",
        bank_account_name: "Sarah Johnson",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp006.jpg",
        created_at: formatDateTimeUTC(new Date(2020, 9, 3, 8, 30, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 1, 20, 11, 0, 0)),
        updated_by: "HR Director",
      },
      {
        id: 7,
        employee_id: "EMP007",
        first_name: "James",
        last_name: "Carter",
        full_name: "James Carter",
        gender: "M",
        birth_date: "1987-09-14",
        address: "Jl. Double Six No. 23, Seminyak, Bali",
        phone: "+62878901234",
        email: "james.carter@amorahotel.com",
        hire_date: "2021-05-17",
        end_date: null,
        position: "P024",
        department: "D012",
        placement: "PL002",
        supervisor: "EMP011",
        employee_type: "Contract",
        payment_frequency: "Bi-Weekly",
        daily_rate: 200000,
        base_salary: 6000000,
        status: true,
        tax_number: "789012345678901",
        identity_number: "7890123456",
        marital_status: "TK0",
        health_insurance_number: "HI78901234",
        social_security_number: "SS78901234",
        bank_name: "BNI",
        bank_account_number: "7890123456",
        bank_account_name: "James Carter",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp007.jpg",
        created_at: formatDateTimeUTC(new Date(2021, 4, 17, 9, 15, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2023, 0, 30, 13, 45, 0)),
        updated_by: "HR Manager",
      },
      {
        id: 8,
        employee_id: "EMP008",
        first_name: "Jessica",
        last_name: "Walker",
        full_name: "Jessica Walker",
        gender: "F",
        birth_date: "1991-02-28",
        address: "Jl. Monkey Forest No. 55, Ubud, Bali",
        phone: "+62889012345",
        email: "jessica.walker@amorahotel.com",
        hire_date: "2019-11-12",
        end_date: null,
        position: "P009",
        department: "D009",
        placement: "PL001",
        supervisor: "EMP001",
        employee_type: "Permanent",
        payment_frequency: "Monthly",
        daily_rate: 300000,
        base_salary: 9000000,
        status: true,
        tax_number: "890123456789012",
        identity_number: "8901234567",
        marital_status: "K1",
        health_insurance_number: "HI89012345",
        social_security_number: "SS89012345",
        bank_name: "BCA",
        bank_account_number: "8901234567",
        bank_account_name: "Jessica Walker",
        payment_method: "Bank Transfer",
        profile_photo: "profile_photos/emp008.jpg",
        created_at: formatDateTimeUTC(new Date(2019, 10, 12, 8, 0, 0)),
        created_by: "Admin System",
        updated_at: formatDateTimeUTC(new Date(2022, 11, 15, 10, 20, 0)),
        updated_by: "Operations Manager",
      },
    ];

    this.salaryListData = [
      {
        id: 1,
        employee_id: "EMP001",
        base_salary: 8000000,
        adjustment_reason: "INITIAL",
        effective_date: "2020-01-10",
        end_date: "2021-01-31",
        is_current: false,
        remark: "Initial salary",
        created_at: "2020-01-10 08:00:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 08:00:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        employee_id: "EMP001",
        base_salary: 8500000,
        adjustment_reason: "ANNUAL_REVIEW",
        effective_date: "2021-02-01",
        end_date: "2022-01-31",
        is_current: false,
        remark: "Annual adjustment",
        created_at: "2021-01-25 09:30:00",
        created_by: "HR Manager",
        updated_at: "2021-01-25 09:30:00",
        updated_by: "HR Manager",
      },
      {
        id: 3,
        employee_id: "EMP001",
        base_salary: 9000000,
        adjustment_reason: "PERFORMANCE",
        effective_date: "2022-02-01",
        end_date: null,
        is_current: true,
        remark: "Performance increase",
        created_at: "2022-01-20 10:15:00",
        created_by: "HR Manager",
        updated_at: "2022-01-20 10:15:00",
        updated_by: "HR Manager",
      },
      {
        id: 4,
        employee_id: "EMP002",
        base_salary: 12000000,
        adjustment_reason: "INITIAL",
        effective_date: "2021-03-15",
        end_date: "2022-03-31",
        is_current: false,
        remark: "Initial salary",
        created_at: "2021-03-15 09:00:00",
        created_by: "Admin System",
        updated_at: "2021-03-15 09:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        employee_id: "EMP002",
        base_salary: 13500000,
        adjustment_reason: "PROMOTION",
        effective_date: "2022-04-01",
        end_date: null,
        is_current: true,
        remark: "Promotion to HR Director",
        created_at: "2022-03-25 11:30:00",
        created_by: "Operations Director",
        updated_at: "2022-03-25 11:30:00",
        updated_by: "Operations Director",
      },
    ];

    this.documentsListData = [
      {
        id: 1,
        employee_id: "EMP001",
        document_type: "KTP",
        file_name: "john_doe_id_card.pdf",
        file_path: "documents/employee/EMP001/john_doe_id_card.pdf",
        file_type: "application/pdf",
        file_size: 1024000,
        issue_date: "2019-05-15",
        expiry_date: "2024-05-15",
        remark: "National ID Card",
        status: "Valid",
        created_at: "2020-01-10 08:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 08:30:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        employee_id: "EMP001",
        document_type: "NPWP",
        file_name: "john_doe_tax_id.pdf",
        file_path: "documents/employee/EMP001/john_doe_tax_id.pdf",
        file_type: "application/pdf",
        file_size: 850000,
        issue_date: "2018-03-20",
        expiry_date: null,
        remark: "Tax registration document",
        status: "Valid",
        created_at: "2020-01-10 08:45:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 08:45:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        employee_id: "EMP001",
        document_type: "CV",
        file_name: "john_doe_cv.pdf",
        file_path: "documents/employee/EMP001/john_doe_cv.pdf",
        file_type: "application/pdf",
        file_size: 1200000,
        issue_date: "2019-12-15",
        expiry_date: null,
        remark: "Latest CV",
        status: "Valid",
        created_at: "2020-01-10 09:00:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 09:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        employee_id: "EMP002",
        document_type: "KTP",
        file_name: "jane_smith_id_card.pdf",
        file_path: "documents/employee/EMP002/jane_smith_id_card.pdf",
        file_type: "application/pdf",
        file_size: 980000,
        issue_date: "2020-08-22",
        expiry_date: "2025-08-22",
        remark: "National ID Card",
        status: "Valid",
        created_at: "2021-03-15 09:30:00",
        created_by: "Admin System",
        updated_at: "2021-03-15 09:30:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        employee_id: "EMP002",
        document_type: "PASSPORT",
        file_name: "jane_smith_passport.pdf",
        file_path: "documents/employee/EMP002/jane_smith_passport.pdf",
        file_type: "application/pdf",
        file_size: 1500000,
        issue_date: "2019-05-10",
        expiry_date: "2029-05-10",
        remark: "International passport",
        status: "Valid",
        created_at: "2021-03-15 09:45:00",
        created_by: "Admin System",
        updated_at: "2021-03-15 09:45:00",
        updated_by: "Admin System",
      },
    ];

    this.benefitsListData = [
      {
        id: 1,
        employee_id: "EMP001",
        component_type: "EARNINGS",
        payroll_component_code: "CE001",
        payroll_component_name: "Tunjangan Transportasi",
        category: "Variable Allowance",
        amount: 200000,
        qty: 1,
        effective_date: "2020-01-10",
        end_date: null,
        remark: "Monthly transportation allowance",
        is_current: true,
        is_override: false,
        is_taxable: true,
        is_fixed: false,
        is_prorated: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_show_in_payslip: false,
        created_at: "2020-01-10 10:15:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:15:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        employee_id: "EMP001",
        payroll_component_code: "CE002",
        payroll_component_name: "Tunjangan Rumah",
        component_type: "EARNINGS",
        category: "Fix Allowance",
        amount: 600000,
        qty: 1,
        effective_date: "2020-01-10",
        remark: "Housing allowance with custom amount",
        end_date: null,
        is_current: true,
        is_override: true,
        is_taxable: true,
        is_fixed: false,
        is_prorated: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_show_in_payslip: false,
        created_at: "2020-01-10 10:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:30:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        employee_id: "EMP001",
        payroll_component_code: "CE003",
        payroll_component_name: "Tunjangan Makan",
        component_type: "EARNINGS",
        category: "Fixed Allowance",
        amount: 300000,
        qty: 1,
        effective_date: "2020-01-10",
        end_date: "2021-12-31",
        remark: "Meal allowance - fixed component",
        is_current: true,
        is_override: false,
        is_taxable: true,
        is_fixed: false,
        is_prorated: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_show_in_payslip: false,
        created_at: "2020-01-10 10:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:30:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        employee_id: "EMP001",
        payroll_component: "DE001",
        payroll_component_name: "Biaya Jabatan",
        component_type: "DEDUCTIONS",
        category: "Fix Deduction",
        amount: 100000,
        qty: 1,
        effective_date: "2020-01-10",
        end_date: null,
        remark: "Position fee",
        is_current: true,
        is_override: false,
        is_taxable: false,
        is_fixed: true,
        is_prorated: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_show_in_payslip: false,
        created_at: "2020-01-10 10:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:30:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        employee_id: "EMP002",
        payroll_component: "CE001",
        payroll_component_name: "Tunjangan Transportasi",
        component_type: "EARNINGS",
        category: "Variable Allowance",
        amount: 250000,
        qty: 1,
        effective_date: "2021-03-15",
        remark: "Transportation allowance with custom amount",
        end_date: null,
        is_current: true,
        is_override: true,
        is_taxable: true,
        is_fixed: false,
        is_prorated: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_show_in_payslip: false,
        created_at: "2020-01-10 10:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:30:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        employee_id: "EMP002",
        payroll_component_code: "CE005",
        payroll_component_name: "Bonus Performance",
        component_type: "EARNINGS",
        category: "Incentive",
        amount: 1500000,
        qty: 1,
        effective_date: "2021-12-15",
        end_date: "2021-12-31",
        remark: "End of year performance bonus with custom amount",
        is_current: false,
        is_override: true,
        is_taxable: true,
        is_fixed: false,
        is_prorated: false,
        is_included_in_bpjs_health: false,
        is_included_in_bpjs_employee: false,
        is_show_in_payslip: false,
        created_at: "2020-01-10 10:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:30:00",
        updated_by: "Admin System",
      },
    ];
  }

  async loadDataGrid(type: any = this.dataType) {
    try {
      switch (type) {
        case "DOCUMENT":
          if (this.documentTableRef) {
            this.documentTableRef.refreshGrid();
          }
          break;
        case "SALARY":
          if (this.salaryTableRef) {
            this.salaryTableRef.refreshGrid();
          }
          break;
        case "BENEFIT":
          if (this.benefitTableRef) {
            this.benefitTableRef.refreshGrid();
          }
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      // Employee form options
      this.employeeTypeOptions = [
        { code: "Permanent", name: "Permanent", SubGroupName: "Employee Type" },
        { code: "Contract", name: "Contract", SubGroupName: "Employee Type" },
        { code: "Part-time", name: "Part-time", SubGroupName: "Employee Type" },
        { code: "Seasonal", name: "Seasonal", SubGroupName: "Employee Type" },
        { code: "Casual", name: "Casual", SubGroupName: "Employee Type" },
        { code: "Intern", name: "Intern", SubGroupName: "Employee Type" },
        {
          code: "Freelancer",
          name: "Freelancer",
          SubGroupName: "Employee Type",
        },
        {
          code: "Contractor",
          name: "Contractor",
          SubGroupName: "Employee Type",
        },
        {
          code: "Consultant",
          name: "Consultant",
          SubGroupName: "Employee Type",
        },
        { code: "Vendor", name: "Vendor", SubGroupName: "Employee Type" },
        { code: "Resigned", name: "Resigned", SubGroupName: "Employee Type" },
        { code: "Retired", name: "Retired", SubGroupName: "Employee Type" },
        {
          code: "Terminated",
          name: "Terminated",
          SubGroupName: "Employee Type",
        },
      ];

      this.genderOptions = [
        { code: "M", name: "Male", SubGroupName: "Gender" },
        { code: "F", name: "Female", SubGroupName: "Gender" },
      ];

      this.paymentFrequencyOptions = [
        { code: "Daily", name: "Daily", SubGroupName: "Payment Frequency" },
        { code: "Weekly", name: "Weekly", SubGroupName: "Payment Frequency" },
        {
          code: "BiWeekly",
          name: "Bi-Weekly",
          SubGroupName: "Payment Frequency",
        },
        { code: "Monthly", name: "Monthly", SubGroupName: "Payment Frequency" },
      ];

      this.maritalStatusOptions = [
        {
          code: "TK0",
          name: "TK0 - Single, no dependent",
          SubGroupName: "Marital Status",
        },
        {
          code: "TK1",
          name: "TK1 - Single, 1 dependent",
          SubGroupName: "Marital Status",
        },
        {
          code: "TK2",
          name: "TK2 - Single, 2 dependents",
          SubGroupName: "Marital Status",
        },
        {
          code: "TK3",
          name: "TK3 - Single, 3 dependents",
          SubGroupName: "Marital Status",
        },
        {
          code: "K0",
          name: "K0 - Married, no dependent",
          SubGroupName: "Marital Status",
        },
        {
          code: "K1",
          name: "K1 - Married, 1 dependent",
          SubGroupName: "Marital Status",
        },
        {
          code: "K2",
          name: "K2 - Married, 2 dependents",
          SubGroupName: "Marital Status",
        },
        {
          code: "K3",
          name: "K3 - Married, 3 dependents",
          SubGroupName: "Marital Status",
        },
        {
          code: "KI0",
          name: "KI0 - Married (combined income), no dependent",
          SubGroupName: "Marital Status",
        },
        {
          code: "KI1",
          name: "KI1 - Married (combined income), 1 dependent",
          SubGroupName: "Marital Status",
        },
        {
          code: "KI2",
          name: "KI2 - Married (combined income), 2 dependents",
          SubGroupName: "Marital Status",
        },
        {
          code: "KI3",
          name: "KI3 - Married (combined income), 3 dependents",
          SubGroupName: "Marital Status",
        },
      ];

      this.paymentMethodOptions = [
        { code: "Cash", name: "Cash", SubGroupName: "Payment Method" },
        {
          code: "Transfer",
          name: "Bank Transfer",
          SubGroupName: "Payment Method",
        },
        {
          code: "E-wallet",
          name: "E-wallet Transfer",
          SubGroupName: "Payment Method",
        },
        {
          code: "Virtual Account",
          name: "Virtual Account",
          SubGroupName: "Payment Method",
        },
      ];

      this.bankOptions = [
        { code: "BCA", name: "Bank Central Asia (BCA)", SubGroupName: "Bank" },
        {
          code: "BNI",
          name: "Bank Negara Indonesia (BNI)",
          SubGroupName: "Bank",
        },
        {
          code: "BRI",
          name: "Bank Rakyat Indonesia (BRI)",
          SubGroupName: "Bank",
        },
        { code: "Mandiri", name: "Bank Mandiri", SubGroupName: "Bank" },
        { code: "CIMB Niaga", name: "CIMB Niaga", SubGroupName: "Bank" },
        { code: "Danamon", name: "Bank Danamon", SubGroupName: "Bank" },
        { code: "Permata", name: "Bank Permata", SubGroupName: "Bank" },
        {
          code: "BTN",
          name: "Bank Tabungan Negara (BTN)",
          SubGroupName: "Bank",
        },
        { code: "Maybank", name: "Maybank Indonesia", SubGroupName: "Bank" },
        { code: "OCBC NISP", name: "OCBC NISP", SubGroupName: "Bank" },
        { code: "Panin Bank", name: "Panin Bank", SubGroupName: "Bank" },
        { code: "BTPN", name: "Bank BTPN", SubGroupName: "Bank" },
      ];

      this.departmentOptions = [
        { code: "D001", name: "Executive", SubGroupName: "Department" },
        { code: "D002", name: "Human Resources", SubGroupName: "Department" },
        { code: "D003", name: "Finance", SubGroupName: "Department" },
        {
          code: "D004",
          name: "Information Technology",
          SubGroupName: "Department",
        },
        { code: "D005", name: "Marketing", SubGroupName: "Department" },
        { code: "D006", name: "Sales", SubGroupName: "Department" },
        { code: "D007", name: "Operations", SubGroupName: "Department" },
        { code: "D008", name: "Front Office", SubGroupName: "Department" },
        { code: "D009", name: "Housekeeping", SubGroupName: "Department" },
        { code: "D010", name: "Food & Beverage", SubGroupName: "Department" },
        { code: "D011", name: "Engineering", SubGroupName: "Department" },
        { code: "D012", name: "Security", SubGroupName: "Department" },
        { code: "D013", name: "Spa & Wellness", SubGroupName: "Department" },
        {
          code: "D014",
          name: "Events & Conferences",
          SubGroupName: "Department",
        },
        {
          code: "D015",
          name: "Training & Development",
          SubGroupName: "Department",
        },
      ];

      this.positionOptions = [
        {
          code: "P001",
          name: "Chief Executive Officer",
          SubGroupName: "Position",
        },
        {
          code: "P002",
          name: "Chief Operating Officer",
          SubGroupName: "Position",
        },
        {
          code: "P003",
          name: "Chief Financial Officer",
          SubGroupName: "Position",
        },
        { code: "P004", name: "HR Director", SubGroupName: "Position" },
        { code: "P005", name: "IT Director", SubGroupName: "Position" },
        { code: "P006", name: "Marketing Director", SubGroupName: "Position" },
        { code: "P007", name: "Operations Manager", SubGroupName: "Position" },
        {
          code: "P008",
          name: "Front Office Manager",
          SubGroupName: "Position",
        },
        {
          code: "P009",
          name: "Housekeeping Manager",
          SubGroupName: "Position",
        },
        { code: "P010", name: "Executive Chef", SubGroupName: "Position" },
        { code: "P011", name: "HR Manager", SubGroupName: "Position" },
        { code: "P012", name: "IT Manager", SubGroupName: "Position" },
        { code: "P013", name: "Accounting Manager", SubGroupName: "Position" },
        {
          code: "P014",
          name: "Front Desk Supervisor",
          SubGroupName: "Position",
        },
        { code: "P015", name: "Restaurant Manager", SubGroupName: "Position" },
        { code: "P016", name: "HR Specialist", SubGroupName: "Position" },
        {
          code: "P017",
          name: "IT Support Specialist",
          SubGroupName: "Position",
        },
        { code: "P018", name: "Accountant", SubGroupName: "Position" },
        { code: "P019", name: "Front Desk Agent", SubGroupName: "Position" },
        { code: "P020", name: "Server", SubGroupName: "Position" },
        { code: "P021", name: "Housekeeper", SubGroupName: "Position" },
        {
          code: "P022",
          name: "Marketing Coordinator",
          SubGroupName: "Position",
        },
        { code: "P023", name: "Sales Executive", SubGroupName: "Position" },
        { code: "P024", name: "Security Officer", SubGroupName: "Position" },
        {
          code: "P025",
          name: "Maintenance Technician",
          SubGroupName: "Position",
        },
      ];

      this.placementOptions = [
        { code: "PL001", name: "Amora Ubud", SubGroupName: "Placement" },
        { code: "PL002", name: "Amora Canggu", SubGroupName: "Placement" },
        { code: "PL003", name: "Amora Seminyak", SubGroupName: "Placement" },
        { code: "PL004", name: "Amora Nusa Dua", SubGroupName: "Placement" },
        { code: "PL005", name: "Amora Jakarta", SubGroupName: "Placement" },
        { code: "PL006", name: "Amora Yogyakarta", SubGroupName: "Placement" },
        { code: "PL007", name: "Amora Bandung", SubGroupName: "Placement" },
        { code: "PL008", name: "Amora Surabaya", SubGroupName: "Placement" },
        { code: "PL009", name: "Amora Makassar", SubGroupName: "Placement" },
        { code: "PL010", name: "Amora Singapore", SubGroupName: "Placement" },
      ];

      // Document types
      this.documentTypeOptions = [
        { code: "KTP", name: "KTP" },
        { code: "PASSPORT", name: "Passport" },
        { code: "NPWP", name: "NPWP" },
        { code: "CERTIFICATE", name: "Certificate" },
        { code: "CV", name: "CV" },
      ];

      // Salary adjustment reasons
      this.adjustmentReasonOptions = [
        { code: "INITIAL", name: "Initial Salary" },
        { code: "PROMOTION", name: "Promotion" },
        { code: "ANNUAL_REVIEW", name: "Annual Review" },
        { code: "PERFORMANCE", name: "Performance Based" },
        { code: "MARKET_ADJUSTMENT", name: "Market Adjustment" },
      ];

      // Component types untuk benefit
      this.componentTypeOptions = [
        { code: "EARNINGS", name: "Earnings" },
        { code: "DEDUCTIONS", name: "Deductions" },
      ];

      this.earningsComponentOptions = [
        {
          id: 1,
          code: "CE001",
          name: "Tunjangan Transportasi",
          type: "EARNINGS",
          category: "Variable Allowance",
          default_amount: 200000,
          unit: "Per Bulan",
          description: "Tunjangan transportasi bulanan untuk karyawan",
          is_taxable: true,
          is_fixed: false,
        },
        {
          id: 2,
          code: "CE002",
          name: "Tunjangan Rumah",
          type: "EARNINGS",
          category: "Fix Allowance",
          default_amount: 500000,
          unit: "Per Bulan",
          description: "Tunjangan perumahan untuk karyawan",
          is_taxable: true,
          is_fixed: false,
        },
        {
          id: 3,
          code: "CE003",
          name: "Tunjangan Makan",
          type: "EARNINGS",
          category: "Fixed Allowance",
          default_amount: 300000,
          unit: "Per Bulan",
          description: "Tunjangan makan dan konsumsi - fixed amount",
          is_taxable: true,
          is_fixed: true,
        },
        {
          id: 4,
          code: "CE004",
          name: "Tunjangan Fasilitas",
          type: "EARNINGS",
          category: "Fix Allowance",
          default_amount: 750000,
          unit: "Per Bulan",
          description: "Tunjangan fasilitas kantor dan operasional",
          is_taxable: true,
          is_fixed: false,
        },
        {
          id: 5,
          code: "CE005",
          name: "Bonus Performance",
          type: "EARNINGS",
          category: "Incentive",
          default_amount: 1000000,
          unit: "Per Kejadian",
          description: "Bonus berdasarkan performance karyawan",
          is_taxable: true,
          is_fixed: false,
        },
        {
          id: 6,
          code: "CE006",
          name: "Uang Lembur",
          type: "EARNINGS",
          category: "Incentive",
          default_amount: 50000,
          unit: "Per Jam",
          description: "Kompensasi untuk jam kerja lembur",
          is_taxable: true,
          is_fixed: true,
        },
      ];

      this.deductionsComponentOptions = [
        {
          id: 10,
          code: "DE001",
          name: "Biaya Jabatan",
          type: "DEDUCTIONS",
          category: "Fix Deduction",
          default_amount: 100000,
          unit: "Per Bulan",
          description: "Potongan biaya jabatan sesuai regulasi",
          is_taxable: false,
          is_fixed: true,
        },
        {
          id: 11,
          code: "DE002",
          name: "Unpaid Leave",
          type: "DEDUCTIONS",
          category: "Variable Deduction",
          default_amount: 150000,
          unit: "Per Hari",
          description: "Potongan untuk cuti tanpa gaji",
          is_taxable: false,
          is_fixed: false,
        },
        {
          id: 12,
          code: "DE003",
          name: "Cicilan Kasbon",
          type: "DEDUCTIONS",
          category: "Kasbon",
          default_amount: 250000,
          unit: "Per Bulan",
          description: "Cicilan pembayaran kasbon karyawan",
          is_taxable: false,
          is_fixed: false,
        },
        {
          id: 13,
          code: "DE004",
          name: "Late Arrival",
          type: "DEDUCTIONS",
          category: "Variable Deduction",
          default_amount: 25000,
          unit: "Per Kejadian",
          description: "Potongan untuk keterlambatan masuk kerja",
          is_taxable: false,
          is_fixed: true,
        },
        {
          id: 14,
          code: "DE005",
          name: "Iuran Keagamaan",
          type: "DEDUCTIONS",
          category: "Fix Deduction",
          default_amount: 50000,
          unit: "Per Bulan",
          description: "Iuran untuk kegiatan keagamaan",
          is_taxable: false,
          is_fixed: false,
        },
      ];

      // Gabungan semua benefit options (untuk filtering)
      this.benefitOptions = [
        ...this.earningsComponentOptions,
        ...this.deductionsComponentOptions,
      ];
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(params: any) {
    try {
      /*
      const { data } = await employeeAPI.GetEmployee(params.id);
      this.populateForm(data);
      */

      // for demo

      if (this.employeeData) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(this.employeeData);
          console.log(
            "inputFormElement di loadEditData",
            this.inputFormElement
          );
        });
      } else {
        getToastError(this.$t("messages.employee.error.notFound"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEmployeeData() {
    try {
      // for real implementation
      // const { data } = await employeeAPI.GetEmployee(this.employeeId);
      // this.employeeData = data;
      // await Promise.all([
      //   this.loadSalaryHistory(),
      //   this.loadDocuments(),
      //   this.loadPayrollComponents()
      // ]);

      // for demo
      const employee = this.employeeListData.find(
        (emp: any) => emp.employee_id === this.employeeId
      );
      if (employee) {
        this.employeeData = employee;
        this.rowDocumentData = this.documentsListData.filter(
          (d: any) => d.employee_id === this.employeeId
        );
        this.rowSalaryData = this.salaryListData.filter(
          (s: any) => s.employee_id === this.employeeId
        );

        this.rowBenefitData = this.benefitsListData.filter(
          (p: any) => p.employee_id === this.employeeId
        );
        console.log("rowBenefitData", this.rowBenefitData);
      } else {
        this.$router.push({ name: "Employee" });
        getToastError(this.$t("messages.employee.error.notFound"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadSalaryHistory() {
    try {
      // For real implementation
      // const { data } = await employeeAPI.GetEmployeeSalaryHistory(this.employeeId);
      // this.salaryHistory = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadDocumentData() {
    try {
      // For real implementation
      // const { data } = await employeeAPI.GetEmployeeDocumentList(this.employeeId);
      // this.documents = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadPayrollComponents() {
    try {
      // For real implementation
      // const { data } = await employeeAPI.GetEmployeePayrollComponentList(this.employeeId);
      // this.payrollComponents = data;
      // For mock implementation - already loadned in loadEmployeeData
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      /*
      const { status2 } = await employeeAPI.UpdateEmployee(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
      */

      // for demo
      this.employeeData = {
        ...this.employeeData,
        ...formData,
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      if (formData.first_name || formData.last_name) {
        this.employeeData.full_name = `${
          formData.first_name || this.employeeData.first_name
        } ${formData.last_name || this.employeeData.last_name}`;
      }

      await this.$nextTick;
      getToastSuccess(this.$t("messages.employee.success.update"));
    } catch (error) {
      getError(error);
      return false;
    }
  }

  async insertModalData(formData: any) {
    try {
      formData.id = this.generateUniqueId(this.dataType);
      switch (this.dataType) {
        case "DOCUMENT":
          const newDocument = {
            id: formData.id,
            employee_id: this.employeeId,
            document_type: formData.document_type,
            file_name: formData.file
              ? formData.file.name
              : `document_${formData.id}.pdf`,
            file_path: formData.file
              ? `/uploads/${formData.file.name}`
              : `/uploads/document_${formData.id}.pdf`,
            file_type: formData.file ? formData.file.type : "application/pdf",
            file_size: formData.file ? formData.file.size : 1024000,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date,
            remark: formData.remark,
            status: this.calculateDocumentStatus(formData.expiry_date),
            created_at: formatDateTimeUTC(new Date()),
            created_by: "Current User",
            updated_at: formatDateTimeUTC(new Date()),
            updated_by: "Current User",
          };

          this.rowDocumentData.push(newDocument);

          getToastSuccess(this.$t("messages.employee.success.saveDocument"));
          break;
        case "SALARY":
          this.rowSalaryData.forEach((item: any) => {
            if (item.is_current) {
              item.is_current = false;
              item.end_date = formData.effective_date;
            }
          });

          const newSalary = {
            id: formData.id,
            employee_id: this.employeeId,
            adjustment_reason: formData.adjustment_reason,
            base_salary: parseFloat(formData.base_salary),
            effective_date: formData.effective_date,
            end_date: "",
            is_current: true,
            remark:
              formData.remark ||
              `Salary adjustment: ${formData.adjustment_reason}`,
            created_at: formatDateTimeUTC(new Date()),
            created_by: "Current User",
            updated_at: formatDateTimeUTC(new Date()),
            updated_by: "Current User",
          };

          this.rowSalaryData.push(newSalary);
          getToastSuccess(this.$t("messages.employee.success.saveSalary"));
          break;
        case "BENEFIT":
          const selectedComponent = this.benefitOptions.find(
            (option: any) => option.code === formData.component
          );
          const finalAmount = formData.is_override
            ? parseFloat(formData.amount)
            : selectedComponent.default_amount;
          const newBenefit = {
            id: formData.id,
            employee_id: this.employeeId,
            payroll_component_code: selectedComponent.code,
            payroll_component_name: selectedComponent.name,
            component_type: formData.component_type,
            category: selectedComponent.category,
            amount: finalAmount,
            qty: parseInt(formData.qty),
            effective_date: formData.effective_date,
            end_date: formData.end_date,
            remark: formData.remark,
            is_current:
              !formData.end_date || new Date(formData.end_date) > new Date(),
            is_override: formData.is_override,
            is_taxable: selectedComponent.is_taxable,
            is_fixed: selectedComponent.is_fixed,
            is_prorated: selectedComponent.is_prorated,
            is_included_in_bpjs_health:
              selectedComponent.is_included_in_bpjs_health,
            is_included_in_bpjs_employee:
              selectedComponent.is_included_in_bpjs_employee,
            is_show_in_payslip: selectedComponent.is_show_in_payslip,
            created_at: formatDateTimeUTC(new Date()),
            created_by: "Current User",
            updated_at: formatDateTimeUTC(new Date()),
            updated_by: "Current User",
          };

          this.rowBenefitData.push(newBenefit);
          getToastSuccess(this.$t("messages.employee.success.saveBenefit"));
          break;
      }
      await this.$nextTick();
      this.loadDataGrid();
      this.closeModal();
    } catch (error) {
      getError(error);
    }
  }

  async updateModalData(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async deleteModalData() {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async insertDocument(formData: any) {
    try {
      this.isSaving = true;

      if (
        !formData.document_type ||
        !formData.issue_date ||
        !formData.file_name
      ) {
        getToastError(this.$t("messages.employee.error.fillRequired"));
        this.isSaving = false;
        return;
      }

      // const formData = new FormData();
      // const formDataToSend = new FormData();
      // formDataToSend.append('employeeId', this.employeeId);
      // formDataToSend.append('documentType', formData.document_type);
      // formDataToSend.append('issueDate', formData.issue_date);
      // formDataToSend.append('expiryDate', formData.expiry_date || '');
      // formDataToSend.append('remark', formData.remark || '');
      // if (formData.file) {
      //   formDataToSend.append('file', formData.file);
      // }

      // const { status2 } = await employeeAPI.InsertEmployeeDocument(formDataToSend);

      // Mock implementation
      const newId =
        Math.max(...this.rowDocumentData.map((doc: any) => doc.id || 0), 0) + 1;
      const newDocument = {
        id: newId,
        employee_id: this.employeeId,
        document_type: formData.document_type,
        file_name: formData.file ? formData.file.name : `document_${newId}.pdf`,
        file_path: formData.file
          ? `/uploads/${formData.file.name}`
          : `/uploads/document_${newId}.pdf`,
        file_type: formData.file ? formData.file.type : "application/pdf",
        file_size: formData.file ? formData.file.size : 1024000,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
        remark: formData.remark,
        status: this.calculateDocumentStatus(formData.expiry_date),
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowDocumentData.push(newDocument);

      await this.$nextTick();
      if (
        this.documentTableRef &&
        typeof this.documentTableRef.refreshGrid === "function"
      ) {
        this.documentTableRef.refreshGrid();
      }
      this.closeModal();
      getToastSuccess(this.$t("messages.employee.success.saveDocument"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateDocument(formData: any) {
    try {
      this.isSaving = true;

      if (!formData.document_type || !formData.issue_date) {
        getToastError(this.$t("messages.employee.error.fillRequired"));
        this.isSaving = false;
        return;
      }

      // For real implementation with API
      // const formDataToSend = new FormData();
      // formDataToSend.append('employeeId', this.employeeId);
      // formDataToSend.append('documentType', formData.document_type);
      // formDataToSend.append('issueDate', formData.issue_date);
      // formDataToSend.append('expiryDate', formData.expiry_date || '');
      // formDataToSend.append('remark', formData.remark || '');
      // if (formData.file) {
      //   formDataToSend.append('file', formData.file);
      // }

      // const { status2 } = await employeeAPI.UpdateEmployeeDocument(formDataToSend);

      // Mock implementation
      const index = this.rowDocumentData.findIndex(
        (item: any) => item.id === formData.id
      );
      if (index !== -1) {
        this.rowDocumentData[index] = {
          ...this.rowDocumentData[index],
          document_type: formData.document_type,
          file_name: formData.file
            ? formData.file.name
            : this.rowDocumentData[index].file_name,
          file_path: formData.file
            ? `/uploads/${formData.file.name}`
            : this.rowDocumentData[index].file_path,
          file_type: formData.file
            ? formData.file.type
            : this.rowDocumentData[index].file_type,
          file_size: formData.file
            ? formData.file.size
            : this.rowDocumentData[index].file_size,
          issue_date: formData.issue_date,
          expiry_date: formData.expiry_date || null,
          remark: formData.remark || "",
          status: this.calculateDocumentStatus(formData.expiry_date),
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      await this.$nextTick();
      if (
        this.documentTableRef &&
        typeof this.documentTableRef.refreshGrid === "function"
      ) {
        this.documentTableRef.refreshGrid();
      }
      this.closeModal();
      getToastSuccess(this.$t("messages.employee.success.updateDocument"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteDocument() {
    try {
      // const { status2 } = await employeeAPI.DeleteEmployeeDocument(this.deleteParam.id);

      const updatedDocument = this.rowDocumentData.filter(
        (document: any) => document.id !== this.deleteParam.id
      );

      this.rowDocumentData = [...updatedDocument];

      this.deleteParam = null;

      await this.$nextTick();
      if (
        this.documentTableRef &&
        typeof this.documentTableRef.refreshGrid === "function"
      ) {
        this.documentTableRef.refreshGrid();
      }

      getToastSuccess(this.$t("messages.employee.success.deleteDocument"));
    } catch (error) {
      getError(error);
    }
  }

  async insertSalary(formData: any) {
    try {
      this.isSaving = true;

      if (
        !formData.base_salary ||
        !formData.effective_date ||
        !formData.adjustment_reason
      ) {
        getToastError(this.$t("messages.employee.error.fillRequired"));
        this.isSaving = false;
        return;
      }

      // const { status2 } = await employeeAPI.InsertEmployeeSalary(formData);

      // Mock implementation
      // First, update all existing salaries to not be current
      this.rowSalaryData.forEach((item: any) => {
        if (item.is_current) {
          item.is_current = false;
          item.end_date = formData.effective_date;
        }
      });

      const newId =
        Math.max(
          ...this.rowSalaryData.map((salary: any) => salary.id || 0),
          0
        ) + 1;
      const newSalary = {
        id: newId,
        employee_id: this.employeeId,
        adjustment_reason: formData.adjustment_reason,
        base_salary: parseFloat(formData.base_salary),
        effective_date: formData.effective_date,
        end_date: "",
        is_current: true,
        remark:
          formData.remark || `Salary adjustment: ${formData.adjustment_reason}`,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowSalaryData.push(newSalary);

      await this.$nextTick();
      if (
        this.salaryTableRef &&
        typeof this.salaryTableRef.refreshGrid === "function"
      ) {
        this.salaryTableRef.refreshGrid();
      }
      this.closeModal();
      getToastSuccess(this.$t("messages.employee.success.saveSalary"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateSalary(formData: any) {
    try {
      this.isSaving = true;

      const index = this.rowSalaryData.findIndex(
        (item: any) => item.id === formData.id
      );

      if (index !== -1) {
        this.rowSalaryData[index] = {
          ...this.rowSalaryData[index],
          remark: formData.remark,
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };

        await this.$nextTick();
        if (
          this.salaryTableRef &&
          typeof this.salaryTableRef.refreshGrid === "function"
        ) {
          this.salaryTableRef.refreshGrid();
        }
        this.closeModal();
        getToastSuccess(this.$t("messages.employee.success.updateSalary"));
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async insertBenefit(formData: any) {
    try {
      this.isSaving = true;

      if (
        !formData.component_type ||
        !formData.component ||
        !formData.payroll_component_id ||
        !formData.effective_date
      ) {
        getToastError(this.$t("messages.employee.error.fillRequired"));
        this.isSaving = false;
        return;
      }

      if (parseInt(formData.qty) <= 0) {
        getToastError("Quantity harus lebih dari 0");
        this.isSaving = false;
        return;
      }

      if (formData.is_override && parseFloat(formData.amount) <= 0) {
        getToastError("Amount harus lebih dari 0");
        this.isSaving = false;
        return;
      }

      // const { status2 } = await employeeAPI.InsertEmployeeBenefit(formData);

      const selectedComponent = this.benefitOptions.find(
        (option: any) => option.code === formData.component
      );

      console.log("selectedComponent", selectedComponent);

      if (!selectedComponent) {
        getToastError(this.$t("messages.employee.error.componentNotFound"));
        this.isSaving = false;
        return;
      }

      const finalAmount = formData.is_override
        ? parseFloat(formData.amount)
        : selectedComponent.default_amount;

      const newId =
        Math.max(
          ...this.rowBenefitData.map((benefit: any) => benefit.id || 0),
          0
        ) + 1;

      const newBenefit = {
        id: newId,
        employee_id: this.employeeId,
        payroll_component_id: selectedComponent.id,
        component_type: formData.component_type,

        payroll_component: formData.component,
        payroll_component_name: selectedComponent.name,

        amount: finalAmount,
        qty: parseInt(formData.qty),
        effective_date: formData.effective_date,
        end_date: formData.end_date || null,
        remark: formData.remark || "",

        is_current:
          !formData.end_date || new Date(formData.end_date) > new Date(),
        is_override: formData.is_override,
        default_amount: selectedComponent.default_amount,
        unit: selectedComponent.unit || "Per Bulan",
        category: selectedComponent.category,
        is_taxable: selectedComponent.is_taxable,
        is_fixed: selectedComponent.is_fixed,

        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowBenefitData.push(newBenefit);

      await this.$nextTick();
      if (
        this.benefitTableRef &&
        typeof this.benefitTableRef.refreshGrid === "function"
      ) {
        this.benefitTableRef.refreshGrid();
      }
      this.closeModal();
      getToastSuccess(this.$t("messages.employee.success.saveBenefit"));
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateBenefit(formData: any) {
    try {
      this.isSaving = true;

      if (
        !formData.component_type ||
        !formData.component ||
        !formData.payroll_component_id ||
        !formData.effective_date
      ) {
        getToastError(this.$t("messages.employee.error.fillRequired"));
        this.isSaving = false;
        return;
      }

      // Validasi qty harus lebih dari 0
      if (parseInt(formData.qty) <= 0) {
        getToastError("Quantity harus lebih dari 0");
        this.isSaving = false;
        return;
      }

      // Validasi amount jika override aktif
      if (formData.is_override && parseFloat(formData.amount) <= 0) {
        getToastError("Amount harus lebih dari 0");
        this.isSaving = false;
        return;
      }

      // const { status2 } = await employeeAPI.UpdateEmployeeBenefit(formData);

      const index = this.rowBenefitData.findIndex(
        (item: any) => item.id === formData.id
      );

      if (index !== -1) {
        const selectedComponent = this.benefitOptions.find(
          (option: any) => option.code === formData.component
        );

        if (!selectedComponent) {
          getToastError("Component tidak ditemukan");
          this.isSaving = false;
          return;
        }

        const finalAmount = formData.is_override
          ? parseFloat(formData.amount)
          : selectedComponent.default_amount;

        this.rowBenefitData[index] = {
          ...this.rowBenefitData[index],
          payroll_component_id: selectedComponent.id,
          payroll_component: formData.component,
          payroll_component_name: selectedComponent.name,
          amount: finalAmount,
          qty: parseInt(formData.qty),
          effective_date: formData.effective_date,
          end_date: formData.end_date || null,
          is_current:
            !formData.end_date || new Date(formData.end_date) > new Date(),
          is_override: formData.is_override,
          remark: formData.remark || "",
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",

          component_type: formData.component_type,
          default_amount: selectedComponent.default_amount,
          unit: selectedComponent.unit || "Per Bulan",
          category: selectedComponent.category,
          is_taxable: selectedComponent.is_taxable,
          is_fixed: selectedComponent.is_fixed,
        };

        await this.$nextTick();
        if (
          this.benefitTableRef &&
          typeof this.benefitTableRef.refreshGrid === "function"
        ) {
          this.benefitTableRef.refreshGrid();
        }
        this.closeModal();

        getToastSuccess(this.$t("messages.employee.success.updateBenefit"));
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteBenefit() {
    try {
      // const { status2 } = await employeeAPI.DeleteEmployeeBenefit(this.deleteParam.id);

      const updatedBenefit = this.rowBenefitData.filter(
        (benefit: any) => benefit.id !== this.deleteParam.id
      );

      this.rowBenefitData = [...updatedBenefit];

      this.deleteParam = null;

      await this.$nextTick();
      if (
        this.benefitTableRef &&
        typeof this.benefitTableRef.refreshGrid === "function"
      ) {
        this.benefitTableRef.refreshGrid();
      }
      this.closeModal();

      getToastSuccess(this.$t("messages.employee.success.deleteBenefit"));
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,

      // personal information
      employee_id: params.employee_id,
      first_name: params.first_name,
      last_name: params.last_name,
      gender: params.gender,
      birth_date: params.birth_date,
      address: params.address,
      phone: params.phone,
      email: params.email,

      // employment information
      hire_date: params.hire_date,
      end_date: params.end_date,
      status: params.status === "A" ? true : false,
      employee_type: params.employee_type,
      placement: params.placement,
      position: params.position,
      department: params.department,
      supervisor: params.supervisor,

      // salary & payment information
      payment_frequency: params.payment_frequency,
      base_salary: params.base_salary,
      daily_rate: params.daily_rate,
      payment_method: params.payment_method,
      bank_name: params.bank_name,
      bank_account_number: params.bank_account_number,
      bank_account_name: params.bank_account_name,

      // identity information
      tax_number: params.tax_number,
      identity_number: params.identity_number,
      marital_status: params.marital_status,
      health_insurance_number: params.health_insurance_number,
      social_security_number: params.social_security_number,
      created_at: formatDateTimeUTC(params.created_at),
      created_by: formatDateTimeUTC(params.created_by),
      updated_at: formatDateTimeUTC(params.updated_at),
      updated_by: formatDateTimeUTC(params.updated_by),
    };
  }

  formatModalData(params: any, type: any) {
    switch (type) {
      case "DOCUMENT":
        return {
          id: params.id,
          document_type: params.document_type,
          file: params.file,
          file_name: params.file_name,
          issue_date: params.issue_date,
          expiry_date: params.expiry_date,
          remark: params.remark,
          status: params.staus,
          employee_id: this.employeeId,
        };
      case "SALARY":
        return {
          id: params.id,
          base_salary: params.base_salary,
          effective_date: params.effective_date,
          adjustment_reason: params.adjustment_reason,
          remark: params.remark,
          employee_id: this.employeeId,
        };
      case "BENEFIT":
        return {
          id: params.id,
          payroll_component_code: params.payroll_component_code,
          payroll_component_name: params.payroll_component_name,
          component_type: params.component_type,
          category: params.category,
          amount: parseFloat(params.amount),
          qty: parseInt(params.qty),
          effective_date: params.effective_date,
          end_date: params.end_date,
          remark: params.remark,
          is_current:
            !params.end_date || new Date(params.end_date) > new Date(),
          is_override: params.is_override,
          is_taxable: params.is_taxable,
          is_fixed: params.is_taxable,
          is_prorated: params.is_taxable,
          is_included_in_bpjs_health: params.is_taxable,
          is_included_in_bpjs_employee: params.is_taxable,
          is_show_in_payslip: params.is_taxable,
          employee_id: this.employeeId,
        };
      default:
        return params;
    }
  }

  setDefaultFormValues(type: string) {
    switch (type) {
      case "DOCUMENT":
        this.currentForm = {
          id: null,
          document_type: "",
          file: null,
          file_name: "",
          issue_date: "",
          expiry_date: "",
          remark: "",
          status: "Valid",
          employee_id: this.employeeId,
        };
        break;
      case "SALARY":
        const currentSalary = this.rowSalaryData.find(
          (item: any) => item.is_current
        );
        this.currentForm = {
          id: null,
          base_salary: currentSalary
            ? currentSalary.base_salary
            : this.employeeData.base_salary || 0,
          effective_date: "",
          adjustment_reason: "",
          remark: "",
          employee_id: this.employeeId,
        };
        break;
      case "BENEFIT":
        this.currentForm = {
          id: null,
          payroll_component_code: "",
          payroll_component_name: "",
          component_type: "",
          category: "",
          amount: 0,
          qty: 1,
          effective_date: "",
          end_date: "",
          remark: "",
          is_current: true,
          is_override: false,
          is_taxable: false,
          is_fixed: false,
          is_prorated: false,
          is_included_in_bpjs_health: false,
          is_included_in_bpjs_employee: false,
          is_show_in_payslip: false,
          employee_id: this.employeeId,
        };
        break;
    }
  }

  validateData(params: any, type: any = this.dataType) {
    if (params) {
      switch (type) {
        case "DOCUMENT":
          break;
        case "SALARY":
          break;
        case "BENEFIT":
          break;
      }
    }
    return;
  }

  generateUniqueId(type: string): number {
    let maxId = 0;
    switch (type) {
      case "POSITION":
        maxId =
          Math.max(
            ...this.rowDocumentData.map((item: any) => item.id || 0),
            0
          ) + 1;
        break;
      case "DEPARTMENT":
        maxId =
          Math.max(...this.rowSalaryData.map((item: any) => item.id || 0), 0) +
          1;
        break;
      case "PLACEMENT":
        maxId =
          Math.max(...this.rowBenefitData.map((item: any) => item.id || 0), 0) +
          1;
        break;
    }
    return maxId;
  }

  calculateDocumentStatus(expiryDate: string): string {
    if (!expiryDate) return "Valid";

    const today = new Date();
    const expiry = new Date(expiryDate);

    if (isNaN(expiry.getTime())) return "Valid";

    if (expiry < today) {
      return "Expired";
    } else if (expiry.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return "Expiring Soon";
    } else {
      return "Valid";
    }
  }

  populateForm(params: any) {
    this.$nextTick(() => {
      this.inputFormElement.form = {
        id: params.id,

        // personal information
        employee_id: params.employee_id,
        first_name: params.first_name,
        last_name: params.last_name,
        gender: params.gender,
        birth_date: params.birth_date,
        address: params.address,
        phone: params.phone,
        email: params.email,

        // employment information
        hire_date: params.hire_date,
        end_date: params.end_date,
        status: params.status ? "A" : "I",
        employee_type: params.employee_type,
        placement: params.placement,
        position: params.position,
        department: params.department,
        supervisor: params.supervisor,

        // salary & payment information
        payment_frequency: params.payment_frequency,
        base_salary: params.base_salary,
        daily_rate: params.daily_rate,
        payment_method: params.payment_method,
        bank_name: params.bank_name,
        bank_account_number: params.bank_account_number,
        bank_account_name: params.bank_account_name,

        // identity information
        tax_number: params.tax_number,
        identity_number: params.identity_number,
        marital_status: params.marital_status,
        health_insurance_number: params.health_insurance_number,
        social_security_number: params.social_security_number,

        // modified
        created_at: params.created_at,
        created_by: params.created_by,
        updated_at: params.updated_at,
        updated_by: params.updated_by,
      };
    });
  }

  populateModalForm(params: any, type: string) {
    switch (type) {
      case "DOCUMENT":
        this.currentForm = {
          id: params.id,
          document_type: params.document_type,
          file: null,
          file_name: params.file_name,
          issue_date: params.issue_date,
          expiry_date: params.expiry_date,
          remark: params.remark,
          status: params.status,
          employee_id: this.employeeId,
        };
        break;
      case "SALARY":
        this.currentForm = {
          id: params.id,
          base_salary: params.base_salary,
          effective_date: params.effective_date,
          adjustment_reason: params.adjustment_reason,
          remark: params.remark,
          employee_id: this.employeeId,
        };
        break;
      case "BENEFIT":
        const componentType = params.payroll_component?.startsWith("CE")
          ? "EARNINGS"
          : "DEDUCTIONS";

        this.currentForm = {
          id: params.id,
          payroll_component_code: params.payroll_component_code,
          payroll_component_name: params.payroll_component_name,
          component_type: params.component,
          category: params.category,
          amount: params.amount,
          qty: params.qty,
          effective_date: params.effective_date,
          end_date: params.end_date,
          remark: params.remark,
          is_current: params.is_current,
          is_override: params.is_override,
          is_taxable: params.is_taxable,
          is_fixed: params.is_fixed,
          is_prorated: params.is_prorated,
          is_included_in_bpjs_health: params.is_included_in_bpjs_health,
          is_included_in_bpjs_employee: params.is_included_in_bpjs_employee,
          is_show_in_payslip: params.is_show_in_payslip,
          employee_id: this.employeeId,
        };
        break;
    }
  }

  getDataType(params: any): string {
    if (!params) {
      return this.getDataTypeFromActiveTab();
    }

    if (params.document_type !== undefined || params.file_name !== undefined) {
      return "DOCUMENT";
    }
    if (
      params.base_salary !== undefined &&
      params.effective_date !== undefined
    ) {
      return "SALARY";
    }
    if (
      params.payroll_component !== undefined ||
      params.payroll_component_name !== undefined ||
      params.component_type !== undefined
    ) {
      return "BENEFIT";
    }

    return this.getDataTypeFromActiveTab();
  }

  getDataTypeFromActiveTab(): string {
    const activeTabId = document.querySelector(".tab-pane.active")?.id;

    if (activeTabId?.includes("documents")) return "DOCUMENT";
    if (activeTabId?.includes("salaries")) return "SALARY";
    if (activeTabId?.includes("benefits")) return "BENEFIT";

    return "DOCUMENT";
  }

  getModalTitle(): string {
    switch (this.dataType) {
      case "DOCUMENT":
        return this.modalMode === $global.modeData.insert
          ? this.$t("title.insertDocument")
          : this.$t("title.updateDocument");
      case "SALARY":
        return this.modalMode === $global.modeData.insert
          ? this.$t("title.insertSalaryAdjustment")
          : this.$t("title.updateSalaryAdjustment");
      case "BENEFIT":
        return this.modalMode === $global.modeData.insert
          ? this.$t("title.insertBenefit")
          : this.$t("title.updateBenefit");
      default:
        return "";
    }
  }

  getComponentDisplayName(componentCode: string): string {
    if (!componentCode) return "";

    const component = this.benefitOptions.find(
      (option: any) => option.code === componentCode
    );

    return component ? component.name : componentCode;
  }

  getDepartmentDisplayName(departmentCode: string): string {
    if (!departmentCode) return "";

    const department = this.departmentOptions.find(
      (option: any) => option.code === departmentCode
    );

    return department ? department.name : departmentCode;
  }

  getPositionDisplayName(positionCode: string): string {
    if (!positionCode) return "";

    const position = this.positionOptions.find(
      (option: any) => option.code === positionCode
    );

    return position ? position.name : positionCode;
  }

  getPlacementDisplayName(placementCode: string): string {
    if (!placementCode) return "";

    const placement = this.placementOptions.find(
      (option: any) => option.code === placementCode
    );

    return placement ? placement.name : placementCode;
  }

  getDocumentTypeDisplayName(documentTypeCode: string): string {
    if (!documentTypeCode) return "";

    const docType = this.documentTypeOptions.find(
      (option: any) => option.code === documentTypeCode
    );

    return docType ? docType.name : documentTypeCode;
  }

  getAdjustmentReasonDisplayName(reasonCode: string): string {
    if (!reasonCode) return "";

    const reason = this.adjustmentReasonOptions.find(
      (option: any) => option.code === reasonCode
    );

    return reason ? reason.name : reasonCode;
  }

  // GETTER AND SETTER =======================================================
  get filteredComponentOptions() {
    if (!this.currentForm || !this.currentForm.component_type) {
      return [];
    }

    if (this.currentForm.component_type === "EARNINGS") {
      return this.earningsComponentOptions;
    } else {
      return this.deductionsComponentOptions;
    }
  }

  get filteredComponentOptionsWithDetails() {
    return this.filteredComponentOptions.map((option: any) => ({
      code: option.code,
      name: option.name,
      SubGroupName: option.category,
      ...option,
    }));
  }

  get selectedComponentData() {
    if (!this.currentForm.component) {
      return null;
    }

    return this.benefitOptions.find(
      (option: any) => option.code === this.currentForm.component
    );
  }

  get isFixedComponent(): boolean {
    return this.selectedComponentData
      ? this.selectedComponentData.is_fixed
      : false;
  }

  get isValidForm(): boolean {
    if (!this.currentForm || !this.dataType) {
      return false;
    }

    switch (this.dataType) {
      case "DOCUMENT":
        return !!(
          this.currentForm.document_type &&
          this.currentForm.issue_date &&
          (this.modalMode === $global.modeData.edit || this.currentForm.file)
        );

      case "SALARY":
        return !!(
          this.currentForm.base_salary &&
          parseFloat(this.currentForm.base_salary) > 0 &&
          this.currentForm.effective_date &&
          this.currentForm.adjustment_reason
        );

      case "BENEFIT":
        // Jika override aktif, amount harus > 0
        // Jika tidak override, amount akan otomatis dari default component
        const isAmountValid = this.currentForm.is_override
          ? this.currentForm.amount && parseFloat(this.currentForm.amount) > 0
          : this.selectedComponentData &&
            this.selectedComponentData.default_amount > 0;

        return !!(
          this.currentForm.component_type &&
          this.currentForm.component &&
          this.currentForm.payroll_component_id &&
          isAmountValid &&
          this.currentForm.qty &&
          parseInt(this.currentForm.qty) > 0 &&
          this.currentForm.effective_date
        );

      default:
        return false;
    }
  }
}
