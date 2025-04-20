import request from "@/utils/axios";
import {
  IVoidDeposit,
  IGetDepositReservationList,
  IInsertGuestDeposit,
  IVoidDepositByCorrectionId,
} from "../../interfaces";
import TransactionAPI from "../../transaction";
class DepositReservationAPI extends TransactionAPI {
  constructor() {
    super();
  }

  insertGuestDeposit(params: IInsertGuestDeposit) {
    return request({
      url: "/InsertGuestDeposit",
      method: "post",
      data: params,
    });
  }

  getDepositReservationList(params: IGetDepositReservationList) {
    return request({
      url: "/GetReservationDepositList",
      method: "post",
      data: params,
    });
  }

  getDepositReservationComboList() {
    return request({
      url: "/GetReservationDepositComboList",
      method: "get",
    });
  }

  getDepositCardReservationComboList() {
    return request({
      url: "/GetReservationDepositCardComboList",
      method: "get",
    });
  }

  voidDeposit(params: IVoidDeposit) {
    return request({
      url: "/VoidGuestDeposit",
      method: "post",
      data: params,
    });
  }

  voidDepositByCorrectionId(params: IVoidDepositByCorrectionId) {
    return request({
      url: "/VoidGuestDepositByCorrectionBreakdown",
      method: "post",
      data: params,
    });
  }

  transferDeposit(data: any) {
    return request({
      url: "/TransferDepositReservation",
      method: "post",
      data,
    });
  }

  getTransferComboList(params: any) {
    return request({
      url: "/GetDepositTransferComboList",
      method: "get",
      params,
    });
  }

  updateDocumentNumber(data: any) {
    return request({
      url: "/UpdateGuestDepositDocumentNumber",
      method: "patch",
      data,
    });
  }

  updateRemark(data: any) {
    return request({
      url: "/UpdateGuestDepositRemark",
      method: "patch",
      data,
    });
  }

  updateSubDepartment(data: any) {
    return request({
      url: "/UpdateGuestDepositSubDepartment",
      method: "patch",
      data,
    });
  }
}

export default DepositReservationAPI;
