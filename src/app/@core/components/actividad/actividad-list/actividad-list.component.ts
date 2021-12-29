import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { UserTipo } from '../../user/enum/tipo-user.enum';
import { Actividad } from '../actividad.entity';
import { ActividadService } from '../actividad.service';
import { Situacion } from '../enum/situacion.enum';

@Component({
  selector: 'app-actividad-list',
  templateUrl: './actividad-list.component.html',
  styleUrls: ['./actividad-list.component.css']
})
export class ActividadListComponent implements OnInit, OnDestroy {

  actividades: Actividad[] = [];
  private sub: Subscription[] = [];
  loading: boolean = false;
  paginator: any;

  constructor(private actividadService: ActividadService, private alertService: AlertService,
    private errorHandlingService: ErrorHandlingService, private authService: AuthService,
    private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.sub.push(
      this.activatedRoute.params.subscribe(params => {
        const page: number = params['page'];
        this.getActividades(page);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  // Valida si es de tipo Organizacion
  isOrganization(): boolean {
    return this.authService.getUserFromLocalStorage()?.userTipo === UserTipo.ORGANIZACION;
  }

  // Retornar la clase css en base a la situacion de la actividad
  getSituacionClass(situacion: Situacion): string {
    const situacionClass = {
      PENDIENTE: 'bg-success',
      FINALIZADA: 'bg-primary',
      CANCELADA: 'bg-warning'
    }
    return situacionClass[situacion];
  }

  // Verifica si esta autenticado
  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn;
  }

  // Cross Site Scripting
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  // Obtiene las actividades de forma pageable
  private getActividades(page: number = 0): void {
    this.loading = true;
    this.sub.push(
      this.actividadService.getActividadesPage(page)
        .pipe(
          tap(response => {
            // Ordena por fecha descendiente
            response.content = (response.content as Actividad[]).sort((a, b) => a.creado < b.creado ? 1 : -1);
          })
        )
        .subscribe({
          next: (data) => this.onSuccess(data),
          error: (e) => this.onFail(e),
          complete: () => this.loading = false
        })
    );
  }

  private onSuccess(data: any): void {
    this.actividades = data.content as Actividad[];
    this.paginator = data;
  }

  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.errorHandlingService.exec(e);
  }

}
