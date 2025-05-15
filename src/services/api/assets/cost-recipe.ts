import Resource from "../../resource";
import request from "@/utils/axios";
import configurationResource from "../configuration/configuration-resource";
import resource from "../../resource";

const uri = "";

class CostRecipe extends configurationResource {
  constructor() {
    super(uri);
  }

  GetCostRecipeList(query: any) {
    return request({
      url: "GetCostRecipeList",
      method: "get",
      params: query,
    });
  }

  GetCostRecipe(params: any) {
    return request({
      url: "GetCostRecipe/" + params,
      method: "get",
    });
  }

  GetCostRecipeDetailList(params: any) {
    return request({
      url: "GetCostRecipeDetailList/" + params,
      method: "get",
    });
  }

  GetCostRecipeComboList(params: any) {
    return request({
      url: "GetCostRecipeComboList",
      method: "get",
    });
  }

  GetCostRecipeProductOutlet(params: any) {
    return request({
      url: "GetCostRecipeProductOutlet/" + params,
      method: "get",
    });
  }

  GetUom(params: any) {
    return request({
      url: "GetUom/" + params,
      method: "get",
    });
  }

  InsertCostRecipe(resource: any) {
    return request({
      url: "InsertCostRecipe",
      method: "post",
      data: resource,
    });
  }

  UpdateCostRecipe(resource: any) {
    return request({
      url: "UpdateCostRecipe",
      method: "put",
      data: resource,
    });
  }

  DeleteCostRecipe(params: any) {
    return request({
      url: "DeleteCostRecipe/" + params,
      method: "delete",
    });
  }
}

export { CostRecipe as default };
