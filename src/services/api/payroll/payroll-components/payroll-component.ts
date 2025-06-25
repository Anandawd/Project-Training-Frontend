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

  // earnings
  GetEarningsComponentList() {
    return request({
      url: "GetPayrollComponentEarningsList",
      method: "get",
    });
  }

  InsertEarningsComponent(params: any) {
    return request({
      url: "InsertPayPayrollComponentList",
      method: "post",
      data: params,
    });
  }

  GetEarningsComponent(params: any) {
    return request({
      url: "GetPayPayrollComponent/" + params,
      method: "get",
    });
  }

  UpdateEarningsComponent(params: any) {
    return request({
      url: "UpdatePayrollComponentList",
      method: "put",
      data: params,
    });
  }

  DeleteEarningsComponent(params: any) {
    return request({
      url: "DeletePayPayrollComponent/" + params,
      method: "delete",
    });
  }
  // deductions
  GetDeductionsComponentList() {
    return request({
      url: "GetPayrollComponentDeductionsList",
      method: "get",
    });
  }

  InsertDeductionsComponent(params: any) {
    return request({
      url: "InsertPayPayrollComponentList",
      method: "post",
      data: params,
    });
  }

  GetDeductionsComponent(params: any) {
    return request({
      url: "GetPayPayrollComponent/" + params,
      method: "get",
    });
  }

  UpdateDeductionsComponent(params: any) {
    return request({
      url: "UpdatePayrollComponentList",
      method: "put",
      data: params,
    });
  }

  DeleteDeductionsComponent(params: any) {
    return request({
      url: "DeletePayPayrollComponent/" + params,
      method: "delete",
    });
  }

  // statutory
  GetStatutoryComponentList(params: any) {
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

  GetCategoryTypeOptions(params: any) {
    return request({
      url: "GetPayConstComponentTypeList",
      method: "get",
      params: params,
    });
  }

  // options
  GetCategoryTypeList() {
    return request({
      url: "GetPayConstCfgComponentTypeList",
      method: "get",
    });
  }

  GetComponentTypeList() {
    return request({
      url: "GetPayConstComponentTypeList",
      method: "get",
    });
  }

  GetComponentUnitList() {
    return request({
      url: "GetPayConstComponentUnitList",
      method: "get",
    });
  }
  GetEarningsCategoryList() {
    return request({
      url: "GetComponentEarningsList",
      method: "get",
    });
  }
  GetDeductionsCategoryList() {
    return request({
      url: "GetComponentDeductionsList",
      method: "get",
    });
  }
  GetStatutoryCategoryList() {
    return request({
      url: "GetComponentStatutoryList",
      method: "get",
    });
  }
}

export { PayrollComponentsAPI as default };
