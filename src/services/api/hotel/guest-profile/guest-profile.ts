import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class GuestProfileAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetGuestProfileList(params: any) {
    return request({
      url: `GetGuestProfileList`,
      method: "get",
      params,
    });
  }
  InsertGuestProfile(params: any) {
    return request({
      url: `InsertGuestProfile`,
      method: "post",
      data: params,
    });
  }
  GetGuestProfile(params: any) {
    return request({
      url: `GetGuestProfile/` + params,
      method: "get",
    });
  }
  UpdateGuestProfile(params: any) {
    return request({
      url: `UpdateGuestProfile`,
      method: "put",
      data: params,
    });
  }
  DeleteLostAndFound(params: any) {
    return request({
      url: `DeleteLostAndFound/` + params,
      method: "delete",
    });
  }
  UpdateGuestProfileActive(params: any) {
    return request({
      url: `UpdateGuestProfileActive`,
      method: "put",
      data: params,
    });
  }
  UpdateGuestProfileBlacklist(params: any) {
    return request({
      url: `UpdateGuestProfileBlacklist`,
      method: "put",
      data: params,
    });
  }
  GetGuestProfileComboList() {
    return request({
      url: `GetGuestProfileComboList`,
      method: "get",
    });
  }
  GetStateByCountry(country: any) {
    return request({
      url: `GetStateByCountry/` + country,
      method: "get",
    });
  }
  GetCityByState(state: any) {
    return request({
      url: `GetCityByState/` + state,
      method: "get",
    });
  }

  GetGuestProfileByPhoneNumber(phoneNumber: any) {
    if (!phoneNumber) return;
    return request({
      url: `GetGuestProfileByPhoneNumber/` + phoneNumber,
      method: "get",
    });
  }

  GetGuestProfileByField(params: { Field: string; Value: string }) {
    return request({
      url: `GetGuestProfileByField`,
      method: "get",
      params,
    });
  }

  GetDuplicatedGuestProfile(params: any) {
    return request({
      url: `GetDuplicatedGuestProfile`,
      method: "get",
      params,
    });
  }

  MergeDuplicatedGuestProfile(data: any) {
    return request({
      url: `MergeDuplicatedGuestProfile`,
      method: "put",
      data,
    });
  }
}
export { GuestProfileAPI as default };
