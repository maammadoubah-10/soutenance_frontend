import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service';
import { PermissionDto } from '../../models/permission.model';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html'
})
export class PermissionFormComponent implements OnInit {
  id?: number;
  model: PermissionDto = { code: '', description: '' };
  saving = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: PermissionsService
  ) {}

  ngOnInit(): void {
    const pid = this.route.snapshot.paramMap.get('id');
    if (pid) {
      this.id = +pid;
      // Décommente si tu exposes GET /permissions/{id}
      // this.api.get(this.id).subscribe({
      //   next: p => this.model = { code: p.code, description: p.description },
      //   error: () => this.errorMsg = 'Impossible de charger la permission.'
      // });
    }
  }

  save() {
    this.saving = true;
    this.errorMsg = '';

    const req = this.id
      ? this.api.update(this.id, this.model)
      : this.api.create(this.model);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/espacedetravail/permissions']);
      },
      error: (err) => {
        this.saving = false;
        if (err?.status === 403 || err?.status === 404 || err?.status === 405) {
          this.errorMsg = "Accès refusé : vous n'avez pas l'autorisation d'ajouter une permission.";
        } else {
          this.errorMsg = err?.error?.message || 'Échec de l’enregistrement.';
        }
        console.error(err);
      }
    });
  }
}
