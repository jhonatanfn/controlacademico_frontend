import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public titulo: string = 'Datos de Usuario';
  public icono: string = 'bi bi-person';
  public titulo2: string = 'Imagen de Perfil';
  public icono2: string = 'bi bi-person-circle';
  public titulo3: string = 'Cambiar password';
  public icono3: string = 'bi bi-unlock-fill';
  public titulo4: string = 'Datos Personales';
  public icono4: string = 'bi bi-person-check-fill';

  public perfilForm!: FormGroup;
  public datosForm!: FormGroup;
  public passForm!:FormGroup;

  public formSubmitted: boolean = false;
  public formSubmitted2: boolean = false;
  public formSubmitted3: boolean = false;

  public usuario!: Usuario;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService, private personaService: PersonaService) {
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required, Validators.maxLength(15)]],
      email: [this.usuario.email, [Validators.required, Validators.pattern(this.emailPattern)]],
      personaId: [this.usuario.persona.id]
    });

    this.datosForm = this.fb.group({
      numero: [this.usuario.persona.numero],
      nombres: [this.usuario.persona.nombres, Validators.required],
      apellidopaterno: [this.usuario.persona.apellidopaterno, Validators.required],
      apellidomaterno: [this.usuario.persona.apellidomaterno, Validators.required],
      direccion: [this.usuario.persona.direccion],
      telefono: [this.usuario.persona.telefono],
      tipodocumentoId: [this.usuario.persona.tipodocumento.id]
    });

    this.passForm= this.fb.group({
        password:['',Validators.required],
        password2:['',Validators.required]
    });
  }

  campoNoValido(campo: string) {

    if (this.perfilForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoRequerido(campo: string) {
    if (this.perfilForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoRequerido2(campo: string) {
    if (this.datosForm.get(campo)?.getError('required') && this.formSubmitted2) {
      return true;
    } else {
      return false;
    }
  }

  campoMaxLengh(campo: string) {

    if (this.perfilForm.get(campo)?.value === "") {
      return;
    }
    if ((this.perfilForm.get(campo)?.getError('maxlength')?.requiredLength == 15) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if ((this.perfilForm.get(campo)?.errors !== null) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  actualizarPefil() {
    this.formSubmitted = true;

    if (this.perfilForm.valid) {

      Swal.fire({
        title: 'Actualizar',
        text: "Desea actualizar su perfil",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {

          this.usuarioService.actualizarPerfil(this.perfilForm.value)
            .subscribe(({ ok, msg, usuario }) => {

              if (ok) {
                this.usuario.nombre = usuario.nombre;
                this.usuario.email = usuario.email;
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                })
              } 

            },(error)=>{
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.error.msg,
                showConfirmButton: false,
                timer: 2500
              })
            });
        }
      })
    }
  }

  cambiarImagen(event: any) {
    this.imagenSubir = event.target.files[0];
    if (!event.target.files[0]) {
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
    return true;
  }

  subirImagen() {

    Swal.fire({
      title: 'Actualizar',
      text: "Desea actualizar la foto de perfil",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.actualizarFoto(this.imagenSubir, this.usuario.id!)
          .then(img => {

            this.usuario.persona.img = img;
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Su foto de perfil fue actualizada',
              showConfirmButton: false,
              timer: 2500
            })
          });
      }
    })
  }

  actualizarDatos() {
    this.formSubmitted2 = true;

    if (this.datosForm.valid) {

      Swal.fire({
        title: 'Actualizar',
        text: "Desea actualizar sus datos",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.actualizar(this.usuario.persona.id!, this.datosForm.value)
            .subscribe(({ ok, msg, persona }) => {
              if (ok) {
                this.usuario.persona = persona;
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                })
              } else {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                })
              }
            });
        }
      })

    }
  }

  actualizarPassword(){
    this.formSubmitted3= true;
    if(this.contrasenasNoValidas()){
      this.passForm.controls['password2'].setErrors({NoEsIgual:true});
    }

    if(this.passForm.valid){

      Swal.fire({
        title: 'Actualizar',
        text: "Desea actualizar su password",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.actualizarPassword(this.passForm.value)
            .subscribe(({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                })
              } else {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                })
              }
            });
        }
      })
    }
  }

  contrasenasNoValidas(){
    const pass1= this.passForm.get('password')?.value;
    const pass2= this.passForm.get('password2')?.value;
    if((pass1!==pass2) && this.formSubmitted3){
      return true;
    }else{
      return false;
    }
  }

}
