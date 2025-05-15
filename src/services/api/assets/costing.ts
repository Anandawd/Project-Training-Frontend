import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class CostingAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetCostingList(query: any) {
    return request({
      url: "GetCostingList",
      method: "get",
      params: query,
    });
  }

  GetCosting(params: any) {
    return request({
      url: "GetCosting/" + params,
      method: "get",
    });
  }

  GetCostingJournalAccount(query: any) {
    return request({
      url: `GetCostingJournalAccount`,
      method: "get",
      params: query,
    });
  }

  GetCostingDetailList(query: any) {
    return request({
      url: `GetCostingDetailList`,
      method: "get",
      params: query,
    });
  }

  GetCostingComboList(params: any) {
    return request({
      url: "GetCostingComboList",
      method: "get",
    });
  }

  GetUom(params: any) {
    return request({
      url: "GetUom/" + params,
      method: "get",
    });
  }

  GetCostingUomStockItem(query: any) {
    return request({
      url: "GetCostingUomStockItem",
      method: "get",
      params: query,
    });
  }

  GetStoreStockComboList() {
    return request({
      url: "GetStoreStockComboList",
      method: "get",
    });
  }

  // for trace table
  GetTraceReceiveByID(receiveId: any) {
    return request({
      url: "GetTraceReceiveByID/" + receiveId,
      method: "get"
    })
  }

  InsertCosting(resource: any) {
    return request({
      url: "InsertCosting",
      method: "post",
      data: resource,
    });
  }

  UpdateCosting(resource: any) {
    return request({
      url: "UpdateCosting",
      method: "put",
      data: resource,
    });
  }

  // number
  DeleteCosting(params: any) {
    return request({
      url: "DeleteCosting/" + params,
      method: "delete",
    });
  }
}

export { CostingAPI as default };
