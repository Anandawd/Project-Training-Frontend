import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
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
  name: "FileDownloadOptions",
  components: {
    CCheckbox,
    CRadio,
  },
  props: {
    downloadOptions: {
      type: Object as () => Partial<FileOptions>,
      default: () => ({}),
    },
  },
  emits: ["back", "continue", "download"],
})
export default class FileDownloadOptions extends Vue {
  public fileList: any;
  public downloadOptions: any;
  public options: any = reactive({
    separatePerBank: true,
  });
  public bankData: BankData[] = [
    { bank: "BCA", amount: 40000000 },
    { bank: "Mandiri", amount: 25000000 },
    { bank: "BNI", amount: 20000000 },
    { bank: "BRI", amount: 15000000 },
    { bank: "Cash", amount: 10000000 },
  ];
  public formatCurrency = formatCurrency;

  // LIFECYCLE HOOKS
  created(): void {
    Object.assign(this.options, this.downloadOptions);
  }

  // GENERAL FUNCTION
  handleAction(mode: any) {
    const actionMode = mode;

    switch (actionMode) {
      case $global.modePayroll.back:
        this.handleBack();
        break;
      case $global.modePayroll.next:
        this.handleContinue();
        break;
      case $global.modePayroll.download:
        this.handleDownload();
        break;
      default:
        console.warn("Unsupported action mode:", actionMode);
        break;
    }
  }

  selectFormat(format: string) {
    this.options.fileFormat = format;
  }

  handleDownload(): void {
    this.$emit("download", this.options);
  }

  handleBack() {
    this.$emit("back");
  }

  handleContinue() {
    this.$emit("continue", this.options);
  }

  get filesList(): FileListItem[] {
    const extension = this.options.fileFormat === "excel" ? ".xlsx" : ".csv";
    const period = "April2025";

    return this.bankData.map((item) => ({
      bank: item.bank,
      filename: `${item.bank}_PayrollTransfer_${period}${extension}`,
      amount: item.amount,
    }));
  }

  get isFormatSelected() {
    return Boolean(this.options.fileFormat);
  }
}
