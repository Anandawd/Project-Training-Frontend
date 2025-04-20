const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

function pembilang(nilai: number) {
  nilai = Math.abs(nilai);
  let simpanNilaiBagi = 0;
  const huruf = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];
  let temp = "";

  if (nilai < 12) {
    temp = " " + huruf[nilai];
  } else if (nilai < 20) {
    temp = pembilang(nilai - 10) + " Belas";
  } else if (nilai < 100) {
    simpanNilaiBagi = Math.floor(nilai / 10);
    temp = pembilang(simpanNilaiBagi) + " Puluh" + pembilang(nilai % 10);
  } else if (nilai < 200) {
    temp = " Seratus" + pembilang(nilai - 100);
  } else if (nilai < 1000) {
    simpanNilaiBagi = Math.floor(nilai / 100);
    temp = pembilang(simpanNilaiBagi) + " Ratus" + pembilang(nilai % 100);
  } else if (nilai < 2000) {
    temp = " Seribu" + pembilang(nilai - 1000);
  } else if (nilai < 1000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000);
    temp = pembilang(simpanNilaiBagi) + " Ribu" + pembilang(nilai % 1000);
  } else if (nilai < 1000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000);
    temp = pembilang(simpanNilaiBagi) + " Juta" + pembilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000000);
    temp =
      pembilang(simpanNilaiBagi) + " Miliar" + pembilang(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000000000);
    temp =
      pembilang(nilai / 1000000000000) +
      " Triliun" +
      pembilang(nilai % 1000000000000);
  }

  return temp;
}

function convertMillions(num: number): string {
  if (num >= 1000000) {
    return (
      convertMillions(Math.floor(num / 1000000)) +
      " Million " +
      convert_thousands(num % 1000000)
    );
  }
  return convert_thousands(num);
}

function convert_thousands(num: number): string {
  if (num >= 1000) {
    return (
      convert_hundreds(Math.floor(num / 1000)) +
      " Thousand " +
      convert_hundreds(num % 1000)
    );
  } else {
    return convert_hundreds(num);
  }
}

function convert_hundreds(num: number): string {
  if (num > 99) {
    return ones[Math.floor(num / 100)] + " Hundred " + convert_tens(num % 100);
  } else {
    return convert_tens(num);
  }
}

function convert_tens(num: number): string {
  if (num < 10) return ones[num];
  else if (num >= 10 && num < 20) return teens[num - 10];
  else {
    return tens[Math.floor(num / 10)] + " " + ones[num % 10];
  }
}

function toWords(num: number): string {
  if (num == 0) return "zero";
  else return convertMillions(num);
}

export { toWords, pembilang };
