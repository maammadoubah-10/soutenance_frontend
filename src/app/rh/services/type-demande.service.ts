import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeDemande} from "../models/type-demande";

@Injectable({
  providedIn: 'root'
})
export class TypeDemandeService {

  public contextPath: string = environment.hostmicroservicepersonnel + "type-demandes";

  constructor(private httpClient: HttpClient) {}

  public listerTypeDemandePage(page: number, size: number, sort: string): Observable<TypeDemande> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<TypeDemandes>(url, { observe: 'response' });
  }

  public rechercheTypeDemandePage(sort: string, designation: string): Observable<TypeDemande> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<TypeDemandes>(url, { observe: 'response' });
  }

  public rechercheTypeDemande(nom: string): Observable<TypeDemande> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Entites>(url, { observe: 'response' });
  }

  public creerTypeDemande(data: any): Observable<TypeDemande> {
    return this.httpClient.post<TypeDemande>(
      this.contextPath,
      data
    );
  }

  public modifierTypeDemande(id:any, data:any):Observable<TypeDemande>{
    return this.httpClient.patch<TypeDemande>(
      this.contextPath +"/"+id,data)
  }

  public supprimerTypeDemande(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}
