import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted: boolean = false;
  public institucion: Institucion = {
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    img: ""
  };

  public cargando:boolean= false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required,  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', [Validators.required]],
    recordarme: [true]
  });

  constructor(private fb: FormBuilder,
    private router: Router, private usuarioService: UsuarioService,
    private institucionService:InstitucionService) {

    this.institucion= this.institucionService.institucion;

  }

  ngOnInit(): void {
  }

  login() {
    this.formSubmitted = true;
    this.cargando= true;
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        if (this.loginForm.get('recordarme')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        //this.cargando= false;
        this.router.navigateByUrl('dashboard');
      },
      error: (error) => {
        Swal.fire('Error', "Usuario y contraseña no son válidos.", 'error');
        this.cargando= false;
      }

    });
  }

  campoNoValido(campo: string) {
    if (this.loginForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string){
   
    if (this.loginForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoRequerido(campo: string) {
   
    if (this.loginForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
}
