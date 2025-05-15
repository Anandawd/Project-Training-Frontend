// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
// import { IInsertStockTransfer } from "./indext";

const uri = "";

class CloseInventoryAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetCloseInventoryList(params: any) {
    return request({
      url: `GetCloseInventoryList`,
      method: "get",
      params
    });
  }

  PrecheckCloseInventory(params: any) {
    return request({
      url: `PrecheckCloseInventory`,
      method: "get",
      params
    });
  }

  ProcessCloseInventory(params: any) {
    return request({
      url: `ProcessCloseInventory`,
      method: "post",
      data: params
    });
  }

  DeleteCloseInventory() {
    return request({
      url: `DeleteCloseInventory`,
      method: "delete",
    });
  }

  GetLastInventoryClosedDate() {
    return request({
      url: `GetLastInventoryClosedDate`,
      method: "get",
    });
  }

  GetStockUomItem(params: any) {
    return request({
      url: `GetTransferUomStockItem`,
      method: "get",
      params
    })
  }

  InsertStockTransfer(params: any) {
    return request({
      url: `InsertStockTransfer`,
      method: "post",
      data: params
    });
  }

  GetStockTransfer(params: any) {
    return request({
      url: `GetStockTransfer/` + params,
      method: "get"
    });
  }

  UpdateStockTransfer(params: any) {
    return request({
      url: `UpdateStockTransfer`,
      method: "put",
      data: params
    });
  }

  DeleteStockTransfer(id: any) {
    return request({
      url: "DeleteStockTransfer/" + id,
      method: "delete",
    });
  }

  GetTraceStockTransferReceiveID(params: any) {
    return request({
      url: `TraceStockTransferReceiveID`,
      method: "get",
      params
    });
  }

  TraceStockTransferNumber(params: any) {
    return request({
      url: `TraceStockTransfer`,
      method: "get",
      params
    });
  }

}



export { CloseInventoryAPI as default };
