import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";

const uri = "";

class MasterDeskFolioAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getMasterDeskFolioList(query: any, type: string) {
    return request({
      url: "GetMasterDeskFolioList/" + type,
      method: "get",
      params: query,
    });
  }

  insertMasterDeskFolio(params: any) {
    return request({
      url: "InsertMasterDeskFolio",
      method: "post",
      data: params,
    });
  }

  updateMasterDeskFolio(params: any) {
    return request({
      url: "UpdateMasterDeskFolio",
      method: "put",
      data: params,
    });
  }

  getMasterDeskFolio(folioNumber: number) {
    return request({
      url: "GetMasterDeskFolio/" + folioNumber,
      method: "get",
    });
  }
}

export default MasterDeskFolioAPI;
