import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPhoneNumber' })
export class FormatPhoneNumberPipe implements PipeTransform {
  transform(value: string | number, defaultCountry: string = 'BJ'): string {
    if (!value) {
      return '';
    }
    const stringValue = String(value);
    // @ts-ignore
    const phoneNumber = parsePhoneNumberFromString(stringValue, defaultCountry);
    return phoneNumber ? phoneNumber.formatInternational() : stringValue;
  }
}
