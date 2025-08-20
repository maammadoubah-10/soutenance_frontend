import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurComponent } from './utilisateur.component';
import { UtilisateurFormComponent } from './pages/utilisateur-form/utilisateur-form.component';
import { UtilisateurEditComponent } from './pages/utilisateur-edit/utilisateur-edit.component';

const routes: Routes = [
  { path: '', component: UtilisateurComponent },          // liste
  { path: 'nouveau', component: UtilisateurFormComponent },
  { path: ':id', component: UtilisateurEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
