import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forbidden',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-4">
      <h2>403 – Accès refusé</h2>
      <p>Vous n'avez pas les droits pour cette page.</p>
      <a routerLink="/dashboard">Retour au dashboard</a>
    </div>
  `
})
export class ForbiddenComponent {}
