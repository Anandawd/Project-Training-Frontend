// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalActivityContact} from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivityContactAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalActivityContactList(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityContactList/` + id,
      method: "get",
    });
  }

  GetPhoneBookList(params: any) {
    return request({
      baseURL: variableValue,
      url: `GetPhoneBookList`,
      method: "get",
      params
    });
  }

  GetPhoneBook(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetPhoneBook/` + id,
      method: "get",
    });
  }

  GetStateByCountry(countryCode: Array<string>) {
    return request({
      url: "GetStateByCountry/" + countryCode,
      method: "get",
    });
  }

  InsertPhoneBook(data: IInsertSalActivityContact) {
    return request({
      baseURL: variableValue,
      url: `InsertPhoneBook`,
      method: "post",
      data: data
    });
  }
  
  UpdatePhoneBook(params: IInsertSalActivityContact) {
    return request({
      baseURL: variableValue,
      url: `UpdatePhoneBook`,
      method: "put",
      data: params
    });
  }

  DeletePhoneBook(params: any) {
    return request({
      baseURL: variableValue,
      url: "DeletePhoneBook/" + params,
      method: "delete",
    });
  }
}

export { SalActivityContactAPI as default };
