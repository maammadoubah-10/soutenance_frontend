// src/app/rh/rh-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RhComponent } from './rh.component';

import { RhAdminDashboardComponent } from './rh-admin-dashboard.component';
import { RhPersonnelDashboardComponent } from './rh-personnel-dashboard.component';

import { PosteComponent } from './poste/poste.component';
import { ServiceComponent } from './service/service.component';
import { DetailComponent } from './service/detail/detail.component';
import { ListedepersonnelsComponent } from './listedepersonnels/listedepersonnels.component';
import { DetailpersonnelComponent } from './listedepersonnels/detailpersonnel/detailpersonnel.component';
import { CongeComponent } from './conge/conge.component';
import { ContratComponent } from './contrat/contrat.component';
import { IndiceComponent } from './indice/indice.component';
import { DemandeComponent } from './demande/demande.component';
import { MissionComponent } from './mission/mission.component';
import { DetailmissionComponent } from './mission/detailmission/detailmission.component';
import { AffectationComponent } from './affectation/affectation.component';
import { PresenceComponent } from './presence/presence.component';
import { AuthentificationGuard } from '../authentification/garde/authentification.guard';

// 🔴 IMPORTANT : on importe le guard ici
//import { AuthentificationGuard } from '../guards/authentification.guard';

const routes: Routes = [
  {
    path: '',
    component: RhComponent,
    children: [
      { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },

      // Dashboards protégés par le guard
      {
        path: 'tableaudebord',
        component: RhAdminDashboardComponent,
        canActivate: [AuthentificationGuard],
      },
      {
        path: 'mon-dashboard',
        component: RhPersonnelDashboardComponent,
        canActivate: [AuthentificationGuard],
      },

      // Reste des écrans RH (tu peux aussi leur rajouter le guard si tu veux)
      { path: 'postes', component: PosteComponent, canActivate: [AuthentificationGuard] },
      { path: 'services', component: ServiceComponent, canActivate: [AuthentificationGuard] },
      { path: 'services/details/:id', component: DetailComponent, canActivate: [AuthentificationGuard] },
      { path: 'personnels', component: ListedepersonnelsComponent, canActivate: [AuthentificationGuard] },
      { path: 'personnels/details/:id', component: DetailpersonnelComponent, canActivate: [AuthentificationGuard] },
      { path: 'conges', component: CongeComponent, canActivate: [AuthentificationGuard] },
      { path: 'contrats', component: ContratComponent, canActivate: [AuthentificationGuard] },
      { path: 'indices', component: IndiceComponent, canActivate: [AuthentificationGuard] },
      { path: 'demandes', component: DemandeComponent, canActivate: [AuthentificationGuard] },
      { path: 'missions', component: MissionComponent, canActivate: [AuthentificationGuard] },
      { path: 'missions/details/:id', component: DetailmissionComponent, canActivate: [AuthentificationGuard] },
      { path: 'affectations', component: AffectationComponent, canActivate: [AuthentificationGuard] },
      { path: 'presences', component: PresenceComponent, canActivate: [AuthentificationGuard] },

      {
        path: 'mes-presences',
        canActivate: [AuthentificationGuard],
        loadComponent: () =>
          import('./presence/mes-presences.component').then(m => m.MesPresencesComponent)
      },
      {
        path: 'mes-demandes',
        canActivate: [AuthentificationGuard],
        loadComponent: () =>
          import('./demande/mes-demandes.component').then(m => m.MesDemandesComponent)
      },
      {
        path: 'mes-conges',
        canActivate: [AuthentificationGuard],
        loadComponent: () =>
          import('./conge/mes-conges.component').then(m => m.MesCongesComponent)
      },
      {
        path: 'mes-affectations',
        canActivate: [AuthentificationGuard],
        loadComponent: () =>
          import('./affectation/mes-affectations.component').then(m => m.MesAffectationsComponent)
      },
      {
        path: 'mes-missions',
        canActivate: [AuthentificationGuard],
        loadComponent: () =>
          import('./mission/mes-missions.component').then(m => m.MesMissionsComponent)
      },
      {
        path: 'mes-contrats',
        canActivate: [AuthentificationGuard],
        loadComponent: () =>
          import('./contrat/mes-contrats.component').then(m => m.MesContratsComponent)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RhRoutingModule {}
