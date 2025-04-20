import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class FAReceive extends configurationResource {
  constructor() {
    super(uri);
  }
  GetFAReceiveList(params: any) {
    return request({
      url: `GetFAReceiveList`,
      method: "get",
      params,
    });
  }
  GetFAReceiveDetailList(params: any) {
    return request({
      url: `GetFAReceiveDetailList/` + params,
      method: "get",
    });
  }
  GetFAPurchaseOrderItemList(params: any) {
    return request({
      url: `GetFAPurchaseOrderItemList/` + params,
      method: "get",
    });
  }
  GetFAReceiveComboList(params: any) {
    return request({
      url: `GetFAReceiveComboList`,
      method: "get",
      data: params,
    });
  }
  GetFAReceive(params: any) {
    return request({
      url: `GetFAReceive/` + params,
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
  InsertFAReceive(params: any) {
    return request({
      url: `InsertFAReceive`,
      method: "post",
      data: params,
    });
  }
  UpdateFAReceive(params: any) {
    return request({
      url: `UpdateFAReceive`,
      method: "put",
      data: params,
    });
  }
  DeleteFAReceive(params: any) {
    return request({
      url: `DeleteFAReceive/` + params,
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

export { FAReceive as default };
