import request from "@/utils/axios";
const group = "wizard/";
class WizardRoomViewAPI {
  getList() {
    return request({
      url: `${group}GetRoomViewList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetRoomView/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertRoomView`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateRoomView`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteRoomView/${code}`,
      method: "delete",
    });
  }
}
export default WizardRoomViewAPI;
