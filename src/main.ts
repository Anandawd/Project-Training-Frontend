import { createPinia } from "pinia";
import { createApp, h } from "vue";
import App from "./app/app.vue";
import router from "./router";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faGooglePlus } from "@fortawesome/free-brands-svg-icons";
import {
  faAdjust,
  faArrowCircleRight,
  faArrowRight,
  faBalanceScale,
  faDivide,
  faEnvelope,
  faFileInvoiceDollar,
  faHardHat,
  faLock,
  faMedkit,
  faNotesMedical,
  faPercent,
  faPizzaSlice,
  faPlay,
  faPuzzlePiece,
  faSave,
  faUniversity,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
// import { Gatekeeper } from "gatekeeper-client-sdk";
import ContextMenu from "@imengyu/vue3-context-menu";
import { createI18n } from "vue-i18n";
import Toast, { PluginOptions } from "vue-toastification";
import { VueWindowSizePlugin } from "vue-window-size/option-api";

import { version } from "../package.json";
import GlobalComponent from "./globalComponents";

import { Vue3ProgressPlugin } from "@marcoschulte/vue3-progress";
import "ag-grid-enterprise";
import { LicenseManager } from "ag-grid-enterprise";
import "bootstrap";
import { vBToggle } from "bootstrap-vue-3";
import { LoadingPlugin } from "vue-loading-overlay";
import "./components/scss/core.scss";
import "./index.scss";
import en from "./translation/en.json";
import id from "./translation/id.json";
import vn from "./translation/vn.json";
import $global from "./utils/global";

LicenseManager.setLicenseKey(
  "Using_this_{AG_Grid}_Enterprise_key_{AG-077634}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{PT._Cakra_Media_Data}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{21_February_2026}____[v3]_[01]_MTc3MTYzMjAwMDAwMA==f0a97662461d9d71956c7edfd5c61c44"
);

// import PrimeVue from "primevue/config";
// import "primevue/resources/themes/aura-light-green/theme.css";
// import VueSocketIO from "vue-3-socket.io";
// import socketio from "socket.io-client";
// // ws = new WebSocket("ws://localhost:9000");
// const socket = socketio('ws://localhost:9000', {
//   upgrade: true,
//   path: "/ws/",

//   // query: {
//   // },
//   transports: ['websocket'],
//   extraHeaders: {
//     'token': localStorage.getItem('token'),
//     Connection: 'Upgrade',
//     Upgrade: 'websocket'
//   },
//   transportOptions: {
//     polling: {
//       extraHeaders: {
//         'token': localStorage.getItem('token'),
//         // 'Upgrade': 'websocket',
//         // 'Connection': 'upgrade',
//         // "Sec-WebSocket-Key": "x3JJHMbDL1EzLkh9GBhXDw==",
//         // "Sec-WebSocket-Protocol": "chat,superchat",
//         // "Sec-WebSocket-Version": 13

//       }
//     }
//   }
// });

// const vSocketIo = new VueSocketIO({
//   debug: true,
//   connection: socket,
// });
library.add(
  faLock,
  faEnvelope,
  faFacebook,
  faGooglePlus,
  faFileInvoiceDollar,
  faNotesMedical,
  faUserShield,
  faMedkit,
  faHardHat,
  faSave,
  faArrowCircleRight,
  faPlay,
  faPercent,
  faBalanceScale,
  faDivide,
  faPuzzlePiece,
  faAdjust,
  faPizzaSlice,
  faArrowRight,
  faUniversity
);

// Gatekeeper.initialize("de378d9c-38c8-42c1-b961-9e4fa92d6a5e");

const clickOutside = {
  beforeMount: (
    el: {
      clickOutsideEvent: {
        (event: any): void;
        (this: Document, ev: MouseEvent): any;
      };
      contains: (arg0: any) => any;
    },
    binding: { value: () => void }
  ) => {
    el.clickOutsideEvent = (event: { target: any }) => {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: (el: {
    clickOutsideEvent: (this: Document, ev: MouseEvent) => any;
  }) => {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

const options: PluginOptions = {
  timeout: 2500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};
export const i18n = createI18n({
  locale: "en",
  legacy: false,
  messages: { en, id, vn },
  fallbackLocale: "en",
});

const loadingOptions = {
  color: "#0d6efd",
  opacity: 0,
  loader: "dots", //spinner or dots or bars
};

const pinia = createPinia();

const app = createApp({
  render: () => h(App),
});
app.directive("click-outside", {
  mounted(el, binding, vnode) {
    el.clickOutsideEvent = function (event: any) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});
//Check version
const versionX = localStorage.getItem("version");
if (versionX != version) {
  localStorage.clear();
  localStorage.setItem("version", version);
}
app.config.globalProperties.$global = $global;
// app.use(PiniaVuePlugin);
app.use(pinia);
new GlobalComponent(app);
app.use(ContextMenu);
app.use(store);
app.use(router);
app.use(VueWindowSizePlugin);
app.directive("b-toggle", vBToggle);
app.use(Toast, options);
app.use(i18n);
app.use(LoadingPlugin, loadingOptions);
app.use(Vue3ProgressPlugin);
app.mount("#app");

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log(
//           "Service Worker registered with scope:",
//           registration.scope
//         );
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed:", error);
//       });
//   });
// }
