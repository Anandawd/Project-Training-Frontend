import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class HotelDashboardAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  roomStatisticCardDashboard() {
    return request({
      url: "/RoomStatisticCardDashboard",
      method: "get",
    });
  }

  roomStatisticDashboard() {
    return request({
      url: "/RoomStatisticDashboard",
      method: "get",
    });
  }

  expectedArrivalDashboard() {
    return request({
      url: "/ExpectedArrivalDashboard",
      method: "get",
    });
  }

  expectedDepartureDashboard() {
    return request({
      url: "/ExpectedDepartureDashboard",
      method: "get",
    });
  }

  occupancyHistoryDashboard(params: any) {
    return request({
      url: "/OccupancyHistoryDashboard",
      method: "get",
      params,
    });
  }
}
