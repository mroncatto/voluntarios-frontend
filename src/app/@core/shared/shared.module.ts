import { NgModule } from '@angular/core';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    declarations: [
        PaginatorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    exports: [
        PaginatorComponent
    ],
    providers: [],
})
export class SharedModule { }
