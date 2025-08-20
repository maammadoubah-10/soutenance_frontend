// src/app/espacedetravail/espacedetravail.module.ts
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EspacedetravailRoutingModule } from './espacedetravail-routing.module';
import { EspacedetravailComponent } from './espacedetravail.component';

// Commun / RH / i18n / ng-bootstrap
import { CommunModule } from '../commun/commun.module';
import { RhModule } from '../rh/rh.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { SharedLayoutModule } from '../layout/shared-layout.module';

@NgModule({
  declarations: [
    EspacedetravailComponent, // ⬅️ garde seulement le shell
    // ❌ NE PAS déclarer AdminDashboardComponent (il est standalone)
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedLayoutModule,

    EspacedetravailRoutingModule,

    NgbDropdownModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbNavModule,
    NgbCollapseModule,

    NgOptimizedImage,
    TranslateModule,

    CommunModule,
    RhModule,
  ]
})
export class EspacedetravailModule {}
