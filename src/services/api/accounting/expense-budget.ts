import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import {
  IInsertExpenseBudget,
} from "./interface/indext";

const uri = "";

class ExpenseBudgetAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getExpenseBudgetList(query: any) {
    return request({
      url: "GetExpenseBudgetList",
      method: "get",
      params: query
    })
  }
  
  getExpenseBudget(params: any) {
    return request({
      url: "GetExpenseBudget/" + params,
      method: "get"
    })
  }

  getExpenseBudgetComboList(query: any) {
    return request({
      url: `GetAccountingBudgetComboList`,
      method: "get",
    });
  }

  GetExpenseGLAccountComboList(code: any) {
    return request({
      url: "GetExpenseGLAccountComboList",
      method: "get",
      params: code
    })
  }

  InsertExpenseBudget(params: IInsertExpenseBudget) {
    return request({
      url: "InsertExpenseBudget",
      method: "post",
      data: params
    })
  }

  updateExpenseBudget(params: IInsertExpenseBudget) {
    return request({
      url: "UpdateExpenseBudget",
      method: "put",
      data: params
    })
  }

  deleteExpenseBudget(params: any) {
    return request({
      url: "DeleteExpenseBudget/" + params,
      method: "delete"
    })
  }
}

export {ExpenseBudgetAPI as default}