import Resource from "../../resource";
import request from "@/utils/axios";

const tableName = "reservation";
const uri = "reservation";

class UtilsAPI extends Resource {
  constructor() {
    super(uri);
  }

  getServerDateTime() {
    return request({
      url: "/GetServerDateTime",
      method: "post",
    });
  }

  getServerDate() {
    return request({
      url: "/GetServerDateTime",
      method: "post",
    });
  }

  getConfigurationsAll() {
    return request({
      url: "/GetConfigurationAll",
      method: "get",
    });
  }

  getAuditDate() {
    return request({
      url: "/GetAuditDate",
      method: "post",
    });
  }

  tesConnection() {
    return request({
      url: "/Test",
      method: "get",
    });
  }

  getSubscriptionStatus() {
    return request({
      url: "/GetSubscriptionStatus",
      method: "get",
    });
  }

  log(id: string) {
    return request({
      url: "/tracking/log/" + tableName + "/" + id,
      method: "get",
    });
  }
}

export default UtilsAPI;
