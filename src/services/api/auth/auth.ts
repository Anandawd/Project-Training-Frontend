import request from "@/utils/axios";
import { ICredential } from "./interfaces";

class AuthAPI {
  async login(userID: any, password: any, shift: string) {
    const params = {
      Code: userID,
      Password: password,
      Shift: shift,
    };
    return request({
      url: "/Login",
      method: "post",
      data: params,
    });
  }

  async getSubscriptionModule() {
    return request({
      url: "/GetSubscriptionModule",
      method: "get",
    });
  }

  async getWorkingShift() {
    return request({
      url: "/GetWorkingShift",
      method: "get",
    });
  }

  async isFirstLogin() {
    return request({
      url: "/IsFirstLogin",
      method: "get",
    });
  }

  async getShiftInformation(userID: string) {
    return request({
      url: "/GetShiftInformation/" + userID,
      method: "get",
    });
  }

  async setOpeningBalance(params: any) {
    return request({
      url: "/SetOpeningBalance",
      method: "put",
      data: params,
    });
  }

  async getUserFormAccess() {
    return request({
      url: "/GetUserFormAccess",
      method: "get",
    });
  }

  getRefreshToken() {
    return request({
      url: "/GetRefreshToken",
      method: "get",
    });
  }

  verifyAccess(params: ICredential) {
    return request({
      url: "/CanUserAccess",
      method: "post",
      data: params,
    });
  }

  changeUserPassword(params: any) {
    return request({
      url: "/ChangeUserPassword",
      method: "patch",
      data: params,
    });
  }

  changeUnitProperty(unitCode: any) {
    return request({
      url: `/ChangeUnitCode/${unitCode}`,
      method: "put",
    });
  }
}

export default AuthAPI;
