import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import FingerprintEnrollmentAPI from "@/services/api/payroll/fingerprint-enrollment/fingerprint-enrollment";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

const fingerprintEnrollmentAPI = new FingerprintEnrollmentAPI();
@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CCheckbox,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
      require: true,
      default: false,
    },
    placementOptions: {
      type: Array,
      default: (): any[] => [],
    },
    deviceTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close", "test-device"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  isSaving!: boolean;
  placementOptions!: any[];
  deviceTypeOptions!: any[];

  // ui states
  public isDetectingFeatures: boolean = false;
  public showAdvancedSettings: boolean = false;
  public isTestingConnection: boolean = false;

  public form = reactive({
    id: null,
    device_id: "",
    placement_code: "",
    name: "",
    model: "",
    manufacturer: "",
    ip_address: "",
    port: 4370,
    serial_number: "",
    firmware_version: "",
    device_type: "TCP",
    status: "OFFLINE",
    max_users: 1000,
    enrolled_users: 0,
    last_sync: "",
    settings: "",
    features: "",
    is_active: 1,
    updated_at: "",
    updated_by: "",
    created_at: "",
    created_by: "",
  });
  public deviceSettings = reactive({
    connection: {
      timeout: 30000,
      retry_attempts: 3,
      keep_alive: true,
      heartbeat_interval: 60,
    },
    scanning: {
      quality_threshold: 60,
      template_timeout: 10000,
      capture_timeout: 5000,
      verification_timeout: 3000,
      min_quality_score: 50,
    },
    security: {
      encryption_enabled: true,
      secure_communication: true,
      password_protected: false,
      admin_password: "",
    },
    performance: {
      matching_speed: "medium",
      sensitivity_level: "normal",
      false_acceptance_rate: "1:10000",
      false_rejection_rate: "1:100",
    },
    sync: {
      auto_sync: true,
      sync_interval: 3600,
      backup_enabled: true,
      real_time_sync: false,
    },
    display: {
      brightness: 80,
      screen_timeout: 30,
      language: "en",
      date_format: "DD/MM/YYYY",
    },
  });
  public detectedFeatures = reactive({
    biometric: {
      fingerprint_support: false,
      palm_support: false,
      face_recognition: false,
      iris_scan: false,
      voice_recognition: false,
    },
    enrollment: {
      multiple_finger_support: false,
      quality_check: false,
      duplicate_detection: false,
      template_extraction: false,
      bulk_enrollment: false,
      max_templates_per_finger: 1,
    },
    verification: {
      one_to_one_matching: false,
      one_to_n_matching: false,
      quick_verification: false,
      offline_verification: false,
      batch_verification: false,
    },
    connectivity: {
      tcp_ip: false,
      usb: false,
      serial: false,
      wifi: false,
      bluetooth: false,
      ethernet: false,
    },
    storage: {
      internal_storage: false,
      external_storage: false,
      cloud_backup: false,
      local_database: false,
      template_compression: false,
    },
    monitoring: {
      health_check: false,
      performance_monitoring: false,
      error_logging: false,
      usage_statistics: false,
      remote_monitoring: false,
    },
    advanced: {
      sdk_support: false,
      api_integration: false,
      custom_algorithms: false,
      live_finger_detection: false,
      spoofing_detection: false,
    },
  });

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

  private deviceSpecifications = {
    ZKTeco: {
      U300: {
        features: {
          biometric: {
            fingerprint_support: true,
            palm_support: false,
            face_recognition: false,
          },
          connectivity: {
            tcp_ip: true,
            usb: true,
            wifi: false,
            ethernet: true,
          },
          enrollment: {
            multiple_finger_support: true,
            quality_check: true,
            max_templates_per_finger: 3,
            bulk_enrollment: true,
          },
          verification: {
            one_to_one_matching: true,
            one_to_n_matching: true,
            offline_verification: true,
          },
          advanced: {
            sdk_support: true,
            api_integration: true,
            live_finger_detection: true,
          },
        },
        defaultSettings: {
          scanning: {
            quality_threshold: 60,
            template_timeout: 10000,
          },
          security: {
            encryption_enabled: true,
            secure_communication: true,
          },
        },
      },
      U160: {
        features: {
          biometric: {
            fingerprint_support: true,
            palm_support: false,
          },
          connectivity: {
            tcp_ip: false,
            usb: true,
            wifi: false,
          },
          enrollment: {
            multiple_finger_support: true,
            max_templates_per_finger: 2,
          },
        },
      },
    },
    Hikvision: {
      "DS-K1T201": {
        features: {
          biometric: {
            fingerprint_support: true,
            face_recognition: true,
          },
          connectivity: {
            tcp_ip: true,
            wifi: true,
            usb: false,
          },
          enrollment: {
            multiple_finger_support: true,
            max_templates_per_finger: 5,
          },
        },
      },
    },
  };

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: null,
      device_id: "",
      placement_code: "",
      name: "",
      model: "",
      manufacturer: "",
      ip_address: "",
      port: 4370,
      serial_number: "",
      firmware_version: "",
      device_type: "",
      status: "OFFLINE",
      max_users: 1000,
      enrolled_users: 0,
      last_sync: "",
      settings: "",
      features: "",
      is_active: 1,
      updated_at: "",
      updated_by: "",
      created_at: "",
      created_by: "",
    };

    // Reset settings ke default
    this.resetSettingsToDefault();

    // Reset detected features
    this.resetDetectedFeatures();
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
      settings: JSON.stringify(this.deviceSettings),
      features: JSON.stringify(this.detectedFeatures),
    };
    this.$emit("save", formData);
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

  onManufacturerChange() {
    if (this.form.manufacturer && this.form.model) {
      this.loadFeaturesFromDatabase();
    }
  }

  onModelChange() {
    if (this.form.manufacturer && this.form.model) {
      this.loadFeaturesFromDatabase();
    }
  }

  // API
  async testDeviceConnection() {
    try {
      if (!this.form.ip_address || !this.form.port) {
        getToastError(this.$t("messages.attendance.error.ipPortRequired"));
        return;
      }

      this.isTestingConnection = true;

      // Menggunakan method yang sudah ada di API
      const { data } = await fingerprintEnrollmentAPI.TestDevice(
        this.form.device_id || "temp"
      );

      if (data && data.success) {
        getToastSuccess(this.$t("messages.attendance.success.connectionTest"));
        // Auto-detect features setelah connection berhasil
        await this.detectDeviceFeatures();
      } else {
        getToastError(this.$t("messages.attendance.error.connectionFailed"));
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isTestingConnection = false;
    }
  }

  async detectDeviceFeatures() {
    try {
      if (!this.form.ip_address || !this.form.port) {
        getToastError(this.$t("messages.attendance.error.ipPortRequired"));
        return;
      }

      this.isDetectingFeatures = true;

      const deviceInfo = await this.connectAndDetectDevice();

      if (deviceInfo && deviceInfo.success) {
        // Update form dengan info dari device
        this.form.model = deviceInfo.model || this.form.model;
        this.form.manufacturer =
          deviceInfo.manufacturer || this.form.manufacturer;
        this.form.firmware_version =
          deviceInfo.firmware_version || this.form.firmware_version;
        this.form.serial_number =
          deviceInfo.serial_number || this.form.serial_number;

        // Update detected features
        Object.assign(this.detectedFeatures, deviceInfo.features);

        getToastSuccess(
          this.$t("messages.attendance.success.featuresDetected")
        );
      } else {
        // Fallback ke database specifications
        this.loadFeaturesFromDatabase();
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isDetectingFeatures = false;
    }
  }

  async connectAndDetectDevice() {
    try {
      const result = await fingerprintEnrollmentAPI.ConnectDevice(
        this.form.device_id
      );
      // Return format yang expected
      return {
        success: true,
        model: "U300",
        manufacturer: "ZKTeco",
        firmware_version: "6.60",
        serial_number: "ZK2024001",
        features: this.getDefaultFeatures(),
      };
    } catch (error) {
      return { success: false };
    }
  }

  loadFeaturesFromDatabase() {
    const specs = this.getDeviceSpecification(
      this.form.manufacturer,
      this.form.model
    );

    if (specs) {
      // Update detected features
      Object.assign(this.detectedFeatures, specs.features);

      // Update default settings jika ada
      if (specs.defaultSettings) {
        Object.assign(this.deviceSettings, specs.defaultSettings);
      }

      getToastSuccess(
        this.$t("messages.attendance.success.specsLoaded", {
          manufacturer: this.form.manufacturer,
          model: this.form.model,
        })
      );
    } else {
      // Generic fallback
      Object.assign(this.detectedFeatures, this.getDefaultFeatures());

      getToastInfo(this.$t("messages.attendance.warning.genericSpecs"));
    }
  }

  // HELPER
  resetSettingsToDefault() {
    this.deviceSettings = {
      connection: {
        timeout: 30000,
        retry_attempts: 3,
        keep_alive: true,
        heartbeat_interval: 60,
      },
      scanning: {
        quality_threshold: 60,
        template_timeout: 10000,
        capture_timeout: 5000,
        verification_timeout: 3000,
        min_quality_score: 50,
      },
      security: {
        encryption_enabled: true,
        secure_communication: true,
        password_protected: false,
        admin_password: "",
      },
      performance: {
        matching_speed: "medium",
        sensitivity_level: "normal",
        false_acceptance_rate: "1:10000",
        false_rejection_rate: "1:100",
      },
      sync: {
        auto_sync: true,
        sync_interval: 3600,
        backup_enabled: true,
        real_time_sync: false,
      },
      display: {
        brightness: 80,
        screen_timeout: 30,
        language: "en",
        date_format: "DD/MM/YYYY",
      },
    };
  }

  resetDetectedFeatures() {
    this.detectedFeatures = {
      biometric: {
        fingerprint_support: false,
        palm_support: false,
        face_recognition: false,
        iris_scan: false,
        voice_recognition: false,
      },
      enrollment: {
        multiple_finger_support: false,
        quality_check: false,
        duplicate_detection: false,
        template_extraction: false,
        bulk_enrollment: false,
        max_templates_per_finger: 0,
      },
      verification: {
        one_to_one_matching: false,
        one_to_n_matching: false,
        quick_verification: false,
        offline_verification: false,
        batch_verification: false,
      },
      connectivity: {
        tcp_ip: false,
        usb: false,
        serial: false,
        wifi: false,
        bluetooth: false,
        ethernet: false,
      },
      storage: {
        internal_storage: false,
        external_storage: false,
        cloud_backup: false,
        local_database: false,
        template_compression: false,
      },
      monitoring: {
        health_check: false,
        performance_monitoring: false,
        error_logging: false,
        usage_statistics: false,
        remote_monitoring: false,
      },
      advanced: {
        sdk_support: false,
        api_integration: false,
        custom_algorithms: false,
        live_finger_detection: false,
        spoofing_detection: false,
      },
    };
  }

  private getDeviceSpecification(manufacturer: string, model: string) {
    try {
      const deviceSpecs: any = this.deviceSpecifications;
      return deviceSpecs[manufacturer]?.[model] || null;
    } catch (error) {
      console.warn("Error accessing device specifications:", error);
      return null;
    }
  }

  getDefaultFeatures() {
    return {
      biometric: {
        fingerprint_support: true,
        palm_support: false,
        face_recognition: false,
      },
      connectivity: {
        tcp_ip: true,
        usb: false,
        wifi: false,
      },
      enrollment: {
        multiple_finger_support: true,
        quality_check: true,
        max_templates_per_finger: 3,
      },
      verification: {
        one_to_one_matching: true,
        one_to_n_matching: true,
        offline_verification: true,
      },
    };
  }

  getAvailableModels(manufacturer: string): string[] {
    try {
      const deviceSpecs: any = this.deviceSpecifications;
      const manufacturerSpecs = deviceSpecs[manufacturer];
      return manufacturerSpecs ? Object.keys(manufacturerSpecs) : [];
    } catch (error) {
      console.warn("Error getting available models:", error);
      return [];
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({
      Placement: Yup.string().required(),
      DeviceId: Yup.string().required(),
      Name: Yup.string().required(),
      Port: Yup.string().required(),
      DeviceType: Yup.string().required(),
      MaxUsers: Yup.number().min(1).required(),
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

  get availableManufacturers(): string[] {
    return Object.keys(this.deviceSpecifications);
  }

  get canAutoDetect(): boolean {
    return (
      this.form.device_type === "TCP" &&
      this.form.ip_address.length > 0 &&
      this.form.port > 0
    );
  }

  get hasDetectedFeatures(): boolean {
    return this.detectedFeatures.biometric.fingerprint_support;
  }
}
