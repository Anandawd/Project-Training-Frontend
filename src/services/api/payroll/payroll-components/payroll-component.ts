import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class PayrollComponentsAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetPayrollComponentsList(params: any) {
    return request({
      url: "GetPayrollComponentsList",
      method: "get",
      params: params,
    });
  }

  InsertPayrollComponent(params: any) {
    return request({
      url: "InsertPayrollComponent",
      method: "post",
      data: params,
    });
  }

  GetPayrollComponent(params: any) {
    return request({
      url: "GetPayrollComponent/" + params,
      method: "get",
    });
  }

  UpdatePayrollComponent(params: any) {
    return request({
      url: "UpdatePayrollComponent",
      method: "put",
      data: params,
    });
  }

  DeletePayrollComponent(params: any) {
    return request({
      url: "DeletePayrollComponent/" + params,
      method: "delete",
    });
  }
}

export { PayrollComponentsAPI as default };
