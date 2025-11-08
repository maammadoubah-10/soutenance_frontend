import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { UtilisateurComponent } from './utilisateur.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbCollapseModule, NgbModalModule, NgbModule, NgbNavModule,
  NgbPaginationModule, NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TableaudebordComponent } from './tableaudebord/tableaudebord.component';
import { MenuComponent } from './menu/menu.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CommunModule } from '../commun/commun.module';
import { RolesComponent } from './roles/roles.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';

// ⬇️ Pipe NON-standalone → on la DÉCLARE
import { FilterPipe } from '../filter.pipe';

@NgModule({
  declarations: [
    PermissionsComponent,
    UtilisateurComponent,
    TableaudebordComponent,
    MenuComponent,
    RolesComponent,
    UtilisateursComponent,               // ⬅️ ici (declarations), pas dans imports
  ],
  imports: [
    CommonModule,
    UtilisateurRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,

    // ng-bootstrap
    NgbModule,
    NgbNavModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbPaginationModule,

    // autres
    SimplebarAngularModule,
    NgSelectModule,
    NgApexchartsModule,
    CommunModule,
    FilterPipe
  ]
})
export class UtilisateurModule { }
