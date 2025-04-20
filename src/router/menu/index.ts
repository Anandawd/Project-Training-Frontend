import $global from "@/utils/global";
import hotelMenu from "./hotel-menu";
import pointOfSalesMenu from "./point-of-sales-menu";
import accountingMenu from "./accounting-menu";
import inventoryMenu from "./assets-menu";
import configurationMenu from "./general-menu";
import crmMenu from "./crm-menu";
import payrollMenu from "./payroll-menu";

// let activeMenu =
// function setActiveModule() {

// }
const menu = [
  ...hotelMenu,
  ...pointOfSalesMenu,
  ...accountingMenu,
  ...inventoryMenu,
  ...configurationMenu,
  ...crmMenu,
  ...payrollMenu,
];
export default menu;
