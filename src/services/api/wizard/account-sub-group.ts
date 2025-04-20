import request from "@/utils/axios";
const group = "wizard/";
class WizardAccountSubGroupAPI {
  getList() {
    return request({
      url: `${group}GetAccountSubGroupList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetAccountSubGroup/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertAccountSubGroup`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateAccountSubGroup`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteAccountSubGroup/${code}`,
      method: "delete",
    });
  }
}
export default WizardAccountSubGroupAPI;
