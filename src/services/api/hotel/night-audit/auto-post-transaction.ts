import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class AutoPostTransactionAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getPreCheckAutoPostList(params: any) {
    return request({
      url: `GetPreCheckAutoPostList`,
      method: "get",
      params,
    });
  }

  autoPostTransaction(params: any) {
    return request({
      url: `AutoPostTransaction`,
      method: "post",
      data: params,
    });
  }

  getPreCheckDayendCloseList(params: any) {
    return request({
      url: `PrecheckDayendClose`,
      method: "get",
      params,
    });
  }

  getDayendCloseStatus() {
    return request({
      url: `GetDayendCloseStatus`,
      method: "get",
    });
  }

  setDayendCloseStatus(data: any) {
    return request({
      url: `SetDayendCloseStatus`,
      method: "patch",
      data,
    });
  }
}
export default AutoPostTransactionAPI;
