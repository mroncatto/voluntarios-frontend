import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { ActividadListComponent } from './actividad-list/actividad-list.component';
import { ActividadShowComponent } from './actividad-show/actividad-show.component';


@NgModule({
  declarations: [
    ActividadListComponent,
    ActividadFormComponent,
    ActividadShowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
})
export class ActividadModule { }
