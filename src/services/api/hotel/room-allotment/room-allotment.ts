import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class RoomAllotment extends configurationResource {
  constructor() {
    super(uri);
  }
  GetRoomAllotmentList(params: any) {
    return request({
      url: `GetRoomAllotmentList`,
      method: "get",
      params,
    });
  }
  GetRoomAllotmentComboList(params: any) {
    return request({
      url: `GetRoomAllotmentComboList`,
      method: "get",
      data: params,
    });
  }
  GetRoomAllotment(params: any) {
    return request({
      url: `GetRoomAllotment/` + params,
      method: "get",
    });
  }
  InsertRoomAllotment(params: any) {
    return request({
      url: `InsertRoomAllotment`,
      method: "post",
      data: params,
    });
  }
  DeleteRoomAllotment(params: any) {
    return request({
      url: `DeleteRoomAllotment/` + params,
      method: "delete",
    });
  }
  UpdateRoomAllotment(params: any) {
    return request({
      url: `UpdateRoomAllotment`,
      method: "put",
      data: params,
    });
  }
}

export { RoomAllotment as default };
