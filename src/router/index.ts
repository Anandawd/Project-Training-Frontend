import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import Main from "../views/modules/main/main.vue";
import Login from "../views/modules/login/login.vue";
import Register from "../views/modules/register/register.vue";
import { ProgressFinisher, useProgress } from "@marcoschulte/vue3-progress";

// import Dashboard from "@/views/pages/dashboard/dashboard.vue";
// import Profile from "@/views/pages/profile/profile.vue";
import ForgotPassword from "../views/modules/forgot-password/forgot-password.vue";
import RecoverPassword from "../views/modules/recover-password/recover-password.vue";
import PrivacyPolicy from "../views/modules/privacy-policy/privacy-policy.vue";
// import Blank from "@/views/pages/blank/blank.vue";
import $global from "@/utils/global";
import utilsStore from "@/stores/utils";
import authModule from "@/stores/auth";
import menu from "./menu";
// import generalRoutes from "./routes/general-routes";
// import hotelRoutes from "./routes/hotel-routes";
// import assetsRoutes from "./routes/assets-routes";
// import accountingRoutes from "./routes/accounting-routes";
// import point_of_salesRoutes from "./routes/point_of_sales-routes";
// import banquetRoutes from "./routes/banquet-routes";
// import crmRoutes from "./routes/crm-routes";
import payrollRoutes from "./routes/payroll-routes";
import configStore from "@/stores/config";
import { getRouterMenu } from "@/utils/general";
// import toolsRoutes from "./routes/tools-routes";
import subscription from "@/stores/subscription";
// import reportRoutes from "./routes/report-routes";
let progresses = [] as ProgressFinisher[];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Main",
    component: Main,
    meta: {
      menu: {
        requiresAuth: true,
      },
    },
    children: [
      {
        path: "dashboard",
        name: "Dashboard Page",
        component: () =>
          import(
            /*webpackChunkName: "sub-department"*/ "@/views/pages/dashboard/dashboard.vue"
          ),
        meta: {
          pageTitle: "title.dashboard",
          breadcrumb: [{ title: "title.dashboard", active: true }],
          menu: getRouterMenu(menu, $global.accessGeneralOrder.dashboard),
          requiresAuth: true,
        },
      },
      {
        path: "/payroll",
        name: "Payroll",
        meta: {
          accessModule: $global.accessModule.payroll,
        },
        children: payrollRoutes,
      },
      {
        path: "training",
        name: "Base Training",
        component: () =>
          import(
            /*webpackChunkName: "room-availability"*/ "@/views/pages/training/training.vue"
          ),
        meta: {
          pageTitle: "title.training",
          breadcrumb: [
            { title: "title.home", url: "/" },
            { title: "title.training", active: true },
          ],
          menu: {
            routeOrder: 1, //$global.accessCHSMenuOrder.training,
          },
        },
      },
    ],
  },
  {
    path: "/blank",
    name: "Blank",
    component: () =>
      import(/*webpackChunkName: "report"*/ "../views/pages/blank/blank.vue"),
    meta: {
      pageTitle: "title.blank",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.blank", active: true },
      ],
      menu: menu.find((val) => val.path == "room-type-availability"),
    },
  },
  {
    path: "/report/preview",
    name: "Report Preview",
    component: () =>
      import(
        /*webpackChunkName: "report"*/ "../views/modules/report/report.vue"
      ),
    meta: {
      pageTitle: "title.report",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.report" },
        { title: "title.preview", active: true },
      ],
      menu: menu.find((val) => val.path == "room-type-availability"),
    },
  },

  {
    path: "/report-view",
    name: "Report View",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "../views/pages/modules/general/report-view/report-view.vue"
      ),
    meta: {
      requiresAuth: true,
      pageTitle: "title.reportView",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.reportView", active: true },
      ],
      routeOrder: $global.reportAccessOrder.accessPreviewReport,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresUnauth: true,
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Login,
    meta: {
      requiresUnauth: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresUnauth: true,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: {
      requiresUnauth: true,
    },
  },
  {
    path: "/recover-password",
    name: "RecoverPassword",
    component: RecoverPassword,
    meta: {
      requiresUnauth: true,
    },
  },
  {
    path: "/privacy-policy",
    name: "RecoverPassword",
    component: PrivacyPolicy,
  },
  {
    path: "/converter",
    name: "Converter",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/modules/converter/converter.vue"
      ),
  },
  {
    path: "/crypto",
    name: "Crypto",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/modules/crypto/crypto.vue"
      ),
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/modules/unauthorized/unauthorized.vue"
      ),
    meta: {
      requiresUnauth: true,
    },
  },
  {
    path: "/dayend-close-status",
    name: "Dayend Close Status",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/modules/dayend-close-status/dayend-close-status.vue"
      ),
    meta: {
      requiresUnauth: false,
    },
  },
  {
    path: "/subscription-status",
    name: "Subscription Status",
    component: () =>
      import(
        /*webpackChunkName: "subscription-status"*/ "@/views/modules/subscription-status/subscription-status.vue"
      ),
    meta: {
      requiresUnauth: false,
    },
  },
  {
    path: "/network-error",
    name: "Network Error",
    component: () =>
      import(
        /*webpackChunkName: "network-error"*/ "@/views/modules/network-error/network-error.vue"
      ),
    meta: {
      requiresUnauth: false,
    },
  },
  {
    path: "/setup-wizard",
    name: "Setup Wizard",
    component: () =>
      import(
        /*webpackChunkName: "network-error"*/ "@/views/modules/setup-wizard/setup-wizard.vue"
      ),
    meta: {
      requiresUnauth: false,
    },
  },
  {
    path: "/404",
    name: "Page not found2",
    component: () =>
      import(
        /*webpackChunkName: "network-error"*/ "@/views/modules/page-not-found/page-not-found.vue"
      ),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Page not found",
    component: () =>
      import(
        /*webpackChunkName: "network-error"*/ "@/views/modules/page-not-found/page-not-found.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // TODO auth enable this for auth
  const auth = authModule();
  if (auth.subscriptionModule.length <= 0) {
    auth.getSubscriptionModule();
  }
  routeProcess(to, from, next, auth);
  // }
});

async function routeProcess(to: any, from: any, next: any, auth: any) {
  if (auth.subscriptionModule.length <= 0) {
    try {
      await auth.getSubscriptionModule();
    } catch (err) {
      const utils = utilsStore();
      await utils.checkConnectionStatus();
      if (utils.connectionStatus == "ok") {
        // console.log("mas2");
        // window.location.replace("https://cakrasoft.com");
        // next({ name: "Page not found2" });
        return;
      }
    }
  }
  // console.log("lolos2");
  let homePage = "Dashboard Page";
  if (!auth.isSubscribedHotel && auth.isSubscribedPOS) {
    homePage = "Transaction Terminal";
  }
  // console.log("auth.isSubscribedHotel", auth.isSubscribedHotel);
  //Test Connection
  if (to.name != "Network Error") {
    const utils = utilsStore();
    const subs = subscription();
    try {
      await utils.checkConnectionStatus();
      if (!subs.registeredStatus) {
        // console.log("!subs.registeredStatus");

        window.location.replace("https://cakrasoft.net");
        return;
      }
      if (to.name != "Subscription Status") {
        if (!subs.subscriptionStatus.IsActive) {
          // alert("Please subscribe to continue using the application.");
          // console.log("Subscription Status");

          next({ name: "Subscription Status" });
        }
      }
    } catch (error) {
      if (!subs.registeredStatus) {
        // console.log("!subs.registeredStatus bawah");

        window.location.replace("https://cakrasoft.net");
        return;
      }
      if (utils.connectionStatus != "ok") {
        // console.log("Network Error");
        next({ name: "Network Error" });
        return;
      }
      if (to.name != "Subscription Status") {
        if (!subs.subscriptionStatus.IsActive) {
          // console.log("Subscription Status Bawah");

          // alert("Please subscribe to continue using the application.");
          next({ name: "Subscription Status" });
        }
      }
    }
  }
  if (to.name == "Network Error") {
    const utils = utilsStore();
    if (utils.connectionStatus == "ok") {
      // console.log("utils.connectionStatus == OK");

      next({ name: "Main" });
      return;
    }
  }

  if (to.meta.accessModule == $global.accessModule.hotel) {
    if (!auth.isSubscribedHotel) {
      // console.log("utils.connectionStatus == OK");
      next({ name: "Page not found" });
      return;
    }
  }

  //Authentication
  // let isChangedPassword = store.getters.isChangedPassword;
  //get audit date if null
  const config = configStore();
  const auditDate = config.audit;
  if (
    config.configurations == "" &&
    to.name != "Login" &&
    to.name != "Network Error" &&
    to.name != "Report View" &&
    to.name != "Subscription Status"
  ) {
    // console.log("GetConfiguration");
    await config.getConfigurations();
    if (config.configurations == "") {
      auth.logout();
    }
  }

  if (to.name == "Setup Wizard") {
    // console.log("Setup Wizard");
    await config.getConfigurations();

    if (config.wizardComplete) {
      // console.log("Wizard Complete");
      next({ name: "Main" });
      return;
    }
  }

  if (to.name == "Logout") {
    auth.logout();
    return;
  }
  if (
    to.meta.menu &&
    to.matched.some((record: { meta: { menu: any } }) => {
      return record.meta.menu.requiresAuth;
    })
  ) {
    // await config.getConfigurations();
    if (config.configurations && !config.wizardComplete) {
      // console.log("Setup Wizard");

      next({ name: "Setup Wizard" });
      return;
    }
    // await auth.getUserFormAccess();
    if (!auth.isAuth) {
      // console.log("Login");
      auth.logout();
      next({ name: "Login" });
    } else {
      if (!auditDate) {
        // console.log("getAuditDate");
        await config.getAuditDate();
      }
      const user = await auth.user;
      const userId = user.ID.toUpperCase();
      if (
        to.matched.some((record: any) => {
          return record.meta.accessModule || record.meta.menu.routeOrder;
        })
      ) {
        //proteksi Route from user group
        // auth.getRouterGroup(to.meta);
        let accessModule = "";
        if (to.matched.length == 3) {
          accessModule = to.matched[1].meta.accessModule;
        } else if (to.matched.length == 2) {
          accessModule = to.matched[0].meta.accessModule;
        }
        // console.log("SetuserAccessModule");
        await auth.setUserAccessModule(accessModule);
        let menuAccessOrderData = await auth.accessOrderForm;

        if (to.meta.menu.routeOrder >= 100) {
          //Checking Router No in Menu/Nested Other menu to open, But User Direct Access Path
          if (from.name != undefined && from.name != null && from.name != "") {
            next();
          } else {
            // console.log("Subscription Status");
            //   console.log("Unaothorized");
            next({ name: "unauthorized" });
          }
        } else if (menuAccessOrderData.length === 0) {
          //Access menu direct patch
          // await auth.setAccessForm();
          menuAccessOrderData = await auth.accessOrderForm;
          if (
            (menuAccessOrderData &&
              menuAccessOrderData[to.meta.menu.routeOrder] != undefined &&
              menuAccessOrderData[to.meta.menu.routeOrder] == "1") ||
            userId == "SYSTEM"
          ) {
            next();
          } else {
            // console.log("Unaothorized Bawah");
            next({ name: "unauthorized" });
          }
        } else {
          //Access menu normal example: active on Home first or after Login
          menuAccessOrderData = await auth.accessOrderForm;
          //TODO user access system
          if (
            (menuAccessOrderData[to.meta.menu.routeOrder] != undefined &&
              menuAccessOrderData[to.meta.menu.routeOrder] == "1") ||
            userId == "SYSTEM"
          ) {
            next();
          } else if ((to.name == "Login" || to.name == "Main") && auth.isAuth) {
            // console.log("Dashboard Pageee");

            next({ name: homePage });
          } else {
            // console.log("Unauthorized Lagi");
            next({ name: "unauthorized" });
          }
        }
      } else if (to.name == "Dashboard Page" && homePage != "Dashboard Page") {
        // console.log("Dashhborddd Pageee");

        next({ name: homePage });
      } else if (to.name == "Main") {
        // console.log("Dashhborddd Pageee");

        next({ name: homePage });
      } else {
        next();
      }
    }
  } else if ((to.name == "Login" || to.name == "Main") && auth.isAuth) {
    // console.log("dashboard pageee");

    next({ name: homePage });
  } else {
    next();
  }
}

router.afterEach(() => {
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
  progresses.pop()?.finish();
});

router.beforeEach(() => {
  const progress = useProgress().start();
  progresses.push(progress);
});
export default router;
