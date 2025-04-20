// import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";

const uri = "";

class BaseOccupancyAndSession extends configurationResource {
    constructor() {
        super(uri);
    }

    GetRoomRateBaseOccupancyList(code: any) {
        return request({
            url: `GetRoomRateBaseOccupancyList/` + code,
            method: "get",
        });
    }

    InsertRoomRateBaseOccupancy(params: any) {
        return request({
            url: `InsertRoomRateBaseOccupancy`,
            method: "post",
            data: params
        });
    }

    GetRoomRateBaseOccupancy(id: any) {
        return request({
            url: `GetRoomRateBaseOccupancy/` + id,
            method: "get"
        });
    }

    UpdateRoomRateBaseOccupancy(params: any) {
        return request({
            url: `UpdateRoomRateBaseOccupancy`,
            method: "put",
            data: params
        });
    }

    DeleteRoomRateBaseOccupancy(id: any) {
        return request({
            url: "DeleteRoomRateBaseOccupancy/" + id,
            method: "delete",
        });
    }


}



export { BaseOccupancyAndSession as default };
