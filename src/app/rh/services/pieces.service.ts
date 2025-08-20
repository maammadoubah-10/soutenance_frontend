import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Pieces} from "../models/pieces";

@Injectable({
  providedIn: 'root'
})
export class PiecesService {

  public contextPath: string = environment.hostmicroservicepersonnel + "pieces";

  constructor(private httpClient: HttpClient) {}

  public listerPiecesPage(page: number, size: number, sort: string): Observable<Pieces> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Pieces>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  public creerPieces(data: any): Observable<Pieces> {
    return this.httpClient.post<Pieces>(
      this.contextPath,
      data
    );
  }

  public modifierPieces(id:any, data:any):Observable<Pieces>{
    return this.httpClient.patch<Pieces>(
      this.contextPath +"/"+id,data)
  }

  public supprimerPieces(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirPieces(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}}
