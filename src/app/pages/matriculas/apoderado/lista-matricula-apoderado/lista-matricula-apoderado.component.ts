import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-matricula-apoderado',
  templateUrl: './lista-matricula-apoderado.component.html',
  styleUrls: ['./lista-matricula-apoderado.component.css']
})
export class ListaMatriculaApoderadoComponent implements OnInit {

  public matriculas: Matricula[] = [];
  public cargando: boolean = true;
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public apoderado!: Apoderado;

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
    this.usuarioService.apoderadoPorPersona().subscribe(({ ok, apoderado }) => {
      if (ok) {
        this.apoderado = apoderado;
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
      this.matriculaService.matriculasAlumnoPorApoderadoPeriodo(Number(this.apoderado.id),
      Number(this.periodoseleccionado), this.desde)
      .subscribe(({ matriculas, total }) => {
        this.matriculas = matriculas;
        this.totalRegistros = total;
        this.numeropaginas = Math.ceil(this.totalRegistros / 5);
        this.cargando = false;
        this.controlBotonesPaginacion();
      });
    }else{
      this.matriculaService.matriculasAlumnoPorApoderado(Number(this.apoderado.id), this.desde)
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
        this.matriculaService.buscarMatriculasApoderadoPorAlumnoPeriodo(termino, 
        Number(this.apoderado.id), Number(this.periodoseleccionado))
          .subscribe({
            next: (resp: Matricula[]) => {
              this.matriculas = resp;
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

    }else{

      if (termino.length == 0) {
        this.listarMatriculas();
      } else {
        this.matriculaService.buscarMatriculasApoderadoPorAlumno(termino, Number(this.apoderado.id))
          .subscribe({
            next: (resp: Matricula[]) => {
              this.matriculas = resp;
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
