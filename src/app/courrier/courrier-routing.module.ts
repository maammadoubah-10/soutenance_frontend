import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourrierComponent } from './courrier.component';

const routes: Routes = [{ path: '', component: CourrierComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourrierRoutingModule { }
