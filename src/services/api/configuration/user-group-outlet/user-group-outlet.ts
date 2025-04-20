import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
import { IInsertUserGroupOutlet } from "./interface/indext";

const uri = "";

class UserGroupOutlet extends configurationResource {
  constructor() {
    super(uri);
  }
  GetUserGroupOutletList(params: any) {
    return request({
      url: `GetUserGroupOutletList`,
      method: "get",
      params,
    });
  }

  InsertUserGroupOutlet(params: IInsertUserGroupOutlet) {
    return request({
      url: "InsertUserGroupOutlet",
      method: "post",
      data: params,
    });
  }

  GetUserGroupOutlet(code: string) {
    return request({
      url: `GetUserGroupOutlet/` + code,
      method: "get",
    });
  }

  UpdateUserGroupOutlet(params: IInsertUserGroupOutlet) {
    return request({
      url: `UpdateUserGroupOutlet`,
      method: "put",
      data: params,
    });
  }

  DeleteUserGroupOutlet(code: any) {
    return request({
      url: "DeleteUserGroupOutlet/" + code,
      method: "delete",
    });
  }

  codeNameListArray(query: Array<string>) {
    const params = {
      DataNameList: query,
    };
    return request({
      url: `GetMasterDataCodeNameArray?DataNameList=${JSON.stringify(query)}`,
      method: "get",
    });
  }
}
export { UserGroupOutlet as default };
