import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actividad } from './actividad.entity';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private readonly API = environment.API_URL;
  constructor(private http: HttpClient) { }

  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API}/actividad`);
  }

  getActividadesPage(page: number): Observable<any> {
    return this.http.get<any>(`${this.API}/actividad/page/${page}`);
  }

  getActividad(id:number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.API}/actividad/${id}`);
  }

  suscribe(actividad: Actividad): Observable<Actividad>{
    return this.http.put<Actividad>(`${this.API}/actividad/${actividad.id}/suscribe`, null);
  }

  createActividad(actividad: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(`${this.API}/actividad`, actividad);
  }
}
