import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

@Component({ selector: 'app-login', template: `<h2>Login</h2>` })
export class LoginComponent {}

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // /auth/login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
