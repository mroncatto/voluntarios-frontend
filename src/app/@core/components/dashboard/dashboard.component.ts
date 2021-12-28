import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { Situacion } from '../../enum/situacion.enum';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { Actividad } from '../actividad/actividad.entity';
import { ActividadService } from '../actividad/actividad.service';
import { UserTipo } from '../user/tipo-user.enum';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  widget_actividades_pendientes: number = 0;
  widget_actividades_finalizadas: number = 0;
  widget_voluntarios: number = 0;
  widget_organizaciones: number = 0;
  actividades: Actividad[] = [];
  private sub: Subscription[] = [];
  loading: boolean = false;

  constructor(private actividadService: ActividadService, private errorHandlingService: ErrorHandlingService,
    private authService: AuthService, private userService: UserService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getActividades();
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  getActividades(): void {
    this.sub.push(
      this.actividadService.getActividades().subscribe({
        next: (data) => this.onSuccessActividad(data),
        error: (e) => this.onFail(e),
        complete: () => this.loading = false
      })
    );
  }

  getUsers(): void {
    this.sub.push(
      this.userService.getUsers().subscribe({
        next: (data) => this.onSuccessUser(data),
        error: (e) => this.onFail(e),
        complete: () => this.loading = false
      })
    );
  }

  getSituacionClass(situacion: Situacion): string {
    const situacionClass = {
      PENDIENTE: 'bg-success',
      FINALIZADA: 'bg-primary',
      CANCELADA: 'bg-warning'
    }
    return situacionClass[situacion];
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  private onSuccessUser(data: User[]): void {
    data.forEach((u) => {
      u.userTipo === UserTipo.VOLUNTARIO ? this.widget_voluntarios++ : this.widget_organizaciones++;
    })
  }

  private onSuccessActividad(data: Actividad[]): void {
    data.sort((a, b) => a.creado < b.creado ? 1 : -1);
    this.actividades = data.slice(0,4);
    data.forEach((a) => {
      a.situacion === Situacion.PENDIENTE ? this.widget_actividades_pendientes++ : this.widget_actividades_finalizadas++;
    })
  }

  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.errorHandlingService.exec(e);
  }

}
