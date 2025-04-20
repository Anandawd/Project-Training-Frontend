import UtilsAPI from "../../services/api/utils/utils";
const utilsAPI = new UtilsAPI();

export default {
  async getAuditDate(context: any) {
    const { commit } = context;
    const { data } = await utilsAPI.getAuditDate();
    commit("SET_AUDIT_DATE", data);
  },
  async getServerDateTime(context: any) {
    const { commit } = context;
    const { data } = await utilsAPI.getServerDateTime();
    commit("SET_SERVER_DATE_TIME", data);
  },
  async getServerDate(context: any) {
    const { commit } = context;
    const { data } = await utilsAPI.getServerDate();
    commit("SET_SERVER_DATE", data);
  },
  async getConfigurations(context: any) {
    const { commit } = context;
    const { data } = await utilsAPI.getConfigurationsAll();
    const iconColor = localStorage.getItem("icon_color");
    if (iconColor === null) commit("SET_ICON_PREFIX", "color_");
    // localStorage.setItem('default_currency',data.dvCurrency);
    commit("SET_CONFIGURATIONS", data);
    // commit('SET_DEFAULT_CURRENCY', data.dvCurrency)
  },
};
