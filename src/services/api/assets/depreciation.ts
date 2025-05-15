import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
const uri = "";

class DepreciationApi extends configurationResource {
  constructor() {
    super(uri);
  }

  GetDepreciationList(query: any) {
    return request({
      url: "GetDepreciationList",
      method: "get",
      params: query,
    });
  }

  GetDepreciationDetails(param: any) {
    return request({
      url: "GetDepreciationDetails/" + param,
      method: "get",
    });
  }

  GetDeletedDepreciationList(query: any) {
    return request({
      url: "GetDeletedDepreciationList",
      method: "get",
      params: query,
    });
  }

  GetFaListSelected(query: any) {
    return request({
      url: "GetFaListSelected",
      method: "get",
      params: query,
    });
  }

  GetFaRevolutionList(param: any) {
    return request({
      url: "GetFaRevolutionList/" + param,
      method: "get",
    });
  }

  InsertDepreciation(resource: any) {
    return request({
      url: "InsertDepreciation",
      method: "post",
      data: resource,
    });
  }

  InsertDepreciationRange(query: any) {
    return request({
      url: "InsertDepreciationRange",
      method: "get",
      params: query,
    });
  }

  DeleteDepreciation(param: any) {
    return request({
      url: "DeleteDepreciation/" + param,
      method: "delete",
    });
  }
}

export { DepreciationApi as default };
