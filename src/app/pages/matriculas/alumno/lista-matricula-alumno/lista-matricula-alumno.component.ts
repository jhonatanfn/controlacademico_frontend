import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Periodo } from 'src/app/models/periodo.model';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-matricula-alumno',
  templateUrl: './lista-matricula-alumno.component.html',
  styleUrls: ['./lista-matricula-alumno.component.css']
})
export class ListaMatriculaAlumnoComponent implements OnInit {

  public matriculadetalles: Matriculadetalle[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Matriculas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public alumno!: Alumno;
  public periodoseleccionado: any = "";
  public periodos: Periodo[] = [];

  constructor(
    private matriculadetalleService: MatriculadetalleService,
    private usuarioService: UsuarioService,
    private periodoService: PeriodoService) {

    this.periodoService.todo().subscribe({
      next: ({ ok, periodos }) => {
        if (ok) {
          this.periodos = periodos;
        }
      }
    });

  }

  ngOnInit(): void {
    this.usuarioService.alumnoPorPersona().subscribe(({ ok, alumno }) => {
      if (ok) {
        this.alumno = alumno;
        this.listarMatriculas();
      }
    });
  }

  controlBotonesPaginacion() {
    if (this.matriculadetalles.length !== 5) {
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

  listarMatriculas() {
    this.cargando = true;
    this.matriculadetalles=[];

    if(this.periodoseleccionado){

      this.matriculadetalleService.matriculadetallesPorAlumnoPeriodo(Number(this.alumno.id),
      Number(this.periodoseleccionado), this.desde)
        .subscribe(({ matriculadetalles, total }) => {
            this.matriculadetalles = matriculadetalles;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
        });

    }else{
      this.matriculadetalleService.matriculadetallesPorAlumno(Number(this.alumno.id), this.desde)
        .subscribe(({ matriculadetalles, total }) => {
          this.matriculadetalles = matriculadetalles;
          this.totalRegistros = total;
          this.numeropaginas = Math.ceil(this.totalRegistros / 5);
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
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarMatriculas();
  }

  buscarMatriculas(termino: string) {
    if(this.periodoseleccionado){
      if (termino.length == 0) {
        this.listarMatriculas();
      } else {
        this.matriculadetalleService.buscarMatriculadetallesPorAlumnoPeriodo(termino, Number(this.alumno.id),
        Number(this.periodoseleccionado))
          .subscribe({
            next: (resp: Matriculadetalle[]) => {
              this.matriculadetalles = resp;
              this.totalRegistros = resp.length;
              this.controlBotonesPaginacion();
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Se produjo un error. Hable con el administrador",
                showConfirmButton: false,
                timer: 1000
              });
            }
          });
      }
    }else{
      if (termino.length == 0) {
        this.listarMatriculas();
      } else {
        this.matriculadetalleService.buscarMatriculadetallesPorAlumno(termino, Number(this.alumno.id))
          .subscribe({
            next: (resp: Matriculadetalle[]) => {
              this.matriculadetalles = resp;
              this.totalRegistros = resp.length;
              this.controlBotonesPaginacion();
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Se produjo un error. Hable con el administrador",
                showConfirmButton: false,
                timer: 1000
              });
            }
          });
      }
    }
  }

}
