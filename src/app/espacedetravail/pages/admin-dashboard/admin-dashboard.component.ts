// src/app/espacedetravail/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // *ngFor/*ngIf + date pipe
import { RouterModule } from '@angular/router';   // routerLink

type KPI = { label: string; icon: string; value: number };
type DerniereConnexion = { nom: string; email: string; roles: string[]; date: Date };
type RepartitionRole = { role: string; count: number };

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,                 // ⬅️ standalone
  imports: [CommonModule, RouterModule], // ⬅️ ce que le template utilise
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  kpis: KPI[] = [
    { label: 'Utilisateurs',      icon: 'bx bx-user',       value: 0 },
    { label: 'Actifs',            icon: 'bx bx-check',      value: 0 },
    { label: 'Inactifs',          icon: 'bx bx-block',      value: 0 },
    { label: 'Administrateurs',   icon: 'bx bx-crown',      value: 0 },
    { label: '2FA activés',       icon: 'bx bx-key',        value: 0 },
    { label: 'Rôles',             icon: 'bx bx-group',      value: 0 },
    { label: 'Permissions',       icon: 'bx bx-lock-alt',   value: 0 },
    { label: 'Connexions (24h)',  icon: 'bx bx-line-chart', value: 0 },
  ];

  derniers: DerniereConnexion[] = [];
  repartitionRoles: RepartitionRole[] = [];

  ngOnInit(): void {
    // données de démo
    setTimeout(() => {
      this.kpis = [
        { label: 'Utilisateurs',      icon: 'bx bx-user',       value: 42 },
        { label: 'Actifs',            icon: 'bx bx-check',      value: 38 },
        { label: 'Inactifs',          icon: 'bx bx-block',      value: 4 },
        { label: 'Administrateurs',   icon: 'bx bx-crown',      value: 3 },
        { label: '2FA activés',       icon: 'bx bx-key',        value: 21 },
        { label: 'Rôles',             icon: 'bx bx-group',      value: 6 },
        { label: 'Permissions',       icon: 'bx bx-lock-alt',   value: 28 },
        { label: 'Connexions (24h)',  icon: 'bx bx-line-chart', value: 12 },
      ];
      this.derniers = [
        { nom: 'Kouamé A.', email: 'kouame@example.com', roles: ['Admin'],       date: new Date() },
        { nom: 'Fatou N.',  email: 'fatou@example.com',  roles: ['Gestionnaire'],date: new Date(Date.now()-3600_000) },
        { nom: 'B. Diallo', email: 'bdiallo@example.com',roles: ['Lecteur'],     date: new Date(Date.now()-7200_000) },
      ];
      this.repartitionRoles = [
        { role: 'Admin', count: 3 },
        { role: 'Gestionnaire', count: 12 },
        { role: 'Lecteur', count: 27 },
      ];
    }, 0);
  }
}
