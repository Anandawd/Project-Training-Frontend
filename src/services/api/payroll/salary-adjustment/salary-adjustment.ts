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

  GetSalaryAdjustmentListIsCurrent(params: any) {
    return request({
      url: "GetPayEmployeeSalaryByIsCurrent",
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
  UpdateStatusSalaryAdjustment(params: any, status: any) {
    return request({
      url: `UpdatePayEmployeeSalaryStatus/${params}/${status}`,
      method: "put",
      data: params,
    });
  }

  // options
  GetEmployeeSalaryAdjustmentOptions(params: any) {
    return request({
      url: "GetPayEmployeeSalaryOption",
      method: "get",
      params: params,
    });
  }

  // utils
  GetAdjustmentSalaryCount(params: any) {
    return request({
      url: "GetPayEmployeeSalaryCount",
      method: "get",
      params: params,
    });
  }

  // employee detail
  GetSalaryAdjustmentListByEmployeeId(params: any) {
    return request({
      url: "GetPayEmployeeSalaryByEmployeeID/" + params,
      method: "get",
    });
  }
}

export { SalaryAdjustmentAPI as default };
