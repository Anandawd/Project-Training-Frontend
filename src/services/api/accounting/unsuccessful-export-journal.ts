// import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class JournalNotBalanceAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getUnsuccessfulExportJournalExecute(params: any) {
    return request({
      url: `GetUnsuccessfulExportJournalExecute`,
      method: "get",
      params,
    });
  }
}

export { JournalNotBalanceAPI as default };
