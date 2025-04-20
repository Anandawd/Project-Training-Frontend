import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class ReceiveStock extends configurationResource {
  constructor() {
    super(uri);
  }
  GetReceivingList(params: any) {
    return request({
      url: `GetReceivingList`,
      method: "get",
      params,
    });
  }
  GetReceivingDetailList(params: any) {
    return request({
      url: `GetReceivingDetailList/` + params,
      method: "get",
    });
  }
  GetReceivingComboList(params: any) {
    return request({
      url: `GetReceivingComboList`,
      method: "get",
      data: params,
    });
  }
  GetTraceReceiveByNumber(params: any) {
    return request({
      url: `GetTraceReceiveByNumber/` + params,
      method: "get",
    });
  }
  GetTraceReceiveByID(params: any) {
    return request({
      url: `GetTraceReceiveByID/` + params,
      method: "get",
    });
  }
  GetReceiving(params: any) {
    return request({
      url: `GetReceiving/` + params,
      method: "get",
    });
  }
  GetPOItemList(params: any) {
    return request({
      url: `GetPOItemList/` + params,
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
  GetReceivingJournalAccount(params: any) {
    return request({
      url: `GetReceivingJournalAccount`,
      method: "get",
      params,
    });
  }
  GetReceivingItemJournalAccount(params: any) {
    return request({
      url: `GetReceivingItemJournalAccount`,
      method: "get",
      params,
    });
  }
  InsertReceiving(params: any) {
    return request({
      url: `InsertReceiving`,
      method: "post",
      data: params,
    });
  }
  UpdateReceiving(params: any) {
    return request({
      url: `UpdateReceiving`,
      method: "put",
      data: params,
    });
  }
  DeleteReceiving(params: any) {
    return request({
      url: `DeleteReceiving/` + params,
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

export { ReceiveStock as default };
