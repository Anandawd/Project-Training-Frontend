import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class PayrollAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetPayrollList(params: any) {
    return request({
      url: "GetPayPayrollList",
      method: "get",
      params: params,
    });
  }

  InsertPayroll(params: any) {
    return request({
      url: "InsertPayPayrollList",
      method: "post",
      data: params,
    });
  }

  GetPayroll(params: any) {
    return request({
      url: "GetPayPayroll/" + params,
      method: "get",
    });
  }

  UpdatePayroll(params: any) {
    return request({
      url: "UpdatePayrollPeriodList",
      method: "put",
      data: params,
    });
  }

  DeletePayroll(params: any) {
    return request({
      url: "DeletePayPayroll/" + params,
      method: "delete",
    });
  }

  // employee detail
  GetPayrollComponentListByEmployeeId(params: any) {
    return request({
      url: "GetPayrollComponentListByEmployeeId",
      method: "get",
      params: params,
    });
  }
}

export { PayrollAPI as default };
