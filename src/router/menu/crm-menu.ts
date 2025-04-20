import $global from "@/utils/global";
const accessMenuOrder = $global.crmAccessOrder.accessForm;
const mainPath = "/crm";
export default [
  {
    name: "labels.salesActivityDashboard",
    path: mainPath + "/sales-activity-dashboard",
    componentName: "salesActivityDashboard",
    cIcon: "sales_activity_dashboard",
    routeOrder: accessMenuOrder.salesActivityDashboard,
    requiresAuth: true,
  },
  {
    name: "labels.proposalAndTaskCalendar",
    path: mainPath + "/proposal-and-task-calendar",
    componentName: "proposal_and_task_calendar",
    cIcon: "proposal_task_calendar",
    routeOrder: accessMenuOrder.proposalAndTaskCalendar,
    requiresAuth: true,
  },
  {
    name: "labels.salesActivity",
    path: mainPath + "/sales-activity",
    componentName: "sales-activity",
    cIcon: "sales_activity",
    routeOrder: accessMenuOrder.salesActivity,
    requiresAuth: true,
  },
  {
    name: "labels.activityLog",
    path: mainPath + "/activity-log",
    componentName: "activity-log",
    cIcon: "activity_log",
    routeOrder: accessMenuOrder.activityLog,
    requiresAuth: true,
  },
  {
    name: "labels.phoneBook",
    path: mainPath + "/phone-book",
    componentName: "phone_book",
    cIcon: "phone_book",
    routeOrder: accessMenuOrder.phoneBook,
    requiresAuth: true,
  },
  {
    name: "labels.member",
    path: "/tools/configurations/member",
    componentName: "member",
    cIcon: "member",
    routeOrder: accessMenuOrder.member,
    requiresAuth: true,
  },
  {
    name: "labels.voucher",
    path: mainPath + "/voucher",
    componentName: "voucher",
    cIcon: "voucher",
    routeOrder: accessMenuOrder.voucher,
    requiresAuth: true,
  },
  {
    name: "labels.guestPortal",
    isParent: true,
    children: [
      {
        name: "labels.complaint",
        path: mainPath + "/complaint",
        componentName: "complaint",
        cIcon: "complaint",
        routeOrder: accessMenuOrder.complaint,
        requiresAuth: true,
      },
      {
        name: "labels.feedback",
        path: mainPath + "/feedback",
        componentName: "feedback",
        cIcon: "feedback",
        routeOrder: accessMenuOrder.feedback,
        requiresAuth: true,
      },
    ],
  },
];
