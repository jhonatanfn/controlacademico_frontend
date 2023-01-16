import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nivel } from 'src/app/models/nivel.model';
import { NivelService } from 'src/app/services/nivel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-niveles',
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css']
})
export class NivelesComponent implements OnInit {

  public niveles: Nivel[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Niveles';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;

  public nivelForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public titulonivel: string = "";
  public nombrerepetido: boolean = false;

  @ViewChild('closebutton') closebutton: any;

  constructor(private nivelService: NivelService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.listarNiveles();
    this.nivelForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  campoRequerido(campo: string) {
    if (this.nivelForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.nivelForm.get(campo)?.value === "") {
      return;
    }
    if ((this.nivelForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  controlBotonesPaginacion() {
    if (this.niveles.length !== 5) {
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

  listarNiveles() {
    this.cargando = true;
    this.nivelService.listar(this.desde)
      .subscribe(({ niveles, total }) => {
        this.niveles = niveles;
        this.totalRegistros = total;
        this.numeropaginas = Math.ceil(this.totalRegistros / 5);
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
    this.listarNiveles();
  }
  crearNivel() {
    this.formSubmitted = false;
    this.nivelForm.controls['nombre'].setValue('');
    this.nivelForm.controls['id'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.titulonivel = "Nuevo Nivel";
    this.nombrerepetido = false;
  }

  guardarNivel() {
    this.formSubmitted = true;
    this.nombrerepetido = false;
    if (this.nivelForm.valid) {
      if (this.isSave) {
        this.nivelService.existeNombreNivel((this.nivelForm.get('nombre')?.value).trim()).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.nombrerepetido = true;
            } else {
              Swal.fire({
                title: 'Guardar',
                text: "¿Desea crear el nivel?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar'
              }).then((result) => {
                if (result.isConfirmed) {

                  this.nivelService.crear(this.nivelForm.value)
                    .subscribe({
                      next: ({ ok, msg }) => {
                        if (ok) {
                          this.closebutton.nativeElement.click();
                          this.listarNiveles();
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

        this.nivelService.existeNombreNivelEditar(this.nivelForm.get('id')?.value,
          (this.nivelForm.get('nombre')?.value).trim()).subscribe({
            next: ({ ok }) => {
              if (ok) {
                this.nombrerepetido = true;
              } else {

                Swal.fire({
                  title: 'Actualizar',
                  text: "¿Desea actualizar el nivel?",
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cancelar',
                  confirmButtonText: 'Actualizar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.nivelService.actualizar(this.nivelForm.get('id')?.value, this.nivelForm.value)
                      .subscribe({
                        next: ({ ok, msg }) => {
                          if (ok) {
                            this.closebutton.nativeElement.click();
                            this.listarNiveles();
                            Swal.fire({
                              position: 'top-end',
                              icon: 'success',
                              title: msg,
                              showConfirmButton: false,
                              timer: 1000
                            })
                          }
                        }
                      });
                  }
                });
              }
            }
          });
      }
    }
  }

  eliminarNivel(nivel: Nivel) {

    this.nivelService.tieneAulas(nivel.id!)
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
              title: 'Borrar Nivel',
              text: "Desea borrar a: " + nivel.nombre,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Borrar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.nivelService.borrar(nivel.id!)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.listarNiveles();
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

  editarNivel(nivel: Nivel) {
    this.nivelForm.controls['id'].setValue(nivel.id);
    this.nivelForm.controls['nombre'].setValue(nivel.nombre.toUpperCase());
    this.boton = "Actualizar";
    this.isSave = false;
    this.titulonivel = "Editar Nivel";
    this.nombrerepetido= false;
  }

  buscarNivel(termino: string) {
    if (termino.length == 0) {
      this.listarNiveles();
    } else {
      this.nivelService.buscarPorNombre(termino)
        .subscribe((resp: Nivel[]) => {
          this.niveles = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }


}
