import request from "@/utils/axios";
const group = "wizard/";
class WizardTaxAndServiceAPI {
  getList() {
    return request({
      url: `${group}GetTaxAndServiceList`,
      method: "get",
    });
  }

  edit() {
    return request({
      url: `${group}GetTaxAndService`,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertTaxAndService`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateTaxAndService`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteTaxAndService/${code}`,
      method: "delete",
    });
  }
}
export default WizardTaxAndServiceAPI;
