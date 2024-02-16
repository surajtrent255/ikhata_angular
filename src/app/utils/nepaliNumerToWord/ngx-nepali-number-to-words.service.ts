import { Converter } from './converter';
import { Injectable } from '@angular/core';
import { NP_MINUS, NP_UPTO_HUNDREDS, NP_TENS, NP_POINT, MAX_SUPPORTED_NUMBER, NP_RUPEES, NP_PAISA, WORD_FORMAT } from './mapping';
/**
 * Angular Nepali Number to Words Service
 *
 */
@Injectable({
  providedIn: 'root'
})

export class NgxNepaliNumberToWordsService {

  /**
   * Default Constructor
   */
  constructor() { }

  /**
   * Function that converts provided number into corresponding words in nepali
   * @param num
   */
  public toWords(num: number | string, format: string = 'text'): string {
    const convertor = new Converter(num, format);
    return convertor.returnWords();
  }
}

