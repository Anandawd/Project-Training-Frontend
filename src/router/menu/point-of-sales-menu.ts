import $global from "@/utils/global";
const accessMenuOrder = $global.pointOfSalesAccessOrder.accessForm;
const mainPath = "/point-of-sales";
export default [
  {
    name: "labels.transactionTerminal",
    path: mainPath + "/transaction-terminal",
    cIcon: "transaction_terminal",
    componentName: "transaction_terminal",
    routeOrder: accessMenuOrder.transactionTerminal,
    requiresAuth: true,
  },
  {
    name: "labels.tableView",
    path: mainPath + "/table-view",
    cIcon: "table_view",
    componentName: "table_view",
    routeOrder: accessMenuOrder.tableView,
    requiresAuth: true,
  },
  {
    name: "labels.closedTransaction",
    path: mainPath + "/closed-transaction",
    cIcon: "closed_transaction",
    componentName: "closed_transaction",
    routeOrder: accessMenuOrder.closedTransaction,
    requiresAuth: true,
  },
  {
    name: "labels.breakfastControl",
    path: mainPath + "/breakfast-control",
    componentName: "breakfast_control",
    cIcon: "breakfast_control",
    routeOrder: accessMenuOrder.breakfastControl,
    requiresAuth: true,
  },
  {
    name: "labels.deskFolio",
    path: mainPath + "/desk-folio",
    componentName: "desk_folio",
    cIcon: "desk_folio",
    routeOrder: accessMenuOrder.deskFolio,
    requiresAuth: true,
  },
  {
    name: "labels.folioHistory",
    path: mainPath + "/folio-history",
    componentName: "folio_history",
    cIcon: "folio_history",
    routeOrder: accessMenuOrder.folioHistory,
    requiresAuth: true,
  },
  {
    name: "labels.dayendClose",
    path: mainPath + "/dayend-close",
    componentName: "dayend_close",
    cIcon: "dayend_close",
    routeOrder: accessMenuOrder.dayendClose,
    requiresAuth: true,
  },
];
