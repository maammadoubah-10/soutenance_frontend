import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement.component';
import { BanquesComponent } from './banques/banques.component';
import { TypeRetenusComponent } from './type-retenus/type-retenus.component';
import { SingleTypeRetenuComponent } from './type-retenus/single-type-retenu/single-type-retenu.component';
import { RetenusComponent } from './retenus/retenus.component';
import { ModepaiementComponent } from './modepaiement/modepaiement.component';

const routes: Routes = [
  {
    path: '', component: PaiementComponent,
    children: [
      { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },
      { path: "banque", component: BanquesComponent },
      { path: "type-retenus", component: TypeRetenusComponent },
      { path: "retenus", component: RetenusComponent },
      { path: "mode-paiement", component: ModepaiementComponent },
      {
        path: 'type-retenus', children: [
          { path: ":id", component: SingleTypeRetenuComponent }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
