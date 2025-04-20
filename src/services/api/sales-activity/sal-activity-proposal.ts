// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { IInsertSalActivityProposal } from "./indext";

const uri = "";
const variableValue = import.meta.env.VITE_APP_URL_API2;

class SalActivityProposalAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  
  GetSalActivityProposalList(id: any, params: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityProposalList/` + id,
      method: "get",
      params : params
    });
  }

  GetSalActivityProposal(id: any) {
    return request({
      baseURL: variableValue,
      url: `GetSalActivityProposal/` + id,
      method: "get",
    });
  }

  InsertSalActivityProposal(data: IInsertSalActivityProposal) {
    return request({
      baseURL: variableValue,
      url: `InsertSalActivityProposal`,
      method: "post",
      data: data
    });
  }
  
  UpdateSalActivityProposal(params: IInsertSalActivityProposal) {
    return request({
      baseURL: variableValue,
      url: `UpdateSalActivityProposal`,
      method: "put",
      data: params
    });
  }

  VoidSalesActivityProposal(params: any) {
    return request({
      baseURL: variableValue,
      url: "VoidSalesActivityProposal/" + params,
      method: "put",
    });
  }
}

export { SalActivityProposalAPI as default };
