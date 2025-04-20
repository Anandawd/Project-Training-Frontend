import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class LostAndFoundAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetLostAndFoundList(params: any) {
    return request({
      url: `GetLostAndFoundList`,
      method: "get",
      params,
    });
  }
  InsertLostAndFound(params: any) {
    return request({
      url: `InsertLostAndFound`,
      method: "post",
      data: params,
    });
  }
  GetLostAndFound(params: any) {
    return request({
      url: `GetLostAndFound/` + params,
      method: "get",
    });
  }
  UpdateLostAndFound(params: any) {
    return request({
      url: `UpdateLostAndFound`,
      method: "put",
      data: params,
    });
  }
  DeleteLostAndFound(params: any) {
    return request({
      url: `DeleteLostAndFound/` + params,
      method: "delete",
    });
  }
  LostAndFoundActive(id: any, params: any) {
    return request({
      url: `LostAndFoundActive/` + id,
      method: "put",
      params,
    });
  }
}
export { LostAndFoundAPI as default };
