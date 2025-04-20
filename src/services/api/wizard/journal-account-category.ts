import request from "@/utils/axios";
const group = "wizard/";
class WizardJournalAccountCategoryAPI {
  getList() {
    return request({
      url: `${group}GetJournalAccountCategoryList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetJournalAccountCategory/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertJournalAccountCategory`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateJournalAccountCategory`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteJournalAccountCategory/${code}`,
      method: "delete",
    });
  }
}
export default WizardJournalAccountCategoryAPI;
