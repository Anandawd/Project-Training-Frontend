// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class TableViewAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetTableViewList() {
    return request({
      url: `GetTableViewList`,
      method: "get",
    });
  }

  GetTableViewCaptainOrder(query: any) {
    return request({
      url: "GetTableViewCaptainOrder",
      method: "get",
      params: query,
    });
  }

  UpdateTableView(resource: any) {
    return request({
      url: "UpdateTableView",
      method: "put",
      data: resource,
    });
  }

  UpdateTableCaptainOrder(resource: any) {
    return request({
      url: "UpdateTableCaptainOrder",
      method: "put",
      data: resource,
    });
  }

  TransferTransaction(resource: any) {
    return request({
      url: "POSTransferTransaction",
      method: "post",
      data: resource,
    });
  }

  GetTransferFromComboList() {
    return request({
      url: `GetTransferFromComboList`,
      method: "get",
    });
  }

  GetTransferToComboList(params: any) {
    return request({
      url: "GetTransferToComboList/" + params,
      method: "get",
    });
  }

  GetPosTransferFromList(params: any) {
    return request({
      url: "GetPosTransferFromList/" + params,
      method: "get",
    });
  }

  GetPosTransferToList(params: any) {
    return request({
      url: "GetPosTransferToList/" + params,
      method: "get",
    });
  }

  UpdateCaptainOrderTransaction(resource: any) {
    return request({
      url: "UpdateCaptainOrderTransaction",
      method: "put",
      data: resource,
    });
  }
}

export { TableViewAPI as default };
