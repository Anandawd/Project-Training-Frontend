import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { AxiosPromise } from "axios";

const uri = "";

class GuestLoanItemList extends configurationResource {
    constructor() {
        super(uri);
    }
    GetGuestLoanItemList(query: any) {
        return request({
            url: "GetGuestLoanItemList",
            method: "get",
            params: query,
        });
    }
    UpdateGuestLoanItem(resource: any) {
        return request({
            url: "UpdateGuestLoanItem",
            method: "put",
            data: resource,
        });
    }
    updateReturnedStatus(resource: any) {
        return request({
            url: "UpdateGuestLoanItemReturned",
            method: "put",
            data: resource
        });
    }
    InsertGuestLoanItem(resource: any) {
        return request({
            url: "InsertGuestLoanItem",
            method: "post",
            data: resource,
        })
    }
    GetGuestLoanItem(id: any) {
        return request({
            url: "GetGuestLoanItem/" + id,
            method: "get",
        });
    }
    DeleteGuestLoanItem(id: any) {
        return request({
            url: "DeleteGuestLoanItem/" + id,
            method: "delete",
        });
    }

    // comboList
    getGuestLoanItemComboList() {
        return request({
            url: `GetGuestLoanItemComboList`,
            method: "get"
        });
    }
}

export { GuestLoanItemList as default }