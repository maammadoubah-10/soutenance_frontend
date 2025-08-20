// src/app/forbidden/forbidden.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  template: `
    <div class="container py-5">
      <div class="alert alert-warning shadow-sm">
        <i class="bx bx-lock me-2"></i>
        Accès refusé — vous n’avez pas les permissions nécessaires.
      </div>
      <a class="btn btn-primary" routerLink="/espacedetravail">Retour au tableau de bord</a>
    </div>
  `
})
export class ForbiddenComponent {}
