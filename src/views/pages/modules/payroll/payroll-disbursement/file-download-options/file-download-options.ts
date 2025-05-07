import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
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
  emits: ["continue", "back", "options-selected"],
})
export default class FileDownloadOptions extends Vue {
  public fileList: any;
  public downloadOptions: any;
  public options: FileOptions = reactive({
    fileFormat: "csv",
    separatePerBank: true,
    includeEmployeeId: true,
    includeEmployeeName: true,
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
    console.info("bank:", this.bankData);
    console.info("fileList:", this.filesList);
  }

  handleDownload(): void {
    console.info("Downloading files with options:", this.options);
    this.$emit("options-selected", this.options);
  }

  handleBack() {
    this.$emit("back");
  }

  handleContinue() {
    this.$emit("options-selected", this.options);
    this.$emit("continue");
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
}
