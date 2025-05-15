import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class ARCityledgerInvoice extends configurationResource {
  constructor() {
    super(uri);
  }

  GetARCityLedgerInvoiceList(query: any) {
    return request({
      url: "GetARCityLedgerInvoiceList",
      method: "get",
      params: query,
    });
  }

  GetARCityLedgerInvoice(params: any) {
    return request({
      url: "GetARCityLedgerInvoice/" + params,
      method: "get",
    });
  }

  GetARCityLedgerInvoiceDetailList(params: any) {
    return request({
      url: "GetARCityLedgerInvoiceDetailList/"+params,
      method: "get",
    });
  }

  GetPaymentByAPARList(query: any){
    return request({
      url: "GetPaymentByAPARList",
      method: "get",
      params: query
    });
  }

  InsertARCityLedgerInvoice(resource: any) {
    return request({
      url: "InsertARCityLedgerInvoice",
      method: "post",
      data: resource,
    });
  }

  InsertARCityLedgerPayment(resource: any) {
    return request({
      url: "InsertARCityLedgerPayment",
      method: "post",
      data: resource,
    });
  }

  UpdateARCityLedgerInvoice(resource: any) {
    return request({
      url: "UpdateARCityLedgerInvoice",
      method: "put",
      data: resource,
    });
  }

  DeleteARCityLedgerInvoice(params: any) {
    return request({
      url: "DeleteARCityLedgerInvoice/" + params,
      method: "delete",
    });
  }

  GetPrintInvoiceCount(invoiceNumber: string) {
    if (!invoiceNumber) return;
    return request({
      url: `GetPrintInvoiceCount/${invoiceNumber}`,
      method: "get",
    });
  }

  IncreasePrintInvoiceCount(invoiceNumber: string) {
    if (!invoiceNumber) return;
    return request({
      url: `IncreasePrintInvoiceCount/${invoiceNumber}`,
      method: "put",
    });
  }

  GetARCityLedgerPaymentComboList(params: any) {
    return request({
      url: "GetARCityLedgerPaymentComboList",
      method: "get",
    });
  }

  DeleteARCityLedgerInvoicePayment(params: any) {
    return request({
      url: "DeleteARCityLedgerInvoicePayment/" + params,
      method: "delete",
    });
  }
}
export { ARCityledgerInvoice as default };
