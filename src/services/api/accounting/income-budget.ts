// import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertIncomeBudget } from "./interface/indext";

const uri = "";

class IncomeBudgetAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getIncomeBudgetList(params: any) {
    return request({
      url: `GetIncomeBudgetList`,
      method: "get",
      params,
    });
  }

  insertIncomeBudget(params: any) {
    return request({
      url: `InsertIncomeBudget`,
      method: "post",
      data: params,
    });
  }

  getAccountingBudgetComboList(params: any) {
    return request({
      url: `GetAccountingBudgetComboList`,
      method: "get",
    });
  }

  getIncomeBudgetAccountComboList(subDepartmentCode: string) {
    if (!subDepartmentCode) return;
    return request({
      url: `GetIncomeBudgetAccountComboList/${subDepartmentCode}`,
      method: "get",
    });
  }

  getIncomeBudget(params: number) {
    return request({
      url: `GetIncomeBudget/` + params,
      method: "get",
    });
  }

  updateIncomeBudget(params: any) {
    return request({
      url: `UpdateIncomeBudget`,
      method: "put",
      data: params,
    });
  }

  deleteIncomeBudget(id: any) {
    return request({
      url: "DeleteIncomeBudget/" + id,
      method: "delete",
    });
  }
}

export { IncomeBudgetAPI as default };
