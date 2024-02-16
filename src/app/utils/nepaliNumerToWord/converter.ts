const NP_UPTO_HUNDREDS: Array<string> = [
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

const NP_TENS: { [key: number]: string } = {
  1: 'one',
  10: 'Ten',
  100: 'Hundred',
  1000: 'Thousand',
  100000: 'Lakh',
  10000000: 'Karod',
  1000000000: 'Arab',
  100000000000: 'Kharab'
};


const NP_MINUS: string = 'Minus';
const NP_POINT: string = 'Rupees';


const MAX_SUPPORTED_NUMBER: number = 100000000000 * 100 - 1;


enum WORD_FORMAT {
  TEXT = 'text',
  MONEY = 'money'
};

const NP_RUPEES: string = '';
const NP_PAISA: string = '';

export class Converter {
  private words: string[] = [];
  private nonFractionalWords: string[] = [];
  private fractionalWords: string[] = [];
  private num !: number | string;
  private format !: string;
  constructor(num: number | string, format: string = 'text') {
    if (!num || isNaN(+num)) {
      console.log(`${num} is not a valid number`);
      return;
    }
    this.num = +num;
    if (Number(this.num) > MAX_SUPPORTED_NUMBER) {
      console.log(`${this.num} is not supported by the library. Maximum supported number is: ${MAX_SUPPORTED_NUMBER}`);
      return;
    }
    this.num = num;
    this.format = format;
    this.toWords();
  }
  private toWords() {
    if (Number(this.num) < 0) {
      this.words = [NP_MINUS];
    }
    this.num = Math.abs(+this.num);
    const decimalMatch = this.num.toString().match(/\.\d+/);
    console.log(decimalMatch);
    if (decimalMatch === null) {
      // this.fractionalWords.push("zero Paisa only");
    }
    else {
      const decimalPart = decimalMatch[0];
      this.convertDecimalWords(decimalPart);
    }

    const value = Math.floor(this.num);
    this.convertToWords(value);
    this.words = [...this.words, ...this.nonFractionalWords, ...this.fractionalWords];
  }

  /**
   * Function that converts the non-fractional part of the number into words
   * @param num
   */
  private convertToWords(num: number | string) {
    // Find length of the current number
    num = +num;
    const numLength: number = num.toString().length;
    // If length is less than or equal to 2, return mapped Nepali string from the hundred mapping
    if (numLength <= 2) {
      this.nonFractionalWords = [...this.nonFractionalWords, NP_UPTO_HUNDREDS[num]];

      // Add "Rupees" at the end of the decimal part if the format is `money`
      if (this.format === WORD_FORMAT.TEXT)
        this.nonFractionalWords.push(NP_RUPEES);
    } else {
      // Evaluate tenth dividend if length is 3 (number belongs to 100 to 999), the dividend is 10**2 i.e 100
      // Eg. num is 1123, then tenthDividend is 10**2 i.e 1000
      let tenthDividend: number = 10 ** (numLength - 1);
      // Search dividend in NP_TENS Object. For both thousand and ten thousand, the dividend is 10**3
      while (!NP_TENS[tenthDividend]) {
        tenthDividend /= 10;
      }
      // Calculate quotient
      // Quotient = 1123/1000 = 1
      const quotient: number = Math.floor(num / tenthDividend);
      // Calculate remainder
      // Remainder = 1123%1000 = 23
      const remainder: number = Math.floor(num % tenthDividend);
      // Prepare word

      const word: string = `${NP_UPTO_HUNDREDS[quotient]} ${NP_TENS[tenthDividend]} `;
      this.nonFractionalWords = [...this.nonFractionalWords, word];

      if (remainder !== 0)

        this.convertToWords(remainder);
    }
  }

  /**
   * Convert decimal part of the provided number into words
   * @param num
   */
  private convertDecimalWords(num: number | string) {
    num = num.toString().slice(1);
    console.log("num = " + num)
    if (Number(num) >= 0.99) {
      num = +num;
      const numLength: number = num.toString().length;
      console.log(num)

      if (numLength <= 2) {
        this.fractionalWords = [...this.fractionalWords, NP_UPTO_HUNDREDS[num]];

        console.log(this.fractionalWords)
        if (this.format === WORD_FORMAT.TEXT)
          this.fractionalWords.push(NP_PAISA);

      } else {
        console.log("error paisa value")
      }

    } else if (Number(num) == null) {

      //   const numLength: number = num.toString().length;
      //   console.log(num)
      //   if (numLength <= 2) {
      //   this.fractionalWords = [NP_UPTO_HUNDREDS[num]];

      //   console.log(this.fractionalWords)
      this.fractionalWords.push("zero " + NP_PAISA);
    }


  }

  /**
   * Function that returns the words string
   */
  public returnWords(): string {
    // Return the joined words array by space
    return this.words.join(' ');
  }
}

//
