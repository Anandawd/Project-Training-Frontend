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

  // ============ SCHEDULE TEMPLATE MANAGEMENT ============

  GetScheduleTemplates(params: any) {
    return request({
      url: "GetScheduleTemplates",
      method: "get",
      params: params,
    });
  }

  CreateScheduleTemplate(params: any) {
    return request({
      url: "CreateScheduleTemplate",
      method: "post",
      data: params,
    });
  }

  UpdateScheduleTemplate(params: any) {
    return request({
      url: "UpdateScheduleTemplate",
      method: "put",
      data: params,
    });
  }

  DeleteScheduleTemplate(templateId: number) {
    return request({
      url: `DeleteScheduleTemplate/${templateId}`,
      method: "delete",
    });
  }

  GetTemplateDetails(templateId: number) {
    return request({
      url: `GetTemplateDetails/${templateId}`,
      method: "get",
    });
  }

  // ============ EMPLOYEE SCHEDULE ASSIGNMENT ============

  AssignScheduleToEmployee(params: any) {
    return request({
      url: "AssignScheduleToEmployee",
      method: "post",
      data: params,
    });
  }

  UpdateEmployeeScheduleAssignment(params: any) {
    return request({
      url: "UpdateEmployeeScheduleAssignment",
      method: "put",
      data: params,
    });
  }

  GetEmployeeCurrentSchedule(employeeId: string) {
    return request({
      url: `GetEmployeeCurrentSchedule/${employeeId}`,
      method: "get",
    });
  }

  GetEmployeeScheduleHistory(employeeId: string, params?: any) {
    return request({
      url: `GetEmployeeScheduleHistory/${employeeId}`,
      method: "get",
      params: params,
    });
  }
  // ============ DAILY SCHEDULE MANAGEMENT ============

  GetDailySchedules(params: any) {
    return request({
      url: "GetDailySchedules",
      method: "get",
      params: params,
    });
  }

  GetWeeklySchedule(params: any) {
    return request({
      url: "GetWeeklySchedule",
      method: "get",
      params: params,
    });
  }

  GenerateScheduleFromTemplate(params: any) {
    return request({
      url: "GenerateScheduleFromTemplate",
      method: "post",
      data: params,
    });
  }

  // ============ SCHEDULE SWITCH MANAGEMENT ============
  RequestScheduleSwitch(params: any) {
    return request({
      url: "RequestScheduleSwitch",
      method: "post",
      data: params,
    });
  }

  ApproveScheduleSwitch(switchId: number, approverNotes?: string) {
    return request({
      url: `ApproveScheduleSwitch/${switchId}`,
      method: "post",
      data: { approver_notes: approverNotes },
    });
  }

  RejectScheduleSwitch(switchId: number, rejectionReason: string) {
    return request({
      url: `RejectScheduleSwitch/${switchId}`,
      method: "post",
      data: { rejection_reason: rejectionReason },
    });
  }

  GetScheduleSwitchRequests(params: any) {
    return request({
      url: "GetScheduleSwitchRequests",
      method: "get",
      params: params,
    });
  }

  GetPendingSwitchRequests(employeeId?: string) {
    return request({
      url: "GetPendingSwitchRequests",
      method: "get",
      params: { employee_id: employeeId },
    });
  }

  // ============ SHIFT TYPE MANAGEMENT ============

  GetShiftTypes(params: any) {
    return request({
      url: "GetShiftTypes",
      method: "get",
      params: params,
    });
  }

  CreateShiftType(params: any) {
    return request({
      url: "CreateShiftType",
      method: "post",
      data: params,
    });
  }

  UpdateShiftType(params: any) {
    return request({
      url: "UpdateShiftType",
      method: "put",
      data: params,
    });
  }

  GetShiftTypesForDepartment(departmentCode: string) {
    return request({
      url: `GetShiftTypesForDepartment/${departmentCode}`,
      method: "get",
    });
  }

  // ============ DEPARTMENT SCHEDULE RULES ============

  GetDepartmentScheduleRules(departmentCode: string) {
    return request({
      url: `GetDepartmentScheduleRules/${departmentCode}`,
      method: "get",
    });
  }

  UpdateDepartmentScheduleRules(params: any) {
    return request({
      url: "UpdateDepartmentScheduleRules",
      method: "put",
      data: params,
    });
  }

  ValidateScheduleAgainstRules(params: any) {
    return request({
      url: "ValidateScheduleAgainstRules",
      method: "post",
      data: params,
    });
  }

  // ============ SEASONAL ADJUSTMENTS ============

  GetSeasonalAdjustments(placementCode: string) {
    return request({
      url: `GetSeasonalAdjustments/${placementCode}`,
      method: "get",
    });
  }

  CreateSeasonalAdjustment(params: any) {
    return request({
      url: "CreateSeasonalAdjustment",
      method: "post",
      data: params,
    });
  }

  ApplySeasonalAdjustment(adjustmentId: number, targetDate: string) {
    return request({
      url: `ApplySeasonalAdjustment/${adjustmentId}`,
      method: "post",
      data: { target_date: targetDate },
    });
  }

  // ============ CONFLICT DETECTION ============

  CheckScheduleConflicts(params: any) {
    return request({
      url: "CheckScheduleConflicts",
      method: "post",
      data: params,
    });
  }

  GetScheduleAnalytics(params: any) {
    return request({
      url: "GetScheduleAnalytics",
      method: "get",
      params: params,
    });
  }

  ValidateStaffCoverage(params: any) {
    return request({
      url: "ValidateStaffCoverage",
      method: "post",
      data: params,
    });
  }

  // ============ EMERGENCY SCHEDULE OVERRIDE ============

  CreateEmergencyOverride(params: any) {
    return request({
      url: "CreateEmergencyOverride",
      method: "post",
      data: params,
    });
  }

  GetEmergencyOverrides(params: any) {
    return request({
      url: "GetEmergencyOverrides",
      method: "get",
      params: params,
    });
  }

  // ============ REPORTING ============

  GetScheduleUtilizationReport(params: any) {
    return request({
      url: "GetScheduleUtilizationReport",
      method: "get",
      params: params,
    });
  }

  GetOvertimeProjection(params: any) {
    return request({
      url: "GetOvertimeProjection",
      method: "get",
      params: params,
    });
  }

  GetStaffCoverageReport(params: any) {
    return request({
      url: "GetStaffCoverageReport",
      method: "get",
      params: params,
    });
  }

  ExportSchedule(params: any) {
    return request({
      url: "ExportSchedule",
      method: "get",
      params: params,
      responseType: "blob",
    });
  }

  // ============ TEMPLATE PRESETS ============

  // GetHospitalityTemplatePresets() {
  //   return request({
  //     url: "GetHospitalityTemplatePresets",
  //     method: "get",
  //   });
  // }

  // ApplyTemplatePreset(presetId: string, params: any) {
  //   return request({
  //     url: `ApplyTemplatePreset/${presetId}`,
  //     method: "post",
  //     data: params,
  //   });
  // }
}

export { WorkScheduleAPI as default };
