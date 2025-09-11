import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { RhComponent } from './rh.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MenuComponent } from './menu/menu.component';
import { CommunModule } from "../commun/commun.module";
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LayoutModule } from '../commun/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { PosteComponent } from './poste/poste.component';

import { UiSwitchModule } from 'ngx-ui-switch';
import { ServiceComponent } from './service/service.component';
import { DetailComponent } from './service/detail/detail.component';
import { ListedepersonnelsComponent } from './listedepersonnels/listedepersonnels.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DetailpersonnelComponent } from './listedepersonnels/detailpersonnel/detailpersonnel.component';
import { NumberWithSpacesPipe } from './pipe/number-with-spaces.pipe';
import { FormatPhoneNumberPipe } from './pipe/format-phone-number.pipe';
import { CongeComponent } from './conge/conge.component';
import { ContratComponent } from './contrat/contrat.component';
import { IndiceComponent } from './indice/indice.component';
import { DemandeComponent } from './demande/demande.component';

@NgModule({
  declarations: [
    RhComponent,
    MenuComponent,
    PosteComponent,
    ServiceComponent,
    DetailComponent,
    ListedepersonnelsComponent,
    DetailpersonnelComponent, 
    NumberWithSpacesPipe,
    FormatPhoneNumberPipe,
    CongeComponent,
    ContratComponent,
    IndiceComponent,
    DemandeComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    SimplebarAngularModule,
    CommunModule,
    TranslateModule,
    RhRoutingModule,
    LayoutModule,
    NgApexchartsModule,
    FormsModule,
    UiSwitchModule,
    ReactiveFormsModule,
    NgSelectModule,
   // ArchwizardModule,
    ToastrModule.forRoot(),
    //NgxPaginationModule,
    NgbTooltipModule,
    MatStepperModule 
]
})
export class RhModule { }
