import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-matricula-alumno',
  templateUrl: './lista-matricula-alumno.component.html',
  styleUrls: ['./lista-matricula-alumno.component.css']
})
export class ListaMatriculaAlumnoComponent implements OnInit {

  public matriculas: Matricula[] = [];
  public cargando: boolean = true;
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public alumno!: Alumno;

  public periodoseleccionado: any = "";
  public periodos: Periodo[] = [];

  constructor(private menuService: MenuService,
    private matriculaService: MatriculaService,
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
    this.usuarioService.alumnoPorPersona().subscribe(({ ok, alumno }) => {
      if (ok) {
        this.alumno = alumno;
        this.listarMatriculas();
      }
    });
  }

  controlBotonesPaginacion() {
    if (this.matriculas.length !== 5) {
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

    if(this.periodoseleccionado){

      this.matriculaService.matriculasPorAlumnoPeriodo(Number(this.alumno.id),
      Number(this.periodoseleccionado), this.desde)
        .subscribe(({ matriculas, total }) => {
          this.matriculas = matriculas;
          this.totalRegistros = total;
          this.numeropaginas = Math.ceil(this.totalRegistros / 5);
          this.cargando = false;
          this.controlBotonesPaginacion();
        });

    }else{
      this.matriculaService.matriculasPorAlumno(Number(this.alumno.id), this.desde)
        .subscribe(({ matriculas, total }) => {
          this.matriculas = matriculas;
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
        this.matriculaService.buscarMatriculasPorAlumnoPeriodo(termino, Number(this.alumno.id),
        Number(this.periodoseleccionado))
          .subscribe({
            next: (resp: Matricula[]) => {
              this.matriculas = resp;
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
        this.matriculaService.buscarMatriculasPorAlumno(termino, Number(this.alumno.id))
          .subscribe({
            next: (resp: Matricula[]) => {
              this.matriculas = resp;
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
