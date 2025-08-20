// src/app/utilisateur/pages/utilisateur-form/utilisateur-form.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { RolesService } from '../../../roles/services/roles.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { PersonnelsRhService, EtatCivilCreate } from '../../services/personnels-rh.service';

import { Role } from '../../../roles/models/role.model';
import { PersonnelLite } from '../../models/personnel-lite.model';

@Component({
  selector: 'app-utilisateur-form',
  templateUrl: './utilisateur-form.component.html',
  styleUrls: ['./utilisateur-form.component.scss']
})
export class UtilisateurFormComponent implements OnInit {
  // Recherche RH
  qNom = '';
  qPrenom = '';
  results: PersonnelLite[] = [];
  selected: PersonnelLite | null = null;

  // Infos utilisateur
  email = '';
  rolesRef: Role[] = [];
  selectedRoleIds = new Set<number>();

  // États UI
  saving = false;
  private search$ = new Subject<void>();

  // Modal “ajout de personnel”
  showAdd = false;
  newPers: EtatCivilCreate = { nom: '', prenom: '', email: '' };
  creating = false;
  apiError = '';

  constructor(
    private rh: PersonnelsRhService,
    private rolesApi: RolesService,
    private usersApi: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Rôles
    this.rolesApi.list().subscribe(r => (this.rolesRef = r || []));

    // Auto-complétion RH
    this.search$
      .pipe(
        debounceTime(250),
        switchMap(() => this.rh.search(this.qNom.trim(), this.qPrenom.trim(), 0, 10))
      )
      .subscribe({
        next: (res) => (this.results = res || []),
        error: () => (this.results = [])
      });

    // premier affichage (liste vide tant qu'on n'a pas tapé)
    this.search();
  }

  // Lance/relance la recherche
  search(): void { this.search$.next(); }

  // Sélection d’un personnel (ligne/table)
  pick(p: PersonnelLite): void {
    this.selected = p;
    this.email = p.etatCivil?.email || '';
  }

  // Gestion des rôles (checkbox)
  toggleRole(id: number, ev: Event): void {
    const checked = (ev.target as HTMLInputElement).checked;
    if (checked) this.selectedRoleIds.add(id);
    else this.selectedRoleIds.delete(id);
  }

  // Création de l’utilisateur
  save(): void {
    if (!this.selected || !this.email || this.selectedRoleIds.size === 0) return;
    this.saving = true;

    this.usersApi.creerUtilisateur({
      email: this.email,
      role: Array.from(this.selectedRoleIds),
      personnelid: this.selected.id!,
      personnel: this.selected.id!,   // compat
      motdepasse: ''                  // si votre back le rend optionnel, laissez vide
    } as any).subscribe({
      next: () => {
        this.saving = false;
        alert('Utilisateur créé. Un email de réinitialisation sera envoyé si configuré.');
        this.router.navigate(['/espacedetravail/utilisateur']);
      },
      error: (err) => {
        this.saving = false;
        alert(err?.error?.message || 'Échec de la création.');
      }
    });
  }

  // ---------- Modale “Ajouter un personnel” ----------
  openAdd(): void {
    this.apiError = '';
    this.newPers = { nom: this.qNom || '', prenom: this.qPrenom || '', email: this.email || '' };
    this.showAdd = true;
  }

  cancelAdd(): void { this.showAdd = false; }

  submitAdd(): void {
    if (!this.newPers.nom?.trim() || !this.newPers.prenom?.trim()) return;
    this.creating = true;
    this.apiError = '';

    this.rh.createQuick(this.newPers).subscribe({
      next: (p) => {
        this.creating = false;
        this.showAdd = false;
        // Ajoute en tête de liste et sélectionne
        this.results = [p, ...this.results];
        this.pick(p);
      },
      error: (e) => {
        this.creating = false;
        this.apiError = e?.error?.message || 'Création impossible (vérifie doublons côté RH).';
      }
    });
  }

  // utilitaire pour surligner la ligne active
  isActive(p: PersonnelLite): boolean {
    return !!this.selected && this.selected.id === p.id;
  }
}
