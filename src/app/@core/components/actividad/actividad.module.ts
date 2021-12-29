import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { ActividadListComponent } from './actividad-list/actividad-list.component';
import { ActividadShowComponent } from './actividad-show/actividad-show.component';
import { EditorModule } from "@tinymce/tinymce-angular";

// Angular Material
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ActividadListComponent,
    ActividadFormComponent,
    ActividadShowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    SharedModule
    
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-PY'},
  ],
})
export class ActividadModule { }
