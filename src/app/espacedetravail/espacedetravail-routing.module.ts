// src/app/espacedetravail/espacedetravail-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EspacedetravailComponent } from './espacedetravail.component';

const routes: Routes = [
  {
    path: '',
    component: EspacedetravailComponent,
    // children: [
    //   // d'abord les features
    //   { path: 'utilisateur', loadChildren: () => import('../utilisateur/utilisateur.module').then(m => m.UtilisateurModule) },
    //   { path: 'roles',       loadChildren: () => import('../roles/roles.module').then(m => m.RolesModule) },
    //   { path: 'permissions', loadChildren: () => import('../permissions/permissions.module').then(m => m.PermissionsModule) },

      // puis le dashboard
      // {
      //   path: 'dashboard',
      //   loadComponent: () =>
      //     import('./pages/admin-dashboard/admin-dashboard.component')
      //       .then(m => m.AdminDashboardComponent),
      // },
      // // enfin le redirect vide
      // { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    //]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EspacedetravailRoutingModule {}
