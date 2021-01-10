import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutenticadorJwtService {
  //jwtPorSesion: string;

  constructor() { 
  }

  almacenaJWT(token: string) {
    //this.jwtPorSesion = token;
    localStorage.setItem("jwt", token);
  }

  recuperaJWT() {
    //return this.jwtPorSesion
    return localStorage.getItem("jwt");
  }

  eliminaJwt() {
    //this.jwtPorSesion = null;
    localStorage.removeItem("jwt");
  }
}
