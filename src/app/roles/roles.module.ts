// src/app/roles/roles.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RolesRoutingModule } from './roles-routing.module';
import { SecurityModule } from '../shared/security/security.module';

// composants (version NgModule)
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';
import { RolePermissionsComponent } from './pages/role-permissions/role-permissions.component';

@NgModule({
  declarations: [
    RolesListComponent,
    RoleFormComponent,
    RolePermissionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,         // ⬅️ important pour routerLink dans les templates
    SecurityModule,
    RolesRoutingModule
  ]
})
export class RolesModule {}
