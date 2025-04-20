import request from "@/utils/axios";

class ConfigurationResource {
  uri: any;
  constructor(uri: any) {
    this.uri = uri;
  }

  list(query: any) {
    return request({
      url: "GetMasterDataList/" + this.uri,
      method: "get",
      params: query,
    });
  }

  get(id: string) {
    return request({
      url: "GetMasterDataList/" + this.uri + "/" + id,
      method: "get",
    });
  }

  update(resource: any) {
    return request({
      url: "UpdateMasterData/" + this.uri,
      method: "put",
      data: resource,
    });
  }

  create(resource: any) {
    return request({
      url: "InsertMasterData/" + this.uri,
      method: "post",
      data: resource,
    });
  }

  edit(id: string) {
    return request({
      url: "GetMasterData/" + this.uri + "/" + id,
      method: "get",
    });
  }

  delete(id: any) {
    return request({
      url: "DeleteMasterData/" + this.uri + "/" + id,
      method: "delete",
    });
  }

  codeNameList(codeName: string) {
    return request({
      url: "GetMasterDataCodeName/" + codeName,
      method: "get",
    });
  }

  codeDescriptionList(codeName: string) {
    return request({
      url: "GetMasterDataCodeDescription/" + codeName,
      method: "get",
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

  detailData(name: string, id: string) {
    return request({
      url: "GetMasterData/" + name + "/" + id,
      method: "get",
    });
  }

  detailDataList(name: string, code: string) {
    return request({
      url: `GetDetailDataList/${name}/${code}`,
      method: "get",
    });
  }

  getCityByState(stateCode: string) {
    return request({
      url: `GetCityByState/${stateCode}`,
      method: "get",
    });
  }

  getStateByCountry(countryCode: string) {
    return request({
      url: `GetStateByCountry/${countryCode}`,
      method: "get",
    });
  }

  getARCompanies() {
    return request({
      url: `GetARCompanies`,
      method: "get",
    });
  }

  getTransferToFolioList(params: any) {
    return request({
      url: `GetTransferToFolioList`,
      method: "get",
      params,
    });
  }

  getFolioLockStatus(FolioNumber: any) {
    return request({
      url: `GetFolioLockStatus/${FolioNumber}`,
      method: "get",
    });
  }

  updateAllGuestInHouseRate(rateCode: string) {
    return request({
      url: `UpdateAllGuestInHouseRate/${rateCode}`,
      method: "put",
    });
  }

  getReceivingItemLastPrice(params: any) {
    return request({
      url: `GetReceivingItemLastPrice`,
      method: "get",
      params,
    });
  }

  getAccountCharges() {
    return request({
      url: "GetAccountCharges",
      method: "get",
    });
  }

  trackingData(params: any) {
    return request({
      url: "TrackingData",
      method: "get",
      params,
    });
  }

  GenerateTableRoomService() {
    return request({
      url: "GenerateTableRoomService",
      method: "post",
      // params,
    });
  }

  GetMemberProduct(query: any) {
    return request({
      url: "GetMemberProduct",
      method: "get",
      params: query,
    });
  }

  GetMemberProductDiscount(code: any) {
    return request({
      url: "GetMemberProductDiscount/" + code,
      method: "get",
    });
  }

  GetPOSCategoryList(code: any) {
    return request({
      url: "GetPOSCategoryList/" + code,
      method: "get",
    });
  }

  ProcessMemberProductDiscount(params: any) {
    return request({
      url: "ProcessMemberProductDiscount",
      method: "post",
      data: params,
    });
  }

  DeleteMemberProductDiscount(params: any) {
    return request({
      url: "DeleteMemberProductDiscount/" + params,
      method: "delete",
    });
  }

  ActivateDeactivateItemInventory(params: any) {
    return request({
      url: "ActivateDeactivateItemInventory",
      method: "patch",
      data: params,
    });
  }

  getVenueByLocation(query: any) {
    return request({
      url: "GetMasterDataCodeName/VenueByLocation",
      method: "get",
      params: query,
    });
  }
}

export default ConfigurationResource;
