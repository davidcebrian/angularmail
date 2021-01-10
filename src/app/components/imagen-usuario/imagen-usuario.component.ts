import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-imagen-usuario',
  templateUrl: './imagen-usuario.component.html',
  styleUrls: ['./imagen-usuario.component.scss']
})
export class ImagenUsuarioComponent {
  @Input('usuario') usuario: Usuario;
  @Input('width') width: number;
  @Input('height') height: number;

  constructor() { }
}