import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class PayrollPeriodsAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetPayrollPeriodsList(params: any) {
    return request({
      url: "GetPayPayrollPeriodList",
      method: "get",
      params: params,
    });
  }

  InsertPayrollPeriods(params: any) {
    return request({
      url: "InsertPayPayrollPeriodList",
      method: "post",
      data: params,
    });
  }

  GetPayrollPeriods(params: any) {
    return request({
      url: "GetPayPayrollPeriod/" + params,
      method: "get",
    });
  }

  UpdatePayrollPeriods(params: any) {
    return request({
      url: "UpdatePayrollPeriodList",
      method: "put",
      data: params,
    });
  }

  DeletePayrollPeriods(params: any) {
    return request({
      url: "DeletePayPayrollPeriod/" + params,
      method: "delete",
    });
  }

  // status statistic
  GetPayrollPeriodsStatusStatistic() {
    return request({
      url: "GetPayPayrollPeriodCount",
      method: "get",
    });
  }
}

export { PayrollPeriodsAPI as default };
