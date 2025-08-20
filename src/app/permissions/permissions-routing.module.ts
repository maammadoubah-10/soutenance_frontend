import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionsListComponent } from './pages/permissions-list/permissions-list.component';
import { PermissionFormComponent } from './pages/permission-form/permission-form.component';

const routes: Routes = [
  { path: '',        component: PermissionsListComponent },
  { path: 'nouveau', component: PermissionFormComponent },
  { path: ':id',     component: PermissionFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule {}
