import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class AttendanceAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetAttendanceList(params: any) {
    return request({
      url: "GetAttendanceList",
      method: "get",
      params: params,
    });
  }

  InsertAttendance(params: any) {
    return request({
      url: "InsertAttendance",
      method: "post",
      data: params,
    });
  }

  GetAttendance(params: any) {
    return request({
      url: "GetAttendance/" + params,
      method: "get",
    });
  }

  UpdateAttendance(params: any) {
    return request({
      url: "UpdateAttendance",
      method: "put",
      data: params,
    });
  }

  DeleteAttendance(params: any) {
    return request({
      url: "DeleteAttendance/" + params,
      method: "delete",
    });
  }

  // Bulk Operations
  BulkInsertAttendance(params: any) {
    return request({
      url: "BulkInsertAttendace",
      method: "post",
      data: params,
    });
  }

  BulkUpdateAttendance(params: any) {
    return request({
      url: "BulkUpdateAttendance",
      method: "put",
      data: params,
    });
  }

  BulkDeleteAttendance(params: any) {
    return request({
      url: "BulkDeleteAttendance",
      method: "delete",
      data: params,
    });
  }

  // Import/Export Operations
  ImportAttendanceFromFile(formData: FormData) {
    return request({
      url: "ImportAttendanceFromFile",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  ValidateAttendanceImport(params: any) {
    return request({
      url: "ValidateAttendanceImport",
      method: "post",
      data: params,
    });
  }

  ExportAttendanceToFile(params: any) {
    return request({
      url: "ExportAttendanceToFile",
      method: "get",
      params: params,
      responseType: "blob",
    });
  }

  GetImportTemplate() {
    return request({
      url: "GetAttendanceImportTemplate",
      method: "get",
      responseType: "blob",
    });
  }

  // Summary and Reports
  GetAttendanceSummary(params: any) {
    return request({
      url: "GetAttendanceSummary",
      method: "get",
      params: params,
    });
  }

  GetAttendanceReport(params: any) {
    return request({
      url: "GetAttendanceReport",
      method: "get",
      params: params,
    });
  }

  // Options Methods
  GetEmployeeOptions() {
    return request({
      url: "GetEmployeeOptions",
      method: "get",
    });
  }

  GetStatusOptions() {
    return request({
      url: "GetAttendanceStatusOptions",
      method: "get",
    });
  }

  GetScheduleOptions() {
    return request({
      url: "GetScheduleOptions",
      method: "get",
    });
  }

  // Validation Methods
  ValidateAttendanceData(params: any) {
    return request({
      url: "ValidateAttendanceData",
      method: "post",
      data: params,
    });
  }

  CheckDuplicateAttendance(params: any) {
    return request({
      url: "CheckDuplicateAttendance",
      method: "post",
      data: params,
    });
  }

  // Auto-calculation Methods
  CalculateWorkingHours(params: any) {
    return request({
      url: "CalculateWorkingHours",
      method: "post",
      data: params,
    });
  }

  CalculateOvertime(params: any) {
    return request({
      url: "CalculateOvertime",
      method: "post",
      data: params,
    });
  }

  // Schedule Integration
  GetEmployeeSchedule(employeeId: string, date: string) {
    return request({
      url: `GetEmployeeSchedule/${employeeId}/${date}`,
      method: "get",
    });
  }

  // Department/Position filtering
  GetAttendanceByDepartment(params: any) {
    return request({
      url: "GetAttendanceByDepartment",
      method: "get",
      params: params,
    });
  }

  GetAttendanceByPosition(params: any) {
    return request({
      url: "GetAttendanceByPosition",
      method: "get",
      params: params,
    });
  }

  // Date range operations
  GetAttendanceByDateRange(params: any) {
    return request({
      url: "GetAttendanceByDateRange",
      method: "get",
      params: params,
    });
  }

  // Generate attendance from schedule
  GenerateAttendanceFromSchedule(params: any) {
    return request({
      url: "GenerateAttendanceFromSchedule",
      method: "post",
      data: params,
    });
  }

  // Approval related (if needed)
  SubmitAttendanceForApproval(params: any) {
    return request({
      url: "SubmitAttendanceForApproval",
      method: "post",
      data: params,
    });
  }

  ApproveAttendance(params: any) {
    return request({
      url: "ApproveAttendance",
      method: "post",
      data: params,
    });
  }

  RejectAttendance(params: any) {
    return request({
      url: "RejectAttendance",
      method: "post",
      data: params,
    });
  }
}

export { AttendanceAPI as default };
