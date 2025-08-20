import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {PreInscription} from "../models/pre-inscription";
import {catchError} from "rxjs/operators";

const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class PreInscriptionService {

  public contextPath: string = environment.hostmicroservicepedagogie + "preInscription";
  public contextPathPedagogie: string = environment.hostmicroservicepedagogie;

  constructor(private http: HttpClient) { }

  public listerPreInscriptionPage(page: number, size: number, sort: string): Observable<PreInscription> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerPreInscriptionNoPagePdf(): Observable<PreInscription> {
    const url = `${this.contextPath+ '/listes'}`;
    // @ts-ignore
    return this.http.get<Personnel>(url, { observe: 'response' });
  }

  public afficherLesPreInscriptions(): Observable<PreInscription[]>{
    return this.http.get<PreInscription[]>(this.contextPath + '/tout')
  }

  public afficherLesPreInscriptionsEtudiants(status: any, semestre: any, page: number, size: number, sort: string): Observable<PreInscription[]> {
    const url = `${this.contextPath}/listes/etudiant/${semestre}/${status}?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<PreInscription[]>(url);
  }


  //public afficherLesPreInscriptionsEtat(status: any, semestre: any, pays: any): Observable<PreInscription[]>{
   // return this.http.get<PreInscription[]>(this.contextPath + '/liste/etat/' +semestre+ '/' + status + '/' + pays)
  //}

  public afficherLesPreInscriptionsEtat(status: any, semestre: any, pays: any, page: number, size: number, sort: string): Observable<PreInscription[]> {
    const url = `${this.contextPath}/listes/etat/${semestre}/${status}/${pays}?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<PreInscription[]>(url);
  }


  //public afficherLesPreInscriptionsPartenaire(status: any, semestre: any, pays: any): Observable<PreInscription[]>{
   // return this.http.get<PreInscription[]>(this.contextPath + '/liste/partenaire/' +semestre+ '/' + status + '/' + pays)
  //}

  public afficherLesPreInscriptionsPartenaire(semestre: any, status: any, partenaire: any, pays: any, page: number, size: number, sort: string): Observable<PreInscription[]> {
    const url = `${this.contextPath}/listes/partenaire/${semestre}/${status}/${partenaire}/pays?pays=${pays}&page=${page}&size=${size}&sort=${sort}&`;
    return this.http.get<PreInscription[]>(url);
  }

  public afficherLesPreInscriptionsPartenairePays(status: any, semestre: any, pays: any, partenaire: any): Observable<PreInscription[]>{
    return this.http.get<PreInscription[]>(this.contextPath + '/liste/partenaire/' +semestre+ '/' + status + '/' + partenaire + '/pays?pays=' + pays )
  }

  public afficherLesPreInscriptionsParId(id : any): Observable<PreInscription[]>{
    return this.http.get<PreInscription[]>(this.contextPath + "/liste/" + id + "/emetteur")
  }

  public afficherLesPreInscriptionsParRecepteur(id : any): Observable<PreInscription[]>{
    return this.http.get<PreInscription[]>(this.contextPath + "/listes/" + id + "/recepteur")
  }

  public afficherLesPreInscriptionsParEmetteur(id : any): Observable<PreInscription[]>{
    return this.http.get<PreInscription[]>(this.contextPath + "/listes/" + id + "/emetteur")
  }

  public listerPreInscriptionNoPage(): Observable<PreInscription[]> {
    return this.http.get<PreInscription[]>(this.contextPath +"/listes");
  }

  public creerPreInscription(requerantId: any, data: any): Observable<PreInscription> {
    return this.http.post<PreInscription>(
      this.contextPath + "/new/" + requerantId+ "/projet", data)
  }

  public changerStatutPreinscription(id: any, statut: any): Observable<any> {
    return this.http.post<any>(
      this.contextPath + "/statut/" + id, statut)
  }

/*   public changerStatutPreinscription(statut: any): Observable<any> {
    return this.http.post<any>(
      this.contextPath + "/statut/", statut)
  } */

  public creerPreInscriptionEtudiant2(requerantId: any, data: any): Observable<PreInscription> {
    return this.http.post<PreInscription>(
      this.contextPath + "/new/" + requerantId + "/etudiant", data)
  }

  public creerPreInscriptionEtudiant(requerantId: any, data: any): Observable<PreInscription> {
    return this.http.post<PreInscription>(
      this.contextPath + "/save/" + requerantId + "/etudiant", data)
  }

  public modifierPreInscription(id: any, data: any): Observable<PreInscription> {
    return this.http.patch<PreInscription>(
      this.contextPath + "/modifier" + id, data)
  }




  //////////////////BRASS

  public creerPreInscriptions(requerantId: any, data: any): Observable<PreInscription> {
    return this.http.post<PreInscription>(
      this.contextPath + "/simpl/many/" + requerantId, data)
  }

  public creerPreInscriptionsEtudiant(requerantId: any, data: any): Observable<PreInscription> {
    return this.http.post<PreInscription>(
      this.contextPath + "/simpl/" + requerantId, data)
  }

  public creeDossierPreInscriptionsEtudiantBac( preInscriptionId:number,requerantId: number, data: any): Observable<PreInscription> {
    return this.http.patch<PreInscription>(
      this.contextPath + `/${preInscriptionId}/bac/` + requerantId, data)
  }

  public creeDossierPreInscriptionsEtudiantSemestre( preInscriptionId:number,requerantId: number, data: any): Observable<PreInscription> {
    return this.http.patch<PreInscription>(
      this.contextPath + `/${preInscriptionId}/trimestres/` + requerantId, data)
  }

  public creeDossierPreInscriptionsEtudiantOneSemestre( preInscriptionId:number,requerantId: number, data: any): Observable<PreInscription> {
    return this.http.patch<PreInscription>(
      this.contextPath + `/${preInscriptionId}/oneTrimestre/` + requerantId, data)
  }

  public creeDossierPreInscriptionsEtudiantDossier(preInscriptionId:number, data: any): Observable<PreInscription> {
    return this.http.post<PreInscription>(
      this.contextPath + `/dossier-piece/add/${preInscriptionId}` , data)
  }

  public listerRequerantParStructurePage(structureId: number, page: number, size: number, sort: string): Observable<PreInscription> {
    const url = `${this.contextPathPedagogie +`requerant/requerants-par-structure/${structureId}`}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerNonBoursierEnAttentePage( page: number, size: number, sort: string): Observable<PreInscription> {
    const url = `${this.contextPathPedagogie +`requerant/etudiants/non-valides`}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerNonBoursierValidePage( page: number, size: number, sort: string): Observable<PreInscription> {
    const url = `${this.contextPathPedagogie +`requerant/etudiants/valides`}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }


  public listerNonBoursierNonValidePage( page: number, size: number, sort: string): Observable<PreInscription> {
    const url = `${this.contextPathPedagogie +`requerant/etudiants/rejetees`}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerMoyennePreInscription(preIncriptionId: number): Observable<PreInscription> {
    const url = `${this.contextPath +`/${preIncriptionId}/moyenne`}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerPreInscriptionEtudiantPage(requerantId: number, page: number, size: number, sort: string): Observable<PreInscription> {
    const url = `${this.contextPath +`/liste/${requerantId}`}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  telechargerFichierPreInscription(fileCode : string): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/telecharger/filecode/${fileCode}`;

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

  public supprimerSemestrePreInscription(preInscriptionId: number, trimestreId: number) {
    return this.http.delete<any>(`${this.contextPath}/${preInscriptionId}/deleteOnetrimestre/${trimestreId}`);
  }


  public supprimerPieceInscription(preInscriptionId: number, pieceDossierId: number) {
    return this.http.delete<any>(`${this.contextPath}/preInscription/${preInscriptionId}/dossier-piece/${pieceDossierId}/delete`);
  }

  // public supprimerPreInscriptionEtudiant(requerantId: number, inscriptionId: number) {
  //   return this.http.delete<any>(`${this.contextPath}/requerant/${requerantId}/delete/${inscriptionId}/`);
  // }

  public supprimerRequerant(requerantId: number) {
    return this.http.delete<any>(`${this.contextPathPedagogie}requerant/${requerantId}/`);
  }

  public validerPreInscriptionNonBoursier(id: any, semestre: string, valideurId:number): Observable<PreInscription> {
    return this.http.patch<PreInscription>(
      this.contextPath + "/valider/preInscription/" + id+ `/${semestre}/valideur/${valideurId}`, null)
  }

  public rejeterPreInscriptionNonBoursier(id: any, valideurId:number, motif: string): Observable<PreInscription> {
    return this.http.patch<PreInscription>(
      this.contextPath + "/refuser/preInscription/" + id +`/valideur/${valideurId}/motif/${motif}`, null)
  }



  ////////////////////////////
}
