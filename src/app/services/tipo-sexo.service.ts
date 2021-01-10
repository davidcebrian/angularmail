import { Injectable } from '@angular/core';
import { TipoSexo } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoSexoService {
  constructor(private http: HttpClient) { }

  getListadoTiposSexo(): Observable<TipoSexo[]> {
    return this.http.get<TipoSexo[]>('/tiposexo/all');
  }
}