import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { PermissionsService } from '../../../permissions/services/permissions.service';
import { RoleDto } from '../../models/role.model';
import { Permission } from '../../../permissions/models/permission.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  id?: number;
  model: RoleDto = { nom: '', permissions: [] };
  allPermissions: Permission[] = [];
  saving = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rolesApi: RolesService,
    private permsApi: PermissionsService
  ) {}

  ngOnInit(): void {
    const rid = this.route.snapshot.paramMap.get('id');
    if (rid) this.id = +rid;

    this.permsApi.list().subscribe({
      next: (list) => (this.allPermissions = list),
      error: () => (this.errorMsg = 'Impossible de charger les permissions.')
    });

    // (optionnel) si tu exposes GET /roles/{id}, pré-remplis ici
    // if (this.id) { ... }
  }

  trackById = (_: number, p: Permission) => p.id;

  onPermissionChange(id: number, ev: Event): void {
    const checked = (ev.target as HTMLInputElement).checked;
    this.togglePermission(id, checked);
  }

  private togglePermission(id: number, checked: boolean): void {
    const current = new Set(this.model.permissions ?? []);
    if (checked) current.add(id);
    else current.delete(id);
    this.model = { ...this.model, permissions: Array.from(current) };
  }

  save(): void {
    this.saving = true;
    this.errorMsg = '';

    if (this.id) {
      // évite l’union Observable<Role>|Observable<RoleDto>
      this.rolesApi.update(this.id, this.model).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/espacedetravail/roles']);
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = err?.error?.message || 'Échec de la modification.';
        }
      });
    } else {
      this.rolesApi.create(this.model).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/espacedetravail/roles']);
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = err?.error?.message || 'Échec de la création.';
        }
      });
    }
  }
}
