import request from "../../../utils/axios";

class ReportAPI {
  processReportTemplate() {}

  generateReport(query: any) {
    return request({
      url: "GenerateReport",
      method: "get",
      params: query,
    });
  }

  getPrintFolioOption(folioNumber: number) {
    return request({
      url: "GetPrintFolioOption/" + folioNumber,
      method: "get",
    });
  }
}

export default ReportAPI;
