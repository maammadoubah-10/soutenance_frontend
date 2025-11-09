import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

@Component({ selector: 'app-dashboard-home', template: `<h2>Dashboard</h2>` })
export class DashboardHomeComponent {}

const routes: Routes = [
  { path: '', component: DashboardHomeComponent }, // /dashboard
];

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
