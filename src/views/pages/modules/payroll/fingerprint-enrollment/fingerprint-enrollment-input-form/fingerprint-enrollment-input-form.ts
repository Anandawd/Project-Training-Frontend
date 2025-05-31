import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

interface EnrollmentProgress {
  message: string;
  step: string;
  percentage: number;
  templateCount: number;
  success: boolean;
}

interface FingerprintDevice {
  id: string;
  name: string;
  model: string;
  ipAddress: string;
  connected: boolean;
  lastSync: Date;
  enrolledUsers: number;
  maxUsers: number;
}

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
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    deviceConnected: {
      type: Boolean,
      default: false,
    },
    devices: {
      type: Array,
      default: (): FingerprintDevice[] => [],
    },
  },
  emits: ["save", "close", "enrollmentProgress"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  employeeOptions!: any[];
  deviceConnected!: boolean;
  devices!: FingerprintDevice[];

  public form: any = reactive({});
  public enrollmentInProgress: boolean = false;
  public enrollmentProgress: EnrollmentProgress = {
    message: "",
    step: "",
    percentage: 0,
    templateCount: 0,
    success: false,
  };

  columnEmployeeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "employee_id",
      label: "ID",
      align: "right",
      width: "100",
    },
  ];

  fingerOptions = [
    { value: 0, label: "Left Thumb" },
    { value: 1, label: "Left Index" },
    { value: 2, label: "Left Middle" },
    { value: 3, label: "Left Ring" },
    { value: 4, label: "Left Pinky" },
    { value: 5, label: "Right Thumb" },
    { value: 6, label: "Right Index" },
    { value: 7, label: "Right Middle" },
    { value: 8, label: "Right Ring" },
    { value: 9, label: "Right Pinky" },
  ];

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: null,
      employee_id: "",
      employee_name: "",
      department_code: "",
      department_name: "",
      position_code: "",
      position_name: "",
      placement_code: "",
      placement_name: "",
      device_id: "",
      device_name: "",
      device_model: "",
      device_ip: "",
      finger_index: 6, // Default to right index finger
      quality_level: 2, // Default to medium quality
      remark: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    if (!this.enrollmentProgress.success) {
      getToastError(
        this.$t("messages.attendance.error.enrollmentNotCompleted")
      );
      return;
    }

    const formData = {
      ...this.form,
      enrollment_status: "ENROLLED",
      enrollment_date: new Date(),
      template_count: this.enrollmentProgress.templateCount,
    };

    console.log("onSave", formData);
    this.$emit("save", formData);
  }

  checkForm() {
    console.log(this.form);
  }

  onClose() {
    if (this.enrollmentInProgress) {
      this.stopEnrollment();
    }
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  resetEnrollmentProgress() {
    this.enrollmentProgress = {
      message: "",
      step: "",
      percentage: 0,
      templateCount: 0,
      success: false,
    };
    this.enrollmentInProgress = false;
  }

  onEmployeeChange() {
    if (this.form.employee_id) {
      const selectedEmployee = this.employeeOptions.find(
        (emp: any) => emp.employee_id === this.form.employee_id
      );

      if (selectedEmployee) {
        this.form.employee_name = selectedEmployee.name;
        this.form.department_code = selectedEmployee.department_code;
        this.form.department_name = selectedEmployee.department_name;
        this.form.position_code = selectedEmployee.position_code;
        this.form.position_name = selectedEmployee.position_name;
        this.form.placement_code = selectedEmployee.placement_code;
        this.form.placement_name = selectedEmployee.placement_name;
      }
    }
    this.resetEnrollmentProgress();
  }

  onDeviceChange() {
    if (this.form.device_id) {
      const selectedDevice = this.devices.find(
        (device) => device.id === this.form.device_id
      );

      if (selectedDevice) {
        this.form.device_name = selectedDevice.name;
        this.form.device_model = selectedDevice.model;
        this.form.device_ip = selectedDevice.ipAddress;
      }
    }
    this.resetEnrollmentProgress();
  }

  async startEnrollment() {
    if (!this.canStartEnrollment) {
      getToastError(this.$t("messages.attendance.error.cannotStartEnrollment"));
      return;
    }

    this.enrollmentInProgress = true;
    this.resetEnrollmentProgress();

    try {
      // Step 1: Initialize
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.initializing"),
        step: this.$t("messages.attendance.enrollment.preparingScanner"),
        percentage: 0,
        templateCount: 0,
        success: false,
      });

      await this.sleep(1000);

      // Step 2: First scan
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.firstScan"),
        step: this.$t("messages.attendance.enrollment.placeFinger"),
        percentage: 20,
        templateCount: 0,
        success: false,
      });

      await this.sleep(2000);

      // Step 3: First template created
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.firstTemplate"),
        step: this.$t("messages.attendance.enrollment.liftFinger"),
        percentage: 40,
        templateCount: 1,
        success: false,
      });

      await this.sleep(1500);

      // Step 4: Second scan
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.secondScan"),
        step: this.$t("messages.attendance.enrollment.placeFinger"),
        percentage: 60,
        templateCount: 1,
        success: false,
      });

      await this.sleep(2000);

      // Step 5: Second template created
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.secondTemplate"),
        step: this.$t("messages.attendance.enrollment.liftFinger"),
        percentage: 70,
        templateCount: 2,
        success: false,
      });

      await this.sleep(1500);

      // Step 6: Third scan
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.thirdScan"),
        step: this.$t("messages.attendance.enrollment.placeFinger"),
        percentage: 80,
        templateCount: 2,
        success: false,
      });

      await this.sleep(2000);

      // Step 7: Processing
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.processing"),
        step: this.$t("messages.attendance.enrollment.creatingTemplate"),
        percentage: 90,
        templateCount: 3,
        success: false,
      });

      await this.sleep(1500);

      // Step 8: Success
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.completed"),
        step: this.$t("messages.attendance.enrollment.enrollmentSuccess"),
        percentage: 100,
        templateCount: 3,
        success: true,
      });

      this.enrollmentInProgress = false;
      getToastSuccess(
        this.$t("messages.attendance.success.enrollmentCompleted")
      );
    } catch (error) {
      this.enrollmentInProgress = false;
      this.updateEnrollmentProgress({
        message: this.$t("messages.attendance.enrollment.failed"),
        step: this.$t("messages.attendance.enrollment.error"),
        percentage: 0,
        templateCount: 0,
        success: false,
      });
      getToastError(this.$t("messages.attendance.error.enrollmentFailed"));
    }
  }

  stopEnrollment() {
    this.enrollmentInProgress = false;
    this.resetEnrollmentProgress();
    getToastError(this.$t("messages.attendance.enrollment.stopped"));
  }

  async testFingerprint() {
    if (!this.enrollmentProgress.success) {
      getToastError(
        this.$t("messages.attendance.error.enrollmentNotCompleted")
      );
      return;
    }

    try {
      // Simulate fingerprint test
      getToastSuccess(
        this.$t("messages.attendance.success.fingerprintVerified")
      );
    } catch (error) {
      getToastError(this.$t("messages.attendance.error.verificationFailed"));
    }
  }

  updateEnrollmentProgress(progress: EnrollmentProgress) {
    this.enrollmentProgress = { ...progress };
    this.$emit("enrollmentProgress", progress);
  }

  // HELPER FUNCTIONS
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // validation
  get schema() {
    return Yup.object().shape({
      // SelectedEmployee: Yup.string().required(),
      // SelectedDevice: Yup.string().required(),
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

  get connectedDevices() {
    return this.devices
      .filter((device) => device.connected)
      .map((device) => ({
        id: device.id,
        name: `${device.name} (${device.model})`,
        model: device.model,
        ipAddress: device.ipAddress,
        connected: device.connected,
      }));
  }

  get selectedDevice() {
    return this.devices.find((device) => device.id === this.form.device_id);
  }

  get deviceStatusBadge() {
    if (!this.selectedDevice) return "badge-secondary";
    return this.selectedDevice.connected ? "badge-success" : "badge-danger";
  }

  get deviceStatusText() {
    if (!this.selectedDevice)
      return this.$t("labels.payroll.attendance.noDeviceSelected");
    return this.selectedDevice.connected
      ? this.$t("labels.payroll.attendance.connected")
      : this.$t("labels.payroll.attendance.disconnected");
  }

  get canStartEnrollment() {
    return (
      this.form.employee_id &&
      this.form.device_id &&
      this.form.finger_index !== null &&
      this.deviceConnected &&
      !this.enrollmentInProgress
    );
  }

  get scannerStatusClass() {
    if (this.enrollmentProgress.success) return "success";
    if (this.enrollmentInProgress) return "scanning";
    if (this.selectedDevice?.connected) return "connected";
    return "";
  }

  get scannerIconClass() {
    if (this.enrollmentProgress.success) return "success";
    if (this.enrollmentInProgress) return "scanning";
    return "";
  }

  get scannerStatusMessage() {
    if (this.enrollmentProgress.success) {
      return this.$t("labels.payroll.attendance.enrollmentCompleted");
    }
    if (this.enrollmentInProgress) {
      return this.enrollmentProgress.message;
    }
    if (!this.selectedDevice?.connected) {
      return this.$t("labels.payroll.attendance.deviceNotConnected");
    }
    return this.$t("labels.payroll.attendance.readyToEnroll");
  }

  get scannerInstructionMessage() {
    if (this.enrollmentProgress.success) {
      return this.$t("labels.payroll.attendance.enrollmentSuccessMessage");
    }
    if (this.enrollmentInProgress) {
      return this.enrollmentProgress.step;
    }
    if (!this.selectedDevice?.connected) {
      return this.$t("labels.payroll.attendance.connectDeviceFirst");
    }
    return this.$t("labels.payroll.attendance.pressStartToBegin");
  }
}
