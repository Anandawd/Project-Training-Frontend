import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class BankTransaction extends configurationResource {
  constructor() {
    super(uri);
  }
  list(query: any) {
    return request({
      url: "GetAPRefundDepositDataList",
      method: "get",
      params: query,
    });
  }
  get(id: string) {
    return request({
      url: "GetAPRefundDepositDataList/" + id,
      method: "get",
    });
  }
  update(resource: any) {
    return request({
      url: "GetAPRefundDepositDataList/",
      method: "put",
      data: resource,
    });
  }
  create(resource: any) {
    return request({
      url: "GetAPRefundDepositDataList/",
      method: "post",
      data: resource,
    });
  }
  edit(id: string) {
    return request({
      url: "GetAPRefundDepositDataList/" + id,
      method: "get",
    });
  }
  delete(id: any) {
    return request({
      url: "GetAPRefundDepositDataList/" + id,
      method: "delete",
    });
  }
}

export { BankTransaction as default };
