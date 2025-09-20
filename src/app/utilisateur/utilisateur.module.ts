// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { UtilisateurRoutingModule } from './utilisateur-routing.module';
// import { UtilisateurComponent } from './utilisateur.component';
// import { UtilisateurFormComponent } from './pages/utilisateur-form/utilisateur-form.component';
// import { UtilisateurEditComponent } from './pages/utilisateur-edit/utilisateur-edit.component';

// @NgModule({
//   declarations: [
//     UtilisateurComponent,          // liste
//     UtilisateurFormComponent,      // création
//     UtilisateurEditComponent,      // édition rapide
//   ],
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     UtilisateurRoutingModule
//   ]
// })
// export class UtilisateurModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { UtilisateurComponent } from './utilisateur.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TitredepageComponent } from '../commun/titredepage/titredepage.component';
import { TableaudebordComponent } from './tableaudebord/tableaudebord.component';
import { MenuComponent } from './menu/menu.component';
import { NgxSimplebarModule } from 'ngx-simplebar';
import { CommunModule } from '../commun/commun.module';
import { RolesComponent } from './roles/roles.component';
import { FilterPipe } from "../filter.pipe";
import { SimplebarAngularModule } from 'simplebar-angular';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { NgSelectModule } from '@ng-select/ng-select'; // Vérifiez cet import
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    PermissionsComponent,
    UtilisateurComponent,          // liste
    // UtilisateurFormComponent,      // création
    // UtilisateurEditComponent,      // édition rapide
    TableaudebordComponent,
    MenuComponent,
    RolesComponent,
    UtilisateursComponent,
  ],
  imports: [
    CommonModule,
    UtilisateurRoutingModule,
    FormsModule,
    NgbModalModule,
    SimplebarAngularModule,
    HttpClientModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UtilisateurRoutingModule,
    CommunModule,
    FilterPipe,
    NgSelectModule,
    NgApexchartsModule,
]
})
export class UtilisateurModule { }
