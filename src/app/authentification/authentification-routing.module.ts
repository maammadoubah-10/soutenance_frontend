import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification.component';
import {ConnexionComponent} from "./connexion/connexion.component";
import {MotdepasseoublieComponent} from "./motdepassoublie/motdepassoublie.component";
import {ReinitialisationComponent} from "./reinitialisation/reinitialisation.component";
import {ConnexionPedagoComponent} from "./connexion-pedago/connexion-pedago.component";
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'motdepasseoublie', component: MotdepasseoublieComponent},
  { path: 'reinitialisation/:token', component: ReinitialisationComponent},
 { path: 'reinitialisation/:token', component: ResetPasswordComponent },  //{ path: 'reinitialisation/pedagogie/:token', component: ReinitialisationPedagogieComponent},
  { path: 'connexion-pedagogie', component: ConnexionPedagoComponent},
 // { path: 'motdepasseoublie-pedagogie', component: MotdepasseoubliepedagogieComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutingModule { }
