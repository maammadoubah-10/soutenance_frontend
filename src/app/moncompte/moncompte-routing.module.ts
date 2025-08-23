import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriqueComponent } from './historique/historique.component';
import { MoncompteComponent } from './moncompte.component';
import { ParametreComponent } from './parametre/parametre.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: '', redirectTo: 'profil', pathMatch: 'full' },
  {
    path: '', component: MoncompteComponent,
    children : [
      { path: 'profil', component: ProfilComponent },
      { path: 'parametre', component: ParametreComponent },
      { path: 'historique', component: HistoriqueComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoncompteRoutingModule { }
