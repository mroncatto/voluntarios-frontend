import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertIcon } from '../shared/enum/alert-icon.enum';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  private readonly allowed_url: string[] = ["/", "/dashboard", "register", "/actividad", "/actividad/**/show"];
  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Si realizo login permite
    if (this.authService.isUserLoggedIn()) return true;
    

    // Si intenta acceder a una URL abierta permite
    if(this.allowed_url.includes(state.url)) return true;
    

    // De lo contrario lo envia a la pagina de login
    this.router.navigate(['/login']);
    this.alertService.toastAlert('Su sessión ha expirado!', AlertIcon.INFO, 3000);
    return false;
  }

}
