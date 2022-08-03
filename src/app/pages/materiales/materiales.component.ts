import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { MenuService } from 'src/app/services/menu.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public cargando: boolean = true;
  public programaciones: Programacion[] = [];
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public docente!: Docente;
  public matriculas: Matricula[] = [];
  public periodoseleccionado: any = "";
  public periodos: Periodo[] = [];

  constructor(private menuService: MenuService,
    private programacionService: ProgramacionService,
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
    this.listarProgramaciones();
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

      this.programacionService.porPeriodoPaginado(Number(this.periodoseleccionado), this.desde)
        .subscribe(({ ok, programaciones, total }) => {
          if (ok) {
            this.programaciones = programaciones;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        });

    } else {
      this.programacionService.listar(this.desde)
        .subscribe(({ ok, programaciones, total }) => {
          if (ok) {
            this.programaciones = programaciones;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
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


  buscarMateriales(nombre: string) {

    if (this.periodoseleccionado) {

      if (nombre.length == 0) {
        this.listarProgramaciones();
      } else {
        this.programacionService.buscarProgramacionesPeriodo(nombre, Number(this.periodoseleccionado))
          .subscribe((resp: Programacion[]) => {
            this.programaciones = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.controlBotonesPaginacion();
          });
      }
    } else {
      if (nombre.length == 0) {
        this.listarProgramaciones();
      } else {
        this.programacionService.buscarProgramaciones(nombre)
          .subscribe((resp: Programacion[]) => {
            this.programaciones = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.controlBotonesPaginacion();
          });
      }
    }

  }
}
