import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedagogieRoutingModule } from './pedagogie-routing.module';
import { PedagogieComponent } from './pedagogie.component';


@NgModule({
  declarations: [
    PedagogieComponent
  ],
  imports: [
    CommonModule,
    PedagogieRoutingModule
  ]
})
export class PedagogieModule { }
