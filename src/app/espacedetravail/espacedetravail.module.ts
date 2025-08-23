import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule , NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ClickOutsideModule } from 'ng-click-outside';

import { EspacedetravailRoutingModule } from './espacedetravail-routing.module';
import { EspacedetravailComponent } from './espacedetravail.component';
import { CommunModule } from '../commun/commun.module';
import { MenuComponent } from './menu/menu.component';
import { EntetedepageComponent } from '../commun/entetedepage/entetedepage.component';



@NgModule({
  declarations: [
    EspacedetravailComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    EspacedetravailRoutingModule,
    CommunModule,
    TranslateModule,
    NgbDropdownModule,
    ClickOutsideModule,
    SimplebarAngularModule,

    FormsModule,
    NgbModalModule,
    
    NgApexchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,

  ]
})
export class EspacedetravailModule { }
