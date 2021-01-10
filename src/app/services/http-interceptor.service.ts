import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AutenticadorJwtService } from './autenticador-jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{
  urlWebAPI = 'http://localhost:8080';

  constructor(private autenticadorJwt: AutenticadorJwtService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | any = this.autenticadorJwt.recuperaJWT();

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    } 
    
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json; charset=utf-8') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    const newUrl = {url: this.urlWebAPI + request.url};
    request = Object.assign(request, newUrl);
    const newUrlWithParams = {urlWithParams: this.urlWebAPI + request.urlWithParams};
    request = Object.assign(request, newUrlWithParams);
    
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log('event--->>>', event);
          // Si utilizas esta línea obtendrás un log de todas las respuestas http recibidas en tu app
        }
        return event;
      }),
      finalize(() => {
       })
      );
  }
}
