import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import resource from "../../resource";

const uri = "";

class ReceiptAcc extends configurationResource {
  constructor() {
    super(uri);
  }

  GetReceiptList(query: any) {
    return request({
      url: "GetReceiptList",
      method: "get",
      params: query,
    });
  }

  GetReceipt(params: any) {
    return request({
      url: "GetReceipt/" + params,
      method: "get",
    });
  }

  GetReceiptNumber() {
    return request({
      url: "GetReceiptNumber",
      method: "get",
    });
  }

  InsertReceipt(resource: any) {
    return request({
      url: "InsertReceipt",
      method: "post",
      data: resource,
    });
  }

  UpdateReceipt(resource: any) {
    return request({
      url: "UpdateReceipt",
      method: "put",
      data: resource,
    });
  }

  DeleteReceipt(params: any) {
    return request({
      url: "DeleteReceipt/" + params,
      method: "delete",
    });
  }
}

export { ReceiptAcc as default };
