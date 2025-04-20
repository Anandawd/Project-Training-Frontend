import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class defferedIncomeAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetDifferedIncomeList(params: any) {
    return request({
      url: `GetDifferedIncomeList`,
      method: "get",
      params,
    });
  }
  InsertDifferedIncome(params: any) {
    return request({
      url: `InsertDifferedIncome`,
      method: "post",
      data: params,
    });
  }
  GetDifferedIncome(params: any) {
    return request({
      url: `GetDifferedIncome/` + params,
      method: "get",
    });
  }
  UpdateDifferedIncome(params: any) {
    return request({
      url: `UpdateDifferedIncome`,
      method: "put",
      data: params,
    });
  }
  DeleteDifferedIncome(params: any) {
    return request({
      url: `DeleteDifferedIncome/` + params,
      method: "delete",
    });
  }
  GetDifferedIncomeComboList() {
    return request({
      url: `GetDifferedIncomeComboList`,
      method: "get",
    });
  }
  GetDifferedIncomeAccountList(params: any) {
    return request({
      url: `GetDifferedIncomeAccountList`,
      method: "get",
      params,
    });
  }
  GetDifferedIncomeDetailList(params: any) {
    return request({
      url: `GetDifferedIncomeDetailList/` + params,
      method: "get",
    });
  }
  // Post Section
  InsertDifferedIncomePost(params: any) {
    return request({
      url: `InsertDifferedIncomePost`,
      method: "post",
      data: params,
    });
  }
  DeleteDifferedIncomePost(params: any) {
    return request({
      url: `DeleteDifferedIncomePost/` + params,
      method: "delete",
    });
  }
  GetDifferedIncomePostComboList() {
    return request({
      url: `GetDifferedIncomePostComboList`,
      method: "get",
    });
  }
  GetDifferedIncomePost(params: any) {
    return request({
      url: `GetDifferedIncomePost/` + params,
      method: "get",
    });
  }
  UpdateDifferedIncomePost(params: any) {
    return request({
      url: `UpdateDifferedIncomePost`,
      method: "put",
      data: params,
    });
  }
  ///Post Prepaid Expense
  GetDifferedIncomePostCalculate(params: any) {
    return request({
      url: `GetDifferedIncomePostCalculate`,
      method: "get",
      params,
    });
  }
  ProcessPostDifferedIncome(params: any) {
    return request({
      url: `ProcessPostDifferedIncome`,
      method: "post",
      data: params,
    });
  }
  GetPostDifferedIncomeSubDepartmentList() {
    return request({
      url: `GetPostDifferedIncomeSubDepartmentList`,
      method: "get",
    });
  }
  GetPostDifferedIncomeAccountList(params: any) {
    return request({
      url: `GetPostDifferedIncomeAccountList`,
      method: "get",
      params,
    });
  }
}
export { defferedIncomeAPI as default };
