import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

import Swal from "sweetalert2";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: [
  ]
})
export class RegistroComponent implements OnInit {

  miFormulario: FormGroup = this._fb.group({
    name: [ 'Test 4', [ Validators.required ] ],
    email: [ 'test1@gmail.com', [ Validators.required, Validators.email ] ],
    password: [ '123456', [ Validators.required, Validators.minLength(6) ] ],
  })

  constructor(
    private _fb:FormBuilder,
    private _router:Router,
    private _authService:AuthService  ) { }

  ngOnInit(): void {
  }

  registro() {

    const { name, email, password } = this.miFormulario.value;

    this._authService.registroUsuario( name, email, password )
      .subscribe( ok => {
        if (ok === true) {
          this._router.navigateByUrl('/dashboard');
        } else {
          Swal.fire('Error', ok, 'error');
        }
      } );


  }

}
