import request from "@/utils/axios";
const group = "wizard/";
class WizardRoomRateAPI {
  getList() {
    return request({
      url: `${group}GetRoomRateList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetRoomRate/` + id,
      method: "get",
    });
  }

  getComboList() {
    return request({
      url: `${group}GetRoomRateComboList`,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertRoomRate`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateRoomRate`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteRoomRate/${code}`,
      method: "delete",
    });
  }
}
export default WizardRoomRateAPI;
