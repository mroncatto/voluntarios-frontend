import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertIcon } from '../shared/enum/alert-icon.enum';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alert: AlertService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    /**
     * La metodologia con roles aun no esta implementada en la aplicacion !!!
     */

    // Si posee el role admin permite
    if (this.authService.hasRole("ADMIN")) return true;

    // De lo contrario nega el acceso
    this.router.navigate(['dashboard']);
    this.alert.normalAlert("Acceso Denegado", `No tienes privilegios para acceder a esta página`, AlertIcon.WARNING);
    return false;

  }

}
