import moment from "moment-timezone";
import $global from "./global";
import configStore from "@/stores/config";
// import store from '@/store/store.js'
//TODO timezone load from database
// const timeZone = "Asia/Makassar";
const formatDefault = "DD-MM-YYYY";
// const formatConfig = store.getters.shortDateFormat;

const xshortDateFormat = formatDefault;
// let formatDateString = formatConfig.toUpperCase() != undefined ? formatConfig.toUpperCase() : formatDefault;

// currencyFormat(value){
let xcurrencyFormat: any = "0.00"; //store.getters.currencyFormat || [];
if (xcurrencyFormat.length > 0) {
  xcurrencyFormat = xcurrencyFormat
    .toString()
    .split(";")[0]
    .split(".")[1].length;
} else {
  xcurrencyFormat = 0;
}

function countDecimals(value: number) {
  if (Math.floor(value) !== value)
    return value.toString().split(".")[1].length || 0;
  return 0;
}

function formatTime(params: { value: any }) {
  const config = configStore();
  const timeZone = config.timezone;
  const val = moment.tz(new Date(params.value), timeZone).format("HH:mm:ss");
  return params.value ? val : "";
}

function formatTimeValue(value: any) {
  const config = configStore();
  const timeZone = config.timezone;
  const val = moment.tz(new Date(value), timeZone).format("HH:mm:ss");
  return value ? val : "";
}

function formatDate(params: { value: any }) {
  const config = configStore();
  const timeZone = config.timezone;
  if (params.value == $global.nullDate) return "";
  const val = moment
    .tz(new Date(params.value), timeZone)
    .format(xshortDateFormat);
  return params.value ? val : "";
}

function formatDateTime(params: { value: any }) {
  const config = configStore();
  const timeZone = config.timezone;
  if (params.value === $global.nullDate) return "";
  const val = moment
    .tz(new Date(params.value), timeZone)
    .format(xshortDateFormat + " HH:mm:ss");
  return params.value != undefined && val != "Invalid date" ? val : "";
}

function formatDateTime2(date: any) {
  const config = configStore();
  const timeZone = config.timezone;
  const dateX = moment(date);
  const val = dateX.tz(timeZone).format(xshortDateFormat + " HH:mm:ss");
  // console.log("date", date);
  // console.log("dateX", dateX);
  // console.log("val", val);

  return date != undefined && val != "Invalid date" ? val : "";
}

function formatDate2(params: { value: any }) {
  const config = configStore();
  const timeZone = config.timezone;
  const format = moment
    .tz(new Date(params.value), timeZone)
    .format(xshortDateFormat);
  return params.value != undefined ? format : "";
}
moment().format("MMMM Do YYYY, h:mm:ss a");

function formatFullDate(date: any) {
  const config = configStore();
  const timeZone = config.timezone;
  const format = "dddd, DD MMMM YYYY";
  const dateX = moment.tz(new Date(date), timeZone).format(format);
  return date != undefined ? dateX : "";
}

function formatFullDateX(date: any) {
  const config = configStore();
  const timeZone = config.timezone;
  const format = "dddd, DD MMMM YYYY";
  const dateX = moment(new Date(date), timeZone).format(format);
  return date != undefined ? dateX : "";
}
function formatDateTimeUTC(date: string | Date) {
  if (!date) return $global.nullDate;
  // const format = "YYYY-MM-DDT00:00:00Z";
  const UTC = moment.utc(moment(new Date(date)).utc()).format();
  return UTC;
}

function formatDateTimeZeroUTC(date: string | Date) {
  if (!date) return $global.nullDate;
  const format = "YYYY-MM-DDT00:00:00[Z]";
  const UTC = moment(date).format(format);
  return UTC;
}

function formatDateTimeXX1(date: string | Date) {
  if (!date) return $global.nullDate;
  const format = "YYYYMMDDHHmm";
  const dateX = moment(new Date(date)).format(format);
  return dateX;
}

function formatDate3(
  value: any,
  addDay?: number,
  addMonth?: number,
  addYear?: number
) {
  const config = configStore();
  const timeZone = config.timezone;
  const date = new Date(value);
  if (addDay > 0) {
    date.setDate(date.getDate() + addDay);
  }
  if (addMonth > 0) {
    date.setMonth(date.getMonth() + addMonth);
  }
  if (addYear > 0) {
    date.setMonth(date.getMonth() + addYear * 12);
  }
  const format = moment.tz(date, timeZone).format(xshortDateFormat);
  return value != undefined ? format : "";
}

function formatDateDatabase(value: any) {
  const format = moment(new Date(value)).format("YYYY-MM-DD");
  return value != undefined ? format : "";
}

function formatDateDatabaseAddWeek(
  value: string | number | Date,
  week: number
) {
  const date = new Date(value);
  date.setDate(date.getDate() + week * 7);
  const format = moment(date).format("YYYY-MM-DD");
  return value != undefined ? format : "";
}
function formatDateTimeDatabase(value: any) {
  const format = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss");
  return value != undefined ? format : "";
}

function formatDateTimeZone(
  value: any,
  addDay?: number,
  addMonth?: number,
  addYear?: number
) {
  if (value == $global.nullDate) return "";
  const date = new Date(value);
  if (addDay > 0) {
    date.setDate(date.getDate() + addDay);
  }
  if (addMonth > 0) {
    date.setMonth(date.getMonth() + addMonth);
  }
  if (addYear > 0) {
    date.setMonth(date.getMonth() + addYear * 12);
  }
  const config = configStore();
  const timeZone = config.timezone;
  const format = moment.tz(date, timeZone).format("YYYY-MM-DDTHH:mm:ssZZ");
  return value != undefined ? format : "";
}

function formatNumber2(params: { value: any }) {
  const format = Number(params.value)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return params.value != undefined ? format : "";
}

function formatNumber(params: { value: any }) {
  const format = Number(params.value)
    .toFixed(xcurrencyFormat)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return params.value != undefined ? format : "";
}

function formatNumberDecimal(params: { value: any }) {
  const format = Number(params.value)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return params.value != undefined ? format : "";
}

function formatNumberValue(value: any) {
  const format = Number(value)
    .toFixed(xcurrencyFormat)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return value != undefined ? format : "";
}

function currencyFormat(params: { value: number }) {
  return (
    "$" +
    params.value
      .toFixed(xcurrencyFormat)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

function formatCurrency(
  amount: any,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substring(0, j) + thousands : "") +
      i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - parseInt(i))
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

function countDecimalPlaces(amount: number) {
  let str = amount.toString();
  if (!str.includes(".")) return 0; // No decimal part

  let decimalPart = str.split(".")[1].replace(/0+$/, ""); // Remove trailing zeros

  return decimalPart.length <= 3 ? decimalPart.length : 3;
}

function filterKey(e: { key: any; preventDefault: () => any }) {
  const key = e.key;

  // If is '.' key, stop it
  if (key === ".") return e.preventDefault();

  // OPTIONAL
  // If is 'e' key, stop it
  if (key === "e") return e.preventDefault();
}

function snake2Pascal(str: any) {
  str += "";
  str = str.split("_");

  function upper(str: any) {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
  }

  for (let i = 0; i < str.length; i++) {
    const str2 = str[i].split("/");
    for (let j = 0; j < str2.length; j++) {
      str2[j] = upper(str2[j]);
    }
    str[i] = str2.join("");
  }
  return str.join("");
}

function snake2PascalCaseObject(params: any) {
  const obj = params;
  //convert key snake_case to PascalCase
  for (const key in obj) {
    const keyPascalCase = snake2Pascal(key);
    obj[keyPascalCase] = obj[key];
    if (typeof obj[keyPascalCase] === "object") {
      for (const key2 in obj[key]) {
        const keyPascalCase2 = snake2Pascal(key2);
        obj[keyPascalCase][keyPascalCase2] = obj[key][key2];
        delete obj[key][key2]; // Or obj[key] = undefined if that's okay for your use case
      }
    }
  }
  return obj;
}

function toCurrency(value: number | bigint) {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

// This can also prevent copy + paste invalid character
function filterInput(e: { target: { value: string } }) {
  e.target.value = e.target.value.replace(/[^0-9]+/g, "");
}

function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //New Code
  return new Blob([ab], {
    type: mimeString,
  });
}

function capitalize(value: string) {
  if (!value) return "";
  value = value.toString();
  const arr = value.split(" ");
  const capitalized_array: Array<any> = [];
  arr.forEach((word: string) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalized_array.push(capitalized);
  });
  return capitalized_array.join(" ");
}

export {
  countDecimalPlaces,
  capitalize,
  formatTime,
  formatTimeValue,
  formatDate,
  formatDate2,
  formatDate3,
  formatDateTimeXX1,
  formatDateTime,
  formatDateDatabase,
  formatDateTimeDatabase,
  formatDateTimeZone,
  formatNumber,
  formatNumberValue,
  currencyFormat,
  toCurrency,
  filterKey,
  filterInput,
  dataURItoBlob,
  countDecimals,
  formatDateDatabaseAddWeek,
  xcurrencyFormat,
  formatDateTime2,
  formatDateTimeUTC,
  formatFullDate,
  formatFullDateX,
  snake2Pascal,
  snake2PascalCaseObject,
  formatDateTimeZeroUTC,
  formatCurrency,
  formatNumber2,
  formatNumberDecimal,
};
