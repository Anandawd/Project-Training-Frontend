import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class breakfastControlAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  GetBreakfastControlList(params: any) {
    return request({
      url: `GetBreakfastControlList`,
      method: "get",
      params,
    });
  }
  get(id: string) {
    return request({
      url: "GetBreakfastControlList/" + id,
      method: "get",
    });
  }
  InsertBreakfastControl(resource: any) {
    return request({
      url: "InsertBreakfastControl",
      method: "put",
      data: resource,
    });
  }
  create(resource: any) {
    return request({
      url: "GetBreakfastControlList/",
      method: "post",
      data: resource,
    });
  }
  edit(id: string) {
    return request({
      url: "GetBreakfastControlList" + id,
      method: "get",
    });
  }
  delete(id: any) {
    return request({
      url: "GetBreakfastControlList/" + id,
      method: "delete",
    });
  }
  //   codeNameList(codeName: string) {
  //     return request({
  //       url: "GetMasterDataCodeName/" + codeName,
  //       method: "get",
  //     });
  //   }
  //   getAPRefundDepositComboList(params: any) {
  //     return request({
  //       url: `GetAPRefundDepositComboList`,
  //       method: "get",
  //       params
  //     });
  //   }
  //   detailDataList(name: string, code: string) {
  //     return request({
  //       url: `GetDetailDataList/${name}/${code}`,
  //       method: "get",
  //     });
  //   }
  // getApRefund(params: IApRefund) {
  //   return request({
  //     url: "/GetApRefund",
  //     method: "post",
  //     data: params,
  //   });
  // }
  //   apRefundListArray(query: Array<string>) {
  //     const params = {
  //       DataNameList: query
  //     }
  //     return request({
  //       url: `GetAPRefundDepositComboList?SubFolioIdList=${JSON.stringify(query)}`,
  //       method: "get",
  //     });
  //   }
}

export { breakfastControlAPI as default };
