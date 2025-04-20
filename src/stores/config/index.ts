import UtilsAPI from "../../services/api/utils/utils";
import { defineStore } from "pinia";
import { formatDateTimeZeroUTC } from "@/utils/format";
import getters from "./getters";
import global from "@/utils/global";
import EncryptionHelper from "@/utils/crypto";
const encryptionHelper = new EncryptionHelper();
const utilsAPI = new UtilsAPI();

const configStore = defineStore("config", {
  state: () => ({
    audit: "",
    serverDate: "2020-12-11",
    serverDateTime: "2020-12-11 00:00:00",
    iconPrefix: localStorage.getItem("icon_color"),
    encryptConfigurations: localStorage.getItem("configurations")
      ? localStorage.getItem("configurations")
      : "",
    configurations: "",
    defaultCurrency: "IDR", //TODO default currency
    intervalId: null,
    activeStore: localStorage.getItem("active_store"),
    dayendClose: false,
  }),
  actions: {
    async getAuditDateInterval() {
      try {
        this.getAuditDate();
        this.intervalId = setInterval(async () => {
          const { data } = await utilsAPI.getAuditDate();
          this.setAuditDate(data);
        }, global.intervalAuditDateSync);
      } catch (err) {}
    },
    async getAuditDate() {
      try {
        const { data } = await utilsAPI.getAuditDate();
        this.setAuditDate(data);
      } catch (err: any) {
        const response = err.response;
        console.error(err);
        if (response) {
          const status = response.status;
          if (status) {
            if (status == 401) {
              window.location.replace("/logout");
            }
          }
        }
      }
    },
    async getServerDateTime() {
      const { data } = await utilsAPI.getServerDateTime();
      this.setServerDateTime(data);
    },
    async getServerDate() {
      const { data } = await utilsAPI.getServerDate();
      this.setServerDate(data);
    },
    async getConfigurations() {
      try {
        const { data } = await utilsAPI.getConfigurationsAll();
        // const iconColor = localStorage.getItem("icon_color");
        // if (iconColor === null) this.setIconPrefix(data);
        await this.setConfigurations(data);
      } catch (error: any) {
        // console.error(err)
        console.log(error);
        const response = error.response;
        if (response) {
          const status = response.status;
          if (status) {
            if (status == 401) {
              window.location.replace("/logout");
            }
          }
        }
      }
    },
    //mutation
    setAuditDate(payload: string) {
      this.audit = formatDateTimeZeroUTC(payload);
    },
    setServerDateTime(payload: string) {
      this.serverDateTime = payload;
    },
    setServerDate(payload: string) {
      this.serverDate = payload;
    },
    // setDefaultActiveStore(payload: string) {
    //   this.activeStore = payload;
    //   localStorage.setItem("active_store", payload);
    // },
    async setConfigurations(value: any) {
      this.configurations = value;
      // const encryptConfiguration = await encryptionHelper.encrypt(
      //   JSON.stringify(value)
      // );
      // localStorage.setItem("configurations", encryptConfiguration);
    },
    setDefaultCurrency(value: any) {
      this.defaultCurrency = value;
    },
    setIconPrefix(value: any) {
      localStorage.setItem("icon_color", value);
      this.iconPrefix = value;
    },
    setActiveStore(value: string) {
      if (!value) value = this.defaultStore;
      localStorage.setItem("active_store", value);
      this.activeStore = value;
    },
    setDefaultActiveStore() {
      this.activeStore =
        localStorage.getItem("active_store") ?? this.defaultStore;
    },
    setServerStatus(payload: any) {
      this.audit = payload.audit_date;
      this.serverDateTime = payload.server_time;
      this.dayendClose = payload.dayend_close;
    },
  },
  getters: getters,
  //
});

export default configStore;
