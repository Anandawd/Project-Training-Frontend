import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber2,
} from "@/utils/format";
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
    CDatepicker,
    CInput,
    EmployeeInputForm,
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

  // tab data
  documentData: any[] = [];
  salaryData: any[] = [];
  benefitData: any[] = [];

  // modal form
  documentForm: any = reactive({});
  salaryForm: any = reactive({});
  benefitForm: any = reactive({});

  /// modal state
  public dataType: any;
  public currentForm: any = reactive({});
  public showModal: boolean = false;
  public modalType: string = "";
  public modalMode: any;
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
  salaryFormRef: any = ref();
  documentFormRef: any = ref();
  benefitFormRef: any = ref();

  // table config
  columnSalaryDefs: any;
  columnDocumentDefs: any;
  columnBenefitDefs: any;

  // grid api
  salaryGridApi: any;
  documentGridApi: any;
  benefitGridApi: any;

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

  salaryGridOptions: any = {};
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
    this.salaryGridOptions = {
      actionGrid: {
        insert: true,
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
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
        field: "document_type",
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "issue_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.expiryDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "expiry_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 100,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "";

          if (status === "Valid") badgeClass = "bg-success";
          else if (status === "Expired") badgeClass = "bg-danger";
          else badgeClass = "bg-secondary";

          return `<span class="badge ${badgeClass} py-1 px-4">${status}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: false,
      },
    ];
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "effective_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.endDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "end_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
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
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: false,
      },
    ];
    this.columnBenefitDefs = [
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "effective_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.endDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "end_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
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
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: false,
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
    this.documentGridApi = params.api;
    this.salaryGridApi = params.api;
    this.benefitGridApi = params.api;
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
        name: this.$t("commons.contextMenu.insert"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleInsert(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData || !this.paramsData.is_current,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData || !this.paramsData.is_current,
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

  async handleShowModal(params: any, mode: any, type: any) {
    this.showModal = false;
    await this.$nextTick();

    console.log("handleShowModal clicked", mode);
    console.log("handleShowModal params clicked", params);
    console.log("handleShowModal type clicked", type);
    this.modalMode = mode;
    this.modalType = type;

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.$nextTick(() => {
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
            case "SALARY":
              const currentSalary = this.rowSalaryData.find(
                (item: any) => item.is_current
              );

              console.log("currentSalary", currentSalary);

              this.currentForm = {
                id: null,
                base_salary: currentSalary
                  ? currentSalary.base_salary
                  : this.employeeData.base_salary || 0,
                effective_date: currentSalary.effective_date,
                adjustment_reason: currentSalary.adjustment_reason,
                remark: currentSalary.remark,
                employee_id: this.employeeId,
              };
            case "BENEFIT":
              this.currentForm = {
                id: null,
                component_type: "",
                component: "",
                amount: 0,
                qty: 1,
                effective_date: "",
                end_date: "",
                remark: "",
                employee_id: this.employeeId,
              };
          }
        });
      } else if (mode === $global.modeData.edit) {
        switch (type) {
          case "DOCUMENT":
            this.currentForm = {
              id: params.id,
              document_type: params.document_type,
              file: params.file,
              file_name: params.file_name,
              issue_date: params.issue_date,
              expiry_date: params.expiry_date,
              remark: params.remark,
              status: params.status,
              employee_id: this.employeeId,
            };

          case "SALARY":
            break;
          case "BEENFIT":
            this.currentForm = {
              id: params.id,
              component_type: params.component_type,
              component: params.component,
              amount: params.amount,
              quantity: params.quantity,
              effective_date: params.effective_date,
              end_date: params.end_date,
              remark: params.remark,
              employee_id: this.employeeId,
            };
        }
      }
    });
    this.showModal = true;
  }

  async handleSaveModal() {
    console.log("handleSaveModal clicked");

    const formattedData = this.formatModalData(
      this.currentForm,
      this.modalType
    );

    if (this.modalMode === $global.modeData.insert) {
      switch (this.modalType) {
        case "DOCUMENT":
          this.saveDocument(formattedData).then(() => {
            this.closeModal;
          });
        case "SALARY":
          this.insertSalary(formattedData).then(() => {
            this.closeModal;
          });
        case "BENEFIT":
          this.insertBenefit(formattedData).then(() => {
            this.closeModal;
          });
      }
    } else if (this.modalMode === $global.modeData.edit) {
      switch (this.modalType) {
        case "DOCUMENT":
          this.saveDocument(formattedData).then(() => {
            this.closeModal;
          });
        case "SALARY":
          this.updateSalary(formattedData).then(() => {
            this.closeModal;
          });
        case "BENEFIT":
          this.updateBenefit(formattedData).then(() => {
            this.closeModal;
          });
      }
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
    if (!params) {
      return;
    }

    this.dataType = this.getDataType(params);

    this.handleShowModal(params, $global.modeData.insert, this.dataType);
  }

  handleEdit(params: any) {
    if (!params || !params.is_current) return;

    this.dataType = this.getDataType(params);

    this.handleShowModal(params, $global.modeData.edit, this.dataType);
  }

  handleDelete(params: any) {
    if (!params || !params.is_current) return;

    this.dataType = this.getDataType(params);

    this.deleteParam = params;
    this.dialogAction = "delete";

    switch (this.dataType) {
      case "DOCUMENT":
        this.dialogMessage = this.$t("messages.confirmDeleteDocument");
        break;
      case "BENEFIT":
        this.dialogMessage = this.$t("messages.confirmDeleteSalaryComponent");
        break;
    }

    this.showDialog = true;
  }

  handleBack() {
    this.$router.push({
      name: "Employee",
    });
  }

  handleFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.currentForm.file = event.target.files[0];
      this.currentForm.file_name = event.target.files[0].name;
    }
  }

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
        document_type: "DT001",
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
        document_type: "DT003",
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
        document_type: "DT005",
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
        document_type: "DT001",
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
        document_type: "DT002",
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
  }

  async loadDropdown() {
    try {
      this.documentTypeOptions = [
        { code: "KTP", name: "KTP" },
        { code: "PASSPORT", name: "Passport" },
        { code: "NPWP", name: "NPWP" },
        { code: "CERTIFICATE", name: "Certificate" },
      ];

      this.adjustmentReasonOptions = [
        { code: "PROMOTION", name: "Promotion" },
        { code: "ANNUAL_REVIEW", name: "Annual Review" },
        { code: "PERFORMANCE", name: "Performance Based" },
        { code: "MARKET_ADJUSTMENT", name: "Market Adjustment" },
      ];

      this.componentTypeOptions = [
        { code: "EARNINGS", name: "Earnings" },
        { code: "DEDUCTIONS", name: "Deductions" },
      ];

      this.earningsComponentOptions = [
        { code: "CE001", name: "Tunjangan Transportasi" },
        { code: "CE002", name: "Tunjangan Rumah" },
        { code: "CE003", name: "Tunjangan Makan" },
      ];

      this.deductionsComponentOptions = [
        { code: "DE001", name: "Biaya Jabatan" },
        { code: "DE002", name: "Unpaid Leave" },
        { code: "DE003", name: "Cicilan Kasbon" },
      ];

      this.benefitOptions = [
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

        this.rowBenefitData = this.benefitsListData.filter(
          (p: any) => p.employee_id === this.employeeId
        );
      } else {
        // this.$router.push({ name: "Employee" });
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

      this.documentData = [
        {
          id: 1,
          document_type: "KTP",
          file_name: "ktp_john_doe.pdf",
          file_path: "/uploads/ktp_john_doe.pdf",
          issue_date: "2020-01-15",
          expiry_date: "2025-01-15",
          remark: "National ID Card",
          status: "Valid",
          employee_id: this.employeeId,
          document_entity: "DOCUMENT",
        },
        {
          id: 2,
          document_type: "NPWP",
          file_name: "npwp_john_doe.pdf",
          file_path: "/uploads/npwp_john_doe.pdf",
          issue_date: "2018-05-10",
          expiry_date: null,
          remark: "Tax ID",
          status: "Valid",
          employee_id: this.employeeId,
          document_entity: "DOCUMENT",
        },
      ];

      if (this.documentGridApi) {
        this.documentGridApi.setRowData(this.documentData);
      }
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

  async saveDocument(formData: any) {
    try {
      this.isSaving = true;

      if (!this.currentForm.document_type || !this.currentForm.issue_date) {
        getToastError(this.$t("messages.employee.error.fillRequired"));
        this.isSaving = false;
        return;
      }

      if (this.modalMode === $global.modeData.edit) {
        // const formData = new FormData();
        // formData.append('id', this.currentForm.id);
        // formData.append('employeeId', this.employeeId);
        // formData.append('documentType', this.currentForm.document_type);
        // formData.append('issueDate', this.currentForm.issue_date);
        // formData.append('expiryDate', this.currentForm.expiry_date || '');
        // formData.append('remark', this.currentForm.remark || '');
        // if (this.currentForm.file) {
        //   formData.append('file', this.currentForm.file);
        // }
        // const { status2 } = await employeeAPI.UpdateEmployeeDocument(formData);

        // Mock implementation
        const index = this.documentData.findIndex(
          (item) => item.id === this.currentForm.id
        );
        if (index !== -1) {
          this.documentData[index] = {
            ...this.documentData[index],
            document_type: this.currentForm.document_type,
            file_name: this.currentForm.file
              ? this.currentForm.file.name
              : this.documentData[index].file_name,
            file_path: this.currentForm.file
              ? `/uploads/${this.currentForm.file.name}`
              : this.documentData[index].file_path,
            issue_date: this.currentForm.issue_date,
            expiry_date: this.currentForm.expiry_date,
            remark: this.currentForm.remark,
            status: this.currentForm.status,
          };
        }

        getToastSuccess(this.$t("messages.employee.success.documentUpdated"));
      } else {
        // const formData = new FormData();
        // formData.append('employeeId', this.employeeId);
        // formData.append('documentType', this.currentForm.document_type);
        // formData.append('issueDate', this.currentForm.issue_date);
        // formData.append('expiryDate', this.currentForm.expiry_date || '');
        // formData.append('remark', this.currentForm.remark || '');
        // if (this.currentForm.file) {
        //   formData.append('file', this.currentForm.file);
        // }
        // const { status2 } = await employeeAPI.InsertEmployeeDocument(formData);

        // Mock implementation
        const newId =
          Math.max(...this.documentData.map((doc) => doc.id), 0) + 1;
        const newDocument = {
          id: newId,
          document_type: this.currentForm.document_type,
          file_name: this.currentForm.file
            ? this.currentForm.file.name
            : "document.pdf",
          file_path: this.currentForm.file
            ? `/uploads/${this.currentForm.file.name}`
            : "/uploads/document.pdf",
          issue_date: this.currentForm.issue_date,
          expiry_date: this.currentForm.expiry_date,
          remark: this.currentForm.remark,
          status: "Valid",
          employee_id: this.employeeId,
        };

        this.documentData.push(newDocument);

        getToastSuccess(this.$t("messages.employee.success.documentUpload"));
      }

      // Refresh data grid
      if (this.documentGridApi) {
        this.documentGridApi.setRowData(this.documentData);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateDocument(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async deleteDocument(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async insertSalary(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async updateSalary(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async deleteSalary(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async insertBenefit(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async updateBenefit(formData: any) {
    try {
    } catch (error) {
      getError(error);
    }
  }

  async deleteBenefit(formData: any) {
    try {
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
          id: params.base_salary,
          base_salary: params.base_salary,
          effective_date: params.effective_date,
          adjustment_reason: params.adjustment_reason,
          remark: params.remark,
          employee_id: this.employeeId,
        };
      case "BENEFIT":
        return {
          id: params.id,
          component_type: params.component_type,
          component: params.component,
          amount: params.amount,
          qty: params.qty,
          effective_date: params.effective_date,
          end_date: params.end_date,
          remark: params.remark,
          employee_id: this.employeeId,
        };
    }
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

  getDataType(params: any): string {
    if (!params) return "";

    if (params.document_type !== undefined) return "DOCUMENT";
    if (params.adjustment_reason !== undefined) return "SALARY";
    if (params.component_type !== undefined) return "BENEFIT";

    const activeTabId = document.querySelector(".tab-pane.active")?.id;

    if (activeTabId?.includes("documents")) return "DOCUMENT";
    if (activeTabId?.includes("salaries")) return "SALARY";
    if (activeTabId?.includes("benefits")) return "BENEFIT";

    return "";
  }

  getActiveGridApi(): any {
    const activeTabId = document.querySelector(".tab-pane.active")?.id;

    if (activeTabId?.includes("documents")) return this.documentGridApi;
    if (activeTabId?.includes("salaries")) return this.salaryGridApi;
    if (activeTabId?.includes("benefits")) return this.benefitGridApi;

    return null;
  }

  getModalTitle(): string {
    switch (this.modalType) {
      case "DOCUMENT":
        return this.modalMode === $global.modeData.insert
          ? this.$t("title.insertDocument")
          : this.$t("title.updateDocument");
      case "SALARY":
        return this.$t("title.insertSalaryAdjustment");
      case "BENEFIT":
        return this.modalMode === $global.modeData.insert
          ? this.$t("title.insertBenefit")
          : this.$t("title.updateBenefit");
      default:
        return "";
    }
  }

  closeModal() {
    this.showModal = false;
    this.isSaving = false;
    this.currentForm = {};
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowSalaryData, this.columnDefs);
  }
}
