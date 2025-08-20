import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Affectation} from "../models/affectation";

@Injectable({
  providedIn: 'root'
})
export class AffectationService {

  public contextPath: string = environment.hostmicroservicepersonnel + "affectations";

  constructor(private httpClient: HttpClient) {}

  public listerAffectationPage(page: number, size: number, sort: string): Observable<Affectation> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Affectation>(url, { observe: 'response' });
  }

  public listerAffectationParPersonnelPage(id : number, page: number, size: number, sort: string): Observable<Affectation> {
    const url = `${this.contextPath +'/personnel/' + id}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Affectation>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  public creerAffectation(data: any): Observable<Affectation> {
    return this.httpClient.post<Affectation>(
      this.contextPath,
      data
    );
  }

  public modifierAffectation(id:any, data:any):Observable<Affectation>{
    return this.httpClient.patch<Affectation>(
      this.contextPath +"/"+id,data)
  }

  public supprimerAffectation(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirAffectation(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}

}
