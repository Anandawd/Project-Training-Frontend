import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import LegalDocumentsAPI from "@/services/api/payroll/legal-documents/legal-document";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import PayrollComponentsAPI from "@/services/api/payroll/payroll-components/payroll-component";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import SalaryAdjustmentAPI from "@/services/api/payroll/salary-adjustment/salary-adjustment";
import { formatDateTimeUTC, formatFullDate } from "@/utils/format";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import BenefitModal from "../components/benefit-modal/benefit-modal.vue";
import BenefitTableComponent from "../components/benefit-table-component/benefit-table-component.vue";
import DocumentModal from "../components/document-modal/document-modal.vue";
import DocumentTableComponent from "../components/document-table-component/document-table-component.vue";
import EmployeeInputForm from "../components/employee-input-form/employee-input-form.vue";
import SalaryModal from "../components/salary-modal/salary-modal.vue";
import SalaryTableComponent from "../components/salary-table-component/salary-table-component.vue";

const employeeAPI = new EmployeeAPI();
const organizationAPI = new OrganizationAPI();
const legalDocumentAPI = new LegalDocumentsAPI();
const salaryAdjustmentAPI = new SalaryAdjustmentAPI();
const payrollAPI = new PayrollAPI();
const payrollComponentAPI = new PayrollComponentsAPI();

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
    BenefitModal,
    DocumentModal,
    SalaryModal,
  },
})
export default class EmployeeDetail extends Vue {
  // data
  employeeId: any;
  employeeData: any = ref([]);
  rowDocumentData: any = [];
  rowSalaryData: any = [];
  rowBenefitData: any = [];

  // options
  public documentTypeOptions: any[] = [];
  public adjustmentReasonOptions: any[] = [];
  public componentTypeOptions: any[] = [];
  public earningsComponentOptions: any[] = [];
  public deductionsComponentOptions: any[] = [];
  public statutoryComponentOptions: any[] = [];

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
  public showModal: boolean = false;
  public isSaving: boolean = false;
  public documentFormElement: any = ref();
  public salaryFormElement: any = ref();
  public benefitFormElement: any = ref();

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public deleteParam: any = null;

  // form
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // RECYCLE LIFE FUNCTION =======================================================
  created() {
    this.employeeId = this.$route.params.id;
    console.log("created", this.employeeId);
    this.loadData();
    this.loadAllTable();
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

  async handleShowModal(params: any, mode: any) {
    this.showModal = false;
    await this.$nextTick();

    this.modalMode = mode;
    if (typeof params === "string") {
      this.dataType = params;
    }

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        switch (this.dataType) {
          case "DOCUMENT":
            this.documentFormElement.initialize();
            break;
          case "SALARY":
            this.salaryFormElement.initialize();
            break;
          case "BENEFIT":
            this.benefitFormElement.initialize();
            break;
        }
      } else if (mode === $global.modeData.edit && params) {
        console.log("edit", params);
        this.loadEditDataModal(params);
      }
    });

    this.showModal = true;
  }

  handleSaveModal(formData: any) {
    const formattedData = this.formatModalData(formData);

    if (this.modalMode === $global.modeData.insert) {
      this.insertModalData(formattedData);
    } else {
      this.updateModalData(formattedData);
    }
  }

  handleEditModal(formData: any) {
    this.handleShowModal(formData, $global.modeData.edit);
  }

  handleDeleteModal(params: any) {
    this.deleteParam = { ...params };
    this.dialogAction = "delete";
    switch (this.dataType) {
      case "DOCUMENT":
        this.dialogMessage = this.$t(
          "messages.employee.confirm.deleteLegalDocument"
        );
        break;
      case "SALARY":
        this.dialogMessage = this.$t(
          "messages.employee.confirm.deleteSalaryAdjustment"
        );
        break;
      case "BENEFIT":
        this.dialogMessage = this.$t("messages.employee.confirm.deleteBenefit");
        break;
    }
    this.showDialog = true;
  }

  handleTableAction(params: any) {
    switch (params.event) {
      case "EDIT":
        this.dataType = params.type;
        this.handleEditModal(params.params);
        break;
      case "DELETE":
        this.dataType = params.type;
        this.handleDeleteModal(params.params);
        console.log("handleTableAction", this.dataType);
        break;
      default:
        this.dataType = "";
        this.showModal = false;
        this.handleShowModal(params.type, $global.modeData.insert);
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

  confirmAction() {
    this.deleteModalData();

    this.dialogAction = "";
  }

  handleBack() {
    this.$router.push({
      name: "Employee",
    });
  }

  closeModal() {
    this.dataType = "";
    this.showModal = false;
    this.isSaving = false;
  }

  refreshData(type: any) {
    this.loadDataGrid(type);
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
        this.rowDocumentData = documentData;
      } else {
        this.rowDocumentData = [];
      }

      const { data: salaryData } =
        await salaryAdjustmentAPI.GetSalaryAdjustmentListByEmployeeId(
          this.employeeId
        );
      if (salaryData) {
        this.rowSalaryData = salaryData;
      } else {
        this.rowSalaryData = [];
      }

      const { data: benefitData } =
        await payrollAPI.GetPayrollComponentListByEmployeeId(this.employeeId);
      if (benefitData) {
        this.rowBenefitData = benefitData;
      } else {
        this.rowBenefitData = [];
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(type: any = this.dataType) {
    try {
      console.log("loadDataGrid", this.dataType);
      switch (type) {
        case "DOCUMENT":
          const { data: documentData } =
            await legalDocumentAPI.GetLegalDocumentListByEmployeeId(
              this.employeeId
            );
          if (documentData) {
            this.rowDocumentData = documentData;
          } else {
            this.rowDocumentData = [];
          }
          break;
        case "SALARY":
          const { data: salaryData } =
            await salaryAdjustmentAPI.GetSalaryAdjustmentListByEmployeeId(
              this.employeeId
            );
          if (salaryData) {
            this.rowSalaryData = salaryData;
          } else {
            this.rowSalaryData = [];
          }
          break;
        case "BENEFIT":
          const { data: benefitData } =
            await payrollAPI.GetPayrollComponentListByEmployeeId(
              this.employeeId
            );
          if (benefitData) {
            this.rowBenefitData = benefitData;
          } else {
            this.rowBenefitData = [];
          }
          break;
      }
    } catch (error) {
      getError(error);
    }
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

  async loadEditDataModal(params: any) {
    try {
      switch (this.dataType) {
        case "DOCUMENT":
          const { data: document } = await legalDocumentAPI.GetLegalDocument(
            params.id
          );

          this.$nextTick(() => {
            this.documentFormElement.form = this.populateFormModal(document);
          });
          break;
        case "SALARY":
          const { data: salary } =
            await salaryAdjustmentAPI.GetSalaryAdjustment(params.id);
          this.$nextTick(() => {
            this.salaryFormElement.form = this.populateFormModal(salary);
          });
          break;
        case "BENEFIT":
          const { data: benefit } = await payrollAPI.GetEmployeePayroll(
            params.id
          );
          this.$nextTick(() => {
            this.benefitFormElement.form = this.populateFormModal(benefit);
          });
          break;
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

      promises.push(
        legalDocumentAPI.GetDocumentTypeList({}).then((response) => {
          this.documentTypeOptions = response.data;
        }),
        salaryAdjustmentAPI.GetAdjustmentReasonList({}).then((response) => {
          this.adjustmentReasonOptions = response.data;
        }),
        payrollComponentAPI.GetCategoryTypeList().then((response) => {
          this.componentTypeOptions = response.data;
        }),

        payrollComponentAPI.GetEarningsComponentList().then((response) => {
          this.earningsComponentOptions = response.data;
        }),
        payrollComponentAPI.GetDeductionsComponentList().then((response) => {
          this.deductionsComponentOptions = response.data;
        }),
        payrollComponentAPI.GetStatutoryComponentList({}).then((response) => {
          this.statutoryComponentOptions = response.data;
        })
      );

      await Promise.all(promises);

      console.log("earningsComponentOptions", this.earningsComponentOptions);
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
      console.log("insertModalData", formData);
      this.isSaving = true;
      switch (this.dataType) {
        case "DOCUMENT":
          const { status2: document } =
            await legalDocumentAPI.InsertLegalDocument(formData);
          if (document.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.saveDocument"));
          }
          break;
        case "SALARY":
          const { status2: salary } =
            await salaryAdjustmentAPI.InsertSalaryAdjustment(formData);
          if (salary.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.saveSalary"));
          }
          break;
        case "BENEFIT":
          const { status2: benefit } = await payrollAPI.InsertEmployeePayroll(
            formData
          );
          if (benefit.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.saveBenefit"));
          }
          // const selectedComponent = this.benefitOptions.find(
          //   (option: any) => option.code === formData.payroll_component_code
          // );
          // const finalAmount = formData.is_override
          //   ? parseFloat(formData.amount)
          //   : selectedComponent.default_amount;
          // const newBenefit = {
          //   id: formData.id,
          //   employee_id: this.employeeId,
          //   payroll_component_code: selectedComponent.code,
          //   payroll_component_name: selectedComponent.name,
          //   component_type: formData.component_type,
          //   category: selectedComponent.category,
          //   amount: finalAmount,
          //   qty: parseInt(formData.qty),
          //   effective_date: formData.effective_date,
          //   end_date: formData.end_date,
          //   remark: formData.remark,
          //   is_current:
          //     !formData.end_date || new Date(formData.end_date) > new Date(),
          //   is_override: formData.is_override,
          //   is_taxable: selectedComponent.is_taxable,
          //   is_fixed: selectedComponent.is_fixed,
          //   is_prorated: selectedComponent.is_prorated,
          //   is_included_in_bpjs_health:
          //     selectedComponent.is_included_in_bpjs_health,
          //   is_included_in_bpjs_employee:
          //     selectedComponent.is_included_in_bpjs_employee,
          //   is_show_in_payslip: selectedComponent.is_show_in_payslip,
          //   created_at: formatDateTimeUTC(new Date()),
          //   created_by: "Current User",
          //   updated_at: formatDateTimeUTC(new Date()),
          //   updated_by: "Current User",
          // };

          break;
      }

      this.$nextTick();
      this.loadDataGrid();
      this.loadDropdown();
      this.showForm = false;
      this.closeModal();
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateModalData(formData: any) {
    try {
      this.isSaving = true;
      switch (this.dataType) {
        case "DOCUMENT":
          const { status2: document } =
            await legalDocumentAPI.UpdateLegalDocument(formData);
          if (document.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.updateDocument")
            );
          }
          break;
        case "SALARY":
          const { status2: salary } =
            await salaryAdjustmentAPI.UpdateSalaryAdjustment(formData);
          if (salary.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.updateSalary"));
          }
          break;
        case "BENEFIT":
          const { status2: benefit } = await payrollAPI.UpdateEmployeePayroll(
            formData
          );
          if (benefit.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.updateBenefit"));
          }
          break;
      }
      this.$nextTick();
      this.loadDataGrid();
      this.loadDropdown();
      this.showForm = false;
      this.closeModal();
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteModalData() {
    try {
      this.isSaving = true;
      switch (this.dataType) {
        case "DOCUMENT":
          const { status2: document } =
            await legalDocumentAPI.DeleteLegalDocument(this.deleteParam.id);
          if (document.status === 0) {
            getToastSuccess(
              this.$t("messages.employee.success.deleteDocument")
            );
          }
          break;
        case "SALARY":
          const { status2: salary } =
            await salaryAdjustmentAPI.DeleteSalaryAdjustment(
              this.deleteParam.id
            );
          if (salary.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.deleteSalary"));
          }
          break;
        case "BENEFIT":
          const { status2: benefit } = await payrollAPI.DeleteEmployeePayroll(
            this.deleteParam.id
          );
          if (benefit.status === 0) {
            getToastSuccess(this.$t("messages.employee.success.deleteBenefit"));
          }
          break;
      }

      this.$nextTick();
      this.loadDataGrid();
      this.deleteParam = null;
      this.showDialog = false;
      this.dataType = "";
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
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

  formatModalData(params: any) {
    switch (this.dataType) {
      case "DOCUMENT":
        let issueDate;
        let expiryDate;
        if (this.modeData === $global.modeData.insert) {
          // issueDate = params.issue_date.split("T")[0];
          // expiryDate = params.expiry_date.split("T")[0];
          issueDate = params.issue_date;
          expiryDate = params.expiry_date;
        } else {
          // issueDate = params.issue_date;
          // expiryDate = params.expiry_date;
          issueDate = params.issue_date.split("T")[0];
          expiryDate = params.expiry_date.split("T")[0];
        }
        return {
          id: params.id ? params.id : null,
          employee_id: this.employeeId,

          document_type_code: params.document_type_code,
          issue_date: issueDate,
          expiry_date: expiryDate,
          status: params.status,
          remark: params.remark,

          // metadata -> database
          file_name: params.file_name,
          file_path: params.file_path,
          file_size: parseInt(params.file_size),
          file_type: params.file_type,

          // file ori -> backend
          file_content: params.file_content,

          // modified
          created_at: formatDateTimeUTC(params.created_at),
          created_by: params.created_by,
          updated_at: formatDateTimeUTC(params.updated_at),
          updated_by: params.updated_by,
        };
      case "SALARY":
        return {
          // employee information
          employee_id: this.employeeId,

          // adjustment information
          adjustment_reason_code: params.adjustment_reason_code,
          effective_date: formatDateTimeUTC(params.effective_date),
          end_date: formatDateTimeUTC(params.end_date),
          base_salary: parseFloat(params.base_salary),
          new_salary: parseFloat(params.new_salary),
          status: params.status,
          is_current: parseInt(params.is_current),
          difference_amount: parseFloat(params.difference_amount),
          percentage_change: parseFloat(params.percentage_change),
          remark: params.remark,

          // modified
          created_at: params.created_at,
          created_by: params.created_by,
          updated_at: params.updated_at,
          updated_by: params.updated_by,
        };
      case "BENEFIT":
        return {
          employee_id: this.employeeId,
          id: params.id,
          payroll_component_code: params.payroll_component_code,
          amount: parseFloat(params.amount),
          quantity: parseInt(params.quantity),
          effective_date: formatDateTimeUTC(params.effective_date),
          end_date: formatDateTimeUTC(params.end_date),
          remark: params.remark,
          is_current: parseInt(params.is_current),
          is_override: params.is_override ? 1 : 0,
          is_taxable: parseInt(params.is_taxable),
          is_fixed: parseInt(params.is_fixed),
          is_prorated: parseInt(params.is_prorated),
          is_included_in_bpjs_health: parseInt(
            params.is_included_in_bpjs_health
          ),
          is_included_in_bpjs_employee: parseInt(
            params.is_included_in_bpjs_employee
          ),
          is_show_in_payslip: parseInt(params.is_show_in_payslip),
          updated_at: formatDateTimeUTC(params.updated_at),
          updated_by: params.updated_by,
          created_at: formatDateTimeUTC(params.created_at),
          created_by: params.created_by,
        };
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

  populateFormModal(params: any) {
    switch (this.dataType) {
      case "DOCUMENT":
        return {
          id: params.id,
          employee_id: params.employee_id,
          Position: params.Position,
          Department: params.Department,
          Placement: params.Placement,
          document_type_code: params.document_type_code,
          issue_date: params.issue_date,
          expiry_date: params.expiry_date,
          status: params.status,
          remark: params.remark,

          file_name: params.file_name,
          file_path: params.file_path,
          file_size: parseInt(params.file_size),
          file_type: params.file_type,
          // file_content: params.file_content,

          // modified
          created_at: params.created_at,
          created_by: params.created_by,
          updated_at: params.updated_at,
          updated_by: params.updated_by,
        };
      case "SALARY":
        return {
          id: params.id,
          // employee information
          employee_id: params.employee_id,
          employee_name: params.employee_name,
          Position: params.PositionName,
          Department: params.DepartmentName,
          Placement: params.PlacementName,

          // adjustment information
          adjustment_reason_code: params.adjustment_reason_code,
          effective_date: params.effective_date,
          base_salary: parseFloat(params.base_salary),
          new_salary: parseFloat(params.new_salary),
          status: params.status,
          is_current: parseInt(params.is_current),
          difference_amount: parseFloat(params.difference_amount),
          percentage_change: parseFloat(params.percentage_change),
          remark: params.remark,

          // modified
          created_at: params.created_at,
          created_by: params.created_by,
          updated_at: params.updated_at,
          updated_by: params.updated_by,
        };
      case "BENEFIT":
        return {
          id: params.id,
          employee_id: this.employeeId,
          payroll_component_code: params.payroll_component_code,
          component_type: params.component_type,
          category_code: params.category_code,
          amount: params.amount,
          quantity: params.quantity,
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
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
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
}
