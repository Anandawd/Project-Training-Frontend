import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class FingerprintEnrollmentAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetEmployeeEnrollmentList(params: any) {
    return request({
      url: "GetPayEmployeeFingerprintEnrollmentList",
      method: "get",
      params: params,
    });
  }

  InsertEmployeeEnrollment(params: any) {
    return request({
      url: "InsertPayEmployeeFingerprintEnrollmentList",
      method: "post",
      data: params,
    });
  }

  GetEmployeeEnrollment(params: any) {
    return request({
      url: "GetPayEmployeeFingerprintEnrollment/" + params,
      method: "get",
    });
  }

  UpdateEmployeeEnrollment(params: any) {
    return request({
      url: "UpdateEmployeeFingerprintEnrollmentList",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeeEnrollment(params: any) {
    return request({
      url: "DeletePayEmployeeFingerprintEnrollment/" + params,
      method: "delete",
    });
  }

  // Fingerprint Device
  GetFingerprintDeviceList(params: any) {
    return request({
      url: "GetPayFingerprintDevicesList",
      method: "get",
      params: params,
    });
  }

  InsertFingerprintDevice(params: any) {
    return request({
      url: "InsertPayFingerprintDevicesList",
      method: "post",
      data: params,
    });
  }

  GetFingerprintDeviceById(params: any) {
    return request({
      url: "GetPayFingerprintDevices/" + params,
      method: "get",
    });
  }

  UpdateFingerprintDevice(params: any) {
    return request({
      url: "UpdateFingerprintDevicesList",
      method: "put",
      data: params,
    });
  }

  DeleteFingerprintDevice(params: any) {
    return request({
      url: "DeletePayFingerprintDevices/" + params,
      method: "delete",
    });
  }

  ConnectDevice(deviceId: string) {
    return request({
      url: `ConnectFingerprintDevice/${deviceId}`,
      method: "post",
    });
  }

  DisconnectDevice(deviceId: string) {
    return request({
      url: `DisconnectFingerprintDevice/${deviceId}`,
      method: "post",
    });
  }

  TestDevice(deviceId: string) {
    return request({
      url: `TestFingerprintDevice/${deviceId}`,
      method: "post",
    });
  }

  SyncDevice(deviceId: string) {
    return request({
      url: `SyncFingerprintDevice/${deviceId}`,
      method: "post",
    });
  }

  SyncAllDevices() {
    return request({
      url: "SyncAllFingerprintDevices",
      method: "post",
    });
  }

  // Enrollment Operations
  StartEnrollment(params: any) {
    return request({
      url: "StartFingerprintEnrollment",
      method: "post",
      data: params,
    });
  }

  GetEnrollmentProgress(enrollmentId: string) {
    return request({
      url: `GetFingerprintEnrollmentProgress/${enrollmentId}`,
      method: "get",
    });
  }

  StopEnrollment(enrollmentId: string) {
    return request({
      url: `StopFingerprintEnrollment/${enrollmentId}`,
      method: "post",
    });
  }

  VerifyFingerprint(params: any) {
    return request({
      url: "VerifyFingerprint",
      method: "post",
      data: params,
    });
  }

  ReEnrollFingerprint(params: any) {
    return request({
      url: "ReEnrollFingerprint",
      method: "post",
      data: params,
    });
  }

  // Template Management
  GetFingerprintTemplate(employeeId: string, fingerIndex: number) {
    return request({
      url: `GetFingerprintTemplate/${employeeId}/${fingerIndex}`,
      method: "get",
    });
  }

  DeleteFingerprintTemplate(employeeId: string, fingerIndex?: number) {
    const url =
      fingerIndex !== undefined
        ? `DeleteFingerprintTemplate/${employeeId}/${fingerIndex}`
        : `DeleteFingerprintTemplate/${employeeId}`;

    return request({
      url: url,
      method: "delete",
    });
  }

  ExportFingerprintTemplates(params: any) {
    return request({
      url: "ExportFingerprintTemplates",
      method: "post",
      data: params,
      responseType: "blob",
    });
  }

  ImportFingerprintTemplates(formData: FormData) {
    return request({
      url: "ImportFingerprintTemplates",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Enrollment Statistics and Reports
  GetEnrollmentStatistics(params: any) {
    return request({
      url: "GetEnrollmentStatistics",
      method: "get",
      params: params,
    });
  }

  GetEnrollmentReport(params: any) {
    return request({
      url: "GetEnrollmentReport",
      method: "get",
      params: params,
    });
  }

  GetEnrollmentAuditLog(params: any) {
    return request({
      url: "GetEnrollmentAuditLog",
      method: "get",
      params: params,
    });
  }

  // Bulk Operations
  BulkEnrollment(params: any) {
    return request({
      url: "BulkFingerprintEnrollment",
      method: "post",
      data: params,
    });
  }

  BulkDeleteEnrollment(employeeIds: string[]) {
    return request({
      url: "BulkDeleteFingerprintEnrollment",
      method: "delete",
      data: { employeeIds },
    });
  }

  // Device Configuration
  UpdateDeviceSettings(deviceId: string, settings: any) {
    return request({
      url: `UpdateFingerprintDeviceSettings/${deviceId}`,
      method: "put",
      data: settings,
    });
  }

  GetDeviceSettings(deviceId: string) {
    return request({
      url: `GetFingerprintDeviceSettings/${deviceId}`,
      method: "get",
    });
  }

  ResetDevice(deviceId: string) {
    return request({
      url: `ResetFingerprintDevice/${deviceId}`,
      method: "post",
    });
  }

  // Options and Lookups
  GetEmployeeOptionsForEnrollment() {
    return request({
      url: "GetEmployeeOptionsForEnrollment",
      method: "get",
    });
  }

  GetEnrollmentStatusOptions() {
    return request({
      url: "GetEnrollmentStatusOptions",
      method: "get",
    });
  }

  GetFingerIndexOptions() {
    return request({
      url: "GetFingerIndexOptions",
      method: "get",
    });
  }

  // Backup and Restore
  BackupEnrollmentData(params: any) {
    return request({
      url: "BackupFingerprintEnrollmentData",
      method: "post",
      data: params,
      responseType: "blob",
    });
  }

  RestoreEnrollmentData(formData: FormData) {
    return request({
      url: "RestoreFingerprintEnrollmentData",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Health Check and Monitoring
  GetSystemHealth() {
    return request({
      url: "GetFingerprintSystemHealth",
      method: "get",
    });
  }

  GetDeviceStatus() {
    return request({
      url: "GetFingerprintDeviceStatus",
      method: "get",
    });
  }

  // Real-time enrollment monitoring
  GetActiveEnrollmentSessions() {
    return request({
      url: "GetActiveEnrollmentSessions",
      method: "get",
    });
  }

  // Quality and optimization
  GetEnrollmentQualityReport(params: any) {
    return request({
      url: "GetEnrollmentQualityReport",
      method: "get",
      params: params,
    });
  }

  OptimizeDevicePerformance(deviceId: string) {
    return request({
      url: `OptimizeFingerprintDevice/${deviceId}`,
      method: "post",
    });
  }
}

export { FingerprintEnrollmentAPI as default };
