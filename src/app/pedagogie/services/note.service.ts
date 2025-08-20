import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Commentaire} from "../models/commentaire";
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import { Note } from '../models/note';

const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public contextPath: string = environment.hostmicroservicepedagogie + "requerantnote";

  constructor(private http: HttpClient) { }


  public afficherLesNotes(): Observable<Note[]>{
    return this.http.get<Note[]>(this.contextPath + '/listes')
  }

  public creerNote(preInscriptionId: any, data: any): Observable<Note> {
    return this.http.post<Note>(
      this.contextPath + "/enregistrer/" + preInscriptionId, data)
  }

  public afficherLesNotesNiveauPreinscription(preInscription: any, niveau: any): Observable<Note[]>{
    return this.http.get<Note[]>(this.contextPath + '/preinscription/' +preInscription + '/niveau?niveau=' + niveau )
  }

  public listerNoteParPreinscription(preInscription: number): Observable<Note[]> {
    return this.http.get<Note[]>(this.contextPath +"/preinscription/" + preInscription);
  }

  public modifierNote(id: any, data: any): Observable<Note> {
    return this.http.patch<Note>(
      this.contextPath + "/" + id, data)
  }

  public supprimerNote(id: number) {
    return this.http.delete<any>(this.contextPath + "/" + id);
  }

  telechargerFichier(fileCode: string): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/telechargement/${fileCode}`;

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
