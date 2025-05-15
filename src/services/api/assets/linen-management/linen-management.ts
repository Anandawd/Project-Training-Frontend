import { AnyObject } from "yup/lib/types";
import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class linenManagementAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetLinenManagementList(params: any) {
    return request({
      url: `GetLinenManagementList`,
      method: "get",
      params,
    });
  }
  GetFaLocationHistoryList(params: any) {
    return request({
      url: `GetFaLocationHistoryList`,
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
  InsertLinenManagement(params: any) {
    return request({
      url: `InsertLinenManagement`,
      method: "post",
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
  DeleteStockOpname(params: any) {
    return request({
      url: `DeleteStockOpname/` + params,
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
  GetLinenManagement(params: any) {
    return request({
      url: `GetLinenManagement`,
      method: "get",
      params,
    });
  }
  GetCostingJournalAccountComboList(params: any) {
    return request({
      url: `GetCostingJournalAccountComboList`,
      method: "get",
      params,
    });
  }
  GetStockOpnameDetailList(params: any) {
    return request({
      url: `GetStockOpnameDetailList`,
      method: "get",
      params,
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
  GetStockOpnameData(params: any) {
    return request({
      url: `GetStockOpnameData`,
      method: "get",
      params,
    });
  }
}
export { linenManagementAPI as default };
