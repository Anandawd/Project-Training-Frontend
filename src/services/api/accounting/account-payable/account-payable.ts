import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class AccountPayable extends configurationResource {
  constructor() {
    super(uri);
  }
  GetAPARList(params: any) {
    return request({
      url: `GetAPARList`,
      method: "get",
      params,
    });
  }
  GetAPARDetailList(params: any) {
    return request({
      url: `GetAPARDetailList/` + params,
      method: "get",
    });
  }
  GetAPARComboList(params: any) {
    return request({
      url: `GetAPARComboList`,
      method: "get",
      data: params,
    });
  }
  GetAPAR(type: any, number: any) {
    return request({
      url: `GetAPAR/` + type + "/" + number,
      method: "get",
    });
  }
  GetAPARPayment(params: any) {
    return request({
      url: `GetAPARPayment`,
      method: "get",
      params,
    });
  }
  GetAPARAccountList(params: any) {
    return request({
      url: `GetAPARAccountList`,
      method: "get",
      params,
    });
  }
  GetAPARCompanyOutstanding(params: any) {
    return request({
      url: `GetAPARCompanyOutstanding`,
      method: "get",
      params,
    });
  }
  GetAPARGLAccountList(params: any) {
    return request({
      url: `GetAPARGLAccountList`,
      method: "get",
      params,
    });
  }
  GetAPARPaymentComboList(params: any) {
    return request({
      url: `GetAPARPaymentComboList`,
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
  InsertAPAR(params: any) {
    return request({
      url: `InsertAPAR`,
      method: "post",
      data: params,
    });
  }
  InsertAPARPayment(params: any) {
    return request({
      url: `InsertAPARPayment`,
      method: "post",
      data: params,
    });
  }
  UpdateAPAR(params: any) {
    return request({
      url: `UpdateAPAR`,
      method: "put",
      data: params,
    });
  }
  UpdateAPARPayment(params: any) {
    return request({
      url: `UpdateAPARPayment`,
      method: "put",
      data: params,
    });
  }
  DeleteAPAR(type: any, number: any) {
    return request({
      url: `DeleteAPAR/` + type + "/" + number,
      method: "delete",
    });
  }
  DeleteAPARPayment(type:any,number: any) {
    return request({
      url: `DeleteAPARPayment/`+ type +"/"+ number,
      method: "delete",
    });
  }
  
}

export { AccountPayable as default };
