import getters from "./getters";
import { defineStore } from "pinia";

const activeMenuModule = defineStore("activeMenu", {
  state: () => ({
    menu: [
      {
        name: "dashboard",
        label: "labels.dashboard",
        path: "/dashboard",
      },
    ],
    maxCachedMenu: 10,
  }),
  actions: {
    setActiveMenu(itemMenu: any) {
      if (!itemMenu) return;
      const label = itemMenu.name;
      const index = this.menu.findIndex((val) => val.label == label);
      if (index > -1) {
        return;
      }
      this.menu.push({
        name: itemMenu.componentName ?? "",
        label: label,
        path: itemMenu.path,
      });
      if (this.menu.length > this.maxCachedMenu) {
        this.menu.shift();
      }
    },
    removeActiveMenu(menu: any) {
      if (menu.label == "labels.dashboard") return;
      const label = menu.label;
      const index = this.menu.findIndex((val) => val.label == label);
      if (index > -1) {
        this.menu.splice(index, 1);
      }
    },
  },
  getters,
});

export default activeMenuModule;
