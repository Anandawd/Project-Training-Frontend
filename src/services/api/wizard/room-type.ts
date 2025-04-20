import request from "@/utils/axios";
const group = "wizard/";
class WizardRoomTypeAPI {
  getList() {
    return request({
      url: `${group}GetRoomTypeList`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetRoomType/` + id,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertRoomType`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateRoomType`,
      method: "put",
      data: params,
    });
  }

  delete(code: string) {
    return request({
      url: `${group}DeleteRoomType/${code}`,
      method: "delete",
    });
  }
}
export default WizardRoomTypeAPI;
