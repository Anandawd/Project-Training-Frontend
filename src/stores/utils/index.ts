import getters from "./getters";
import { defineStore } from "pinia";
import UtilsAPI from "@/services/api/utils/utils";
import { v4 as uuid4 } from "uuid";
const utilsAPI = new UtilsAPI();
const utilsStore = defineStore("utilsStore", {
  state: () => ({
    connectionStatus: "ok",
    sessionID: localStorage.getItem("session_id") ?? "",
  }),
  actions: {
    setSessionID() {
      if (!this.sessionID || this.sessionID == "") {
        const uuid = uuid4();
        localStorage.setItem("session_id", uuid);
      }
    },
    setConnectionStatus(status: any) {
      this.connectionStatus = status;
    },
    async checkConnectionStatus() {
      this.connectionStatus = "failed";
      try {
        const { data } = await utilsAPI.tesConnection();
        this.connectionStatus = data;
      } catch (error) {
        this.connectionStatus = "failed";
        throw new Error("Connection Failed");
      }
    },
  },
  getters,
});

export default utilsStore;
