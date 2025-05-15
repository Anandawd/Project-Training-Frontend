import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";

class JournalAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetJournalList(params: any) {
    return request({
      url: `GetJournalList`,
      method: "get",
      params,
    });
  }
  GetJournal(params: any) {
    return request({
      url: `GetJournal/` + params,
      method: "get",
    });
  }
  GetJournalComboList(params: any) {
    return request({
      url: `GetJournalComboList`,
      method: "get",
      data: params,
    });
  }
  GetJournalUserList(params: any) {
    return request({
      url: `GetJournalUserList`,
      method: "get",
      data: params,
    });
  }
  GetGLAccountList(params: any) {
    return request({
      url: `GetGLAccountList`,
      method: "get",
      params,
    });
  }
  GetJournalAccountBalance(params: any) {
    return request({
      url: `GetJournalAccountBalance`,
      method: "get",
      params,
    });
  }
  InsertJournal(params: any) {
    return request({
      url: `InsertJournal`,
      method: "post",
      data: params,
    });
  }
  UpdateJournal(params: any) {
    return request({
      url: `UpdateJournal`,
      method: "put",
      data: params,
    });
  }
  DeleteJournal(params: any) {
    return request({
      url: `DeleteJournal/` + params,
      method: "delete",
    });
  }
  GetSortJournal(params: any) {
    return request({
      url: `GetSortJournal`,
      method: "get",
      params,
    });
  }

  UpdateSortJournal(params: any) {
    return request({
      url: `UpdateSortJournal`,
      method: "put",
      data: params,
    });
  }

  GetImportJournalStatus(params: any) {
    return request({
      url: `GetImportJournalStatus`,
      method: "get",
      params,
    });
  }

  importJournalTransaction(params: any) {
    return request({
      url: `ImportJournalTransaction`,
      method: "post",
      data: params,
    });
  }

  cancelImportJournalTransaction(params: any) {
    return request({
      url: `CancelImportJournalTransaction`,
      method: "post",
      data: params,
    });
  }
}

export default JournalAPI;
