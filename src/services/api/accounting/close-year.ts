// import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import {
  PProcessCloseYear,
} from "./indext";

const uri = "";

class CloseYearAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getCloseYearStatus(params: any) {
    return request({
      url: `GetCloseYearStatus/` + params,
      method: "get",
    });
  }

  getCloseYearBalanceSheet(year: any) {
    return request({
      url: `GetCloseYearBalanceSheet/` + year,
      method: "get",
    });
  }

  getCloseYearList() {
    return request({
      url: `GetCloseYearList`,
      method: "get",
    });
  }

  processCloseYear(params: PProcessCloseYear) {
    return request({
      url: `ProcessCloseYear`,
      method: "post",
      data: params
    });
  }


}

export { CloseYearAPI as default };
