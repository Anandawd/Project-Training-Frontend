import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
const uri = "";

class CloseMonthAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getCloseMonthStatusList(param: any) {
    return request({
      url: "GetCloseMonthStatusList/" + param,
      method: "get",
    })
  }

  getCloseMonthYearList() {
    return request({
      url: "GetCloseMonthYearList",
      method: "get"
    })
  }

  processCloseMonth(resource: any) {
    return request({
      url: "ProcessCloseMonth",
      method: 'post',
      data: resource
    })
  }
}

export { CloseMonthAPI as default }