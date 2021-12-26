import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './@core/shared/components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './@core/components/dashboard/dashboard.module';
import { ActividadModule } from './@core/components/actividad/actividad.module';
import { UserModule } from './@core/components/user/user.module';

registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    ActividadModule,
    UserModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PY' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
