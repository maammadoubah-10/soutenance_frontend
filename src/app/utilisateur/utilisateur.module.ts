import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { UtilisateurComponent } from './utilisateur.component';
import { UtilisateurFormComponent } from './pages/utilisateur-form/utilisateur-form.component';
import { UtilisateurEditComponent } from './pages/utilisateur-edit/utilisateur-edit.component';

@NgModule({
  declarations: [
    UtilisateurComponent,          // liste
    UtilisateurFormComponent,      // création
    UtilisateurEditComponent,      // édition rapide
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UtilisateurRoutingModule
  ]
})
export class UtilisateurModule { }
