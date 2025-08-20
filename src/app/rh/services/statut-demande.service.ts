import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StatutDemande} from "../models/statut-demande";

@Injectable({
  providedIn: 'root'
})
export class StatutDemandeService {

  public contextPath: string = environment.hostmicroservicepersonnel + "statut-demandes";

  constructor(private httpClient: HttpClient) {}

  public listerStatutDemandePage(page: number, size: number, sort: string): Observable<StatutDemande> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<StatutDemandes>(url, { observe: 'response' });
  }

  public rechercheStatutDemandePage(sort: string, designation: string): Observable<StatutDemande> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<StatutDemandes>(url, { observe: 'response' });
  }

  public rechercheStatutDemande(nom: string): Observable<StatutDemande> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Entites>(url, { observe: 'response' });
  }

  public creerStatutDemande(data: any): Observable<StatutDemande> {
    return this.httpClient.post<StatutDemande>(
      this.contextPath,
      data
    );
  }

  public modifierStatutDemande(id:any, data:any):Observable<StatutDemande>{
    return this.httpClient.patch<StatutDemande>(
      this.contextPath +"/"+id,data)
  }

  public supprimerStatutDemande(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}
