import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurComponent } from './utilisateur.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { TableaudebordComponent } from './tableaudebord/tableaudebord.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
  // { path: '', component: UtilisateurComponent },          // liste
  // { path: 'nouveau', component: UtilisateurFormComponent },
  // { path: ':id', component: UtilisateurEditComponent },

  //   { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },
  // {
  //   path: '', component: UtilisateurComponent,
  //   children : [
  //     { path: 'tableaudebord', component: TableaudebordComponent },
  //     { path: 'permissions', component: PermissionsComponent},
  //     //{ path: 'roles', component: RolesComponent },
  //    // { path: 'utilisateurs', component: UtilisateursComponent },
  //   ],
  // }

  { 
     path: '',
    component: UtilisateurComponent,
    children: [
      { path: '', redirectTo: 'tableaudebord', pathMatch: 'full' },
      { path: 'tableaudebord', component: TableaudebordComponent },
      { path: 'permissions', component: PermissionsComponent },
      { path: 'roles', component: RolesComponent },
    ],
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
