import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class Production extends configurationResource {
  constructor() {
    super(uri);
  }
  GetProductionList(params: any) {
    return request({
      url: `GetProductionList`,
      method: "get",
      params,
    });
  }
  GetProductionDetailList(params: any) {
    return request({
      url: `GetProductionDetailList/` + params,
      method: "get",
    });
  }
  GetProductionComboList(params: any) {
    return request({
      url: `GetProductionComboList`,
      method: "get",
      data: params,
    });
  }
  GetProduction(params: any) {
    return request({
      url: `GetProduction`,
      method: "get",
      params,
    });
  }
  GetStoreList(params: any) {
    return request({
      url: `GetMasterDataCodeName/InventoryStore`,
      method: "get",
      params,
    });
  }
  GetGLAccountList(params: any) {
    return request({
      url: `GetGLAccountList`,
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
  InsertProduction(params: any) {
    return request({
      url: `InsertProduction`,
      method: "post",
      data: params,
    });
  }
  UpdateProduction(params: any) {
    return request({
      url: `UpdateProduction`,
      method: "put",
      data: params,
    });
  }
  DeleteProduction(params: any) {
    return request({
      url: `DeleteProduction/` + params,
      method: "delete",
    });
  }
  GetStateByCountry(params: any) {
    return request({
      url: `GetStateByCountry/` + params,
      method: "get",
    });
  }

  GetMasterData(type: any, code: any) {
    return request({
      url: `GetMasterData/` + type + "/" + code,
      method: "get",
    });
  }

  GetUom(params: any) {
    return request({
      url: `GetUom/` + params,
      method: "get",
    });
  }

  GetCostingUomStockItem(params: any) {
    return request({
      url: "GetCostingUomStockItem",
      method: "get",
      params,
    });
  }
}

export { Production as default };
