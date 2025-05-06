import CDialog from "@/components/dialog/dialog.vue";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "CompletionStatus",
  components: {
    CDialog,
  },
  props: {
    periodData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  emits: ["return"],
})
export default class CompletionStatus extends Vue {
  // props
  public periodData!: any;
  public completionTime: string = new Date().toLocaleString();
  public processedBy: string = "Financial Admin";

  public bankStatus = [
    {
      name: "BCA",
      status: "Completed - Receipt uploaded",
      statusClass: "text-success",
    },
    {
      name: "Mandiri",
      status: "Completed - Receipt uploaded",
      statusClass: "text-success",
    },
    {
      name: "BNI",
      status: "Completed - Receipt uploaded",
      statusClass: "text-success",
    },
    {
      name: "BRI",
      status: "Completed - Receipt uploaded",
      statusClass: "text-success",
    },
    {
      name: "Cash",
      status: "Completed - Manual processing",
      statusClass: "text-success",
    },
  ];

  // Dialog
  public showDialog: boolean = false;
  public dialogTitle: string = "Confirm";
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // LIFECYCLE HOOKS
  created(): void {}

  // HANDLER
  handleBack() {
    this.dialogTitle = this.$t("title.confirmation").toString();
    this.dialogMessage = this.$t(
      "messages.payroll.cancelConfirmation"
    ).toString();
    this.dialogAction = "cancel";
    this.showDialog = true;
  }

  handleReturn() {
    this.$emit("return");
  }

  handleDownloadSummary() {
    try {
      // In a real implementation, this would trigger a file download
      // const { data } = await payrollAPI.DownloadDisbursementSummary(this.periodData.id);

      // For demonstration, just show success message
      getToastSuccess("Summary report downloaded successfully");
    } catch (error) {
      getError(error);
    }
  }

  handleEmailConfirmation() {
    try {
      // In a real implementation, this would send an email confirmation
      // const { status2 } = await payrollAPI.SendEmailConfirmation({
      //   periodId: this.periodData.id
      // });

      this.dialogMessage = this.$t("messages.payroll.sendEmailConfirmation");
      this.dialogAction = "sendEmail";
      this.showDialog = true;
    } catch (error) {
      getError(error);
    }
  }

  confirmAction() {
    if (this.dialogAction === "sendEmail") {
      // Simulate successful email sending
      getToastSuccess("Email confirmation sent successfully");
    }

    this.showDialog = false;
  }

  // API
}
