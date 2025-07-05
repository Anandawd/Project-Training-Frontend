// ===================================================================
// LOCAL FINGERPRINT SERVICE - SESUAI DENGAN STYLE PROYEK
// ===================================================================

import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

// ===================================================================
// INTERFACES
// ===================================================================

interface FingerprintDevice {
  id: string;
  device_id: string;
  placement_code: string;
  name: string;
  model: string;
  manufacturer: string;
  ip_address: string;
  port: number;
  serial_number: string;
  firmware_version: string;
  device_type: string;
  status: string;
  max_users: number;
  enrolled_users: number;
  last_sync: Date | null;
  settings: any;
  features: any;
  is_active: boolean;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

interface EmployeeEnrollment {
  id: string;
  employee_id: string;
  employee_name: string;
  department_code: string;
  department_name: string;
  position_code: string;
  position_name: string;
  placement_code: string;
  placement_name: string;
  device_id: string;
  device_name: string;
  device_model: string;
  device_ip: string;
  finger_index: number;
  quality_level: string;
  enrollment_date: Date;
  enrollment_status: string;
  template_count: number;
  remark: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

// ===================================================================
// LOCAL DATA STORE
// ===================================================================

class LocalDataStore {
  private devices: FingerprintDevice[] = [];
  private enrollments: EmployeeEnrollment[] = [];
  private currentUser: string = "system";

  constructor() {
    this.initializeMockData();
  }

  // INITIALIZATION =======================================================
  private initializeMockData(): void {
    // Mock Devices
    this.devices = [
      {
        id: "1",
        device_id: "FP001",
        placement_code: "HO001",
        name: "Main Entrance Scanner",
        model: "ZK-4500",
        manufacturer: "ZKTeco",
        ip_address: "192.168.1.100",
        port: 4370,
        serial_number: "ZK45001234",
        firmware_version: "6.60.100.58-15315",
        device_type: "TCP",
        status: "ONLINE",
        max_users: 3000,
        enrolled_users: 150,
        last_sync: new Date("2025-07-04T08:30:00"),
        settings: {
          matching_speed: "fast",
          sensitivity_level: "high",
          false_acceptance_rate: "1:10000",
          false_rejection_rate: "1:100",
        },
        features: {
          biometric: {
            fingerprint_support: true,
            palm_support: false,
            face_recognition: true,
          },
          connectivity: {
            tcp_ip: true,
            usb: false,
            wifi: true,
          },
        },
        is_active: true,
        created_at: new Date("2025-01-01"),
        created_by: "admin",
        updated_at: new Date("2025-07-04"),
        updated_by: "system",
      },
      {
        id: "2",
        device_id: "FP002",
        placement_code: "HO001",
        name: "HR Department Scanner",
        model: "U160",
        manufacturer: "ZKTeco",
        ip_address: "192.168.1.101",
        port: 4370,
        serial_number: "U1605678",
        firmware_version: "2.1.0",
        device_type: "USB",
        status: "OFFLINE",
        max_users: 500,
        enrolled_users: 45,
        last_sync: new Date("2025-07-03T15:20:00"),
        settings: {
          matching_speed: "medium",
          sensitivity_level: "normal",
        },
        features: {
          biometric: {
            fingerprint_support: true,
            palm_support: false,
          },
          connectivity: {
            usb: true,
            tcp_ip: false,
          },
        },
        is_active: true,
        created_at: new Date("2025-02-15"),
        created_by: "admin",
        updated_at: new Date("2025-07-03"),
        updated_by: "hr_admin",
      },
    ];

    // Mock Enrollments
    this.enrollments = [
      {
        id: "1",
        employee_id: "EMP001",
        employee_name: "John Doe",
        department_code: "IT",
        department_name: "Information Technology",
        position_code: "DEV",
        position_name: "Software Developer",
        placement_code: "HO001",
        placement_name: "Head Office",
        device_id: "1",
        device_name: "Main Entrance Scanner",
        device_model: "ZK-4500",
        device_ip: "192.168.1.100",
        finger_index: 1,
        quality_level: "High",
        enrollment_date: new Date("2025-06-15T10:30:00"),
        enrollment_status: "ENROLLED",
        template_count: 3,
        remark: "Successfully enrolled",
        created_at: new Date("2025-06-15"),
        created_by: "hr_admin",
        updated_at: new Date("2025-06-15"),
        updated_by: "hr_admin",
      },
      {
        id: "2",
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        department_code: "HR",
        department_name: "Human Resources",
        position_code: "MGR",
        position_name: "HR Manager",
        placement_code: "HO001",
        placement_name: "Head Office",
        device_id: "2",
        device_name: "HR Department Scanner",
        device_model: "U160",
        device_ip: "192.168.1.101",
        finger_index: 2,
        quality_level: "Medium",
        enrollment_date: new Date("2025-06-20T14:15:00"),
        enrollment_status: "PENDING",
        template_count: 1,
        remark: "Re-enrollment required",
        created_at: new Date("2025-06-20"),
        created_by: "system",
        updated_at: new Date("2025-07-01"),
        updated_by: "hr_admin",
      },
    ];
  }

  // DEVICE OPERATIONS =======================================================
  getDevices(params: any = {}): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredDevices = [...this.devices];

        // Apply filters
        if (params.search) {
          filteredDevices = filteredDevices.filter(
            (device) =>
              device.name.toLowerCase().includes(params.search.toLowerCase()) ||
              device.model
                .toLowerCase()
                .includes(params.search.toLowerCase()) ||
              device.device_id
                .toLowerCase()
                .includes(params.search.toLowerCase())
          );
        }

        if (params.placement_code) {
          filteredDevices = filteredDevices.filter(
            (device) => device.placement_code === params.placement_code
          );
        }

        if (params.status) {
          filteredDevices = filteredDevices.filter(
            (device) => device.status === params.status
          );
        }

        resolve({
          data: filteredDevices,
          total: filteredDevices.length,
          current_page: params.page || 1,
          per_page: params.per_page || 10,
        });
      }, 300);
    });
  }

  getDeviceById(id: string): Promise<FingerprintDevice | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = this.devices.find((d) => d.id === id);
        resolve(device || null);
      }, 200);
    });
  }

  createDevice(
    deviceData: Partial<FingerprintDevice>
  ): Promise<FingerprintDevice> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDevice: FingerprintDevice = {
          id: Date.now().toString(),
          device_id: deviceData.device_id || `FP${Date.now()}`,
          placement_code: deviceData.placement_code || "",
          name: deviceData.name || "",
          model: deviceData.model || "",
          manufacturer: deviceData.manufacturer || "",
          ip_address: deviceData.ip_address || "",
          port: deviceData.port || 4370,
          serial_number: deviceData.serial_number || "",
          firmware_version: deviceData.firmware_version || "",
          device_type: deviceData.device_type || "TCP",
          status: "OFFLINE",
          max_users: deviceData.max_users || 1000,
          enrolled_users: 0,
          last_sync: null,
          settings: deviceData.settings || {},
          features: deviceData.features || {},
          is_active:
            deviceData.is_active !== undefined ? deviceData.is_active : true,
          created_at: new Date(),
          created_by: this.currentUser,
          updated_at: new Date(),
          updated_by: this.currentUser,
        };

        this.devices.push(newDevice);
        resolve(newDevice);
      }, 400);
    });
  }

  updateDevice(
    id: string,
    deviceData: Partial<FingerprintDevice>
  ): Promise<FingerprintDevice | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.devices.findIndex((d) => d.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        this.devices[index] = {
          ...this.devices[index],
          ...deviceData,
          updated_at: new Date(),
          updated_by: this.currentUser,
        };

        resolve(this.devices[index]);
      }, 400);
    });
  }

  deleteDevice(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.devices.findIndex((d) => d.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        this.devices.splice(index, 1);
        this.enrollments = this.enrollments.filter((e) => e.device_id !== id);
        resolve(true);
      }, 300);
    });
  }

  // ENROLLMENT OPERATIONS =======================================================
  getEnrollments(params: any = {}): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredEnrollments = [...this.enrollments];

        if (params.search) {
          filteredEnrollments = filteredEnrollments.filter(
            (enrollment) =>
              enrollment.employee_name
                .toLowerCase()
                .includes(params.search.toLowerCase()) ||
              enrollment.employee_id
                .toLowerCase()
                .includes(params.search.toLowerCase())
          );
        }

        if (params.device_id) {
          filteredEnrollments = filteredEnrollments.filter(
            (enrollment) => enrollment.device_id === params.device_id
          );
        }

        if (params.enrollment_status) {
          filteredEnrollments = filteredEnrollments.filter(
            (enrollment) =>
              enrollment.enrollment_status === params.enrollment_status
          );
        }

        resolve({
          data: filteredEnrollments,
          total: filteredEnrollments.length,
          current_page: params.page || 1,
          per_page: params.per_page || 10,
        });
      }, 300);
    });
  }

  createEnrollment(
    enrollmentData: Partial<EmployeeEnrollment>
  ): Promise<EmployeeEnrollment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEnrollment: EmployeeEnrollment = {
          id: Date.now().toString(),
          employee_id: enrollmentData.employee_id || "",
          employee_name: enrollmentData.employee_name || "",
          department_code: enrollmentData.department_code || "",
          department_name: enrollmentData.department_name || "",
          position_code: enrollmentData.position_code || "",
          position_name: enrollmentData.position_name || "",
          placement_code: enrollmentData.placement_code || "",
          placement_name: enrollmentData.placement_name || "",
          device_id: enrollmentData.device_id || "",
          device_name: enrollmentData.device_name || "",
          device_model: enrollmentData.device_model || "",
          device_ip: enrollmentData.device_ip || "",
          finger_index: enrollmentData.finger_index || 1,
          quality_level: enrollmentData.quality_level || "Medium",
          enrollment_date: enrollmentData.enrollment_date || new Date(),
          enrollment_status: enrollmentData.enrollment_status || "PENDING",
          template_count: enrollmentData.template_count || 0,
          remark: enrollmentData.remark || "",
          created_at: new Date(),
          created_by: this.currentUser,
          updated_at: new Date(),
          updated_by: this.currentUser,
        };

        this.enrollments.push(newEnrollment);

        // Update device enrolled_users count
        const device = this.devices.find(
          (d) => d.id === newEnrollment.device_id
        );
        if (device && newEnrollment.enrollment_status === "ENROLLED") {
          device.enrolled_users += 1;
        }

        resolve(newEnrollment);
      }, 500);
    });
  }

  updateEnrollment(
    id: string,
    enrollmentData: Partial<EmployeeEnrollment>
  ): Promise<EmployeeEnrollment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.enrollments.findIndex((e) => e.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        const oldStatus = this.enrollments[index].enrollment_status;
        const oldDeviceId = this.enrollments[index].device_id;

        this.enrollments[index] = {
          ...this.enrollments[index],
          ...enrollmentData,
          updated_at: new Date(),
          updated_by: this.currentUser,
        };

        // Update device enrolled_users count
        const newStatus = this.enrollments[index].enrollment_status;
        const newDeviceId = this.enrollments[index].device_id;

        if (oldDeviceId === newDeviceId) {
          if (oldStatus !== "ENROLLED" && newStatus === "ENROLLED") {
            const device = this.devices.find((d) => d.id === newDeviceId);
            if (device) device.enrolled_users += 1;
          } else if (oldStatus === "ENROLLED" && newStatus !== "ENROLLED") {
            const device = this.devices.find((d) => d.id === newDeviceId);
            if (device) device.enrolled_users -= 1;
          }
        } else {
          if (oldStatus === "ENROLLED") {
            const oldDevice = this.devices.find((d) => d.id === oldDeviceId);
            if (oldDevice) oldDevice.enrolled_users -= 1;
          }
          if (newStatus === "ENROLLED") {
            const newDevice = this.devices.find((d) => d.id === newDeviceId);
            if (newDevice) newDevice.enrolled_users += 1;
          }
        }

        resolve(this.enrollments[index]);
      }, 400);
    });
  }

  deleteEnrollment(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.enrollments.findIndex((e) => e.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        const enrollment = this.enrollments[index];

        if (enrollment.enrollment_status === "ENROLLED") {
          const device = this.devices.find(
            (d) => d.id === enrollment.device_id
          );
          if (device) device.enrolled_users -= 1;
        }

        this.enrollments.splice(index, 1);
        resolve(true);
      }, 300);
    });
  }

  // DEVICE CONNECTION OPERATIONS =======================================================
  connectDevice(deviceId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = this.devices.find((d) => d.id === deviceId);
        if (device) {
          device.status = "ONLINE";
          device.last_sync = new Date();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  disconnectDevice(deviceId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = this.devices.find((d) => d.id === deviceId);
        if (device) {
          device.status = "OFFLINE";
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  testDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = this.devices.find((d) => d.id === deviceId);
        if (!device) {
          resolve({ success: false, message: "Device not found" });
          return;
        }

        if (device.status === "ONLINE") {
          resolve({ success: true, message: "Device test successful" });
        } else if (device.status === "MAINTENANCE") {
          resolve({ success: false, message: "Device under maintenance" });
        } else {
          resolve({ success: false, message: "Device is offline" });
        }
      }, 2000);
    });
  }

  syncDevice(deviceId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = this.devices.find((d) => d.id === deviceId);
        if (device && device.status === "ONLINE") {
          device.last_sync = new Date();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1500);
    });
  }

  syncAllDevices(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const onlineDevices = this.devices.filter((d) => d.status === "ONLINE");
        onlineDevices.forEach((device) => {
          device.last_sync = new Date();
        });
        resolve(onlineDevices.length);
      }, 3000);
    });
  }

  // OPTIONS AND LOOKUPS =======================================================
  getEmployeeOptions(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockEmployees = [
          {
            employee_id: "EMP001",
            name: "John Doe",
            department_code: "IT",
            department_name: "Information Technology",
            position_code: "DEV",
            position_name: "Software Developer",
            placement_code: "HO001",
            placement_name: "Head Office",
          },
          {
            employee_id: "EMP002",
            name: "Jane Smith",
            department_code: "HR",
            department_name: "Human Resources",
            position_code: "MGR",
            position_name: "HR Manager",
            placement_code: "HO001",
            placement_name: "Head Office",
          },
          {
            employee_id: "EMP003",
            name: "Bob Johnson",
            department_code: "FIN",
            department_name: "Finance",
            position_code: "ACC",
            position_name: "Accountant",
            placement_code: "HO001",
            placement_name: "Head Office",
          },
        ];
        resolve(mockEmployees);
      }, 200);
    });
  }

  getPlacementOptions(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPlacements = [
          { code: "HO001", name: "Head Office" },
          { code: "BR001", name: "Branch Office 1" },
          { code: "BR002", name: "Branch Office 2" },
        ];
        resolve(mockPlacements);
      }, 200);
    });
  }

  getDeviceTypeOptions(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDeviceTypes = [
          { code: "TCP", name: "TCP/IP" },
          { code: "USB", name: "USB" },
          { code: "SERIAL", name: "Serial" },
        ];
        resolve(mockDeviceTypes);
      }, 200);
    });
  }
}

// ===================================================================
// LOCAL SERVICE CLASS - MENGIKUTI PATTERN CONFIGURATIONRESOURCE
// ===================================================================

class FingerprintEnrollmentLocalAPI extends ConfigurationResource {
  private dataStore: LocalDataStore;

  constructor() {
    super(uri);
    this.dataStore = new LocalDataStore();
  }

  // DEVICE METHODS =======================================================
  GetPayFingerprintDevicesList(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.dataStore.getDevices(params);
        resolve({
          data: result,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to get device list" },
        });
      }
    });
  }

  GetPayFingerprintDevices(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const device = await this.dataStore.getDeviceById(id);
        resolve({
          data: device,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to get device" },
        });
      }
    });
  }

  InsertPayFingerprintDevicesList(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const device = await this.dataStore.createDevice(params);
        resolve({
          data: device,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to create device" },
        });
      }
    });
  }

  UpdateFingerprintDevicesList(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const device = await this.dataStore.updateDevice(params.id, params);
        resolve({
          data: device,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to update device" },
        });
      }
    });
  }

  DeletePayFingerprintDevices(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const success = await this.dataStore.deleteDevice(id);
        resolve({
          data: { success },
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to delete device" },
        });
      }
    });
  }

  // ENROLLMENT METHODS =======================================================
  GetPayEmployeeFingerprintEnrollmentList(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.dataStore.getEnrollments(params);
        resolve({
          data: result,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to get enrollment list" },
        });
      }
    });
  }

  InsertPayEmployeeFingerprintEnrollmentList(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const enrollment = await this.dataStore.createEnrollment(params);
        resolve({
          data: enrollment,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to create enrollment" },
        });
      }
    });
  }

  UpdateEmployeeFingerprintEnrollmentList(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const enrollment = await this.dataStore.updateEnrollment(
          params.id,
          params
        );
        resolve({
          data: enrollment,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to update enrollment" },
        });
      }
    });
  }

  DeletePayEmployeeFingerprintEnrollment(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const success = await this.dataStore.deleteEnrollment(id);
        resolve({
          data: { success },
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to delete enrollment" },
        });
      }
    });
  }

  // DEVICE OPERATIONS =======================================================
  ConnectFingerprintDevice(deviceId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const success = await this.dataStore.connectDevice(deviceId);
        resolve({
          data: { success },
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to connect device" },
        });
      }
    });
  }

  DisconnectFingerprintDevice(deviceId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const success = await this.dataStore.disconnectDevice(deviceId);
        resolve({
          data: { success },
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to disconnect device" },
        });
      }
    });
  }

  TestFingerprintDevice(deviceId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.dataStore.testDevice(deviceId);
        resolve({
          data: result,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to test device" },
        });
      }
    });
  }

  SyncFingerprintDevice(deviceId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const success = await this.dataStore.syncDevice(deviceId);
        resolve({
          data: { success },
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to sync device" },
        });
      }
    });
  }

  SyncAllFingerprintDevices() {
    return new Promise(async (resolve, reject) => {
      try {
        const count = await this.dataStore.syncAllDevices();
        resolve({
          data: { synced_devices: count },
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to sync all devices" },
        });
      }
    });
  }

  // OPTIONS METHODS =======================================================
  GetEmployeeOptionsForEnrollment() {
    return new Promise(async (resolve, reject) => {
      try {
        const employees = await this.dataStore.getEmployeeOptions();
        resolve({
          data: employees,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to get employee options" },
        });
      }
    });
  }

  GetPlacementOptions() {
    return new Promise(async (resolve, reject) => {
      try {
        const placements = await this.dataStore.getPlacementOptions();
        resolve({
          data: placements,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to get placement options" },
        });
      }
    });
  }

  GetDeviceTypeOptions() {
    return new Promise(async (resolve, reject) => {
      try {
        const deviceTypes = await this.dataStore.getDeviceTypeOptions();
        resolve({
          data: deviceTypes,
          status2: { status: 0, message: "Success" },
        });
      } catch (error) {
        reject({
          status2: { status: 1, message: "Failed to get device type options" },
        });
      }
    });
  }

  // ADDITIONAL METHODS FOR COMPATIBILITY =======================================================
  GetEnrollmentStatusOptions() {
    return new Promise((resolve) => {
      resolve({
        data: [
          { code: "ENROLLED", name: "Enrolled" },
          { code: "NOT_ENROLLED", name: "Not Enrolled" },
          { code: "PENDING", name: "Pending" },
          { code: "FAILED", name: "Failed" },
          { code: "EXPIRED", name: "Expired" },
        ],
        status2: { status: 0, message: "Success" },
      });
    });
  }

  GetFingerIndexOptions() {
    return new Promise((resolve) => {
      resolve({
        data: [
          { code: 1, name: "Right Thumb" },
          { code: 2, name: "Right Index" },
          { code: 3, name: "Right Middle" },
          { code: 4, name: "Right Ring" },
          { code: 5, name: "Right Little" },
          { code: 6, name: "Left Thumb" },
          { code: 7, name: "Left Index" },
          { code: 8, name: "Left Middle" },
          { code: 9, name: "Left Ring" },
          { code: 10, name: "Left Little" },
        ],
        status2: { status: 0, message: "Success" },
      });
    });
  }

  // ENROLLMENT OPERATIONS FOR COMPATIBILITY =======================================================
  StartFingerprintEnrollment(params: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            enrollment_id: Date.now().toString(),
            status: "started",
            message: "Enrollment started successfully",
          },
          status2: { status: 0, message: "Success" },
        });
      }, 500);
    });
  }

  GetFingerprintEnrollmentProgress(enrollmentId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            enrollment_id: enrollmentId,
            progress: Math.floor(Math.random() * 100),
            status: "in_progress",
            template_count: Math.floor(Math.random() * 3) + 1,
          },
          status2: { status: 0, message: "Success" },
        });
      }, 300);
    });
  }

  StopFingerprintEnrollment(enrollmentId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            enrollment_id: enrollmentId,
            status: "stopped",
            message: "Enrollment stopped",
          },
          status2: { status: 0, message: "Success" },
        });
      }, 200);
    });
  }

  VerifyFingerprint(params: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.3;
        resolve({
          data: {
            verified: success,
            confidence: success
              ? Math.floor(Math.random() * 30) + 70
              : Math.floor(Math.random() * 50),
            message: success
              ? "Fingerprint verified successfully"
              : "Fingerprint verification failed",
          },
          status2: { status: 0, message: "Success" },
        });
      }, 1000);
    });
  }
}

// ===================================================================
// EXPORT
// ===================================================================

export {
  FingerprintEnrollmentLocalAPI as default,
  LocalDataStore,
  type EmployeeEnrollment,
  type FingerprintDevice,
};
