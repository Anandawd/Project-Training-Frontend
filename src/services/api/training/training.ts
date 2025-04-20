import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class TrainingAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetLostAndFoundList(query: any) {
    return request({
      url: "GetLostAndFoundList",
      method: "get",
      params: query,
    });
  }
  InsertLostAndFound(params: any) {
    return request({
      url: "InsertLostAndFound",
      method: "post",
      data: params,
    });
  }
  GetLostAndFound(params: any) {
    return request({
      url: "GetLostAndFound/" + params,
      method: "get",
    });
  }
  UpdateLostAndFound(params: any) {
    return request({
      url: "UpdateLostAndFound",
      method: "put",
      data: params,
    });
  }
  DeleteLostAndFound(params: any) {
    return request({
      url: "DeleteLostAndFound/" + params,
      method: "delete",
    });
  }
}

export { TrainingAPI as default };
