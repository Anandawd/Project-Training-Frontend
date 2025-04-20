import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class CashierReportAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getCashRemittance() {
    return request({
      url: "GetCashRemittance",
      method: "get",
    });
  }

  closeShift() {
    return request({
      url: "CloseShift",
      method: "post",
    });
  }
}

export default CashierReportAPI;
