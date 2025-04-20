import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class UserActivityLogAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  tableLog(params: any) {
    return request({
      url: "TableLog",
      method: "get",
      params,
    });
  }

  userLog(params: any) {
    return request({
      url: "UserLog",
      method: "get",
      params,
    });
  }

  keylockLog(params: any) {
    return request({
      url: "KeylockLog",
      method: "get",
      params,
    });
  }

  specialAccessLog(params: any) {
    return request({
      url: "SpecialAccessLog",
      method: "get",
      params,
    });
  }

  getLogComboList() {
    return request({
      url: "GetLogComboList",
      method: "get",
    });
  }
}
