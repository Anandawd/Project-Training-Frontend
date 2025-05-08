import CDialog from "@/components/dialog/dialog.vue";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";
import CompletionStatus from "../completion-status/completion-status.vue";
import Confirmation from "../confirmation/confirmation.vue";
import DisbursementDetail from "../disbursement-detail/disbursement-detail.vue";
import FileDownloadOptions from "../file-download-options/file-download-options.vue";
import PaymentMethodSelection from "../payment-method-selection/payment-method-selection.vue";

@Options({
  components: {
    DisbursementDetail,
    PaymentMethodSelection,
    FileDownloadOptions,
    Confirmation,
    CompletionStatus,
    CDialog,
  },
})
export default class PayrollDisbursementProcess extends Vue {
  public modeData: any;
  public currentStep: number = 1;
  public periodData: any = reactive({});
  public selectedPaymentMethod: string = "";
  public downloadOptions: any = reactive({});
  public periodId: string = "";
  public showStepper: boolean = true;

  // Dialog
  public showDialog: boolean = false;
  public dialogAction: string = "";
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogParams: any;

  // LIFECYCLE HOOKS
  async created() {
    const periodId = this.$route.params.id as string;

    await this.loadPeriodData();
  }

  // GENERAL FUNCTION
  handleAction(params: any, mode: any = null, ...additonalParams: any[]) {
    const actionMode = mode || this.modeData;

    switch (actionMode) {
      case $global.modePayroll.back:
        this.handleBack();
        break;
      case $global.modePayroll.next:
        this.handleNext();
        break;
      case $global.modePayroll.complete:
        this.handleComplete();
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
      default:
        console.warn("Unsupported action mode:", actionMode);
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
    this.$router.push({ name: "PayrollDisbursement" });
  }

  handleComplete() {
    this.showConfirmationDialog(
      $global.dialogActions.complete,
      this.$t("title.confirm"),
      this.$t("messages.payroll.completeConfirmation")
    );
  }

  handleDownload(options: any) {
    getToastSuccess(this.$t("messages.disbursement.downloadSuccess"));
  }

  handleMethodSelection(method: string) {
    this.selectedPaymentMethod = method;
  }

  handleDownloadOptions(options: any) {
    Object.assign(this.downloadOptions, options);
  }

  // API METHOD
  async loadPeriodData() {
    try {
      // In a real implementation, this would be an API call
      // const { data } = await payrollAPI.GetPayrollDisbursementDetail(periodId);
      // this.periodData = data;
      await this.loadMockDisbursementData();
    } catch (error) {
      getError(error);
    }
  }

  async loadMockDisbursementData() {
    this.periodData = {
      id: this.periodId || 1,
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
        this.$t("messages.disbursement.completeDisbursement") as string
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
