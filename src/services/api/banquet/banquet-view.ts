import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class Booking extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getBanquetView() {
    return request({
      url: "GetBanquetView",
      method: "get",
    });
  }
}