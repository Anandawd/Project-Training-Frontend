import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import FingerprintEnrollmentLocalAPI from "@/services/api/payroll/local/fingerprint-enrollment-local";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

// const fingerprintEnrollmentAPI = new FingerprintEnrollmentAPI();
const fingerprintEnrollmentLocalAPI = new FingerprintEnrollmentLocalAPI();
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
  public isTestingDevice: boolean = false;
  public detectedFeatures: any = {};

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
    last_sync: null,
    settings: {},
    features: {},
    is_active: 1,

    updated_at: "",
    updated_by: "",
    created_at: "",
    created_by: "",
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
      device_type: "TCP",
      status: "OFFLINE",
      max_users: 1000,
      enrolled_users: 0,
      last_sync: null,
      settings: {},
      features: {},
      is_active: 1,
      updated_at: "",
      updated_by: "",
      created_at: "",
      created_by: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
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

  onManufacturerChange() {
    if (this.form.manufacturer && this.form.model) {
      this.detectDeviceFeatures();
    }
  }

  onModelChange() {
    if (this.form.manufacturer && this.form.model) {
      this.detectDeviceFeatures();
    }
  }

  // API
  async testDevice() {
    try {
      if (!this.form.device_id) {
        getToastError("Please enter device ID first");
        return;
      }

      this.isTestingDevice = true;

      // Simulasi test dengan data form saat ini
      const mockDeviceId = this.form.id || "test";
      const response: any =
        await fingerprintEnrollmentLocalAPI.TestFingerprintDevice(mockDeviceId);

      if (response.status2.status === 0) {
        if (response.data.success) {
          getToastSuccess(response.data.message || "Device test successful");
          this.detectDeviceFeatures();
        } else {
          getToastError(response.data.message || "Device test failed");
        }
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isTestingDevice = false;
    }
  }

  async detectDeviceFeatures() {
    // Auto-detection features berdasarkan manufacturer & model
    const deviceSpecs: any = {
      ZKTeco: {
        "ZK-4500": {
          max_users: 3000,
          device_type: "TCP",
          port: 4370,
          features: {
            biometric: { fingerprint_support: true, face_recognition: true },
            connectivity: { tcp_ip: true, wifi: true },
            enrollment: { multiple_finger_support: true, quality_check: true },
          },
        },
        U160: {
          max_users: 500,
          device_type: "USB",
          port: 0,
          features: {
            biometric: { fingerprint_support: true },
            connectivity: { usb: true },
            enrollment: { multiple_finger_support: true },
          },
        },
      },
      Suprema: {
        BioStation: {
          max_users: 5000,
          device_type: "TCP",
          port: 1470,
          features: {
            biometric: {
              fingerprint_support: true,
              face_recognition: true,
              palm_support: true,
            },
            connectivity: { tcp_ip: true, wifi: true, ethernet: true },
          },
        },
      },
    };

    const specs = deviceSpecs[this.form.manufacturer]?.[this.form.model];
    if (specs) {
      this.form.max_users = specs.max_users;
      this.form.device_type = specs.device_type;
      this.form.port = specs.port;
      this.form.features = specs.features;
      this.detectedFeatures = specs.features;

      getToastInfo(
        `Device specifications auto-detected for ${this.form.manufacturer} ${this.form.model}`
      );
    }
  }

  // HELPER
  resetDetectedFeatures() {
    this.detectedFeatures = {
      biometric: {
        fingerprint_support: false,
        palm_support: false,
        face_recognition: false,
      },
      connectivity: {
        tcp_ip: false,
        usb: false,
        wifi: false,
      },
      enrollment: {
        multiple_finger_support: false,
        quality_check: false,
      },
    };
  }

  generateDeviceId() {
    if (this.form.manufacturer && this.form.model) {
      const prefix = this.form.manufacturer.substring(0, 2).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      this.form.device_id = `${prefix}${this.form.model
        .replace(/[^A-Z0-9]/gi, "")
        .substring(0, 4)
        .toUpperCase()}${timestamp}`;
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

  get manufacturerOptions() {
    return [
      { id: "ZKTeco", value: "ZKTeco", text: "ZKTeco" },
      { id: "Suprema", value: "Suprema", text: "Suprema" },
      { id: "Anviz", value: "Anviz", text: "Anviz" },
      { id: "Hikvision", value: "Hikvision", text: "Hikvision" },
    ];
  }

  get availableModels() {
    const modelOptions: any = {
      ZKTeco: [
        { id: "ZK-4500", value: "ZK-4500", text: "ZK-4500" },
        { id: "U160", value: "U160", text: "U160" },
        { id: "K40", value: "K40", text: "K40" },
      ],
      Suprema: [
        { id: "BioStation", value: "BioStation", text: "BioStation" },
        { id: "BioLite", value: "BioLite", text: "BioLite" },
      ],
      Anviz: [
        { id: "T5S", value: "T5S", text: "T5S" },
        { id: "M5", value: "M5", text: "M5" },
      ],
    };

    return modelOptions[this.form.manufacturer] || [];
  }
}
