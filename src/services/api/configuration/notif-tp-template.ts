// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
// import { IInsertSalActivityContact} from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class NotifTpTemplate extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetNotifThirdPartyTemplateList(params: any) {
    return request({
      baseURL: variableValue,
      url: `GetNotifThirdPartyTemplateList`,
      method: "get",
      params
    });
  }


  GetNotifThirdPartyTemplate(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetNotifThirdPartyTemplate/` + id,
      method: "get",
    });
  }

  
  UpdateNotifTpTemplate(params: any) {
    return request({
      baseURL: variableValue,
      url: `UpdateNotifTpTemplate`,
      method: "put",
      data: params
    });
  }
}

export { NotifTpTemplate as default };
