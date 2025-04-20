import { Vue, Options } from "vue-class-component";
import MenuItem from "./components/menu-item/menu-item.vue";
import CInput from "@/components/input/input.vue";
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import HotelInformationForm from "./components/hotel-information-form/hotel-information-form.vue";
import SettingsAPI from "@/services/api/general/settings";
import CRadio from "@/components/radio/radio.vue";
// import user
import authModule from "@/stores/auth";
import { cloneObject, getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import { BTabs, BTab, BDropdown, BDropdownItem } from "bootstrap-vue-3";
const settingsAPI = new SettingsAPI();

@Options({
  name: "settings",
  components: {
    MenuItem,
    BDropdown,
    BDropdownItem,
    HotelInformationForm,
    CInput,
    CCheckbox,
    CSelect,
    CRadio,
    BTabs,
    BTab,
  },
})
export default class Settings extends Vue {
  public auth = authModule();
  public hotelInformationElement: any = null;
  public form: any = {};
  public user: any = {};
  public sub_folio_group: any = {};
  public navList: any = [
    {
      id: "hotelInformation",
      sort: 1,
      name: "Company Information",
      label: "companyInformation",
    },
    {
      id: "fg",
      sort: 1,
      name: "Format, Form & Grid",
      label: "formatFormAndGrid",
      children: [
        {
          id: "fg-format",
          sort: 1,
          name: "Format Setting",
          label: "format",
          children: [
            {
              name: "Time Zone",
              label: "timeZone",
              description: "",
            },
            {
              name: "Short Date Format",
              label: "shortDateFormat",
              description: "",
            },
            {
              name: "Currency Format",
              label: "currencyFormat",
              description: "",
            },
            {
              name: "Thousand Separator",
              label: "thousandSeparator",
              description: "",
            },
            {
              name: "Date Separator",
              label: "dateSeparator",
              description: "",
            },
            {
              name: "DecimalSeparator",
              label: "decimalSeparator",
              description: "",
            },
          ],
        },
        {
          id: "fg-grid",
          sort: 1,
          name: "Grid",
          label: "grid",
        },
        {
          id: "fg-form",
          sort: 1,
          name: "Form",
          label: "form",
        },
        {
          id: "fg-report",
          sort: 1,
          name: "Report",
          label: "report",
        },
        {
          id: "fg-weekendDay",
          sort: 1,
          name: "Weekend Day",
          label: "weekendDay",
        },
        {
          id: "fg-reportSignature",
          sort: 1,
          name: "Report Signature",
          label: "reportSignature",
        },
        {
          id: "fg-other",
          sort: 1,
          name: "Other",
          label: "other",
        },
      ],
    },
    {
      id: "wr",
      sort: 1,
      name: "Walk-In & Reservation",
      label: "walkInAndReservation",
      children: [
        {
          id: "wr-reservation",
          sort: 1,
          name: "Reservation",
          label: "reservation",
        },
        {
          id: "wr-defaultValue",
          sort: 1,
          name: "Default Value",
          label: "defaultValue",
        },
        {
          id: "wr-amountPreset",
          sort: 1,
          name: "Amount Preset",
          label: "amountPreset",
        },
        {
          id: "wr-requiredField",
          sort: 1,
          name: "Required Field",
          label: "requiredField",
        },
        {
          id: "wr-rate",
          sort: 1,
          name: "Rate",
          label: "rate",
        },
        {
          id: "wr-other",
          sort: 1,
          name: "Other",
          label: "other",
        },
      ],
    },
    {
      id: "cf",
      sort: 1,
      name: "Custom Fields",
      label: "customFields",
      children: [
        {
          id: "cf-inputField",
          sort: 1,
          name: "Input Fields",
          label: "inputFields",
        },
        {
          id: "cf-selectListField",
          sort: 1,
          name: "Select List Fields",
          label: "selectListFields",
        },
      ],
    },
    {
      id: "fof",
      sort: 1,
      name: "Folio & Other Form",
      label: "folioAndOtherForm",
      children: [
        {
          id: "fof-folio",
          sort: 1,
          name: "Folio",
          label: "folio",
        },
        {
          id: "fof-otherForm",
          sort: 1,
          name: "Other Form",
          label: "otherForm",
        },
      ],
    },
    {
      id: "mem",
      sort: 1,
      hidden: false,
      name: "Member,Voucher & Gift",
      label: "memberVoucherAndGift",
      children: [
        {
          id: "mem-defaultSetting",
          sort: 1,
          hidden: false,
          name: "Default Setting",
          label: "defaultSetting",
          children: [
            {
              id: "mem-memberPointExpire",
              sort: 1,
              hidden: false,
              name: "Member Point Expire",
              label: "memberPointExpire",
            },
            {
              id: "mem-voucherLength",
              sort: 1,
              hidden: false,
              name: "Voucher Length",
              label: "voucherLength",
            },
            {
              id: "mem-voucherExpire",
              sort: 1,
              hidden: false,
              name: "Voucher Expire",
              label: "voucherExpire",
            },
            {
              id: "mem-voucherPointRedeem",
              sort: 1,
              hidden: false,
              name: "Member Point Redeem",
              label: "voucherPointRedeem",
            },
            {
              id: "mem-voucherPrice",
              sort: 1,
              hidden: false,
              name: "Member Price",
              label: "voucherPrice",
            },
            {
              id: "mem-voucherDescription",
              sort: 1,
              hidden: false,
              name: "Voucher Description",
              label: "voucherDescription",
            },
            {
              id: "mem-voucherTemplateCompliment",
              sort: 1,
              hidden: false,
              name: "Voucher Template Compliment",
              label: "voucherTemplateCompliment",
            },
            {
              id: "mem-voucherTemplateSoldDiscount",
              sort: 1,
              hidden: false,
              name: "Voucher Template Sold/Discount",
              label: "voucherTemplateSoldDiscount",
            },
            {
              id: "mem-autoUpdateMemberProfile",
              sort: 1,
              hidden: false,
              name: "Auto Update Member Profile",
              label: "autoUpdateMemberProfile",
            },
          ],
        },
        {
          id: "mem-generateVoucher",
          sort: 1,
          hidden: false,
          name: "Generate Voucher",
          label: "generateVoucher",
          children: [
            {
              id: "mem-generateVoucherDiscountOnCheckOut",
              sort: 1,
              hidden: false,
              name: "Generate Voucher Discount on Check Out",
              label: "generateVoucherDiscountOnCheckOut",
            },
            {
              id: "mem-voucherDiscountAmount",
              sort: 1,
              hidden: false,
              name: "Voucher Discount Amount",
              label: "voucherDiscountAmount",
            },
            {
              id: "mem-voucherRoomType",
              sort: 1,
              hidden: false,
              name: "Voucher Room Type",
              label: "voucherRoomType",
            },
          ],
        },
      ],
    },
    {
      id: "ffhk",
      sort: 1,
      name: "Floor Plan",
      label: "floorPlanAndHousekeeping",
      children: [
        {
          id: "ffhk-floorPlan",
          sort: 1,
          name: "Floor Plan",
          label: "floorPlan",
        },
        {
          id: "ffhk-roomStatusColor",
          sort: 1,
          name: "Room Status Color",
          label: "roomStatusColor",
        },
        {
          id: "ffhk-roomCosting",
          sort: 1,
          name: "Room Costing",
          label: "roomCosting",
        },
        {
          id: "ffhk-other",
          sort: 1,
          name: "Other",
          label: "other",
        },
      ],
    },
    {
      id: "itg",
      sort: 1,
      name: "Integrations",
      label: "integrations",
      children: [
        {
          id: "itg-keylock",
          sort: 1,
          name: "Keylock",
          label: "keylock",
        },
        {
          id: "itg-printerServicePOS",
          sort: 1,
          name: "Printer Service POS",
          label: "printerServicePOS",
        },
        {
          id: "itg-pabx",
          sort: 1,
          name: "PABX",
          label: "pabx",
        },
        {
          id: "itg-channelManager",
          sort: 1,
          name: "Channel Manager",
          label: "channelManager",
        },
        {
          id: "itg-iptv",
          sort: 1,
          name: "IPTV",
          label: "iptv",
        },
        {
          id: "itg-mikrotikAndHotspot",
          sort: 1,
          name: "Mikrotik & Hotspot",
          label: "mikrotikAndHotspot",
        },
        {
          id: "itg-whatapp",
          sort: 1,
          hidden: true,
          name: "Whatsapp",
          label: "whatsapp",
        },
        {
          id: "itg-email",
          sort: 1,
          hidden: true,
          name: "Email",
          label: "email",
        },
        {
          id: "itg-qrFolioAndInvoice",
          sort: 1,
          hidden: true,
          name: "QR Folio & Invoice",
          label: "qrFolioAndInvoice",
        },
      ],
    },
    {
      id: "pos",
      sort: 1,
      name: "Point of Sales",
      label: "pointOfSales",
      children: [
        {
          id: "pos-generalOption",
          sort: 1,
          name: "General Option",
          label: "generalOption",
        },
      ],
    },
    {
      id: "acc",
      sort: 1,
      name: "Accounting",
      label: "accounting",
      children: [
        // {
        //   id: "acc-globalJournalAccount",
        //   sort: 1,
        //   name: "Global Journal Account",
        //   label: "globalJournalAccount",
        // },
        {
          id: "acc-subFolioName",
          sort: 1,
          name: "Sub Folio Name",
          label: "subFolioName",
        },
        {
          id: "acc-invoice",
          sort: 1,
          name: "Invoice",
          label: "invoice",
        },
        {
          id: "acc-other",
          sort: 1,
          name: "Other",
          label: "other",
        },
      ],
    },
    {
      id: "inv",
      sort: 1,
      name: "Inventory & Asset",
      label: "inventoryAsset",
      children: [
        {
          id: "acc-inventoryCostingMethod",
          sort: 1,
          name: "Inventory Costing Method",
          label: "inventoryCostingMethod",
        },
        {
          id: "acc-inventoryConfig",
          sort: 1,
          name: "Inventory Config",
          label: "inventoryConfig",
        },
      ],
    },
    {
      id: "comp",
      sort: 1,
      name: "Company",
      label: "company",
      children: [
        {
          id: "comp-companyBankAccountInformation1",
          sort: 1,
          name: "Company Bank Account Information 1",
          label: "companyBankAccountInformation",
        },
        {
          id: "comp-companyBankAccountInformation2",
          sort: 1,
          name: "Company Bank Account Information 2",
          label: "companyBankAccountInformation",
        },
        {
          id: "comp-companyRequiredField",
          sort: 1,
          name: "Company Required Field",
          label: "companyRequiredField",
        },
        {
          id: "comp-other",
          sort: 1,
          name: "Other",
          label: "other",
        },
      ],
    },
    {
      id: "gp",
      sort: 1,
      name: "Global Parameter",
      label: "globalParameter",
      children: [
        {
          id: "gp-globalAccount",
          sort: 1,
          name: "Global Account",
          label: "globalAccount",
        },
        {
          id: "gp-globalJournalAccount",
          sort: 1,
          name: "Global Journal Account",
          label: "globalJournalAccount",
        },
        {
          id: "gp-globalJournalAccountSubGroup",
          sort: 1,
          name: "Global Journal Account Sub Group",
          label: "globalJournalAccountSubGroup",
        },
        {
          id: "gp-globalDepartment",
          sort: 1,
          name: "Global Department",
          label: "globalDepartment",
        },
        {
          id: "gp-globalSubDepartment",
          sort: 1,
          name: "Global Sub Department",
          label: "globalSubDepartment",
        },
        {
          id: "gp-otherGlobalParameter",
          sort: 1,
          name: "Other Global Parameter",
          label: "otherGlobalParameter",
        },
      ],
    },
    {
      id: "repo",
      sort: 1,
      name: "Report",
      label: "report",
      children: [
        {
          id: "repo-revenueAccount",
          sort: 1,
          hidden: true,
          name: "Revenue Account",
          label: "revenueAccount",
        },
        {
          id: "repo-paymentAccount",
          sort: 1,
          hidden: true,
          name: "paymentAccount",
          label: "paymentAccount",
        },
        {
          id: "repo-subDepartment",
          sort: 1,
          hidden: true,
          name: "Sub Department",
          label: "subDepartment",
        },
        {
          id: "repo-signature",
          sort: 1,
          hidden: false,
          name: "Signature",
          label: "signature",
        },
        {
          id: "repo-templateFrontDesk",
          sort: 1,
          hidden: false,
          name: "Template Front Desk",
          label: "templateFrontDesk",
        },
      ],
    },
    {
      id: 1,
      sort: 1,
      hidden: true,
      name: "Notification",
      label: "notification",
    },
  ];
  public storageData: any = {};

  currencyFormat = [".-", ",0.0;-,0.0", ",0.00;-,0.00", ",0.000;-,0.000"];
  dateSeparator = ["/", "-"];
  decimalSeparator = [",", "."];
  thousandSeparator = [",", "."];
  shortDateFormat = ["DD/MM/YY", "DD/MM/YYYY", "MM/DD/YY", "MM/DD/YYYY"];
  tempForm: any = {};
  showButtonSave: boolean = false;
  options: any = {};
  filterText: any = "";
  displayItems: any = [];
  sectionObserver: any;
  reportFileList: any = [];
  reportFileListCAMS: any = [];
  reportFileListCAS: any = [];
  reportFileListCPOS: any = [];
  reportFileListCBS: any = [];
  reportFileListCHS: any = [];

  handleSave() {
    // this.updateHotelInformation();
    this.processSaveData();
  }

  handleReset() {
    this.form = cloneObject(this.tempForm);
    this.showButtonSave = false;
  }

  async getUser() {
    this.user = await this.auth.user;
  }

  processLoadData(data: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!data) {
          resolve();
          return;
        }

        for (let i = 0; i < data.length; i++) {
          this.tempForm[data[i].name.toLowerCase()] = data[i].value;
          this.form[data[i].name.toLowerCase()] = data[i].value;

          if (i >= data.length - 1) {
            resolve();
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  onChangeData() {
    for (const i in this.form) {
      //check data changed
      if (this.tempForm.hasOwnProperty(i)) {
        if (this.tempForm[i] != this.form[i]) {
          this.showButtonSave = true;
        }
      }
    }
  }

  processSaveData() {
    let data: any = {};
    for (const i in this.form) {
      //check data changed
      if (this.tempForm[i] != this.form[i]) {
        data[i] = this.form[i];
      }
    }
    this.setPOSBillTemplate();
    this.setPOSDefaultOutlet();
    this.updateConfigurationData(data);
  }

  getPOSDefaultOutlet() {
    this.form.default_outlet = localStorage.getItem("default_outlet");
  }

  setPOSDefaultOutlet() {
    localStorage.setItem("default_outlet", this.form.default_outlet);
  }

  getPOSBillTemplate() {
    this.form.captain_order_file_name = localStorage.getItem(
      "captain_order_file_name"
    );
    this.form.captain_order_station_file_name = localStorage.getItem(
      "captain_order_station_file_name"
    );
    this.form.table_check = localStorage.getItem("table_check");
    this.form.bill_file_name = localStorage.getItem("bill_file_name");
  }

  setPOSBillTemplate() {
    localStorage.setItem(
      "captain_order_file_name",
      this.form.captain_order_file_name
    );
    localStorage.setItem(
      "captain_order_station_file_name",
      this.form.captain_order_station_file_name
    );
    localStorage.setItem("table_check", this.form.table_check);
    localStorage.setItem("bill_file_name", this.form.bill_file_name);
  }

  onSearch() {
    let data: any = [];
    for (const i of this.navList) {
      if (i.hidden) continue;
      if (i.children) {
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
    }
    // this.isExpanded = true;
    this.displayItems = data;
  }

  observeSections() {
    try {
      this.sectionObserver.disconnect();
    } catch (error) {}

    const options = {
      rootMargin: "0px 0px",
      threshold: 1.0,
    };
    this.sectionObserver = new IntersectionObserver(
      this.sectionObserverHandler,
      options
    );

    // Observe each section
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      this.sectionObserver.observe(section);
    });
  }

  sectionObserverHandler(entries: any) {
    console.log("entry", entries);
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        // Push sectionId to router here
        this.$router.replace({ name: this.$route.name, hash: `#${sectionId}` });
      }
    }
  }

  // API CALL=======================================================================================================
  async updateHotelInformation() {
    const params = { ...this.hotelInformationElement.form };
    try {
      await settingsAPI.updateHotelInformation(params);
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async loadConfigurationData() {
    try {
      const { data } = await settingsAPI.getConfigurationsAll();
      await this.processLoadData(data);
    } catch (error) {
      getError(error);
    }
  }

  async updateConfigurationData(data: any) {
    if (!data) return;
    const params = {
      type: "",
      data: data,
    };
    try {
      await settingsAPI.updateConfiguration(params);
      this.loadConfigurationData();
      this.showButtonSave = false;
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async getReportFileList(module: string) {
    let list = [];
    const params = {
      Module: module,
    };
    try {
      const { data } = await settingsAPI.getReportFileList(params);
      list = data ?? [];
      if (module == "CAMS") {
        this.reportFileListCAMS = list;
      } else if (module == "CAS") {
        this.reportFileListCAS = list;
      } else if (module == "CPOS") {
        this.reportFileListCPOS = list;
      } else if (module == "CBS") {
        this.reportFileListCBS = list;
      } else if (module == "CHS") {
        this.reportFileListCHS = list;
      } else {
        this.reportFileList = list;
      }
    } catch (error) {
      getError(error);
    }
    return list;
  }

  async getComboList() {
    const params = [
      "RoomType",
      "RoomRate",
      "Outlet",
      "Market",
      "SubDepartment",
      "Department",
      "PaymentType",
      "JournalAccount",
      "ShippingAddress",
      "JournalAccountSubGroup",
      "Account",
      "CompanyType",
      "Store",
      "CustomLookupField01",
      "CustomLookupField02",
      "CustomLookupField03",
      "CustomLookupField04",
      "CustomLookupField05",
      "CustomLookupField06",
      "CustomLookupField07",
      "CustomLookupField08",
      "CustomLookupField09",
      "CustomLookupField10",
      "CustomLookupField11",
      "CustomLookupField12",
      "SubFolio",
      "ChannelManagerVendor",
      "IPTVVendor",
      "KeylockVendor",
      "MikrotikVendor",
      "Timezone",
    ];
    try {
      const { data } = await settingsAPI.codeNameListArray(params);
      this.options = data;
    } catch (error) {
      getError(error);
    }
  }
  // END API CALL ==================================================================================================
  async beforeMount() {
    const loader = this.$loading.show();
    this.displayItems = cloneObject(this.navList, true);
    this.getComboList();
    await this.getUser();
    await this.loadConfigurationData(),
      await Promise.all([
        this.getReportFileList("CAMS"),
        this.getReportFileList("CAS"),
        this.getReportFileList("CPOS"),
        this.getReportFileList("CBS"),
        this.getReportFileList("CHS"),
        this.getReportFileList(""),
      ]);
    this.getPOSBillTemplate();
    this.getPOSDefaultOutlet();
    loader.hide();
  }

  mounted() {
    this.observeSections();
  }

  get userID() {
    return this.user;
  }
}
