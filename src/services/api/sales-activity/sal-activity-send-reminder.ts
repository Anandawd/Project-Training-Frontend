// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalActivitySendReminder} from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivitySendReminderAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalActivitySendReminderList(parentId: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivitySendReminderList/` + parentId,
      method: "get",
    });
  }

  GetSalActivitySendReminder(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivitySendReminder/` + id,
      method: "get",
    });
  }

  GetSalActivitySendReminderTemplate() {
    return request({
      baseURL: variableValue,
      url: `GetSalActivitySendReminderTemplate`,
      method: "get",
    });
  }

  GetEmailComboList() {
    return request({
      baseURL: variableValue,
      url: `GetEmailComboList`,
      method: "get",
    });
  }

  InsertSalActivitySendReminder(data: IInsertSalActivitySendReminder) {
    return request({
      baseURL: variableValue,
      url: `InsertSalActivitySendReminder`,
      method: "post",
      data: data
    });
  }
  
  UpdateSalActivitySendReminder(params: IInsertSalActivitySendReminder) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalActivitySendReminder`,
      method: "put",
      data: params
    });
  }

  DeleteSalActivitySendReminder(id: any) {
    return request({
      baseURL: variableValue,
      url: "DeleteSalActivitySendReminder/" + id,
      method: "delete",
    });
  }
}

export { SalActivitySendReminderAPI as default };
