import actions from "./actions";
import getters from "./getters";
import { IAuthModule } from "../../interfaces/state";

const authModule: IAuthModule = {
  namespaced: true,
  state: {
    token: localStorage.getItem("gatekeeper_token"),
    user: null,
    aesKey: null,
  },
  actions,
  getters,
};

export default authModule;
