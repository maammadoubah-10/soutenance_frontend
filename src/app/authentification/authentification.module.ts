import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentificationRoutingModule } from './authentification-routing.module';
import { AuthentificationComponent } from './authentification.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {CommunModule} from "../commun/commun.module";
import {HttpClientModule} from "@angular/common/http";
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
@NgModule({
  declarations: [
    AuthentificationComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommunModule,
    NgbAlertModule,
    //NgxSimplebarModule
  // CarouselModule,
  //  PdfViewerModule,
  //  PdfViewerModule
  ]
})
export class AuthentificationModule { }
