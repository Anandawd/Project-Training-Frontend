import Resource from "../../../resource";
import request from "@/utils/axios";

const uri = "";

class ExtraChargeReservationAPI extends Resource {
  constructor() {
    super(uri);
  }
  //  reservation API
  GetExtraChargeReservationList(number: any) {
    return request({
      url: 'GetExtraChargeReservationList/' + number,
      method: "get"
    });
  }

  InsertExtraChargeReservation(params: any) {
    return request({
      url: 'InsertExtraChargeReservation',
      method: "post",
      data: params
    });
  }

  GetExtraChargeReservation(id: any) {
    return request({
      url: 'GetExtraChargeReservation/' + id,
      method: "get"
    });
  }

  UpdateExtraChargeReservation(params: any) {
    return request({
      url: 'UpdateExtraChargeReservation',
      method: "put",
      data: params
    });
  }

  DeleteExtraChargeReservation(id: any) {
    return request({
      url: 'DeleteExtraChargeReservation/' + id,
      method: "delete"
    });
  }

  GetExtraChargeBreakdownReservationList(number: any) {
    return request({
      url: 'GetExtraChargeBreakdownReservationList/' + number,
      method: "get"
    });
  }

  GetExtraChargeBreakdownReservation(id: any) {
    return request({
      url: 'GetExtraChargeBreakdownReservation/' + id,
      method: "get"
    });
  }

  InsertExtraChargeBreakdownReservation(params: any) {
    return request({
      url: 'InsertExtraChargeBreakdownReservation',
      method: "post",
      data: params
    });
  }

  UpdateExtraChargeBreakdownReservation(params: any) {
    return request({
      url: 'UpdateExtraChargeBreakdownReservation',
      method: "put",
      data: params
    });
  }

  DeleteExtraChargeBreakdownReservation(id: any) {
    return request({
      url: 'DeleteExtraChargeBreakdownReservation/' + id,
      method: "delete"
    });
  }

  // guest in house
  GetExtraChargeInHouseList(number: any) {
    return request({
      url: 'GetExtraChargeInHouseList/' + number,
      method: "get"
    });
  }

  InsertExtraChargeInHouse(params: any) {
    return request({
      url: 'InsertExtraChargeInHouse',
      method: "post",
      data: params
    });
  }

  GetExtraChargeInHouse(id: any) {
    return request({
      url: 'GetExtraChargeInHouse/' + id,
      method: "get"
    });
  }

  UpdateExtraChargeInHouse(params: any) {
    return request({
      url: 'UpdateExtraChargeInHouse',
      method: "put",
      data: params
    });
  }

  DeleteExtraChargeInHouse(id: any) {
    return request({
      url: 'DeleteExtraChargeInHouse/' + id,
      method: "delete"
    });
  }

  GetExtraChargeBreakdownInHouseList(number: any) {
    return request({
      url: 'GetExtraChargeBreakdownInHouseList/' + number,
      method: "get"
    });
  }

  GetExtraChargeBreakdownInHouse(id: any) {
    return request({
      url: 'GetExtraChargeBreakdownInHouse/' + id,
      method: "get"
    });
  }

  InsertExtraChargeBreakdownInHouse(params: any) {
    return request({
      url: 'InsertExtraChargeBreakdownInHouse',
      method: "post",
      data: params
    });
  }

  UpdateExtraChargeBreakdownInHouse(params: any) {
    return request({
      url: 'UpdateExtraChargeBreakdownInHouse',
      method: "put",
      data: params
    });
  }

  DeleteExtraChargeBreakdownInHouse(id: any) {
    return request({
      url: 'DeleteExtraChargeBreakdownInHouse/' + id,
      method: "delete"
    });
  }

  // package
  InsertExtraChargePackageReservation(params: any) {
    return request({
      url: 'InsertExtraChargePackageReservation',
      method: "post",
      data: params
    });
  }

  InsertExtraChargePackageInHouse(params: any) {
    return request({
      url: 'InsertExtraChargePackageInHouse',
      method: "post",
      data: params
    });
  }


  codeNameListArray(query: Array<string>) {
    return request({
      url: `GetMasterDataCodeNameArray?DataNameList=${JSON.stringify(query)}`,
      method: "get",
    });
  }

  GetPOSProductByOutlet(code: string){
    return request({
      url: 'GetPOSProductByOutlet/' + code,
      method: "get",
    });
  }
}

export { ExtraChargeReservationAPI as default };