import CDialog from "@/components/dialog/dialog.vue";
import { getError } from "@/utils/general";
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
  public currentStep: number = 1;
  public periodData: any = reactive({});
  public selectedPaymentMethod: string = "manual";
  public downloadOptions: any = reactive({});
  public periodId: string = "";

  // Dialog
  public showDialog: boolean = false;
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // LIFECYCLE HOOKS
  async created() {
    const periodId = this.$route.params.id as string;

    await this.loadPeriodData();
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

  goToNextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  goToPrevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // GENERAL FUNCTION
  handleBack() {
    if (this.currentStep === 1) {
      this.$router.push({
        name: "PayrollDisbursement",
        params: { id: this.periodId },
      });
    } else {
      this.goToPrevStep();
    }
  }

  handleReturn() {
    this.$router.push({ name: "PayrollDisbursement" });
  }

  async handleComplete() {
    this.dialogTitle = this.$t("title.confirm");
    this.dialogMessage = this.$t(
      "messages.payroll.completeConfirmation"
    ) as string;
    this.dialogAction = "complete";
    this.showDialog = true;
  }

  handleMethodSelection(method: string) {
    this.selectedPaymentMethod = method;
  }

  handleDownloadOptions(options: any) {
    Object.assign(this.downloadOptions, options);
  }

  confirmAction() {
    if (this.dialogAction === "complete") {
      this.processDisbursement();
    }
    this.showDialog = false;
  }

  // API
  async processDisbursement() {
    try {
      // In a real implementation, this would be an API call
      // const { status2 } = await payrollAPI.ProcessDisbursement({
      //   periodId: this.periodId,
      //   method: this.selectedPaymentMethod,
      //   options: this.downloadOptions
      // });

      // Mock processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      getToastSuccess(
        this.$t("messages.disbursement.processSuccess") as string
      );
      this.goToNextStep();
    } catch (error) {
      getError(error);
    }
  }
}
