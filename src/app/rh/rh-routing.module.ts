import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RhComponent } from './rh.component';
import { PosteComponent } from './poste/poste.component';

const routes: Routes = [{ path: '', component: RhComponent },
  //  { path: 'services',
  //       component: ServiceComponent
  //     },
      { path: 'postes',
        component: PosteComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
