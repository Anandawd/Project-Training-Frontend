import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class DynamicRate extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetDynamicRateList(params: any) {
    return request({
      url: `GetDynamicRateList`,
      method: "get",
      params,
    });
  }

  ProcessDynamicRate(params: any) {
    return request({
      url: `ProcessDynamicRate`,
      method: "post",
      data: params,
    });
  }
}
export { DynamicRate as default };
