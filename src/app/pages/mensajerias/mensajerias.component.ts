import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Mensajeria } from 'src/app/models/mensajeria.model';
import { Usuario } from 'src/app/models/usuario.model';
import { MensajeriaService } from 'src/app/services/mensajeria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajerias',
  templateUrl: './mensajerias.component.html',
  styleUrls: ['./mensajerias.component.css']
})
export class MensajeriasComponent implements OnInit {

  public recibido: boolean = false;
  public enviado: boolean = false;
  public eliminado: boolean = false;
  public cargando: boolean = true;
  public activo1: string = "";
  public activo2: string = "";
  public activo3: string = "";
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public mensajerias: any[] = [];
  public usuario!: Usuario;
  public estaleido: string = "";
  public estaleidoicono: string = "bi bi-envelope-paper";
  public resaltado: string = "";
  public botoncito: boolean = false;
  public imagenMensaje: string = "";
  public personaMensaje: string = "";
  public mensajeriaForm!: FormGroup;
  public formSubmitted: boolean = false;
  @ViewChild('closebutton') closebutton: any;

  public mensaje: any = {
    id: 0,
    emisor: "",
    fecha: "",
    hora: "",
    contenido: "",
    asunto: "",
    receptor: "",
    lemisor: false,
    lreceptor: false
  };
  selectedUsuario!: any;
  deleteUsuario!:any;
  public usuarios: Usuario[] = [];
  public emails: any[] = [];
  public emailsAux: any[] = [];

  constructor(private mensajeriaService: MensajeriaService, private usuarioService: UsuarioService,
    private fb: FormBuilder) {
    this.activo1 = "active";
    this.titulo = "Recibidos";
    this.icono = "bi bi-envelope-check";
    this.estaleido = "Marcar leido";
    this.resaltado = "";
    this.usuarioService.todo().subscribe({
      next: ({ ok, usuarios }) => {
        if (ok) {
          this.usuarios = usuarios;
        }
      }
    });
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.listarMensajes();
    this.mensajeriaForm = this.fb.group({
      asunto: ['', [Validators.required, Validators.maxLength(20)]],
      contenido: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  campoRequerido(campo: string) {
    if (this.mensajeriaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.mensajeriaForm.get(campo)?.value === "") {
      return;
    }
    if ((this.mensajeriaForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }


  usuarioSeleccionado() {
    if (this.selectedUsuario) {
      let objeto = {
        id: this.selectedUsuario[0],
        email: this.selectedUsuario[1]
      }
      if (!this.isRepetido(Number(this.selectedUsuario[0]))) {
        this.emails.push(objeto);
      }
    }
  }

  isRepetido(id: number) {
    let resultado = false;
    this.emails.forEach(item => {
      if (item.id == id) {
        resultado = true;
      }
    });
    return resultado;
  }

  eliminarItem(item: any) {
    this.emailsAux = [];
    this.emailsAux = this.emails;
    this.emails = [];
    this.emailsAux.forEach(elemento => {
      if (elemento.id !== item.id) {
        this.emails.push(elemento);
      }
    });
  }

  deleteSeleccionado(){
    console.log(this.deleteUsuario);
  }

  iniciarMensaje(){
    this.emails=[];
    this.mensajeriaForm.get('asunto')?.setValue("");
    this.mensajeriaForm.get('contenido')?.setValue("");
    this.selectedUsuario="";
    this.formSubmitted= false;
  }

  activar(val: string) {
    if (val == "rec") {
      this.activo1 = "active";
      this.activo2 = "";
      this.activo3 = "";
      this.titulo = "Recibidos";
      this.icono = "bi bi-envelope-check";
    }
    if (val == "env") {
      this.activo1 = "";
      this.activo2 = "active";
      this.activo3 = "";
      this.titulo = "Enviados";
      this.icono = "bi bi-send";
    }
    if (val == "elim") {
      this.activo1 = "";
      this.activo2 = "";
      this.activo3 = "active";
      this.titulo = "Eliminados";
      this.icono = "bi bi-trash";
    }
    this.listarMensajes();
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarMensajes();
  }

  controlBotonesPaginacion() {
    if (this.mensajerias.length !== 10) {
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

  listarMensajes() {
    let data = {
      email: this.usuarioService.usuario.email
    };
    this.mensajerias = [];
    this.cargando = true;
    if (this.titulo == "Recibidos") {
      this.mensajeriaService.listarRecibidos(this.desde, data).subscribe({
        next: ({ ok, mensajerias }) => {
          if (ok) {
            this.mensajerias = mensajerias;
            this.botoncito = true;
            this.cargando = false;
          }
        }
      });
    }
    if (this.titulo == "Enviados") {
      this.mensajeriaService.listarEnviados(this.desde, data).subscribe({
        next: ({ ok, mensajerias }) => {
          if (ok) {
            this.mensajerias = mensajerias;
            this.botoncito = true;
            this.cargando = false;
          }
        }
      });
    }
    if (this.titulo == "Eliminados") {
      this.mensajeriaService.listarEliminados(this.desde, data).subscribe({
        next: ({ ok, mensajerias }) => {
          if (ok) {
            this.mensajerias = mensajerias;
            this.botoncito = false;
            this.cargando = false;
          }
        }
      });
    }

  }

  verMensaje(mensaje: Mensajeria) {
    this.mensaje.emisor = mensaje.emisor;
    this.mensaje.fecha = mensaje.fecha;
    this.mensaje.hora = mensaje.hora;
    this.mensaje.contenido = mensaje.contenido;
    this.mensaje.asunto = mensaje.asunto;
    this.mensaje.receptor = mensaje.receptor;
    this.imagenMensaje = "";
    this.personaMensaje = "";

    if (this.titulo == "Recibidos" || this.titulo == "Eliminados") {
      this.usuarioService.usuarioPorEmail({ email: this.mensaje.emisor }).subscribe({
        next: ({ ok, usuario }) => {
          if (ok) {
            this.imagenMensaje = usuario.persona.img!;
            this.personaMensaje = usuario.persona.nombres + ' ' + usuario.persona.apellidopaterno + ' ' + usuario.persona.apellidomaterno;
          }
        }
      })
    } else {
      this.imagenMensaje = this.usuario.persona.img!;
      this.personaMensaje = this.usuario.persona.nombres + ' ' + this.usuario.persona.apellidopaterno + ' ' + this.usuario.persona.apellidomaterno;
    }

  }

  NoLeido(mensaje: Mensajeria) {

    this.mensaje.id = mensaje.id;
    this.mensaje.lemisor = mensaje.lemisor;
    this.mensaje.lreceptor = mensaje.lreceptor;

    if (this.titulo == "Recibidos") {
      let data = {
        receptor: mensaje.receptor
      };
      if (this.mensaje.lreceptor) {
        this.mensajeriaService.marcarNoLeidoReceptor(Number(mensaje.id!), data).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.estaleido = "Marcar leido";
              this.listarMensajes();
            }
          }
        });
      } else {
        this.mensajeriaService.marcarLeidoReceptor(Number(mensaje.id!), data).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.estaleido = "Marcar no leido";
              this.listarMensajes();
            }
          }
        });
      }
    }

    if (this.titulo == "Enviados") {
      let data = {
        emisor: mensaje.emisor
      };
      if (this.mensaje.lemisor) {
        this.mensajeriaService.marcarNoLeidoEmisor(Number(mensaje.id!), data).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.estaleido = "Marcar leido";
              this.listarMensajes();
            }
          }
        });
      } else {
        this.mensajeriaService.marcarLeidoEmisor(Number(mensaje.id!), data).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.estaleido = "Marcar no leido";
              this.listarMensajes();
            }
          }
        });
      }
    }
  }

  eliminarMensaje(mensaje: Mensajeria) {
    this.mensaje.id = mensaje.id;

    Swal.fire({
      title: 'Borrar Mensaje',
      text: "Desea borrar el mensaje: " + mensaje.asunto,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {

        if (this.titulo == "Recibidos") {
          let data = {
            receptor: mensaje.receptor
          }
          this.mensajeriaService.borrarReceptor(Number(this.mensaje.id), data)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.listarMensajes();
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              }
            });
        }

        if (this.titulo == "Enviados") {
          let data = {
            emisor: mensaje.emisor
          }
          this.mensajeriaService.borrarEmisor(Number(this.mensaje.id), data)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.listarMensajes();
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              }
            });
        }
      }
    });
  }

  restaurar(mensaje: Mensajeria) {

    Swal.fire({
      title: 'Restaurar Mensaje',
      text: "Desea restaurar el mensaje: " + mensaje.asunto,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Restaurar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (mensaje.emisor == this.usuario.email) {
          this.mensajeriaService.restaurarEmisor(Number(mensaje.id)).subscribe({
            next: ({ ok }) => {
              if (ok) {
                this.listarMensajes();
              }
            }
          });
        }
        if (mensaje.receptor == this.usuario.email) {
          this.mensajeriaService.restaurarReceptor(Number(mensaje.id)).subscribe({
            next: ({ ok }) => {
              if (ok) {
                this.listarMensajes();
              }
            }
          });
        }
      }
    });
  }

  buscarMensajes(termino: string) {
    if (termino.length == 0) {
      this.listarMensajes();
    } else {
      if (this.titulo == "Recibidos") {
        // filtrado de mensajes cuyo receptor sea el usuario en sesion.
        this.mensajeriaService.busquedaRecibidos(termino, this.usuario.email).subscribe({
          next: (resp: Mensajeria[]) => {
            this.mensajerias = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 10);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        });
      }
      if (this.titulo == "Enviados") {
        // filtrado de mensajes cuyo emisor sea en usuario en sesion.
        this.mensajeriaService.busquedaEnviados(termino, this.usuario.email).subscribe({
          next: (resp: Mensajeria[]) => {
            this.mensajerias = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 10);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        });
      }
      if (this.titulo == "Eliminados") {
        // filtrade de mensajes cuyo emisor o receptor es el usuario de sesion.
        this.mensajeriaService.busquedaEliminados(termino, this.usuario.email).subscribe({
          next: (resp: Mensajeria[]) => {
            this.mensajerias = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 10);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        });
      }
    }
  }


  enviarMensaje() {
    this.formSubmitted = true;
    if(this.emails.length>0){

      if (this.mensajeriaForm.valid) {
        Swal.fire({
          title: 'Enviar Mensaje',
          text: "Desea enviar el mensaje",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Enviar'
        }).then((result) => {
          if (result.isConfirmed) {
  
            this.emails.forEach(elemento => {
              let mensaje: Mensajeria = {
                emisor: this.usuario.email,
                receptor: elemento.email,
                asunto: this.mensajeriaForm.get('asunto')?.value,
                contenido: this.mensajeriaForm.get('contenido')?.value,
                fecha: moment().format('YYYY-MM-DD'),
                hora: moment().format('LTS'),
                xemisor: false,
                xreceptor: false,
                lemisor: false,
                lreceptor: false,
              };
              this.mensajeriaService.crear(mensaje).subscribe({
                next: ({ok})=>{
                }
              });
            });
            this.listarMensajes();
            this.closebutton.nativeElement.click();
          }
        });
      }
    }
  }
}
