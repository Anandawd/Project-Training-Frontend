import request from "@/utils/axios";
const group = "wizard/";
class WizardJournalAccountAPI {
  getList() {
    return request({
      url: `${group}GetJournalAccountList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetJournalAccount/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertJournalAccount`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateJournalAccount`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteJournalAccount/${code}`,
      method: "delete",
    });
  }
}
export default WizardJournalAccountAPI;
