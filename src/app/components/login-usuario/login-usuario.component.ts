import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router }  from '@angular/router';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';

@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.scss']
})
export class LoginUsuarioComponent implements OnInit {

  loginForm: FormGroup;
  ocultarPassword: boolean = true;

  constructor(private usuarioService: UsuarioService, 
              private router: Router,
              private autenticadorJwtService: AutenticadorJwtService,
              private comunicaciondealertasservice: ComunicacionDeAlertasService) { 
                this.loginForm = new FormGroup({});
  }

  
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('rafa',[Validators.required, Validators.minLength(4)]),
      password: new FormControl('1234',[Validators.required])
    })
  }

  autenticaUsuario(){
    this.comunicaciondealertasservice.abrirDialogCargando();

    this.usuarioService.autenticaUsuario(this.loginForm.controls.username.value,
      this.loginForm.controls.password.value).subscribe(data => {
        if(data.jwt != undefined){
          this.autenticadorJwtService.almacenaJWT(data.jwt);
          this.router.navigate(['/listadoMensajes']);
          this.comunicaciondealertasservice.cerrarDialogo();
          this.usuarioService.emitirNuevoCambioEnUsuarioAutenticado();
        }
        else{
          this.comunicaciondealertasservice.abrirDialogError('Error de acceso')
        }
      });
  }

}
