import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class KeylockAPI extends configurationResource {
  constructor() {
    super(uri);
  }
  getKeylockCardList(params: any) {
    return request({
      url: `GetKeylockCardList`,
      method: "get",
      params,
    });
  }

  getRoomLockNumber(roomNumber: string) {
    if (!roomNumber) return;
    return request({
      url: `GetRoomLockNumber/${roomNumber}`,
      method: "get",
    });
  }

  getIssuedCardCount(params: any) {
    return request({
      url: `GetIssuedCardCount`,
      method: "get",
      params,
    });
  }

  insertLogKeylock(data: any) {
    return request({
      url: `InsertLogKeylock`,
      method: "post",
      data,
    });
  }

  updateEraseLogKeylock(ID: any) {
    return request({
      url: `UpdateEraseLogKeylock/${ID}`,
      method: "put",
    });
  }

  forceEraseCard(data: any) {
    return request({
      url: `ForceEraseCard`,
      method: "put",
      data,
    });
  }
}
export default KeylockAPI;
