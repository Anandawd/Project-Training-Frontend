import request from "@/utils/axios";
const group = "wizard/";
class WizardJournalAccountSubGroupAPI {
  getList() {
    return request({
      url: `${group}GetJournalAccountSubGroupList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetJournalAccountSubGroup/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertJournalAccountSubGroup`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateJournalAccountSubGroup`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteJournalAccountSubGroup/${code}`,
      method: "delete",
    });
  }
}
export default WizardJournalAccountSubGroupAPI;
