import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class ReceiveAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetReceivePaymentList(params: any) {
    return request({
      url: `GetReceiveList`,
      method: "get",
      params,
    });
  }
  GetReceivePayment(params: any) {
    return request({
      url: `GetReceive/` + params,
      method: "get",
    });
  }
  GetReceivePaymentDetailList(params: any) {
    return request({
      url: `GetReceiveDetailList/` + params,
      method: "get",
    });
  }
  GetReceivePaymentComboList(params: any) {
    return request({
      url: `GetReceiveComboList`,
      method: "get",
      data: params,
    });
  }
  GetGLAccountList(params: any) {
    return request({
      url: `GetReceiveGLAccountList`,
      method: "get",
      params,
    });
  }
  InsertReceivePayment(params: any) {
    return request({
      url: `InsertReceive`,
      method: "post",
      data: params,
    });
  }
  UpdateReceivePayment(params: any) {
    return request({
      url: `UpdateReceive`,
      method: "put",
      data: params,
    });
  }
  DeleteReceivePayment(params: any) {
    return request({
      url: `DeleteReceive/` + params,
      method: "delete",
    });
  }
}

export { ReceiveAPI as default };
