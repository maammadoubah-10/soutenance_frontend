import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur';
import { RolesService } from '../../../roles/services/roles.service';
import { Role } from '../../../roles/models/role.model';

@Component({
  selector: 'app-utilisateur-edit',
  templateUrl: './utilisateur-edit.component.html',
})
export class UtilisateurEditComponent implements OnInit {
  u?: Utilisateur;
  rolesRef: Role[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private api: UtilisateurService,
    private rolesApi: RolesService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.rolesApi.list().subscribe(r => (this.rolesRef = r));
    this.api.afficherLesUtilisateurs().subscribe(list => {
      this.u = list.find(x => x.id === id);
      this.loading = false;
    });
  }

  addRole(roleId: number): void {
    if (!this.u || !roleId) return;
    this.api.ajouterUnRole(this.u.id, [roleId]).subscribe(updated => (this.u = updated));
  }

  removeRole(roleId: number): void {
    if (!this.u) return;
    this.api.retirerUnRole(this.u.id, [roleId]).subscribe(updated => (this.u = updated));
  }

  toggleActif(): void {
    if (!this.u) return;
    this.api.inverserEtatEstActifUtilisateur(this.u.id).subscribe(updated => (this.u = updated));
  }

  toggleAdmin(): void {
    if (!this.u) return;
    this.api.inverserEtatEstAdminUtilisateur(this.u.id).subscribe(updated => (this.u = updated));
  }
}
