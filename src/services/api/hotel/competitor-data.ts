import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";

class CompetitorDataAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getCompetitorDataList(params: any) {
    return request({
      url: "/GetCompetitorDataList",
      method: "get",
      params,
    });
  }

  getCompetitorData(id: number) {
    return request({
      url: "/GetCompetitorData/" + id,
      method: "get",
    });
  }

  insertCompetitorData(data: any) {
    return request({
      url: "/InsertCompetitorData",
      method: "post",
      data,
    });
  }

  updateCompetitorData(data: any) {
    return request({
      url: "/UpdateCompetitorData",
      method: "put",
      data,
    });
  }

  deleteCompetitorData(id: number) {
    return request({
      url: "/DeleteCompetitorData/" + id,
      method: "delete",
    });
  }

  getCompetitorDataComboList(codeName: string) {
    return request({
      url: "GetMasterDataCodeName/" + codeName,
      method: "get",
    });
  }
}

export default CompetitorDataAPI;
