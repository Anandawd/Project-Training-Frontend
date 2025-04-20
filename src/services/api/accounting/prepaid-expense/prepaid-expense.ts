import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class prepaidExpenseAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetPrepaidExpenseList(params: any) {
    return request({
      url: `GetPrepaidExpenseList`,
      method: "get",
      params,
    });
  }
  InsertPrepaidExpense(params: any) {
    return request({
      url: `InsertPrepaidExpense`,
      method: "post",
      data: params,
    });
  }
  GetPrepaidExpense(params: any) {
    return request({
      url: `GetPrepaidExpense/` + params,
      method: "get",
    });
  }
  UpdatePrepaidExpense(params: any) {
    return request({
      url: `UpdatePrepaidExpense`,
      method: "put",
      data: params,
    });
  }
  DeletePrepaidExpense(params: any) {
    return request({
      url: `DeletePrepaidExpense/` + params,
      method: "delete",
    });
  }
  GetPrepaidExpenseComboList() {
    return request({
      url: `GetPrepaidExpenseComboList`,
      method: "get",
    });
  }
  GetExpenseAccountList(params: any) {
    return request({
      url: `GetExpenseAccountList`,
      method: "get",
      params,
    });
  }
  GetPrepaidExpenseDetailList(params: any) {
    return request({
      url: `GetPrepaidExpenseDetailList/` + params,
      method: "get",
    });
  }
  // Post Section
  InsertPrepaidExpensePost(params: any) {
    return request({
      url: `InsertPrepaidExpensePost`,
      method: "post",
      data: params,
    });
  }
  DeletePrepaidExpensePost(params: any) {
    return request({
      url: `DeletePrepaidExpensePost/` + params,
      method: "delete",
    });
  }
  GetPrepaidExpensePostComboList() {
    return request({
      url: `GetPrepaidExpensePostComboList`,
      method: "get",
    });
  }
  GetPrepaidExpensePost(params: any) {
    return request({
      url: `GetPrepaidExpensePost/` + params,
      method: "get",
    });
  }
  UpdatePrepaidExpensePost(params: any) {
    return request({
      url: `UpdatePrepaidExpensePost`,
      method: "put",
      data: params,
    });
  }
  ///Post Prepaid Expense
  GetPrepaidExpensePostCalculate(params: any) {
    return request({
      url: `GetPrepaidExpensePostCalculate`,
      method: "get",
      params,
    });
  }
  ProcessPostPrepaidExpense(params: any) {
    return request({
      url: `ProcessPostPrepaidExpense`,
      method: "post",
      data: params,
    });
  }
  GetPostPrepaidExpenseSubDepartmentList() {
    return request({
      url: `GetPostPrepaidExpenseSubDepartmentList`,
      method: "get",
    });
  }
  GetPostPrepaidExpenseAccountList(params: any) {
    return request({
      url: `GetPostPrepaidExpenseAccountList`,
      method: "get",
      params,
    });
  }
}
export { prepaidExpenseAPI as default };
