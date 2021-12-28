import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Situacion } from 'src/app/@core/enum/situacion.enum';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { UserTipo } from '../../user/tipo-user.enum';
import { User } from '../../user/user.entity';
import { Actividad } from '../actividad.entity';
import { ActividadService } from '../actividad.service';

@Component({
  selector: 'app-actividad-show',
  templateUrl: './actividad-show.component.html',
  styleUrls: ['./actividad-show.component.css']
})
export class ActividadShowComponent implements OnInit, OnDestroy {

  actividad!: Actividad;
  private sub: Subscription[] = [];
  loading: boolean = false;
  private currentUser!: User | null;
  constructor(private actividadService: ActividadService, private alertService: AlertService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // Carga la actividad mediante el ID
    this.activatedRoute.params.subscribe(params => {
      const id: number = params['id'];
      if (id) {
        this.sub.push(
          this.actividadService.getActividad(id).subscribe({
            next: (data) => this.onSuccess(data, false),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        )
      } else {
        this.router.navigate(['actividades']);
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  // Verifica si el usuario actual esta suscrito a la actividad
  isInclude(): boolean {
    if (this.currentUser === null) return false;
    let exist: boolean = false;
    this.actividad.voluntarios.forEach((u) => {
      if (u.username == this.currentUser?.username) exist = true;
    });
    return exist;
  }

  // Obtienen el usuario autenticado
  getCurrentUser(): string | undefined {
    return this.currentUser?.username;
  }

  // Verifica si el usuario es del tipo Organizacion
  isOrganization(): boolean {
    return this.authService.getUserFromLocalStorage()?.userTipo === UserTipo.ORGANIZACION;
  }

  // Verifica si está autenticado
  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }

  // Cross Site Scripting
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  async suscribe(accion: string): Promise<void> {
    if (await this.alertService.confirmAlert('Suscripción', `Deseas ${accion} la actividad '${this.actividad.actividad}' ?`, AlertIcon.QUESTION)) {
      if (this.currentUser !== null) {
        this.sub.push(
          this.actividadService.suscribe(this.actividad).subscribe({
            next: (data) => this.onSuccess(data, true),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        )
      } else {
        this.router.navigate(['login']);
        this.alertService.normalAlert("Ya posee una cuenta ?", "Realiza login para participar de las actividades!", AlertIcon.INFO);
      }
    }
  }

  // Obtiene css para las situaciones correspondientes
  getSituacionClass(situacion: Situacion): string {
    const situacionClass = {
      PENDIENTE: 'bg-success',
      FINALIZADA: 'bg-primary',
      CANCELADA: 'bg-warning'
    }
    return situacionClass[situacion];
  }

  private onSuccess(data: Actividad, suscribe: boolean): void {
    this.actividad = data;
    if (suscribe) {
      this.alertService.toastAlert(`Éxito, acabas de ${this.isInclude() ? 'suscribirse a' : 'desuscribirse de'} la actividad`, AlertIcon.INFO, 5000);
    } else {
      this.currentUser = this.authService.getUserFromLocalStorage();
    }
  }

  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.alertService.normalAlert('Error', e.error?.message, AlertIcon.ERROR);
    this.router.navigate(['actividades']);
  }



}
