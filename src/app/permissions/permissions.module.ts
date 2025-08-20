import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PermissionsRoutingModule } from './permissions-routing.module';

// ⚠️ on retire SecurityModule pour l’instant
// import { SecurityModule } from '../shared/security/security.module';

import { PermissionsListComponent } from './pages/permissions-list/permissions-list.component';
import { PermissionFormComponent } from './pages/permission-form/permission-form.component';
import { SecurityModule } from '../shared/security/security.module';

@NgModule({
  declarations: [
    PermissionsListComponent,
    PermissionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SecurityModule,
    PermissionsRoutingModule
  ]
})
export class PermissionsModule {}
