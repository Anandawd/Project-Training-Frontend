import { __param } from "tslib";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
const uri = "";

class ReturnStockApi extends configurationResource {
  constructor() {
    super(uri);
  }

  GetReturnStockList(query: any) {
    return request({
      url: "GetReturnStockList",
      method: "get",
      params: query,
    });
  }

  GetReturnStockDetailsList(param: any) {
    return request({
      url: "ReturnStockDetailsList/" + param,
      method: "get",
    });
  }

  GetComboList() {
    return request({
      url: "GetReturnStockComboList",
      method: "get",
    });
  }

  GetStoreStockComboList() {
    return request({
      url: "GetStoreStockComboList",
      method: "get",
    });
  }

  GetUom(param: any) {
    return request({
      url: "GetUom/" + param,
      method: "get",
    });
  }

  GetMasterDataCodeNameArray(query: Array<string>) {
    return request({
      url: `GetMasterDataCodeNameArray?DataNameList=${JSON.stringify(query)}`,
      method: "get",
    });
  }

  GetReturnStock(query: any) {
    return request({
      url: "GetReturnStock",
      method: "get",
      params: query,
    });
  }

  InsertReturnStock(resource: any) {
    return request({
      url: "InsertReturnStock",
      method: "post",
      data: resource,
    });
  }

  UpdateReturnStock(resource: any) {
    return request({
      url: "UpdateReturnStock",
      method: "put",
      data: resource,
    });
  }

  DeleteReturnStock(param: any) {
    return request({
      url: "DeleteReturnStock/" + param,
      method: "delete",
    });
  }

  GetCostingUomStockItem(query: any) {
    return request({
      url: "GetCostingUomStockItem",
      method: "get",
      params: query,
    });
  }
}

export { ReturnStockApi as default };
