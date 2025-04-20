// import UtilsAPI from "@/services/api/utils/utils";
import getters from "./getters";
import { defineStore } from "pinia";
// const utilsAPI = new UtilsAPI();
const subscriptionStore = defineStore("subscriptionStore", {
  state: () => ({
    subscriptionStatus: {
      PropertyName: "",
      Name: "",
      Domain: "",
      Subdomain: "",
      StartDate: "",
      EndDate: "",
      IsActive: true,
    },
    registeredStatus: true,
  }),
  actions: {
    // async getSubscriptionStatus() {
    //   try {
    //     const { data } = await utilsAPI.getSubscriptionStatus();
    //     this.setSubscriptionStatus(data);
    //   } catch (error) {
    //     // console.log(data);
    //   }
    // },
    setRegisterStatus(status: boolean) {
      this.registeredStatus = status;
      if (!status) {
        window.location.replace("https://cakrasoft.net");
      }
    },
    setSubscriptionStatus(status: any) {
      this.subscriptionStatus = status;
    },
    // async getRegistrationStatus(tableName: number, id: number) {
    //   const params = {
    //     table_name: tableName,
    //     id: id,
    //   };
    //   try {
    //     const { data } = await userActivityLogAPI.trackingData(params);
    //     this.logData = data ?? [];
    //     this.visible = true;
    //   } catch {}
    // },
  },
  getters,
});

export default subscriptionStore;
