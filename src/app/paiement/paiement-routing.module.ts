import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement.component';
import { BanquesComponent } from './banques/banques.component';
import { TypeRetenusComponent } from './type-retenus/type-retenus.component';
import { SingleTypeRetenuComponent } from './type-retenus/single-type-retenu/single-type-retenu.component';
import { RetenusComponent } from './retenus/retenus.component';
import { ModepaiementComponent } from './modepaiement/modepaiement.component';
import { UniteComponent } from './unite/unite.component';
import { EchelonsComponent } from './echelons/echelons.component';
import { SingleEchelonComponent } from './echelons/single-echelon/single-echelon.component';
import { CategoriesComponent } from './categories/categories.component';
import { SingleCategoryComponent } from './categories/single-category/single-category.component';
import { AvancementsComponent } from './avancements/avancements.component';
import { AutorisationsComponent } from './autorisations/autorisations.component';
import { TypeAutorisationsComponent } from './type-autorisations/type-autorisations.component';
import { SingleTypeAutorisationComponent } from './type-autorisations/single-type-autorisation/single-type-autorisation.component';
import { PrimesComponent } from './primes/primes.component';
import { TypeEtatsComponent } from './type-etats/type-etats.component';
import { SingleTypeEtatComponent } from './type-etats/single-type-etat/single-type-etat.component';
import { EtatsComponent } from './etats/etats.component';
import { TypeImpactSalarialComponent } from './type-impact-salarial/type-impact-salarial.component';
import { ImpactSalarialComponent } from './impact-salarial/impact-salarial.component';

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

      { path: 'unites', loadComponent: () => import('./unite/unite.component').then(m => m.UniteComponent) },

      {
        path: "echelons", children: [
          { path: "", component: EchelonsComponent },
          { path: ":id", component: SingleEchelonComponent },
        ]
      },
      {
        path: 'categories', children: [
          { path: "", component: CategoriesComponent },
          { path: ":id", component: SingleCategoryComponent }
        ]
      },
      { path: "avancements", component: AvancementsComponent },
      { path: "autorisations", component: AutorisationsComponent },

      { path: "autorisations", component: AutorisationsComponent },
      {
        path: 'type-autorisations', children: [
          { path: "", component: TypeAutorisationsComponent },
          { path: ":id", component: SingleTypeAutorisationComponent }
        ]
      },
      { path: "primes", component: PrimesComponent },
      { path: "etats", component: EtatsComponent },
      { path: 'type-etats', children: [
        { path: "", component: TypeEtatsComponent },
        { path: ":id", component: SingleTypeEtatComponent }
      ] },

      { path: "type-impact-salarial", component: TypeImpactSalarialComponent },
      
      { path: "impact-salarial", component: ImpactSalarialComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
