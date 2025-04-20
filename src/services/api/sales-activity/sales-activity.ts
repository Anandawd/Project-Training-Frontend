// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalesActivity, IInsertSalActivityProposal, IInsertSalActivityTask } from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalesActivityAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  GetSalesActivityList(params: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalesActivityList`,
      method: "get",
      params
    });
  }

  GetDropdownArrayList(query: Array<string>) {
    return request({
      url: `GetMasterDataCodeNameArray?DataNameList=${JSON.stringify(query)}`,
      method: "get",
    });
  }

  GetSalesActivity(params: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalesActivity/` + params,
      method: "get"
    });
  }

  InsertSalesActivity(data: IInsertSalesActivity) {
    return request({
      baseURL: variableValue,
      url: `InsertSalesActivity`,
      method: "post",
      data: data
    });
  }

  UpdateSalesActivity(params: IInsertSalesActivity) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalesActivity`,
      method: "put",
      data: params
    });
  }

  VoidSalesActivity(params: any) {
    return request({
      baseURL: variableValue,
      url: "VoidSalesActivity/" + params,
      method: "put",
    });
  }

  // get data proposal and task calendar
  GetCalendar(params: any) {
    return request({
      baseURL: variableValue,
      url: "GetCalendar",
      method: "get",
      params
    })
  }

  GetSalActivityProposal(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityProposal/` + id,
      method: "get",
    });
  }

  GetSalActivityTask(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityTask/` + id,
      method: "get",
    });
  }

  UpdateSalActivityTask(params: IInsertSalActivityTask) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalActivityTask`,
      method: "put",
      data: params
    });
  }

  UpdateSalActivityProposal(params: IInsertSalActivityProposal) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalActivityProposal`,
      method: "put",
      data: params
    });
  }
}

export { SalesActivityAPI as default };
