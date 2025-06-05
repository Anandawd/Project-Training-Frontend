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

  SetDefaultTemplate(templateId: number) {
    return request({
      url: `SetDefaultTemplate/${templateId}`,
      method: "patch",
    });
  }

  DuplicateTemplate(templateId: number, newName: string) {
    return request({
      url: `DuplicateTemplate/${templateId}`,
      method: "post",
      data: { template_name: newName },
    });
  }

  ApplyTemplatePreset(presetId: string, params: any) {
    return request({
      url: `ApplyTemplatePreset/${presetId}`,
      method: "post",
      data: params,
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

  DeleteShiftType(shiftCode: string) {
    return request({
      url: `DeleteShiftType/${shiftCode}`,
      method: "delete",
    });
  }

  GetShiftTypesForDepartment(departmentCode: string) {
    return request({
      url: `GetShiftTypesForDepartment/${departmentCode}`,
      method: "get",
    });
  }

  GetShiftTypesForPosition(positionCode: string) {
    return request({
      url: `GetShiftTypesForPosition/${positionCode}`,
      method: "get",
    });
  }

  // ============ SEASONAL ADJUSTMENTS ============

  GetSeasonalAdjustments(placementCode: string, params?: any) {
    return request({
      url: `GetSeasonalAdjustments/${placementCode}`,
      method: "get",
      params: params,
    });
  }

  CreateSeasonalAdjustment(params: any) {
    return request({
      url: "CreateSeasonalAdjustment",
      method: "post",
      data: params,
    });
  }

  UpdateSeasonalAdjustment(params: any) {
    return request({
      url: "UpdateSeasonalAdjustment",
      method: "put",
      data: params,
    });
  }

  DeleteSeasonalAdjustment(adjustmentId: number) {
    return request({
      url: `DeleteSeasonalAdjustment/${adjustmentId}`,
      method: "delete",
    });
  }

  ApplySeasonalAdjustment(adjustmentId: number, targetDate: string) {
    return request({
      url: `ApplySeasonalAdjustment/${adjustmentId}`,
      method: "post",
      data: { target_date: targetDate },
    });
  }

  GetActiveSeasonalAdjustments(placementCode: string, date: string) {
    return request({
      url: `GetActiveSeasonalAdjustments/${placementCode}`,
      method: "get",
      params: { date },
    });
  }

  PreviewSeasonalAdjustment(adjustmentId: number, targetDate: string) {
    return request({
      url: `PreviewSeasonalAdjustment/${adjustmentId}`,
      method: "post",
      data: { target_date: targetDate },
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

  GetDepartmentStaffingRequirements(departmentCode: string, date: string) {
    return request({
      url: `GetDepartmentStaffingRequirements/${departmentCode}`,
      method: "get",
      params: { date },
    });
  }

  // ============ ENHANCED WEEKLY SCHEDULE MANAGEMENT ============

  GetWeeklyScheduleEnhanced(params: any) {
    return request({
      url: "GetWeeklyScheduleEnhanced",
      method: "get",
      params: params,
    });
  }

  GetEmployeeScheduleAssignments(employeeId: string, params?: any) {
    return request({
      url: `GetEmployeeScheduleAssignments/${employeeId}`,
      method: "get",
      params: params,
    });
  }

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

  RemoveEmployeeScheduleAssignment(assignmentId: number) {
    return request({
      url: `RemoveEmployeeScheduleAssignment/${assignmentId}`,
      method: "delete",
    });
  }

  // ============ DAILY SCHEDULE OPERATIONS ============

  GetDailyScheduleActual(params: any) {
    return request({
      url: "GetDailyScheduleActual",
      method: "get",
      params: params,
    });
  }

  UpdateDailySchedule(params: any) {
    return request({
      url: "UpdateDailySchedule",
      method: "put",
      data: params,
    });
  }

  BulkUpdateDailySchedules(params: any) {
    return request({
      url: "BulkUpdateDailySchedules",
      method: "put",
      data: params,
    });
  }

  GenerateScheduleFromTemplate(params: any) {
    return request({
      url: "GenerateScheduleFromTemplate",
      method: "post",
      data: params,
    });
  }

  CopySchedulePattern(params: any) {
    return request({
      url: "CopySchedulePattern",
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

  GetMutualSwapOptions(params: any) {
    return request({
      url: "GetMutualSwapOptions",
      method: "post",
      data: params,
    });
  }

  // ============ CONFLICT DETECTION & VALIDATION ============

  CheckScheduleConflicts(params: any) {
    return request({
      url: "CheckScheduleConflicts",
      method: "post",
      data: params,
    });
  }

  ValidateEmployeeSchedule(employeeId: string, params: any) {
    return request({
      url: `ValidateEmployeeSchedule/${employeeId}`,
      method: "post",
      data: params,
    });
  }

  ValidateStaffCoverage(params: any) {
    return request({
      url: "ValidateStaffCoverage",
      method: "post",
      data: params,
    });
  }

  GetScheduleConflictsSummary(params: any) {
    return request({
      url: "GetScheduleConflictsSummary",
      method: "get",
      params: params,
    });
  }

  ResolveScheduleConflict(conflictId: number, resolution: any) {
    return request({
      url: `ResolveScheduleConflict/${conflictId}`,
      method: "post",
      data: resolution,
    });
  }

  // ============ ANALYTICS & REPORTING ============

  GetScheduleAnalytics(params: any) {
    return request({
      url: "GetScheduleAnalytics",
      method: "get",
      params: params,
    });
  }

  GetWeeklyStats(params: any) {
    return request({
      url: "GetWeeklyStats",
      method: "get",
      params: params,
    });
  }

  GetDepartmentCoverage(params: any) {
    return request({
      url: "GetDepartmentCoverage",
      method: "get",
      params: params,
    });
  }

  GetShiftCoverage(params: any) {
    return request({
      url: "GetShiftCoverage",
      method: "get",
      params: params,
    });
  }

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

  // ============ EMERGENCY & OVERRIDE OPERATIONS ============

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

  ApproveEmergencyOverride(overrideId: number, approverNotes: string) {
    return request({
      url: `ApproveEmergencyOverride/${overrideId}`,
      method: "post",
      data: { approver_notes: approverNotes },
    });
  }

  // ============ HOSPITALITY SPECIFIC FEATURES ============

  // GetOccupancyBasedStaffing(params: any) {
  //   return request({
  //     url: "GetOccupancyBasedStaffing",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // CalculateStaffingNeeds(params: any) {
  //   return request({
  //     url: "CalculateStaffingNeeds",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // GetEventBasedAdjustments(params: any) {
  //   return request({
  //     url: "GetEventBasedAdjustments",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // CreateEventScheduleAdjustment(params: any) {
  //   return request({
  //     url: "CreateEventScheduleAdjustment",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // GetSkillBasedScheduling(params: any) {
  //   return request({
  //     url: "GetSkillBasedScheduling",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // AssignScheduleBySkills(params: any) {
  //   return request({
  //     url: "AssignScheduleBySkills",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // // ============ INTEGRATION WITH OTHER MODULES ============

  // SyncWithAttendance(params: any) {
  //   return request({
  //     url: "SyncWithAttendance",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // SyncWithPayroll(params: any) {
  //   return request({
  //     url: "SyncWithPayroll",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // GetSchedulePayrollImpact(params: any) {
  //   return request({
  //     url: "GetSchedulePayrollImpact",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // // ============ EXPORT & IMPORT ============

  // ExportSchedule(params: any) {
  //   return request({
  //     url: "ExportSchedule",
  //     method: "get",
  //     params: params,
  //     responseType: "blob",
  //   });
  // }

  // ImportSchedule(formData: FormData) {
  //   return request({
  //     url: "ImportSchedule",
  //     method: "post",
  //     data: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // }

  // GetScheduleImportTemplate() {
  //   return request({
  //     url: "GetScheduleImportTemplate",
  //     method: "get",
  //     responseType: "blob",
  //   });
  // }

  // ValidateScheduleImport(formData: FormData) {
  //   return request({
  //     url: "ValidateScheduleImport",
  //     method: "post",
  //     data: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // }

  // // ============ MOBILE & REAL-TIME FEATURES ============

  // GetMobileScheduleView(employeeId: string) {
  //   return request({
  //     url: `GetMobileScheduleView/${employeeId}`,
  //     method: "get",
  //   });
  // }

  // RequestScheduleNotification(params: any) {
  //   return request({
  //     url: "RequestScheduleNotification",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // GetRealTimeUpdates(params: any) {
  //   return request({
  //     url: "GetRealTimeUpdates",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // SubscribeToScheduleUpdates(employeeId: string) {
  //   return request({
  //     url: `SubscribeToScheduleUpdates/${employeeId}`,
  //     method: "post",
  //   });
  // }

  // // ============ COMPLIANCE & AUDIT ============

  // GetLaborComplianceReport(params: any) {
  //   return request({
  //     url: "GetLaborComplianceReport",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // ValidateLaborLawCompliance(params: any) {
  //   return request({
  //     url: "ValidateLaborLawCompliance",
  //     method: "post",
  //     data: params,
  //   });
  // }

  // GetScheduleAuditLog(params: any) {
  //   return request({
  //     url: "GetScheduleAuditLog",
  //     method: "get",
  //     params: params,
  //   });
  // }

  // GetUnionComplianceCheck(params: any) {
  //   return request({
  //     url: "GetUnionComplianceCheck",
  //     method: "post",
  //     data: params,
  //   });
  // }
}

export { WorkScheduleAPI as default };
