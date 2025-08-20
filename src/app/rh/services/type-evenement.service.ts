import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeEvenement} from "../models/type-evenement";

@Injectable({
  providedIn: 'root'
})
export class TypeEvenementService {

  public contextPath: string = environment.hostmicroservicepersonnel + "type-evenements";

  constructor(private httpClient: HttpClient) {}

  public listerTypeEvenementPage(page: number, size: number, sort: string): Observable<TypeEvenement> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<TypeEvenement>(url, { observe: 'response' });
  }

  public rechercheTypeEvenementPage(sort: string, designation: string): Observable<TypeEvenement> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<TypeEvenement>(url, { observe: 'response' });
  }

  public creerTypeEvenement(data: any): Observable<TypeEvenement> {
    return this.httpClient.post<TypeEvenement>(
      this.contextPath,
      data
    )
  }

  public modifierTypeEvenement(id:any, data:any):Observable<TypeEvenement>{
    return this.httpClient.patch<TypeEvenement>(
      this.contextPath +"/"+id,data)
  }

  public supprimerTypeEvenement(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheTypeEvenement(nom: string): Observable<TypeEvenement> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<TypeEvenement>(url, { observe: 'response' });
  }
}
