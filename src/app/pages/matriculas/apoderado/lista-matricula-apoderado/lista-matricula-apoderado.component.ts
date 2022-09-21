import { Component, OnInit } from '@angular/core';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Padre } from 'src/app/models/padre.model';
import { Periodo } from 'src/app/models/periodo.model';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-matricula-apoderado',
  templateUrl: './lista-matricula-apoderado.component.html',
  styleUrls: ['./lista-matricula-apoderado.component.css']
})
export class ListaMatriculaApoderadoComponent implements OnInit {

  public matriculadetalles: Matriculadetalle[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Matriculas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public padre!: Padre;
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
    this.usuarioService.padrePorPersona().subscribe(({ ok, padre }) => {
      if (ok) {
        this.padre = padre;
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
    if (this.periodoseleccionado) {
      this.matriculadetalleService.matriculadetallesAlumnoPorPadrePeriodo(Number(this.padre.id),
        Number(this.periodoseleccionado), this.desde)
        .subscribe(({ matriculadetalles, total }) => {
          this.matriculadetalles = matriculadetalles;
          this.totalRegistros = total;
          this.numeropaginas = Math.ceil(this.totalRegistros / 5);
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    } else {
      this.matriculadetalleService.matriculadetallesAlumnoPorPadre(Number(this.padre.id), this.desde)
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

    if (this.periodoseleccionado) {
      if (termino.length == 0) {
        this.listarMatriculas();
      } else {
        this.matriculadetalleService.buscarMatriculadetallesPadrePorAlumnoPeriodo(termino,
          Number(this.padre.id), Number(this.periodoseleccionado))
          .subscribe({
            next: (resp: Matriculadetalle[]) => {
              this.matriculadetalles = resp;
              this.totalRegistros = resp.length;
              this.cargando = false;
              this.controlBotonesPaginacion();
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Se produjo un error. Hable con el administrador",
                showConfirmButton: false,
                timer: 1000
              });
            }
          });
      }
    } else {
      if (termino.length == 0) {
        this.listarMatriculas();
      } else {
        this.matriculadetalleService.buscarMatriculadetallesPadrePorAlumno(termino, Number(this.padre.id))
          .subscribe({
            next: (resp: Matriculadetalle[]) => {
              this.matriculadetalles = resp;
              this.totalRegistros = resp.length;
              this.cargando = false;
              this.controlBotonesPaginacion();
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
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
