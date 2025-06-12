import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class SalaryAdjustmentAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetSalaryAdjustmentList(params: any) {
    return request({
      url: "GetPayEmployeeSalaryList",
      method: "get",
      params: params,
    });
  }

  InsertSalaryAdjustment(params: any) {
    return request({
      url: "InsertPayEmployeeSalaryList",
      method: "post",
      data: params,
    });
  }

  GetSalaryAdjustment(params: any) {
    return request({
      url: "GetPayEmployeeSalary/" + params,
      method: "get",
    });
  }

  UpdateSalaryAdjustment(params: any) {
    return request({
      url: "UpdateEmployeeSalaryList",
      method: "put",
      data: params,
    });
  }

  DeleteSalaryAdjustment(params: any) {
    return request({
      url: "DeletePayEmployeeSalary/" + params,
      method: "delete",
    });
  }

  // configurations
  GetAdjustmentReasonList(params: any) {
    return request({
      url: "GetPayCfgInitAdjustmentReasonList",
      method: "get",
      params: params,
    });
  }

  InsertAdjustmentReason(params: any) {
    return request({
      url: "InsertPayCfgInitAdjustmentReasonList",
      method: "post",
      data: params,
    });
  }

  GetAdjustmentReason(params: any) {
    return request({
      url: "GetPayCfgInitAdjustmentReason/" + params,
      method: "get",
    });
  }

  UpdateAdjustmentReason(params: any) {
    return request({
      url: "UpdateCfgInitAdjustmentReasonList",
      method: "put",
      data: params,
    });
  }

  DeleteAdjustmentReason(params: any) {
    return request({
      url: "DeletePayCfgInitAdjustmentReason/" + params,
      method: "delete",
    });
  }
  // Approve/Reject Salary Adjustment
  ApproveSalaryAdjustment(params: any) {
    return request({
      url: "ApproveSalaryAdjustment",
      method: "post",
      data: params,
    });
  }

  RejectSalaryAdjustment(params: any) {
    return request({
      url: "RejectSalaryAdjustment",
      method: "post",
      data: params,
    });
  }

  // Get Employee Options for dropdown
  GetEmployeeOptions() {
    return request({
      url: "GetEmployeeOptions",
      method: "get",
    });
  }

  // Get Adjustment Reason Options
  GetAdjustmentReasonOptions() {
    return request({
      url: "GetAdjustmentReasonOptions",
      method: "get",
    });
  }

  // Get Department Options
  GetDepartmentOptions() {
    return request({
      url: "GetDepartmentOptions",
      method: "get",
    });
  }
}

export { SalaryAdjustmentAPI as default };
