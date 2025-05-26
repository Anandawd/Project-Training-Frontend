import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class SalaryAdjustmentAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetSalaryAdjustmentList(params: any) {
    return request({
      url: "GetSalaryAdjustmentList",
      method: "get",
      params: params,
    });
  }

  InsertSalaryAdjustment(params: any) {
    return request({
      url: "InsertSalaryAdjustment",
      method: "post",
      data: params,
    });
  }

  GetSalaryAdjustment(params: any) {
    return request({
      url: "GetSalaryAdjustment/" + params,
      method: "get",
    });
  }

  UpdateSalaryAdjustment(params: any) {
    return request({
      url: "UpdateSalaryAdjustment",
      method: "put",
      data: params,
    });
  }

  DeleteSalaryAdjustment(params: any) {
    return request({
      url: "DeleteSalaryAdjustment/" + params,
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
