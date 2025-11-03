import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationGuard } from './authentification/garde/authentification.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./authentification/authentification.module').then(
        (m) => m.AuthentificationModule
      ),
  },

  {
    path: 'espacedetravail',
    loadChildren: () =>
      import('./espacedetravail/espacedetravail.module').then(
        (m) => m.EspacedetravailModule
      ),
    canActivate: [AuthentificationGuard],
  },


  {
    path: 'utilisateur',
    loadChildren: () =>
      import('./utilisateur/utilisateur.module').then(
        (m) => m.UtilisateurModule
      ),
    canActivate: [AuthentificationGuard],
  },
  {
    path: 'paie',
    loadChildren: () =>
      import('./paiement/paiement.module').then(
        (m) => m.PaiementModule
      ),
    canActivate: [AuthentificationGuard],
  },

  {
    path: 'courrier',
    loadChildren: () =>
      import('./courrier/courrier.module').then((m) => m.CourrierModule),
    canActivate: [AuthentificationGuard],
  },

  {
    path: 'moncompte',
    loadChildren: () =>
      import('./moncompte/moncompte.module').then((m) => m.MoncompteModule),
    canActivate: [AuthentificationGuard],
  },

  // {
  //   path: 'tache',
  //   loadChildren: () =>
  //     import('./tache/tache.module').then((m) => m.TacheModule),
  //   canActivate: [AuthentificationGuard],

  // },

  // { path: 'commercial',
  //   loadChildren: () =>
  //     import('./commercial/commercial.module').then(m => m.CommercialModule),
  //   canActivate: [AuthentificationGuard],
  // },

  // {
  //   path: 'budgetaire',
  //   loadChildren: () =>
  //     import('./budgetaire/budgetaire.module').then((m) => m.BudgetaireModule),
  //   canActivate: [AuthentificationGuard],

  // },

  // {
  //   path: 'production-publication',
  //   loadChildren: () =>
  //     import('./production-publication/production-publication.module').then(
  //       (m) => m.ProductionPublicationModule
  //     ),
  //   canActivate: [AuthentificationGuard],
  // },

  // {
  //   path: 'comptabilite-matiere',
  //   loadChildren: () =>
  //     import('./gestion-de-stock/gestion-de-stock.module').then(
  //       (m) => m.GestionDeStockModule
  //     ),
  //   canActivate: [AuthentificationGuard],

  // },

  // {
  //   path: 'immobilisation',
  //   loadChildren: () =>
  //     import(
  //       './immobilisation/immobilisation.module'
  //     ).then((m) => m.ImmobilisationModule),
  //   canActivate: [AuthentificationGuard],
  // },

  // {
  //   path: 'comptabilitefinanciere',
  //   loadChildren: () =>
  //     import('./comptabilitefinanciere/comptabilitefinanciere.module').then(
  //       (m) => m.ComptabilitefinanciereModule
  //     ),
  //   canActivate: [AuthentificationGuard],
  // },
  //{ path: 'paie', loadChildren: () => import('./paie/paie.module').then(m => m.PaieModule) },
  { path: 'rh', loadChildren: () => import('./rh/rh.module').then(m => m.RhModule) },

//   { path: 'publication', loadChildren: () => import('./publication/publication.module').then(m => m.PublicationModule) },
//   { path: '**', component: PagenontrouveeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
