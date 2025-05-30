import CDatepicker from "@/components/datepicker/datepicker.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import { getToastError, getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { Options, Vue } from "vue-class-component";

interface ImportRecord {
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string;
  check_out: string;
  status: string;
  remark: string;
  errors?: string[];
  warnings?: string[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

@Options({
  components: {
    CModal,
    CSelect,
    CDatepicker,
  },
  props: {
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    statusOptions: {
      type: Array,
      default: (): any[] => [],
    },
    attendanceData: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["imported", "exported"],
})
export default class AttendanceImportExport extends Vue {
  // options data
  employeeOptions!: any[];
  statusOptions!: any[];
  attendanceData!: any[];
  exportFormatOptions = [
    { code: "xlsx", name: "Excel (.xlsx)" },
    { code: "csv", name: "CSV (.csv)" },
  ];

  // Export
  public showExportModal = false;
  public exportForm = {
    format: "xlsx",
    startDate: "",
    endDate: "",
    includeTemplate: false,
  };

  // Import
  public showImportModal = false;
  public showProgressModal = false;
  public importData: ImportRecord[] = [];
  public processedCount = 0;
  public totalCount = 0;

  // RECYCLE LIFE FUNCTION =======================================================
  created(): void {}

  // GENERAL FUNCTION =======================================================
  showExport() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.exportForm.startDate = firstDay.toISOString().split("T")[0];
    this.exportForm.endDate = today.toISOString().split("T")[0];
    this.showExportModal = true;
  }

  showImport() {
    this.importData = [];
    this.showImportModal = true;
  }

  async handleExport() {
    try {
      const exportData = this.getExportData();
      if (this.exportForm.format === "xlsx") {
        await this.exportToExcel(exportData);
      } else {
        await this.exportToCSV(exportData);
      }

      this.showExportModal = false;
      this.$emit("exported");
      getToastSuccess(this.$t("messages.attendance.success.export"));
    } catch (error) {
      getToastError(this.$t("messages.attendance.error.export"));
    }
  }

  async handleImport() {}

  handleCloseImport() {
    this.showExportModal = false;
    this.importData = [];
    const fileInput = this.$refs.fileInput as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  handleFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.readFile(file);
  }

  // API REQUEST =======================================================
  async exportToExcel(data: any[]) {}
  async exportToCSV(data: any[]) {}
  downloadTemplate() {}
  processImportData(rawData: any[]) {}

  // HELPER =======================================================
  readFile(file: File) {}
  getExportData() {
    const startDate = new Date(this.exportForm.startDate);
    const endDate = new Date(this.exportForm.endDate);

    return this.attendanceData
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      })
      .map((item) => ({
        "Employee ID": item.employee_id,
        "Employee Name": item.employee_name,
        Department: item.department_name,
        Position: item.position_name,
        Date: item.date,
        "Check In": item.check_in,
        "Check Out": item.check_out,
        "Working Hours": item.working_hours,
        Overtime: item.overtime,
        Status: item.status,
        Remark: item.remark,
      }));
  }
  // GETTER AND SETTER =======================================================
}
