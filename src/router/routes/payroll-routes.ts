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
    path: "employee-type",
    name: "EmployeeType",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/employee/configurations/employee-type/employee-type.vue"
      ),
    meta: {
      pageTitle: "title.employeeType",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.employee", url: "/employee" },
        { title: "title.employeeType", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "employee/detail/:id?",
    name: "EmployeeDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/employee/employee-detail/employee-detail.vue"
      ),
    meta: {
      pageTitle: "title.employeeDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.employee", url: "/employee" },
        { title: "title.detail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "salary-adjustment",
    name: "SalaryAdjustment",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/salary-adjustment/salary-adjustment.vue"
      ),
    meta: {
      pageTitle: "title.salaryAdjustment",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.salaryAdjustment", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "adjustment-reason",
    name: "AdjustmentReason",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/salary-adjustment/configurations/adjustment-reason/adjustment-reason.vue"
      ),
    meta: {
      pageTitle: "title.adjustmentReason",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.salaryAdjustment", url: "/payroll/salary-adjustment" },
        { title: "title.adjustmentReason", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "legal-document",
    name: "LegalDocument",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/employee-document/employee-document.vue"
      ),
    meta: {
      pageTitle: "title.legalDocument",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.management" },
        { title: "title.legalDocument", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "document-type",
    name: "DocumentType",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/employee-document/configurations/document-type/document-type.vue"
      ),
    meta: {
      pageTitle: "title.documentType",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.legalDocument", url: "/payroll/legal-document" },
        { title: "title.documentType", active: true },
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
    path: "leave",
    name: "Leave",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/leave/leave.vue"
      ),
    meta: {
      pageTitle: "title.leave",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.leave", active: true },
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
  // configurations
  {
    path: "schedule",
    name: "ScheduleTemplate",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/work-schedule/configurations/schedule/schedule.vue"
      ),
    meta: {
      pageTitle: "title.schedule",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.schedule", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "shift",
    name: "Shift",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/work-schedule/configurations/shift/shift.vue"
      ),
    meta: {
      pageTitle: "title.shift",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.shift", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "shift-category",
    name: "ShiftCategory",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/work-schedule/configurations/shift-category/shift-category.vue"
      ),
    meta: {
      pageTitle: "title.shiftCategory",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.attendance" },
        { title: "title.shiftCategory", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "periods",
    name: "Periods",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-periods/payroll-periods.vue"
      ),
    meta: {
      pageTitle: "title.periods",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.periods", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "periods/detail/:code?",
    name: "PeriodDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-periods/payroll-period-detail/payroll-period-detail.vue"
      ),
    meta: {
      pageTitle: "title.periodsDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.periods", url: "/payroll/periods" },
        { title: "title.periodsDetail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "periods/detail/:periodCode/:employeeId",
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
        { title: "title.payroll" },
        { title: "title.periods", url: "/payroll/periods" },
        {
          title: "title.periodsDetail",
          url: (route: any) =>
            `/payroll/periods/detail/${route.params.periodCode}`,
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
    path: "component-category",
    name: "ComponentCategory",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-component/configurations/component-category/component-category.vue"
      ),
    meta: {
      pageTitle: "title.componentCategory",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        {
          title: "title.payrollComponents",
          url: "/payroll/payroll-components",
        },
        { title: "title.componentCategory", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "approvals",
    name: "PayrollApprovals",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-approvals/payroll-approvals.vue"
      ),
    meta: {
      pageTitle: "title.approvals",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.approvals", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "disbursement",
    name: "PayrollDisbursement",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-disbursement/payroll-disbursement.vue"
      ),
    meta: {
      pageTitle: "title.disbursement",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll" },
        { title: "title.disbursement", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "disbursement/detail/:id?",
    name: "DisbursementDetail",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-disbursement/payroll-disbursement-detail/payroll-disbursement-detail.vue"
      ),
    meta: {
      pageTitle: "title.disbursementDetail",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll", url: "/payroll/disbursement" },
        {
          title: "title.disbursement",
          url: "/payroll/disbursement",
        },
        { title: "title.DisbursementDetail", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
  {
    path: "disbursement/process/:id?",
    name: "DisbursementProcess",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/payroll/payroll-disbursement/payroll-disbursement-process/payroll-disbursement-process.vue"
      ),
    meta: {
      pageTitle: "title.disbursementProcess",
      icon: getIconFromMenu(menu, 1),
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.payroll", url: "/payroll/disbursement" },
        {
          title: "title.disbursement",
          url: "/payroll/disbursement",
        },
        { title: "title.disbursementProcess", active: true },
      ],
      menu: getRouterMenu(menu, 1),
    },
  },
];
