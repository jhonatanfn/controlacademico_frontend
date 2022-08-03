import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PersonaService } from 'src/app/services/persona.service';
import { MenuService } from 'src/app/services/menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';

import { Role } from 'src/app/models/role.model';
import { Persona } from 'src/app/models/persona.model';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public cargando: boolean = true;
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public usuarioForm!: FormGroup;
  public formSubmitted: boolean = false;
  public formSubmitted2: boolean = false;
  public roles: Role[] = [];
  public persona!: Persona;
  public passForm!: FormGroup;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebutton2') closebutton2: any;
  public titleModal: string = "";
  public titleButton: string = "";
  public band: number = 1;
  public personas: Persona[] = [];
  selectedPersona!: any;
  public persona_numero: string = "";
  public persona_nombres: string = "";
  public persona_apellidopaterno: string = "";
  public persona_apellidomaterno: string = "";
  public existePersona: boolean = false;
  public personaObj!: Persona;
  public usuariologin!:Usuario;

  public rolseleccionado: any="";

  constructor(public usuarioServices: UsuarioService, private menuService: MenuService,
    private fb: FormBuilder, private roleService: RoleService,
    private personaService: PersonaService) {

    this.menuService.getTituloRuta().subscribe(({ titulo, icono }) => {
      this.titulo = titulo;
      this.icono = icono;
    });

    this.roleService.listar().subscribe(({ ok, roles }) => {
      if (ok) {
        this.roles = roles;
      }
    });

    this.personaService.listar().subscribe({
      next: ({ok,personas})=>{
        if(ok){
          this.personas= personas;
        }
      }
    })
  }

  ngOnInit(): void {
    this.usuariologin= this.usuarioServices.usuario;
    this.listarUsuarios();
    this.usuarioForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.maxLength(30)]],
      roleId: ['', Validators.required],
      personaId: [''],
      password: ['123456']
    });
    this.passForm = this.fb.group({
      id: [''],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  listarUsuarios() {
    this.cargando = true;
    if(this.rolseleccionado){
     
      this.usuarioServices.listarUsuariosPorRol(this.desde, Number(this.rolseleccionado))
        .subscribe(({ usuarios, total }) => {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.totalRegistros = total;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }else{
      this.usuarioServices.listarUsuarios(this.desde)
        .subscribe(({ usuarios, total }) => {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.totalRegistros = total;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

  cambiarPagina(valor: number) {

    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde >= this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarUsuarios();
  }

  controlBotonesPaginacion() {
    if (this.usuarios.length !== 5) {
      this.ds = true;
    } else {
      this.ds = false;
    }
    if (this.desde === 0) {
      this.da = true;
    } else {
      this.da = false;
    }
  }

  abrirModal() {
    this.titleModal = "Crear Usuario";
    this.titleButton = "Guardar";
    this.band = 1;
    this.formSubmitted = false;
    this.usuarioForm.controls['nombre'].setValue('');
    this.usuarioForm.controls['email'].setValue('');
    this.usuarioForm.controls['roleId'].setValue('');
    this.usuarioForm.controls['personaId'].setValue('');
    this.usuarioForm.controls['password'].setValue('123456');
    this.usuarioForm.controls['id'].setValue('');
   
    this.existePersona = false;
    this.selectedPersona = null;

  }

  personaSeleccionado() {
    if (this.selectedPersona) {
      this.existePersona = true;
      this.persona_numero = this.selectedPersona[1];
      this.persona_nombres = this.selectedPersona[2];
      this.persona_apellidopaterno = this.selectedPersona[3];
      this.persona_apellidomaterno = this.selectedPersona[4];
      this.usuarioForm.controls['personaId'].setValue(this.selectedPersona[0]);
    } else {
      this.existePersona = false;
      this.selectedPersona = null;
      this.usuarioForm.controls['personaId'].setValue('');
    }
  }


  eliminarUsuario(usuario: Usuario) {

    if (usuario.id === this.usuarioServices.id) {
      return Swal.fire('No puede borrar este usuario');
    }
    Swal.fire({
      title: 'Borrar Usuario',
      text: "Está a punto de borrar a: " + usuario.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioServices.eliminarUsuario(usuario.id!)
          .subscribe(resp => {

            this.totalRegistros--;
            if (this.desde === this.totalRegistros) {
              this.desde -= 5;
            }

            this.listarUsuarios();
            Swal.fire(
              'Borrado',
              'Registro borrado exitosamente.',
              'success'
            )
          })

      }
    })
    return true;
  }


  buscarUsuarios(termino: string) {

    if(this.rolseleccionado){
      if(termino.length===0){
        this.listarUsuarios();
      }else{
        this.usuarioServices.buscarporrol(termino,Number(this.rolseleccionado))
        .subscribe((resp: Usuario[]) => {
          this.usuarios = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
      }
    }else{
      if(termino.length===0){
        this.listarUsuarios();
      }else{
        this.usuarioServices.buscar(termino)
        .subscribe((resp: Usuario[]) => {
          this.usuarios = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
      }
    }
  }

  campoRequerido(campo: string) {
    if (this.usuarioForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoRequerido2(campo: string) {
    if (this.passForm.get(campo)?.getError('required') && this.formSubmitted2) {
      return true;
    } else {
      return false;
    }
  }

  campoMaxLengh(campo: string, longitud: number) {
    if (this.usuarioForm.get(campo)?.value === "") {
      return;
    }
    if ((this.usuarioForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  editarUsuario(usuario: Usuario) {

    this.titleModal = "Editar Usuario";
    this.titleButton = "Actualizar";
    this.band = 2;
    if (usuario.id === this.usuarioServices.id) {
      return Swal.fire('No puede editar este usuario');
    }
    this.usuarioForm.controls['nombre'].setValue(usuario.nombre);
    this.usuarioForm.controls['email'].setValue(usuario.email);
    this.usuarioForm.controls['roleId'].setValue(usuario.role.id);
    this.usuarioForm.controls['personaId'].setValue(usuario.persona.id);
    this.usuarioForm.controls['id'].setValue(usuario.id);
    //this.cargarPersona();
    return true;
  }

  cargarPersona(){
    
    this.personas.forEach(persona=>{
      if(persona.id===this.usuarioForm.get('personaId')?.value){
        this.existePersona = true;
        this.persona_numero = persona.numero!;
        this.persona_nombres = persona.nombres!;
        this.persona_apellidopaterno = persona.apellidopaterno!;
        this.persona_apellidomaterno = persona.apellidomaterno!;
        return;
      }
    });
    
  }


  actualizarUsuario() {
    this.formSubmitted = true;
    console.log(this.usuarioForm.valid);
    if (this.usuarioForm.valid) {

      if (this.band === 1) {

        Swal.fire({
          title: 'Guardar',
          text: "¿Desea crear el usuario? ",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'No',
          confirmButtonText: 'Si'
        }).then((result) => {
          if (result.isConfirmed) {
            this.closebutton.nativeElement.click();
            this.usuarioServices.crearUsuario(this.usuarioForm.value)
              .subscribe(({ ok, msg }) => {
                if (ok) {
                  this.listarUsuarios();
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  })
                }else{
                  Swal.fire({
                    position: 'top-end',
                    icon: 'info',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
              }, (error) => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: error.error.msg,
                  showConfirmButton: false,
                  timer: 1500
                })
              });
          }
        })
      } else {

        Swal.fire({
          title: 'Actualizar',
          text: "Desea actualizar a: " + this.usuarioForm.get('nombre')?.value,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'No',
          confirmButtonText: 'Si'
        }).then((result) => {
          if (result.isConfirmed) {
            this.closebutton.nativeElement.click();
            this.usuarioServices.actualizarUsuario(this.usuarioForm.value)
              .subscribe(({ ok, msg }) => {
                if (ok) {

                  this.listarUsuarios();
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  })
                }

              }, (error) => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: error.error.msg,
                  showConfirmButton: false,
                  timer: 1500
                })
              });
          }
        })
      }
    }
  }

  resetearImagen(usuario: Usuario) {

    if (usuario.id === this.usuarioServices.id) {
      return Swal.fire('No puede resetear imagen de perfil de este usuario');
    }

    Swal.fire({
      title: 'Resetear foto de perfil',
      text: "Desea resetear la imagen de perfil de: " + usuario.persona.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        this.persona = usuario.persona;
        this.persona.img = '';
        this.personaService.actualizar(this.persona.id!, this.persona)
          .subscribe(({ ok, msg }) => {
            this.listarUsuarios();
            if (ok) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 2500
              })
            }
          }, (error) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error.error.msg,
              showConfirmButton: false,
              timer: 2500
            })
          });

      }
    });
    return true;
  }

  resetearPassword(usuario: Usuario) {
    this.passForm.controls['id'].setValue(usuario.id);
  }

  actualizarPassword() {
    this.formSubmitted2 = true;
    if (this.contrasenasNoValidas()) {
      this.passForm.controls['password2'].setErrors({ NoEsIgual: true });
    }

    if (this.passForm.valid) {

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
          this.closebutton2.nativeElement.click();
          this.usuarioServices.resetearPassword(this.passForm.get('id')?.value, this.passForm.value)
            .subscribe(({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 2500
                })
              }
            }, (error) => {
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

  contrasenasNoValidas() {
    const pass1 = this.passForm.get('password')?.value;
    const pass2 = this.passForm.get('password2')?.value;
    if ((pass1 !== pass2) && this.formSubmitted2) {
      return true;
    } else {
      return false;
    }
  }


  guardarUsuario() {

  }

  cambiarSituacion(usuario:Usuario){
    let accion: boolean;
    if(usuario.habilitado){
      accion= false;
    }else{
      accion= true;
    }
    let obj={
      accion: accion
    };
   this.usuarioServices.bloquearUsuario(usuario.id!,obj)
   .subscribe({
     next: ({ok})=>{
       if(ok){
         this.listarUsuarios();
       }
     },
     error: (error)=>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "Se produjo un error. Hable con el administrador",
        showConfirmButton: false,
        timer: 2500
      })
     }
   })


  }

}
