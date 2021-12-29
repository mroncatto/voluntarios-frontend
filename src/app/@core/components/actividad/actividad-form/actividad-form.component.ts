import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { FormService } from 'src/app/@core/shared/services/form.service';
import { UserTipo } from '../../user/enum/tipo-user.enum';
import { Actividad } from '../actividad.entity';
import { ActividadService } from '../actividad.service';
import { Situacion } from '../enum/situacion.enum';

@Component({
  selector: 'app-actividad-form',
  templateUrl: './actividad-form.component.html',
  styleUrls: ['./actividad-form.component.css']
})
export class ActividadFormComponent implements OnInit, OnDestroy {

  actividad: Actividad = new Actividad();
  actividadForm!: FormGroup;
  private sub: Subscription[] = [];
  loading: boolean = false;

  constructor(private alertService: AlertService, private formService: FormService, private formBuilder: FormBuilder,
    private actividadService: ActividadService, private authService: AuthService, private router: Router,
    private errorHandlingService: ErrorHandlingService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    // Verifica si el usuario es de tipo voluntario para cargar la actividad si existe ID
    if (!this.isVoluntario()) {
      this.activatedRoute.params.subscribe(params => {
        const id: number = params["id"];
        if (id) {
          this.sub.push(
            this.actividadService.getActividad(id).subscribe({
              next: (data) => this.onLoadActividad(data),
              error: (e) => this.onFail(e),
              complete: () => this.loading = false
            })
          )
        } else {
          this.loadActividadForm();
        }
      })
    }
  }



  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  // Crea o altera una actividad
  onCreateOrUpdate(): void {
    if (this.actividadForm.valid) {
      this.loading = true;
      // Alteracion de actividad
      if (this.actividad.id) {
        Object.assign(this.actividad, this.actividadForm.value);
        this.sub.push(
          this.actividadService.updateActividad(this.actividad).subscribe({
            next: (data) => this.onSuccess(data, true),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        );
      } else {
        // Crear una actividad
        Object.assign(this.actividad, this.actividadForm.value);
        const user = this.authService.getUserFromLocalStorage();
        if (user) this.actividad.creadoPor = user;
        this.sub.push(
          this.actividadService.createActividad(this.actividad).subscribe({
            next: (data) => this.onSuccess(data, false),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        );

      }
    }
  }

  // Valida si es de tipo voluntario
  private isVoluntario(): boolean {
    if (this.authService.getUserFromLocalStorage()?.userTipo === UserTipo.VOLUNTARIO) {
      this.router.navigate(['actividad']);
      this.alertService.normalAlert("Atención", "Necesitas una cuenta de tipo 'Organización' para crear actividades!", AlertIcon.WARNING);
      return true;
    }
    return false;
  }


  // Carga las validaciones de formBuilder
  private loadActividadForm(): void {
    this.actividadForm = this.formBuilder.group({
      actividad: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      detalle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      inicio: ['', Validators.required],
      situacion: [Situacion.PENDIENTE, Validators.required]
    })
  }


  private onSuccess(data: Actividad, alterada: boolean): void {
    this.alertService.normalAlert('Éxito', `Actividad ${alterada ? 'Alterada' : 'Registrada'}!`, AlertIcon.SUCCESS);
    this.router.navigate([`actividad/${data.id}/show`]);
  }


  private onLoadActividad(data: Actividad): void {
    this.loadActividadForm();

    // Valida que la actividad fue creada por el usuario que esta conectado
    if (data.creadoPor.username === this.authService.getUserFromLocalStorage()?.username) {
      this.actividad = data;
      this.actividadForm.setValue({
        actividad: data.actividad,
        detalle: data.detalle,
        inicio: data.inicio,
        situacion: data.situacion
      })
    } else {
      this.alertService.normalAlert("Atención", "Solo puedes alterar actividades que tu creaste", AlertIcon.WARNING);
      this.router.navigate(['actividad']);
    }


  }

  // Handling de errores de request
  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.errorHandlingService.exec(e);
    this.loadActividadForm();
  }


  // Handling de errores de formulario
  getErrorMessage(form: AbstractControl): String {
    return this.formService.getErrorMessage(form);
  }

}
