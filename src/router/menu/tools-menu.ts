import $global from "@/utils/global";
const accessMenuOrder = $global.toolsAccessOrder.accessForm;
export default [
  {
    name: "labels.configuration",
    path: "/configurations",
    cIcon: "configuration",
    componentName: "configurations",
    routeOrder: accessMenuOrder.configuration,
    requiresAuth: true,
  },
  {
    name: "labels.settings",
    path: "/settings",
    cIcon: "setting",
    componentName: "settings",
    routeOrder: accessMenuOrder.setting,
    requiresAuth: true,
  },
  {
    name: "labels.userSetting",
    path: "/user-setting",
    cIcon: "user_setting",
    componentName: "user-setting",
    routeOrder: accessMenuOrder.userSetting,
    requiresAuth: true,
  },
  {
    name: "labels.userActivityLog",
    path: "/user-activity-log",
    cIcon: "user_activity_log",
    componentName: "user-activity-log",
    routeOrder: accessMenuOrder.userActivityLog,
    requiresAuth: true,
  },
];
