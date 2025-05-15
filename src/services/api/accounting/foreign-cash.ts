import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import resource from "../../resource";

const uri = "";

class ForeignCash extends configurationResource {
  constructor() {
    super(uri);
  }

  GetForeignCashList(query: any) {
    return request({
      url: "GetForeignCashList",
      method: "get",
      params: query,
    });
  }

  GetForeignCashComboList(params: any) {
    return request({
      url: "GetForeignCashComboList",
      method: "get",
    });
  }

  InsertForeignCash(resource: any) {
    return request({
      url: "InsertForeignCash",
      method: "post",
      data: resource,
    });
  }

  GetForeignCash(params: any) {
    return request({
      url: "GetForeignCash/" + params,
      method: "get",
    });
  }

  UpdateForeignCash(resource: any) {
    return request({
      url: "UpdateForeignCash",
      method: "put",
      data: resource,
    });
  }

  GetForeignCashStock(params: any) {
    return request({
      url: `GetForeignCashStock?CurrencyCode=` + params,
      method: "get",
    });
  }

  ChangeForeignCash(resource: any) {
    return request({
      url: "ChangeForeignCash",
      method: "post",
      data: resource,
    });
  }

  DeleteForeignCash(params: any) {
    return request({
      url: "DeleteForeignCash/" + params,
      method: "delete",
    });
  }
}

export { ForeignCash as default };
