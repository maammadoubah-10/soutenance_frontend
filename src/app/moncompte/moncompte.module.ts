import { CommonModule, NgSwitch } from '@angular/common';
import { NgModule } from '@angular/core';


import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CommunModule } from '../commun/commun.module';
import { HistoriqueComponent } from './historique/historique.component';
import { MenuComponent } from './menu/menu.component';
import { MoncompteRoutingModule } from './moncompte-routing.module';
import { MoncompteComponent } from './moncompte.component';
import { ParametreComponent } from './parametre/parametre.component';
import { ProfilComponent } from './profil/profil.component';
import { EntetedepageComponent } from '../commun/entetedepage/entetedepage.component';

@NgModule({
  declarations: [
    MoncompteComponent,
    ProfilComponent,
    ParametreComponent,
    HistoriqueComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    MoncompteRoutingModule,
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
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbModule,
    NgSwitch,
]
})
export class MoncompteModule { }
