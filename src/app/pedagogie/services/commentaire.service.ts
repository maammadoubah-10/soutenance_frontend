import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Commentaire} from "../models/commentaire";
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  public contextPath: string = environment.hostmicroservicepedagogie + "commentaire";

  constructor(private http: HttpClient) { }

  public listerCommentairePage(page: number, size: number, sort: string): Observable<Commentaire> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerCommentaireNoPagePdf(): Observable<Commentaire> {
    const url = `${this.contextPath+ '/listes'}`;
    // @ts-ignore
    return this.http.get<Personnel>(url, { observe: 'response' });
  }

  public afficherLesCommentaires(): Observable<Commentaire[]>{
    return this.http.get<Commentaire[]>(this.contextPath + '/tout')
  }

  public afficherLesCommentairesParId(id : any): Observable<Commentaire[]>{
    return this.http.get<Commentaire[]>(this.contextPath + "/liste/" + id + "/emetteur")
  }

  public listerCommentaireNoPage(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(this.contextPath +"/listes");
  }

  public creerCommentaire(preInscriptionId: any, data: any): Observable<Commentaire> {
    return this.http.post<Commentaire>(
      this.contextPath + "/enregistrer/" + preInscriptionId, data)
  }

  public listerCommentaireParPreinscriptionNoPage(preInscription: any): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(this.contextPath +"/preinscription/" + preInscription);
  }

  public modifierCommentaire(id: any, data: any): Observable<Commentaire> {
    return this.http.patch<Commentaire>(
      this.contextPath + "/modifier" + id, data)
  }

  telechargerFichierCommentaire(fileCode: string): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/telecharger/${fileCode}`;

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

}
