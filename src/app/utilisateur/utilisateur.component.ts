import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from './services/utilisateur.service';
import { Utilisateur } from './models/utilisateur';

import { Router } from '@angular/router';
import { RolesService } from '../roles/services/roles.service';
import { Role } from '../roles/models/role.model';

@Component({
  selector: 'app-utilisateurs-list',
  templateUrl: './utilisateur.component.html'
})
export class UtilisateurComponent implements OnInit {
  items: Utilisateur[] = [];
  rolesRef: Role[] = [];
  loading = false;
  search = '';

  constructor(
    private api: UtilisateurService,
    private rolesApi: RolesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
    this.rolesApi.list().subscribe(r => (this.rolesRef = r));
  }

  load(): void {
    this.loading = true;
    this.api.afficherLesUtilisateurs().subscribe({
      next: (res) => {
        this.items = this.search
          ? res.filter(u => (u.email || '').toLowerCase().includes(this.search.toLowerCase()))
          : res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  rolesText(u: Utilisateur): string {
    return (u.roles || []).map(r => r.nom).join(', ') || '—';
  }

  addRole(u: Utilisateur, roleId: number): void {
    if (!roleId) return;
    if ((u.roles || []).some(r => r.id === roleId)) return;
    this.api.ajouterUnRole(u.id, [roleId]).subscribe(updated => (u.roles = updated.roles));
  }

  removeRole(u: Utilisateur, roleId: number): void {
    this.api.retirerUnRole(u.id, [roleId]).subscribe(updated => (u.roles = updated.roles));
  }

  toggleActif(u: Utilisateur): void {
    this.api.inverserEtatEstActifUtilisateur(u.id).subscribe(v => (u.estActif = v.estActif));
  }

  toggleAdmin(u: Utilisateur): void {
    this.api.inverserEtatEstAdminUtilisateur(u.id).subscribe(v => (u.estAdmin = v.estAdmin));
  }

  remove(u: Utilisateur): void {
    if (!confirm(`Supprimer ${u.email} ?`)) return;
    this.api.supprimerUtilisateur(u.id).subscribe(() => (this.items = this.items.filter(x => x.id !== u.id)));
  }

  goNew(): void { this.router.navigate(['nouveau']); }
  goEdit(u: Utilisateur): void { this.router.navigate([u.id]); }
}
