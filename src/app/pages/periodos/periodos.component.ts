import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nivel } from 'src/app/models/nivel.model';
import { Periodo } from 'src/app/models/periodo.model';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})
export class PeriodosComponent implements OnInit {

  public periodos: Periodo[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Periodos';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public periodoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public tituloperiodo: string = "";
  @ViewChild('closebutton') closebutton: any;

  constructor(private periodoService: PeriodoService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.listarPeriodos();
    this.periodoForm = this.fb.group({
      periodoId: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  campoRequerido(campo: string) {
    if (this.periodoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.periodoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.periodoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  controlBotonesPaginacion() {
    if (this.periodos.length !== 5) {
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

  listarPeriodos() {
    this.cargando = true;
    this.periodoService.listar(this.desde)
      .subscribe(({ periodos, total }) => {
        this.periodos = periodos;
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
    this.listarPeriodos();
  }
  crearPeriodo() {
    this.formSubmitted = false;
    this.periodoForm.controls['nombre'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.tituloperiodo = "Nuevo Periodo";
  }

  guardarPeriodo() {
    this.formSubmitted = true;
    if (this.periodoForm.valid) {
      if (this.isSave) {
        this.periodoService.crear(this.periodoForm.value)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.closebutton.nativeElement.click();
                this.listarPeriodos();
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.error.msg,
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
      } else {
        this.periodoService.actualizar(this.periodoForm.get('periodoId')?.value, this.periodoForm.value)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.closebutton.nativeElement.click();
                this.listarPeriodos();
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 1000
                });
              }
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.error.msg,
                showConfirmButton: false,
                timer: 1000
              });
            }
          });
      }
    }
  }

  eliminarPeriodo(periodo: Periodo) {

    this.periodoService.tieneProgramaciones(periodo.id!)
      .subscribe({
        next: ({ ok, msg }) => {
          if (ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: msg,
              showConfirmButton: false,
              timer: 1000
            });
          } else {
            Swal.fire({
              title: 'Borrar Periodo',
              text: "Desea borrar a: " + periodo.nombre,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Borrar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.periodoService.borrar(periodo.id!)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.listarPeriodos();
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

  editarPeriodo(periodo: Periodo) {
    this.periodoForm.controls['periodoId'].setValue(periodo.id);
    this.periodoForm.controls['nombre'].setValue(periodo.nombre.toUpperCase());
    this.boton = "Actualizar";
    this.isSave = false;
    this.tituloperiodo = "Editar Periodo";
  }

  buscarPeriodo(termino: string) {
    if (termino.length == 0) {
      this.listarPeriodos();
    } else {
      this.periodoService.buscarPorNombre(termino)
        .subscribe((resp: Nivel[]) => {
          this.periodos = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }
}
