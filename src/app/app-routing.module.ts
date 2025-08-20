// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule),
  },
  {
    path: 'espacedetravail',
    loadChildren: () => import('./espacedetravail/espacedetravail.module').then(m => m.EspacedetravailModule),
  },
  // 👇 nouvelle route 403
  {
    path: 'forbidden',
    loadComponent: () => import('./forbidden/forbidden.component').then(m => m.ForbiddenComponent),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
