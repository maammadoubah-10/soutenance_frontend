import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaiementRoutingModule } from './paiement-routing.module';
import { PaiementComponent } from './paiement.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../commun/layout.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuComponent } from './menu/menu.component';
import { CommunModule } from "../commun/commun.module";
import { BanquesComponent } from './banques/banques.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxPaginationModule } from 'ngx-pagination';
import { TypeRetenusComponent } from './type-retenus/type-retenus.component';
import { SingleTypeRetenuComponent } from './type-retenus/single-type-retenu/single-type-retenu.component';
import { RetenusComponent } from './retenus/retenus.component';
import { ModepaiementComponent } from './modepaiement/modepaiement.component';
@NgModule({
  declarations: [
    PaiementComponent,
    MenuComponent,
    BanquesComponent,
    TypeRetenusComponent,
    SingleTypeRetenuComponent,
    RetenusComponent,
    ModepaiementComponent,
  ],
  imports: [
    CommonModule,
    PaiementRoutingModule,
    //Importaion
    TranslateModule,
    NgbDropdownModule,
    ClickOutsideModule,
    SimplebarAngularModule,
    FormsModule,
    MatStepperModule ,
    NgbModalModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    // Ng2SearchPipeModule,
    NgbModule,
    NgxPaginationModule,
    NgSelectModule,
    CommunModule
]
})
export class PaiementModule { }
