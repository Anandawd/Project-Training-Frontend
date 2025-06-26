import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import PayrollAPI from "@/services/api/payroll/payroll/payroll";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import BenefitModal from "../../../employee/components/benefit-modal/benefit-modal.vue";
import EmployeeInformation from "../../components/employee-information/employee-information.vue";
import PayrollCard from "../../components/payroll-card/payroll-card.vue";
import ProrateModal from "../../components/prorate-modal/prorate-modal.vue";
import TaxCard from "../../components/tax-card/tax-card.vue";
import TotalPaymentCard from "../../components/total-payment-card/total-payment-card.vue";
import CInputForm from "./component-input-form/component-input-form.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();
const payrollAPI = new PayrollAPI();
const employeeAPI = new EmployeeAPI();

@Options({
  name: "EmployeePayrollDetail",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CInputForm,
    CModal,
    ProrateModal,
    BenefitModal,
    EmployeeInformation,
    PayrollCard,
    TotalPaymentCard,
    TaxCard,
  },
})
export default class EmployeePayrollDetail extends Vue {
  // data
  periodCode: any = "";
  employeeId: any = "";

  // form
  public isSaving: boolean = false;
  public isReadOnly: boolean = false;

  // benefit
  public showModalBenefit: boolean = false;
  modalBenefitFormElement: any = ref();

  // prorate
  public showModalProrate: boolean = false;
  modalProrateFormElement: any = ref();

  // options data
  public taxIncomeOptions: any = [];
  public taxMethodOptions: any = [];

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // Employee Data
  public employeeData: any = ref();
  public employeePayrollData: any = ref();
  public payrollData: any = ref();
  public taxData: any = ref();

  // Payroll Data
  public earningsComponents: any = reactive([]);
  public deductionsComponents: any = reactive([]);
  public statutoryComponents: any = reactive([]);

  // Period data
  public periodData: any = reactive({
    id: 0,
    period_name: "",
    placement: "",
    period_type: "",
    start_date: "",
    end_date: "",
    payment_date: "",
    remark: "",
    status: "",
    created_by: "",
    created_at: "",
    updated_at: "",
  });

  // Payroll Components
  public payrollComponents: any = reactive([]);

  // RECYCLE LIFE FUNCTION =======================================================
  beforeMount(): void {
    this.periodCode = this.$route.params.periodCode;
    this.employeeId = this.$route.params.employeeId;
  }

  async mounted() {
    await this.loadData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowModal(params: any) {
    this.showModalBenefit = false;
    this.showModalProrate = false;
    await this.$nextTick();

    switch (params) {
      case "BENEFIT":
        this.showModalBenefit = true;
        this.modalBenefitFormElement.initialize();
        break;
      case "PRORATE":
        this.showModalProrate = true;
        this.modalProrateFormElement.initialize();
        break;
    }
  }

  handleSubmitForApproval() {
    this.dialogMessage = this.$t(
      "messages.payroll.confirm.submitEmployeePayrollForApproval"
    );
    this.dialogAction = "submit";
    this.showDialog = true;
  }

  confirmAction() {
    switch (this.dialogAction) {
      case "submit":
        this.submitPayroll();
        break;
      case "saveAndhandleBack":
        this.savePayroll().then(() => {
          this.$router.push({
            name: "PeriodDetail",
            params: { code: this.periodCode },
          });
        });
        break;
    }
  }

  handleBack() {
    // if (this.form.status === "Draft") {
    //   this.dialogMessage =
    //     "You have unsaved changes. Do you want to save before going back?";
    //   this.dialogAction = "saveAndhandleBack";
    //   this.showDialog = true;
    // } else {
    //   this.$router.push({
    //     name: "PeriodDetail",
    //     params: { code: this.periodCode },
    //   });
    // }

    this.$router.push({
      name: "PeriodDetail",
      params: { code: this.periodCode },
    });
  }

  onSave() {}

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.isSaving = true;

      const { data: period } =
        await payrollPeriodsAPI.GetPayrollPeriodsByPeriodCode(this.periodCode);
      if (period) {
        this.periodData = period;
      } else {
        this.periodData = {};
      }

      const { data: employee } = await employeeAPI.GetEmployeeByEmployeeID(
        this.employeeId
      );
      if (employee) {
        this.employeeData = employee[0];
      } else {
        this.employeeData = {};
      }

      const { data: payrollData } =
        await payrollAPI.GetPayrollByPeriodCodeAndEmployeeId(
          this.periodCode,
          this.employeeId
        );
      if (payrollData) {
        this.payrollData = payrollData[0];
      } else {
        this.payrollData = {};
      }

      const { data: earnings } =
        await payrollAPI.GetEmployeePayrollEarningsComponent(this.employeeId);
      if (employee) {
        this.earningsComponents = earnings;
      } else {
        this.earningsComponents = [];
      }

      const { data: deductions } =
        await payrollAPI.GetEmployeePayrollDeductionsComponent(this.employeeId);
      if (employee) {
        this.deductionsComponents = deductions;
      } else {
        this.deductionsComponents = [];
      }

      const { data: tax } = await payrollAPI.GetTaxDetailByPayrollId(
        this.payrollData.id
      );
      if (employee) {
        this.taxData = tax;
      } else {
        this.taxData = {};
      }

      // this.calculateTotals();
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async savePayroll() {
    try {
      this.isSaving = true;

      // this.calculateTotals();

      getToastSuccess("Employee payroll submitted for approval");
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async saveProrate() {
    try {
      this.isSaving = true;

      this.showModalProrate = false;
      getToastSuccess("Prorate has been applied successfully");
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async saveBenefit() {
    try {
      this.isSaving = true;

      this.showModalBenefit = false;
      getToastSuccess("Component has been applied successfully");
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async submitPayroll() {
    try {
      this.isSaving = true;

      getToastSuccess("Employee payroll submitted for approval");
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER =======================================================
  // GETTER AND SETTER =======================================================

  // onComponentAmountChange(component: any) {
  //   if (component.is_fixed) {
  //     component.amount = component.original_amount;
  //     return;
  //   }

  //   if (component.is_prorated) {
  //     component.prorate_amount =
  //       component.amount * Number(this.form.prorate_factor);
  //   } else {
  //     component.prorate_amount = component.amount;
  //   }

  //   this.calculateTotals();
  // }

  // onComponentQuantityChange(component: AnyObject) {
  //   if (component.quantity < 0) {
  //     component.quantity = 0;
  //   }

  //   if (component.is_fixed) {
  //     component.quantity = 1;
  //   }

  //   if (component.is_prorated) {
  //     component.prorate_amount =
  //       component.amount * Number(this.form.prorate_factor);
  //   } else {
  //     component.prorate_amount = component.amount;
  //   }

  //   this.calculateTotals();
  // }
}
