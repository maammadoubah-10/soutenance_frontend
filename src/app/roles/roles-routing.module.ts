// src/app/roles/roles-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../shared/security/permission.guard';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';
import { RolePermissionsComponent } from './pages/role-permissions/role-permissions.component';

const routes: Routes = [
  { path: '', component: RolesListComponent,
    canActivate: [PermissionGuard], data: { permissions: ['gerer-les-roles'] } },
  { path: 'nouveau', component: RoleFormComponent,
    canActivate: [PermissionGuard], data: { permissions: ['gerer-les-roles'] } },
  { path: ':id', component: RoleFormComponent,
    canActivate: [PermissionGuard], data: { permissions: ['gerer-les-roles'] } },
  { path: ':id/permissions', component: RolePermissionsComponent,
    canActivate: [PermissionGuard], data: { permissions: ['gerer-les-roles'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
