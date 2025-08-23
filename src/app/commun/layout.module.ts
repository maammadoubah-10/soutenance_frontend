import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntetedepageComponent } from './entetedepage/entetedepage.component';
import { TitredepageComponent } from './titredepage/titredepage.component';

const components = [
  TitredepageComponent,
  EntetedepageComponent,
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  
})
export class LayoutModule {}
