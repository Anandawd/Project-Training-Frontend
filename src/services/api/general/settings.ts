import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class SettingsAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getHotelInformationList() {
    return request({
      url: "/GetHotelInformationList",
      method: "get",
    });
  }

  getHotelInformation() {
    return request({
      url: "/GetHotelInformation",
      method: "get",
    });
  }

  updateHotelInformation(data: any) {
    return request({
      url: "/UpdateHotelInformation",
      method: "put",
      data,
    });
  }

  updateConfiguration(data: any) {
    return request({
      url: "/UpdateSetting",
      method: "put",
      data,
    });
  }

  getReportFileList(params: any) {
    return request({
      url: "/GetReportFileList",
      method: "get",
      params,
    });
  }

  getConfigurationsAll() {
    return request({
      url: "/GetConfigurationAll",
      method: "get",
    });
  }
}
