import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalesActivityDashboardAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalesActivityDashboardList(params: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalesActivityDashboardList`,
      method: "get",
      params
    });
  }
}

export { SalesActivityDashboardAPI as default };
