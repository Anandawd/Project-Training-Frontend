import request from "@/utils/axios";
const group = "wizard/";
class WizardBedTypeAPI {
  getList() {
    return request({
      url: `${group}GetBedTypeList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetBedType/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertBedType`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateBedType`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteBedType/${code}`,
      method: "delete",
    });
  }
}
export default WizardBedTypeAPI;
