// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalActivityLog } from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivityLogAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalActivityLogList(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityLogList/` + id,
      method: "get",
    });
  }

  GetSalActivityLog(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityLog/` + id,
      method: "get",
    });
  }

  InsertSalActivityLog(data: IInsertSalActivityLog) {
    return request({
      baseURL: variableValue,
      url: `InsertSalActivityLog`,
      method: "post",
      data: data
    });
  }
  
  UpdateSalActivityLog(params: IInsertSalActivityLog) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalActivityLog`,
      method: "put",
      data: params
    });
  }

  DeleteSalesActivityLog(params: any) {
    return request({
      baseURL: variableValue,
      url: "DeleteSalesActivityLog/" + params,
      method: "delete",
    });
  }
}

export { SalActivityLogAPI as default };
