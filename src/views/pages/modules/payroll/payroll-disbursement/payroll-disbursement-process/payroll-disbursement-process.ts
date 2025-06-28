import CDialog from "@/components/dialog/dialog.vue";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import Step1DisbursementDetail from "../components/step-1-disbursement-detail/disbursement-detail.vue";
import Step2PaymentMethodSelection from "../components/step-2-payment-method-selection/payment-method-selection.vue";
import Step3FileDownloadOptions from "../components/step-3-file-download-options/file-download-options.vue";
import Step4Confirmation from "../components/step-4-confirmation/confirmation.vue";
import Step5CompletionStatus from "../components/step-5-completion-status/completion-status.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();

@Options({
  components: {
    Step1DisbursementDetail,
    Step2PaymentMethodSelection,
    Step3FileDownloadOptions,
    Step4Confirmation,
    Step5CompletionStatus,
    CDialog,
  },
})
export default class PayrollDisbursementProcess extends Vue {
  // data
  public rowData: any = [];
  public modeData: any;
  public periodCode: any = ref("");
  public disbursementData: any = reactive({});
  public currentStep: number = 1;
  public isSaving: boolean = false;
  public isLoading: boolean = false;

  // options data
  public downloadOptions: any = [];
  public selectedPaymentMethod: string = "";

  // dialog
  public showDialog: boolean = false;
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public dialogParams: any = reactive({});

  // RECYCLE LIFE FUNCTION =======================================================
  beforeMount() {
    this.periodCode = this.$route.params.periodCode as string;
  }

  async mounted() {
    this.loadMockdisbursementData();
    // await this.loadData();
  }

  // GENERAL FUNCTION =======================================================
  handleAction(params: any, mode: any = null, ...additonalParams: any[]) {
    this.modeData = mode;
    switch (this.modeData) {
      case $global.modePayroll.back:
        this.handleBack();
        break;
      case $global.modePayroll.next:
        this.handleNext();
        break;
      case $global.modePayroll.complete:
        this.completeDisbursement();
        break;
      case $global.modePayroll.process:
        break;
      case $global.modePayroll.methodSelection:
        this.handleMethodSelection(additonalParams[0]);
        break;
      case $global.modePayroll.download:
        this.handleDownload(additonalParams[0]);
        break;
      case $global.modePayroll.downloadSelection:
        this.handleDownloadOptions(additonalParams[0]);
        this.handleNext();
        break;
      case $global.modePayroll.return:
        this.handleReturn();
        break;
    }
  }

  showConfirmationDialog(
    action: string,
    title: string = "Confirm",
    message: string,
    params: any = null
  ): void {
    this.dialogAction = action;
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogParams = params;
    this.showDialog = true;
  }

  confirmAction() {
    switch (this.dialogAction) {
      case $global.dialogActions.save:
        break;
      case $global.dialogActions.delete:
        break;
      case $global.dialogActions.process:
        break;
      case $global.dialogActions.submit:
        break;
      case $global.dialogActions.complete:
        this.completeDisbursement();
        break;
      case $global.dialogActions.saveAndReturn:
        break;
      default:
        console.warn("Unsupported dialog action:", this.dialogAction);
    }

    this.showDialog = false;
    this.dialogParams = null;
  }

  handleBack() {
    if (this.currentStep > 1 && this.currentStep < 5) {
      this.currentStep--;
    } else {
      this.handleReturn();
    }
  }

  handleNext() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  handleReturn() {
    this.$router.push({ name: "Disbursement" });
  }

  handleComplete() {}

  handleDownload(options: any) {
    getToastSuccess(this.$t("messages.payroll.success.downloadSuccess"));
  }

  handleMethodSelection(method: string) {
    this.selectedPaymentMethod = method;
  }

  handleDownloadOptions(options: any) {
    Object.assign(this.downloadOptions, options);
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.isLoading = true;
      const { data } = await payrollPeriodsAPI.GetPayrollPeriods(
        this.periodCode
      );
      if (data) {
        this.disbursementData = data[0];
      } else {
        this.disbursementData = [];
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMockdisbursementData() {
    this.disbursementData = {
      period_code: this.periodCode,
      period_name: "April 2025",
      placement: "Amora Ubud",
      period_type: "Monthly",
      start_date: "01/04/2025",
      end_date: "30/04/2025",
      payment_date: "01/05/2025",
      total_employees: 5,
      total_payment: 25000000,
      current_level: 2,
      total_level: 2,
      remark: "",
      status: "Ready to Payment",
      created_by: "Budi Admin",
      approved_by: "Finance Manager",
      created_at: "25/04/2025",
      updated_at: "25/04/2025",
    };
  }

  async updateData(formData: any, step: any) {
    try {
      this.isSaving = true;
      const newData = {
        ...formData,
        current_step: step,
      };
      // const { status2 } =
      //   await payrollPeriodsAPI.UpdatePayrollProcessing(newData);
      // if (status2.status == 0) {
      //   getToastSuccess(this.$t("messages.payroll.success.updateStepper"));
      // }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async completeDisbursement() {
    try {
      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.completeDisbursement({
      //   periodId: this.periodId,
      //   method: this.selectedPaymentMethod,
      //   options: this.downloadOptions
      // });

      // Mock processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      getToastSuccess(
        this.$t("messages.payroll.completeDisbursement") as string
      );
      this.handleNext();
    } catch (error) {
      getError(error);
    }
  }

  // SETTER GETTER
  get isShowStepper() {
    if (this.currentStep >= 1 && this.currentStep < 5) {
      return true;
    } else {
      return false;
    }
  }
}
