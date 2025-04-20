import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class StoreStockAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetStoreStockList(params: any) {
    return request({
      url: "GetStoreStockList",
      method: "get",
      params,
    });
  }

  GetStoreStockCardList(query: any) {
    return request({
      url: "GetStoreStockCardList",
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
}

export { StoreStockAPI as default };
