import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class purchaseRequestAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetPurchaseRequestList(params: any) {
    return request({
      url: `GetPurchaseRequestList`,
      method: "get",
      params,
    });
  }
  GetBankReconciliationList(params: any) {
    return request({
      url: `GetBankReconciliationList`,
      method: "get",
      params,
    });
  }
  InsertPurchaseRequest(params: any) {
    return request({
      url: `InsertPurchaseRequest`,
      method: "post",
      data: params,
    });
  }
  GetPurchaseRequest(params: any) {
    return request({
      url: `GetPurchaseRequest/` + params,
      method: "get",
    });
  }
  UpdateGuestProfile(params: any) {
    return request({
      url: `UpdateGuestProfile`,
      method: "put",
      data: params,
    });
  }
  DeletePurchaseRequest(params: any) {
    return request({
      url: `DeletePurchaseRequest/` + params,
      method: "delete",
    });
  }
  UpdatePurchaseRequest(params: any) {
    return request({
      url: `UpdatePurchaseRequest`,
      method: "put",
      data: params,
    });
  }
  UpdateGuestProfileBlacklist(params: any) {
    return request({
      url: `UpdateGuestProfileBlacklist`,
      method: "put",
      data: params,
    });
  }
  GetPurchaseRequestComboList() {
    return request({
      url: `GetPurchaseRequestComboList`,
      method: "get",
    });
  }
  GetBankReconciliationTransactionComboList(params: any) {
    return request({
      url: `GetBankReconciliationTransactionComboList`,
      method: "get",
      params,
    });
  }
  GetPurchaseRequestDetailList(params: any) {
    return request({
      url: `GetPurchaseRequestDetailList/` + params,
      method: "get",
    });
  }
  GetUom(params: any) {
    return request({
      url: `GetUom/` + params,
      method: "get",
    });
  }
  ApprovePurchaseRequest(params: any, id: any) {
    return request({
      url: `ApprovePurchaseRequest/` + id,
      method: "put",
      data: params,
    });
  }
  IsCanApplyPrice(params: any) {
    return request({
      url: `IsCanApplyPrice/` + params,
      method: "get",
    });
  }
  GetPurchaseRequestApplyPrice(params: any) {
    return request({
      url: `GetPurchaseRequestApplyPrice/` + params,
      method: "get",
    });
  }
  GetPurchaseRequestMarketList(params: any) {
    return request({
      url: `GetPurchaseRequestMarketList`,
      method: "get",
      params,
    });
  }
  GetShippingAddress(params: any) {
    return request({
      url: `GetMasterData/ShippingAddress/` + params,
      method: "get",
    });
  }
  GetStateByCountry(params: any) {
    return request({
      url: `GetStateByCountry/` + params,
      method: "get",
    });
  }
  GetPurchaseRequestCheaperPrice(params: any) {
    return request({
      url: `GetPurchaseRequestCheaperPrice`,
      method: "get",
      params,
    });
  }
  GetPurchaseRequestLastPrice(params: any) {
    return request({
      url: `GetPurchaseRequestLastPrice`,
      method: "get",
      params,
    });
  }
  ApplyPurchaseRequestPrice(params: any) {
    return request({
      url: `ApplyPurchaseRequestPrice`,
      method: "put",
      data: params,
    });
  }
}
export { purchaseRequestAPI as default };
