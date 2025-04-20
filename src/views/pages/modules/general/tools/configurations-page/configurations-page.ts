import { Options, Vue } from "vue-class-component";
@Options({
  name: "configurations",
  components: {},
})
export default class ConfigurationPage extends Vue {
  public filterText: string = "";
  public displayItems: any[] = null;
  public isExpanded: boolean = false;

  public configurationItems: any[] = [
    {
      label: "title.general",
      children: [
        {
          name: "Regency",
          label: "title.regency",
          icon: "fas fa-solid fa-list",
          path: "tools/configurations/regency",
        },
        {
          name: "City",
          label: "title.city",
          icon: "fas fa-address-book",
          path: "tools/configurations/city",
        },
        {
          name: "State",
          label: "title.state",
          icon: "fas fa-address-book",
          path: "tools/configurations/state",
        },
        {
          name: "Nationality",
          label: "title.nationality",
          icon: "fas fa-sharp  fa-solid fa-flag ",
          path: "tools/configurations/nationality",
        },
        {
          name: "Country",
          label: "title.country",
          icon: "fas fa-address-book",
          path: "tools/configurations/country",
        },
        {
          name: "Language",
          label: "title.language",
          icon: "fas fa-address-book",
          path: "tools/configurations/language",
        },
        {
          name: "CardBank",
          label: "title.cardBank",
          icon: "fas fa-solid fa-credit-card",
          path: "tools/configurations/card-bank",
        },
        {
          name: "GuestTitle",
          label: "title.guestTitle",
          icon: "fas fa-address-book",
          path: "tools/configurations/guest-title",
        },
      ],
    },
    {
      label: "title.frontDesk",
      children: [
        {
          name: "Room Type",
          label: "title.roomType",
          icon: "fas fa-tools",
          path: "tools/configurations/room-type",
        },
        {
          name: "Room",
          label: "title.room",
          icon: "fas fa-solid fa-door-open",
          path: "tools/configurations/room",
        },
        {
          name: "Booking Source",
          label: "title.bookingSource",
          icon: "fas fa-address-book",
          path: "tools/configurations/booking-source",
        },
        {
          name: "Member Point Type",
          label: "title.memberPointType",
          icon: "fas fa-address-book",
          path: "tools/configurations/member-point-type",
        },
        {
          name: "Package",
          label: "title.package",
          icon: "fas fa-box",
          path: "tools/configurations/package",
        },
        {
          name: "Room Unavailable Reason",
          label: "title.roomUnavailableReason",
          icon: "fas fa-address-book",
          path: "tools/configurations/room-unavailable-reason",
        },
        {
          name: "Sales",
          label: "title.sales",
          icon: "fas fa-users",
          path: "tools/configurations/sales",
        },
        {
          name: "Room Rate Category",
          label: "title.roomRateCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/room-rate-category",
        },
        {
          name: "Room Rate Sub Category",
          label: "title.roomRateSubCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/room-rate-sub-category",
        },
        {
          name: "Room Boy",
          label: "title.roomBoy",
          icon: "fas fa-address-book",
          path: "tools/configurations/room-boy",
        },
        {
          name: "Purpose Of",
          label: "title.purposeOf",
          icon: "fas fa-address-book",
          path: "tools/configurations/purpose-of",
        },
        {
          name: "Member",
          label: "title.member",
          icon: "fas fa-address-book",
          path: "tools/configurations/member",
        },
        {
          name: "Owner",
          label: "title.owner",
          icon: "fas fa-address-book",
          path: "tools/configurations/owner-list",
        },
        {
          name: "Voucher Reason",
          label: "title.voucherReason",
          icon: "fas fa-address-book",
          path: "tools/configurations/voucher-reason",
        },
        {
          name: "Room Rate",
          label: "title.roomRate",
          icon: "fas fa-solid fa-star",
          path: "tools/configurations/room-rate",
        },
        {
          name: "ID Card Type",
          label: "title.idCardType",
          icon: "fas fa-solid fa-id-card",
          path: "tools/configurations/id-card-type",
        },
        {
          name: "Card Type",
          label: "title.cardType",
          icon: "fas fa-address-book",
          path: "tools/configurations/card-type",
        },
        {
          name: "Competitor Category",
          label: "title.competitorCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/competitor-category",
        },
        {
          name: "Bed Type",
          label: "title.bedType",
          icon: "fas fa-bed",
          path: "tools/configurations/bed-type",
        },
        {
          name: "Guest Type",
          label: "title.guestType",
          icon: "fas fa-address-book",
          path: "tools/configurations/guest-type",
        },
        {
          name: "Payment Type",
          label: "title.paymentType",
          icon: "fas fa-address-book",
          path: "tools/configurations/payment-type",
        },
        {
          name: "Loan Item",
          label: "title.loanItem",
          icon: "fas fa-address-book",
          path: "tools/configurations/loan-item",
        },
        {
          name: "Competitor",
          label: "title.competitor",
          icon: "fas fa-address-book",
          path: "tools/configurations/competitor",
        },
        {
          name: "Room View",
          label: "title.roomView",
          icon: "fas fa-address-book",
          path: "tools/configurations/room-view",
        },
        {
          name: "Market Category",
          label: "title.marketCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/market-category",
        },
        {
          name: "Credit Card Charge",
          label: "title.creditCardCharge",
          icon: "fas fa-address-book",
          path: "tools/configurations/credit-card-charge",
        },
        {
          name: "PABX Rate",
          label: "title.pabxRate",
          icon: "fas fa-address-book",
          path: "tools/configurations/pabx-rate",
        },
        {
          name: "Room Amenities",
          label: "title.roomAmenities",
          icon: "fas fa-address-book",
          path: "tools/configurations/room-amenities",
        },
        {
          name: "Market",
          label: "title.market",
          icon: "fas fa-address-book",
          path: "tools/configurations/market",
        },
        {
          name: "Phone Book Type",
          label: "title.phoneBookType",
          icon: "fas fa-address-book",
          path: "tools/configurations/phone-book-type",
        },
        {
          name: "Sales Segment",
          label: "title.salesSegment",
          icon: "fas fa-address-book",
          path: "tools/configurations/sales-segment",
        },
        {
          name: "Sales Source",
          label: "title.salesSource",
          icon: "fas fa-address-book",
          path: "tools/configurations/sales-source",
        },
        {
          name: "Sales Task Action",
          label: "title.salesTaskAction",
          icon: "fas fa-address-book",
          path: "tools/configurations/sales-task-action",
        },
        {
          name: "Sales Task Repeat",
          label: "title.salesTaskRepeat",
          icon: "fas fa-address-book",
          path: "tools/configurations/sales-task-repeat",
        },
        {
          name: "Sales Task Tag",
          label: "title.salesTaskTag",
          icon: "fas fa-address-book",
          path: "tools/configurations/sales-task-tag",
        },
        // {
        //   name: "Sales Salary",
        //   label: "title.salesSalary",
        //   icon: "fas fa-users",
        //   path: "tools/configurations/sales-salary",
        // },
        {
          name: "Notif Third Party Template",
          label: "title.notifThirdPartyTemplate",
          icon: "fas fa-address-book",
          path: "tools/configurations/notif-third-party-template",
        },
      ],
    },
    {
      label: "title.pointOfSales",
      children: [
        {
          name: "Member Outlet Discount",
          label: "title.memberOutletDiscount",
          icon: "fas fa-address-book",
          path: "tools/configurations/member-outlet-discount",
        },
        {
          name: "Product Category",
          label: "title.productCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/product-category",
        },
        {
          name: "Outlet",
          label: "title.outlet",
          icon: "fas fa-address-book",
          path: "tools/configurations/outlet",
        },
        {
          name: "Tenan",
          label: "title.tenan",
          icon: "fas fa-address-book",
          path: "tools/configurations/tenan",
        },
        {
          name: "Product Group",
          label: "title.productGroup",
          icon: "fas fa-address-book",
          path: "tools/configurations/product-group",
        },
        {
          name: "Product",
          label: "title.product",
          icon: "fas fa-address-book",
          path: "tools/configurations/product",
        },
        {
          name: "POS Market",
          label: "title.posMarket",
          icon: "fas fa-address-book",
          path: "tools/configurations/pos-market",
        },
        {
          name: "User Group Outlet",
          label: "title.userGroupOutlet",
          icon: "fas fa-address-book",
          path: "tools/configurations/user-group-outlet",
        },
        {
          name: "POS Payment Group",
          label: "title.posPaymentGroup",
          icon: "fas fa-address-book",
          path: "tools/configurations/pos-payment-group",
        },
        {
          name: "Spa Room",
          label: "title.spaRoom",
          icon: "fas fa-address-book",
          path: "tools/configurations/spa-room",
        },
        {
          name: "Table",
          label: "title.table",
          icon: "fas fa-address-book",
          path: "tools/configurations/table",
        },
        {
          name: "Table Type",
          label: "title.tableType",
          icon: "fas fa-address-book",
          path: "tools/configurations/table-type",
        },
        {
          name: "Waitress",
          label: "title.waitress",
          icon: "fas fa-address-book",
          path: "tools/configurations/waitress",
        },
        {
          name: "Printer",
          label: "title.printer",
          icon: "fas fa-address-book",
          path: "tools/configurations/printer",
        },
        {
          name: "Discount Limit",
          label: "title.discountLimit",
          icon: "fas fa-address-book",
          path: "tools/configurations/discount-limit",
        },
      ],
    },
    {
      label: "title.accounting",
      children: [
        {
          name: "Department",
          label: "title.department",
          icon: "fas fa-tools",
          path: "tools/configurations/department",
        },
        {
          name: "Sub Department",
          label: "title.subDepartment",
          icon: "fas fa-tools",
          path: "tools/configurations/sub-department",
        },
        {
          name: "Tax and Service",
          label: "title.taxAndService",
          icon: "fas fa-tools",
          path: "tools/configurations/tax-and-service",
        },
        {
          name: "Bank Account",
          label: "title.bankAccount",
          icon: "fas fa-tools",
          path: "tools/configurations/bank-account",
        },
        {
          name: "Account Sub Group",
          label: "title.accountSubGroup",
          icon: "fas fa-tools",
          path: "tools/configurations/account-sub-group",
        },
        {
          name: "Account",
          label: "title.account",
          icon: "fas fa-tools",
          path: "tools/configurations/account",
        },
        {
          name: "Journal Account Sub Group",
          label: "title.journalAccountSubGroup",
          icon: "fas fa-tools",
          path: "tools/configurations/journal-account-sub-group",
        },
        {
          name: "Journal Account Category",
          label: "title.journalAccountCategory",
          icon: "fas fa-tools",
          path: "tools/configurations/journal-account-category",
        },
        // {
        //   name: "Journal Account",
        //   label: "title.journalAccount",
        //   icon: "fas fa-solid fa-cart-shopping",
        //   path: "tools/configurations/account",
        // },
        {
          name: "Company Type",
          label: "title.companyType",
          icon: "fas fa-tools",
          path: "tools/configurations/company-type",
        },
        {
          name: "Company",
          label: "title.company",
          icon: "fas fa-tools",
          path: "tools/configurations/company",
        },
        {
          name: "Currency",
          label: "title.currency",
          icon: "fas fa-tools",
          path: "tools/configurations/currency",
        },
        {
          name: "Currency Nominal",
          label: "title.currencyNominal",
          icon: "fas fa-tools",
          path: "tools/configurations/currency-nominal",
        },
        {
          name: "Journal Account",
          label: "title.journalAccount",
          icon: "fas fa-tools",
          path: "tools/configurations/journal-account",
        },
      ],
    },
    {
      label: "title.inventoryAndAssets",
      children: [
        {
          name: "Shipping Address",
          label: "title.shippingAddress",
          icon: "fas fa-address-book",
          path: "tools/configurations/shipping-address",
        },
        {
          name: "UOM",
          label: "title.uom",
          icon: "fas fa-address-book",
          path: "tools/configurations/uom",
        },
        {
          name: "Store",
          label: "title.store",
          icon: "fas fa-address-book",
          path: "tools/configurations/store",
        },
        {
          name: "Item Category",
          label: "title.itemCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/item-category",
        },
        {
          name: "Item",
          label: "title.item",
          icon: "fas fa-address-book",
          path: "tools/configurations/item",
        },
        {
          name: "Item Group",
          label: "title.itemGroup",
          icon: "fas fa-address-book",
          path: "tools/configurations/item-group",
        },
        {
          name: "Return Stock Reason",
          label: "title.returnStockReason",
          icon: "fas fa-address-book",
          path: "tools/configurations/return-stock-reason",
        },
        {
          name: "Market List",
          label: "title.marketList",
          icon: "fas fa-address-book",
          path: "tools/configurations/market-list",
        },
        {
          name: "Manufacture",
          label: "title.manufacture",
          icon: "fas fa-address-book",
          path: "tools/configurations/fa-manufacture",
        },
        {
          name: "Location",
          label: "title.location",
          icon: "fas fa-address-book",
          path: "tools/configurations/fa-location",
        },
        {
          name: "FA Item Category",
          label: "title.faItemCategory",
          icon: "fas fa-address-book",
          path: "tools/configurations/fa-item-category",
        },
        {
          name: "FA Item",
          label: "title.faItem",
          icon: "fas fa-address-book",
          path: "tools/configurations/fa-item",
        },
      ],
    },
    {
      label: "title.banquet",
      children: [
        {
          name: "Venue Group",
          label: "title.venueGroup",
          icon: "fas fa-address-book",
          path: "tools/configurations/venue-group",
        },
        {
          name: "Venue",
          label: "title.venue",
          icon: "fas fa-address-book",
          path: "tools/configurations/venue",
        },
        {
          name: "Venue Combine",
          label: "title.venueCombine",
          icon: "fas fa-address-book",
          path: "tools/configurations/venue-combine",
        },
        {
          name: "Theme",
          label: "title.theme",
          icon: "fas fa-address-book",
          path: "tools/configurations/theme",
        },
        {
          name: "Seating Plan",
          label: "title.seatingPlan",
          icon: "fas fa-address-book",
          path: "tools/configurations/seating-plan",
        },
        {
          name: "Layout",
          label: "title.layout",
          icon: "fas fa-address-book",
          path: "tools/configurations/layout",
        },
      ],
    },
  ];

  onSearch() {
    let data: any = [];
    for (const i of this.configurationItems) {
      let child;
      child = i.children.filter((val: any) => {
        return val.name.toUpperCase().includes(this.filterText.toUpperCase());
      });
      if (child.length > 0) {
        data.push({
          name: i.name,
          label: i.label,
          children: child,
        });
      }
    }
    this.isExpanded = true;
    this.displayItems = data;
  }

  navigation(path: string) {
    if (path) {
      this.$router.replace(path);
    }
  }

  mounted(): void {
    this.displayItems = this.configurationItems;
  }
}
