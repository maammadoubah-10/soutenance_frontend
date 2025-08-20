import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [HeaderComponent, SidebarComponent, FooterComponent],
imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent, SidebarComponent, FooterComponent]
})
export class SharedLayoutModule {}
