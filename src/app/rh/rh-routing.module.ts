import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RhComponent } from './rh.component';
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

const routes: Routes = [{ path: '', component: RhComponent },
   {
    path: '',
    component: RhComponent,
    children: [  // ← Routes enfants
            { path: '', redirectTo: 'postes', pathMatch: 'full' }, // Route par défaut
       { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },
        //{ path: 'tableaudebord', component: TableaudebordComponent },
      { path: 'postes', component: PosteComponent },
      { path:'services/details/:id', component: DetailComponent  },
    
      {path: 'personnels',component: ListedepersonnelsComponent  },
        
    
         { path:'personnels/details/:id',
        component: DetailpersonnelComponent
      },

     { path: 'services', component: ServiceComponent },
     { path: 'conges', component: CongeComponent },
     { path: 'contrats', component: ContratComponent },
     { path: 'indices', component: IndiceComponent },
     { path: 'demandes', component: DemandeComponent },
     { path: 'missions', component: MissionComponent },
     { path:'missions/details/:id',component: DetailmissionComponent},
      
        

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
