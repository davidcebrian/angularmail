import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mensaje, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-detalle-mensaje',
  templateUrl: './detalle-mensaje.component.html',
  styleUrls: ['./detalle-mensaje.component.scss']
})
export class DetalleMensajeComponent implements OnInit {
  usuarioRemitente: Usuario;
  usuarioAutenticado: Usuario;

  constructor(
    @Inject(MAT_DIALOG_DATA) public mensaje: Mensaje,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<DetalleMensajeComponent>,
    private mensajeService: MensajesService,
    private comunicacionDeAlertas: ComunicacionDeAlertasService
  ) { }

  ngOnInit() {
    this.usuarioService.getUsuario(this.mensaje.remitente.id, true).subscribe(usuarioObtenido => {
      this.usuarioRemitente = usuarioObtenido;
    });
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario => this.usuarioAutenticado = usuario);
    this.accionSobreMensajes(0);
  }

  volver() {
    this.dialogRef.close();
  }

  botonArchivarHabilitado() {
    return (!this.mensaje.archivado && !this.mensaje.spam && this.usuarioAutenticado != null && this.usuarioAutenticado.id != this.mensaje.remitente.id);
  }

  botonSpamHabilitado() {
    return (!this.mensaje.archivado && !this.mensaje.spam && this.usuarioAutenticado != null && this.usuarioAutenticado.id != this.mensaje.remitente.id);
  }

  botonEliminarHabilitado() {
    return (this.mensaje.fechaEliminacion == null && this.usuarioAutenticado != null && this.usuarioAutenticado.id != this.mensaje.remitente.id);
  }

  botonMoverARecibidosHabilitado() {
    return (this.mensaje.archivado || this.mensaje.spam);
  }

 /** 		0 -> marca como mensajes leídos
	 * 		1 -> marca como mensajes archivados
	 * 		2 -> marca como mensajes spam
	 * 		3 -> marca como mensajes eliminados
	 * 		4 -> mueve el mensaje a "recibidos", elimina las marcas de "leído", "archivado", "spam" y "eliminado"
   */
  accionSobreMensajes(tipoAccion: number) {
    this.mensajeService.accionSobreMensajes([this.mensaje.id], tipoAccion).subscribe(strResult => {
      if (strResult['result'] == 'fail') {
        if (tipoAccion != 0) {
          this.comunicacionDeAlertas.mostrarSnackBar('Error al realizar la operación. Inténtelo más tarde.')
        }
      }
      else {
        if (tipoAccion != 0) {
          this.volver();
        }
      }
    });
  }
}
