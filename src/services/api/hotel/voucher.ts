import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import { AxiosPromise } from "axios";

const uri = "";

class Voucher extends configurationResource {
    constructor() {
        super(uri);
    }
    GetVoucherList(query: any) {
        return request({
            url: "GetVoucherList",
            method: "get",
            params: query,
        });
    }
    GenerateVoucher(resource: any) {
        return request({
            url: "GenerateVoucher",
            method: "post",
            data: resource,
        })
    }

    DeleteVoucher(array: any) {
        return request({
        url: `DeleteVoucher?voucher_number=`+array,
        method:"delete",
        });
    }

    ApproveVoucher(resource: any) {
        return request({
            url: "ApproveVoucher",
            method: "patch",
            data: resource,
        })
    }

    ComplimentVoucher(resource: any) {
        return request({
            url: "ComplimentVoucher",
            method: "patch",
            data: resource,
        })
    }

    RedeemVoucher(resource: any) {
        return request({
            url: "RedeemVoucher",
            method: "patch",
            data: resource,
        })
    }

    CancelApproveVoucher(resource: any) {
        return request({
            url: "CancelApproveVoucher",
            method: "patch",
            data: resource,
        })
    }

    NotApproveVoucher(resource: any) {
        return request({
            url: "NotApproveVoucher",
            method: "patch",
            data: resource,
        })
    }
    SoldVoucher(resource: any) {
        return request({
            url: "SoldVoucher",
            method: "patch",
            data: resource,
        })
    }
    UnsoldVoucher(resource: any) {
        return request({
            url: "UnsoldVoucher",
            method: "patch",
            data: resource,
        })
    }

    // comboList
    GetVoucherComboList() {
        return request({
            url: `GetVoucherComboList`,
            method: "get"
        });
    }

    GetMasterData(params: any) {
        return request({
            url: "GetMasterDataCodeName/" + params,
            method: "get",
        });
    }

    GetMemberDetail(params: any) {
        return request({
            url: "GetMemberDetail/" + params,
            method: "get",
        });
    }

    GetVoucherDetail(params: any) {
        return request({
            url: "GetVoucherDetail/" + params,
            method: "get",
        });
    }
}

export { Voucher as default }