import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CritereEvenement} from "../models/critere-evenement";
import {Avisrecrutement} from "../models/avisrecrutement";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";

@Injectable({
  providedIn: 'root'
})
export class AvisRecrutementService {

  public contextPath: string = environment.hostmicroservicepersonnel + "avis-recrutements";

  constructor(private httpClient: HttpClient) {}

  public listerAvisRecrutementPage(page: number, size: number, sort: string): Observable<Avisrecrutement> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Avisrecrutement>(url, { observe: 'response' });
  }

  public rechercheAvisRecrutementPage(sort: string, designation: string): Observable<Avisrecrutement> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Avisrecrutement>(url, { observe: 'response' });
  }
  public voirAvisRecrutement(id:number){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}

  public creerAvisRecrutement(data: any): Observable<Avisrecrutement> {
    return this.httpClient.post<Avisrecrutement>(
      this.contextPath,
      data
    )
  }

  public modifierAvisRecrutement(id:any, data:any):Observable<Avisrecrutement>{
    return this.httpClient.patch<Avisrecrutement>(
      this.contextPath +"/"+id,data)
  }

  public supprimerAvisRecrutement(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheAvisRecrutement(nom: string): Observable<Avisrecrutement> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Avisrecrutement>(url, { observe: 'response' });
  }

  public listerCandidatureAvisRecrutement(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/'+ id + '/candidatures'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  genererRapportStatutCandidatureAvisRecrutement(id:number): Observable<any> {
    const url = `${this.contextPath+'/'+id+'/rapportparstatutcandidature'}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  }

  public voirNombreStatistiques(){
    return this.httpClient.get<any>(
      this.contextPath+ '/statistiques'
    )}
}
