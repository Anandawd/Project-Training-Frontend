import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class bankTransactionAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetBankTransactionList(params: any) {
    return request({
      url: `GetBankTransactionList`,
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
  InsertBankReconciliation(params: any) {
    return request({
      url: `InsertBankReconciliation`,
      method: "post",
      data: params,
    });
  }
  GetBankReconciliation(params: any) {
    return request({
      url: `GetBankReconciliation/` + params,
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
  DeleteBankReconciliation(params: any) {
    return request({
      url: `DeleteBankReconciliation/` + params,
      method: "delete",
    });
  }
  UpdateBankReconciliation(params: any) {
    return request({
      url: `UpdateBankReconciliation`,
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
  GetBankReconciliationComboList() {
    return request({
      url: `GetBankReconciliationComboList`,
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
  GetBankReconciliationDetailList(params: any) {
    return request({
      url: `GetBankReconciliationDetailList/` + params,
      method: "get",
    });
  }
}
export { bankTransactionAPI as default };
