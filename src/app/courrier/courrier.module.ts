import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourrierRoutingModule } from './courrier-routing.module';
import { CourrierComponent } from './courrier.component';


@NgModule({
  declarations: [
    CourrierComponent
  ],
  imports: [
    CommonModule,
    CourrierRoutingModule
  ]
})
export class CourrierModule { }
