import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

@Component({ selector: 'app-admin-home', template: `<h2>Espace Admin</h2>` })
export class AdminHomeComponent {}

const routes: Routes = [
  { path: '', component: AdminHomeComponent }, // /admin
];

@NgModule({
  declarations: [AdminHomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
