import { Component, OnInit } from '@angular/core';
import { MensajesService } from '../../services/mensajes.service';
import { Mensaje } from '../../interfaces/interfaces';

@Component({
  selector: 'app-listado-mensajes',
  templateUrl: './listado-mensajes.component.html',
  styleUrls: ['./listado-mensajes.component.scss']
})
export class ListadoMensajesComponent implements OnInit {

  listaMensajes: Mensaje[];

  constructor(private mensajeService: MensajesService) { 
    this.listaMensajes = [];
  }

  ngOnInit(): void {
    this.mensajeService.getListadoMensajes(0,10).subscribe(data => {
      console.log(data);
      this.listaMensajes = data;
      this.listaMensajes.forEach(mensaje =>{
        console.log(mensaje);
      })
    });
  }

}
