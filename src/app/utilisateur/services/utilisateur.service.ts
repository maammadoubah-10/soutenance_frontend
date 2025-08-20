import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../../roles/models/role.model';
import { Utilisateur, UtilisateurDto } from '../models/utilisateur';
import { Statistique } from '../models/statistique';

const ROOT = environment.hostmicroserviceutilisateur.replace(/\/+$/, ''); // ex: http://localhost:9001/utilisateur
const join = (base: string, path: string) => `${base}/${path.replace(/^\/+/, '')}`;

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

  afficherLesStatistiquesUtilisateurs(): Observable<Statistique[]> {
    return this.http.get<Statistique[]>(join(this.base, 'statistiques'));
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
  creerUtilisateur(dto: UtilisateurDto): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.base, dto).pipe(map(u => this.normalize(u)));
  }

  modifierUtilisateur(id: number, dto: Partial<UtilisateurDto>): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(join(this.base, String(id)), dto).pipe(map(u => this.normalize(u)));
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
}
