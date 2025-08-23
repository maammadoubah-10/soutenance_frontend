import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentificationRoutingModule } from './authentification-routing.module';
import { AuthentificationComponent } from './authentification.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbAlertModule, NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {CommunModule} from "../commun/commun.module";
import {HttpClientModule} from "@angular/common/http";
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NgxSimplebarModule } from 'ngx-simplebar';
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
    NgxSimplebarModule,
    NgbCarouselModule,
  //  PdfViewerModule,
  //  PdfViewerModule
  ]
})
export class AuthentificationModule { }
