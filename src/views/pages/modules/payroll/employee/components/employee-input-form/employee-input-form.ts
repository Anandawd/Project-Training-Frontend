// employee-input-form.ts - Tambahkan implementasi photo upload

import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import OrganizationAPI from "@/services/api/payroll/organization/organization";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

const organizationAPI = new OrganizationAPI();

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    employeeTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    genderOptions: {
      type: Array,
      default: (): any[] => [],
    },
    paymentFrequencyOptions: {
      type: Array,
      default: (): any[] => [],
    },
    maritalStatusOptions: {
      type: Array,
      default: (): any[] => [],
    },
    paymentMethodOptions: {
      type: Array,
      default: (): any[] => [],
    },
    bankOptions: {
      type: Array,
      default: (): any[] => [],
    },
    departmentOptions: {
      type: Array,
      default: (): any[] => [],
    },
    positionOptions: {
      type: Array,
      default: (): any[] => [],
    },
    placementOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  modeData!: number;
  employeeTypeOptions!: any[];
  genderOptions!: any[];
  paymentFrequencyOptions!: any[];
  maritalStatusOptions!: any[];
  paymentMethodOptions!: any[];
  bankOptions!: any[];
  departmentOptions!: any[];
  positionOptions!: any[];
  placementOptions!: any[];

  supervisorOptions: any = ref([]);

  // Photo upload properties
  photoFileInput: any = ref();
  selectedPhotoFile: File | null = null;
  photoPreviewUrl: string = "";
  uploadProgress: number = 0;
  isUploading: boolean = false;

  // File validation constants
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];
  private readonly RECOMMENDED_SIZE = { width: 1080, height: 1080 };

  inputFormValidation: any = ref();
  public defaultForm: any = {};
  public form: any = reactive({});

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  columnEmployeeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      label: "id",
      field: "employee_id",
      align: "right",
      width: "100",
    },
  ];

  created(): void {
    this.$watch(
      () => [this.form.status, this.form.employee_type],
      () => {
        this.handleEndDateLogic();
      }
    );

    this.$watch(
      () => this.form.department_code,
      async (newDepartment, oldDepartment) => {
        if (newDepartment !== oldDepartment) {
          this.form.supervisor_id = "";
          this.supervisorOptions = [];

          if (this.shouldShowSupervisor && newDepartment) {
            await this.loadSupervisor(newDepartment);
          }
        }
      }
    );

    this.$watch(
      () => this.form.position_code,
      async (newPosition, oldPosition) => {
        if (newPosition !== oldPosition) {
          this.form.supervisor_id = "";
          this.supervisorOptions = [];

          if (newPosition) {
            const selectedPosition = this.positionOptions.find(
              (p) => p.code === newPosition
            );

            if (selectedPosition) {
              if (selectedPosition.department_code) {
                this.form.department_code = selectedPosition.department_code;
              }
              if (selectedPosition.placement_code) {
                this.form.placement_code = selectedPosition.placement_code;
              }

              if (this.shouldShowSupervisor && this.form.department_code) {
                await this.loadSupervisor(this.form.department_code);
              }
            }
          }
        }
      }
    );
  }

  mounted(): void {
    this.handleEndDateLogic();

    if (this.form.profile_photo) {
      this.photoPreviewUrl = this.form.profile_photo;
    }
  }

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.resetPhotoUpload();

    this.form = {
      // personal information
      profile_photo: "",
      employee_id: "",
      first_name: "",
      last_name: "",
      gender: "Male",
      birth_date: "",
      phone: "",
      email: "",
      address: "",

      // employment information
      hire_date: "",
      end_date: "",
      status: "1",
      employee_type: "Permanent",
      position_code: "",
      department_code: "",
      placement_code: "",
      supervisor_id: "",

      // salary & payment information
      payment_frequency: "Monthly",
      payment_method: "Bank Transfer",
      bank_name: "BRI",
      bank_account_number: "",
      bank_account_name: "",

      // tax and identification data
      tax_number: "",
      identity_number: "",
      maritial_status: "TK0",
      health_insurance_number: "",
      social_security_number: "",

      // leave information
      annual_leave_quota: 0,
      annual_leave_remaining: 0,

      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
    };

    // Reset supervisor options
    this.supervisorOptions = [];
    this.handleEndDateLogic();
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    const formData = {
      ...this.form,
      photo_file_name: this.selectedPhotoFile?.name || "",
      photo_file_size: this.selectedPhotoFile?.size || 0,
      photo_file_type: this.selectedPhotoFile?.type || "",
    };

    this.$emit("save", formData);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async onPositionChange() {
    this.form.supervisor_id = "";
    this.supervisorOptions = [];

    if (this.form.position_code) {
      const selected = this.positionOptions.find(
        (p) => p.code === this.form.position_code
      );

      if (selected) {
        if (selected.department_code) {
          this.form.department_code = selected.department_code;
        }
        if (selected.placement_code) {
          this.form.placement_code = selected.placement_code;
        }

        if (this.shouldShowSupervisor && this.form.department_code) {
          await this.loadSupervisor(this.form.department_code);
        }
      } else {
        this.form.department_code = "";
        this.form.placement_code = "";
      }
    }
  }

  async onDepartmentChange() {
    this.form.supervisor_id = "";
    this.supervisorOptions = [];

    if (this.shouldShowSupervisor && this.form.department_code) {
      await this.loadSupervisor(this.form.department_code);
    }
  }

  onLeaveQuotaChange() {
    if (this.form.annual_leave_quota > 0) {
      this.form.annual_leave_remaining = this.form.annual_leave_quota;
    } else {
      this.form.annual_leave_remaining = 0;
    }
  }

  async loadSupervisor(params: any) {
    try {
      const { data } = await organizationAPI.GetSupervisorByDepartment(params);

      if (data) {
        this.supervisorOptions = data.map((s: any) => ({
          employee_id: s.employee_id,
          name: `${s.first_name} ${s.last_name}`,
        }));
      }
    } catch (error) {
      getError(error);
    }
  }

  private handleEndDateLogic() {
    if (this.isEndDateDisabled) {
      this.form.end_date = "";
    }
  }

  // PHOTO UPLOAD METHODS ===================================================
  triggerPhotoUpload() {
    if (this.photoFileInput) {
      this.photoFileInput.click();
    }
  }

  async handlePhotoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    try {
      // Validate file
      const validation = this.validatePhotoFile(file);
      if (!validation.isValid) {
        getToastError(validation.message);
        this.clearFileInput();
        return;
      }

      // Show loading state
      this.isUploading = true;
      this.uploadProgress = 0;

      // Create preview
      const previewUrl = await this.createPhotoPreview(file);

      // Validate image dimensions (optional)
      const dimensions = await this.getImageDimensions(previewUrl);
      if (dimensions.width < 200 || dimensions.height < 200) {
        getToastError(this.$t("messages.employee.error.photoTooSmall"));
        this.clearFileInput();
        this.isUploading = false;
        return;
      }

      // Set file and preview
      this.selectedPhotoFile = file;
      this.photoPreviewUrl = previewUrl;

      // Convert to base64 for form submission
      const base64 = await this.convertToBase64(file);
      this.form.profile_photo = base64;

      // Simulate upload progress (remove in production)
      await this.simulateUploadProgress();

      this.isUploading = false;
      getToastSuccess(this.$t("messages.employee.success.photoSelected"));
    } catch (error) {
      console.error("Error handling photo upload:", error);
      getToastError(this.$t("messages.employee.error.photoUploadFailed"));
      this.clearFileInput();
      this.isUploading = false;
    }
  }

  removePhoto() {
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = "";
    this.form.profile_photo = "";
    this.clearFileInput();

    getToastSuccess(this.$t("messages.employee.success.photoRemoved"));
  }

  private validatePhotoFile(file: File): { isValid: boolean; message: string } {
    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        message: this.$t("messages.employee.error.invalidPhotoType", {
          types: this.ALLOWED_TYPES.map((type) =>
            type.split("/")[1].toUpperCase()
          ).join(", "),
        }),
      };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        message: this.$t("messages.employee.error.photoTooLarge", {
          maxSize: this.formatFileSize(this.MAX_FILE_SIZE),
        }),
      };
    }

    return { isValid: true, message: "" };
  }

  private createPhotoPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  private getImageDimensions(
    src: string
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = src;
    });
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert file to base64"));
      };

      reader.readAsDataURL(file);
    });
  }

  private async simulateUploadProgress(): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        this.uploadProgress = Math.min(progress, 100);

        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private clearFileInput() {
    if (this.photoFileInput) {
      this.photoFileInput.value = "";
    }
  }

  private resetPhotoUpload() {
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = "";
    this.uploadProgress = 0;
    this.isUploading = false;
    this.clearFileInput();
  }

  // GETTERS =================================================================
  get schema() {
    return Yup.object().shape({
      // personal information
      EmployeeId: Yup.string().required(),
      Firstname: Yup.string().required(),
      Lastname: Yup.string().required(),
      Email: Yup.string().email().required(),

      // employment information
      EmployeeType: Yup.string().required(),
      Placement: Yup.string().required(),
      Department: Yup.string().required(),
      Position: Yup.string().required(),

      // salary & payment information
      PaymentFrequency: Yup.string().required(),
      PaymentMethod: Yup.string().required(),
      BankName: Yup.string().required(),
      BankAccountNumber: Yup.string().required(),
      BankAccountName: Yup.string().required(),

      // tax & identification data
      MaritalStatus: Yup.string().required(),
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

  get isEndDateDisabled() {
    return this.form.status === "1" && this.form.employee_type === "Permanent";
  }

  get defaultEndDate(): string {
    if (this.isEndDateDisabled) {
      return "-";
    }
    return this.form.end_date || "-";
  }

  get shouldShowSupervisor(): boolean {
    if (!this.form.position_code) {
      return false;
    }

    const selectedPosition = this.positionOptions.find(
      (p) => p.code === this.form.position_code
    );

    if (!selectedPosition) {
      return false;
    }

    const positionLevel = parseInt(selectedPosition.level);
    return positionLevel > 4 && this.form.department_code;
  }

  get isPhotoUploading(): boolean {
    return this.isUploading;
  }

  get photoUploadProgress(): number {
    return this.uploadProgress;
  }

  get hasPhotoPreview(): boolean {
    return !!this.photoPreviewUrl;
  }
}
