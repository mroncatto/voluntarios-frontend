import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Situacion } from 'src/app/@core/enum/situacion.enum';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { FormService } from 'src/app/@core/shared/services/form.service';
import { UserTipo } from '../../user/tipo-user.enum';
import { Actividad } from '../actividad.entity';
import { ActividadService } from '../actividad.service';

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
    private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {
    this.checkTipoUser();
    this.loadActividadForm();
  }



  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  onCreateOrUpdate(): void {
    if (this.actividadForm.valid) {
      // Update
      if (this.actividad.id) {

      } else {
        // New
        Object.assign(this.actividad, this.actividadForm.value);
        const user = this.authService.getUserFromLocalStorage();
        if (user) this.actividad.creadoPor = user;
        this.sub.push(
          this.actividadService.createActividad(this.actividad).subscribe({
            next: (data) => this.onSuccess(data),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        );

      }
    }
  }

  private checkTipoUser(): void {
    if (this.authService.getUserFromLocalStorage()?.userTipo === UserTipo.VOLUNTARIO) {
      this.router.navigate(['actividad']);
      this.alertService.normalAlert("Atención", "Necesitas una cuenta de tipo 'Organización' para crear actividades!", AlertIcon.WARNING);
    }
  }


  private loadActividadForm(): void {
    this.actividadForm = this.formBuilder.group({
      actividad: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      detalle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      inicio: ['', Validators.required],
      situacion: [Situacion.PENDIENTE, Validators.required]
    })
  }

  private onSuccess(data: Actividad): void {
    this.alertService.normalAlert('Éxito', 'Actividad Registrada!', AlertIcon.SUCCESS);
    this.router.navigate([`actividad/${data.id}/show`]);
  }

  // Handling de errores de request
  private onFail(e: HttpErrorResponse): void {
    this.loading = false
    this.errorHandlingService.exec(e);
  }


  // Handling de errores de formulario
  getErrorMessage(form: AbstractControl): String {
    return this.formService.getErrorMessage(form);
  }

}
