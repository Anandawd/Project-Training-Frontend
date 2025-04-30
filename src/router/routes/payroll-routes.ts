import { getIconFromMenu, getRouterMenu } from "@/utils/general";
import menu from "../menu/payroll-menu";
export default [
  {
    path: "training",
    name: "Training Payroll",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/training/training.vue"
      ),
    meta: {
      pageTitle: "title.training",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.training", active: true },
      ],

      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "employee",
    name: "Employee",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/employee/employee.vue"
      ),
    meta: {
      pageTitle: "title.employee",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.employee", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "salary-history",
    name: "Salary History",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/salary-history/salary-history.vue"
      ),
    meta: {
      pageTitle: "title.salaryHistory",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.salaryHistory", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "employee-document",
    name: "Employee Document",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/training/training.vue"
      ),
    meta: {
      pageTitle: "title.employeeDocument",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.employeeDocument", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "organization",
    name: "Organization",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/organization/organization.vue"
      ),
    meta: {
      pageTitle: "title.organization",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.organization", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "attendance",
    name: "Attendance",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/attendance/attendance.vue"
      ),
    meta: {
      pageTitle: "title.attendance",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.attendance", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "fingerprint-enrollment",
    name: "FingerprintEnrollment",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/fingerprint-enrollment/fingerprint-enrollment.vue"
      ),
    meta: {
      pageTitle: "title.fingerprintEnrollment",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.fingerprintEnrollment", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "leave-requests",
    name: "LeaveRequests",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/leave-requests/leave-requests.vue"
      ),
    meta: {
      pageTitle: "title.leaveRequests",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.leaveRequests", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "leave-approvals",
    name: "LeaveApprovals",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/leave-approvals/leave-approvals.vue"
      ),
    meta: {
      pageTitle: "title.leaveApprovals",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.leaveApprovals", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "work-schedule",
    name: "WorkSchedule",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/work-schedule/work-schedule.vue"
      ),
    meta: {
      pageTitle: "title.workSchedule",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.workSchedule", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "holiday-calender",
    name: "HolidayCalender",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/holiday-calender/holiday-calender.vue"
      ),
    meta: {
      pageTitle: "title.holidayCalender",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.holidayCalender", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-periods",
    name: "PayrollPeriods",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-periods/payroll-periods.vue"
      ),
    meta: {
      pageTitle: "title.payrollPeriods",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollPeriods", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-periods/detail/:id?",
    name: "PeriodDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-periods/payroll-period-detail/payroll-period-detail.vue"
      ),
    meta: {
      pageTitle: "title.payrollPeriodsDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll", url: "/payroll/payroll-periods" },
        { title: "title.payrollPeriods", url: "/payroll/payroll-periods" },
        { title: "title.payrollPeriodsDetail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-periods/employee/:periodId/:employeeId",
    name: "EmployeePayrollDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-periods/payroll-period-detail/employee-payroll-detail/employee-payroll-detail.vue"
      ),
    meta: {
      pageTitle: "title.employeePayrollDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll", url: "/payroll/payroll-periods" },
        { title: "title.payrollPeriods", url: "/payroll/payroll-periods" },
        {
          title: "title.payrollPeriodsDetail",
          url: (route: any) =>
            `/payroll/payroll-periods/detail/${route.params.periodId}`,
        },
        { title: "title.employeePayrollDetail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-components",
    name: "PayrollComponents",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-component/payroll-component.vue"
      ),
    meta: {
      pageTitle: "title.payrollComponents",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollComponents", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-approvals",
    name: "PayrollApprovals",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-approvals/payroll-approvals.vue"
      ),
    meta: {
      pageTitle: "title.payrollApprovals",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollApprovals", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-disbursement",
    name: "PayrollDisbursement",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-periods/payroll-periods.vue"
      ),
    meta: {
      pageTitle: "title.payrollDisbursement",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollDisbursement", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
];
