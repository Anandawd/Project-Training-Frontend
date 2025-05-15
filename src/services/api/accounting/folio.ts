import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { AxiosPromise } from "axios";

const uri = "";

class ARCityLedgerFolioList extends configurationResource {
  constructor() {
    // ?
    super(uri);
  }

  list(query: any) {
    return request({
      url: "GetARCityLedgerFolioList",
      method: "get",
      params: query,
    });
  }

  get(id: string) {
    return request({
      url: "GetARCityLedgerFolioList/" + id,
      method: "get",
    });
  }

  // ?
  update(resource: any) {
    return request({
      url: "GetARCityLedgerFolioList",
      method: "put",
      data: resource,
    });
  }

  create(resource: any) {
    return request({
      url: "GetARCityLedgerFolioList",
      method: "post",
      data: resource,
    });
  }

  edit(id: any) {
    return request({
      url: "GetARCityLedgerFolioList/" + id,
      method: "get",
    });
  }

  delete(id: any) {
    return request({
      url: "GetARCityLedgerFolioList/" + id,
      method: "delete",
    });
  }

  ARCityLedgerFolioList(DirectBillCode: any, InvoiceNumber: any) {
    return request({
      url: `GetARCityLedgerFolioList?DirectBillCode=${DirectBillCode}&InvoiceNumber=${InvoiceNumber}`,
      method: "get",
    });
  }
}

// ?
export { ARCityLedgerFolioList as default };
