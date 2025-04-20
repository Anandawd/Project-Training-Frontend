import request from "@/utils/axios";
import configurationResource from "../../configuration/configuration-resource";
const uri = "";
class guestProfileAPI extends configurationResource {
    constructor() {
        super(uri);
    }
    GetMemberList(params: any) {
        return request({
            url: `GetMemberList`,
            method: "get",
            params,
        });
    }
    InsertMember(params: any) {
        return request({
            url: `InsertMember`,
            method: "post",
            data: params,
        });
    }
    ProcessMemberProductDiscount(params: any) {
        return request({
            url: `ProcessMemberProductDiscount`,
            method: "post",
            data: params,
        });
    }
    GetMember(params: any) {
        return request({
            url: `GetMember/` + params,
            method: "get",
        });
    }
    UpdateMember(params: any) {
        return request({
            url: `UpdateMember`,
            method: "put",
            data: params,
        });
    }
    DeleteMember(params: any) {
        return request({
            url: `DeleteMember/` + params,
            method: "delete",
        });
    }
    DeleteMemberProductDiscount(params: any) {
        return request({
            url: `DeleteMemberProductDiscount/` + params,
            method: "delete",
        });
    }
    UpdateGuestProfileActive(params: any) {
        return request({
            url: `UpdateGuestProfileActive`,
            method: "put",
            data: params,
        });
    }
    UpdateGuestProfileBlacklist(params: any) {
        return request({
            url: `UpdateGuestProfileBlacklist`,
            method: "put",
            data: params,
        });
    }
    GetMemberComboList() {
        return request({
            url: `GetMemberComboList`,
            method: "get",
        });
    }
    GetMemberProduct(params: any) {
        return request({
            url: `GetMemberProduct`,
            method: "get",
            params
        });
    }
    GetMemberProductDiscount(params: any) {
        return request({
            url: `GetMemberProductDiscount/` + params,
            method: "get",
        });
    }
    GetStateByCountry(country: any) {
        return request({
            url: `GetStateByCountry/` + country,
            method: "get",
        });
    }
    GetCityByState(state: any) {
        return request({
            url: `GetCityByState/` + state,
            method: "get",
        });
    }
    GetPOSCategoryList(code: any) {
        return request({
            url: "GetPOSCategoryList/" + code,
            method: "get",
        });
    }
}
export { guestProfileAPI as default };
