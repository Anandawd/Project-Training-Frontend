// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertAPRefundDeposit } from "./interface/indext";

const uri = "";

class APRefundAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetAPRefundDepositDataList(params: any) {
    return request({
      url: `GetAPRefundDepositDataList`,
      method: "get",
      params,
    });
  }

  InsertAPRefundDepositPayment(params: IInsertAPRefundDeposit) {
    return request({
      url: `InsertAPRefundDepositPayment`,
      method: "post",
      data: params,
    });
  }

  getAPRefundDepositComboList(params: any) {
    return request({
      url: `GetAPRefundDepositComboList?`,
      method: "get",
      params,
    });
  }

  paymentDetailDataList(subFolioId: number) {
    return request({
      url: `GetAPRefundDepositPaymentDataList/${subFolioId}`,
      method: "get",
    });
  }

  UpdateAPRefundDepositPayment(params: IInsertAPRefundDeposit) {
    return request({
      url: `UpdateAPRefundDepositPayment`,
      method: "put",
      data: params,
    });
  }

  DeleteAPRefundDepositPayment(id: any) {
    return request({
      url: "DeleteAPRefundDepositPayment/" + id,
      method: "delete",
    });
  }
}

export { APRefundAPI as default };
