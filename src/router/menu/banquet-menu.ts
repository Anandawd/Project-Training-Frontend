import $global from "@/utils/global";
const accessMenuOrder = $global.banquetAccessOrder.accessForm;
const mainPath = "/banquet";
export default [
  {
    name: "labels.transaction",
    isParent: true,
    children: [
      {
        name: "labels.booking",
        componentName: "booking",
        path: mainPath + "/booking",
        routeOrder: accessMenuOrder.booking,
        cIcon: "booking",
        requiresAuth: true,
      },
      {
        name: "labels.banquetInProgress",
        componentName: "banquet_in_progress",
        path: mainPath + "/banquet-in-progress",
        routeOrder: accessMenuOrder.banquetInProgress,
        cIcon: "banquet_in_progress",
        requiresAuth: true,
      },
      {
        name: "labels.banquetView",
        componentName: "banquet_view",
        path: mainPath + "/banquet-view",
        routeOrder: accessMenuOrder.banquetView,
        cIcon: "banquet_view",
        requiresAuth: true,
      },
      {
        name: "labels.deskFolio",
        componentName: "desk_folio",
        path: mainPath + "/desk-folio",
        routeOrder: accessMenuOrder.deskFolio,
        cIcon: "desk_folio",
        hidden: true,
        requiresAuth: true,
      },
      // {
      //   name: "labels.folioHistory",
      //   componentName: "folio_history",
      //   path: mainPath + "/folio-history",
      //   routeOrder: accessMenuOrder.folioHistory,
      //   cIcon: "folio_history",
      //   requiresAuth: true,
      // },
    ],
  },
];
