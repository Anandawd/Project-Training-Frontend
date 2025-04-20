import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
const uri = "";

class FixedAssetListApi extends configurationResource {
  constructor() {
    super(uri);
  }

  GetFixedAssetList(query: any) {
    return request({
      url: "GetFixedAssetList",
      method: "get",
      params: query,
    });
  }

  GetFixedAsset(param: any) {
    return request({
      url: "GetFixedAsset/" + param,
      method: "get",
    });
  }

  GetFixedAssetListComboList(params: any) {
    return request({
      url: "GetFixedAssetListComboList",
      method: "get",
    });
  }

  GetFixedAssetSameReceive(query: any) {
    return request({
      url: "GetFixedAssetSameReceive",
      method: "get",
      params: query,
    });
  }

  InsertFixedAsset(resource: any) {
    return request({
      url: "InsertFixedAsset",
      method: "post",
      data: resource,
    });
  }

  UpdateFixedAsset(resource: any) {
    return request({
      url: "UpdateFixedAsset",
      method: "put",
      data: resource,
    });
  }

  UpdateFixedAssetSameReceive(resource: any) {
    return request({
      url: "UpdateFixedAssetSameReceive",
      method: "put",
      data: resource,
    });
  }

  UpdateConditionStatusBroken(resource: any) {
    return request({
      url: "UpdateConditionStatusBroken",
      method: "put",
      data: resource,
    });
  }

  UpdateStatusConditionSold(resource: any) {
    return request({
      url: "UpdateStatusConditionSold",
      method: "put",
      data: resource,
    });
  }

  UpdateStatusConditionTransfered(resource: any) {
    return request({
      url: "UpdateStatusConditionTransfered",
      method: "put",
      data: resource,
    });
  }

  UpdateStatusConditionFullyDepreciate(resource: any) {
    return request({
      url: "UpdateStatusConditionFullyDepreciate",
      method: "put",
      data: resource,
    });
  }

  UpdateStatusConditionCancel(resource: any) {
    return request({
      url: "UpdateStatusConditionCancel",
      method: "put",
      data: resource,
    });
  }

  UpdateFALocation(resource: any) {
    return request({
      url: "UpdateFALocation",
      method: "put",
      data: resource
    })
  }

  DeleteFixedAsset(param: any) {
    return request({
      url: "DeleteFixedAsset/" + param,
      method: "delete",
    });
  }
}

export { FixedAssetListApi as default };
