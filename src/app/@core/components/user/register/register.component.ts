import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { FormService } from 'src/app/@core/shared/services/form.service';
import { UserTipo } from '../enum/tipo-user.enum';
import { User } from '../user.entity';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  user: User = new User();
  userForm!: FormGroup;
  private sub: Subscription[] = [];
  loading: boolean = false;

  constructor(private authService: AuthService, private formService: FormService, private formBuilder: FormBuilder,
    private alertService: AlertService, private router: Router, private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {
    this.loadUserForm();
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  // Carga la validacion del registro
  private loadUserForm(): void {
    this.userForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(45)]],
      ciudad: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern("[a-zA-Z]*")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userTipo: [UserTipo.VOLUNTARIO, Validators.required]
    })
  }


  onCreateOrUpdate(): void {
    if (this.userForm.valid) {

      // Si existe ID (se trata de alteraciones)
      if (this.user.id) {

        // *** No utilizado ****

      } else {
        // De lo contrario un nuevo registro
        Object.assign(this.user, this.userForm.value);
        this.sub.push(
          this.authService.register(this.user).subscribe({
            next: (data) => this.onSuccess(data),
            error: (e) => this.onFail(e),
            complete: () => this.loading = false
          })
        );

      }
    }
  }

  private onSuccess(data: User): void {
    this.alertService.normalAlert('Éxito', this.user.id ? 'Cuenta Alterada!' : 'Cuenta Registrada!', AlertIcon.SUCCESS);
    this.router.navigate(['login']);
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
