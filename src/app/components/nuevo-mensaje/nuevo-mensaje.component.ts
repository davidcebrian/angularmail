import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/interfaces/interfaces';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MensajesService } from 'src/app/services/mensajes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-nuevo-mensaje',
  templateUrl: './nuevo-mensaje.component.html',
  styleUrls: ['./nuevo-mensaje.component.scss']
})
export class NuevoMensajeComponent implements OnInit {
  usuarioAutenticado: Usuario;
  form: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  destinatariosFiltrados: Observable<Usuario[]>;
  destinatariosSeleccionados: Usuario[] = [];
  @ViewChild('DestinatariosInput') destinatariosInput: ElementRef<HTMLInputElement>;

  constructor(
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<NuevoMensajeComponent>,
    private mensajeService: MensajesService,
    private snackBar: MatSnackBar,
    private comunicacionAlertas : ComunicacionDeAlertasService
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario =>
      this.usuarioAutenticado = usuario);

    this.form = new FormGroup({
      destinatarios: new FormControl('', []),
      asunto: new FormControl('', [Validators.required]),
      cuerpo: new FormControl('', [Validators.required])
    });

    this.form.controls.destinatarios.valueChanges.pipe(
      debounceTime(300)).subscribe(filtro => {
        if (typeof filtro === 'string') {
          this.destinatariosFiltrados = this.usuarioService.filterUsuariosByNombreOrEmail(filtro);
        }
      });
  }

  volver() {
    this.dialogRef.close();
  }

  enviar() {
    if (this.destinatariosSeleccionados.length == 0) {
      this.comunicacionAlertas.mostrarSnackBar('No ha seleccionado ningún destinatario');
      return;
    }
    if (!this.form.controls.asunto.valid) {
      this.comunicacionAlertas.mostrarSnackBar('No ha escrito un asunto');
      return;
    }
    if (!this.form.controls.cuerpo.valid) {
      this.comunicacionAlertas.mostrarSnackBar('No ha escrito un mensaje');
      return;
    }

    this.mensajeService.enviarNuevoMensaje(this.destinatariosSeleccionados, this.form.controls.asunto.value,
      this.form.controls.cuerpo.value).subscribe(resultado => {
      if (resultado == null) {
        this.comunicacionAlertas.mostrarSnackBar('Error al enviar el mensaje. Inténtelo más tarde.')
      }
      else {
        this.comunicacionAlertas.mostrarSnackBar('Mensaje enviado')
        this.volver();
      }
    })

  }

  remove(destinatario: Usuario): void {
    const index = this.destinatariosSeleccionados.indexOf(destinatario);

    if (index >= 0) {
      this.destinatariosSeleccionados.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.destinatariosSeleccionados.push(event.option.value);
    this.destinatariosInput.nativeElement.value = '';
  }
}