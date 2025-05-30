import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class LegalDocumentsAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetLegalDocumentsList(params: any) {
    return request({
      url: "GetLegalDocumentsList",
      method: "get",
      params: params,
    });
  }

  InsertLegalDocuments(params: any) {
    return request({
      url: "InsertLegalDocuments",
      method: "post",
      data: params,
    });
  }

  GetLegalDocuments(params: any) {
    return request({
      url: "GetLegalDocuments/" + params,
      method: "get",
    });
  }

  UpdateLegalDocuments(params: any) {
    return request({
      url: "UpdateLegalDocuments",
      method: "put",
      data: params,
    });
  }

  DeleteLegalDocuments(params: any) {
    return request({
      url: "DeleteLegalDocuments/" + params,
      method: "delete",
    });
  }

  // Approve/Reject Salary Adjustment
  ApproveLegalDocuments(params: any) {
    return request({
      url: "ApproveLegalDocuments",
      method: "post",
      data: params,
    });
  }

  RejectLegalDocuments(params: any) {
    return request({
      url: "RejectLegalDocuments",
      method: "post",
      data: params,
    });
  }

  // Get Employee Options for dropdown
  GetEmployeeOptions() {
    return request({
      url: "GetEmployeeOptions",
      method: "get",
    });
  }
}

export { LegalDocumentsAPI as default };
