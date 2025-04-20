import request from "@/utils/axios";
import {
  IFullGuestInHouseData,
  IMoveRoom,
  ISetComplimentHU,
} from "../../interfaces";
import RegistrationFormAPI from "../registration-form/registration-form";

class GuestInHouseAPI extends RegistrationFormAPI {
  constructor() {
    super();
  }

  guestInHouseList(params: any) {
    return request({
      url: "/GetGuestInHouseList",
      method: "get",
      params,
    });
  }

  editGuestInHouse(folioNumber: number) {
    return request({
      url: `/EditGuestInHouse/${folioNumber}`,
      method: "get",
    });
  }

  insertGuestInHouse(params: IFullGuestInHouseData) {
    return request({
      url: `/InsertGuestInHouse`,
      method: "post",
      data: params,
    });
  }

  updateGuestInHouse(params: IFullGuestInHouseData) {
    return request({
      url: `/UpdateGuestInHouse`,
      method: "put",
      data: params,
    });
  }

  setComplimentHU(params: ISetComplimentHU) {
    return request({
      url: `/SetComplimentHU`,
      method: "patch",
      data: params,
    });
  }

  moveRoom(params: IMoveRoom) {
    return request({
      url: `/MoveRoom`,
      method: "patch",
      data: params,
    });
  }

  setIncognito(params: any) {
    return request({
      url: `/SetIncognito`,
      method: "patch",
      data: params,
    });
  }

  guestDetail(folioNumber: number) {
    return request({
      url: `/GetGuestDetail/${folioNumber}`,
      method: "get",
    });
  }

  cancelCheckIn(params: any) {
    return request({
      url: `/CancelCheckIn`,
      method: "patch",
      data: params,
    });
  }

  lockUnlockFolio(params: any) {
    return request({
      url: `/LockUnlockFolio`,
      method: "patch",
      data: params,
    });
  }
}

export default GuestInHouseAPI;
