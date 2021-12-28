import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';
import { AlertIcon } from '../shared/enum/alert-icon.enum';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private alertService:AlertService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // No agrega el token si esta realizando login
    if (request.url.includes(`${this.authService.API}/auth/token`)) {
      return next.handle(request);
    }

    //Obtiene el token
    const token = this.authService.getToken();

    // Si el token está expirado, realiza logout
    if (this.authService.isTokenExpired()) {
      this.authService.onLogout();
      this.alertService.toastAlert('Su sessión ha expirado!', AlertIcon.INFO, 3000);
      return next.handle(request);
    }

    // Injecta el token en el header de la peticion
    if (token === null || token === "") return next.handle(request);
    const authenticated_request = request.clone({ setHeaders: { Authorization: `Bearer ${JSON.parse(token)}` } });
    return next.handle(authenticated_request);

  }



}
