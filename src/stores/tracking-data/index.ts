import getters from "./getters";
import UserActivityLogAPI from "@/services/api/general/user-activity-log";
import { defineStore } from "pinia";
const userActivityLogAPI = new UserActivityLogAPI();
const trackingDataStore = defineStore("trackingDataStore", {
  state: () => ({
    visible: false,
    logData: [],
    id: 0,
  }),
  actions: {
    show(tableName: number, id: number) {
      this.id = id;
      this.getTrackingDataLog(tableName, id);
    },
    hide() {
      this.visible = false;
    },

    async getTrackingDataLog(tableName: number, id: number) {
      const params = {
        table_name: tableName,
        id: id,
      };
      try {
        const { data } = await userActivityLogAPI.trackingData(params);
        this.logData = data ?? [];
        this.visible = true;
      } catch {}
    },
  },
  getters,
});

export default trackingDataStore;
