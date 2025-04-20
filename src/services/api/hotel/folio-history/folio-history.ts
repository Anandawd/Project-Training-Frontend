import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class FolioHistoryAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getFolioHistoryList(params: any) {
    return request({
      url: `GetFolioHistoryList`,
      method: "get",
      params,
    });
  }

  getFolioHistoryDetailList(params: any) {
    return request({
      url: `GetFolioHistoryDetailList`,
      method: "get",
      params,
    });
  }

  cancelCheckOut(params: any) {
    return request({
      url: `CancelCheckOut`,
      method: "post",
      data: params,
    });
  }
}
export default FolioHistoryAPI;
