import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../components/user/user.entity';
import { LoginHttpResponse } from '../../interfaces/login-http-response';
import { Token } from '../../interfaces/token';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private alohomora: string = environment.ALOHOMORA;
  readonly API = environment.API_URL;
  @Output() getLoggedInName: EventEmitter<User> = new EventEmitter();

  constructor(private http: HttpClient, private router: Router,
    private cryptService: CryptService) { }

  // Get para refrescar componente al realizar login o logout
  get isLoggedIn() {
    if (this.getUserFromLocalStorage() && !this.isTokenExpired()) this.loggedIn.next(true);
    return this.loggedIn.asObservable();
  }


  // Verifica si existe usuario autenticado
  isUserLoggedIn(): boolean {
    return this.getUserFromLocalStorage() !== null;
  }

  // Verifica si el token está expirado
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (token === null || token.length === 0) return false;
    const payload: Token = this.getTokenData(token);
    return payload.exp < (new Date().getTime() / 1000);
  }

  // Registro de voluntarios y organizaciones
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.API}/user`, user);
  }

  // Realiza login
  login(username: string, password: string): Observable<LoginHttpResponse> {
    return this.http.post<LoginHttpResponse>(`${this.API}/auth/token`, this.getLoginForm(username, password));
  }

  // Realiza logout eliminando los items de localStorage
  onLogout(): void {
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigate(['/dashboard']);
  }

  // Salva el token en localStorage
  saveToken(access_token: string, refresh_token: string): void {
    localStorage.setItem('access_token', this.cryptService.encrypt(JSON.stringify(access_token), this.alohomora));
    localStorage.setItem('refresh_token', this.cryptService.encrypt(JSON.stringify(refresh_token), this.alohomora));
  }

  // Obtiene el token de localStorage
  getToken(): string | null {
    return this.cryptService.decrypt(localStorage.getItem('access_token') as string, this.alohomora);
  }

  // Adiciona el usuario autenticado a localStorage
  addUserToLocalCache(user: User): void {
    localStorage.removeItem('user');
    localStorage.setItem('user', this.cryptService.encrypt(JSON.stringify(user), this.alohomora));
    this.getLoggedInName.emit(user);
  }

  // Obtiene el usuario de localStorage
  getUserFromLocalStorage(): User | null {
    const userEncrypted = localStorage.getItem('user') as string;
    if (userEncrypted !== null) return JSON.parse(this.cryptService.decrypt(userEncrypted, this.alohomora));
    return null;
  }

  // Verifica si el usuario posee un rol especifico
  hasRole(role: string): boolean {
    let hasRole: boolean = false;
    this.getUserFromLocalStorage()?.roles.forEach((r) => {
      if (r.role === role) hasRole = true;
    })
    return hasRole;
  }

  // Obtiene los datos del token
  private getTokenData(token: string): Token {
    return JSON.parse(atob(token?.split(".")[1]));
  }

  // Prepara el formulario para login
  private getLoginForm(username: string, password: string): FormData {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    return form;
  }

}
