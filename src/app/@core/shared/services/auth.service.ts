import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../components/user/user.entity';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = environment.API_URL;
  constructor(private http: HttpClient, private errorHandling: ErrorHandlingService) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.API}/user`, user).pipe(
      catchError(e => {
        this.errorHandling.exec(e);
        throw new Error(e);
      })
    )
  }

  
}
