import request from "@/utils/axios";
const group = "wizard/";
class WizardRoomAPI {
  getList() {
    return request({
      url: `${group}GetRoomList`,
      method: "get",
    });
  }

  edit(id: string) {
    return request({
      url: `${group}GetRoom/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertRoom`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateRoom`,
      method: "put",
      data: params,
    });
  }

  delete(id: string) {
    return request({
      url: `${group}DeleteRoom/${id}`,
      method: "delete",
    });
  }

  getComboList() {
    return request({
      url: `${group}GetRoomComboList`,
      method: "get",
    });
  }
}
export default WizardRoomAPI;
