import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class PaymentAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetReceivePaymentList(params: any) {
    return request({
      url: `GetPaymentList`,
      method: "get",
      params,
    });
  }
  GetReceivePayment(params: any) {
    return request({
      url: `GetPayment/` + params,
      method: "get",
    });
  }
  GetReceivePaymentDetailList(params: any) {
    return request({
      url: `GetPaymentDetailList/` + params,
      method: "get",
    });
  }
  GetReceivePaymentComboList(params: any) {
    return request({
      url: `GetPaymentComboList`,
      method: "get",
      data: params,
    });
  }
  GetGLAccountList(params: any) {
    return request({
      url: `GetPaymentGLAccountList`,
      method: "get",
      params,
    });
  }
  InsertReceivePayment(params: any) {
    return request({
      url: `InsertPayment`,
      method: "post",
      data: params,
    });
  }
  UpdateReceivePayment(params: any) {
    return request({
      url: `UpdatePayment`,
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

export { PaymentAPI as default };
