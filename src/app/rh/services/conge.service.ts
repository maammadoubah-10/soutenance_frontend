import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Conge} from "../models/conge";

@Injectable({
  providedIn: 'root'
})
export class CongeService {

  public contextPath: string = environment.hostmicroservicepersonnel + "conges";

  constructor(private httpClient: HttpClient) {}

  public listerCongePage(page: number, size: number, sort: string): Observable<Conge> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Conges>(url, { observe: 'response' });
  }

  public rechercheCongePage(sort: string, designation: string): Observable<Conge> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Conges>(url, { observe: 'response' });
  }

  public rechercheConge(nom: string): Observable<Conge> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Conge>(url, { observe: 'response' });
  }

  public creerConge(data: any): Observable<Conge> {
    return this.httpClient.post<Conge>(
      this.contextPath,
      data
    );
  }

  public modifierConge(id:any, data:any):Observable<Conge>{
    return this.httpClient.patch<Conge>(
      this.contextPath +"/"+id,data)
  }

  public supprimerConge(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }


  telechargerTitreConge(id:number): Observable<any> {
    const url = `${this.contextPath+'/'+id+'/telecharger'}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  }


  public voirConge(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}

}
