import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";
import {
  IGetAvailableRoomByType,
  IGetRoomRate,
  IGetRoomRateAmount,
} from "../../interfaces";

const uri = "";
class RegistrationFormAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getBedTypeList(params: string) {
    return request({
      url: "/GetBedTypeByRoomType",
      method: "post",
      data: params,
    });
  }

  getBedTypeCode(roomNumber: string) {
    return request({
      url: "/GetBedTypeByRoomNumber",
      method: "post",
      data: `"${roomNumber}"`,
    });
  }

  getRoomNumberList(params: IGetAvailableRoomByType) {
    return request({
      url: "/GetAvailableRoomByType",
      method: "post",
      data: params,
    });
  }

  getRoomAvailable(params: IGetAvailableRoomByType) {
    return request({
      url: "/GetAvailableRoomCountByType",
      method: "post",
      data: params,
    });
  }

  getRoomRate(params: IGetRoomRate) {
    return request({
      url: "/GetRoomRate",
      method: "post",
      data: params,
    });
  }

  getRoomTypeByBuildingFloor(params: any) {
    return request({
      url: "/GetRoomTypeByBuildingFloor",
      method: "get",
      params,
    });
  }

  getRoomRateAmount(params: IGetRoomRateAmount) {
    return request({
      url: "/GetRoomRateAmount",
      method: "post",
      data: params,
    });
  }

  getStateByCountry(countryCode: string) {
    return request({
      url: "/GetStateByCountry/" + countryCode,
      method: "get",
    });
  }

  getCityByState(stateCode: string) {
    return request({
      url: "/GetCityByState/" + stateCode,
      method: "get",
    });
  }

  getBusinessSourceCommissionRate(params: any) {
    return request({
      url: "/GetBusinessSourceCommissionRate",
      method: "get",
      params,
    });
  }

  isDiscountLimit(params: any) {
    return request({
      url: "/IsDiscountLimit",
      method: "post",
      data: params,
    });
  }

  getScheduledRateList(isReservation: boolean, param: any) {
    let url = "/GetScheduledRateInHouseList/" + param;
    if (isReservation) url = "/GetScheduledRateReservationList/" + param;
    return request({
      url,
      method: "get",
    });
  }

  getScheduledRate(isReservation: boolean, Id: any) {
    let url = "/GetScheduledRateInHouse/" + Id;
    if (isReservation) url = "/GetScheduledRateReservation/" + Id;
    return request({
      url,
      method: "get",
    });
  }

  deleteScheduledRate(isReservation: boolean, Id: any) {
    let url = "/DeleteScheduledRateInHouse/" + Id;
    if (isReservation) url = "/DeleteScheduledRateReservation/" + Id;
    return request({
      url,
      method: "delete",
    });
  }

  insertScheduledRate(isReservation: boolean, data: any) {
    let url = "/InsertScheduledRateInHouse";
    if (isReservation) url = "/InsertScheduledRateReservation";
    return request({
      url,
      method: "post",
      data,
    });
  }

  updateScheduledRate(isReservation: boolean, data: any) {
    if (isReservation) {
      data.number = data.reservation_number;
    } else {
      data.number = data.folio_number;
    }
    let url = "/UpdateScheduledRateInHouse";
    if (isReservation) url = "/UpdateScheduledRateReservation";
    return request({
      url,
      method: "put",
      data,
    });
  }

  getMemberGuestProfile(memberCode: string) {
    if (!memberCode) return;
    return request({
      url: `/GetMemberGuestProfile/${memberCode}`,
      method: "get",
    });
  }

  // ==================================================
}

export default RegistrationFormAPI;
