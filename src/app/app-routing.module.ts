import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginUsuarioComponent } from '../app/components/login-usuario/login-usuario.component';
import { CambioPasswordComponent } from './components/cambio-password/cambio-password.component';
import { ListadoMensajesComponent } from './components/listado-mensajes/listado-mensajes.component';
import { DatosUsuarioComponent } from './components/datos-usuario/datos-usuario.component';
const routes: Routes = [
  {path:'', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginUsuarioComponent},
  {path: 'listadoMensajes', component: ListadoMensajesComponent},
  {path: 'cambioPassword', component: CambioPasswordComponent},
  {path: 'datosUsuario', component: DatosUsuarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
