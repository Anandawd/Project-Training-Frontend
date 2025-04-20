import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class HousekeepingAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getHousekeepingList(params: any) {
    return request({
      url: `GetHousekeepingList`,
      method: "get",
      params,
    });
  }

  updateRoomStatus(params: any) {
    return request({
      url: `UpdateHousekeepingRoomStatus`,
      method: "patch",
      data: params,
    });
  }

  insertRoomUnavailable(params: any) {
    return request({
      url: `InsertRoomUnavailable`,
      method: "post",
      data: params,
    });
  }

  updateRoomUnavailable(params: any) {
    return request({
      url: `UpdateRoomUnavailable`,
      method: "put",
      data: params,
    });
  }

  setHousekeepingAvailableToday(unavailableID: number) {
    if (!unavailableID) throw new Error("unavailable id is required");
    return request({
      url: `SetHousekeepingAvailableToday/` + unavailableID,
      method: "patch",
    });
  }

  getRoomUnavailable(unavailableID: number) {
    if (!unavailableID) throw new Error("unavailable id is required");
    return request({
      url: `GetRoomUnavailable/` + unavailableID,
      method: "get",
    });
  }

  setHousekeepingRoomBlock(params: any) {
    return request({
      url: `SetHousekeepingRoomBlock`,
      method: "patch",
      data: params,
    });
  }

  setHousekeepingRoomStatus2(params: any) {
    return request({
      url: `SetHousekeepingRoomStatus2`,
      method: "patch",
      data: params,
    });
  }

  updateRoomOccupiedStatus(params: any) {
    return request({
      url: `UpdateRoomOccupiedStatus`,
      method: "patch",
      data: params,
    });
  }

  updateRoomRemark(params: any) {
    return request({
      url: `UpdateRoomRemark`,
      method: "patch",
      data: params,
    });
  }

  updateHKNote(params: any) {
    return request({
      url: `UpdateHKNote`,
      method: "patch",
      data: params,
    });
  }
}

export default HousekeepingAPI;
