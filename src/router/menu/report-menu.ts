import $global from "@/utils/global";
export default [
  {
    name: "labels.cashierReport",
    path: "/report/cashier-report",
    cIcon: "cashier_report",
    componentName: "cashier_report",
    routeOrder: $global.reportAccessOrder.accessForm.cashierReport,
    requiresAuth: true,
  },
  {
    name: "labels.report",
    path: "/report/front-desk",
    cIcon: "report",
    componentName: "report_page",
    routeOrder: $global.reportAccessOrder.accessForm.frontDeskReport,
    requiresAuth: true,
  },
];
