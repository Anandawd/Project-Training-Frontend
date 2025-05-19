import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import { formatDate, formatDateTimeUTC, formatNumber2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./employee-input-form/employee-input-form.vue";

const employeeAPI = new EmployeeAPI();

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
  // data
  public rowData: any = [];
  public deleteParam: any;

  // options data
  public employeeTypeOptions: any = [];
  public genderOptions: any = [];
  public paymentFrequencyOptions: any = [];
  public maritalStatusOptions: any = [];
  public paymentMethodOptions: any = [];
  public bankOptions: any = [];
  public documentTypeOptions: any = [];
  public departmentOptions: any = [];
  public positionOptions: any = [];
  public placementOptions: any = [];

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

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

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
  created(): void {
    this.loadData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      { text: this.$t("commons.filter.payroll.employee.name"), value: 1 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 3 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 4 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
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
        headerName: this.$t("commons.table.payroll.employee.id"),
        field: "employee_id",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.name"),
        field: "full_name",
        width: 200,
        enableRowGroup: false,
        valueGetter: (params: any) => {
          return params.data
            ? `${params.data.first_name || ""} ${
                params.data.last_name || ""
              }`.trim()
            : "";
        },
      },
      {
        headerName: this.$t("commons.table.payroll.employee.department"),
        field: "department_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.position"),
        field: "position_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "placement_name",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employeeType"),
        field: "employee_type",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.baseSalary"),
        headerClass: "align-header-right",
        cellClass: "text-right",
        field: "base_salary",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatNumber2,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.hireDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "hire_date",
        width: 100,
        enableRowGroup: true,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
      {
        headerName: this.$t("commons.table.payroll.employee.email"),
        field: "email",
        width: 180,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.phone"),
        field: "phone",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "ag-cell-center-checkbox",
        field: "status",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
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

  onGridReady(params: any) {
    this.gridApi = params.api;
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
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.detail"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("detail_icon24"),
        action: () => this.handleShowDetail(this.paramsData),
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
    this.showForm = false;
    this.$nextTick(() => {
      this.modeData = mode;
      this.showForm = true;

      this.$nextTick(() => {
        if (
          this.inputFormElement &&
          typeof this.inputFormElement.initialize === "function"
        ) {
          this.inputFormElement.initialize;

          if (mode === $global.modeData.edit && params) {
            this.loadEditData(params.id);
          }
        }
      });
    });
  }

  handleShowDetail(params: any) {
    this.$router.push({
      name: "EmployeeDetail",
      params: { id: params.id },
    });
  }

  handleSalaryHistory(paramsId: string) {
    console.log(`Viewing salary history for employee ${paramsId}`);
  }

  handleDownloadPayslip(paramsId: string) {
    console.log(`Downloading payslip for employee ${paramsId}`);
    getToastSuccess("Payslip download started");
  }

  handlePrintPayslip(paramsId: string) {
    getToastSuccess("Payslip print started");
  }

  handleMenu() {}

  handleSave(formData: any) {
    console.log("Handling save with data:", formData);
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData).then(() => {
        this.showForm = false;
      });
    } else if (this.modeData === $global.modeData.edit) {
      this.updateData(formattedData).then(() => {
        this.showForm = false;
      });
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage =
      this.$t("messages.confirmDelete") ||
      "Are you sure you want to delete this employee?";
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleBack() {
    this.$router.push({
      name: "Employee",
    });
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  confirmAction() {
    if (this.dialogAction === $global.dialogActions.delete) {
      this.deleteData();
    } else {
      console.log("Unknown action");
    }
    this.showDialog = false;
  }

  onRefresh() {}

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.loadMockData();
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(search: any = this.searchDefault) {
    try {
      /*
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await employeeAPI.GetEmployeeList(params);
      this.rowData = data;
      */

      // for demo

      let filteredData = [...this.rowData];

      if (search.text) {
        let searchText = search.text.toLowerCase();
        let searchIndex = search.index;

        filteredData = filteredData.filter((item: any) => {
          switch (searchIndex) {
            case 0: // Employee ID
              return item.employee_id.toLowerCase().includes(searchText);
            case 1: // Name (first + last)
              return `${item.first_name} ${item.last_name}`
                .toLowerCase()
                .includes(searchText);
            case 2: // Department
              return item.department_name.toLowerCase().includes(searchText);
            case 3: // Position
              return item.position_name.toLowerCase().includes(searchText);
            case 4: // Placement
              return item.placement_name.toLowerCase().includes(searchText);
            default:
              return true;
          }
        });
      }

      if (search.filter && search.filter[0] !== 0) {
        const statusFilter = search.filter[0];
        filteredData = filteredData.filter((item) => {
          if (statusFilter === 1) return item.status === true;
          if (statusFilter === 2) return item.status === false;
          return true;
        });
      }

      if (this.gridApi) {
        this.gridApi.setRowData(filteredData);
      }
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
      const employee = this.rowData.find((emp: any) => emp.id === params);

      if (employee) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(employee);
        });
      } else {
        getToastError("Employee not found");
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowData = [
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
        position_code: "P007",
        position_name: "Operations Manager",
        department_code: "D007",
        department_name: "Operations",
        placement_code: "PL002",
        placement_name: "Amora Canggu",
        supervisor_id: "EMP005",
        supervisor_name: "Michael Wilson",
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
        position_code: "P004",
        position_name: "HR Director",
        department_code: "D002",
        department_name: "Human Resources",
        placement_code: "PL001",
        placement_name: "Amora Ubud",
        supervisor_id: "EMP003",
        supervisor_name: "Robert Johnson",
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
        position_code: "P003",
        position_name: "Chief Financial Officer",
        department_code: "D003",
        department_name: "Finance",
        placement_code: "PL001",
        placement_name: "Amora Ubud",
        supervisor_id: null,
        supervisor_name: null,
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
        position_code: "P017",
        position_name: "IT Support Specialist",
        department_code: "D004",
        department_name: "Information Technology",
        placement_code: "PL002",
        placement_name: "Amora Canggu",
        supervisor_id: "EMP012",
        supervisor_name: "David Wilson",
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
        position_code: "P005",
        position_name: "IT Director",
        department_code: "D004",
        department_name: "Information Technology",
        placement_code: "PL001",
        placement_name: "Amora Ubud",
        supervisor_id: null,
        supervisor_name: null,
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
        position_code: "P011",
        position_name: "HR Manager",
        department_code: "D002",
        department_name: "Human Resources",
        placement_code: "PL002",
        placement_name: "Amora Canggu",
        supervisor_id: "EMP002",
        supervisor_name: "Jane Smith",
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
        position_name: "Security Officer",
        department: "D012",
        department_name: "Security",
        placement: "PL002",
        placement_name: "Amora Canggu",
        supervisor: "EMP011",
        supervisor_name: "Thomas Wright",
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
        position_code: "P009",
        position_name: "Housekeeping Manager",
        department_code: "D009",
        department_name: "Housekeeping",
        placement_code: "PL001",
        placement_name: "Amora Ubud",
        supervisor_id: "EMP001",
        supervisor_name: "John Doe",
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
  }

  async loadDropdown() {
    try {
      /*
      const promises = [
        employeeAPI.GetEmployeeTypeOptions().then(response => {
          this.employeeTypeOptions = response.data;
        }),
        employeeAPI.GetPaymentFrequencyOptions().then(response => {
          this.paymentFrequencyOptions = response.data;
        }),
        employeeAPI.GetMaritalStatusOptions().then(response => {
          this.maritalStatusOptions = response.data;
        }),
        employeeAPI.GetPaymentMethodOptions().then(response => {
          this.paymentMethodOptions = response.data;
        }),
        employeeAPI.GetBankOptions().then(response => {
          this.bankOptions = response.data;
        })
      ];

      // Load organization data from organization API
      const organizationAPI = new OrganizationAPI();
      promises.push(
        organizationAPI.GetDepartmentOptions().then(response => {
          this.departmentOptions = response.data;
        }),
        organizationAPI.GetPositionOptions().then(response => {
          this.positionOptions = response.data;
        }),
        organizationAPI.GetPlacementOptions().then(response => {
          this.placementOptions = response.data;
        })
      );

      await Promise.all(promises);
      */

      // for demo
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
          code: "Bi-Weekly",
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

      this.documentTypeOptions = [
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
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      /*
      const { status2 } = await employeeAPI.InsertEmployee(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
      */

      // for demo
      console.log("Inserting new employee data:", formData);
      const newId = Math.max(...this.rowData.map((emp: any) => emp.id)) + 1;
      const newEmployee = {
        id: newId,
        ...formData,
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      this.rowData.push(newEmployee);
      this.loadDataGrid();
      setTimeout(() => {
        // gridApi.refreshCells({ force: true });
      }, 100);

      getToastSuccess(
        this.$t("messages.saveSuccess") || "Employee added successfully"
      );
      this.showForm = false;

      return { status: 0 };
    } catch (error) {
      getError(error);
      return { status: 1 };
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
      console.log("Updating employee data:", formData);
      const index = this.rowData.findIndex(
        (emp: any) => emp.id === formData.id
      );
      if (index !== -1) {
        this.rowData[index] = { ...formData };
        this.loadDataGrid();
        setTimeout(() => {
          this.gridApi.refreshCells({ force: true });
        }, 100);
        getToastSuccess(
          this.$t("messages.updateSuccess") || "Employee updated successfully"
        );
        return { status: 0 };
      } else {
        getToastError("Employee not found");
        return { status: 1 };
      }
    } catch (error) {
      getError(error);
      return false;
    }
  }

  async deleteData() {
    try {
      /*
      const { status2 } = await employeeAPI.DeleteEmployee(this.deleteParam.id);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
      */

      // for demo
      const index = this.rowData.findIndex(
        (item: any) => item.id === this.deleteParam.id
      );
      if (index !== -1) {
        this.rowData.splice(index, 1);
        this.loadDataGrid();
        getToastSuccess(
          this.$t("messages.deleteSuccess") || "Employee deleted successfully"
        );
      } else {
        getToastError("Employee not found");
      }
    } catch (error) {
      getError(error);
      return false;
    } finally {
      this.showDialog = false;
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
      placement_code: params.placement_code,
      position_code: params.position_code,
      department_code: params.department_code,
      supervisor_id: params.supervisor_id,

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
        placement_code: params.placement_code,
        position_code: params.position_code,
        department_code: params.department_code,
        supervisor_id: params.supervisor_id,

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
      };
    });
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
