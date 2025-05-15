import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class AllStoreStockAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetAllStoreStockList(query: any) {
    return request({
      url: "GetAllStoreStockList",
      method: "get",
      params: query,
    });
  }

  GetAllStoreStockCardList(params: any) {
    return request({
      url: "GetAllStoreStockCardList",
      method: "get",
      params,
    });
  }
}

export { AllStoreStockAPI as default };
