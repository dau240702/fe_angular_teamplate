import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) return value;

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(value);
    const formatter = new Intl.DateTimeFormat('vi-VN', options);

    return formatter.format(date);
  }

}
