import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class HolidayCalenderAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetHolidayCalenderList(params: any) {
    return request({
      url: "GetPayCfgInitHolidayList",
      method: "get",
      params: params,
    });
  }

  GetHolidayCalenderListIsCurrent(params: any) {
    return request({
      url: "GetPayEmployeeSalaryByIsCurrent",
      method: "get",
      params: params,
    });
  }

  InsertHolidayCalender(params: any) {
    return request({
      url: "InsertPayCfgInitHolidayList",
      method: "post",
      data: params,
    });
  }

  GetHolidayCalender(params: any) {
    return request({
      url: "GetPayCfgInitHoliday/" + params,
      method: "get",
    });
  }

  UpdateHolidayCalender(params: any) {
    return request({
      url: "UpdateCfgInitHolidayList",
      method: "put",
      data: params,
    });
  }

  DeleteHolidayCalender(params: any) {
    return request({
      url: "DeletePayCfgInitHoliday/" + params,
      method: "delete",
    });
  }

  // configurations
  GetHolidayTypeList(params: any) {
    return request({
      url: "GetPayCfgInitHolidayTypeList",
      method: "get",
      params: params,
    });
  }

  InsertHolidayType(params: any) {
    return request({
      url: "InsertPayCfgInitHolidayTypeList",
      method: "post",
      data: params,
    });
  }

  GetHolidayType(params: any) {
    return request({
      url: "GetPayCfgInitHolidayType/" + params,
      method: "get",
    });
  }

  UpdateHolidayType(params: any) {
    return request({
      url: "UpdateCfgInitHolidayTypeList",
      method: "put",
      data: params,
    });
  }

  DeleteHolidayType(params: any) {
    return request({
      url: "DeletePayCfgInitHolidayType/" + params,
      method: "delete",
    });
  }
}

export { HolidayCalenderAPI as default };
