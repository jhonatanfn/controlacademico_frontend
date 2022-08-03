import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { MenuService } from 'src/app/services/menu.service';
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
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public docente!: Docente;

  public periodoseleccionado: any = "";
  public periodos: Periodo[] = [];

  constructor(private menuService: MenuService,
    private programacionService: ProgramacionService,
    private usuarioService: UsuarioService,
    private periodoService: PeriodoService) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

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

    if (this.periodoseleccionado) {
      this.programacionService.programacionesPorDocentePeriodoPaginado(Number(this.docente.id),
        Number(this.periodoseleccionado), Number(this.desde))
        .subscribe({
          next: ({ ok, programaciones, total }) => {
            if (ok) {
              this.programaciones = programaciones;
              this.totalRegistros = total;
              this.numeropaginas = Math.ceil(this.totalRegistros / 5);
              this.cargando = false;
              this.controlBotonesPaginacion();
            }
          }
        });
    } else {
      this.programacionService.programacionesPorDocente(Number(this.docente.id), Number(this.desde))
        .subscribe(({ programaciones, total }) => {
          this.programaciones = programaciones;
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
    this.listarProgramaciones();
  }

  buscarProgramaciones(nombre: string) {

    if (this.periodoseleccionado) {

      if (nombre.length == 0) {
        this.listarProgramaciones();
      } else {
        this.programacionService.buscarProgramacionesDocentePeriodo(nombre,
          Number(this.docente.id), Number(this.periodoseleccionado))
          .subscribe({
            next: (resp: Programacion[]) => {
              this.programaciones = resp;
              this.totalRegistros = resp.length;
              this.numeropaginas = Math.ceil(this.totalRegistros / 5);
              this.controlBotonesPaginacion();
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Se produjo un error. Hable con el administrador.',
                showConfirmButton: false,
                timer: 1000
              })
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
              this.programaciones = resp;
              this.totalRegistros = resp.length;
              this.numeropaginas = Math.ceil(this.totalRegistros / 5);
              this.controlBotonesPaginacion();
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Se produjo un error. Hable con el administrador.',
                showConfirmButton: false,
                timer: 1000
              })
            }
          });
      }
    }

  }

}
