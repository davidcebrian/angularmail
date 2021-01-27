import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListadoMensajes, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  public static readonly RECIBIDOS = 0;
  public static readonly ENVIADOS = 1;
  public static readonly SPAM = 2;
  public static readonly ARCHIVADOS = 3;
  
  constructor(
    private http: HttpClient
  ) { }

  getListadoMensajes(tipo: number, pagina: number, lineasPorPagina: number): Observable<ListadoMensajes> {
    return this.http.get<ListadoMensajes>('/mensajes/listadoPorTipo?tipo=' + tipo +
      '&pagina=' + pagina + '&lineasPorPagina=' + lineasPorPagina).pipe(
        //tap(data => console.log(data)), // Si deseas hacer algo con los datos obtenidos, puedes hacerlo en esta línea
      );
  }

  /**
   * Envía un comando para realizar una acción sobre un mensaje. El tipo de acción tiene código
   * 		0 -> marca como mensajes leídos
   * 		1 -> marca como mensajes archivados
   * 		2 -> marca como mensajes spam
   * 		3 -> marca como mensajes eliminados
   * 		4 -> mueve el mensaje a "recibidos", elimina las marcas de "leído", "archivado", "spam" y "eliminado"
   */
  accionSobreMensajes(ids: number[], tipoAccion: number) {
    var dto = {
      'ids': ids,
      'tipoAccion': tipoAccion
    };
    return this.http.post<string>('/mensajes/accionSobreMensajes', dto);
  }

  enviarNuevoMensaje (destinatarios: Usuario[], asunto: string, cuerpo: string) {
    var idsDestinatarios: number[] = [];
    
    destinatarios.forEach(usuario => idsDestinatarios.push(usuario.id)); 
    
    var dto = {
      'idsDestinatarios': idsDestinatarios,
      'asunto': asunto,
      'cuerpo': cuerpo
    };
    
    return this.http.put<string>('/mensajes/nuevo', dto);
  }
}

