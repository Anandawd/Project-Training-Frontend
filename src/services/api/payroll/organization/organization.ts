import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class OrganizationAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  // Position Methods
  GetPositionList(params: any) {
    return request({
      url: "GetPositionList",
      method: "get",
      params: params,
    });
  }

  InsertPosition(params: any) {
    return request({
      url: "InsertPosition",
      method: "post",
      data: params,
    });
  }

  GetPosition(params: any) {
    return request({
      url: "GetPosition/" + params,
      method: "get",
    });
  }

  UpdatePosition(params: any) {
    return request({
      url: "UpdatePosition",
      method: "put",
      data: params,
    });
  }

  DeletePosition(params: any) {
    return request({
      url: "DeletePosition/" + params,
      method: "delete",
    });
  }

  // Department Methods
  GetDepartmentList(params: any) {
    return request({
      url: "GetDepartmentList",
      method: "get",
      params: params,
    });
  }

  InsertDepartment(params: any) {
    return request({
      url: "InsertDepartment",
      method: "post",
      data: params,
    });
  }

  GetDepartment(params: any) {
    return request({
      url: "GetDepartment/" + params,
      method: "get",
    });
  }

  UpdateDepartment(params: any) {
    return request({
      url: "UpdateDepartment",
      method: "put",
      data: params,
    });
  }

  DeleteDepartment(params: any) {
    return request({
      url: "DeleteDepartment/" + params,
      method: "delete",
    });
  }

  // Placement Methods
  GetPlacementList(params: any) {
    return request({
      url: "GetPlacementList",
      method: "get",
      params: params,
    });
  }

  InsertPlacement(params: any) {
    return request({
      url: "InsertPlacement",
      method: "post",
      data: params,
    });
  }

  GetPlacement(params: any) {
    return request({
      url: "GetPlacement/" + params,
      method: "get",
    });
  }

  UpdatePlacement(params: any) {
    return request({
      url: "UpdatePlacement",
      method: "put",
      data: params,
    });
  }

  DeletePlacement(params: any) {
    return request({
      url: "DeletePlacement/" + params,
      method: "delete",
    });
  }

  // Options List Methods
  GetPositionLevelOptions() {
    return request({
      url: "GetPositionLevelOptions",
      method: "get",
    });
  }

  GetDepartmentOptions() {
    return request({
      url: "GetDepartmentOptions",
      method: "get",
    });
  }

  GetManagerOptions() {
    return request({
      url: "GetManagerOptions",
      method: "get",
    });
  }

  GetSupervisorOptions() {
    return request({
      url: "GetSupervisorOptions",
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
