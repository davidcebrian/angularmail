import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Mensaje } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private http: HttpClient) { }

  getListadoMensajes(pagina: number, lineasPorPagina: number): Observable<Mensaje[]>{
    return this.http.get<Mensaje[]>('/mensajes/recibidos?pagina=' + pagina + 
    '&mensajesPorPagina=' + lineasPorPagina).pipe(

    );
  }
}
