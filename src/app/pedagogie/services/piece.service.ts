import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Piece} from "../models/piece";
import {PreInscription} from "../models/pre-inscription";


const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PieceService {

  public contextPath: string = environment.hostmicroservicepedagogie + "piece";

  constructor(private http: HttpClient) { }

  public listerPiecePage(page: number, size: number, sort: string): Observable<Piece> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Piece>(url, { observe: 'response' });
  }

  public listerPieceNoPagePdf(): Observable<Piece> {
    const url = `${this.contextPath+ '/listes'}`;
    // @ts-ignore
    return this.http.get<Personnel>(url, { observe: 'response' });
  }

  public afficherLesPieces(): Observable<Piece[]>{
    return this.http.get<Piece[]>(this.contextPath)
  }

  public listerPieceNoPage(): Observable<Piece[]> {
    return this.http.get<Piece[]>(this.contextPath);
  }

  public creerPiece(data: any): Observable<Piece> {
    return this.http.post<Piece>(
      this.contextPath + "/", data)
  }

  public modifierPiece(id: any, data: any): Observable<Piece> {
    return this.http.patch<Piece>(
      this.contextPath + "/" + id, data)
  }

  public supprimerPiece(id: number) {
    return this.http.delete<any>(this.contextPath + "/" + id);
  }

  // public recherchePieceParLibeller(designation: string): Observable<Piece> {
  //   const url = `${this.contextPath + "/parLibeller"}?designation=${designation}`;
  //   // @ts-ignore
  //   return this.http.get<Piece>(url, { observe: 'response' });
  // }
  public recherchePieceParLibeller(designation: string): Observable<any> {
    const url = `${this.contextPath + "/likeLibeller"}?designation=${designation}`;
    return this.http.get<any>(url); // Retourne un Observable<any>
  }

  public recherchePieceLibeller(designation: string): Observable<any> {
    const url = `${this.contextPath + "/parLibeller"}?designation=${designation}`;
    return this.http.get<any>(url); // Retourne un Observable<any>
  }


}
