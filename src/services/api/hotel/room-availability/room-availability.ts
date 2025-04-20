import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class RoomAvailabilityAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getRoomAvailabilityList(params: any) {
    return request({
      url: `GetRoomAvailabilityList`,
      method: "get",
      params,
    });
  }
}
export default RoomAvailabilityAPI;
