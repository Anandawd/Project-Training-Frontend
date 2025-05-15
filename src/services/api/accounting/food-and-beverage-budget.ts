// import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import {
  IInsertFoodAndBeverageBudget,
} from "./interface/indext";

const uri = "";

class foodAndBeverageBudgetAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getFBBudgetList(params: any) {
    return request({
      url: `GetFBBudgetList`,
      method: "get",
      params
    });
  }

  insertFBBudget(params: IInsertFoodAndBeverageBudget) {
    return request({
      url: `InsertFBBudget`,
      method: "post",
      data: params
    });
  }

  getFBBudgetOutletComboList() {
    return request({
      url: `GetFBBudgetOutletComboList`,
      method: "get",
    });
  }

  GetFBBudgetStatisticAccountComboList() {
    return request({
      url: `GetFBBudgetStatisticAccountComboList`,
      method: "get",
    });
  }


  getFBBudget(params: number) {
    return request({
      url: `GetFBBudget/` + params,
      method: "get",
    });
  }

  updateFBBudget(params: IInsertFoodAndBeverageBudget) {
    return request({
      url: `UpdateFBBudget`,
      method: "put",
      data: params
    });
  }

  deleteFBBudget(id: any) {
    return request({
      url: "DeleteFBBudget/" + id,
      method: "delete",
    });
  }

}

export { foodAndBeverageBudgetAPI as default };
