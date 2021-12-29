import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { FormService } from 'src/app/@core/shared/services/form.service';
import { Actividad } from '../../actividad/actividad.entity';
import { ActividadService } from '../../actividad/actividad.service';
import { Situacion } from '../../actividad/enum/situacion.enum';
import { UserTipo } from '../enum/tipo-user.enum';
import { User } from '../user.entity';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User = new User();
  profile!: User | null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  private sub: Subscription[] = [];
  loading: boolean = false;
  actividades: Actividad[] = [];

  constructor(private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder,
    private formService: FormService, private alertService: AlertService, private errorHandlingService: ErrorHandlingService,
    private actividadService: ActividadService) { }

  ngOnInit(): void {
    this.profile = this.authService.getUserFromLocalStorage();

    // Si el usuario en cache es valido carga la validacion de formulario y luego el profile
    if (this.profile) {
      this.loadProfileForm().then(() => {
        if (this.profile) {
          this.profileForm.setValue({
            fullName: this.profile.fullName,
            email: this.profile.email,
            ciudad: this.profile.ciudad
          })
        }
        this.loadActividades();
      })
    }

    // Validacion de formulario de cambio de password
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatpassword: ['', Validators.required]
    }, { validators: this.checkPasswords })
  }

  // Verifica si el password nuevo y su repeticion coinciden
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('newpassword')?.value;
    let confirmPass = group.get('repeatpassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }


  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  private async loadProfileForm(): Promise<void> {
    this.profileForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(45)]],
      ciudad: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]]
    })
  }

  /**
   * Si el profile es valido carga las actividades suscriptas si es voluntario y 
   * las actividades creadas si es organizacion
   */
  private loadActividades(): void {
    if (this.profile) {
      this.loading = true;
      if (this.profile.userTipo === UserTipo.VOLUNTARIO) {
        this.sub.push(
          this.actividadService.getActividadesByUser(this.profile.id).subscribe({
            next: (data) => this.onGetActividades(data),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        )
      } else {
        this.sub.push(
          this.actividadService.getActividadesByOrg(this.profile.id).subscribe({
            next: (data) => this.onGetActividades(data),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        )
      }
    }
  }

  // Altera los datos del profile
  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      Object.assign(this.profile, this.profileForm.value);
      if (this.profile) {
        this.sub.push(
          this.userService.updateProfile(this.profile).subscribe({
            next: (data) => this.onSuccess(data, true),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        );
      }
    }
  }

  // Altera el password
  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.sub.push(
        this.userService.updatePassword(this.getChangePwdForm(this.passwordForm.value)).subscribe({
          next: (data) => this.onSuccess(data, false),
          error: (e) => this.onFail(e),
          complete: () => this.loading = false
        })
      )
    }
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

  // Prepara el form para los parametros del servicio
  private getChangePwdForm(data: any): FormData {
    const form = new FormData();
    if (this.profile) {
      form.append('username', this.profile.username);
      form.append('newpassword', data.newpassword);
      form.append('oldpassword', data.password);
    }
    return form;
  }

  // processa el success de alteracion del profile y password
  private onSuccess(data: User, updateProfile: boolean): void {
    if (updateProfile) {
      this.authService.addUserToLocalCache(data);
      this.profile = data;
      this.alertService.toastAlert('Alteraciones salvas!', AlertIcon.SUCCESS, 3000);
    } else {
      this.alertService.toastAlert('La contraseña fue alterada!', AlertIcon.SUCCESS, 3000);
      this.passwordForm.reset();
    }
  }

  // Carga las actividades del usuario
  private onGetActividades(data: Actividad[]): void {
    this.actividades = data.sort((a, b) => a.creado < b.creado ? 1 : -1);
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
