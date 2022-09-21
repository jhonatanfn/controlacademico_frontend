import { Component, OnInit } from '@angular/core';
import { Aula } from 'src/app/models/aula.model';
import { Docente } from 'src/app/models/docente.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-asistencia-docente',
  templateUrl: './lista-asistencia-docente.component.html',
  styleUrls: ['./lista-asistencia-docente.component.css']
})
export class ListaAsistenciaDocenteComponent implements OnInit {

  public programaciones: Programacion[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Asistencias';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public docente!: Docente;
  public periodoseleccionado: any = "";
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public aulasAux: Aula[] = [];

  constructor(
    private programacionService: ProgramacionService,
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
    this.usuarioService.docentePorPersona().subscribe(({ ok, docente }) => {
      if (ok) {
        this.docente = docente;
        this.listarProgramaciones();
      }
    });
  }

  controlBotonesPaginacion() {
    if (this.programaciones.length !== 5) {
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


  listarProgramaciones() {
    this.cargando = true;
    this.aulas = [];
    if (this.periodoseleccionado) {
      this.programacionService.programacionesPorDocentePeriodoPaginadoTodos(Number(this.docente.id),
        Number(this.periodoseleccionado))
        .subscribe({
          next: ({ programaciones }) => {
            if (programaciones.length > 0) {
              var lookupObject: any = {};
              programaciones.forEach(programacion => {
                this.aulasAux.push(programacion.aula!);
              });
              for (var i in this.aulasAux) {
                lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
              }
              for (i in lookupObject) {
                this.aulas.push(lookupObject[i]);
              }
            }
            this.cargando = false;
          }
        });
    } else {
      this.programacionService.programacionesPorDocenteTodos(Number(this.docente.id))
        .subscribe(({ programaciones }) => {
          if (programaciones.length > 0) {
            var lookupObject: any = {};
            programaciones.forEach(programacion => {
              this.aulasAux.push(programacion.aula!);
            });
            for (var i in this.aulasAux) {
              lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
            }
            for (i in lookupObject) {
              this.aulas.push(lookupObject[i]);
            }
          }
          this.cargando = false;
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
    this.listarProgramaciones();
  }

  buscarProgramaciones(nombre: string) {
    this.aulas = [];
    if (this.periodoseleccionado) {
      if (nombre.length == 0) {
        this.listarProgramaciones();
      } else {
        this.programacionService.buscarProgramacionesDocentePeriodo(nombre,
          Number(this.docente.id), Number(this.periodoseleccionado))
          .subscribe({
            next: (resp: Programacion[]) => {
              var lookupObject: any = {};
              resp.forEach(programacion => {
                this.aulasAux.push(programacion.aula!);
              });
              for (var i in this.aulasAux) {
                lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
              }
              for (i in lookupObject) {
                this.aulas.push(lookupObject[i]);
              }
              this.cargando = false;
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Se produjo un error. Hable con el administrador.',
                showConfirmButton: false,
                timer: 1000
              });
            }
          });
      }
    } else {
      if (nombre.length == 0) {
        this.listarProgramaciones();
      } else {
        this.programacionService.buscarProgramacionesDocente(nombre, Number(this.docente.id))
          .subscribe({
            next: (resp: Programacion[]) => {
              var lookupObject: any = {};
              resp.forEach(programacion => {
                this.aulasAux.push(programacion.aula!);
              });
              for (var i in this.aulasAux) {
                lookupObject[this.aulasAux[i].id!] = this.aulasAux[i];
              }
              for (i in lookupObject) {
                this.aulas.push(lookupObject[i]);
              }
              this.cargando = false;
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Se produjo un error. Hable con el administrador.',
                showConfirmButton: false,
                timer: 1000
              });
            }
          });
      }
    }
  }
}
