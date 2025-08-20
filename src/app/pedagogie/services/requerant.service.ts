import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Requerant } from '../models/requerant';

const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class RequerantService {

  public contextPath: string = environment.hostmicroservicepedagogie + "requerant";

  constructor(private http: HttpClient) { }

  public listerPartenaireParPays(pays: any): Observable<Requerant[]>{
    return this.http.get<Requerant[]>(this.contextPath + '/listes/partenaire/pays?pays=' +pays)
  }

  
}
