import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertIcon } from '../enum/alert-icon.enum';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private alert: AlertService, private authService: AuthService) { }

  // Proccesa los errores de las peticions http
  exec(e: HttpErrorResponse): void {
    switch (e.status) {
      case 400: {
        this.alert.normalAlert('Datos inválidos.', e.error?.message, AlertIcon.WARNING);
        break;
      }
      case 401: {
        if (this.authService.isUserLoggedIn()) {
          this.authService.onLogout();
        }
        this.alert.normalAlert('No autorizado.', "Es necesario autenticarse!", AlertIcon.WARNING);
        break;
      }
      case 403: {
        this.alert.normalAlert('Sin permisios.', "No posees los permisos para acceder a este contenido!", AlertIcon.WARNING);
        break;
      }
      case 404: {
        this.alert.normalAlert('No encontrado.', "El servidor no pudo encontrar el contenido solicitado!", AlertIcon.WARNING);
        break;
      }
      case 500: {
        this.alert.normalAlert('Error del servidor.', "Ha ocurrido un error interno, contacte el administrador!", AlertIcon.ERROR);
        break;
      }
      default: {
        this.alert.normalAlert('Error desconocido.', "Ha ocurrido un error desconocido, contacte el administrador!", AlertIcon.ERROR);
      }

    }

  }
}
