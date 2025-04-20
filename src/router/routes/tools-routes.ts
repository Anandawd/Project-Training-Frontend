import { getIconFromMenu, getRouterMenu } from "@/utils/general";
import $global from "@/utils/global";
import menu from "../menu/tools-menu";
export default [
  //CONFIGURATIONI
  {
    path: "/configurations",
    name: "Configurations",
    component: () =>
      import(
        /*webpackChunkName: "housekeeping"*/ "@/views/pages/modules/general/tools/configurations-page/configurations-page.vue"
      ),
    meta: {
      pageTitle: "title.configurations",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
    children: [],
  },
  {
    path: "configurations/package",
    name: "Package",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/walkin-reservation-1/package/package.vue"
      ),
    meta: {
      pageTitle: "title.package",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.package", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/bed-type",
    name: "Bed Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/bed-type/bed-type.vue"
      ),
    meta: {
      pageTitle: "title.bedType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.bedType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/pabx-rate",
    name: "PABX Rate",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/pabx-rate/pabx-rate.vue"
      ),
    meta: {
      pageTitle: "title.pabxRate",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.pabxRate", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/room-amenities",
    name: "Room Amenities",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-amenities/room-amenities.vue"
      ),
    meta: {
      pageTitle: "title.roomAmenities",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomAmenities", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/guest-type",
    name: "Guest Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/guest-type/guest-type.vue"
      ),
    meta: {
      pageTitle: "title.guestType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.guestType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/member-point-type",
    name: "Member Point Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/member-point-type/member-point-type.vue"
      ),
    meta: {
      pageTitle: "title.memberPointType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.memberPointType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/guest-title",
    name: "Guest Title",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/guest-title/guest-title.vue"
      ),
    meta: {
      pageTitle: "title.guestTitle",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.guestTitle", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/guest-type",
    name: "Guest Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/guest-type/guest-type.vue"
      ),
    meta: {
      pageTitle: "title.guestType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.guestType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/member-point-type",
    name: "Member Point Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/member-point-type/member-point-type.vue"
      ),
    meta: {
      pageTitle: "title.memberPointType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.memberPointType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/guest-title",
    name: "Guest Title",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/guest-title/guest-title.vue"
      ),
    meta: {
      pageTitle: "title.guestTitle",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.guestTitle", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/pabx-rate",
    name: "PABX Rate",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/pabx-rate/pabx-rate.vue"
      ),
    meta: {
      pageTitle: "title.pabxRate",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.pabxRate", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/room-amenities",
    name: "Room Amenities",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-amenities/room-amenities.vue"
      ),
    meta: {
      pageTitle: "title.roomAmenities",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomAmenities", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/room-type",
    name: "Room Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-type/room-type.vue"
      ),
    meta: {
      pageTitle: "title.roomType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/department",
    name: "Department",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/department/department.vue"
      ),
    meta: {
      pageTitle: "title.department",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.department", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  // {
  //   path: "configurations/department2",
  //   name: "Department2",
  //   component: () =>
  //     import(
  //       /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/department2/department2.vue"
  //     ),
  //   meta: {
  //
  //     pageTitle: "title.department2",
  //     breadcrumb: [
  //       { title: "title.home", url: "/" },
  //       { title: "title.configuration", url: "/configurations" },
  //       { title: "title.department2", active: true },
  //     ],
  //  menu: menu.find((val) => val.path == "room-type-availability"),
  //   },
  // },
  {
    path: "configurations/sub-department",
    name: "Sub Department",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sub-department/sub-department.vue"
      ),
    meta: {
      pageTitle: "title.subDepartment",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.subDepartment", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/tax-and-service",
    name: "Tax Adn Service",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/tax-and-service/tax-and-service.vue"
      ),
    meta: {
      pageTitle: "title.taxAndService",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.taxAndService", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/account-sub-group",
    name: "Account Sub Group",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/account-sub-group/account-sub-group.vue"
      ),
    meta: {
      pageTitle: "title.accountSubGroup",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.accountSubGroup", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/room-boy",
    name: "Room Boy",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-boy/room-boy.vue"
      ),
    meta: {
      pageTitle: "title.roomBoy",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomBoy", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/room-unavailable-reason",
    name: "Room Unavailable Reason",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-unavailable-reason/room-unavailable-reason.vue"
      ),
    meta: {
      pageTitle: "title.roomUnavailableReason",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomUnavailableReason", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/owner-list",
    name: "Owner List",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/owner-list/owner-list.vue"
      ),
    meta: {
      pageTitle: "title.ownerList",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.ownerList", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/journal-account",
    name: "Journal Account",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/journal-account/journal-account.vue"
      ),
    meta: {
      pageTitle: "title.journalAccount",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.journalAccount", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/journal-account-sub-group",
    name: "Journal Account Sub Group",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/journal-account-sub-group/journal-account-sub-group.vue"
      ),
    meta: {
      pageTitle: "title.journalAccountSubGroup",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.journalAccountSubGroup", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/journal-account-category",
    name: "Journal Account Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/journal-account-category/journal-account-category.vue"
      ),
    meta: {
      pageTitle: "title.journalAccountCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.journalAccountCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/continent",
    name: "Continent",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/continent/continent.vue"
      ),
    meta: {
      pageTitle: "title.continent",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.continent", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/country",
    name: "Country",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/country/country.vue"
      ),
    meta: {
      pageTitle: "title.country",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.country", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/state",
    name: "State",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/state/state.vue"
      ),
    meta: {
      pageTitle: "title.state",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.state", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/regency",
    name: "Regency",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/regency/regency.vue"
      ),
    meta: {
      pageTitle: "title.regency",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.regency", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/city",
    name: "City",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/city/city.vue"
      ),
    meta: {
      pageTitle: "title.city",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.city", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/nationality",
    name: "Nationality",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/nationality/nationality.vue"
      ),
    meta: {
      pageTitle: "title.nationality",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.nationality", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/language",
    name: "Language",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/language/language.vue"
      ),
    meta: {
      pageTitle: "title.language",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.language", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/id-card-type",
    name: "ID Card Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/id-card-type/id-card-type.vue"
      ),
    meta: {
      pageTitle: "title.idCardType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.idCardType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/payment-type",
    name: "Payment Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/payment-type/payment-type.vue"
      ),
    meta: {
      pageTitle: "title.paymentType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.paymentType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/market-category",
    name: "Market Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/market-category/market-category.vue"
      ),
    meta: {
      pageTitle: "title.marketCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.marketCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/market",
    name: "Market",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/market/market.vue"
      ),
    meta: {
      pageTitle: "title.market",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.market", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/booking-source",
    name: "Booking Source",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/booking-source/booking-source.vue"
      ),
    meta: {
      pageTitle: "title.bookingSource",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.bookingSource", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales",
    name: "Sales",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales/sales.vue"
      ),
    meta: {
      pageTitle: "title.sales",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.sales", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/purpose-of",
    name: "Purpose Of",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/purpose-of/purpose-of.vue"
      ),
    meta: {
      pageTitle: "title.purposeOf",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.purposeOf", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },


  {
    path: "configurations/card-bank",
    name: "Card Bank",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/card-bank/card-bank.vue"
      ),
    meta: {
      pageTitle: "title.cardBank",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.cardBank", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/card-type",
    name: "Card Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/card-type/card-type.vue"
      ),
    meta: {
      pageTitle: "title.cardType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.cardType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/loan-item",
    name: "Loan Item",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/loan-item/loan-item.vue"
      ),
    meta: {
      pageTitle: "title.loanItem",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.loanItem", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/credit-card-charge",
    name: "Credit Card Charge",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/credit-card-charge/credit-card-charge.vue"
      ),
    meta: {
      pageTitle: "title.creditCardCharge",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.creditCardCharge", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/phone-book-type",
    name: "Credir Card Charge",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/phone-book-type/phone-book-type.vue"
      ),
    meta: {
      pageTitle: "title.phoneBookType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.phoneBookType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/member-outlet-discount",
    name: "Member Outlet Discount",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/member-outlet-discount/member-outlet-discount.vue"
      ),
    meta: {
      pageTitle: "title.memberOutletDiscount",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.memberOuletDiscount", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/voucher-reason",
    name: "Voucher Reason",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/voucher-reason/voucher-reason.vue"
      ),
    meta: {
      pageTitle: "title.voucherReason",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.voucherReason", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/competitor",
    name: "Competitor",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/competitor/competitor.vue"
      ),
    meta: {
      pageTitle: "title.competitor",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.competitor", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/competitor-category",
    name: "Competitor Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/competitor-category/competitor-category.vue"
      ),
    meta: {
      pageTitle: "title.competitorCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.competitorCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/room-view",
    name: "Room View",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-view/room-view.vue"
      ),
    meta: {
      pageTitle: "title.roomView",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomView", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/account",
    name: "Account",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/account/account.vue"
      ),
    meta: {
      pageTitle: "title.account",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.account", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/room-rate-category",
    name: "room-rate-category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-rate-category/room-rate-category.vue"
      ),
    meta: {
      pageTitle: "title.roomRateCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomRateCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/room-rate-sub-category",
    name: "Room Rate Sub Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room-rate-sub-category/room-rate-sub-category.vue"
      ),
    meta: {
      pageTitle: "title.roomRateSubCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.roomRateSubCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/room",
    name: "room",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/room/room.vue"
      ),
    meta: {
      pageTitle: "title.room",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.room", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/bank-account",
    name: "Bank Account",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/bank-account/bank-account.vue"
      ),
    meta: {
      pageTitle: "title.bankAccount",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.bankAccount", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/company-type",
    name: "Company Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/company-type/company-type.vue"
      ),
    meta: {
      pageTitle: "title.companyType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.companyType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/member",
    name: "Member",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/member/member.vue"
      ),
    meta: {
      pageTitle: "title.member",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.member", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/company",
    name: "Company",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/company/company.vue"
      ),
    meta: {
      pageTitle: "title.company",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.company", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/currency-nominal",
    name: "Currency Nominal",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/currency-nominal/currency-nominal.vue"
      ),
    meta: {
      pageTitle: "title.currencyNominal",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.currencyNominal", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/currency",
    name: "Currency",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/currency/currency.vue"
      ),
    meta: {
      pageTitle: "title.currency",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.currency", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales-segment",
    name: "Sales Segment",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales-segment/sales-segment.vue"
      ),
    meta: {
      pageTitle: "title.salesSegment",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.salesSegment", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales-salary",
    name: "Sales Salary",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales-salary/sales-salary.vue"
      ),
    meta: {
      pageTitle: "title.salesSalary",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.salesSalary", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales-source",
    name: "Sales Source",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales-source/sales-source.vue"
      ),
    meta: {
      pageTitle: "title.salesSource",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.salesSource", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales-task-action",
    name: "Sales Task Action",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales-task-action/sales-task-action.vue"
      ),
    meta: {
      pageTitle: "title.salesTaskAction",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.salesTaskAction", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales-task-repeat",
    name: "Sales Task Repeat",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales-task-repeat/sales-task-repeat.vue"
      ),
    meta: {
      pageTitle: "title.salesTaskRepeat",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.salesTaskRepeat", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/sales-task-tag",
    name: "Sales Task Tag",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/sales-task-tag/sales-task-tag.vue"
      ),
    meta: {
      pageTitle: "title.salesTaskTag",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.salesTaskTag", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/room-rate",
    name: "Room Rate",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/walkin-reservation-1/room-rate/room-rate.vue"
      ),
    meta: {
      pageTitle: "title.roomRate",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.roomRate", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/product-category",
    name: "Product Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/product-category/product-category.vue"
      ),
    meta: {
      pageTitle: "title.productCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.productCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/outlet",
    name: "Outlet",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/outlet/outlet.vue"
      ),
    meta: {
      pageTitle: "title.outlet",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.outlet", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/tenan",
    name: "Tenan",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/tenan/tenan.vue"
      ),
    meta: {
      pageTitle: "title.tenan",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.tenan", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/product-group",
    name: "Product Group",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/product-group/product-group.vue"
      ),
    meta: {
      pageTitle: "title.productGroup",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.productGroup", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/product",
    name: "Product",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/product/product.vue"
      ),
    meta: {
      pageTitle: "title.product",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.product", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/spa-room",
    name: "SPA Room",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/spa-room/spa-room.vue"
      ),
    meta: {
      pageTitle: "title.spaRoom",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.spaRoom", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/table",
    name: "Table",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/table/table.vue"
      ),
    meta: {
      pageTitle: "title.table",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.table", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/table-type",
    name: "Table Type",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/table-type/table-type.vue"
      ),
    meta: {
      pageTitle: "title.tableType",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.tableType", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/waitress",
    name: "Waitress",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/waitress/waitress.vue"
      ),
    meta: {
      pageTitle: "title.waitress",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.waitress", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/printer",
    name: "Printer",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/printer/printer.vue"
      ),
    meta: {
      pageTitle: "title.printer",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.printer", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/discount-limit",
    name: "Discount Limit",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/discount-limit/discount-limit.vue"
      ),
    meta: {
      pageTitle: "title.discountLimit",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.discountLimit", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/pos-market",
    name: "POS Market",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/pos-market/pos-market.vue"
      ),
    meta: {
      pageTitle: "title.posMarket",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.posMarket", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/user-group-outlet",
    name: "User Group Outlet",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/user-group-outlet/user-group-outlet.vue"
      ),
    meta: {
      pageTitle: "title.userGroupOutlet",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.userGroupOutlet", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/pos-payment-group",
    name: "POS Payment Group",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/pos-payment-group/pos-payment-group.vue"
      ),
    meta: {
      pageTitle: "title.posPaymentGroup",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.posPaymentGroup", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/shipping-address",
    name: "Shipping Address",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/shipping-address/shipping-address.vue"
      ),
    meta: {
      pageTitle: "title.shippingAddress",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.shippingAddress", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/uom",
    name: "Unit of Measurement",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/uom/uom.vue"
      ),
    meta: {
      pageTitle: "title.unitOfMeasurement",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.unitOfMeasurement", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/store",
    name: "Store",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/store/store.vue"
      ),
    meta: {
      pageTitle: "title.store",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.store", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/item-category",
    name: "Item Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/item-category/item-category.vue"
      ),
    meta: {
      pageTitle: "title.itemCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.itemCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/item",
    name: "Inventory Item",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/item/item.vue"
      ),
    meta: {
      pageTitle: "title.inventoryItem",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.inventoryItem", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/item-group",
    name: "Item Group",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/item-group/item-group.vue"
      ),
    meta: {
      pageTitle: "title.itemGroup",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.itemGroup", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  {
    path: "configurations/return-stock-reason",
    name: "Return Stock Reason",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/return-stock-reason/return-stock-reason.vue"
      ),
    meta: {
      pageTitle: "title.returnStockReason",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.returnStockReason", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/market-list",
    name: "Market List",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/market-list/market-list.vue"
      ),
    meta: {
      pageTitle: "title.marketList",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.marketList", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/fa-manufacture",
    name: "Manufacture",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/fa-manufacture/fa-manufacture.vue"
      ),
    meta: {
      pageTitle: "title.manufacture",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.manufacture", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/fa-location",
    name: "Location",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/fa-location/fa-location.vue"
      ),
    meta: {
      pageTitle: "title.location",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.location", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/fa-item-category",
    name: "FA Item Category",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/fa-item-category/fa-item-category.vue"
      ),
    meta: {
      pageTitle: "title.faItemCategory",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.faItemCategory", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/fa-item",
    name: "FA Item",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/fa-item/fa-item.vue"
      ),
    meta: {
      pageTitle: "title.faItem",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configuration", url: "/configurations" },
        { title: "title.faItem", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/venue-group",
    name: "Venue Group",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/venue-group/venue-group.vue"
      ),
    meta: {
      pageTitle: "title.venueGroup",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.venueGroup", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/venue",
    name: "Venue",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/venue/venue.vue"
      ),
    meta: {
      pageTitle: "title.venue",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.venue", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/venue-combine",
    name: "Venue Combine",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/venue-combine/venue-combine.vue"
      ),
    meta: {
      pageTitle: "title.venueCombine",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.venueCombine", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/seating-plan",
    name: "Seating Plan",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/seating-plan/seating-plan.vue"
      ),
    meta: {
      pageTitle: "title.seatingPlan",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.seatingPlan", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/theme",
    name: "Theme",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/theme/theme.vue"
      ),
    meta: {
      pageTitle: "title.theme",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.theme", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/layout",
    name: "Layout",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/layout/layout.vue"
      ),
    meta: {
      pageTitle: "title.layout",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.layout", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },

  {
    path: "configurations/notif-third-party-template",
    name: "Notif Third Party Template",
    component: () =>
      import(
        /*webpackChunkName: "sub-department"*/ "@/views/pages/modules/general/tools/configurations/notif-tp-template/notif-tp-template.vue"
      ),
    meta: {
      pageTitle: "title.notifThirdPartyTemplate",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.configurations", url: "/configurations" },
        { title: "title.notifThirdPartyTemplate", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.configuration
      ),
    },
  },
  //END CONFIGURATION

  {
    path: "/user-setting",
    name: "User Setting",
    component: () =>
      import(
        /*webpackChunkName: "user-setting"*/ "@/views/pages/modules/general/tools/user-setting/user-setting.vue"
      ),
    meta: {
      pageTitle: "title.userSetting",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.userSetting", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.userSetting
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.userSetting
      ),
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(
        /*webpackChunkName: "settings"*/ "@/views/pages/modules/general/tools/settings/settings.vue"
      ),
    meta: {
      pageTitle: "title.settings",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.settings", active: true },
      ],
      icon: getIconFromMenu(menu, $global.toolsAccessOrder.accessForm.setting),
      menu: getRouterMenu(menu, $global.toolsAccessOrder.accessForm.setting),
    },
  },
  {
    path: "/user-activity-log",
    name: "User Activity Log",
    component: () =>
      import(
        /*webpackChunkName: "user-activity"*/ "@/views/pages/modules/general/tools/user-activity-log/user-activity-log.vue"
      ),
    meta: {
      pageTitle: "title.userActivityLog",
      breadcrumb: [
        { title: "title.home", url: "/" },
        { title: "title.userActivityLog", active: true },
      ],
      icon: getIconFromMenu(
        menu,
        $global.toolsAccessOrder.accessForm.userActivityLog
      ),
      menu: getRouterMenu(
        menu,
        $global.toolsAccessOrder.accessForm.userActivityLog
      ),
    },
  },
];
