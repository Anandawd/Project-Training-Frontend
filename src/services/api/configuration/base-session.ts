// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "./configuration-resource";

const uri = "";

class BaseSessionAndSession extends configurationResource {
    constructor() {
        super(uri);
    }

    GetRoomRateBaseSessionList(code: any) {
        return request({
            url: `GetRoomRateBaseSessionList/` + code,
            method: "get",
        });
    }

    InsertRoomRateBaseSession(params: any) {
        return request({
            url: `ProcessDynamicRate`,
            method: "post",
            data: params
        });
    }

    GetRoomRateBaseSession(id: any) {
        return request({
            url: `GetRoomRateBaseSession/` + id,
            method: "get"
        });
    }

    UpdateRoomRateBaseSession(params: any) {
        return request({
            url: `ProcessDynamicRate`,
            method: "post",
            data: params
        });
    }

    DeleteRoomRateBaseSession(id: any) {
        return request({
            url: "DeleteRoomRateBaseSession/" + id,
            method: "delete",
        });
    }


}



export { BaseSessionAndSession as default };
