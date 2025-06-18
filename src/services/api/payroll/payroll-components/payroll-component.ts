import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class PayrollComponentsAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetPayrollComponentsList(params: any) {
    return request({
      url: "GetPayPayrollComponentList",
      method: "get",
      params: params,
    });
  }

  InsertPayrollComponent(params: any) {
    return request({
      url: "InsertPayPayrollComponentList",
      method: "post",
      data: params,
    });
  }

  GetPayrollComponent(params: any) {
    return request({
      url: "GetPayPayrollComponent/" + params,
      method: "get",
    });
  }

  UpdatePayrollComponent(params: any) {
    return request({
      url: "UpdatePayrollComponentList",
      method: "put",
      data: params,
    });
  }

  DeletePayrollComponent(params: any) {
    return request({
      url: "DeletePayPayrollComponent/" + params,
      method: "delete",
    });
  }

  // statutory
  GetStatutoryList(params: any) {
    return request({
      url: "GetPayStatutoryComponentList",
      method: "get",
      params: params,
    });
  }

  InsertStatutory(params: any) {
    return request({
      url: "InsertPayStatutoryComponentList",
      method: "post",
      data: params,
    });
  }

  GetStatutory(params: any) {
    return request({
      url: "GetPayStatutoryComponent/" + params,
      method: "get",
    });
  }

  UpdateStatutory(params: any) {
    return request({
      url: "UpdateStatutoryComponentList",
      method: "put",
      data: params,
    });
  }

  DeleteStatutory(params: any) {
    return request({
      url: "DeletePayStatutoryComponent/" + params,
      method: "delete",
    });
  }

  // component category
  GetComponentCategoryList(params: any) {
    return request({
      url: "GetPayCfgInitComponentCategoryList",
      method: "get",
      params: params,
    });
  }

  InsertComponentCategory(params: any) {
    return request({
      url: "InsertPayCfgInitComponentCategoryList",
      method: "post",
      data: params,
    });
  }

  GetComponentCategory(params: any) {
    return request({
      url: "GetPayCfgInitComponentCategory/" + params,
      method: "get",
    });
  }

  UpdateComponentCategory(params: any) {
    return request({
      url: "UpdateCfgInitComponentCategoryList",
      method: "put",
      data: params,
    });
  }

  DeleteComponentCategory(params: any) {
    return request({
      url: "DeletePayCfgInitComponentCategory/" + params,
      method: "delete",
    });
  }
}

export { PayrollComponentsAPI as default };
