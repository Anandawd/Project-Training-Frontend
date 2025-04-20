import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";
const uri = "";
class RoomTypeAvailabilityAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getRoomTypeAvailabilityList(params: any) {
    return request({
      url: `GetRoomTypeAvailability`,
      method: "get",
      params,
    });
  }

  pushAvailabilityToCM(data: any) {
    return request({
      url: `PushAvailabilityToChannelManager`,
      method: "post",
      data,
    });
  }
}
export default RoomTypeAvailabilityAPI;
