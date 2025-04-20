// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertAPComission } from "./interface/indext";

const uri = "";

class APComission extends configurationResource {
  constructor() {
    super(uri);
  }

  getAPCommissionList(params: any) {
    return request({
      url: `GetAPCommissionList`,
      method: "get",
      params,
    });
  }
  getAPCommissionComboCompanyList() {
    return request({
      url: `GetARCompanies`,
      method: "get",
    });
  }

  InsertAPCommissionPayment(params: IInsertAPComission) {
    return request({
      url: `InsertAPCommissionPayment`,
      method: "post",
      data: params,
    });
  }

  getAPCommissionComboList(params: any) {
    return request({
      url: `GetAPCommissionComboList?`,
      method: "get",
      params,
    });
  }

  paymentDetailDataList(subFolioId: number) {
    return request({
      url: `GetAPCommissionPaymentDataList/${subFolioId}`,
      method: "get",
    });
  }

  updateAPCommissionPayment(params: IInsertAPComission) {
    return request({
      url: `UpdateAPCommissionPayment`,
      method: "put",
      data: params,
    });
  }

  UpdateAPCommissionCompany(params: any) {
    return request({
      url: `UpdateAPCommissionCompany`,
      method: "put",
      data: params,
    });
  }

  deleteAPCommissionPayment(id: any) {
    return request({
      url: "DeleteAPCommissionPayment/" + id,
      method: "delete",
    });
  }
}

export { APComission as default };
