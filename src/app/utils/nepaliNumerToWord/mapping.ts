/**
 * Nepali Words Array Upto Hundred
 */
export const NP_UPTO_HUNDREDS: Array<string> = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
  "Twenty One", "Twenty Two", "Twenty Three", "Twenty Four", "Twenty Five", "Twenty Six", "Twenty Seven", "Twenty Eight", "Twenty Nine", "Thirty",
  "Thirty One", "Thirty Two", "Thirty Three", "Thirty Four", "Thirty Five", "Thirty Six", "Thirty Seven", "Thirty Eight", "Thirty Nine", "Forty",
  "Forty One", "Forty Two", "Forty Three", "Forty Four", "Forty Five", "Forty Six", "Forty Seven", "Forty Eight", "Forty Nine", "Fifty",
  "Fifty One", "Fifty Two", "Fifty Three", "Fifty Four", "Fifty Five", "Fifty Six", "Fifty Seven", "Fifty Eight", "Fifty Nine", "Sixty",
  "Sixty One", "Sixty Two", "Sixty Three", "Sixty Four", "Sixty Five", "Sixty Six", "Sixty Seven", "Sixty Eight", "Sixty Nine", "Seventy",
  "Seventy One", "Seventy Two", "Seventy Three", "Seventy Four", "Seventy Five", "Seventy Six", "Seventy Seven", "Seventy Eight", "Seventy Nine", "Eighty",
  "Eighty One", "Eighty Two", "Eighty Three", "Eighty Four", "Eighty Five", "Eighty Six", "Eighty Seven", "Eighty Eight", "Eighty Nine", "Ninety",
  "Ninety One", "Ninety Two", "Ninety Three", "Ninety Four", "Ninety Five", "Ninety Six", "Ninety Seven", "Ninety Eight", "Ninety Nine",
];


/**
 * Nepali Tenth
 */
export const NP_TENS: object = {
  1: 'one',
  10: 'Ten',
  100: 'Hundred',
  1000: 'Thousand',
  100000: 'Lakh',
  10000000: 'Karod',
  1000000000: 'Arab',
  100000000000: 'Kharab '
};

//Nepali Minus
export const NP_MINUS: string = 'Minus';
//Nepali Decimal Point
export const NP_POINT: string = 'Decimal';

//Maximum Supported number
export const MAX_SUPPORTED_NUMBER: number = 100000000000 * 100 - 1;

// Avaliable word formats
export enum WORD_FORMAT {
  TEXT = 'text',
  MONEY = 'money'
};

// Nepali Money Strings
export const NP_RUPEES: string = 'Rupees';
export const NP_PAISA: string = 'Paisa'
