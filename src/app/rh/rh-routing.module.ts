import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RhComponent } from './rh.component';
import { PosteComponent } from './poste/poste.component';
import { ServiceComponent } from './service/service.component';
import { DetailComponent } from './service/detail/detail.component';

const routes: Routes = [{ path: '', component: RhComponent },
   {
    path: '',
    component: RhComponent,
    children: [  // ← Routes enfants
       { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },
        //{ path: 'tableaudebord', component: TableaudebordComponent },
      { path: 'postes', component: PosteComponent },
      { path:'services/details/:id', component: DetailComponent  },
    
        //{path: 'personnels', component: PersonnelComponent },
     { path: 'services', component: ServiceComponent },
      { path: '', redirectTo: 'postes', pathMatch: 'full' } // Route par défaut
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
