import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FilterByPipe, NgPipesModule } from 'ngx-pipes';
import { environment } from '../environments/environment';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeFr from '@angular/common/locales/fr';
import { FilterPipe } from './filter.pipe';
// export function createTranslateLoader(http: HttpClient) { ... }

@NgModule({
  declarations: [AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    NgPipesModule,
    // StoreDevtoolsModule.instrument({
    //   maxAge: 25,
    //   logOnly: environment.production,
    // }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
