import axios from "axios";
import authModule from "../stores/auth";
import sconfig from "../stores/config";
import subscription from "../stores/subscription";
import $global from "./global";

//load env file
let URL_API = "http://25.7.35.69:9000";
const instance = axios.create({
  baseURL: URL_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origins": "*",
  },
});

const reviver = (key: any, value: any) => {
  if (typeof value === "string" && !isNaN(value) && value !== "") {
    return Number(value);
  } else if (value === "true" || value === "false") {
    return value === "true" ? true : false;
  }
  return value;
};

// interface IInsertAPRefundDeposit {
//   user_id: string,
//   password: string,
//   mode_editor: number,
//   ref_number: string,
//   date: string,
//   discount: number,
//   bank_administration: number,
//   discount_journal_account_code: number,
//   ba_journal_account_code: string,
//   other_expense: Number,
//   oe_journal_account_code: string,
//   journal_account_code: string,
//   remark: string,
//   payment_detail: [{
//     id: number,
//     folio_number: number,
//     audit_date: string,
//     amount: number,
//     journal_account_code: string,
//   }],
// }

instance.interceptors.request.use(
  async (config) => {
    if (config.headers) {
      const s = authModule();
      const token = s.token;
      const companyCode = s.unitPropertyCode;
      config.headers["Token"] = token;
      // config.headers["X-Unit-Code"] = companyCode;
    }
    // console.log("hostname", window.location.hostname);
    // if (window.location.hostname != "localhost") {
    //   config.baseURL = `https://${window.location.hostname}`;
    // }
    // }
    // if (config.data) {
    //   config.data = JSON.parse(JSON.stringify(config.data), reviver)
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.hasOwnProperty("Result")) {
      response.data = res.Result;
    } else {
      response.data = res;
    }
    response.status2 = {
      status: res.StatusCode,
      message: res.Message,
      result: res.Result,
    };
    return response;
  },
  (error) => {
    const s = authModule();
    const c = sconfig();
    const sub = subscription();
    if (error.response && error.response.data) {
      if (error.response.status == 401) {
        // s.logout();
        // router.push("/login");
        clearInterval(c.intervalId);
      }
    }

    if (!error.response) {
      s.increaseError();
      if (s.networkErrorCount > 3) {
        // s.logout();
        // router.push("/login");
        s.resetNetworkErrorCount();
      }
    }

    let response = error.response;
    if (response) {
      const res = response.data;
      response.data = res.Result;
      error.response.status2 = {
        status: res.StatusCode,
        message: res.Message,
        result: res.Result,
      };
      // console.log("status", res.StatusCode);
      if (res.StatusCode == $global.responseStatus.unregistered) {
        sub.setRegisterStatus(false);
      } else if (res.StatusCode == $global.responseStatus.subscriptionExpired) {
        sub.setSubscriptionStatus(res.Result);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
