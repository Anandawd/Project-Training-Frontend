import { __param } from "tslib";
import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class FloorPlanApi extends configurationResource {
  constructor() {
    super(uri);
  }

  GetFloorPlanList() {
    return request({
      url: "GetFloorPlanList",
      method: "get",
    });
  }

  UpdateFloorPlan(resource: any) {
    return request({
      url: "UpdateFloorPlan",
      method: "put",
      data: resource,
    });
  }
}

export { FloorPlanApi as default };
