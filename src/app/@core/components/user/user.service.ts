import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { User } from './user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API = environment.API_URL;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/user`);
  }
}
