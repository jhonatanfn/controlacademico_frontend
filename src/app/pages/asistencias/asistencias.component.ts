import { Component, OnInit } from '@angular/core';
import { Aula } from 'src/app/models/aula.model';
import { AulaService } from 'src/app/services/aula.service';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.css']
})
export class AsistenciasComponent implements OnInit {

  public aulas: Aula[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Asistencias';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private aulaService: AulaService) {
  }

  ngOnInit(): void {
    this.listarAulas();
  }

  listarAulas() {
    this.cargando = true;
    this.aulaService.listar(this.desde).subscribe({
      next: ({ ok, aulas, total }) => {
        if (ok) {
          this.aulas = aulas;
          this.totalRegistros = total;
          this.numeropaginas = Math.ceil(this.totalRegistros / 5);
          this.cargando = false;
          this.controlBotonesPaginacion();
        }
      }
    });
  }
  controlBotonesPaginacion() {
    if (this.aulas.length !== 5) {
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
  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarAulas();
  }

  buscarAula(termino:string){
    if(termino.length==0){
      this.listarAulas();
    }else{
      this.aulaService.buscarPorNombre(termino)
      .subscribe((resp:Aula[])=>{
        this.aulas=resp;
        this.totalRegistros=resp.length;
        this.cargando= false;
        this.controlBotonesPaginacion();
      });
    }
  }
}
