import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rounding'
})
export class RoundingPipe implements PipeTransform {
  transform(value: number): number {
    return Math.round(value);
  }
}
