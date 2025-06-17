import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class LegalDocumentsAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetLegalDocumentsList(params: any) {
    return request({
      url: "GetPayEmployeeDocumentList",
      method: "get",
      params: params,
    });
  }

  InsertLegalDocument(params: any) {
    return request({
      url: "InsertPayEmployeeDocumentList",
      method: "post",
      data: params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  GetLegalDocument(params: any) {
    return request({
      url: "GetPayEmployeeDocument/" + params,
      method: "get",
    });
  }

  UpdateLegalDocument(params: any) {
    return request({
      url: "UpdateEmployeeDocumentList",
      method: "put",
      data: params,
    });
  }

  DeleteLegalDocument(params: any) {
    return request({
      url: "DeletePayEmployeeDocument/" + params,
      method: "delete",
    });
  }

  // document type
  GetDocumentTypeList(params: any) {
    return request({
      url: "GetPayCfgInitDocumentTypeList",
      method: "get",
      params: params,
    });
  }

  InsertDocumentType(params: any) {
    return request({
      url: "InsertPayCfgInitDocumentTypeList",
      method: "post",
      data: params,
    });
  }

  GetDocumentType(params: any) {
    return request({
      url: "GetPayCfgInitDocumentType/" + params,
      method: "get",
    });
  }

  UpdateDocumentType(params: any) {
    return request({
      url: "UpdateCfgInitDocumentTypeList",
      method: "put",
      data: params,
    });
  }

  DeleteDocumentType(params: any) {
    return request({
      url: "DeletePayCfgInitDocumentType/" + params,
      method: "delete",
    });
  }
}

export { LegalDocumentsAPI as default };
