import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apreciacion } from 'src/app/models/apreciacion.model';
import { Aula } from 'src/app/models/aula.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Periodo } from 'src/app/models/periodo.model';
import { ApreciacionService } from 'src/app/services/apreciacion.service';
import { AulaService } from 'src/app/services/aula.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apreciaciones',
  templateUrl: './apreciaciones.component.html',
  styleUrls: ['./apreciaciones.component.css']
})
export class ApreciacionesComponent implements OnInit {

  public apreciaciones: Apreciacion[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Apreciaciones';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public apreciacionForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public tituloapreciacion: string = "";
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebutton2') closebutton2: any;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public matriculadetalles: Matriculadetalle[] = [];

  constructor(private apreciacionService: ApreciacionService, private fb: FormBuilder,
    private periodoService: PeriodoService, private aulaService: AulaService,
    private matriculadetalleService: MatriculadetalleService) {

    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });
    this.aulaService.todo().subscribe({
      next: ({ ok, aulas }) => {
        if (ok) {
          this.aulas = aulas;
        }
      }
    });
  }

  ngOnInit(): void {
    this.listarApreciaciones();
    this.apreciacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      periodoId: ['', Validators.required],
      alumnoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      responsabilidad: [''],
      id: [''],
    });
  }

  cargarAlumnos() {
    if (this.apreciacionForm.get('periodoId')?.value && this.apreciacionForm.get('aulaId')?.value) {
      let arrPeriodos = (this.apreciacionForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.apreciacionForm.get('aulaId')?.value).split(',');
      this.matriculadetalleService.matriculadetallesPeriodoAula(arrPeriodos[0], arrAulas[0])
        .subscribe({
          next: ({ ok, matriculadetalles }) => {
            if (ok) {
              this.matriculadetalles = matriculadetalles;
              this.apreciacionForm.controls['alumnoId'].setValue("");
            }
          }
        });
    }
  }
  campoRequerido(campo: string) {
    if (this.apreciacionForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.apreciacionForm.get(campo)?.value === "") {
      return;
    }
    if ((this.apreciacionForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  controlBotonesPaginacion() {
    if (this.apreciaciones.length !== 5) {
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

  listarApreciaciones() {
    this.cargando = true;
    this.apreciacionService.listar(this.desde)
      .subscribe(({ apreciaciones, total }) => {
        this.apreciaciones = apreciaciones;
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
    this.listarApreciaciones();
  }
  crearApreciacion() {
    this.formSubmitted = false;
    this.apreciacionForm.controls['nombre'].setValue('');
    this.apreciacionForm.controls['descripcion'].setValue('');
    this.apreciacionForm.controls['id'].setValue('');
    this.apreciacionForm.controls['periodoId'].setValue('');
    this.apreciacionForm.controls['aulaId'].setValue('');
    this.apreciacionForm.controls['alumnoId'].setValue('');
    this.apreciacionForm.controls['responsabilidad'].setValue('');
  }

  guardarApreciacion() {
    this.formSubmitted = true;
    if (this.apreciacionForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear la apreciacion?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apreciacionService.crear(this.apreciacionForm.value)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.closebutton.nativeElement.click();
                  this.listarApreciaciones();
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
                  title: "Se produjo un error. Hable con el administrador",
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            });
        }
      });
    }
  }

  actualizarApreciacion() {
    this.formSubmitted = true;

    if (this.apreciacionForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar la apreciacion?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apreciacionService.actualizar(this.apreciacionForm.get('id')?.value, this.apreciacionForm.value)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.closebutton2.nativeElement.click();
                  this.listarApreciaciones();
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
                  title: "Se produjo un error. Hable con el administrador",
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            });
        }
      });
    }
  }

  eliminarApreciacion(apreciacion: Apreciacion) {

    Swal.fire({
      title: 'Borrar Apreciacion',
      text: "Desea borrar a: " + apreciacion.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apreciacionService.borrar(apreciacion.id!)
          .subscribe(({ ok, msg }) => {
            if (ok) {
              this.listarApreciaciones();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          });
      }
    });
  }

  editarApreciacion(apreciacion: Apreciacion) {
    this.apreciacionForm.controls['id'].setValue(apreciacion.id);
    this.apreciacionForm.controls['nombre'].setValue(apreciacion.nombre.toUpperCase());
    this.apreciacionForm.controls['descripcion'].setValue(apreciacion.descripcion.toUpperCase());
    this.apreciacionForm.controls['periodoId'].setValue(apreciacion.periodo?.id);
    this.apreciacionForm.controls['aulaId'].setValue(1);
    this.apreciacionForm.controls['alumnoId'].setValue(apreciacion.alumno?.id);
    this.apreciacionForm.controls['responsabilidad'].setValue(apreciacion.responsabilidad);
  }

  buscarApreciacion(termino: string) {
    if (termino.length == 0) {
      this.listarApreciaciones();
    } else {
      this.apreciacionService.buscar(termino)
        .subscribe((resp: Apreciacion[]) => {
          this.apreciaciones = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }
}
