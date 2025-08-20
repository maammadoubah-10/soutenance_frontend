import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Avenant} from "../models/avenant";

@Injectable({
  providedIn: 'root'
})
export class AvenantService {
  public contextPath: string = environment.hostmicroservicepersonnel + "avenants";

  constructor(private httpClient: HttpClient) {}

  public listerAvenantPage(page: number, size: number, sort: string): Observable<Avenant> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Avenant>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  public creerAvenant(data: any): Observable<Avenant> {
    return this.httpClient.post<Avenant>(
      this.contextPath,
      data
    );
  }

  public modifierAvenant(id:any, data:any):Observable<Avenant>{
    return this.httpClient.patch<Avenant>(
      this.contextPath +"/"+id,data)
  }

  public supprimerAvenant(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirAvenant(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}


  public activerAvenant(id:any):Observable<Avenant>{
    return this.httpClient.patch<Avenant>(
      this.contextPath +"/"+id+"/activation",
      {})
  }

}
