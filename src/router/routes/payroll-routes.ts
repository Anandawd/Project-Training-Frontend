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
    path: "payroll-period",
    name: "Payroll Period",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-period/payroll-period.vue"
      ),
    meta: {
      pageTitle: "title.payrollPeriod",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollPeriod", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-period/detail/:id?",
    name: "PeriodDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-period/payroll-period-detail/payroll-period-detail.vue"
      ),
    meta: {
      pageTitle: "title.payrollPeriodDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll", url: "/payroll/payroll-period" },
        { title: "title.payrollPeriod", url: "/payroll/payroll-period" },
        { title: "title.payrollPeriodDetail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-period/employee/:periodId/:employeeId",
    name: "EmployeePayrollDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-period/payroll-period-detail/employee-payroll-detail/employee-payroll-detail.vue"
      ),
    meta: {
      pageTitle: "title.employeePayrollDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll", url: "/payroll/payroll-period" },
        { title: "title.payrollPeriod", url: "/payroll/payroll-period" },
        {
          title: "title.payrollPeriodDetail",
          url: (route: any) =>
            `/payroll/payroll-period/detail/${route.params.periodId}`,
        },
        { title: "title.employeePayrollDetail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-component",
    name: "Payroll Component",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-component/payroll-component.vue"
      ),
    meta: {
      pageTitle: "title.payrollComponent",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollComponent", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-approval",
    name: "Payroll Approval",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-period/payroll-period.vue"
      ),
    meta: {
      pageTitle: "title.payrollApproval",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.payrollApproval", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "payroll-disbursement",
    name: "Payroll Disbursement",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-period/payroll-period.vue"
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
