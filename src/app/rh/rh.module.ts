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

@NgModule({
  declarations: [
    RhComponent,
    MenuComponent,
    PosteComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    SimplebarAngularModule,
    CommunModule,
    TranslateModule,
    CommonModule,
    RhRoutingModule,
    LayoutModule,
    NgApexchartsModule,
    FormsModule,
    UiSwitchModule,
    ReactiveFormsModule,
    NgSelectModule,
    //ArchwizardModule,
    ToastrModule.forRoot(),
    //NgxPaginationModule,
    NgbTooltipModule
]
})
export class RhModule { }
