import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInputFile from "@/components/input-file/input-file.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import LegalDocumentsAPI from "@/services/api/payroll/legal-documents/legal-document";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

const legalDocumentsAPI = new LegalDocumentsAPI();

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CInputFile,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    documentTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  employeeOptions!: any[];
  documentTypeOptions!: any[];

  // file properties
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  fileInputRef: any = ref();

  // File Preview Properties
  public filePreview: any = reactive({
    show: false,
    fileName: "",
    fileSize: "",
    mimeType: "",
    lastModified: "",
    url: "",
    type: "", // 'image', 'pdf', 'document', 'generic'
    dimensions: null,
    processing: false,
    progress: 0,
  });

  // File validation constants
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  public form: any = reactive({});

  columnOptions = [
    {
      label: "name",
      field: "FullName",
      align: "left",
      width: "200",
    },
    {
      field: "employee_id",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: "",
      employee_id: "",
      Position: "",
      Department: "",
      Placement: "",
      document_type_code: "",

      file: "",
      file_name: "",
      file_path: "",
      file_size: 0,
      file_type: "",
      file_content: "",

      issue_date: "",
      expiry_date: "",
      remark: "",
      status: "",

      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
    };

    this.selectedFile = null;
    this.clearFileData();
  }

  async initialize() {
    this.resetForm();

    if (this.modeData === $global.modeData.edit) {
      await this.$nextTick();
      await this.loadExistingFile();
    }
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  async onSave() {
    console.log("onSave", this.form);
    this.form.status = this.calculateDocumentStatus();
    this.$emit("save", this.form);
  }

  checkForm() {
    console.log(this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onEmployeeChange() {
    if (this.form.employee_id) {
      const selectedEmployee = this.employeeOptions.find(
        (emp: any) => emp.employee_id === this.form.employee_id
      );

      if (selectedEmployee) {
        this.form.employee_name = selectedEmployee.FullName;
        this.form.Position = selectedEmployee.Position;
        this.form.Department = selectedEmployee.Department;
        this.form.Placement = selectedEmployee.Placement;
      }
    } else {
      this.form.employee_name = "";
      this.form.Position = "";
      this.form.Department = "";
      this.form.Placement = "";
    }
  }

  onDocumentTypeChange() {
    const selected = this.documentTypeOptions.find(
      (d: any) => d.code === this.form.document_type_code
    );

    if (selected) {
      this.form.document_type_code = selected.code;
      this.form.is_allow_expiry = selected.is_allow_expiry;
    } else {
      this.form.document_type_code = "";
      this.form.is_allow_expiry = 0;
    }
  }

  async loadExistingFile() {
    if (
      this.modeData === $global.modeData.edit &&
      this.form.file_name &&
      this.form.file_path
    ) {
      try {
        const mockFile = this.createMockFileFromData();

        if (mockFile) {
          await this.generateFilePreview(mockFile);

          this.filePreview.fileName = this.form.file_name;
          this.filePreview.fileSize = this.formatFileSize(this.form.file_size);
          this.filePreview.mimeType = this.form.file_type;
          this.filePreview.show = true;

          const baseUrl = "http://127.0.0.1:9000";
          this.filePreview.url = `${baseUrl}${this.form.file_path}${this.form.file_name}`;
        }
      } catch (error) {
        console.warn("Could not load existing file preview:", error);
      }
    }
  }

  createMockFileFromData(): File | null {
    if (!this.form.file_name || !this.form.file_type) {
      return null;
    }

    try {
      const blob = new Blob([], { type: this.form.file_type });
      const file = new File([blob], this.form.file_name, {
        type: this.form.file_type,
        lastModified: Date.now(),
      });
      Object.defineProperty(file, "size", {
        value: this.form.file_size,
        writable: false,
      });

      return file;
    } catch (error) {
      console.error("Error creating mock file:", error);
      return null;
    }
  }

  // FILE HANDLING ========================================
  async onFileChange(file: File | null) {
    console.log("File changed:", file);

    if (!file) {
      this.clearFileData();
      return;
    }

    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        getToastError(validation.message);
        this.clearFileData();
        return;
      }

      // Store the file and update form data
      this.selectedFile = file;
      this.formatFileData(file);

      // Generate preview
      await this.generateFilePreview(file);

      getToastSuccess("File berhasil dipilih dan preview tersedia");
    } catch (error) {
      getToastError("Terjadi kesalahan saat memproses file");
      this.clearFileData();
    }
  }

  validateFile(file: File): { isValid: boolean; message: string } {
    // Check file size (max 50MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: `Ukuran file maksimal ${this.formatFileSize(
          maxSize
        )} (saat ini: ${this.formatFileSize(file.size)})`,
      };
    }

    // Check minimum file size (1KB)
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
      return {
        isValid: false,
        message: "File terlalu kecil, minimal 1KB",
      };
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Tipe file tidak diizinkan. Gunakan PDF, JPEG, JPG, atau PNG",
      };
    }

    return { isValid: true, message: "" };
  }

  formatFileData(file: File) {
    this.form.file_name = file.name;
    this.form.file_size = parseInt(file.size.toString());
    this.form.file_type = file.type;
    this.form.file_path = "/uploads/legal-document/";
  }

  clearFileData() {
    this.selectedFile = null;
    this.form.file_name = "";
    this.form.file_size = 0;
    this.form.file_type = "";
    this.form.file_path = "";
    this.cleanupPreview();

    if (this.fileInputRef && this.fileInputRef.selectedFiles) {
      this.fileInputRef.selectedFiles = [];
    }
  }

  // FILE PREVIEW METHODS =================================
  async generateFilePreview(file: File) {
    try {
      this.filePreview.processing = true;
      this.filePreview.progress = 0;

      // Basic file info
      this.filePreview.fileName = file.name;
      this.filePreview.fileSize = this.formatFileSize(file.size);
      this.filePreview.mimeType = file.type;
      this.filePreview.lastModified = new Date(
        file.lastModified
      ).toLocaleDateString();

      // Simulate processing progress
      await this.updateProgress(20);

      // Generate preview based on file type
      if (this.isImageFile(file)) {
        await this.generateImagePreview(file);
      } else if (this.isPdfFile(file)) {
        await this.generatePdfPreview(file);
      } else if (this.isDocumentFile(file)) {
        await this.generateDocumentPreview(file);
      } else {
        await this.generateGenericPreview(file);
      }

      await this.updateProgress(100);

      this.filePreview.processing = false;
      this.filePreview.show = true;
    } catch (error) {
      console.error("Error generating preview:", error);
      this.filePreview.processing = false;
      getToastError("Gagal membuat preview file");
    }
  }

  async generateImagePreview(file: File) {
    this.filePreview.type = "image";
    this.filePreview.url = URL.createObjectURL(file);

    await this.updateProgress(50);

    // Get image dimensions
    try {
      const dimensions = await this.getImageDimensions(this.filePreview.url);
      this.filePreview.dimensions = dimensions;
    } catch (error) {
      console.warn("Could not get image dimensions:", error);
    }

    await this.updateProgress(80);
  }

  async generatePdfPreview(file: File) {
    this.filePreview.type = "pdf";
    this.filePreview.url = URL.createObjectURL(file);
    await this.updateProgress(80);
  }

  async generateDocumentPreview(file: File) {
    this.filePreview.type = "document";
    this.filePreview.url = URL.createObjectURL(file);
    await this.updateProgress(80);
  }

  async generateGenericPreview(file: File) {
    this.filePreview.type = "generic";
    this.filePreview.url = URL.createObjectURL(file);
    await this.updateProgress(80);
  }

  async getImageDimensions(
    url: string
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // FILE TYPE CHECKERS ===================================
  isImageFile(file: File): boolean {
    return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
      file.type
    );
  }

  isPdfFile(file: File): boolean {
    return file.type === "application/pdf";
  }

  isDocumentFile(file: File): boolean {
    return [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type);
  }

  // PREVIEW ACTIONS ======================================
  removeFilePreview() {
    this.clearFileData();
    getToastSuccess("File telah dihapus");
  }

  downloadPreview() {
    if (this.selectedFile && this.filePreview.url) {
      const link = document.createElement("a");
      link.href = this.filePreview.url;
      link.download = this.selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  openPdfInNewTab() {
    if (this.filePreview.url) {
      window.open(this.filePreview.url, "_blank");
    }
  }

  cleanupPreview() {
    if (this.filePreview.url) {
      URL.revokeObjectURL(this.filePreview.url);
    }

    this.filePreview.show = false;
    this.filePreview.fileName = "";
    this.filePreview.fileSize = "";
    this.filePreview.mimeType = "";
    this.filePreview.lastModified = "";
    this.filePreview.url = "";
    this.filePreview.type = "";
    this.filePreview.dimensions = null;
    this.filePreview.processing = false;
    this.filePreview.progress = 0;
  }

  async updateProgress(progress: number) {
    this.filePreview.progress = progress;
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // EXISTING METHODS =====================================
  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () =>
        reject(new Error("Failed to convert file to base64"));
      reader.readAsDataURL(file);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  calculateDocumentStatus(): string {
    if (!this.form.expiry_date) return "VALID";
    if (this.form.expiry_date === "0001-01-01T00:00:00Z") return "VALID";
    if (this.form.expiry_date === "0001-01-01") return "VALID";
    console.log("calculateDocumentStatus call");

    const today = new Date();
    const expiry = new Date(this.form.expiry_date);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "EXPIRED";
    // if (diffDays <= 30) return "EXPIRING SOON";
    return "VALID";
  }
  // validation
  get schema() {
    return Yup.object().shape({
      SelectEmployee: Yup.string().required(),
      DocumentType: Yup.string().required(),
      // DocumentFile: Yup.string().required(),
      IssueDate: Yup.date().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }

  get showExpiryDate() {
    const selectedDocType = this.documentTypeOptions.find(
      (doc: any) => doc.code === this.form.document_type_code
    );
    return selectedDocType?.is_allow_expiry === 1;
  }
}
