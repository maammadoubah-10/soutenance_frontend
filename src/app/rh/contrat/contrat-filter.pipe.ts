import { Pipe, PipeTransform } from '@angular/core';
import {Contrat} from "../models/contrat";

@Pipe({
  name: 'contratContFilter'
})
export class ContratFilterPipe implements PipeTransform {

  transform(contrats:Contrat [], searchValue:string): Contrat [] {
    if (!contrats || !searchValue) {
      return contrats;
    }
    return contrats.filter(contrat => (
      contrat.client.raison_social?.toLowerCase().includes(searchValue.toLowerCase()) ||
      contrat.client.nom_complet?.toLowerCase().includes(searchValue.toLowerCase())
    ));
  }
}
