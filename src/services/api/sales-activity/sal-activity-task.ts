// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalActivityTask } from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivityTaskAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalActivityTaskList(id: any, params: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityTaskList/` + id,
      method: "get",
      params : params
    });
  }

  GetSalActivityTask(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityTask/` + id,
      method: "get",
    });
  }

  SalesTaskRepeatComboList() {
    return request({
      baseURL: variableValue,
      url: `SalesTaskRepeatComboList`,
      method: "get",
    });
  }

  InsertSalActivityTask(data: IInsertSalActivityTask) {
    return request({
      baseURL: variableValue,
      url: `InsertSalActivityTask`,
      method: "post",
      data: data
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

  VoidSalesActivityTask(params: any) {
    return request({
      baseURL: variableValue,
      url: "VoidSalesActivityTask/" + params,
      method: "put",
    });
  }
}

export { SalActivityTaskAPI as default };
