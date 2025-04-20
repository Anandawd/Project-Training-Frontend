// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalActivityNotes } from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivityNotesAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalActivityNotesList(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityNotesList/` + id,
      method: "get",
    });
  }

  GetSalActivityNotes(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityNotes/` + id,
      method: "get",
    });
  }

  InsertSalActivityNotes(data: IInsertSalActivityNotes) {
    return request({
      baseURL: variableValue,
      url: `InsertSalActivityNotes`,
      method: "post",
      data: data
    });
  }
  
  UpdateSalActivityNotes(params: IInsertSalActivityNotes) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalActivityNotes`,
      method: "put",
      data: params
    });
  }

  DeleteSalesActivityNotes(params: any) {
    return request({
      baseURL: variableValue,
      url: "DeleteSalesActivityNotes/" + params,
      method: "delete",
    });
  }
}

export { SalActivityNotesAPI as default };
