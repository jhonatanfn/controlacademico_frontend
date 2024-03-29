import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {

  public programaciones: Programacion[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Notas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;

  public periodoseleccionado:any="";
  public periodos:Periodo[]=[];

  constructor(
    private programacionService: ProgramacionService,private periodoService:PeriodoService) {

      this.periodoService.todo().subscribe({
        next: ({ok,periodos})=>{
          if(ok){
            this.periodos=periodos;
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

    if(this.periodoseleccionado){
      this.programacionService.porPeriodoPaginado(Number(this.periodoseleccionado),this.desde)
      .subscribe({
        next: ({programaciones, total})=>{
          this.programaciones=programaciones;
          this.totalRegistros=total;
          this.numeropaginas= Math.ceil(this.totalRegistros/5);
          this.cargando= false;
          this.controlBotonesPaginacion();
        }
      });
    }else{
      this.programacionService.listar(this.desde)
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

  buscarNotas(nombre: string) {
    
    if (nombre.length == 0) {
      this.listarProgramaciones();
    } else {
      this.programacionService.busqueda(nombre).subscribe((resp: Programacion[]) => {
        this.programaciones = resp;
        this.totalRegistros = resp.length;
        this.numeropaginas = Math.ceil(this.totalRegistros / 5);
        this.cargando = false;
        this.controlBotonesPaginacion();
      });
    }
  }
}
