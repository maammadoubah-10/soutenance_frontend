import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithSpaces'
})
export class NumberWithSpacesPipe implements PipeTransform {

  transform(montant:string): unknown {
    return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

}
