import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../user/user.entity';
import { Actividad } from './actividad.entity';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private readonly API = environment.API_URL;
  constructor(private http: HttpClient) { }

  // Obtiene todas las actividades 
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API}/actividad`);
  }
  // Obtiene todas las actividades de forma pageable
  getActividadesPage(page: number): Observable<any> {
    return this.http.get<any>(`${this.API}/actividad/page/${page}`);
  }

  // Obtiene todas las actividades que un determinado voluntario esta suscripto
  getActividadesByUser(id: number): Observable<Actividad[]>{
    return this.http.get<Actividad[]>(`${this.API}/actividad/user/${id}`);
  }

  // Obtiene todas las actividades que una determinada organizacion ha creado
  getActividadesByOrg(id: number): Observable<Actividad[]>{
    return this.http.get<Actividad[]>(`${this.API}/actividad/org/${id}`);
  }

  // Obtiene una actividad por su ID
  getActividad(id:number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.API}/actividad/${id}`);
  }

  // Actualiza una actividad
  updateActividad(actividad: Actividad): Observable<Actividad>{
    return this.http.put<Actividad>(`${this.API}/actividad/${actividad.id}`, actividad);
  }

  // Suscribe o Desuscribe un usuario de una actividad (obtiene el usuario desde su token)
  suscribe(actividad: Actividad): Observable<Actividad>{
    return this.http.put<Actividad>(`${this.API}/actividad/${actividad.id}/suscribe`, null);
  }

  // Crea una nueva actividad
  createActividad(actividad: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(`${this.API}/actividad`, actividad);
  }
}
