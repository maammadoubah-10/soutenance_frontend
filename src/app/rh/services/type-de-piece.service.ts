import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeDePiece} from "../models/type-de-piece";

@Injectable({
  providedIn: 'root'
})
export class TypeDePieceService {

  public contextPath: string = environment.hostmicroservicepersonnel + "type-pieces";

  constructor(private httpClient: HttpClient) {}

  public listerTypeDePiecePage(page: number, size: number, sort: string): Observable<TypeDePiece> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<TypeDePiece>(url, { observe: 'response' });
  }

  public rechercheTypeDePiecePage(sort: string, designation: string): Observable<TypeDePiece> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<TypeDePiece>(url, { observe: 'response' });
  }

  public creerTypeDePiece(data: any): Observable<TypeDePiece> {
    return this.httpClient.post<TypeDePiece>(
      this.contextPath,
      data
    )
  }

  public modifierTypeDePiece(id:any, data:any):Observable<TypeDePiece>{
    return this.httpClient.patch<TypeDePiece>(
      this.contextPath +"/"+id,data)
  }

  public supprimerTypeDePiece(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheTypeDePiece(nom: string): Observable<TypeDePiece> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<TypeDePiece>(url, { observe: 'response' });
  }

}
