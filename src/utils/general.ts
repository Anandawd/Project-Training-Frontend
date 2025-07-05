import { i18n } from "@/main";
import utilsStore from "@/stores/utils";
import { getToastError } from "@/utils/toast";
import { RowNode } from "ag-grid-community";
import UtilsAPI from "../services/api/utils/utils";
import global from "./global";

async function getError(error: any) {
  new Error(error);
  console.error(error);
  let response = error.response;
  if (!response) {
    const utils = utilsStore();
    await utils.checkConnectionStatus();
  }
  if (response.status == 404) {
    return getToastError("Network error!");
  }
  let status = response.status2;
  if (!status) return getToastError("Something wrong!");
  const statusCode = status.status;
  let message = status.message;
  let message2: string = "";
  let serverValidation: any = {};
  if (statusCode == 2 && typeof message == "object") {
    for (const i of message) {
      message2 += `${i.message} (${i.field})\n`;
      serverValidation[i.field] = false;
    }
  } else if (statusCode == 999 && typeof message == "object") {
    if (message.hasOwnProperty("message")) {
      message2 = message.message;
    }
    if (message.hasOwnProperty("list")) {
      for (const i of message.list) {
        message2 += `\n${i}`;
      }
    }
  }
  // else if (statusCode == 7) {
  //   // Custom handling untuk duplicate code (Status Code 7)
  //   message2 = i18n.global.t("messages.payroll.error.duplicateCode");
  //   serverValidation.code = false;
  // }
  else if (message && statusCode == 11) {
    serverValidation.Code = false;
  } else if (!message && statusCode) {
    message = i18n.global.t(`apiStatus[${statusCode.toString()}]`);
  }
  getToastError(message2 != "" ? message2 : message);
  if (serverValidation) return serverValidation;
  return new Error(message);
}

function generateIconContextMenuAgGrid(icon: string) {
  const rootUrl = window.location.origin;
  return `<img border="0" width="20" height="20" src="${rootUrl}/images/icons/${icon}.png"/>`;
}

function generateIconMenuAgGrid(icon: string) {
  const rootUrl = window.location.origin;
  return `${rootUrl}/images/icons/${icon}.png`;
}

function getValueByName(json: any, name: string, category?: string) {
  if (json) {
    let result: any[] = json.filter(function (result: any) {
      if (category) {
        return result.category == category && result.name == name;
      }
      return result.name == name;
    });
    if (result) {
      const resultX = result && result.length > 0 ? result[0] : {};
      return resultX.value;
    }
  }
  return "";
}

function getVariant(val: any) {
  if (val && val != "") {
    return val.toString().toUpperCase() === "TRUE" || val == true;
  }
  return false;
}

function getDaysInMonth(month: any, year: any) {
  return new Date(year, month, 0).getDate();
}

async function getServerDateTime() {
  const utilsAPI = new UtilsAPI();
  try {
    const { data } = await utilsAPI.getServerDateTime();
    return data;
  } catch (error: any) {
    throw getError(error);
  }
}

async function getServerDate() {
  const utilsAPI = new UtilsAPI();
  try {
    const { data } = await utilsAPI.getServerDate();
    return data;
  } catch (error: any) {
    throw getError(error);
  }
}

function getDates(startDate: any, endDate: any) {
  const dates = [];
  let cDate = new Date(startDate);
  const eDate = new Date(endDate);
  while (cDate <= eDate) {
    dates.push({
      day: cDate.getDay(),
      date: cDate.getDate(),
      month: cDate.getMonth() + 1,
      year: cDate.getFullYear(),
      monthString: cDate.toLocaleString("default", { month: "long" }),
    });
    cDate = new Date(cDate.setDate(cDate.getDate() + 1));
  }

  return dates;
}

function getDaysBetweenDate(date1: Date, date2: Date) {
  const difference = date1.getTime() - date2.getTime();
  let days = Math.ceil(difference / (1000 * 3600 * 24));
  // if (date2.getTime() >= date1.getTime()) {
  //   days = 1;
  // }
  return days;
}

// AG-GRID TABLE FUNCTION
function generatePinnedBottomDataTotal(
  gridApi: any,
  gridColumnApi: any,
  aggregateColumn: string[]
) {
  // generate a row-data with null values
  const result: any = {};

  gridColumnApi.getAllGridColumns().forEach((item: any) => {
    result[item.colId] = null;
  });
  return calculatePinnedBottomData(gridApi, result, aggregateColumn);
}

function calculatePinnedBottomData(
  gridApi: any,
  target: any,
  aggregateColumn: string[]
) {
  //list of columns fo aggregation
  aggregateColumn.forEach((element) => {
    gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
      if (rowNode.data[element]) {
        const toSum = parseFloat(rowNode.data[element]);
        target[element] += Number(toSum);
      }
    });
  });
  target["action"] = "Total";
  return target;
}

function generateTotalFooterAgGrid(rowData: any, colDef: any) {
  if (!rowData) return;
  let val: any = {};
  for (const c of colDef) {
    if (c.textTotal) {
      val[c.field] = c.textTotal;
      continue;
    }
    if (c.sumTotal) {
      for (const i of rowData) {
        if (i[c.field]) {
          if (!isNaN(Number(i[c.field]))) {
            if (val[c.field]) {
              val[c.field] += Number(i[c.field]);
            } else {
              val[c.field] = Number(i[c.field]);
            }
          } else {
            val[c.field] = null;
          }
        }
      }
    }
  }
  return [val];
}

let clickCount = 0;
function copyValueDoubleClick(valueFrom: any) {
  clickCount++;
  setTimeout(() => {
    clickCount = 0;
  }, 500);
  if (clickCount > 1) {
    clickCount = 0;
    // valueTo = valueFrom;
    return valueFrom;
  }
  return;
}

function anyToFloat(value: any) {
  return !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
}

function getUserAccessUtility(
  utilityAccess: string,
  index: number,
  userID: string = ""
) {
  if (userID) {
    if (userID.toUpperCase() == "SYSTEM") {
      return true;
    }
  }
  if (!utilityAccess) return false;
  return utilityAccess[index] == "1";
}

// AG-GRID FUNCION END

// function dateDiff(dateStart, dateEnd) {
//     const start = moment(formatDateDatabase(dateStart));
//     const end = moment(formatDateDatabase(dateEnd));
//     //Difference in number of days
//     return moment.duration(end.diff(start)).asDays();
// }

// function getTime() {
//     const date= new Date();
// 	const val = moment(date).format('HH:mm:ss');
// 	return val;
// }

function cloneObject(object: any, isArray: boolean = false) {
  const clone: any = isArray ? [] : {};
  for (const key in object) {
    if (object.hasOwnProperty(key))
      //ensure not adding inherited props
      clone[key] = object[key];
  }
  return clone;
}

// function removeArrayByKey(arr: any) {
//     var what, a = arguments, L = a.length, ax;
//     while (L > 1 && arr.length) {
//         what = a[--L];
//         while ((ax= arr.indexOf(what)) !== -1) {
//             arr.splice(ax, 1);
//         }
//     }
//     return arr;
// }

// async function asyncForEach(array, callback) {
//     for (let index = 0; index < array.length; index++) {
//       await callback(array[index], index, array);
//     }
//   }

//   //function for ag grid
async function rowSelectedAfterRefresh(
  thisData: any,
  modeData: any,
  selectedRow: any,
  key: any,
  rowNodes?: any[]
) {
  await thisData.$nextTick();
  const countRowData = thisData.gridApi.getDisplayedRowCount();
  const vm = thisData;
  if (!countRowData || countRowData <= 0) return;
  vm.gridApi.forEachNode((node: any) => {
    if (node.data) {
      //expand detail

      if (!selectedRow || !selectedRow.hasOwnProperty(key)) {
        node.setSelected(true, true);
        return false;
      }

      if (rowNodes) {
        if (rowNodes.length > 0) {
          for (const i of rowNodes) {
            if (!i.data[key]) {
              continue;
            }
            if (i.data[key] === node.data[key]) {
              if (i.expanded) {
                node.setExpanded(true);
              }
            }
          }
        }
      }
      // set selected row
      if (
        (!selectedRow && node.rowIndex === 0) ||
        (!selectedRow[key] &&
          node.rowIndex === 0 &&
          modeData !== global.modeData.delete)
      ) {
        node.setSelected(true, true);
        return false;
      } else if (node.data[key] === selectedRow[key]) {
        if (modeData !== global.modeData.delete) {
          vm.gridApi.ensureIndexVisible(node.rowIndex, "middle");
          node.setSelected(true, true);
          return false;
        }
      } else if (
        modeData === global.modeData.delete &&
        countRowData > 0 &&
        (global.agGrid.rowIndexBeforeDelete === node.rowIndex ||
          global.agGrid.rowIndexBeforeDelete - 1 === node.rowIndex)
      ) {
        node.setSelected(true, true);
        vm.gridApi.ensureIndexVisible(node.rowIndex, "middle");
        return false;
      }
    }
  });
}

function handleRowRightClickedAgGrid(
  paramsData: any,
  thisX: any,
  primaryKey: string
) {
  if (paramsData) {
    const vm = thisX;
    vm.gridApi.forEachNode((node: any) => {
      if (node.data) {
        if (node.data[primaryKey] == vm.paramsData[primaryKey]) {
          node.setSelected(true, true);
        }
      }
    });
  }
}

function getYearPeriods(period: number = 10, slice: number = 0) {
  const today = new Date();
  const year = today.getFullYear() - 2;
  let years = [];
  for (let i = 0; i <= period; i++) {
    years.push((year + i).toString().slice(slice));
  }

  return years;
}

function getCookie(cname: string) {
  console.log("asd", document.cookie);
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  console.log(decodedCookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// function getRowIndexBefore(thisData) {
//     const vm = thisData;
//     thisData.gridApi.forEachNode((node) => {
//         if (node.isSelected()) {
//             global.rowIndexBeforeDelete = node.rowIndex;
//         }
//     });
// }

// function addDialogCloseButton(thisX, elementID, activeSync) {
//     if(thisX.global.dialog.isAddHeaderCloseButton) {
//         if (thisX.global.dialog.typeDialog === 'confirm') {
//             const firstDialog = document.getElementById(elementID);
//             if (firstDialog !== null) {
//                 const headerDialog = firstDialog.getElementsByClassName('vs-dialog');

//                 const vm = thisX;
//                 const newElement = document.createElement('i');
//                 newElement.className = 'vs-icon notranslate icon-scale vs-dialog-cancel vs-dialog-cancel--icon notranslate material-icons null';
//                 newElement.id = 'first-icon-dialog-close';
//                 newElement.innerText = 'close';
//                 newElement.addEventListener('click', () => {
//                     vm[activeSync] = false;
//                 });
//                 headerDialog[0].children[0].appendChild(newElement);
//             }
//         }
//     }
// }

// function addPopupCloseButton(thisX, elementID, activeSync) {
//     if(thisX.global.dialog.isAddHeaderCloseButton) {
//         if (thisX.global.dialog.typeDialog === 'confirm') {
//             const firstDialog = document.getElementById(elementID);
//             if (firstDialog !== null) {
//                 const headerDialog = firstDialog.getElementsByClassName('vs-dialog');

//                 const vm = thisX;
//                 const newElement = document.createElement('i');
//                 newElement.className = 'vs-icon notranslate icon-scale vs-dialog-cancel vs-dialog-cancel--icon notranslate material-icons null';
//                 newElement.id = 'first-icon-dialog-close';
//                 newElement.innerText = 'close';
//                 newElement.addEventListener('click', () => {
//                     vm[activeSync] = false;
//                 });
//                 headerDialog[0].children[0].appendChild(newElement);
//             }
//         }
//     }
// }

// function loadingLayoutIndicator(context) {
//     const mainLayout = document.getElementById('layout--main');
//     const isLoading = mainLayout.getElementsByClassName('con-vs-loading')
//     if (isLoading.length > 0) {
//         return;
//     }
//     context.$vs.loading({ container: '#layout--main', scale: context.global.scaleLoadingMainLayout });
// }

// function closeLoadingLayoutIndicator(context) {
//     context.$vs.loading.close('#layout--main>.con-vs-loading');
// }

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getIconFromMenu(menu: any, routeOrder: any) {
  let icon = "";
  for (const i of menu) {
    if (i.children) {
      const index = i.children.findIndex(
        (val: any) => val.routeOrder == routeOrder
      );
      if (index >= 0) {
        icon = i.children[index]["cIcon"];
        break;
      }
    } else {
      const data = menu.find((val: any) => val.routeOrder == routeOrder);
      if (data) {
        icon = data.cIcon;
        break;
      }
    }
  }
  return icon;
}

function printPreview(href: string) {
  let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
  width=900,height=900,left=100,top=100,zoom=70%`;

  window.open(href, "_blank", params);
}

function getRouterMenu(menu: any[], routeOrder: any) {
  let data = {};
  for (const i of menu) {
    if (i.children) {
      const index = i.children.findIndex(
        (val: any) => val.routeOrder == routeOrder
      );
      if (index >= 0) {
        data = i.children[index];
        break;
      }
    } else {
      if (i.routeOrder == routeOrder) {
        data = i;
        break;
      }
    }
  }
  return data;
}

function validHexColor(color: string) {
  var reg = /^#([0-9a-f]{3}){1,2}$/i.test(color);

  return reg;
}

//Using to display row column from left to right
function calculateDataForDisplay(data: any[], columnSize: number) {
  let columns = [];
  // calculate number of rows and items per column
  if (!data) return;
  const dataToCount = data.filter((val: any) => !val.hidden);
  const rowCount = Math.ceil(dataToCount.length / columnSize);
  // const itemsPerColumn = Math.ceil(data.length / rowCount);
  // create columns
  for (let i = 0; i < columnSize; i++) {
    const startIndex = i * rowCount;
    const endIndex = Math.min(startIndex + rowCount, dataToCount.length);
    const column = dataToCount.slice(startIndex, endIndex);
    columns.push(column);
  }
  return columns;
}

export {
  anyToFloat,
  calculateDataForDisplay,
  // dateDiff,
  // getTime,
  cloneObject,
  copyValueDoubleClick,
  generateIconContextMenuAgGrid,
  generateIconMenuAgGrid,
  //ag-grid
  generatePinnedBottomDataTotal,
  generateTotalFooterAgGrid,
  getCookie,
  getDates,
  getDaysBetweenDate,
  getDaysInMonth,
  getError,
  getIconFromMenu,
  getRouterMenu,
  getServerDate,
  getServerDateTime,
  getUserAccessUtility,
  getValueByName,
  getVariant,
  getYearPeriods,
  handleRowRightClickedAgGrid,
  printPreview,
  // removeArrayByKey,
  // asyncForEach,
  rowSelectedAfterRefresh,
  sleep,
  validHexColor,
};
