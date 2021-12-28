import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { ActividadListComponent } from './actividad-list/actividad-list.component';
import { ActividadShowComponent } from './actividad-show/actividad-show.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';


@NgModule({
  declarations: [
    ActividadListComponent,
    ActividadFormComponent,
    ActividadShowComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule
  ],
  providers: [],
})
export class ActividadModule { }
