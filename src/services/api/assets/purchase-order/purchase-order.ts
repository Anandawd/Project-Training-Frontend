import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class JournalAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetPurchaseOrderList(params: any) {
    return request({
      url: `GetPurchaseOrderList`,
      method: "get",
      params,
    });
  }
  GetPurchaseOrderDetailList(params: any) {
    return request({
      url: `GetPurchaseOrderDetailList/` + params,
      method: "get",
    });
  }
  ClosePurchaseOrder(params: any) {
    return request({
      url: `ClosePurchaseOrder/` + params,
      method: "patch",
    });
  }
  UnclosePurchaseOrder(params: any) {
    return request({
      url: `UnclosePurchaseOrder/` + params,
      method: "patch",
    });
  }
  GetPurchaseOrderComboList(params: any) {
    return request({
      url: `GetPurchaseOrderComboList`,
      method: "get",
      data: params,
    });
  }
  GetPurchaseOrder(params: any) {
    return request({
      url: `GetPurchaseOrder/` + params,
      method: "get",
    });
  }
  GetGLAccountList(params: any) {
    return request({
      url: `GetGLAccountList`,
      method: "get",
      params,
    });
  }
  GetJournalAccountBalance(params: any) {
    return request({
      url: `GetJournalAccountBalance`,
      method: "get",
      params,
    });
  }
  InsertPurchaseOrder(params: any) {
    return request({
      url: `InsertPurchaseOrder`,
      method: "post",
      data: params,
    });
  }
  UpdatePurchaseOrder(params: any) {
    return request({
      url: `UpdatePurchaseOrder`,
      method: "put",
      data: params,
    });
  }
  DeletePurchaseOrder(params: any) {
    return request({
      url: `DeletePurchaseOrder/` + params,
      method: "delete",
    });
  }
  GetStateByCountry(params: any) {
    return request({
      url: `GetStateByCountry/` + params,
      method: "get",
    });
  }

  GetMasterData(type: any, code: any) {
    return request({
      url: `GetMasterData/` + type + "/" + code,
      method: "get",
    });
  }

  GetUom(params: any) {
    return request({
      url: `GetUom/` + params,
      method: "get",
    });
  }
}

export { JournalAPI as default };
