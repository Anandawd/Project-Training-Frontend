import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";
class GuestGroupAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getGuestGroupList(params: any) {
    return request({
      url: "/GetGuestGroupList",
      method: "get",
      params,
    });
  }

  getGuestGroup(id: number) {
    return request({
      url: "/GetGuestGroup/" + id,
      method: "get",
    });
  }

  insertGuestGroup(data: string) {
    return request({
      url: "/InsertGuestGroup",
      method: "post",
      data,
    });
  }

  updateGuestGroup(data: any) {
    return request({
      url: "/UpdateGuestGroup",
      method: "put",
      data,
    });
  }

  deleteGuestGroup(code: string) {
    return request({
      url: "/DeleteGuestGroup/" + code,
      method: "delete",
    });
  }

  insertReservationGuestGroup(params: any) {
    return request({
      url: "/InsertReservationGroup",
      method: "post",
      data: params,
    });
  }

  groupCheckInComboList(groupCode: string) {
    return request({
      url: "/GroupCheckInComboList/" + groupCode,
      method: "get",
    });
  }

  createMasterFolioGroupCheckIn(params: any) {
    return request({
      url: "/CreateMasterFolioGroupCheckIn",
      method: "post",
      data: params,
    });
  }

  checkInReservationGroup(params: any) {
    return request({
      url: "/CheckInReservationGroup",
      method: "post",
      data: params,
    });
  }
  // ==================================================
}

export default GuestGroupAPI;
