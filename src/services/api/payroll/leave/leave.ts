import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class LeaveAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  // Leave Request CRUD Operations
  GetLeaveRequestList(params: any) {
    return request({
      url: "GetLeaveRequestList",
      method: "get",
      params: params,
    });
  }

  InsertLeaveRequest(params: any) {
    return request({
      url: "InsertLeaveRequest",
      method: "post",
      data: params,
    });
  }

  GetLeaveRequest(params: any) {
    return request({
      url: "GetLeaveRequest/" + params,
      method: "get",
    });
  }

  UpdateLeaveRequest(params: any) {
    return request({
      url: "UpdateLeaveRequest",
      method: "put",
      data: params,
    });
  }

  DeleteLeaveRequest(params: any) {
    return request({
      url: "DeleteLeaveRequest/" + params,
      method: "delete",
    });
  }

  // Leave Approval Operations
  ApproveLeaveRequest(params: any) {
    return request({
      url: "ApproveLeaveRequest",
      method: "post",
      data: params,
    });
  }

  RejectLeaveRequest(params: any) {
    return request({
      url: "RejectLeaveRequest",
      method: "post",
      data: params,
    });
  }

  // Leave Balance Operations
  GetLeaveBalance(employeeId: string, year?: number) {
    return request({
      url: `GetLeaveBalance/${employeeId}`,
      method: "get",
      params: { year },
    });
  }

  UpdateLeaveBalance(params: any) {
    return request({
      url: "UpdateLeaveBalance",
      method: "put",
      data: params,
    });
  }

  // Leave Type Operations
  GetLeaveTypeList(params: any) {
    return request({
      url: "GetLeaveTypeList",
      method: "get",
      params: params,
    });
  }

  GetLeaveTypeOptions() {
    return request({
      url: "GetLeaveTypeOptions",
      method: "get",
    });
  }

  // Employee Options
  GetEmployeeOptionsForLeave() {
    return request({
      url: "GetEmployeeOptionsForLeave",
      method: "get",
    });
  }

  // Leave Reports and Statistics
  GetLeaveReport(params: any) {
    return request({
      url: "GetLeaveReport",
      method: "get",
      params: params,
    });
  }

  GetLeaveStatistics(params: any) {
    return request({
      url: "GetLeaveStatistics",
      method: "get",
      params: params,
    });
  }

  // Leave Calendar and Schedule Integration
  GetLeaveCalendar(params: any) {
    return request({
      url: "GetLeaveCalendar",
      method: "get",
      params: params,
    });
  }

  CheckLeaveConflict(params: any) {
    return request({
      url: "CheckLeaveConflict",
      method: "post",
      data: params,
    });
  }

  // Bulk Operations
  BulkApproveLeaveRequests(params: any) {
    return request({
      url: "BulkApproveLeaveRequests",
      method: "post",
      data: params,
    });
  }

  BulkRejectLeaveRequests(params: any) {
    return request({
      url: "BulkRejectLeaveRequests",
      method: "post",
      data: params,
    });
  }

  // Leave Policy and Rules
  GetLeavePolicy(params: any) {
    return request({
      url: "GetLeavePolicy",
      method: "get",
      params: params,
    });
  }

  ValidateLeaveRequest(params: any) {
    return request({
      url: "ValidateLeaveRequest",
      method: "post",
      data: params,
    });
  }

  CalculateLeaveEntitlement(employeeId: string, year: number) {
    return request({
      url: `CalculateLeaveEntitlement/${employeeId}/${year}`,
      method: "get",
    });
  }

  // Import/Export Operations
  ExportLeaveData(params: any) {
    return request({
      url: "ExportLeaveData",
      method: "get",
      params: params,
      responseType: "blob",
    });
  }

  ImportLeaveData(formData: FormData) {
    return request({
      url: "ImportLeaveData",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Status tracking
  GetLeaveStatusOptions() {
    return request({
      url: "GetLeaveStatusOptions",
      method: "get",
    });
  }

  GetLeaveRequestHistory(employeeId: string, params?: any) {
    return request({
      url: `GetLeaveRequestHistory/${employeeId}`,
      method: "get",
      params: params,
    });
  }
}

export { LeaveAPI as default };
