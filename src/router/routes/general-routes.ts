import { getIconFromMenu, getRouterMenu } from "@/utils/general";
import $global from "@/utils/global";
import menu from "../menu";
export default [
  {
    path: "dashboard",
    name: "Dashboard-Page",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/dashboard/dashboard.vue"
      ),
    meta: {
      icon: getIconFromMenu(menu, $global.accessGeneralOrder.dashboard),
      pageTitle: "title.dashboard",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.dashboard", active: true },
      ],
      menu: getRouterMenu(menu, $global.accessGeneralOrder.dashboard),
    },
  },
];
