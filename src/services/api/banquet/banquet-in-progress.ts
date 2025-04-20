import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class BanquetInProgress extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getBanquetInProgressList(query: any) {
    return request({
      url: "GetBanquetInProgressList",
      method: "get",
      params: query
    })
  } 
  
  insertBanquetTransactionPackage(resource: any) {
    return request({
      url: "InsertBanquetTransactionPackage",
      method: "post",
      data: resource
    })
  }
}