import request from "@/utils/axios";
const group = "wizard/";
class WizardAccountAPI {
  getList() {
    return request({
      url: `${group}GetAccountList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetAccount/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertAccount`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateAccount`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteAccount/${code}`,
      method: "delete",
    });
  }
}
export default WizardAccountAPI;
