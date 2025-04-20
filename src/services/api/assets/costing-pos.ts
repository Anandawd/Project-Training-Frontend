import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
const uri = "";

class CostingPOSApi extends configurationResource {
  constructor() {
    super(uri);
  }

  LoadSalesData(query: any) {
    return request({
      url: "LoadSalesData",
      method: "get",
      params: query,
    });
  }

  GetProductCostingDetail(query: any) {
    return request({
      url: "GetProductCostingDetail",
      method: "get",
      params: query,
    });
  }

  ProcessProductCosting(resource: any) {
    return request({
      url: "ProcessProductCosting",
      method: "post",
      data: resource,
    });
  }

  DeleteProductCosting(resource: any) {
    return request({
      url: "DeleteProductCosting",
      method: "post",
      data: resource,
    });
  }
}

export { CostingPOSApi as default };
