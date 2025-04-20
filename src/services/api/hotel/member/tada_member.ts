import request from "@/utils/axios";

class TADAMemberAPI {
  getTADAMemberDetail(phoneNumber: string) {
    if (!phoneNumber) return;
    let url = "/TADACheckMemberDetail/" + phoneNumber;
    return request({
      url,
      method: "get",
    });
  }

  getTADACardDetail(cardNumber: string) {
    if (!cardNumber) return;
    let url = "/TADACheckCardDetail/" + cardNumber;
    return request({
      url,
      method: "get",
    });
  }

  getTADAVoucherDetail(voucherCode: string) {
    if (!voucherCode) return;
    let url = "/TADACheckVoucherDetail/" + voucherCode;
    return request({
      url,
      method: "get",
    });
  }

  tadaVoucherRedemption(data: any) {
    let url = "/TADAVoucherRedemption";
    return request({
      url,
      method: "post",
      data,
    });
  }
}
export default TADAMemberAPI;
