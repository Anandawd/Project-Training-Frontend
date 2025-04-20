import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class GuestPortalAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getGuestComplaintList(params: any) {
    return request({
      url: "GetGuestComplaintList",
      method: "get",
      params,
    });
  }
}
