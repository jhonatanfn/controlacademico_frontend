import { Component, OnInit } from '@angular/core';
import { Madre } from 'src/app/models/madre.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Periodo } from 'src/app/models/periodo.model';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-matricula-madre',
  templateUrl: './lista-matricula-madre.component.html',
  styleUrls: ['./lista-matricula-madre.component.css']
})
export class ListaMatriculaMadreComponent implements OnInit {

  public matriculadetalles: Matriculadetalle[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Matriculas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public madre!: Madre;
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
    this.usuarioService.madrePorPersona().subscribe(({ ok, madre }) => {
      if (ok) {
        this.madre = madre;
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
      this.matriculadetalleService.matriculadetallesAlumnoPorMadrePeriodo(Number(this.madre.id),
        Number(this.periodoseleccionado), this.desde)
        .subscribe(({ matriculadetalles, total }) => {
          this.matriculadetalles = matriculadetalles;
          this.totalRegistros = total;
          this.numeropaginas = Math.ceil(this.totalRegistros / 5);
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    } else {
      this.matriculadetalleService.matriculadetallesAlumnoPorMadre(Number(this.madre.id), this.desde)
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
        this.matriculadetalleService.buscarMatriculadetallesMadrePorAlumnoPeriodo(termino,
          Number(this.madre.id), Number(this.periodoseleccionado))
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
        this.matriculadetalleService.buscarMatriculadetallesMadrePorAlumno(termino, Number(this.madre.id))
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
