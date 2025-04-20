import { getIconFromMenu, getRouterMenu } from "@/utils/general";
import $global from "@/utils/global";
import menu from "../menu/report-menu";
export default [
  {
    path: "front-desk",
    name: "Front Desk Report",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/report/report.vue"
      ),
    meta: {
      pageTitle: "title.report",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.report", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.reportAccessOrder.accessForm.frontDeskReport
      ),
      menu: getRouterMenu(
        menu,
        $global.reportAccessOrder.accessForm.frontDeskReport
      ),
    },
  },
  {
    path: "cashier-report",
    name: "Cashier Report",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/cashier-report/cashier-report.vue"
      ),
    meta: {
      pageTitle: "title.cashierReport",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.cashierReport", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.reportAccessOrder.accessForm.cashierReport
      ),
      menu: getRouterMenu(
        menu,
        $global.reportAccessOrder.accessForm.cashierReport
      ),
    },
  },
];
