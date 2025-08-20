import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedagogieComponent } from './pedagogie.component';

const routes: Routes = [{ path: '', component: PedagogieComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedagogieRoutingModule { }
