import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Affectation} from "../models/affectation";
import {Contrat} from "../models/contrat";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  public contextPath: string = environment.hostmicroservicepersonnel + "contrat";

  constructor(private httpClient: HttpClient) {}

  public listerContratPage(page: number, size: number, sort: string): Observable<Contrat> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Contrat>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  // public creerContrat(data: any): Observable<Contrat> {
  //   return this.httpClient.post<Contrat>(
  //     this.contextPath,
  //     data
  //   );
  // }

  public creerContrat(id: number, piece: any): Observable<Contrat> {
    const url = `${this.contextPath}/create/${id}`;

    return this.httpClient.post<Contrat>(
      url,
      piece
    );
  }


  public modifierContrat(id:any, data:any):Observable<Contrat>{
    return this.httpClient.patch<Contrat>(
      this.contextPath +"/update/"+id,data)
  }

  public supprimerContrat(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirAllContratPersonnel(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/latest/'+id
    )}


  public voirUnContratPersonnel(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+'/'+id
    )}
  public listerAvenantContrat(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/'+ id + '/avenants'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  telechargerFichierContrat(contratId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${contratId}/telecharger/`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  private handleError(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }
}
