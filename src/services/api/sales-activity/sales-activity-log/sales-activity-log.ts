// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivityLogAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalesActivityLogList(params: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalesActivityLogList`,
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
}

export { SalActivityLogAPI as default };
