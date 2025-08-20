import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Frais} from "../models/frais";

@Injectable({
  providedIn: 'root'
})
export class FraisService {

  public contextPath: string = environment.hostmicroservicepersonnel + "frais";

  constructor(private httpClient: HttpClient) {}

  public listerFraisPage(page: number, size: number, sort: string): Observable<Frais> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Frais>(url, { observe: 'response' });
  }

  public creerFrais(data: any): Observable<Frais> {
    return this.httpClient.post<Frais>(
      this.contextPath,
      data
    );
  }

  public modifierFrais(id:any, data:any):Observable<Frais>{
    return this.httpClient.patch<Frais>(
      this.contextPath +"/"+id,data)
  }

  public supprimerFrais(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}
