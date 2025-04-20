import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";
const uri = "";

export default class UserSettingAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getUserGroupAccessList(params: any) {
    return request({
      url: "/GetUserGroupAccessList",
      method: "get",
      params,
    });
  }

  getUserGroupAccess(id: number) {
    if (!id) return;
    return request({
      url: "/GetUserGroupAccess/" + id,
      method: "get",
    });
  }

  getAccessReportList() {
    return request({
      url: "/GetAccessReportList",
      method: "get",
    });
  }

  insertUserGroupAccess(data: any) {
    return request({
      url: "/InsertUserGroupAccess",
      method: "post",
      data,
    });
  }

  updateUserGroupAccess(data: any) {
    return request({
      url: "/UpdateUserGroupAccess",
      method: "put",
      data,
    });
  }

  getUserList(params: any) {
    return request({
      url: "/GetUserList",
      method: "get",
      params,
    });
  }

  getUser(id: any) {
    return request({
      url: "/GetUser/" + id,
      method: "get",
    });
  }

  insertUser(data: any) {
    return request({
      url: "/InsertUser",
      method: "post",
      data,
    });
  }

  updateUser(data: any) {
    return request({
      url: "/UpdateUser",
      method: "put",
      data,
    });
  }

  deleteUser(code: number) {
    if (!code) return;
    return request({
      url: "/DeleteUser/" + code,
      method: "delete",
    });
  }

  deleteUserGroupAccess(id: number) {
    if (!id) return;
    return request({
      url: "/DeleteUserGroupAccess/" + id,
      method: "delete",
    });
  }

  activateDeactivateUser(data: any) {
    return request({
      url: "/ActivateDeactivateUser",
      method: "patch",
      data,
    });
  }

  getUserAccessLevelList() {
    return request({
      url: "/GetUserAccessLevelList",
      method: "get",
    });
  }

  getUserInventorySubDepartmentAccessList(userCode: string) {
    return request({
      url: `/GetUserInventorySubDepartmentAccessList/${userCode}`,
      method: "get",
    });
  }

  getUserInventorySubDepartmentAccess(id: number) {
    return request({
      url: `/GetUserInventorySubDepartmentAccess/${id}`,
      method: "get",
    });
  }

  insertUserInventorySubDepartment(data: any) {
    return request({
      url: "/InsertUserInventorySubDepartment",
      method: "post",
      data,
    });
  }

  updateUserInventorySubDepartment(data: any) {
    return request({
      url: "/UpdateUserInventorySubDepartment",
      method: "put",
      data,
    });
  }

  deleteUserInventorySubDepartment(id: number) {
    return request({
      url: `/DeleteUserInventorySubDepartment/${id}`,
      method: "delete",
    });
  }
}
