import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contrat} from "../models/contrat";
import {catchError} from "rxjs/operators";
import {Competence} from "../models/competence";

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  public contextPath: string = environment.hostmicroservicepersonnel + "competences";

  constructor(private httpClient: HttpClient) {}

  public listerCompetencePersonnelPage(id:number,page: number, size: number, sort: string): Observable<Competence> {
    const url = `${this.contextPath + '/colloques-seminaires/' + id}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Competence>(url, { observe: 'response' });
  }

  public listerCompetencePersonnelQualifPage(id:number,page: number, size: number, sort: string): Observable<Competence> {
    const url = `${this.contextPath + '/formations-qualifiantes/' + id}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Competence>(url, { observe: 'response' });
  }

  public listerCompetencePersonnelCVPage(id:number,page: number, size: number, sort: string): Observable<Competence> {
    const url = `${this.contextPath + '/cv/' + id}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Competence>(url, { observe: 'response' });
  }
  public listerCompetencePersonnelDiplomantePage(id:number,page: number, size: number, sort: string): Observable<Competence> {
    const url = `${this.contextPath + '/formations-diplomantes/'+ id}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Competence>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  // public creerCompetence(data: any): Observable<Competence> {
  //   return this.httpClient.post<Competence>(
  //     this.contextPath,
  //     data
  //   );
  // }

  public creerCompetence(onlyOfficeModel: any): Observable<Competence> {
    const url = `${this.contextPath + '/colloque-seminaire'}`;

    return this.httpClient.post<Competence>(
      url,
      onlyOfficeModel
    );
  }

  public creerCompetenceQualifiante(onlyOfficeModel: any): Observable<Competence> {
    const url = `${this.contextPath + '/formation-qualifiante'}`;

    return this.httpClient.post<Competence>(
      url,
      onlyOfficeModel
    );
  }
  public creerCompetenceDiplome(onlyOfficeModel: any): Observable<Competence> {
    const url = `${this.contextPath + '/formation-diplomante'}`;

    return this.httpClient.post<Competence>(
      url,
      onlyOfficeModel
    );
  }

  public creerCompetenceCV(onlyOfficeModel: any): Observable<Competence> {
    const url = `${this.contextPath + '/cv'}`;

    return this.httpClient.post<Competence>(
      url,
      onlyOfficeModel
    );
  }




  public modifierCompetence(id:any, data:any):Observable<Competence>{
    return this.httpClient.patch<Competence>(
      this.contextPath +"/update/"+id,data)
  }

  public supprimerCompetence(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirAllCompetencePersonnel(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/latest/'+id
    )}


  public voirUnCompetencePersonnel(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+'/'+id
    )}
  public listerAvenantCompetence(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/'+ id + '/avenants'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  telechargerFichierCompetence(CompetenceId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${CompetenceId}/telecharger/`;

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
