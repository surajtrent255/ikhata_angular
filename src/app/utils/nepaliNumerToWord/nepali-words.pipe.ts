import { NgxNepaliNumberToWordsService } from './ngx-nepali-number-to-words.service';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe for Nepali Words
 *
 */
@Pipe({
  name: 'nepaliWords'
})

export class NepaliWordsPipe implements PipeTransform {

  /**
   * Default constructor
   * @param nepaliNumberToWordsService 
   */
  constructor(private nepaliNumberToWordsService: NgxNepaliNumberToWordsService) {

  }

  /**
   * Transformation to Nepali Words
   * @param value Value to be convert
   * @param format Format of converted word
   */
  transform(value: any, format: string = 'text'): string {
    //Return converted nepali words
    return this.nepaliNumberToWordsService.toWords(value, format);
  }

}
