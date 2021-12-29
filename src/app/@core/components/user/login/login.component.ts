import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginHttpResponse } from 'src/app/@core/interfaces/login-http-response';
import { AlertIcon } from 'src/app/@core/shared/enum/alert-icon.enum';
import { AlertService } from 'src/app/@core/shared/services/alert.service';
import { AuthService } from 'src/app/@core/shared/services/auth.service';
import { ErrorHandlingService } from 'src/app/@core/shared/services/error-handling.service';
import { FormService } from 'src/app/@core/shared/services/form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  private sub: Subscription[] = [];
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private formService: FormService, private alertService: AlertService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadLoginForm()
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  // Carga la validacion del formulario
  private loadLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  // Realiza login
  onLogin(): void {
    if (this.loginForm.valid) {
      this.sub.push(
        this.authService.login(this.loginForm.value['username'], this.loginForm.value['password']).subscribe({
          next: (data) => this.onSuccess(data),
          error: (e) => this.onFail(e),
          complete: () => this.loading = false
        })
      );
    }
  }

  // Si el login es valido salva el token y el usuario en cache
  private onSuccess(data: LoginHttpResponse): void {
    this.authService.saveToken(data.access_token, data.refresh_token);
    this.authService.addUserToLocalCache(data.user);
    this.alertService.toastAlert(`Binvenido(a) ${data.user.fullName}`, AlertIcon.SUCCESS, 3000);
    this.router.navigate(['dashboard']);
  }

  private onFail(e: HttpErrorResponse): void {
    this.loading = false;
    this.alertService.toastAlert(e.error?.message, AlertIcon.ERROR, 3000);
  }

}
