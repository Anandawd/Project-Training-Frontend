import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
const uri = "";
class PointOfSalesAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getProductList(params: any) {
    return request({
      url: `GetPOSProductList`,
      method: "get",
      params,
    });
  }

  getCategoryList(outletCode: string) {
    return request({
      url: `GetPOSCategoryList/` + outletCode,
      method: "get",
    });
  }

  getOutletList() {
    return request({
      url: `GetPOSOutletList`,
      method: "get",
    });
  }

  getCaptainOrderComboList() {
    return request({
      url: `GetCaptainOrderComboList`,
      method: "get",
    });
  }

  getTableList(outletCode: string) {
    return request({
      url: `GetPOSTableList/` + outletCode,
      method: "get",
    });
  }

  getCaptainOrderList(params: any) {
    return request({
      url: "GetPOSCaptainOrderList",
      method: "get",
      params,
    });
  }

  getCaptainOrderDetailList(captainOrderId: number) {
    return request({
      url: "GetPOSCaptainOrderDetailList/" + captainOrderId,
      method: "get",
    });
  }

  getClosedTransactionList(params: any) {
    return request({
      url: "GetPOSClosedTransactionList",
      method: "get",
      params,
    });
  }

  getClosedTransactionDetailList(params: {
    checkNumber: string;
    showVoid: any;
  }) {
    return request({
      url: "GetPOSClosedTransactionDetailList/" + params.checkNumber,
      method: "get",
      params: { ShowVoid: params.showVoid },
    });
  }

  insertCaptainOrder(params: any) {
    return request({
      url: `InsertCaptainOrder`,
      method: "post",
      data: params,
    });
  }

  insertTransaction(params: any) {
    return request({
      url: `InsertPOSTransaction`,
      method: "post",
      data: params,
    });
  }

  getTransactionList(CaptainOrderId: number) {
    return request({
      url: `GetPOSTransactionList/` + CaptainOrderId,
      method: "get",
    });
  }

  changeQuantity(params: any) {
    return request({
      url: `ChangePOSQuantity`,
      method: "patch",
      data: params,
    });
  }

  changeQuantityAuth(params: any) {
    return request({
      url: `ChangePOSQuantityAuthorization`,
      method: "patch",
      data: params,
    });
  }

  getUserMaxDiscount(params: any) {
    return request({
      url: `MaxDiscountPOS`,
      method: "get",
      params,
    });
  }

  discountItem(params: any) {
    return request({
      url: `DiscountPOS`,
      method: "patch",
      data: params,
    });
  }

  getCaptainOrder(captainOrderId: number) {
    return request({
      url: `GetCaptainOrder/${captainOrderId}`,
      method: "get",
    });
  }

  updateCaptainOrder(params: any) {
    return request({
      url: `UpdateCaptainOrder`,
      method: "put",
      data: params,
    });
  }

  insertSpecialItem(params: any) {
    return request({
      url: `AddSpecialItemPOS`,
      method: "post",
      data: params,
    });
  }

  insertPayment(params: any) {
    return request({
      url: `InsertPOSPayment`,
      method: "post",
      data: params,
    });
  }

  getAccountProductGroup() {
    return request({
      url: `GetPOSAccountProductGroup`,
      method: "get",
    });
  }

  cancelCaptainOrder(params: any) {
    return request({
      url: `CancelPOSCaptainOrder`,
      method: "patch",
      data: params,
    });
  }

  getPaymentList(outletCode: string) {
    return request({
      url: `GetPOSPaymentList/${outletCode}`,
      method: "get",
    });
  }

  getCOSummary(captainOrderId: number) {
    return request({
      url: `GetPOSSummaryCaptainOrderOrCheck/co/${captainOrderId}`,
      method: "get",
    });
  }

  getCheckSummary(checkNumber: number) {
    return request({
      url: `GetPOSSummaryCaptainOrderOrCheck/check/${checkNumber}`,
      method: "get",
    });
  }

  getPaymentStatus(params: any) {
    return request({
      url: `GetPOSPaymentStatus`,
      method: "get",
      params,
    });
  }

  finishSale(captainOrderId: number) {
    return request({
      url: `ProcessFinishSale/${captainOrderId}`,
      method: "post",
    });
  }

  removeAllItem(params: any) {
    return request({
      url: `RemoveAllItemPOS`,
      method: "delete",
      data: params,
    });
  }

  removeItem(params: any) {
    return request({
      url: `RemoveItemPOS`,
      method: "delete",
      data: params,
    });
  }

  overridePrice(params: any) {
    return request({
      url: `OverridePricePOS`,
      method: "patch",
      data: params,
    });
  }

  modifyPrice(params: any) {
    return request({
      url: `ModifyPricePOS`,
      method: "patch",
      data: params,
    });
  }

  voidCheck(params: any) {
    return request({
      url: `VoidPOSCheck`,
      method: "patch",
      data: params,
    });
  }

  updateSubDepartment(params: any) {
    return request({
      url: `UpdatePOSComplimentSubDepartment`,
      method: "patch",
      data: params,
    });
  }

  printCaptainOrderToKitchen(params: any) {
    return request({
      url: `PrintCaptainOrderToKitchen`,
      method: "post",
      data: params,
    });
  }

  updatePOSTransactionRemark(params: any) {
    return request({
      url: `UpdatePOSTransactionRemark`,
      method: "patch",
      data: params,
    });
  }

  printCaptainOrderToKitchenService(ip: string, port: string, params: any) {
    return request({
      url: `ws://${ip}:${port}/print`,
      method: "post",
      data: params,
    });
  }
  // GetPrepaidExpenseList(params: any) {
  //   return request({
  //     url: `GetPrepaidExpenseList`,
  //     method: "get",
  //     params
  //   });
  // }
}
export default PointOfSalesAPI;
