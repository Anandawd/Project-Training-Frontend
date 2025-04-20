import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class RoomRateLastDeal extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetRoomRateLastDealList(params: any) {
    return request({
      url: `GetRoomRateLastDealList`,
      method: "get",
      params,
    });
  }

  ProcessRoomRateLastDeal(params: any) {
    return request({
      url: `ProcessRoomRateLastDeal`,
      method: "post",
      data: params,
    });
  }
}
export { RoomRateLastDeal as default };
