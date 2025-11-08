import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RhComponent } from './rh.component';
import { RhDashboardComponent } from './rh-dashboard.component'; // ⬅️ importe ton dashboard RH

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

const routes: Routes = [
  {
    path: '',
    component: RhComponent,
    children: [
      // ⬇️ Redirection par défaut vers le dashboard RH
      { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },

      // ⬇️ Dashboard RH
      { path: 'tableaudebord', component: RhDashboardComponent },
      { path: 'mon-dashboard', component: RhDashboardComponent},


      // ⬇️ Le reste des écrans RH
      { path: 'postes', component: PosteComponent },
      { path: 'services', component: ServiceComponent },
      { path: 'services/details/:id', component: DetailComponent },
      { path: 'personnels', component: ListedepersonnelsComponent },
      { path: 'personnels/details/:id', component: DetailpersonnelComponent },
      { path: 'conges', component: CongeComponent },
      { path: 'contrats', component: ContratComponent },
      { path: 'indices', component: IndiceComponent },
      { path: 'demandes', component: DemandeComponent },
      { path: 'missions', component: MissionComponent },
      { path: 'missions/details/:id', component: DetailmissionComponent },
      { path: 'affectations', component: AffectationComponent },
      { path: 'presences', component: PresenceComponent },
      { 
        path: 'mes-presences',
        loadComponent: () =>
          import('./presence/mes-presences.component').then(m => m.MesPresencesComponent)
      },
// src/app/rh/rh-routing.module.ts
        { 
          path: 'mes-demandes',
          loadComponent: () =>
            import('./demande/mes-demandes.component').then(m => m.MesDemandesComponent)
        },

         {
  path: 'mes-conges',
  loadComponent: () =>
    import('./conge/mes-conges.component').then(m => m.MesCongesComponent)
},

// ... routes existantes
{
  path: 'mes-affectations',
  loadComponent: () =>
    import('./affectation/mes-affectations.component')
      .then(m => m.MesAffectationsComponent)
},
 
{
  path: 'mes-missions',
  loadComponent: () =>
    import('./mission/mes-missions.component').then(m => m.MesMissionsComponent)
},
// src/app/rh/rh-routing.module.ts
{
  path: 'mes-contrats',
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
