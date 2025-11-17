// src/app/commun/commun.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';

import { EntetedepageComponent } from './entetedepage/entetedepage.component';
import { PieddepageComponent } from './pieddepage/pieddepage.component';

// ⬇️ Standalone
import { TitredepageComponent } from './titredepage/titredepage.component';
import { NotificationBellComponent } from './notification-bell/notification-bell.component';

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

    // ⬅️ Standalone importés ici
    TitredepageComponent,
    NotificationBellComponent,
  ],
  exports: [
    EntetedepageComponent,
    PieddepageComponent,
    TitredepageComponent,
    NotificationBellComponent,
  ]
})
export class CommunModule {}
