import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss']
})
export class CambioPasswordComponent implements OnInit {
  form: FormGroup;
  hideActual = true;
  hideNueva = true;

  constructor(private router: Router,
    private usuariosService: UsuarioService,
    private comunicacionAlertas: ComunicacionDeAlertasService) {
      this.form = new FormGroup({});
  }

  ngOnInit() {
    this.form = new FormGroup({
      actual: new FormControl('', [Validators.required]),
      nueva: new FormControl('', [Validators.required]),
    });
  }

  actualizarPassword() {
    this.comunicacionAlertas.abrirDialogCargando();
    var actualEncriptada = this.encriptaMD5(this.form.controls.actual.value);

    this.usuariosService.ratificaPasswordUsuarioAutenticado(actualEncriptada).subscribe(resultado => {
      console.log(resultado);
      if (resultado["result"] == 'fail') {
        this.comunicacionAlertas.abrirDialogError('Contraseña actual inválida o no se puede comprobar');
      }
      else {
        var nuevaEncriptada = this.encriptaMD5(this.form.controls.nueva.value);
        this.usuariosService.cambiaPasswordUsuarioAutenticado(nuevaEncriptada).subscribe(resultado => {
          if (resultado["result"] == 'fail') {
            this.comunicacionAlertas.abrirDialogError('Error al actualizar la contraseña. Inténtelo más tarde.')
          }
          else {
            this.comunicacionAlertas.abrirDialogInfo('Contraseña actualizada').subscribe(result => {
              this.router.navigate(['/listadoMensajes']);
            });
          }
        })
      }
    });
  }

  encriptaMD5(texto: string): string {
    const md5 = new Md5();
    return md5.appendStr(texto).end().toString();
  }

  cancelar() {
    this.router.navigate(['/listadoMensajes']);
  }
}