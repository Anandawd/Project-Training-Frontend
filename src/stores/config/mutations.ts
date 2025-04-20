export default {
  SET_AUDIT_DATE: (state: any, payload: string): void => {
    state.auditDate = payload;
  },
  SET_SERVER_DATE_TIME: (state: any, payload: string): void => {
    state.serverDateTime = payload;
  },
  SET_SERVER_DATE: (state: any, payload: string): void => {
    state.serverDate = payload;
  },
  SET_CONFIGURATIONS(state: any, value: any) {
    localStorage.setItem("configurations", JSON.stringify(value));
    state.configurations = value;
  },
  SET_DEFAULT_CURRENCY(state: any, value: any) {
    state.defaultCurrency = value;
  },
  SET_ICON_PREFIX(state: any, value: any) {
    localStorage.setItem("icon_color", value);
    state.iconPrefix = value;
  },
};
