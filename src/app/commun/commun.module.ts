import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbModalModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CommunRoutingModule } from './commun-routing.module';
import { EntetedepageComponent } from './entetedepage/entetedepage.component';
import { PieddepageComponent } from './pieddepage/pieddepage.component';
import { TitredepageComponent } from './titredepage/titredepage.component';
import { MenuComponent } from '../espacedetravail/menu/menu.component';


@NgModule({
  declarations: [
  PieddepageComponent,
  TitredepageComponent,
  EntetedepageComponent,
  ],
  imports: [
    CommonModule,
    CommunRoutingModule,
    TranslateModule,
    NgbDropdownModule,
    ClickOutsideModule,
    SimplebarAngularModule,

    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule

  ],
 
    exports: [
    PieddepageComponent,
    EntetedepageComponent, 
    TitredepageComponent,
     // ✅ exporté pour que les autres modules puissent l’utiliser
  ]
})
export class CommunModule { }
