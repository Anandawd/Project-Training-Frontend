import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class FAPurchaseOrder extends configurationResource {
  constructor() {
    super(uri);
  }
  GetFAPurchaseOrderList(params: any) {
    return request({
      url: `GetFAPurchaseOrderList`,
      method: "get",
      params,
    });
  }
  GetFAPurchaseOrderDetailList(params: any) {
    return request({
      url: `GetFAPurchaseOrderDetailList/` + params,
      method: "get",
    });
  }
  GetFAPurchaseOrderComboList(params: any) {
    return request({
      url: `GetFAPurchaseOrderComboList`,
      method: "get",
      data: params,
    });
  }
  GetFAPurchaseOrder(params: any) {
    return request({
      url: `GetFAPurchaseOrder/` + params,
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
  InsertFAPurchaseOrder(params: any) {
    return request({
      url: `InsertFAPurchaseOrder`,
      method: "post",
      data: params,
    });
  }
  UpdateFAPurchaseOrder(params: any) {
    return request({
      url: `UpdateFAPurchaseOrder`,
      method: "put",
      data: params,
    });
  }
  DeleteFAPurchaseOrder(params: any) {
    return request({
      url: `DeleteFAPurchaseOrder/` + params,
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

export { FAPurchaseOrder as default };
