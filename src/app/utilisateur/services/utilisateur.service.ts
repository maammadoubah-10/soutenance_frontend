import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import HttpResponse from "../../utilisateur/models/HttpResponse";

import { environment } from '../../../environments/environment';
import { Utilisateur, UtilisateurDto } from '../models/utilisateur';
import { Statistique } from '../models/statistique';
import { Permission } from '../models/permission';
import { Role } from '../models/role';
const host = environment.hostmicroserviceutilisateur;
const hostpersonnel = environment.hostmicroservicepersonnel;
const ROOT = environment.hostmicroserviceutilisateur.replace(/\/+$/, ''); // ex: http://localhost:9001/utilisateur
const join = (base: string, path: string) => `${base}/${path.replace(/^\/+/, '')}`;

  const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class UtilisateurService {



  private http = inject(HttpClient);

  // Base unique pour toutes les routes "utilisateurs"
  private base = join(ROOT, 'utilisateurs');

  // -------- Normalisation backend -> front
  private normalize(u: any): Utilisateur {
    return {
      ...u,
      estActif: u.estActif ?? u.est_actif ?? false,
      roles: u.roles ?? [],
    } as Utilisateur;
  }



  // -------- Lecture
  afficherLesUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<any[]>(this.base)
      .pipe(map(list => (list || []).map(u => this.normalize(u))));
  }

  afficherLesStatistiquesUtilisateurs(): Observable<Statistique> {
  return this.http.get<Statistique>(join(this.base, 'statistiques'));
}


  getByEmail(email: string): Observable<{
    id: number; email: string; estAdmin: boolean; estActif: boolean; roles: string[];
  }> {
    return this.http.get(join(this.base, encodeURIComponent(email))) as any;
  }

  afficherLesRolesDeLutilisateur(id: number): Observable<Role[]> {
    return this.http.get<Role[]>(join(this.base, `${id}/roles`));
  }

  listePermissions(email: string): Observable<string[]> {
    return this.http.get<string[]>(join(this.base, `permissions/${encodeURIComponent(email)}`));
  }

  // -------- Création / MAJ / suppression
  // (1) create utilisé par ton nouveau formulaire
  create(dto: { email?: string; role: number[]; personnelid: number; personnel?: number; motdepasse?: string; }) {
    const body = {
      email: dto.email || undefined,   // si vide, le back peut reprendre l'email RH
      role: dto.role,
      personnelid: dto.personnelid,
      personnel: dto.personnelid,      // doublon volontaire pour compat
    };
    return this.http.post<any>(this.base, body); // ✅ plus de this.API
  }

  // (2) garder aussi l’ancienne signature si tu l’utilises ailleurs
  public creerUtilisateur(data: any): Observable<any> {
    return this.http.post<any>(
      host + 'utilisateurs',
      data
    );
  }

   public modifierUtilisateur(data:any):Observable<any>{
    return this.http.patch<any>(
      host+ 'utilisateurs/'+data.id,
      data)
  }

  supprimerUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(join(this.base, String(id)));
  }

  // -------- Rôles
  ajouterUnRole(utilisateurId: number, roleIds: number[]): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(join(this.base, `${utilisateurId}/ajouter-roles`), roleIds)
      .pipe(map(u => this.normalize(u)));
  }

  retirerUnRole(utilisateurId: number, roleIds: number[]): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(join(this.base, `${utilisateurId}/retirer-roles`), roleIds)
      .pipe(map(u => this.normalize(u)));
  }

  // -------- Toggles admin/actif
  inverserEtatEstActifUtilisateur(utilisateurId: number): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(join(this.base, `${utilisateurId}/inverser-etat`), {})
      .pipe(map(u => this.normalize(u)));
  }

  inverserEtatEstAdminUtilisateur(utilisateurId: number): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(join(this.base, `${utilisateurId}/inverser-admin`), {})
      .pipe(map(u => this.normalize(u)));
  }

  // -------- Avatar & téléchargement
  miseAJourImageProfil(email: string, file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.patch(join(this.base, `miseajourimagedeprofil/${encodeURIComponent(email)}`), form);
  }

  telechargerFichier(code: string): Observable<Blob> {
    return this.http.get(join(this.base, `telechargementdefichier/${encodeURIComponent(code)}`), {
      responseType: 'blob',
    });
  }

  // -------- Auth
  connexion(payload: { email: string; motdepasse: string }): Observable<any> {
    return this.http.post(join(this.base, 'connexion/'), payload);
  }

  connexionDoubleFacteur(payload: { email: string; motdepasse: string }): Observable<any> {
    return this.http.post(join(this.base, 'connexion-double-facteur/'), payload);
  }

  demandeMotDePasseOublie(email: string): Observable<any> {
    return this.http.post(join(this.base, 'motdepasseoublie/'), { email });
  }

  verifierJetonReinit(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(join(this.base, 'verificationdujetondemotdepasse'), { params });
  }

  reinitialiserMotDePasse(token: string, body: { motDePasse: string; confirmationDeMotDePasse: string }): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.patch(join(this.base, 'reinitialisation'), body, { params });
  }

  

    /*
  Permissions début
  */
  afficherLesPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(host + 'permissions/', httpOptions);
  }

  public creerPermission(data: any): Observable<any> {
    return this.http.post<any>(
      host + 'permissions/',
      data
    );
  }

  public modifierPermission(data:any):Observable<any>{
    return this.http.patch<any>(
      host+ 'permissions/'+data.id,
      data)
  }
  
  public supprimerPermission(id: number) {
    return this.http.delete<any>(host + 'permissions/' + id);
  }

  afficherLesPermissionsPageRecherches(page: number = 0, size: number = 10, code: string = ''): Observable<any> {
    const url = `${host+ 'permissions/page'}?page=${page}&size=${size}&code=${code}`;
    // @ts-ignore
    return this.http.get<Permission[]>(url, { observe: 'response' });
  }

  public recherchePermission(search : string) {
    let params = new HttpParams()
      .set('code',search.toString());
    return this.http.get<any>(
      host+ 'permissions/recherche',{params}
    )
  }

  /*
  Permissions fin
  */

 /*
    Role / role début
  */

  afficherLesRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(host + 'roles/', httpOptions);
  }

  public creerRole(data: any): Observable<any> {
    return this.http.post<any>(
      host + 'roles/',
      data
    );
  }

  public modifierRole(data:any):Observable<any>{
    return this.http.patch<any>(
      host+ 'roles/'+data.id,
      data)
  }


  public supprimerRole(id: number) {
    return this.http.delete<any>(host + 'roles/' + id);
  }

  afficherLesRolePageRecherches(page: number = 0, size: number = 10, nom: string = ''): Observable<any> {
    const url = `${host+ 'roles/page'}?page=${page}&size=${size}&nom=${nom}`;
    // @ts-ignore
    return this.http.get<Role[]>(url, { observe: 'response' });
  }

  public retirerUnePermission(id:number,data:any):Observable<any>{
    return this.http.patch<any>(
      host+ 'roles/'+id+'/retirer-permissions',
      data)
  }

  public ajouterUnePermission(id:number,data:any):Observable<any>{
    return this.http.patch<any>(
      host+ 'roles/'+id+'/ajouter-permissions',
      data)
  }

  public rechercheRole(search : string) {
    let params = new HttpParams()
      .set('nom',search.toString());
    return this.http.get<any>(
      host+ 'roles/recherche',{params}
    )
  }

  afficherLesPermissionsDuRole(id: number): Observable<Permission[]>  {
    return this.http.get<Permission[]>(host + `roles/${id}/permissions`);
  }

  /*
  Role / role  Fin
  */


  
  /*
  Utilisateur début
  */

  afficherLesUtilisateursPageRecherches(): Observable<any> {
    const url = `${host+ 'utilisateurs'}`;
    // @ts-ignore
    return this.http.get<Utilisateur[]>(url, { observe: 'response' });
  }

  

  /*
  Utilisateur début
  */


    /*
  Personne début
  */
  personnelNonUtilisateur(): Observable<any[]> {
    return this.http.get<any[]>(hostpersonnel + 'personnels/listes/', httpOptions);
  }

  public recherchePersonnel(search : string) {
    let params = new HttpParams()
      .set('designation',search.toString());
    return this.http.get<any>(
      host+ 'personnels/recherche',{params}
    )
  }

  /*
  Personne début
  */

}


 