import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Requerant, RequerantDto} from "../models/requerant";
import {environment} from "../../../environments/environment";
const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
  })

export class PedagogieService {

    public contextPath: string = environment.hostmicroservicepedagogie + "requerant";

    constructor(private http: HttpClient) { }


    // modifierRequerant(id: number, requerantDto: any): Observable<any> {
    //   const url = `${this.contextPath}/${id}`;
    //   return this.http.patch<any>(url, requerantDto);
    // }

    public modifierRequerant(id: any, data: any): Observable<Requerant> {
      return this.http.patch<Requerant>(
        this.contextPath + "/" + id, data)
    }

    public getRequerantWithTuteur(requerantId: number): Observable<Requerant> {
      const url = `${this.contextPath}/details/${requerantId}`;
      return this.http.get<Requerant>(url);
    }


    public supprimerRequerant(id: number): Observable<any> {
      const url = `${this.contextPath}/${id}`;
      return this.http.delete<any>(url);
    }


    public listerRequerantNoPagePdf(): Observable<Requerant> {
        const url = `${this.contextPath+ '/listes'}`;
        // @ts-ignore
        return this.http.get<Personnel>(url, { observe: 'response' });
    }

    public afficherLesRequerants(): Observable<Requerant[]>{
        return this.http.get<Requerant[]>(this.contextPath + '/requerant-non-actif')
      }

    public listerRequerantNoPage(): Observable<Requerant[]> {
        return this.http.get<Requerant[]>(this.contextPath +"/requerant-non-actif");
    }

  public rechercheRequerantParNom(nom: string): Observable<Requerant> {
    const url = `${this.contextPath + "/parNomPrenom"}?nom=${nom}`;
    // @ts-ignore
    return this.http.get<Requerant>(url, { observe: 'response' });
  }

  public rechercheRequerantParNomPrenom(nom: string): Observable<Requerant> {
    const url = `${this.contextPath + "/parNomPrenom"}?nom=${nom}`;
    // @ts-ignore
    return this.http.get<Requerant>(url, { observe: 'response' });
  }

  public rechercheRequerantParEmail(email: string): Observable<Requerant> {
    const url = `${this.contextPath + "/"}${email}`;
    // @ts-ignore
    return this.http.get<Requerant>(url, { observe: 'response' });
  }


//////////////////// PEDAGOGIE BCLB

  public listerRequerantPage(page: number, size: number, sort: string): Observable<Requerant> {
    const url = `${this.contextPath+'/requerant-non-actif'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Requerant>(url, { observe: 'response' });
  }

  public listerRequerantValidePage(page: number, size: number, sort: string): Observable<Requerant> {
    const url = `${this.contextPath+'/ministere-partenaire'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Requerant>(url, { observe: 'response' });
  }


  telechargerFichierRequerant(requerantId: number,fileCode : string): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${requerantId}/telecharger/${fileCode}`;

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
    return this.http.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }
  private handleError(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }


  public confirmationDeRequerant(email: any): Observable<Requerant> {
    return this.http.patch<Requerant>(
      this.contextPath + `/activationCompteMinistere/${email}`, null)
  }

  public envoiMailAuRequerant(requerantId: number, message: string, objet: string): Observable<Requerant> {
    return this.http.post<Requerant>(
      `${this.contextPath}/mail/send-to/${requerantId}?message=${message}&objet=${objet}`,
      null
    );
  }

}
