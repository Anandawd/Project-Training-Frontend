import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class CashSalesReconciliation extends configurationResource {
  constructor() {
    super(uri);
  }

  GetCashReconciliationList(query: any) {
    return request({
      url: "GetCashReconciliationList",
      method: "get",
      params: query,
    });
  }

  GetCashReconciliation(params: any) {
    return request({
      url: "GetCashReconciliation/" + params,
      method: "get",
    });
  }

  GetCashReconciliationComboList(params: any) {
    return request({
      url: "GetCashReconciliationComboList",
      method: "get",
    });
  }

  GetCashReconciliationDetailList(params: any) {
    return request({
      url: "GetCashReconciliationDetailList/" + params,
      method: "get",
    });
  }

  InsertCashReconciliation(resource: any) {
    return request({
      url: "InsertCashReconciliation",
      method: "post",
      data: resource,
    });
  }

  UpdateCashReconciliation(resource: any) {
    return request({
      url: "UpdateCashReconciliation",
      method: "put",
      data: resource,
    });
  }

  DeleteCashReconciliation(params: any) {
    return request({
      url: "DeleteCashReconciliation/" + params,
      method: "delete",
    });
  }
}

export { CashSalesReconciliation as default };
