import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class WorkScheduleAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  // Work Schedule CRUD Operations
  GetWorkScheduleList(params: any) {
    return request({
      url: "GetWorkScheduleList",
      method: "get",
      params: params,
    });
  }

  InsertWorkSchedule(params: any) {
    return request({
      url: "InsertWorkSchedule",
      method: "post",
      data: params,
    });
  }

  GetWorkSchedule(params: any) {
    return request({
      url: "GetWorkSchedule/" + params,
      method: "get",
    });
  }

  UpdateWorkSchedule(params: any) {
    return request({
      url: "UpdateWorkSchedule",
      method: "put",
      data: params,
    });
  }

  DeleteWorkSchedule(params: any) {
    return request({
      url: "DeleteWorkSchedule/" + params,
      method: "delete",
    });
  }

  // Employee Work Schedule CRUD Operations
  GetEmployeeWorkScheduleList(params: any) {
    return request({
      url: "GetEmployeeWorkScheduleList",
      method: "get",
      params: params,
    });
  }

  InsertEmployeeWorkSchedule(params: any) {
    return request({
      url: "InsertEmployeeWorkSchedule",
      method: "post",
      data: params,
    });
  }

  GetEmployeeWorkSchedule(params: any) {
    return request({
      url: "GetEmployeeWorkSchedule/" + params,
      method: "get",
    });
  }

  UpdateEmployeeWorkSchedule(params: any) {
    return request({
      url: "UpdateEmployeeWorkSchedule",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeeWorkSchedule(params: any) {
    return request({
      url: "DeleteEmployeeWorkSchedule/" + params,
      method: "delete",
    });
  }

  // Schedule Pattern Operations
  GetSchedulePatternList(params: any) {
    return request({
      url: "GetSchedulePatternList",
      method: "get",
      params: params,
    });
  }

  GetSchedulePatternOptions() {
    return request({
      url: "GetSchedulePatternOptions",
      method: "get",
    });
  }

  // Work Schedule Type Operations
  GetWorkScheduleTypeList(params: any) {
    return request({
      url: "GetWorkScheduleTypeList",
      method: "get",
      params: params,
    });
  }

  GetWorkScheduleTypeOptions() {
    return request({
      url: "GetWorkScheduleTypeOptions",
      method: "get",
    });
  }

  // Employee Options
  GetEmployeeOptionsForSchedule() {
    return request({
      url: "GetEmployeeOptionsForSchedule",
      method: "get",
    });
  }

  // Weekly Schedule Operations
  GetWeeklySchedule(params: any) {
    return request({
      url: "GetWeeklySchedule",
      method: "get",
      params: params,
    });
  }

  UpdateWeeklySchedule(params: any) {
    return request({
      url: "UpdateWeeklySchedule",
      method: "put",
      data: params,
    });
  }

  // Shift Operations
  GetShiftOptions() {
    return request({
      url: "GetShiftOptions",
      method: "get",
    });
  }

  SwitchEmployeeShift(params: any) {
    return request({
      url: "SwitchEmployeeShift",
      method: "post",
      data: params,
    });
  }

  BulkUpdateShifts(params: any) {
    return request({
      url: "BulkUpdateShifts",
      method: "put",
      data: params,
    });
  }

  // Schedule Validation
  ValidateScheduleConflict(params: any) {
    return request({
      url: "ValidateScheduleConflict",
      method: "post",
      data: params,
    });
  }

  CheckScheduleOverlap(params: any) {
    return request({
      url: "CheckScheduleOverlap",
      method: "post",
      data: params,
    });
  }

  // Schedule Reports
  GetScheduleReport(params: any) {
    return request({
      url: "GetScheduleReport",
      method: "get",
      params: params,
    });
  }

  GetScheduleStatistics(params: any) {
    return request({
      url: "GetScheduleStatistics",
      method: "get",
      params: params,
    });
  }

  // Department Schedule Operations
  GetDepartmentSchedule(departmentCode: string, params: any) {
    return request({
      url: `GetDepartmentSchedule/${departmentCode}`,
      method: "get",
      params: params,
    });
  }

  UpdateDepartmentSchedule(params: any) {
    return request({
      url: "UpdateDepartmentSchedule",
      method: "put",
      data: params,
    });
  }

  // Schedule Template Operations
  GetScheduleTemplates() {
    return request({
      url: "GetScheduleTemplates",
      method: "get",
    });
  }

  ApplyScheduleTemplate(params: any) {
    return request({
      url: "ApplyScheduleTemplate",
      method: "post",
      data: params,
    });
  }

  SaveAsTemplate(params: any) {
    return request({
      url: "SaveScheduleAsTemplate",
      method: "post",
      data: params,
    });
  }

  // Import/Export Operations
  ExportScheduleData(params: any) {
    return request({
      url: "ExportScheduleData",
      method: "get",
      params: params,
      responseType: "blob",
    });
  }

  ImportScheduleData(formData: FormData) {
    return request({
      url: "ImportScheduleData",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  GetScheduleImportTemplate() {
    return request({
      url: "GetScheduleImportTemplate",
      method: "get",
      responseType: "blob",
    });
  }

  // Calendar Integration
  GetScheduleCalendar(params: any) {
    return request({
      url: "GetScheduleCalendar",
      method: "get",
      params: params,
    });
  }

  // Rotation Schedule Operations
  GetRotationSchedule(params: any) {
    return request({
      url: "GetRotationSchedule",
      method: "get",
      params: params,
    });
  }

  CreateRotationSchedule(params: any) {
    return request({
      url: "CreateRotationSchedule",
      method: "post",
      data: params,
    });
  }

  // Schedule Approval Operations
  SubmitScheduleForApproval(params: any) {
    return request({
      url: "SubmitScheduleForApproval",
      method: "post",
      data: params,
    });
  }

  ApproveSchedule(params: any) {
    return request({
      url: "ApproveSchedule",
      method: "post",
      data: params,
    });
  }

  RejectSchedule(params: any) {
    return request({
      url: "RejectSchedule",
      method: "post",
      data: params,
    });
  }

  // Overtime Schedule Operations
  GetOvertimeSchedule(params: any) {
    return request({
      url: "GetOvertimeSchedule",
      method: "get",
      params: params,
    });
  }

  ScheduleOvertime(params: any) {
    return request({
      url: "ScheduleOvertime",
      method: "post",
      data: params,
    });
  }

  // Holiday Integration
  GetHolidayAdjustedSchedule(params: any) {
    return request({
      url: "GetHolidayAdjustedSchedule",
      method: "get",
      params: params,
    });
  }

  ApplyHolidayAdjustments(params: any) {
    return request({
      url: "ApplyHolidayAdjustments",
      method: "post",
      data: params,
    });
  }
}

export { WorkScheduleAPI as default };
