import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInputFile from "@/components/input-file/input-file.vue";
import CInput from "@/components/input/input.vue";
import { formatCurrency } from "@/utils/format";
import $global from "@/utils/global";
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

  public modeData: any;
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
  public dialogAction: string = "";
  public dialogTitle: string = "";
  public dialogMessage: string = "";
  public dialogParams: any;

  public formatCurrency = formatCurrency;

  // LIFECYCLE HOOKS
  created(): void {}

  // GENERAL FUNCTION
  handleAction(params: any, mode: any = null, ...additonalParams: any[]) {
    const actionMode = mode || this.modeData;

    switch (actionMode) {
      case $global.modePayroll.back:
        this.handleBack();
        break;
      case $global.modePayroll.complete:
        console.info("Button complete clicked");
        this.handleComplete();
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
    this.showDialog = false;
    switch (this.dialogAction) {
      case $global.dialogActions.cancel:
        this.cancelProcess();
        break;
      case $global.dialogActions.complete:
        this.completeProcess();
        break;
      default:
        console.warn("Unsupported dialog action:", this.dialogAction);
    }

    this.dialogParams = null;
  }

  handleFileUpload(event: any, bankName: string): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showConfirmationDialog(
        $global.dialogActions.error,
        this.$t("title.error"),
        this.$t("messages.payroll.fileSizeExceeded")
      );
      return;
    }

    this.uploadedFiles[bankName] = file;
  }

  handleComplete() {
    if (!this.isFormValid) {
      return;
    }
    this.showConfirmationDialog(
      $global.dialogActions.complete,
      this.$t("title.confirm"),
      this.$t("messages.payroll.completeConfirmation")
    );
  }

  handleBack() {
    this.showConfirmationDialog(
      $global.dialogActions.cancel,
      this.$t("title.confirm"),
      this.$t("messages.payroll.cancelConfirmation")
    );
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
