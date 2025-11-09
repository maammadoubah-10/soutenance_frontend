import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NgbDropdownModule, NgbModalModule, NgbNavModule, NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';

import { EntetedepageComponent } from './entetedepage/entetedepage.component';
import { PieddepageComponent } from './pieddepage/pieddepage.component';

// ⬇️ IMPORTER (pas déclarer) le standalone
import { TitredepageComponent } from './titredepage/titredepage.component';

@NgModule({
  declarations: [
    EntetedepageComponent,
    PieddepageComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    ClickOutsideModule,
    SimplebarAngularModule,

    // ⬅️ standalone importé ici
    TitredepageComponent,
  ],
  exports: [
    EntetedepageComponent,
    PieddepageComponent,
    // ⬅️ on le ré-exporte pour qu’il soit utilisable partout
    TitredepageComponent,
  ]
})
export class CommunModule {}
