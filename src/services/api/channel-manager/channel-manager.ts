import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class ChannelManager extends ConfigurationResource {
  constructor() {
    super(uri);
  }
  postRatePlan(params: any){
    return request({
        url: "PushRateToChannelManager",
        method: "post",
        data: params
      });
 }
}