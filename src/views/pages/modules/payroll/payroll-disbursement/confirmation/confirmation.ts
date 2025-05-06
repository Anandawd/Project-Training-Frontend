import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInputFile from "@/components/input-file/input-file.vue";
import CInput from "@/components/input/input.vue";
import { formatCurrency } from "@/utils/format";
import "ag-grid-enterprise";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";

interface FileOptions {
  fileFormat: string;
  separatePerBank: boolean;
  includeEmployeeId: boolean;
  includeEmployeeName: boolean;
}

interface BankData {
  bank: string;
  amount: number;
}

interface FileListItem {
  bank: string;
  filename: string;
  amount: number;
}

@Options({
  name: "Confirmation",
  components: {
    CInput,
    CDialog,
    CCheckbox,
    CInputFile,
  },
  props: {
    periodData: {
      type: Object,
      required: true,
    },
    selectedMethod: {
      type: String,
      default: "manual",
    },
    downloadOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["complete", "back"],
})
export default class Confirmation extends Vue {
  // props
  public periodData!: any;
  public selectedMethod!: string;
  public downloadOptions: any;

  public uploadedFiles: Record<string, File> = reactive({});

  public confirmations = reactive({
    paymentsProcessed: false,
    documentsUploaded: false,
  });

  public bankSummary = [
    { name: "BCA", amount: 40000000 },
    { name: "Mandiri", amount: 25000000 },
    { name: "BNI", amount: 20000000 },
    { name: "BRI", amount: 15000000 },
    { name: "Cash", amount: 10000000 },
  ];

  // Dialog
  public showDialog: boolean = false;
  public dialogTitle: string = "Confirm";
  public dialogMessage: string = "";
  public dialogAction: string = "";

  public formatCurrency = formatCurrency;

  // LIFECYCLE HOOKS
  created(): void {}

  handleFileUpload(event: any, bankName: string): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showErrorDialog(
        this.$t("messages.payroll.fileSizeExceeded").toString()
      );
      return;
    }

    this.uploadedFiles[bankName] = file;
  }

  handleBack() {
    this.dialogTitle = this.$t("title.confirmation").toString();
    this.dialogMessage = this.$t(
      "messages.payroll.cancelConfirmation"
    ).toString();
    this.dialogAction = "cancel";
    this.showDialog = true;
  }

  handleComplete() {
    if (!this.isFormValid) {
      return;
    }
    this.$emit("complete");
    // this.dialogTitle = this.$t("title.confirmation").toString();
    // this.dialogMessage = this.$t(
    //   "messages.payroll.completeConfirmation"
    // ).toString();
    // this.dialogAction = "complete";
    // this.showDialog = true;
  }

  showErrorDialog(message: string) {
    this.dialogTitle = this.$t("title.error").toString();
    this.dialogMessage = message;
    this.dialogAction = "error";
    this.showDialog = true;
  }

  confirmAction() {
    if (this.dialogAction === "complete") {
      this.completeProcess();
    } else if (this.dialogAction === "cancel") {
      this.cancelProcess();
    }

    this.showDialog = false;
  }

  completeProcess() {
    this.$emit("complete");
  }

  cancelProcess(): void {
    this.$emit("back");
  }

  // COMPUTED PROPERTIES
  get isFormValid(): boolean {
    const hasUploadedFiles = Object.keys(this.uploadedFiles).length > 0;

    return (
      this.confirmations.paymentsProcessed &&
      this.confirmations.documentsUploaded
      // &&
      // hasUploadedFiles
    );
  }

  get paymentMethodName(): string {
    return this.selectedMethod === "manual"
      ? "Manual Bank Transfer"
      : "Automatic Payment";
  }
}
