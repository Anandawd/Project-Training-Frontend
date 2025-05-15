// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertStockTransfer } from "./indext";

const uri = "";

class StockTransferAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetStockTransferList(params: any) {
    return request({
      url: `GetStockTransferList`,
      method: "get",
      params
    });
  }

  GetStockTransferDetailList(params: any) {
    return request({
      url: `GetStockTransferDetailList`,
      method: "get",
      params
    });
  }

  GetStockTransferComboList(params: any) {
    return request({
      url: `GetStockTransferComboList`,
      method: "get",
    });
  }

  GetUom(params: any) {
    return request({
      url: `GetUom/` + params,
      method: "get",
    });
  }

  GetStockUomItem(params: any){
    return request({
      url: `GetTransferUomStockItem`,
      method: "get",
      params
    })
  }

  InsertStockTransfer(params: IInsertStockTransfer) {
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

  UpdateStockTransfer(params: IInsertStockTransfer) {
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
      url: `TraceStockTransfer` ,
      method: "get",
      params
    });
  }

}



export { StockTransferAPI as default };
