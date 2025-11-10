import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaiementRoutingModule } from './paiement-routing.module';
import { PaiementComponent } from './paiement.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../commun/layout.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuComponent } from './menu/menu.component';
import { CommunModule } from "../commun/commun.module";
import { BanquesComponent } from './banques/banques.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxPaginationModule } from 'ngx-pagination';
import { TypeRetenusComponent } from './type-retenus/type-retenus.component';
import { SingleTypeRetenuComponent } from './type-retenus/single-type-retenu/single-type-retenu.component';
import { RetenusComponent } from './retenus/retenus.component';
import { ModepaiementComponent } from './modepaiement/modepaiement.component';
import { UniteComponent } from './unite/unite.component';
import { EchelonsComponent } from './echelons/echelons.component';
import { SingleEchelonComponent } from './echelons/single-echelon/single-echelon.component';
import { CategoriesComponent } from './categories/categories.component';
import { SingleCategoryComponent } from './categories/single-category/single-category.component';
import { AvancementsComponent } from './avancements/avancements.component';
import { AutorisationsComponent } from './autorisations/autorisations.component';
import { TypeAutorisationsComponent } from './type-autorisations/type-autorisations.component';
import { SingleTypeAutorisationComponent } from './type-autorisations/single-type-autorisation/single-type-autorisation.component';
import { PrimesComponent } from './primes/primes.component';
import { TypeEtatsComponent } from './type-etats/type-etats.component';
import { SingleTypeEtatComponent } from './type-etats/single-type-etat/single-type-etat.component';
import { EtatsComponent } from './etats/etats.component';
import { TypeImpactSalarialComponent } from './type-impact-salarial/type-impact-salarial.component';
import { ImpactSalarialComponent } from './impact-salarial/impact-salarial.component';
@NgModule({
  declarations: [
    PaiementComponent,
    MenuComponent,
    BanquesComponent,
    TypeRetenusComponent,
    SingleTypeRetenuComponent,
    RetenusComponent,
    ModepaiementComponent,
    UniteComponent,
    EchelonsComponent,
    SingleEchelonComponent,
    CategoriesComponent,
    SingleCategoryComponent,
    AvancementsComponent,
    AutorisationsComponent,
    TypeAutorisationsComponent,
    SingleTypeAutorisationComponent,
    PrimesComponent,
    TypeEtatsComponent,
    SingleTypeEtatComponent,
    EtatsComponent,
    TypeImpactSalarialComponent,
    ImpactSalarialComponent
  ],
  imports: [
    CommonModule,
    PaiementRoutingModule,
    //Importaion
    TranslateModule,
    NgbDropdownModule,
    ClickOutsideModule,
    SimplebarAngularModule,
    FormsModule,
    MatStepperModule ,
    NgbModalModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    //Ng2SearchPipeModule,
    NgbModule,
    NgxPaginationModule,
    NgSelectModule,
    CommunModule,
]
})
export class PaiementModule { }
