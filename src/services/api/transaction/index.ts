import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
import {
  IIsFolioAutoTransferAccount,
  IGetAccount,
  IGetTransactions,
  IInsertTransactions,
  IInsertTransactionPaymentCard,
  IGetPackageByBusinessSourceCommission,
  IInsertTransactionPackage,
  ICombineTransactionToSubFolio,
  ITransferBalance,
  IRoutingTransfer,
  IReturnTransfer,
  ITransferTransaction,
} from "./interfaces";

const uri = "";

class TransactionAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getChargePaymentComboList() {
    return request({
      url: "/GetReservationDepositComboList",
      method: "get",
    });
  }

  // getBalanceDeposit(params: number) {
  //   if (!params) return;
  //   return request({
  //     url: "/GetTotalDepositReservation/" + params,
  //     method: "get",
  //     data: params,
  //   });
  // }

  getTotalDepositReservation(params: any) {
    return request({
      url: "/GetTotalDepositReservation",
      method: "get",
      params,
    });
  }

  getPaymentCardComboList() {
    return request({
      url: "/GetReservationDepositCardComboList",
      method: "get",
    });
  }

  getAccount(params: IGetAccount) {
    return request({
      url: "/GetAccountBySubDepartmentTransactionEditor",
      method: "post",
      data: params,
    });
  }

  getAccountSubGroupByAccountCode1(accountCode: string) {
    return request({
      url: `/GetAccountSubGroupByAccountCode1/${accountCode}`,
      method: "get",
    });
  }

  IsFolioAutoTransferAccount(params: IIsFolioAutoTransferAccount) {
    return request({
      url: "/IsFolioAutoTransferAccount",
      method: "post",
      data: params,
    });
  }

  getTransactions(params: IGetTransactions) {
    return request({
      url: "/GetTransactionList",
      method: "get",
      params: params,
    });
  }

  getTransactionDetail(FolioNumber: number) {
    return request({
      url: `/GetTransactionDetail/${FolioNumber}`,
      method: "get",
    });
  }

  insertTransactions(params: IInsertTransactions) {
    return request({
      url: "/InsertTransaction",
      method: "post",
      data: params,
    });
  }

  insertTransactionPaymentCard(params: IInsertTransactionPaymentCard) {
    return request({
      url: "/TransactionPaymentCard",
      method: "post",
      data: params,
    });
  }

  insertTransactionPaymentDirectBill(params: IInsertTransactions) {
    return request({
      url: "/TransactionPaymentDirectBill",
      method: "post",
      data: params,
    });
  }

  insertTransactionPackage(params: any) {
    return request({
      url: "/InsertTransactionPackage",
      method: "post",
      data: params,
    });
  }

  getRoomUtilityMeter(params: any) {
    return request({
      url: "/GetRoomUtilityMeter",
      method: "get",
      params,
    });
  }

  getDirectBill(accountCode: string) {
    return request({
      url: "/GetTransactionDirectBillCompanies?account=" + accountCode,
      method: "get",
    });
  }

  getAPCompanies() {
    return request({
      url: "/GetAPCompanies",
      method: "get",
    });
  }

  getPackageByBusinessSource(params: any) {
    return request({
      url: "/GetTransactionPackage",
      method: "get",
      params,
    });
  }

  getPackageByBusinessSourceCommission(
    params: IGetPackageByBusinessSourceCommission
  ) {
    return request({
      url: "/GetPackageBusinessSourceCommission",
      method: "get",
      params,
    });
  }

  getPackageBreakdown(packageCode: string) {
    return request({
      url: "/GetTransactionPackageBreakdown/" + packageCode,
      method: "get",
    });
  }

  getDirectBillAROutstanding(companyCode: string) {
    return request({
      url: "/GetDirectBillAROutstanding?company=" + companyCode,
      method: "get",
    });
  }

  isFolioAutoTransferAccount(folioNumber: number, accountCode: string) {
    const params = {
      FolioNumber: folioNumber,
      AccountCode: accountCode,
    };
    return request({
      url: "/IsFolioAutoTransferAccount",
      method: "get",
      params: params,
    });
  }
  //Transfer
  getFolioListByType(folioTypeCode: string) {
    return request({
      url: "/GetFolioListByType/" + folioTypeCode,
      method: "get",
    });
  }

  getFolioList() {
    return request({
      url: "/GetFolioList",
      method: "get",
    });
  }

  getFolioReturns(folioNumber: number) {
    return request({
      url: "/GetFolioReturns/" + folioNumber,
      method: "get",
    });
  }

  getFolioRoutings(folioNumber: number) {
    return request({
      url: "/GetFolioRoutings/" + folioNumber,
      method: "get",
    });
  }

  getAccountCharges() {
    return request({
      url: "/GetAccountCharges",
      method: "get",
    });
  }

  getFolioBalance(folioNumber: number) {
    return request({
      url: "/GetFolioBalance/" + folioNumber,
      method: "get",
    });
  }

  getFolioTransactionAccount(folioNumber: number) {
    return request({
      url: "/GetFolioTransactionAccount/" + folioNumber,
      method: "get",
    });
  }

  combineTransactionToSubFolio(params: ICombineTransactionToSubFolio) {
    return request({
      url: "/CombineTransactionSubFolio",
      method: "post",
      data: params,
    });
  }

  transferTransaction(params: ITransferTransaction) {
    return request({
      url: "/TransferTransaction",
      method: "post",
      data: params,
    });
  }

  transferBalance(params: ITransferBalance) {
    return request({
      url: "/TransferBalance",
      method: "post",
      data: params,
    });
  }

  routingTransfer(params: IRoutingTransfer) {
    return request({
      url: "/RoutingTransfer",
      method: "post",
      data: params,
    });
  }

  deleteFolioRouting(folioNumber: number) {
    return request({
      url: "/DeleteFolioRouting/" + folioNumber,
      method: "post",
    });
  }

  returnTransfer(params: IReturnTransfer) {
    return request({
      url: "/ReturnTransfer",
      method: "post",
      data: params,
    });
  }

  getCorrection(ID: number, isDeposit?: boolean) {
    return request({
      url: "/GetCorrection/" + ID,
      method: "get",
      params: { IsDeposit: isDeposit },
    });
  }

  isCanVoidOrCorrect(params: any) {
    return request({
      url: "/IsCanVoidOrCorrect",
      method: "get",
      params,
    });
  }

  correctionTransaction(params: any) {
    return request({
      url: "/CorrectionTransaction",
      method: "post",
      data: params,
    });
  }

  voidTransaction(params: any) {
    return request({
      url: "/VoidTransaction",
      method: "post",
      data: params,
    });
  }

  checkOutFolio(folioNumber: number) {
    return request({
      url: "/CheckOutFolio/" + folioNumber,
      method: "post",
    });
  }

  autoPostingRoomCharge(params: any) {
    return request({
      url: "/AutoPostingRoomCharge",
      method: "post",
      data: params,
    });
  }

  getCountAutoPostingRoomCharge(folioNumber: number) {
    return request({
      url: "/GetCountAutoPostingRoomCharge/" + folioNumber,
      method: "get",
    });
  }

  updateSubDepartment(params: any) {
    return request({
      url: "/UpdateSubDepartment",
      method: "put",
      data: params,
    });
  }

  updateRemark(params: any) {
    return request({
      url: "/UpdateRemark",
      method: "put",
      data: params,
    });
  }

  updateDocumentNumber(params: any) {
    return request({
      url: "/UpdateDocumentNumber",
      method: "put",
      data: params,
    });
  }

  MoveSubFolio(params: any) {
    return request({
      url: "/MoveSubFolio",
      method: "put",
      data: params,
    });
  }

  // Properties=====================================================

  getProperties1(breakdown1: number) {
    return request({
      url: "/GetTransactionProperties1/" + breakdown1,
      method: "get",
    });
  }
  getProperties2(breakdown1: number, breakdown2: number) {
    return request({
      url: "/GetTransactionProperties2/" + breakdown1 + "/" + breakdown2,
      method: "get",
    });
  }
  getProperties3(id: number) {
    return request({
      url: "/GetTransactionProperties3/" + id,
      method: "get",
    });
  }
  //Change Correction Date

  getChangeCorrectionDateTransactionList(params: any) {
    return request({
      url: `/GetChangeCorrectionDateTransactionList`,
      method: "get",
      params,
    });
  }

  processChangeCorrectionDate(data: any) {
    return request({
      url: "/ProcessChangeCorrectionDate",
      method: "post",
      data,
    });
  }

  getPrintUtilityPeriod(folioNumber: number) {
    return request({
      url: "/GetPrintUtilityPeriod/" + folioNumber,
      method: "get",
    });
  }
}

export default TransactionAPI;
