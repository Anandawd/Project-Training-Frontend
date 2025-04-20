import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { AxiosPromise } from "axios";

const uri = "";

class ARCityledger extends configurationResource {
  constructor() {
    super(uri);
  }
  GetARCityLedgerList(query: any) {
    return request({
      url: "GetARCityLedgerList",
      method: "get",
      params: query,
    });
  }
  get(id: any) {
    return request({
      url: "GetARCityLedgerList/" + id,
      method: "get",
    });
  }
  InsertARCityLedgerInvoice(resource: any) {
    return request({
      url: "InsertARCityLedgerInvoice",
      method: "post",
      data: resource,
    });
  }

  UpdateARCityLedgerDirectBill(resource: any) {
    return request({
      url: "UpdateARCityLedgerDirectBill",
      method: "put",
      data: resource,
    });
  }

  codeNameListArray(query: Array<string>) {
    return request({
      // stringify >> mengubah string ke JSON
      url: `GetMasterDataCodeNameArray?DataNameList=${JSON.stringify(query)}`,
      method: "get",
    });
  }

  GetCompanyDetailList() {
    return request({
      url: `GetCompanyDetailList`,
      method: "get",
    });
  }

  StateByCountry(query: string) {
    return request({
      url: "GetStateByCountry/" + query,
      method: "get",
    });
  }

  CityByState(query: string) {
    return request({
      url: "GetCityByState/" + query,
      method: "get",
    });
  }
}

export { ARCityledger as default };
