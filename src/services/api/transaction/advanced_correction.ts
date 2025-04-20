import request from "@/utils/axios";

class AdvancedCorrectionAPI {
  getAdvancedCorrection(breakdown1: number) {
    return request({
      url: "/GetAdvancedCorrection/" + breakdown1,
      method: "get",
    });
  }

  processAdvancedCorrection(data: any) {
    return request({
      url: "/ProcessAdvancedCorrection",
      method: "post",
      data,
    });
  }
}

export default AdvancedCorrectionAPI;
