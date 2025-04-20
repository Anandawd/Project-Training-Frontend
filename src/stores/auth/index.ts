import EncryptionHelper from "@/utils/crypto";
import { defineStore } from "pinia";
import $global from "@/utils/global";
import { IUser } from "../../interfaces/user";
import hotelMenu from "@/router/menu/hotel-menu";
import pointOfSalesMenu from "@/router/menu/point-of-sales-menu";
import accountingMenu from "@/router/menu/accounting-menu";
import inventoryMenu from "@/router/menu/assets-menu";
import crmMenu from "@/router/menu/crm-menu";
import payrollMenu from "@/router/menu/payroll-menu";
import AuthAPI from "@/services/api/auth/auth";
import generalMenu from "@/router/menu/general-menu";
import toolsMenu from "@/router/menu/tools-menu";
import reportMenu from "@/router/menu/report-menu";
import subscriptionStore from "../subscription";
// add banquet
import banquetMenu from "@/router/menu/banquet-menu";
import configStore from "../config";
const encryptionHelper = new EncryptionHelper();
const authAPI = new AuthAPI();

const authModule = defineStore("auth", {
  state: () => ({
    networkErrorCount: 0,
    userInfo: localStorage.getItem("user"),
    token: localStorage.getItem("token"),
    accessForm: localStorage.getItem("accessForm"),
    accessGeneralForm: localStorage.getItem("accessCHSForm"),
    accessCHSForm: localStorage.getItem("accessCHSForm"),
    accessCASForm: localStorage.getItem("accessCASForm"),
    accessCPOSForm: localStorage.getItem("accessCPOSForm"),
    accessCAMSForm: localStorage.getItem("accessCAMSForm"),
    accessCBSForm: localStorage.getItem("accessCBSForm"),
    accessReportForm: localStorage.getItem("accessToolsForm"),
    accessToolsForm: localStorage.getItem("accessReportForm"),
    access:
      localStorage.getItem("access") != null &&
      localStorage.getItem("access") != "undefined"
        ? localStorage.getItem("access")
        : null,
    // aesKey: "bdfacb85f316310d97d296faa5a18588bd479fd7836aceb8534c2529bd89da56",
    aesKey: "^%^#@JHGHFsd56hsd63^93g$",
    aesIV: "JHGHFsd56hsd63^9",
    accessEncrypt:
      "94086d59ecda232402962de386e7d8d03e39d807f0ab9ed7ce18aa5abd0a2e0baa56a935e29361ea37a23c0dfa69ceb9",
    isPointOfSalesOnly: false,
    subscriptionModule: [],
    subscription: null,
    unitPropertyCode: localStorage.getItem("unit_code"),
    availableModule: [],
    availableModuleX: [
      {
        id: 8,
        sort: 1,
        code: $global.accessModule.payroll,
        name: "Payroll",
      },
    ],
    authorizeModule: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    activeModule: localStorage.getItem("active_module"),
    menuSideBar: [],
    frontDeskAccessUtility: {
      reservation: "",
      depositTools: "",
      floorPlan: "",
      keyLock: "",
      inHouse: "",
      walkInCheckInUpdate: "",
      folioHistory: "",
      folioTransaction: "",
      memberVoucherGift: "",
    },
    pointOfSalesAccessUtility: {
      transactionTerminal: "",
      tableView: "",
    },
    banquetAccessUtility: {
      booking: "",
      depositTools: "",
      banquetInProgress: "",
      transaction: "",
      folioHistory: "",
    },
    reportAccessUtility: {
      previewReport: "",
    },
  }),
  actions: {
    async login(user: string, payload: any) {
      if (this.isLocalServer) {
        this.setToken(payload.NewToken);
      }
      const config = configStore();
      config.getConfigurations();
      this.setUser(payload.UserInfo);
      await this.setAccessForm(payload);
      this.setFrontDeskAccessUtility();
      this.setBanquetAccessUtility();
      this.setPointOfSalesAccessUtility();
      this.setReportAccessUtility();
      this.setAuthorizeModule();
    },
    logout() {
      this.removeToken();
      this.removeUser();
      const domain = ".cakrasoft.net";
      document.cookie = "_app_credential=; Max-Age=0; path=/; domain=" + domain;
      document.cookie =
        "_app_cakrasoft_session_id=; Max-Age=0; path=/; domain=" + domain;
      document.cookie = "_unit_code=; Max-Age=0; path=/; domain=" + domain;
      window.location.replace("/login");
    },
    removeLocalData() {
      localStorage.removeItem("token");
      localStorage.removeItem("access");
      localStorage.removeItem("user");
      localStorage.removeItem("icon_color");
      localStorage.removeItem("configurations");
      localStorage.removeItem("active_store");
    },
    isLocalServer() {
      return (
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
      );
    },
    async generateAesKey() {
      // this.aesKey = await encryptionHelper.generateKey();
    },
    setToken(payload: any) {
      localStorage.setItem("token", payload);
      this.token = payload;
    },
    async getUserAccess() {
      try {
        const res = await encryptionHelper.decrypt(this.access);
        const access = JSON.parse(res);
        return access;
      } catch {
        this.logout();
      }
    },
    async setAccessForm(payload: any) {
      const enAccess = await encryptionHelper.encrypt(
        JSON.stringify(payload.UserAccess)
      );
      this.access = enAccess;
      localStorage.setItem("access", enAccess);
      // await this.generateAesKey();
      // const accessCHSForm = "1100000000000000000000000000000000000000000";
      // this.accessCHSForm = await encryptionHelper.encrypt(accessCHSForm);
      // this.accessCASForm = await encryptionHelper.encrypt(accessCHSForm);
      // this.accessCPOSForm = await encryptionHelper.encrypt(accessCHSForm);
      // this.accessCAMSForm = await encryptionHelper.encrypt(accessCHSForm);
      // this.accessCBSForm = await encryptionHelper.encrypt(accessCHSForm);
      // localStorage.setItem("accessCHSForm", this.accessCHSForm);
      // localStorage.setItem("accessCASForm", this.accessCASForm);
      // localStorage.setItem("accessCPOSForm", this.accessCPOSForm);
      // localStorage.setItem("accessCAMSForm", this.accessCAMSForm);
      // localStorage.setItem("accessCBSForm", this.accessCBSForm);
    },

    async setFrontDeskAccessUtility() {
      const user = await this.user;
      const access = await this.getUserAccess();
      if (user.ID.toUpperCase() == "SYSTEM") return;
      this.frontDeskAccessUtility = {
        reservation:
          (await this.decrypt(access.hotel.access_reservation)) ?? "",
        depositTools: (await this.decrypt(access.hotel.access_deposit)) ?? "",
        floorPlan: (await this.decrypt(access.hotel.access_floor_plan)) ?? "",
        keyLock: (await this.decrypt(access.hotel.access_keylock)) ?? "",
        inHouse: (await this.decrypt(access.hotel.access_in_house)) ?? "",
        walkInCheckInUpdate:
          (await this.decrypt(access.hotel.access_walk_in)) ?? "",
        folioHistory:
          (await this.decrypt(access.hotel.access_folio_history)) ?? "",
        folioTransaction: (await this.decrypt(access.hotel.access_folio)) ?? "",
        memberVoucherGift:
          (await this.decrypt(access.hotel.access_member_voucher_gift)) ?? "",
      };
    },

    async setBanquetAccessUtility() {
      const user = await this.user;
      const access = await this.getUserAccess();
      if (user.ID.toUpperCase() == "SYSTEM") return;
      this.banquetAccessUtility = {
        booking: (await this.decrypt(access.banquet.access_reservation)) ?? "",
        depositTools: (await this.decrypt(access.banquet.access_deposit)) ?? "",
        banquetInProgress:
          (await this.decrypt(access.banquet.access_in_house)) ?? "",
        folioHistory:
          (await this.decrypt(access.banquet.access_folio_history)) ?? "",
        transaction: (await this.decrypt(access.banquet.access_folio)) ?? "",
      };
    },
    async setPointOfSalesAccessUtility() {
      const user = await this.user;
      const access = await this.getUserAccess();
      if (user.ID.toUpperCase() == "SYSTEM") return;
      this.pointOfSalesAccessUtility = {
        transactionTerminal:
          (await this.decrypt(
            access.point_of_sales.access_transaction_terminal
          )) ?? "",
        tableView:
          (await this.decrypt(access.point_of_sales.access_table_view)) ?? "",
      };
    },
    async setReportAccessUtility() {
      const user = await this.user;
      const access = await this.getUserAccess();
      if (user.ID.toUpperCase() == "SYSTEM") return;
      this.reportAccessUtility = {
        previewReport:
          (await this.decrypt(access.report.access_preview_report)) ?? "",
      };
    },

    async decrypt(access: string) {
      const user = await this.user;
      return (await encryptionHelper.decrypt(access, user.GroupCode)) ?? "";
    },

    async setUserAccessModule(payload: string) {
      const access = await this.getUserAccess();
      switch (payload) {
        case $global.accessModule.general:
          this.accessForm = access.general.access_form;
          break;
        case $global.accessModule.hotel:
          this.accessForm = access.hotel.access_form;
          if (!this.frontDeskAccessUtility.inHouse) {
            await this.setFrontDeskAccessUtility();
          }
          break;
        case $global.accessModule.pointOfSales:
          this.accessForm = access.point_of_sales.access_form;
          if (!this.pointOfSalesAccessUtility.transactionTerminal) {
            await this.setPointOfSalesAccessUtility();
          }
          break;
        case $global.accessModule.banquet:
          this.accessForm = access.banquet.access_form;
          this.setBanquetAccessUtility();
          break;
        case $global.accessModule.accounting:
          this.accessForm = access.accounting.access_form;
          break;
        case $global.accessModule.inventory:
          this.accessForm = access.asset.access_form;
          break;
        case $global.accessModule.crm:
          this.accessForm = access.crm.access_form;
          break;
        case $global.accessModule.report:
          this.accessForm = access.report.access_form;
          await this.setReportAccessUtility();
          break;
        case $global.accessModule.tools:
          this.accessForm = access.tools.access_form;
          break;
        default:
          this.accessForm = null;
      }
    },
    getAccessForm() {},

    setAesKey(payload: any) {
      this.aesKey = payload;
    },
    async setActiveModule(payload?: string) {
      if (!payload) {
        if (this.activeModule) {
          payload = this.activeModule;
        } else {
          payload = this.availableModuleX[0].code;
        }
      }
      this.activeModule = payload;
      if (payload == "H") {
        this.menuSideBar = hotelMenu;
      } else if (payload == $global.accessModule.pointOfSales) {
        this.menuSideBar = pointOfSalesMenu;
        for (const i in this.menuSideBar) {
          if (
            this.menuSideBar[i].componentName == "dayend_close" ||
            this.menuSideBar[i].componentName == "desk_folio" ||
            this.menuSideBar[i].componentName == "folio_history"
          ) {
            if (this.isSubscribedHotel) delete this.menuSideBar[i];
          }
        }
      } else if (payload == $global.accessModule.banquet) {
        this.menuSideBar = banquetMenu;
      } else if (payload == $global.accessModule.accounting) {
        this.menuSideBar = accountingMenu;
      } else if (payload == $global.accessModule.inventory) {
        this.menuSideBar = inventoryMenu;
      } else if (payload == $global.accessModule.crm) {
        this.menuSideBar = crmMenu;
      } else if (payload == $global.accessModule.payroll) {
        this.menuSideBar = payrollMenu;
      } else if (payload == $global.accessModule.general) {
        this.menuSideBar = generalMenu;
      } else if (payload == $global.accessModule.report) {
        this.menuSideBar = reportMenu;
      } else if (payload == $global.accessModule.tools) {
        this.menuSideBar = toolsMenu;
      }
      localStorage.setItem("active_module", payload);
    },
    async setAuthorizeModule() {
      if (this.access == null) {
        return this.logout();
      }
      const user = await this.user;
      if (user.ID.toUpperCase() == "SYSTEM") return;
      const access = await this.getUserAccess();
      const accessModule = await this.decrypt(access.general.access_module);
      console.log("accc", accessModule);
      for (let i = 0; i < this.availableModuleX.length; i++) {
        this.authorizeModule[this.availableModuleX[i].id] =
          accessModule[this.availableModuleX[i].id];
      }
    },
    increaseError() {
      this.networkErrorCount++;
    },

    resetNetworkErrorCount() {
      this.networkErrorCount = 0;
    },
    removeToken() {
      localStorage.removeItem("token");
      this.token = "";
    },
    async setUser(payload: string) {
      const encryptUserInfo = await encryptionHelper.encrypt(
        JSON.stringify(payload)
      );
      localStorage.setItem("user", encryptUserInfo);
      this.userInfo = encryptUserInfo;
    },
    async removeUser() {
      localStorage.removeItem("user");
      this.userInfo = null;
    },
    async getUserFormAccess() {
      try {
        const { data } = await authAPI.getUserFormAccess();
        await this.setAccessForm(data);
        // this.setUserAccessUtility();
        this.setAuthorizeModule();
      } catch (err: any) {
        const error = err.response;
        if (error.status == 401) {
          this.logout();
        }
      }
    },
    async getSubscriptionModule() {
      try {
        const { data } = await authAPI.getSubscriptionModule();
        this.subscription = data;
        const subs = subscriptionStore();
        subs.setSubscriptionStatus(data);
        if (!data.AddOn) {
          if (!data.subscriptionId) {
            subs.setRegisterStatus(false);
          }
        }
        this.subscriptionModule = data.AddOn;
        let unavailableId: number[] = [];
        for (const i in this.availableModuleX) {
          let id = 0;
          if (this.availableModuleX[i].id > 4) continue;
          id = this.subscriptionModule.find(
            (id: number) => id == this.availableModuleX[i].id
          );
          if (!(id >= 0)) unavailableId.push(parseInt(i));
        }

        if (unavailableId.length > 0) {
          unavailableId.sort(function (a, b) {
            return b - a;
          });
          // TODO: banquet doesn't exist on subscription module list (this comment was written when the codes below commented)
          for (let i = 0; i < unavailableId.length; i++) {
            this.availableModuleX.splice(unavailableId[i], 1);
          }
        }
        this.availableModule = this.availableModuleX;
        this.availableModule.sort(function (a: any, b: any) {
          return a.sort - b.sort;
        });
        // console.log("availableModule", this.availableModule);
      } catch (err: any) {
        const error = err.response;
        if (error.status == 401) {
          this.logout();
          return;
        }
        throw err;
      }
    },
    async changeUnitProperty(code: string) {
      try {
        await authAPI.changeUnitProperty(code);
        this.unitPropertyCode = code;
        localStorage.setItem("unit_code", code);
      } catch (err) {
        throw err;
        // getToastError(err);
      }
    },
  },
  getters: {
    accessOrderForm: async (state: any) => {
      let access = "";
      try {
        access = await state.decrypt(state.accessForm);
      } catch (error) {}
      return access;
    },
    isAuth(state: any) {
      return state.userInfo; //&& getCookie("_app_cakrasoft_session_id")
    },
    user: async (state: any): Promise<IUser> => {
      try {
        const decryptUser = await encryptionHelper.decrypt(state.userInfo);
        return state.userInfo ? JSON.parse(decryptUser) : null;
      } catch {
        state.logout();
      }
    },

    isSubscribedHotel: (state: any) => {
      let stat = false;
      for (const i in state.availableModule) {
        if (state.availableModule[i].code == $global.accessModule.hotel) {
          stat = true;
        }
      }
      return stat;
    },
    isSubscribedPOS: (state: any): boolean => {
      let stat = false;
      for (const i in state.availableModule) {
        if (
          state.availableModule[i].code == $global.accessModule.pointOfSales
        ) {
          stat = true;
        }
      }
      return stat;
    },
    isSubscribedAccounting: (state: any): boolean => {
      let stat = false;
      for (const i in state.availableModule) {
        if (state.availableModule[i].code == $global.accessModule.accounting) {
          stat = true;
        }
      }
      return stat;
    },
    isSubscribedInventory: (state: any): boolean => {
      let stat = false;
      for (const i in state.availableModule) {
        if (state.availableModule[i].code == $global.accessModule.inventory) {
          stat = true;
        }
      }
      return stat;
    },
    isSubscribedBanquet: (state: any): boolean => {
      let stat = false;
      for (const i in state.availableModule) {
        if (state.availableModule[i].code == $global.accessModule.banquet) {
          stat = true;
        }
      }
      return stat;
    },
  },
});

export default authModule;
