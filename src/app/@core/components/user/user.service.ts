import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API = environment.API_URL;
  constructor(private http: HttpClient) { }

  // Obtiene todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/user`);
  }

  // Obtiene todos los usuarios de forma pageable
  getUsersPage(page: number): Observable<any> {
    return this.http.get<any>(`${this.API}/user/page/${page}`);
  }

  // Actualiza el profile del usuario (valida el usuario mediante su token)
  updateProfile(user: User): Observable<any> {
    return this.http.put<any>(`${this.API}/user/profile`, user);
  }

  // Altera el password del usuario (valida con el password antiguo en el backend)
  updatePassword(form: FormData): Observable<User> {
    return this.http.put<User>(`${this.API}/user/changepassword`, form);
  }


}
