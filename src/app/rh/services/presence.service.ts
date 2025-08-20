import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Presence} from "../models/presence";
import {Personnel} from "../models/personnel";

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  public contextPath: string = environment.hostmicroservicepersonnel + "presences";

  constructor(private httpClient: HttpClient) {}

  public listerPresenceALLPage(page: number, size: number, sort: string, mois?: number, annee?: number, serviceId?: number): Observable<Presence> {
    const url = `${this.contextPath}/rechercher?` +
      `page=${page}&size=${size}&sort=${sort}` +
      (mois !== undefined ? `&mois=${mois}` : '') +
      (annee !== undefined ? `&annee=${annee}` : '') +
      (serviceId !== undefined ? `&serviceId=${serviceId}` : '');

    // @ts-ignore
    return this.httpClient.get<Presence>(url, { observe: 'response' });
  }

  public listerPresenceMarqueALLPage(page: number, size: number, sort: string, mois?: number, annee?: number, serviceId?: number): Observable<Presence> {
    const url = `${this.contextPath}/rechercher/valider?` +
      `page=${page}&size=${size}&sort=${sort}` +
      (mois !== undefined ? `&mois=${mois}` : '') +
      (annee !== undefined ? `&annee=${annee}` : '') +
      (serviceId !== undefined ? `&serviceId=${serviceId}` : '')
    // @ts-ignore
    return this.httpClient.get<Presence>(url, { observe: 'response' });
  }




  public listerPresencePersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/personnel/'+ personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  // public creerPresence(data: any): Observable<Presence> {
  //   return this.httpClient.post<Presence>(
  //     this.contextPath,
  //     data
  //   );
  // }

  public creerPresence(personnelId: number, nbreJourAbsent: number, mois: number): Observable<Presence> {
    const url = `${this.contextPath}?nbreJourAbsent=${nbreJourAbsent}&personnelId=${personnelId}&mois=${mois}`;
    return this.httpClient.post<Presence>(url, null);
  }

  public validerPresence(presenceId : number, nbreJourAbsent: number): Observable<Presence> {
    const url = `${this.contextPath}?nbreJourAbsent=${nbreJourAbsent}&personnelId=${presenceId}`;
    return this.httpClient.patch<Presence>(url, null);
  }


  public modifierPresence(id: any, nbreJourAbsent: number): Observable<Presence> {
    const url = `${this.contextPath}/${id}?nbreJourAbsent=${nbreJourAbsent}`;

    return this.httpClient.patch<Presence>(
      url, ''
    );
  }


  public annulerValidationPresence(id:any, data:any):Observable<Presence>{
    return this.httpClient.patch<Presence>(
      this.contextPath +"/"+id +"/invalide",data)
  }

  public validerALLPresence(presenceIds: Array<number>, data: any): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));

    return this.httpClient.patch<Presence>(
      `${this.contextPath}/confirmeAll`, data, { params }
    );
  }

  public annulervalidationALLPresence(presenceIds: Array<number>, data: any): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));

    return this.httpClient.patch<Presence>(
      `${this.contextPath}/invalideAll`, data, { params }
    );
  }



  public supprimerPresence(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirPresence(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}}
