import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadFormComponent } from './@core/components/actividad/actividad-form/actividad-form.component';
import { ActividadListComponent } from './@core/components/actividad/actividad-list/actividad-list.component';
import { ActividadShowComponent } from './@core/components/actividad/actividad-show/actividad-show.component';
import { DashboardComponent } from './@core/components/dashboard/dashboard.component';
import { LoginComponent } from './@core/components/user/login/login.component';
import { RegisterComponent } from './@core/components/user/register/register.component';
import { VoluntarioListComponent } from './@core/components/user/voluntario-list/voluntario-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'actividad', component: ActividadListComponent },
  { path: 'actividad/form', component: ActividadFormComponent },
  { path: 'actividad/:id/form', component: ActividadFormComponent },
  { path: 'actividad/:id/show', component: ActividadShowComponent },
  { path: 'voluntario', component: VoluntarioListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
