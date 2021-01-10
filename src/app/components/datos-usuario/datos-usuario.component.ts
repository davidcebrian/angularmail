import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { Nacionalidad, TipoSexo, Usuario } from '../../interfaces/interfaces';
import { NacionalidadService } from '../../services/nacionalidad.service';
import { TipoSexoService } from '../../services/tipo-sexo.service';


@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.scss']
})

export class DatosUsuarioComponent implements OnInit {
  form: FormGroup;
  usuario: Usuario = null;
  nacionalidades: Nacionalidad[];
  tiposSexo: TipoSexo[];

  constructor(private router: Router,
    private usuarioService: UsuarioService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private nacionalidadService: NacionalidadService,
    private tipoSexoService: TipoSexoService) {
      this.nacionalidades = [];
      this.tiposSexo = [];
      this.form = new FormGroup({});
  }

  ngOnInit() {
    this.cargarNacionalidades();
    this.cargarTiposSexo();
    this.cargarDatosUsuarioAutenticado();
    this.form = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nombre: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      nacionalidad: new FormControl('', []),
      sexo: new FormControl('', []),
    });

  }

  cargarDatosUsuarioAutenticado() {
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuario => {
      this.usuario = usuario;
      this.form.controls.usuario.setValue(this.usuario.usuario);
      this.form.controls.email.setValue(this.usuario.email);
      this.form.controls.nombre.setValue(this.usuario.nombre);
      this.form.controls.fechaNacimiento.setValue(new Date(this.usuario.fechaNacimiento));
      this.form.controls.nacionalidad.setValue(this.usuario.nacionalidad);
      this.form.controls.sexo.setValue(this.usuario.sexo);
    });
  }

  cargarNacionalidades() {
    this.nacionalidadService.getListadoNacionalidades().subscribe(nacionalidades => nacionalidades.forEach(nacionalidad =>
      this.nacionalidades.push(nacionalidad)));
  }

  cargarTiposSexo() {
    this.tipoSexoService.getListadoTiposSexo().subscribe(tiposSexo => tiposSexo.forEach(tipo =>
      this.tiposSexo.push(tipo)));
  }

  usuarioSeleccionaFicheroImagen() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.readAsArrayBuffer(inputNode.files[0]);

      reader.onload = (e: any) => {
        this.usuario.imagen = btoa(
          new Uint8Array(e.target.result)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      };
    }
  }

  actualizarDatos() {
    this.comunicacionAlertas.abrirDialogCargando();

    this.usuario.usuario = this.form.controls.usuario.value;
    this.usuario.email = this.form.controls.email.value;
    this.usuario.nombre = this.form.controls.nombre.value;
    this.usuario.fechaNacimiento = this.form.controls.fechaNacimiento.value.getTime();
    this.usuario.nacionalidad = this.form.controls.nacionalidad.value;
    this.usuario.sexo = this.form.controls.sexo.value;

    this.usuarioService.actualizaDatosUsuario(this.usuario).subscribe(resultado => {
      if (resultado["result"] == "fail") {
        this.comunicacionAlertas.abrirDialogError('Error al actualizar los datos del usuario. Inténtelo más tarde.')
      }
      else {
        this.comunicacionAlertas.abrirDialogInfo('Usuario actualizado').subscribe(result => {
          this.router.navigate(['/listadoMensajes']);
        });
      }
    })
  }

  cancelar() {
    this.router.navigate(['/listadoMensajes']);
  }
}
