import actions from "./actions";
import getters from "./getters";
import { defineStore } from "pinia";
import { calculateWindowSize } from "@/utils/helpers";

const uiModule = defineStore("ui", {
  state: () => ({
    darkMode: false,
    navbarVariant: "navbar-light",
    sidebarSkin: "sidebar-dark-primary",
    menuSidebarCollapsed: false,
    controlSidebarCollapsed: true,
    screenSize: calculateWindowSize(window.innerWidth),
  }),
  actions,
  getters,
});

export default uiModule;
