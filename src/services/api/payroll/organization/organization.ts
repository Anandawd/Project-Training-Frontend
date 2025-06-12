import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class OrganizationAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  // Position Methods
  GetPositionList(params: any) {
    return request({
      url: "GetPayCfgInitPositionList",
      method: "get",
      params: params,
    });
  }

  InsertPosition(params: any) {
    return request({
      url: "InsertPayCfgInitPositionList",
      method: "post",
      data: params,
    });
  }

  GetPosition(params: any) {
    return request({
      url: "GetPayCfgInitPosition/" + params,
      method: "get",
    });
  }

  UpdatePosition(params: any) {
    return request({
      url: "UpdateCfgInitPositionList",
      method: "put",
      data: params,
    });
  }

  DeletePosition(params: any) {
    return request({
      url: "DeletePayCfgInitPosition/" + params,
      method: "delete",
    });
  }

  GetPositionActiveList(params: any) {
    return request({
      url: "GetPositionActiveList",
      method: "get",
      params: params,
    });
  }

  // Department Methods
  GetDepartmentList(params: any) {
    return request({
      url: "GetPayCfgInitDepartmentList",
      method: "get",
      params: params,
    });
  }

  InsertDepartment(params: any) {
    return request({
      url: "InsertPayCfgInitDepartmentList",
      method: "post",
      data: params,
    });
  }

  GetDepartment(params: any) {
    return request({
      url: "GetPayCfgInitDepartment/" + params,
      method: "get",
    });
  }

  UpdateDepartment(params: any) {
    return request({
      url: "UpdateCfgInitDepartmentList",
      method: "put",
      data: params,
    });
  }

  DeleteDepartment(params: any) {
    return request({
      url: "DeletePayCfgInitDepartment/" + params,
      method: "delete",
    });
  }

  GetDepartmentActiveList(params: any) {
    return request({
      url: "GetDepartmentActiveList",
      method: "get",
      params: params,
    });
  }

  // Placement Methods
  GetPlacementList(params: any) {
    return request({
      url: "GetPayCfgInitPlacementList",
      method: "get",
      params: params,
    });
  }

  InsertPlacement(params: any) {
    return request({
      url: "InsertPayCfgInitPlacementList",
      method: "post",
      data: params,
    });
  }

  GetPlacement(params: any) {
    return request({
      url: "GetPayCfgInitPlacement/" + params,
      method: "get",
    });
  }

  UpdatePlacement(params: any) {
    return request({
      url: "UpdateCfgInitPlacementList",
      method: "put",
      data: params,
    });
  }

  DeletePlacement(params: any) {
    return request({
      url: "DeletePayCfgInitPlacement/" + params,
      method: "delete",
    });
  }

  GetPlacementActiveList(params: any) {
    return request({
      url: "GetPlacementActiveList",
      method: "get",
      params: params,
    });
  }

  // options
  GetSupervisorByDepartment(params: any) {
    return request({
      url: "GetSupervisorDepartmentListP/" + params,
      method: "get",
    });
  }

  GetCountryOptions() {
    return request({
      url: "GetCountryOptions",
      method: "get",
    });
  }

  GetCityOptions(countryCode: string) {
    return request({
      url: "GetCityOptions",
      method: "get",
      params: { countryCode },
    });
  }
}

export { OrganizationAPI as default };

