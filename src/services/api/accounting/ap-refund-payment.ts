// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class APRefundPaymentAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  list(query: any) {
    return request({
      url: "GetAPRefundDepositComboList?SubFolioIdList=" + this.uri,
      method: "get",
      params: query,
    });
  }
  get(id: string) {
    return request({
      url: "GetAPRefundDepositComboList/" + id,
      method: "get",
    });
  }
  update(resource: any) {
    return request({
      url: "GetAPRefundDepositComboList/" + this.uri,
      method: "put",
      data: resource,
    });
  }
  create(resource: any) {
    return request({
      url: "InsertAPRefundDepositPayment",
      method: "post",
      data: resource,
    });
  }
  edit(id: string) {
    return request({
      url: "GetAPRefundDepositDataList?Index=0" + id,
      method: "get",
    });
  }
  delete(id: any) {
    return request({
      url: "GetAPRefundDepositComboList/" + this.uri + "/" + id,
      method: "delete",
    });
  }
  codeNameList(codeName: string) {
    return request({
      url: "GetMasterDataCodeName/" + codeName,
      method: "get",
    });
  }

  getAPRefundDepositComboList(params: any) {
    return request({
      url: `GetAPRefundDepositComboList`,
      method: "get",
      params,
    });
  }

  detailDataList(name: string, id: string) {
    return request({
      url: `GetAPRefundDepositComboList?SubFolioIdList=["1"]&ModeEditor=0&RefNumber${name}/${id}`,
      method: "get",
    });
  }
}

export { APRefundPaymentAPI as default };
