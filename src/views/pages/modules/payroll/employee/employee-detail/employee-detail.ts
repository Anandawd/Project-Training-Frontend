import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import LegalDocumentsAPI from "@/services/api/payroll/legal-documents/legal-document";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import SalaryAdjustmentAPI from "@/services/api/payroll/salary-adjustment/salary-adjustment";
import { formatDateTimeUTC, formatFullDate } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";
import BenefitTableComponent from "../components/benefit-table-component/benefit-table-component.vue";
import DocumentTableComponent from "../components/document-table-component/document-table-component.vue";
import EmployeeInputForm from "../components/employee-input-form/employee-input-form.vue";
import SalaryTableComponent from "../components/salary-table-component/salary-table-component.vue";

const employeeAPI = new EmployeeAPI();
const organizationAPI = new OrganizationAPI();
const legalDocumentAPI = new LegalDocumentsAPI();
const salaryAdjustmentAPI = new SalaryAdjustmentAPI();
const payrollAPI = new PayrollAPI();

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
  employeeData: any = ref([]);
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
  public documentFormRef: any = ref();
  public salaryFormRef: any = ref();
  public benefitFormRef: any = ref();

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
    console.log("created", this.employeeId);
    this.loadData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
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

  async handleSaveModal() {
    this.isSaving = true;

    let isValid = false;

    switch (this.dataType) {
      case "DOCUMENT":
        if (this.documentFormRef && this.documentFormRef.validate) {
          const { valid } = await this.documentFormRef.validate();
          isValid = valid;
        } else {
          // Fallback validation
          isValid = !!(
            this.currentForm.document_type && this.currentForm.issue_date
          );
        }
        break;
      case "SALARY":
        if (this.salaryFormRef && this.salaryFormRef.validate) {
          const { valid } = await this.salaryFormRef.validate();
          isValid = valid;
        } else {
          // Fallback validation
          isValid = !!(
            this.currentForm.base_salary &&
            this.currentForm.effective_date &&
            this.currentForm.adjustment_reason
          );
        }
        break;
      case "BENEFIT":
        if (this.benefitFormRef && this.benefitFormRef.validate) {
          const { valid } = await this.benefitFormRef.validate();
          isValid = valid;
        } else {
          // Fallback validation
          isValid = !!(
            this.currentForm.component_type &&
            this.currentForm.payroll_component_code &&
            this.currentForm.effective_date
          );
        }
        break;
    }

    if (!isValid) {
      this.isSaving = false;
      getToastError(this.$t("messages.employee.error.fillRequired"));
      return;
    }

    const formattedData = this.formatModalData(this.currentForm, this.dataType);

    if (this.modalMode === $global.modeData.insert) {
      this.insertModalData(formattedData);
    } else if (this.modalMode === $global.modeData.edit) {
      this.updateModalData(formattedData);
    }

    this.isSaving = false;
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
      this.updateData(formattedData);
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
    this.deleteModalData();

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
    this.currentForm.payroll_component_code = "";
    this.currentForm.payroll_component_name = "";
    this.currentForm.amount = 0;
    this.currentForm.qty = 1;
    this.currentForm.is_override = false;
    this.currentForm.category = false;

    // if (this.benefitFormRef) {
    //   this.benefitFormRef.resetField("payroll_component_code");
    //   this.benefitFormRef.resetField("amount");
    //   this.benefitFormRef.resetField("qty");
    // }

    this.$forceUpdate();
  }

  onComponentChange() {
    const selectedComponent = this.selectedComponentData;

    if (selectedComponent) {
      this.currentForm.payroll_component_code = selectedComponent.code;
      this.currentForm.payroll_component_name = selectedComponent.name;
      this.currentForm.category = selectedComponent.category;
      this.currentForm.amount = selectedComponent.default_amount || 0;
      this.currentForm.qty = selectedComponent.qty || 1;
      this.currentForm.is_override = false;

      this.currentForm.is_taxable = selectedComponent.is_taxable;
      this.currentForm.is_fixed = selectedComponent.is_fixed;
      this.currentForm.is_prorated = selectedComponent.is_prorated;
      this.currentForm.is_included_in_bpjs_health =
        selectedComponent.is_included_in_bpjs_health;
      this.currentForm.is_included_in_bpjs_employee =
        selectedComponent.is_included_in_bpjs_employee;
      this.currentForm.is_show_in_payslip =
        selectedComponent.is_show_in_payslip;
    } else {
      this.currentForm.payroll_component_code = "";
      this.currentForm.payroll_component_name = "";
      this.currentForm.category = "";
      this.currentForm.amount = 0;
      this.currentForm.qty = 1;
      this.currentForm.is_override = false;
    }

    this.$forceUpdate();
  }

  onOverrideAmountChange() {
    if (!this.currentForm.is_override) {
      if (this.selectedComponentData) {
        this.currentForm.amount =
          this.selectedComponentData.default_amount || 0;
        this.currentForm.qty = this.selectedComponentData.default_quantity || 1;
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
    try {
      const { data } = await employeeAPI.GetEmployeeByEmployeeID(
        this.employeeId
      );
      if (data) {
        this.employeeData = data[0];
      }
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadAllTable() {
    try {
      const { data: documentData } =
        await legalDocumentAPI.GetLegalDocumentListByEmployeeId(
          this.employeeId
        );
      if (documentData) {
        this.rowDocumentData = documentData[0];
      } else {
        this.rowDocumentData = [];
      }

      const { data: salaryData } =
        await salaryAdjustmentAPI.GetSalaryAdjustmentListByEmployeeId(
          this.employeeId
        );
      if (salaryData) {
        this.rowSalaryData = salaryData[0];
      } else {
        this.rowSalaryData = [];
      }

      const { data: benefitData } =
        await payrollAPI.GetPayrollComponentListByEmployeeId(this.employeeId);
      if (benefitData) {
        this.rowBenefitData = benefitData[0];
      } else {
        this.rowBenefitData = [];
      }
    } catch (error) {
      getError(error);
    }
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

  async loadMockData() {
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

  async loadEditData(params: any) {
    try {
      if (this.employeeData) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(this.employeeData);
        });
      } else {
        const { data } = await employeeAPI.GetEmployee(params.id);
        this.inputFormElement.form = this.populateForm(data[0]);
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const promises = [
        employeeAPI.GetEmployeeTypeList({}).then((response) => {
          this.employeeTypeOptions = response.data;
        }),
        employeeAPI.GetPaymentFrequencyOptions().then((response) => {
          this.paymentFrequencyOptions = response.data;
        }),
        employeeAPI.GetMaritalStatusOptions().then((response) => {
          this.maritalStatusOptions = response.data;
        }),
        employeeAPI.GetPaymentMethodOptions().then((response) => {
          this.paymentMethodOptions = response.data;
        }),
        employeeAPI.GetBankOptions().then((response) => {
          this.bankOptions = response.data;
        }),
      ];

      promises.push(
        organizationAPI.GetDepartmentActiveList({}).then((response) => {
          this.departmentOptions = response.data;
        }),
        organizationAPI.GetPositionActiveList({}).then((response) => {
          this.positionOptions = response.data;
        }),
        organizationAPI.GetPlacementActiveList({}).then((response) => {
          this.placementOptions = response.data;
        })
      );

      await Promise.all(promises);

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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
          is_prorated: true,
          is_included_in_bpjs_health: true,
          is_included_in_bpjs_employee: true,
          is_show_in_payslip: true,
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
      const { status2 } = await employeeAPI.UpdateEmployee(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.update"));
        this.loadData();
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
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
            (option: any) => option.code === formData.payroll_component_code
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
      switch (this.dataType) {
        case "DOCUMENT":
          const iDocument = this.rowDocumentData.findIndex(
            (item: any) => item.id === formData.id
          );
          if (iDocument !== -1) {
            this.rowDocumentData[iDocument] = {
              ...this.rowDocumentData[iDocument],
              document_type: formData.document_type,
              file_name: formData.file
                ? formData.file.name
                : this.rowDocumentData[iDocument].file_name,
              file_path: formData.file
                ? `/uploads/${formData.file.name}`
                : this.rowDocumentData[iDocument].file_path,
              file_type: formData.file
                ? formData.file.type
                : this.rowDocumentData[iDocument].file_type,
              file_size: formData.file
                ? formData.file.size
                : this.rowDocumentData[iDocument].file_size,
              issue_date: formData.issue_date,
              expiry_date: formData.expiry_date || null,
              remark: formData.remark || "",
              status: this.calculateDocumentStatus(formData.expiry_date),
              updated_at: formatDateTimeUTC(new Date()),
              updated_by: "Current User",
            };
          }
          getToastSuccess(this.$t("messages.employee.success.updateDocument"));

          break;
        case "SALARY":
          const iSalary = this.rowSalaryData.findIndex(
            (item: any) => item.id === formData.id
          );

          if (iSalary !== -1) {
            this.rowSalaryData[iSalary] = {
              ...this.rowSalaryData[iSalary],
              remark: formData.remark,
              updated_at: formatDateTimeUTC(new Date()),
              updated_by: "Current User",
            };
          }
          getToastSuccess(this.$t("messages.employee.success.updateSalary"));
          break;
        case "BENEFIT":
          const iBenefit = this.rowBenefitData.findIndex(
            (item: any) => item.id === formData.id
          );
          if (iBenefit !== -1) {
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

            this.rowBenefitData[iBenefit] = {
              ...this.rowBenefitData[iBenefit],
              amount: finalAmount,
              qty: parseInt(formData.qty),
              effective_date: formData.effective_date,
              end_date: formData.end_date || null,
              remark: formData.remark || "",
              is_current:
                !formData.end_date || new Date(formData.end_date) > new Date(),
              is_override: formData.is_override,
              updated_at: formatDateTimeUTC(new Date()),
              updated_by: "Current User",
            };
          }
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

  async deleteModalData() {
    try {
      switch (this.dataType) {
        case "DOCUMENT":
          const updatedDocument = this.rowDocumentData.filter(
            (document: any) => document.id !== this.deleteParam.id
          );
          this.rowDocumentData = [...updatedDocument];
          getToastSuccess(this.$t("messages.employee.success.deleteDocument"));
          break;
        case "BENEFIT":
          const updatedBenefit = this.rowBenefitData.filter(
            (benefit: any) => benefit.id !== this.deleteParam.id
          );
          this.rowBenefitData = [...updatedBenefit];
          getToastSuccess(this.$t("messages.employee.success.deleteBenefit"));
          break;
      }
      await this.$nextTick();

      this.deleteParam = null;
      this.loadDataGrid();
      this.closeModal();
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      // personal information
      profile_photo: params.profile_photo,
      employee_id: params.employee_id,
      first_name: params.first_name,
      last_name: params.last_name,
      gender: params.gender,
      birth_date: formatDateTimeUTC(params.birth_date),
      email: params.email,
      phone: params.phone,
      address: params.address,

      // employment information
      hire_date: formatDateTimeUTC(params.hire_date),
      end_date: formatDateTimeUTC(params.end_date),
      status: parseInt(params.status),
      employee_type: params.employee_type,
      position_code: params.position_code,
      department_code: params.department_code,
      placement_code: params.placement_code,
      supervisor_id: params.supervisor_id,

      // salary & payment information
      payment_frequency: params.payment_frequency,
      payment_method: params.payment_method,
      bank_name: params.bank_name,
      bank_account_name: params.bank_account_name,
      bank_account_number: params.bank_account_number,

      // identity information
      tax_number: params.tax_number,
      maritial_status: params.maritial_status,
      identity_number: params.identity_number,
      health_insurance_number: params.health_insurance_number,
      social_security_number: params.social_security_number,

      // leave information
      annual_leave_quota: params.annual_leave_quota,
      annual_leave_remaining: params.annual_leave_remaining,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
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

  populateForm(params: any) {
    return {
      id: params.id,

      // personal information
      profile_photo: params.profile_photo,
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
      status: params.status === 1 ? "1" : "0",
      employee_type: params.employee_type,
      placement_code: params.placement_code,
      position_code: params.position_code,
      department_code: params.department_code,
      supervisor_id: params.supervisor_id,

      // salary & payment information
      payment_frequency: params.payment_frequency,
      payment_method: params.payment_method,
      bank_name: params.bank_name,
      bank_account_number: params.bank_account_number,
      bank_account_name: params.bank_account_name,

      // identity information
      tax_number: params.tax_number,
      identity_number: params.identity_number,
      maritial_status: params.maritial_status,
      health_insurance_number: params.health_insurance_number,
      social_security_number: params.social_security_number,

      // leave information
      annual_leave_quota: params.annual_leave_quota,
      annual_leave_remaining: params.annual_leave_remaining,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
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
      case "DOCUMENT":
        maxId =
          Math.max(
            ...this.rowDocumentData.map((item: any) => item.id || 0),
            0
          ) + 1;
        break;
      case "SALARY":
        maxId =
          Math.max(...this.rowSalaryData.map((item: any) => item.id || 0), 0) +
          1;
        break;
      case "BENEFIT":
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

  formatHireDate(date: string): string {
    if (
      !date ||
      date === "0001-01-01T00:00:00Z" ||
      date.startsWith("0001-01-01")
    ) {
      return "-";
    }
    return formatFullDate(date);
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
      ...option,
    }));
  }

  get selectedComponentData() {
    if (!this.currentForm.payroll_component_code) {
      return null;
    }

    return this.benefitOptions.find(
      (option: any) => option.code === this.currentForm.payroll_component_code
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
          this.currentForm.document_type && this.currentForm.issue_date
        );

      case "SALARY":
        return !!(
          this.currentForm.base_salary &&
          this.currentForm.effective_date &&
          this.currentForm.adjustment_reason
        );
      case "BENEFIT":
        return !!(
          this.currentForm.component_type &&
          this.currentForm.payroll_component_code &&
          this.currentForm.effective_date
        );

      default:
        return false;
    }
  }

  get documentValidationSchema() {
    return Yup.object().shape({
      DocumentType: Yup.string().required(),
      IssueDate: Yup.date().required(),
      ExpiryDate: Yup.date().nullable().min(Yup.ref("IssueDate")),
    });
  }

  get salaryValidationSchema() {
    return Yup.object().shape({
      BaseSalary: Yup.number().required().min(1).max(999999999),
      EffectiveDate: Yup.date().required(),
      AdjustmentReason: Yup.string().required(),
    });
  }

  get benefitValidationSchema() {
    return Yup.object().shape({
      ComponentType: Yup.string().required(),
      ComponentCode: Yup.string().required(),
      Amount: Yup.number().min(1).max(999999999),
      Qty: Yup.number().required().min(1).max(1000),
      EffectiveDate: Yup.date().required(),
      EndDate: Yup.date().nullable(),
    });
  }
}
