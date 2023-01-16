import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seccion } from 'src/app/models/seccion.model';
import { SeccionService } from 'src/app/services/seccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css']
})
export class SeccionesComponent implements OnInit {

  public secciones: Seccion[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Secciones';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public seccionForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public tituloseccion: string = "";
  public nombrerepetido: boolean = false;

  @ViewChild('closebutton') closebutton: any;

  constructor(
    private seccionService: SeccionService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.listarSecciones();
    this.seccionForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  campoRequerido(campo: string) {
    if (this.seccionForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.seccionForm.get(campo)?.value === "") {
      return;
    }
    if ((this.seccionForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  controlBotonesPaginacion() {
    if (this.secciones.length !== 5) {
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

  listarSecciones() {
    this.cargando = true;
    this.seccionService.listar(this.desde)
      .subscribe(({ secciones, total }) => {
        this.secciones = secciones;
        this.totalRegistros = total;
        this.cargando = false;
        this.controlBotonesPaginacion();
      });
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
    this.listarSecciones();
  }

  crearSeccion() {
    this.formSubmitted = false;
    this.seccionForm.controls['nombre'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.tituloseccion = "Crear Sección";
    this.nombrerepetido = false;
  }

  guardarSeccion() {

    this.formSubmitted = true;
    this.nombrerepetido = false;
    if (this.seccionForm.valid) {
      if (this.isSave) {
        this.seccionService.existeNombreSeccion((this.seccionForm.get('nombre')?.value).trim()).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.nombrerepetido = true;
            } else {
              Swal.fire({
                title: 'Guardar',
                text: "¿Desea crear la seccion?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.seccionService.crear(this.seccionForm.value)
                    .subscribe({
                      next: ({ ok, msg }) => {
                        if (ok) {
                          this.closebutton.nativeElement.click();
                          this.listarSecciones();
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: msg,
                            showConfirmButton: false,
                            timer: 1000
                          });
                        }
                      }
                    });
                }
              });
            }
          }
        });

      } else {

        this.seccionService.existeNombreSeccionEditar(this.seccionForm.get('id')?.value,
          (this.seccionForm.get('nombre')?.value).trim()).subscribe({
            next: ({ ok }) => {
              if (ok) {
                this.nombrerepetido = true;
              } else {
                Swal.fire({
                  title: 'Guardar',
                  text: "¿Desea actualizar la seccion?",
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cancelar',
                  confirmButtonText: 'Actualizar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.seccionService.actualizar(this.seccionForm.get('id')?.value, this.seccionForm.value)
                      .subscribe({
                        next: ({ ok, msg }) => {
                          if (ok) {
                            this.closebutton.nativeElement.click();
                            this.listarSecciones();
                            Swal.fire({
                              position: 'top-end',
                              icon: 'success',
                              title: msg,
                              showConfirmButton: false,
                              timer: 1000
                            });
                          }
                        }
                      });
                  }
                });
              }
            }
          })
      }
    }
  }

  eliminarSeccion(seccion: Seccion) {

    this.seccionService.tieneAulas(seccion.id!)
      .subscribe({
        next: ({ ok, msg }) => {
          if (ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: msg,
              showConfirmButton: false,
              timer: 1000
            })
          } else {
            Swal.fire({
              title: 'Borrar Seccion',
              text: "Desea borrar a: " + seccion.nombre,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Borrar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.seccionService.borrar(seccion.id!)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.listarSecciones();
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: false,
                        timer: 1000
                      })
                    }
                  })
              }
            })
          }
        }
      })
  }

  editarSeccion(seccion: Seccion) {
    this.seccionForm.controls['id'].setValue(seccion.id);
    this.seccionForm.controls['nombre'].setValue(seccion.nombre.toUpperCase());
    this.boton = "Actualizar";
    this.isSave = false;
    this.tituloseccion = "Editar Sección";
    this.nombrerepetido = false;
  }

  buscarSeccion(termino: string) {
    if (termino.length == 0) {
      this.listarSecciones();
    } else {
      this.seccionService.buscarPorNombre(termino)
        .subscribe((resp: Seccion[]) => {
          this.secciones = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

}
