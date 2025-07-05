import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import FingerprintEnrollmentAPI from "@/services/api/payroll/fingerprint-enrollment/fingerprint-enrollment";
import FingerprintEnrollmentLocalAPI from "@/services/api/payroll/local/fingerprint-enrollment-local";
import { formatDateTime2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./fingerprint-devices-input-form/fingerprint-devices-input-form.vue";

const fingerprintEnrollmentAPI = new FingerprintEnrollmentAPI();
const fingerprintEnrollmentLocalAPI = new FingerprintEnrollmentLocalAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CSelect,
    CInput,
    CInputForm,
  },
})
export default class FingerprintDevices extends Vue {
  // data
  public rowData: any[] = [];
  public deleteParam: any;

  // ui state
  public isSaving: boolean = false;
  public isLoading: boolean = false;

  // options
  public placementOptions: any = [];
  public deviceTypeOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // Dialog
  public showDialog = false;
  public dialogMessage = "";
  public dialogAction = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;
  detailCellRenderer: any;

  // RECYCLE LIFE FUNCTION ===================================================
  mounted(): void {
    // this.loadDataGrid();
    this.loadMockData();
    this.loadDropdown();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.updatedBy"), value: 2 },
      {
        text: this.$t("commons.filter.createdBy"),
        value: 3,
      },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
        field: "id",
        width: 100,
        enableRowGroup: false,
        resizeable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.deviceId"),
        field: "device_id",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.name"),
        field: "name",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "Placement",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.model"),
        field: "model",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.manufacturer"),
        field: "manufacturer",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.ipAddress"),
        field: "ip_address",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.port"),
        field: "port",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.serialNumber"),
        field: "serial_number",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.firmwareVersion"),
        field: "firmware_version",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.deviceType"),
        field: "device_type ",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 120,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "";
          let statusText = "";

          switch (status) {
            case "ONLINE":
              badgeClass = "bg-success";
              statusText = "ONLINE";
              break;
            case "OFFLINE":
              badgeClass = "bg-secondary";
              statusText = "OFFLINE";
              break;
            case "ERROR":
              badgeClass = "bg-danger";
              statusText = "ERROR";
              break;
            case "MAINTENANCE":
              badgeClass = "bg-warning";
              statusText = "MAINTENANCE";
              break;
            default:
              badgeClass = "bg-secondary";
              statusText = status;
          }
          return `<span class="badge ${badgeClass} py-1 px-3">${statusText}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.maxUsers"),
        field: "max_users",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.enrolledUsers"),
        field: "enrolled_users",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.lastSync"),
        field: "last_sync",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.active"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklistRenderer: Checklist,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
  }

  // GENERAL FUNCTION ========================================================
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else {
        this.loadEditData(params.id);
      }
    });
    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleInsert() {
    this.handleShowForm("", $global.modeData.insert);
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.attendance.confirm.deleteFingerprintDevice"
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      this.isLoading = true;
      // let params = {
      //   Index: search.index,
      //   Text: search.text,
      // };
      // const { data } = await fingerprintEnrollmentAPI.GetFingerprintDeviceList(
      //   params
      // );
      // if (data) {
      //   this.rowData = data;
      // } else {
      //   this.rowData = [];
      // }
      const response: any =
        await fingerprintEnrollmentLocalAPI.GetPayFingerprintDevicesList({
          ...search,
          search: search.text || "",
          page: search.index + 1 || 1,
          per_page: search.paginationPageSize || 10,
        });

      if (response.status2.status === 0) {
        this.rowData = response.data.data || [];
        console.log("Loaded devices:", this.rowData);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadEditData(id: any) {
    try {
      const { data } = await fingerprintEnrollmentAPI.GetFingerprintDeviceById(
        id
      );
      if (data) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(data);
        });
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.placementOptions = [
      { code: "MAIN_GATE", name: "Main Gate Entrance" },
      { code: "BACK_GATE", name: "Back Gate Exit" },
      { code: "OFFICE_FLOOR1", name: "Office - Floor 1" },
      { code: "OFFICE_FLOOR2", name: "Office - Floor 2" },
      { code: "CANTEEN", name: "Staff Canteen" },
      { code: "WAREHOUSE", name: "Warehouse Area" },
      { code: "PARKING", name: "Parking Area" },
      { code: "SECURITY", name: "Security Post" },
    ];

    this.deviceTypeOptions = [
      { code: "TCP", name: "TCP/IP Network" },
      { code: "USB", name: "USB Connection" },
      { code: "SERIAL", name: "Serial Port" },
    ];

    // Generate realistic settings dan features JSON
    const generateSettings = (deviceType: string, manufacturer: string) => {
      const baseSettings = {
        connection: {
          timeout: deviceType === "TCP" ? 30000 : 10000,
          retry_attempts: 3,
          keep_alive: deviceType === "TCP",
          heartbeat_interval: deviceType === "TCP" ? 60 : 0,
        },
        scanning: {
          quality_threshold: manufacturer === "ZKTeco" ? 60 : 70,
          template_timeout: 10000,
          capture_timeout: 5000,
          verification_timeout: 3000,
          min_quality_score: 50,
        },
        security: {
          encryption_enabled: true,
          secure_communication: deviceType === "TCP",
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
          auto_sync: deviceType === "TCP",
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
      return JSON.stringify(baseSettings);
    };

    const generateFeatures = (manufacturer: string, model: string) => {
      // Default features berdasarkan manufacturer dan model
      const featureMap: any = {
        ZKTeco: {
          U300: {
            biometric: {
              fingerprint_support: true,
              palm_support: false,
              face_recognition: false,
              iris_scan: false,
              voice_recognition: false,
            },
            enrollment: {
              multiple_finger_support: true,
              quality_check: true,
              duplicate_detection: true,
              template_extraction: true,
              bulk_enrollment: true,
              max_templates_per_finger: 3,
            },
            verification: {
              one_to_one_matching: true,
              one_to_n_matching: true,
              quick_verification: true,
              offline_verification: true,
              batch_verification: false,
            },
            connectivity: {
              tcp_ip: true,
              usb: true,
              serial: false,
              wifi: false,
              bluetooth: false,
              ethernet: true,
            },
            storage: {
              internal_storage: true,
              external_storage: false,
              cloud_backup: false,
              local_database: true,
              template_compression: true,
            },
            monitoring: {
              health_check: true,
              performance_monitoring: true,
              error_logging: true,
              usage_statistics: true,
              remote_monitoring: false,
            },
            advanced: {
              sdk_support: true,
              api_integration: true,
              custom_algorithms: false,
              live_finger_detection: true,
              spoofing_detection: true,
            },
          },
          U160: {
            biometric: {
              fingerprint_support: true,
              palm_support: false,
              face_recognition: false,
              iris_scan: false,
              voice_recognition: false,
            },
            enrollment: {
              multiple_finger_support: true,
              quality_check: true,
              duplicate_detection: false,
              template_extraction: true,
              bulk_enrollment: false,
              max_templates_per_finger: 2,
            },
            verification: {
              one_to_one_matching: true,
              one_to_n_matching: false,
              quick_verification: false,
              offline_verification: true,
              batch_verification: false,
            },
            connectivity: {
              tcp_ip: false,
              usb: true,
              serial: false,
              wifi: false,
              bluetooth: false,
              ethernet: false,
            },
            storage: {
              internal_storage: true,
              external_storage: false,
              cloud_backup: false,
              local_database: true,
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
          },
          K40: {
            biometric: {
              fingerprint_support: true,
              palm_support: false,
              face_recognition: false,
              iris_scan: false,
              voice_recognition: false,
            },
            enrollment: {
              multiple_finger_support: true,
              quality_check: true,
              duplicate_detection: true,
              template_extraction: true,
              bulk_enrollment: false,
              max_templates_per_finger: 1,
            },
            verification: {
              one_to_one_matching: true,
              one_to_n_matching: true,
              quick_verification: true,
              offline_verification: false,
              batch_verification: false,
            },
            connectivity: {
              tcp_ip: true,
              usb: false,
              serial: false,
              wifi: false,
              bluetooth: false,
              ethernet: true,
            },
            storage: {
              internal_storage: true,
              external_storage: false,
              cloud_backup: false,
              local_database: true,
              template_compression: true,
            },
            monitoring: {
              health_check: true,
              performance_monitoring: false,
              error_logging: true,
              usage_statistics: false,
              remote_monitoring: false,
            },
            advanced: {
              sdk_support: true,
              api_integration: true,
              custom_algorithms: false,
              live_finger_detection: false,
              spoofing_detection: false,
            },
          },
        },
        Hikvision: {
          "DS-K1T201": {
            biometric: {
              fingerprint_support: true,
              palm_support: false,
              face_recognition: true,
              iris_scan: false,
              voice_recognition: false,
            },
            enrollment: {
              multiple_finger_support: true,
              quality_check: true,
              duplicate_detection: true,
              template_extraction: true,
              bulk_enrollment: true,
              max_templates_per_finger: 5,
            },
            verification: {
              one_to_one_matching: true,
              one_to_n_matching: true,
              quick_verification: true,
              offline_verification: false,
              batch_verification: true,
            },
            connectivity: {
              tcp_ip: true,
              usb: false,
              serial: false,
              wifi: true,
              bluetooth: false,
              ethernet: true,
            },
            storage: {
              internal_storage: true,
              external_storage: true,
              cloud_backup: true,
              local_database: true,
              template_compression: true,
            },
            monitoring: {
              health_check: true,
              performance_monitoring: true,
              error_logging: true,
              usage_statistics: true,
              remote_monitoring: true,
            },
            advanced: {
              sdk_support: true,
              api_integration: true,
              custom_algorithms: true,
              live_finger_detection: true,
              spoofing_detection: true,
            },
          },
          "DS-K1T804": {
            biometric: {
              fingerprint_support: true,
              palm_support: true,
              face_recognition: true,
              iris_scan: false,
              voice_recognition: false,
            },
            enrollment: {
              multiple_finger_support: true,
              quality_check: true,
              duplicate_detection: true,
              template_extraction: true,
              bulk_enrollment: true,
              max_templates_per_finger: 8,
            },
            verification: {
              one_to_one_matching: true,
              one_to_n_matching: true,
              quick_verification: true,
              offline_verification: true,
              batch_verification: true,
            },
            connectivity: {
              tcp_ip: true,
              usb: false,
              serial: false,
              wifi: true,
              bluetooth: true,
              ethernet: true,
            },
            storage: {
              internal_storage: true,
              external_storage: true,
              cloud_backup: true,
              local_database: true,
              template_compression: true,
            },
            monitoring: {
              health_check: true,
              performance_monitoring: true,
              error_logging: true,
              usage_statistics: true,
              remote_monitoring: true,
            },
            advanced: {
              sdk_support: true,
              api_integration: true,
              custom_algorithms: true,
              live_finger_detection: true,
              spoofing_detection: true,
            },
          },
        },
        Suprema: {
          "BioEntry-W2": {
            biometric: {
              fingerprint_support: true,
              palm_support: false,
              face_recognition: false,
              iris_scan: false,
              voice_recognition: false,
            },
            enrollment: {
              multiple_finger_support: true,
              quality_check: true,
              duplicate_detection: true,
              template_extraction: true,
              bulk_enrollment: true,
              max_templates_per_finger: 4,
            },
            verification: {
              one_to_one_matching: true,
              one_to_n_matching: true,
              quick_verification: true,
              offline_verification: true,
              batch_verification: false,
            },
            connectivity: {
              tcp_ip: true,
              usb: false,
              serial: false,
              wifi: true,
              bluetooth: false,
              ethernet: true,
            },
            storage: {
              internal_storage: true,
              external_storage: false,
              cloud_backup: true,
              local_database: true,
              template_compression: true,
            },
            monitoring: {
              health_check: true,
              performance_monitoring: true,
              error_logging: true,
              usage_statistics: true,
              remote_monitoring: true,
            },
            advanced: {
              sdk_support: true,
              api_integration: true,
              custom_algorithms: false,
              live_finger_detection: true,
              spoofing_detection: true,
            },
          },
        },
      };

      const features =
        featureMap[manufacturer]?.[model] || featureMap["ZKTeco"]["K40"];
      return JSON.stringify(features);
    };

    // Mock data array
    const currentTime = new Date();
    const mockDevices = [
      // Device Online - Main Gate
      {
        id: 1,
        device_id: "FP001_MAIN_GATE",
        placement_code: "MAIN_GATE",
        placement_name: "Main Gate Entrance",
        name: "Main Gate Fingerprint Scanner",
        model: "U300",
        manufacturer: "ZKTeco",
        ip_address: "192.168.1.100",
        port: 4370,
        serial_number: "ZK2024001",
        firmware_version: "6.60.1.12",
        device_type: "TCP",
        status: "ONLINE",
        max_users: 3000,
        enrolled_users: 245,
        last_sync: new Date(currentTime.getTime() - 15 * 60 * 1000), // 15 minutes ago
        settings: generateSettings("TCP", "ZKTeco"),
        features: generateFeatures("ZKTeco", "U300"),
        is_active: 1,
        created_at: new Date(2024, 11, 15, 9, 30, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        updated_by: "system",
      },

      // Device Offline - Back Gate
      {
        id: 2,
        device_id: "FP002_BACK_GATE",
        placement_code: "BACK_GATE",
        placement_name: "Back Gate Exit",
        name: "Back Gate Exit Scanner",
        model: "U160",
        manufacturer: "ZKTeco",
        ip_address: "192.168.1.101",
        port: 4370,
        serial_number: "ZK2024002",
        firmware_version: "6.60.1.10",
        device_type: "TCP",
        status: "OFFLINE",
        max_users: 1500,
        enrolled_users: 187,
        last_sync: new Date(currentTime.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        settings: generateSettings("TCP", "ZKTeco"),
        features: generateFeatures("ZKTeco", "U160"),
        is_active: 1,
        created_at: new Date(2024, 11, 20, 14, 15, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 30 * 60 * 1000), // 30 minutes ago
        updated_by: "admin",
      },

      // Device Error - Office Floor 1
      {
        id: 3,
        device_id: "FP003_OFFICE_F1",
        placement_code: "OFFICE_FLOOR1",
        placement_name: "Office - Floor 1",
        name: "Office Floor 1 Access Control",
        model: "DS-K1T201",
        manufacturer: "Hikvision",
        ip_address: "192.168.1.110",
        port: 8000,
        serial_number: "HIK2024001",
        firmware_version: "V4.2.40",
        device_type: "TCP",
        status: "ERROR",
        max_users: 2000,
        enrolled_users: 156,
        last_sync: new Date(currentTime.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        settings: generateSettings("TCP", "Hikvision"),
        features: generateFeatures("Hikvision", "DS-K1T201"),
        is_active: 1,
        created_at: new Date(2024, 10, 5, 11, 0, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        updated_by: "technician",
      },

      // Device Maintenance - Office Floor 2
      {
        id: 4,
        device_id: "FP004_OFFICE_F2",
        placement_code: "OFFICE_FLOOR2",
        placement_name: "Office - Floor 2",
        name: "Office Floor 2 Biometric Terminal",
        model: "DS-K1T804",
        manufacturer: "Hikvision",
        ip_address: "192.168.1.111",
        port: 8000,
        serial_number: "HIK2024002",
        firmware_version: "V4.2.42",
        device_type: "TCP",
        status: "MAINTENANCE",
        max_users: 2500,
        enrolled_users: 201,
        last_sync: new Date(currentTime.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        settings: generateSettings("TCP", "Hikvision"),
        features: generateFeatures("Hikvision", "DS-K1T804"),
        is_active: 1,
        created_at: new Date(2024, 10, 10, 8, 45, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 45 * 60 * 1000), // 45 minutes ago
        updated_by: "technician",
      },

      // USB Device - Canteen
      {
        id: 5,
        device_id: "FP005_CANTEEN",
        placement_code: "CANTEEN",
        placement_name: "Staff Canteen",
        name: "Canteen Access Terminal",
        model: "K40",
        manufacturer: "ZKTeco",
        ip_address: "",
        port: 0,
        serial_number: "ZK2024003",
        firmware_version: "6.50.2.8",
        device_type: "USB",
        status: "ONLINE",
        max_users: 1000,
        enrolled_users: 98,
        last_sync: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        settings: generateSettings("USB", "ZKTeco"),
        features: generateFeatures("ZKTeco", "K40"),
        is_active: 1,
        created_at: new Date(2024, 11, 25, 16, 20, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        updated_by: "system",
      },

      // High-end Device - Warehouse
      {
        id: 6,
        device_id: "FP006_WAREHOUSE",
        placement_code: "WAREHOUSE",
        placement_name: "Warehouse Area",
        name: "Warehouse Security Terminal",
        model: "BioEntry-W2",
        manufacturer: "Suprema",
        ip_address: "192.168.1.120",
        port: 1470,
        serial_number: "SUP2024001",
        firmware_version: "2.8.1",
        device_type: "TCP",
        status: "ONLINE",
        max_users: 5000,
        enrolled_users: 78,
        last_sync: new Date(currentTime.getTime() - 10 * 60 * 1000), // 10 minutes ago
        settings: generateSettings("TCP", "Suprema"),
        features: generateFeatures("Suprema", "BioEntry-W2"),
        is_active: 1,
        created_at: new Date(2024, 9, 12, 13, 10, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 20 * 60 * 1000), // 20 minutes ago
        updated_by: "system",
      },

      // Offline Device - Parking
      {
        id: 7,
        device_id: "FP007_PARKING",
        placement_code: "PARKING",
        placement_name: "Parking Area",
        name: "Parking Gate Controller",
        model: "U160",
        manufacturer: "ZKTeco",
        ip_address: "192.168.1.130",
        port: 4370,
        serial_number: "ZK2024004",
        firmware_version: "6.60.1.11",
        device_type: "TCP",
        status: "OFFLINE",
        max_users: 800,
        enrolled_users: 134,
        last_sync: new Date(currentTime.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        settings: generateSettings("TCP", "ZKTeco"),
        features: generateFeatures("ZKTeco", "U160"),
        is_active: 1,
        created_at: new Date(2024, 10, 18, 10, 5, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        updated_by: "admin",
      },

      // Security Post Device
      {
        id: 8,
        device_id: "FP008_SECURITY",
        placement_code: "SECURITY",
        placement_name: "Security Post",
        name: "Security Checkpoint Scanner",
        model: "U300",
        manufacturer: "ZKTeco",
        ip_address: "192.168.1.140",
        port: 4370,
        serial_number: "ZK2024005",
        firmware_version: "6.60.1.12",
        device_type: "TCP",
        status: "ONLINE",
        max_users: 1200,
        enrolled_users: 89,
        last_sync: new Date(currentTime.getTime() - 5 * 60 * 1000), // 5 minutes ago
        settings: generateSettings("TCP", "ZKTeco"),
        features: generateFeatures("ZKTeco", "U300"),
        is_active: 1,
        created_at: new Date(2024, 11, 1, 7, 30, 0),
        created_by: "admin",
        updated_at: new Date(currentTime.getTime() - 15 * 60 * 1000), // 15 minutes ago
        updated_by: "system",
      },
    ];

    // Set mock data to rowData
    this.rowData = mockDevices;
  }

  async loadDropdown() {
    try {
      const placement: any =
        await fingerprintEnrollmentLocalAPI.GetPlacementOptions();
      if (placement.status2.status === 0) {
        this.placementOptions = placement.data.map((item: any) => ({
          id: item.code,
          value: item.code,
          text: item.name,
        }));
      }

      const type: any =
        await fingerprintEnrollmentLocalAPI.GetDeviceTypeOptions();
      if (type.status2.status === 0) {
        this.deviceTypeOptions = type.data.map((item: any) => ({
          id: item.code,
          value: item.code,
          text: item.name,
        }));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      this.isSaving = true;
      // const { status2 } =
      //   await fingerprintEnrollmentAPI.InsertFingerprintDevice(formData);
      // if (status2.status == 0) {
      //   getToastSuccess(
      //     this.$t("messages.attendance.success.saveFingerprintDevice")
      //   );
      //   this.loadDataGrid(this.searchDefault);
      //   this.showForm = false;
      // }

      let response: any;

      if (this.modeData === $global.modeData.insert) {
        response =
          await fingerprintEnrollmentLocalAPI.InsertPayFingerprintDevicesList(
            formData
          );
        if (response.status2.status === 0) {
          getToastSuccess(
            this.$t("messages.attendance.success.createFingerprintDevice")
          );
        }
      } else {
        response =
          await fingerprintEnrollmentLocalAPI.UpdateFingerprintDevicesList(
            formData
          );
        if (response.status2.status === 0) {
          getToastSuccess(
            this.$t("messages.attendance.success.updateFingerprintDevice")
          );
        }
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } =
        await fingerprintEnrollmentAPI.UpdateFingerprintDevice(formData);
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.updateFingerprintDevice")
        );
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteData() {
    try {
      this.isSaving = true;
      // const { status2 } =
      //   await fingerprintEnrollmentAPI.DeleteFingerprintDevice(
      //     this.deleteParam
      //   );
      // if (status2.status == 0) {
      //   getToastSuccess(
      //     this.$t("messages.attendance.success.deleteFingerprintDevice")
      //   );
      //   this.loadDataGrid(this.searchDefault);
      //   this.showDialog = false;
      //   this.deleteParam = null;
      // }

      const response: any =
        await fingerprintEnrollmentLocalAPI.DeletePayFingerprintDevices(
          this.deleteParam
        );
      if (response.status2.status === 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.deleteFingerprintDevice")
        );
        this.loadDataGrid(this.searchDefault);
        this.showDialog = false;
        this.deleteParam = null;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async testDeviceConnection(deviceId: string) {
    try {
      this.isSaving = true;
      const response: any =
        await fingerprintEnrollmentLocalAPI.TestFingerprintDevice(deviceId);

      if (response.status2.status === 0) {
        if (response.data.success) {
          getToastSuccess(response.data.message || "Device test successful");
        } else {
          getToastError(response.data.message || "Device test failed");
        }
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async connectDevice(deviceId: string) {
    try {
      this.isSaving = true;
      const response: any =
        await fingerprintEnrollmentLocalAPI.ConnectFingerprintDevice(deviceId);

      if (response.status2.status === 0 && response.data.success) {
        getToastSuccess("Device connected successfully");
        this.loadDataGrid(this.searchDefault);
      } else {
        getToastError("Failed to connect device");
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async disconnectDevice(deviceId: string) {
    try {
      this.isSaving = true;
      const response: any =
        await fingerprintEnrollmentLocalAPI.DisconnectFingerprintDevice(
          deviceId
        );

      if (response.status2.status === 0 && response.data.success) {
        getToastSuccess("Device disconnected successfully");
        this.loadDataGrid(this.searchDefault);
      } else {
        getToastError("Failed to disconnect device");
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async syncSingleDevice(deviceId: string) {
    try {
      this.isSaving = true;
      const response: any =
        await fingerprintEnrollmentLocalAPI.SyncFingerprintDevice(deviceId);

      if (response.status2.status === 0 && response.data.success) {
        getToastSuccess("Device synced successfully");
        this.loadDataGrid(this.searchDefault);
      } else {
        getToastError("Failed to sync device");
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async syncAllDevices() {
    try {
      this.isSaving = true;
      const response: any =
        await fingerprintEnrollmentLocalAPI.SyncAllFingerprintDevices();

      if (response.status2.status === 0) {
        getToastSuccess(
          `${response.data.synced_devices} devices synced successfully`
        );
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      device_id: params.device_id,
      placement_code: params.placement_code,
      name: params.name,
      model: params.model,
      manufacturer: params.manufacturer,
      ip_address: params.ip_address,
      port: parseInt(params.port),
      serial_number: params.serial_number,
      firmware_version: params.firmware_version,
      device_type: params.device_type,
      status: params.status,
      max_users: parseInt(params.max_users),
      enrolled_users: parseInt(params.enrolled_users),
      last_sync: params.last_sync,
      settings:
        typeof params.settings === "string"
          ? JSON.parse(params.settings || "{}")
          : params.settings || {},
      features:
        typeof params.features === "string"
          ? JSON.parse(params.features || "{}")
          : params.features || {},
      is_active: parseInt(params.is_active),
      updated_at: params.updated_at,
      updated_by: params.updated_by,
      created_at: params.created_at,
      created_by: params.created_by,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      device_id: params.device_id,
      placement_code: params.placement_code,
      name: params.name,
      model: params.model,
      manufacturer: params.manufacturer,
      ip_address: params.ip_address,
      port: params.port,
      serial_number: params.serial_number,
      firmware_version: params.firmware_version,
      device_type: params.device_type,
      status: params.status,
      max_users: params.max_users,
      enrolled_users: params.enrolled_users,
      last_sync: params.last_sync,
      settings: params.settings,
      features: params.features,
      is_active: params.is_active,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
      created_at: params.created_at,
      created_by: params.created_by,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
