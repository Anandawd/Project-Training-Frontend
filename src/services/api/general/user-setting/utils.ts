import Resource from "../../../resource";
import request from "@/utils/axios";

const tableName = "reservation";
const uri = "reservation";

class UserAccess extends Resource {
  constructor() {
    super(uri);
  }

  getSpecialUserAccess(userID: string, password: string, userAccess: string) {
    const params = {
      UserID: "SYSTEM",
      Password: "123456",
      UserAccessTypeCode: "F",
      AccessMode: 1,
      IsPasswordEncrypted: false,
    };
    return request({
      url: "/CanUserAccess",
      method: "post",
      data: params,
    });
  }

  log(id: string) {
    return request({
      url: "/tracking/log/" + tableName + "/" + id,
      method: "get",
    });
  }
}

export { UserAccess as default };
