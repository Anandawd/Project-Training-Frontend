// import Resource from "../../resource";
import request from "../../../utils/axios";
import configurationResource from "../configuration/configuration-resource";
import {
  IInsertBudgetStatistic,
} from "./interface/indext";

const uri = "";

class BudgetStatisticAPI extends configurationResource {
  constructor() {
    super(uri);
  }

  getBudgetStatisticList(params: any) {
    return request({
      url: `GetBudgetStatisticList`,
      method: "get",
      params
    });
  }

  insertBudgetStatistic(params: IInsertBudgetStatistic) {
    return request({
      url: `InsertStatisticBudget`,
      method: "post",
      data: params
    });
  }

  GetStatisticBudgetComboList() {
    return request({
      url: `GetStatisticBudgetComboList`,
      method: "get",
      
    });
  }


  getBudgetStatistic(params: number) {
    return request({
      url: `GetStatisticBudget/` + params,
      method: "get",
    });
  }

  updateBudgetStatistic(params: IInsertBudgetStatistic) {
    return request({
      url: `UpdateStatisticBudget`,
      method: "put",
      data: params
    });
  }

  deleteBudgetStatistic(id: any) {
    return request({
      url: "DeleteStatisticBudget/" + id,
      method: "delete",
    });
  }

}

export { BudgetStatisticAPI as default };
