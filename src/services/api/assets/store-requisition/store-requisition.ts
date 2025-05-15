import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class storeRequisitionAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetStoreRequisitionList(params: any) {
    return request({
      url: `GetStoreRequisitionList`,
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
  InsertStoreRequisition(params: any) {
    return request({
      url: `InsertStoreRequisition`,
      method: "post",
      data: params,
    });
  }
  UpdateStoreRequisition(params: any) {
    return request({
      url: `UpdateStoreRequisition`,
      method: "put",
      data: params,
    });
  }
  GetStoreRequisition(params: any) {
    return request({
      url: `GetStoreRequisition/` + params,
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
  DeleteStoreRequisition(params: any) {
    return request({
      url: `DeleteStoreRequisition/` + params,
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
  GetStoreRequisitionComboList() {
    return request({
      url: `GetStoreRequisitionComboList`,
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
  GetStoreRequisitionDetailList(params: any) {
    return request({
      url: `GetStoreRequisitionDetailList/` + params,
      method: "get",
    });
  }
  GetStoreRequisitionToStore(params: any) {
    return request({
      url: `GetStoreRequisitionToStore`,
      method: "get",
      params,
    });
  }
  ApproveStoreRequisition(params: any, id: any) {
    return request({
      url: `ApproveStoreRequisition/` + id,
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
  GetStoreRequisitionFinalApproval(params: any) {
    return request({
      url: `GetStoreRequisitionFinalApproval/` + params,
      method: "get",
    });
  }
  GetStoreRequisitionFinalApprovalComboList() {
    return request({
      url: `GetStoreRequisitionFinalApprovalComboList`,
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
  InsertStoreRequisitionFinalApproval(params: any) {
    return request({
      url: `InsertStoreRequisitionFinalApproval`,
      method: "post",
      data: params,
    });
  }
  GetStoreRequisitionItemDetail(params: any) {
    return request({
      url: `GetStoreRequisitionItemDetail`,
      method: "get",
      params,
    });
  }
  GetCostingUomStockItem(params: any) {
    return request({
      url: `GetCostingUomStockItem`,
      method: "get",
      params,
    });
  }
}
export { storeRequisitionAPI as default };
