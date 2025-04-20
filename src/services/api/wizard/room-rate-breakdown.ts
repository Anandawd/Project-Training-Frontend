import request from "@/utils/axios";
const group = "wizard/";
class WizardRoomRateBreakdownAPI {
  getList(roomRateCode: string) {
    return request({
      url: `${group}GetRoomRateBreakdownList/${roomRateCode}`,
      method: "get",
    });
  }

  edit(id: number) {
    return request({
      url: `${group}GetRoomRateBreakdown/` + id,
      method: "get",
    });
  }

  getComboList() {
    return request({
      url: `${group}GetRoomRateBreakdownComboList`,
      method: "get",
    });
  }

  getAccountBySubDepartment(subDepartmentCode: string) {
    return request({
      url: `${group}GetAccountBySubDepartment/${subDepartmentCode}`,
      method: "get",
    });
  }

  insert(params: any) {
    return request({
      url: `${group}InsertRoomRateBreakdown`,
      method: "post",
      data: params,
    });
  }

  update(params: any) {
    return request({
      url: `${group}UpdateRoomRateBreakdown`,
      method: "put",
      data: params,
    });
  }

  delete(id: number) {
    return request({
      url: `${group}DeleteRoomRateBreakdown/${id}`,
      method: "delete",
    });
  }
}
export default WizardRoomRateBreakdownAPI;
