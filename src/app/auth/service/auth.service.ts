import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _baseURL = environment.baseURL;
  private _user! :Usuario;

  get usuario(){
    return { ...this._user };
  }

  constructor(
    private _http:HttpClient
  ) { }


  // peticion al back del login, este valida si existe un usuario ya 
  login(email:string, password:string)  {

  const url = ` ${ this._baseURL }/auth `;
  const body = { email, password };
    
  return this._http.post<AuthResponse>(url, body)
    .pipe( 
      tap( resp => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
        }
      } ),
      map( resp => resp.ok ),
      catchError(err => of(err.error.msg)  )
     )
  }


  // Registro de usuario, que valida a su vez si el usuario ya existe 
  registroUsuario( name:string, email:string, password:string)  {

    const url = ` ${ this._baseURL }/auth/new `;
    const body = {name, email, password };
      
    return this._http.post<AuthResponse>(url, body)
      .pipe( 
        tap( resp => {
          if (resp.ok) {
            localStorage.setItem('token', resp.token!); 
          }
        } ),
        map( resp => resp.ok ),
        catchError(err => of(err.error.msg)  )
       )
    }


  // Validar el token de estado de sesion
  validarToken():Observable<boolean> {

    const url = ` ${ this._baseURL }/auth/renew `;

    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')

    return this._http.get<AuthResponse>(url, {headers })
      .pipe(
        map(resp => {
          localStorage.setItem('token', resp.token!);
          this._user = {
            name: resp.name!, 
            uid: resp.uid!,
            email:resp.email!
          }

          return resp.ok

        }), catchError(err => of(false))
      );

  }

  // LogOut para eliminar el token y no qude la informacion por allí
  logOut = () => {
    localStorage.clear();
  }



}
