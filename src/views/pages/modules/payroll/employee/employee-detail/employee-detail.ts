import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import { formatDateTimeUTC, formatNumber2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import EmployeeInputForm from "../employee-input-form/employee-input-form.vue";

const employeeAPI = new EmployeeAPI();

@Options({
  components: {
    AgGridVue,
    CModal,
    CDialog,
    CSelect,
    EmployeeInputForm,
  },
})
export default class EmployeeDetail extends Vue {
  // data
  employeeId: any;
  employeeData: any = [];
  rowSalaryData: any = [];
  rowDocumentData: any = [];
  rowComponentData: any = [];

  // for mock
  employeeListData: any = [];
  salaryListData: any = [];
  documentsListData: any = [];
  componentsListData: any = [];
  employeeTypeData: any = [];
  documentTypeData: any = [];

  // tab data
  documents: any[] = [];
  salaryHistory: any[] = [];
  payrollComponents: any[] = [];

  // form state
  showSalaryModal: boolean = false;
  showDocumentModal: boolean = false;
  showComponentModal: boolean = false;

  // dialog state
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public deleteParam: any = null;

  // form
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();
  public employeeForm: any = reactive({});
  public documentForm: any = reactive({});
  public salaryForm: any = reactive({});
  public componentForm: any = reactive({});
  salaryFormRef: any = ref();
  documentFormRef: any = ref();
  componentFormRef: any = ref();

  // options
  employeeTypeOptions: any[] = [];
  documentTypeOptions: any[] = [];
  componentOptions: any[] = [];

  // table config
  columnSalaryDefs: any;
  columnDocumentDefs: any;
  columnComponentDefs: any;

  // grid api
  salaryGridApi: any;
  documentGridApi: any;
  componentGridApi: any;

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

  // RECYCLE LIFE FUNCTION =======================================================
  created() {
    this.employeeId = this.$route.params.id;
    this.loadMockData();
    this.loadDropdown();
    this.loadEmployeeData();
  }

  beforeMount(): void {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnSalaryDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.effectiveDate"),
        field: "effective_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.endDate"),
        field: "end_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.baseSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "base_salary",
        width: 150,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.isCurrent"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "is_current",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },

      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 150,
        enableRowGroup: false,
      },
    ];
    this.columnDocumentDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.documentType"),
        field: "document_type_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.fileName"),
        field: "file_name",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.issueDate"),
        field: "issue_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.expiryDate"),
        field: "expiry_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.status"),
        field: "status",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 150,
        enableRowGroup: false,
      },
    ];
    this.columnComponentDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "payroll_component_code",
        width: 100,
        enableRowGroup: true,
        valueGetter: (params: any) => {
          return params.data.payroll_component_code.startsWith("CE")
            ? "Earnings"
            : "Deductions";
        },
      },
      {
        headerName: this.$t("commons.table.payroll.employee.code"),
        field: "payroll_component_code",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.name"),
        field: "payroll_component_name",
        width: 180,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.amount"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "amount",
        width: 150,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.qty"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "quantity",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.effectiveDate"),
        field: "effective_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.endDate"),
        field: "end_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.isCurrent"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "is_current",
        width: 100,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
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
    this.salaryGridApi = params.api;
    this.documentGridApi = params.api;
    this.componentGridApi = params.api;
    this.ColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
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
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => {
          this.dialogMessage =
            "Are you sure you want to remove this employee from the payroll?";
          this.dialogAction = "delete";
          this.showDialog = true;
        },
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

    console.log("handleShowForm clicked", mode);
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

  handleBack() {
    this.$router.push({
      name: "Employee",
    });
  }

  handleDelete(params: any) {
    try {
      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.RemoveEmployeeFromPayroll({
      //   periodId: this.periodData.id,
      //   employeeId: employee.id
      // });

      // For now, simulate a successful deletion
      // this.rowData = this.rowData.filter((item: any) => item.id !== params.id);

      getToastSuccess("Employee removed from payroll successfully");
      return true;
    } catch (error) {
      getError(error);
      return false;
    }
  }

  handleShowModal() {}

  confirmAction() {
    // if (this.dialogAction === "submit") {
    //   this.handleSubmit();
    // } else if (this.dialogAction === "delete") {
    //   this.handleDelete(this.paramsData);
    // } else if (this.dialogAction === "saveAndhandleBack") {
    //   this.handleSave().then((success) => {
    //     if (success) {
    //       this.$router.push({
    //         name: "PayrollPeriods",
    //       });
    //     }
    //   });
    // }

    this.showDialog = false;
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
        document_type_code: "DT001",
        document_type_name: "ID Card",
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
        document_type_code: "DT003",
        document_type_name: "Tax ID",
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
        document_type_code: "DT005",
        document_type_name: "CV/Resume",
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
        document_type_code: "DT001",
        document_type_name: "ID Card",
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
        document_type_code: "DT002",
        document_type_name: "Passport",
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

    this.componentsListData = [
      {
        id: 1,
        employee_id: "EMP001",
        payroll_component_id: 1,
        payroll_component_code: "CE001",
        payroll_component_name: "Tunjangan Transportasi",
        amount: 200000,
        quantity: 1,
        effective_date: "2020-01-10",
        end_date: null,
        is_current: true,
        remark: "Monthly transportation allowance",
        created_at: "2020-01-10 10:15:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:15:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        employee_id: "EMP001",
        payroll_component_id: 2,
        payroll_component_code: "CE002",
        payroll_component_name: "Tunjangan Rumah",
        amount: 500000,
        quantity: 1,
        effective_date: "2020-01-10",
        end_date: null,
        is_current: true,
        remark: "Housing allowance",
        created_at: "2020-01-10 10:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:30:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        employee_id: "EMP001",
        payroll_component_id: 3,
        payroll_component_code: "CE003",
        payroll_component_name: "Tunjangan Makan",
        amount: 300000,
        quantity: 1,
        effective_date: "2020-01-10",
        end_date: null,
        is_current: true,
        remark: "Meal allowance",
        created_at: "2020-01-10 10:45:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 10:45:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        employee_id: "EMP001",
        payroll_component_id: 10,
        payroll_component_code: "DE001",
        payroll_component_name: "Biaya Jabatan",
        amount: 100000,
        quantity: 1,
        effective_date: "2020-01-10",
        end_date: null,
        is_current: true,
        remark: "Position fee",
        created_at: "2020-01-10 11:00:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 11:00:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        employee_id: "EMP002",
        payroll_component_id: 1,
        payroll_component_code: "CE001",
        payroll_component_name: "Tunjangan Transportasi",
        amount: 300000,
        quantity: 1,
        effective_date: "2021-03-15",
        end_date: null,
        is_current: true,
        remark: "Monthly transportation allowance",
        created_at: "2021-03-15 10:15:00",
        created_by: "Admin System",
        updated_at: "2021-03-15 10:15:00",
        updated_by: "Admin System",
      },
      {
        id: 6,
        employee_id: "EMP002",
        payroll_component_id: 5,
        payroll_component_code: "CE005",
        payroll_component_name: "Bonus",
        amount: 1000000,
        quantity: 1,
        effective_date: "2021-12-15",
        end_date: "2021-12-31",
        is_current: false,
        remark: "End of year bonus",
        created_at: "2021-12-15 14:30:00",
        created_by: "HR Manager",
        updated_at: "2021-12-15 14:30:00",
        updated_by: "HR Manager",
      },
    ];

    this.employeeTypeData = [
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

    this.documentTypeData = [
      {
        code: "DT001",
        name: "ID Card",
        is_required: true,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT002",
        name: "Passport",
        is_required: false,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT003",
        name: "Tax ID",
        is_required: true,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
      {
        code: "DT004",
        name: "Driver License",
        is_required: false,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT005",
        name: "CV/Resume",
        is_required: true,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
      {
        code: "DT006",
        name: "Education Certificate",
        is_required: true,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
      {
        code: "DT007",
        name: "Professional Certificate",
        is_required: false,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT008",
        name: "Employment Contract",
        is_required: true,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT009",
        name: "Bank Account Information",
        is_required: true,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
      {
        code: "DT010",
        name: "Health Insurance Card",
        is_required: false,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT011",
        name: "Social Security Card",
        is_required: false,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT012",
        name: "Family Card",
        is_required: false,
        is_allow_expiry: true,
        SubGroupName: "Document Type",
      },
      {
        code: "DT013",
        name: "Marriage Certificate",
        is_required: false,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
      {
        code: "DT014",
        name: "Birth Certificate",
        is_required: false,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
      {
        code: "DT015",
        name: "Reference Letter",
        is_required: false,
        is_allow_expiry: false,
        SubGroupName: "Document Type",
      },
    ];
  }

  async loadDropdown() {
    try {
      this.employeeTypeOptions = this.employeeTypeData;
      this.documentTypeOptions = this.documentTypeData;
      this.componentOptions = [
        {
          code: "CE001",
          name: "Tunjangan Transportasi",
          type: "Earnings",
          category: "Variable Allowance",
        },
        {
          code: "CE002",
          name: "Tunjangan Rumah",
          type: "Earnings",
          category: "Fix Allowance",
        },
        {
          code: "CE003",
          name: "Tunjangan Makan",
          type: "Earnings",
          category: "Variable Allowance",
        },
        {
          code: "CE004",
          name: "Tunjangan Fasilitas",
          type: "Earnings",
          category: "Fix Allowance",
        },
        {
          code: "CE005",
          name: "Bonus",
          type: "Earnings",
          category: "Incentive",
        },
        {
          code: "CE006",
          name: "Uang Lembur",
          type: "Earnings",
          category: "Incentive",
        },
        {
          code: "DE001",
          name: "Biaya Jabatan",
          type: "Deductions",
          category: "Fix Deduction",
        },
        {
          code: "DE002",
          name: "Unpaid Leave",
          type: "Deductions",
          category: "Variable Deduction",
        },
        {
          code: "DE003",
          name: "Cicilan Kasbon",
          type: "Deductions",
          category: "Kasbon",
        },
        {
          code: "DE004",
          name: "Late Arrival",
          type: "Deductions",
          category: "Variable Deduction",
        },
        {
          code: "DE005",
          name: "Iuran Keagamaan",
          type: "Deductions",
          category: "Fix Deduction",
        },
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
      console.log("employeeData di loadEditData", this.employeeData);
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

        this.rowComponentData = this.componentsListData.filter(
          (p: any) => p.employee_id === this.employeeId
        );
      } else {
        // this.$router.push({ name: "Employee" });
        getToastError("Employee not found");
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

  async loadDocuments() {
    try {
      // For real implementation
      // const { data } = await employeeAPI.GetEmployeeDocumentList(this.employeeId);
      // this.documents = data;
      // For mock implementation - already loaded in loadEmployeeData
    } catch (error) {
      getError(error);
    }
  }

  async loadPayrollComponents() {
    try {
      // For real implementation
      // const { data } = await employeeAPI.GetEmployeePayrollComponentList(this.employeeId);
      // this.payrollComponents = data;
      // For mock implementation - already loaded in loadEmployeeData
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
        ...formData,
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      getToastSuccess(this.$t("messages.employee.success.update"));
    } catch (error) {
      getError(error);
      return false;
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

  populateForm(params: any) {
    if (!params) {
      console.error("Invalid data for form population:", params);
      return;
    }

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

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowSalaryData, this.columnDefs);
  }
}
